# 在 uni-app 中集成 HarmonyOS 推送

## 功能说明

uni-app 原生应用可通过 `easemob-push` 0.2.0 及以上版本的 UTS 插件接入 HarmonyOS NEXT 的 Push Kit，获取推送 Token、申请通知权限并处理通知点击。用户离线时，环信服务端通过 Push Kit 向设备发送 IM 消息通知。

鸿蒙使用独立的推送证书和 `client_id` 配置，不使用 Android 华为 HMS 参数或旧版 `EMPushUniPlugin` 原生插件。

## 技术原理

应用通过插件获取 Push Kit Token，在 IM 登录成功后将 Token、当前设备资源标识和鸿蒙证书名称上传至环信服务器。用户离线后，环信服务端通过已绑定的鸿蒙通道下发通知；用户点击通知时，插件将点击数据回传给应用。Token 的绑定和解绑由业务侧管理。

## 前提条件

- 已在[环信控制台](https://console.easemob.com/user/login)创建应用，并了解[使用限制](/product/limitation.html)。
- 使用 SDK 4.14.0 或以上版本，并完成 [SDK 初始化](/v4/applet/initialization.html)和[登录](/v4/applet/login.html)集成。
- 使用 HBuilderX 4.31.0 或以上版本和 Vue 3 工程。
- 使用 HarmonyOS 5.0.0（API 12）或以上版本的真机。
- 使用 `easemob-push` 0.2.0 或以上版本，构建包含该插件的鸿蒙调试基座或正式安装包。标准运行基座、H5 和小程序不支持该插件。

## 配置鸿蒙证书和应用

1. 在华为开发者联盟控制台为应用开通 HarmonyOS Push Kit 并申请服务账号密钥。在环信控制台的 **即时通讯 > 推送配置 > 证书配置** 中添加 **鸿蒙** 推送证书，上传服务账号密钥 JSON 文件，证书名称填写应用的 HarmonyOS Client ID。详见[鸿蒙推送证书](/value-added/push/push_certificate_config.html#鸿蒙推送证书)。
2. 从 [DCloud 插件市场](https://ext.dcloud.net.cn/plugin?id=29622)导入 `easemob-push`，确认存在 `uni_modules/easemob-push/utssdk/app-harmony`。
3. 在 `manifest.json` 的 `app-harmony.distribute` 中设置与华为控制台应用一致的包名：

   ```json
   {
     "app-harmony": {
       "distribute": {
         "bundleName": "com.example.chat"
       }
     }
   }
   ```

4. 在工程根目录 `harmony-configs/entry/src/main/module.json5` 的 `module.metadata` 中添加 `client_id`，与环信控制台的鸿蒙证书名称一致：

   ```json
   {
     "module": {
       "metadata": [
         { "name": "client_id", "value": "YOUR_HARMONY_CLIENT_ID" }
       ]
     }
   }
   ```

   该示例仅展示需添加的字段。`harmony-configs` 中的文件会覆盖生成工程的同名文件，须保留完整的原有模块配置，将该项追加到已有 `metadata` 数组中，并检查生成工程的 `entry/src/main/module.json5`。
5. 使用与华为控制台应用匹配的签名。真机调试时，在 DevEco Studio 的 **Signing Configs** 中关联已注册并开通 Push Kit 的同名应用（**Associate with registered application**），再构建安装包。修改原生配置或签名后需重新构建。

插件已声明 `ohos.permission.INTERNET` 和 `ohos.permission.GET_BUNDLE_INFO`。鸿蒙不使用 Android 的 `agconnect-services.json` 或 `HMSCertificateName` 配置。

## 初始化插件并处理通知点击

在 `App.vue` 的 `onLaunch` 中初始化插件、申请通知授权并注册点击监听。使用 `APP-HARMONY` 条件编译，`APP-PLUS` 不包含鸿蒙端。

```javascript
// #ifdef APP-HARMONY
import {
  initPushModule,
  requestNotificationAuthorization,
  addNotificationListener,
} from '@/uni_modules/easemob-push';
// #endif

export default {
  onLaunch() {
    // #ifdef APP-HARMONY
    initPushModule(ret => {
      console.log('推送通道配置:', ret.pushConfigTypes); // 鸿蒙为 [9]。
    });
    requestNotificationAuthorization(ret => {
      if (!ret.status) {
        console.warn('请在系统设置中允许应用发送通知');
      }
    });
    addNotificationListener(payload => {
      // 根据 payload 跳转到对应会话；冷启动时先暂存，页面就绪后处理。
      // 此回调表示用户点击通知，不表示消息到达。
    });
    // #endif
  },
};
```

默认通知点击打开应用主 Ability，插件通过鸿蒙生命周期钩子接收点击数据，无需修改 `EntryAbility` 或额外配置通知跳转的 `skills`、URI。用户拒绝通知权限后，可调用插件的 `openSettingsForNotification()` 引导其进入系统设置。

## 手动绑定和解绑 Push Token

目前 V4 SDK 的 `usePlugin(..., 'push')` 自动通道映射不包含 HarmonyOS，不能将鸿蒙 Token 交给旧版 Android 华为通道配置。每次 IM 登录成功后，调用插件 `onRegister()` 获取 Token，再通过 `conn.uploadPushToken()` 绑定。`conn` 为已登录的 SDK 连接实例，下方函数在 `APP-HARMONY` 条件编译范围内调用。

```javascript
// #ifdef APP-HARMONY
import { onRegister } from '@/uni_modules/easemob-push';

function bindHarmonyPush(conn) {
  const deviceId = conn.context.jid.clientResource;
  if (!deviceId) {
    throw new Error('请先完成 IM 登录');
  }

  onRegister(async ret => {
    if (ret.code !== 200 || ret.push_type !== 9 || !ret.push_token) {
      console.warn('鸿蒙 Push Token 获取失败:', ret.code, ret.error);
      return;
    }
    try {
      await conn.uploadPushToken({
        deviceId,
        deviceToken: ret.push_token,
        notifierName: 'YOUR_HARMONY_CLIENT_ID',
      });
      console.log('鸿蒙 Push Token 绑定成功');
    } catch (error) {
      console.warn('鸿蒙 Push Token 绑定失败，请检查网络和证书配置');
    }
  });
}

// IM 登录成功后调用。
bindHarmonyPush(conn);
// #endif
```

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `deviceId` | String | 是 | 登录后的 `conn.context.jid.clientResource`，即当前设备资源标识。保存该值，用于后续解绑。 |
| `deviceToken` | String | 是 | `onRegister()` 成功回调中的 `push_token`，不要输出到日志。鸿蒙 `push_type` 为 `9`，与 Android HMS 的 `2` 不同。 |
| `notifierName` | String | 是 | 环信控制台中的鸿蒙证书名称，与 `client_id` 相同。 |

获取或上传失败时由业务侧重试，Token 变化后重新上传。停用推送、退出登录或切换账号时，应先停止新的绑定并等待正在进行的上传结束，再以原账号、相同设备 ID 和证书名称解绑，成功后再退出登录：

```javascript
// conn 仍处于登录状态；deviceId 为绑定时保存的设备资源标识。
try {
  await conn.uploadPushToken({
    deviceId,
    deviceToken: '',
    notifierName: 'YOUR_HARMONY_CLIENT_ID',
  });
  console.log('鸿蒙 Push Token 解绑成功');
} catch (error) {
  console.warn('鸿蒙 Push Token 解绑失败，请重试');
}
```

插件 `unRegister()` 只清除本地 Token 回调，不会解除环信侧绑定或删除 Push Kit Token。此处使用手动绑定，应明确传入证书名称解绑，不依赖旧插件自动维护的证书状态。

## 验证与排查

在鸿蒙真机确认通知授权成功、回调 `push_type` 为 `9` 且 Token 上传成功。保持账号登录并终止应用进程，待用户离线后由另一账号发送消息，验证通知接收、点击冷启动和页面跳转；同时验证解绑、重新登录和账号切换。

| 错误码 | 常量 | 说明 | 常见原因 | 处理建议 |
| :--- | :--- | :--- | :--- | :--- |
| `1000900010` | — | `Illegal application identity` | 签名未关联华为控制台登记的应用。 | 检查包名、Client ID、Push Kit 开通状态及签名关联，重新构建。 |
| `9568332` | — | `sign info inconsistent` | 设备上的旧应用与新安装包签名不一致。 | 确认签名正确后，卸载旧应用并重新安装。 |

若 `client_id` 读取失败或没有通知，检查生成工程的 `module.metadata`、环信控制台的 **鸿蒙** 证书、通知权限及手动绑定结果。`initPushModule()` 返回 `[9]` 仅表示通道类型，不能作为 Token 绑定成功的依据。


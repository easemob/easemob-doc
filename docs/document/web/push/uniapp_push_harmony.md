# 在 uni-app 中集成 HarmonyOS 推送

## 功能说明

uni-app 原生应用可通过 `easemob-push` 0.2.0 及以上版本的 UTS 插件接入 HarmonyOS NEXT 的 Push Kit，获取推送 Token、申请通知权限并处理通知点击。用户离线时，环信服务端通过 Push Kit 向设备发送 IM 消息通知。

鸿蒙使用独立的推送证书和 `client_id` 配置，不使用 Android 华为 HMS 参数或旧版 `EMPushUniPlugin` 原生插件。

## 技术原理

应用通过插件获取 Push Kit Token，在 IM 登录成功后将 Token、当前设备资源标识和鸿蒙证书名称上传至环信服务器。用户离线后，环信服务端通过已绑定的鸿蒙通道下发通知；用户点击通知时，插件将点击数据回传给应用。Token 的绑定和解绑由业务侧管理。

## 前提条件

- 已在 [环信控制台](https://console.easemob.com/user/login) 创建应用，并了解 [使用限制](/product/limitation.html)。
- 使用 Web SDK 5.1.2 或以上版本，并完成 [SDK 初始化](/document/web/initialization.html) 和 [登录](/document/web/login.html)集成。
- 使用 HBuilderX 4.31.0 或以上版本和 Vue 3 工程。
- 使用 HarmonyOS 5.0.0（API 12）或以上版本的真机。
- 使用 `easemob-push` 0.2.0 或以上版本，构建包含插件的鸿蒙调试基座或正式安装包。标准运行基座、H5 和小程序不支持该插件。

## 配置推送证书和宿主工程

1. 在华为开发者联盟控制台为应用开通 HarmonyOS Push Kit，并申请服务账号密钥。在环信控制台的 **即时通讯 > 推送配置 > 证书配置** 中添加 **鸿蒙** 推送证书，上传服务账号密钥 JSON 文件，证书名称填写应用的 HarmonyOS Client ID。详见 [鸿蒙推送证书](/value-added/push/push_certificate_config.html#鸿蒙推送证书)。
2. 从 [DCloud 插件市场](https://ext.dcloud.net.cn/plugin?id=29622)导入插件，确认工程中存在 `uni_modules/easemob-push/utssdk/app-harmony`。
3. 在 `manifest.json` 的 `app-harmony.distribute` 中设置 `bundleName`，与华为控制台登记的应用包名一致：

   ```json
   {
     "app-harmony": {
       "distribute": {
         "bundleName": "com.example.chat"
       }
     }
   }
   ```

4. 在工程根目录的 `harmony-configs/entry/src/main/module.json5` 中，将 `client_id` 添加到 `module.metadata`，其值与环信控制台的鸿蒙证书名称一致：

   ```json
   {
     "module": {
       "metadata": [
         { "name": "client_id", "value": "YOUR_HARMONY_CLIENT_ID" }
       ]
     }
   }
   ```

   以上仅展示需添加的字段。`harmony-configs` 中的文件会覆盖生成工程的同名文件，必须保留完整的原有模块配置，并将该项追加到已有 `metadata` 数组中。打包后检查生成工程 `entry/src/main/module.json5` 中的值。
5. 使用与华为控制台应用匹配的签名。真机调试时，在 DevEco Studio 的 **Signing Configs** 中关联已注册并开通 Push Kit 的同名应用（**Associate with registered application**）。修改包名、Client ID 或签名后，重新构建鸿蒙调试基座或正式安装包。

插件已声明 `ohos.permission.INTERNET` 和 `ohos.permission.GET_BUNDLE_INFO`，应用仍需在运行时申请通知授权。

## 初始化插件并处理通知点击

在 `App.vue` 的 `onLaunch` 中初始化插件、申请权限并注册点击监听。鸿蒙使用 `APP-HARMONY` 条件编译；`APP-PLUS` 中的代码不会在鸿蒙端执行。

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

冷启动点击事件的暂存与消费方式可参见[处理通知点击](uniapp_push.html#步骤-4-处理通知点击)，鸿蒙端需使用 `APP-HARMONY` 条件编译。

默认通知点击打开应用主 Ability。插件通过鸿蒙生命周期钩子接收点击数据，应用无需修改 `EntryAbility` 或额外配置通知跳转的 `skills`、URI。用户拒绝通知权限后，可在需要时调用插件的 `openSettingsForNotification()` 引导其进入系统设置。

## 获取并绑定 Push Token

目前 `setNativePush()` 的自动通道映射不包含 HarmonyOS，不能通过增加 `certificates.huawei` 等字段绑定鸿蒙 Token。应在每次 IM 登录成功后调用插件 `onRegister()`，将返回的 Token 通过 `uploadPushToken()` 手动上传。下面的 `client` 为已登录的 `ChatClient` 实例，函数需在 `APP-HARMONY` 条件编译范围内调用。

```javascript
// #ifdef APP-HARMONY
import { onRegister } from '@/uni_modules/easemob-push';

function bindHarmonyPush(client) {
  const deviceId = client.getClientResource();
  if (!deviceId) {
    throw new Error('请先完成 IM 登录');
  }

  onRegister(async ret => {
    if (ret.code !== 200 || ret.push_type !== 9 || !ret.push_token) {
      console.warn('鸿蒙 Push Token 获取失败:', ret.code, ret.error);
      return;
    }
    try {
      await client.pushManager.uploadPushToken({
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
bindHarmonyPush(client);
// #endif
```

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `deviceId` | String | 是 | 登录后通过 `client.getClientResource()` 获取的当前设备资源标识。保存该值，用于后续解绑。 |
| `deviceToken` | String | 是 | 插件 `onRegister()` 成功回调中的 `push_token`，不要输出到日志。鸿蒙的 `push_type` 为 `9`，Android HMS 为 `2`。 |
| `notifierName` | String | 是 | 环信控制台中的鸿蒙证书名称，必须与 `client_id` 相同。 |

手动上传的 Token 不由 `setNativePush()` 的自动生命周期管理，绑定结果以 `uploadPushToken()` 的 Promise 为准，不触发 `onPushTokenBound`。获取或绑定失败时需由业务侧重试；Token 变化后需重新上传。

停用推送、退出登录或切换账号时，先停止新的绑定并等待正在进行的上传结束，再由业务服务端调用[绑定和解绑推送信息](/document/server-side/push_information_bind_unbind.html)，使用原账号、同一 `device_id` 和 `notifier_name`，将 `device_token` 设为空字符串以解除绑定，成功后再退出 IM 登录。App Token 仅保存在业务服务端。不要依赖 `removePushToken()` 或 `client.logout()` 自动解绑此处手动上传的 Token。插件的 `unRegister()` 只清除本地 Token 回调，不会解除环信侧绑定，也不会删除 Push Kit Token。

## 验证 HarmonyOS 离线推送

在 HarmonyOS 真机安装包含插件的构建包，确认通知授权成功、`push_type` 为 `9` 且 Token 上传成功。保持账号登录并终止应用进程，待用户离线后由另一账号发送消息，验证通知接收、点击后冷启动和页面跳转。另需验证解绑后的通知停止、重新登录后的绑定以及账号切换场景。

## 常见错误与排查

| 错误码 | 常量 | 说明 | 常见原因 | 处理建议 |
| :--- | :--- | :--- | :--- | :--- |
| `1000900010` | — | `Illegal application identity` | 签名未关联华为控制台登记的应用。 | 检查包名、Client ID、Push Kit 开通状态及签名关联，重新构建安装包。 |
| `9568332` | — | `sign info inconsistent` | 待安装包与设备上旧应用的签名不同。 | 确认签名正确后，卸载旧应用并重新安装。 |

若 `client_id` 读取失败或没有通知，检查生成工程的 `module.metadata`、环信控制台的 **鸿蒙** 证书、运行时通知授权及手动绑定结果；仅 `initPushModule()` 返回 `[9]` 不代表 Token 获取和绑定成功。


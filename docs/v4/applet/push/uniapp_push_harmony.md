# 在 uni-app 中集成 HarmonyOS 推送

## 功能说明

uni-app 原生应用可通过 `easemob-push` 0.2.0 及以上版本的 UTS 插件接入 HarmonyOS NEXT 的 Push Kit，获取推送 Token、申请通知权限并处理通知点击。用户离线时，环信服务端通过 Push Kit 向设备发送 IM 消息通知。

鸿蒙使用独立的推送证书和 `client_id` 配置，不使用 Android 华为 HMS 参数或旧版 `EMPushUniPlugin` 原生插件。

## 技术原理

Android、iOS 和 HarmonyOS 的流程一致：插件向相应推送服务注册并自动获取 Token，IM SDK 负责将 Token、设备标识和证书名称上传至环信服务器，与 IM 账号绑定。插件自身不上传 Token。

鸿蒙端由插件获取 Push Kit Token，登录后通过 SDK 完成上传绑定。用户离线后，环信服务端通过已绑定的鸿蒙通道下发通知；用户点击通知时，插件将点击数据回传给应用。具体上传和解绑方法见下文的接入步骤。

## 前提条件

- 已在 [环信控制台](https://console.easemob.com/user/login) 创建应用，并了解 [使用限制](/product/limitation.html)。
- 使用 SDK 4.14.0 或以上版本，并完成 [SDK 初始化](/v4/applet/initialization.html) 和 [登录](/v4/applet/login.html) 集成。
- 使用 HBuilderX 4.31.0 或以上版本和 Vue 3 工程。
- 使用 HarmonyOS 5.0.0（API 12）或以上版本的真机。
- 使用 `easemob-push` 0.2.0 或以上版本，推荐使用本文核对的 0.2.2 版本，构建包含该插件的鸿蒙调试基座或正式安装包。标准运行基座、H5 和小程序不支持该插件。

## 配置鸿蒙证书和应用

1. 在华为开发者联盟控制台为应用开通 HarmonyOS Push Kit 并申请服务账号密钥。在环信控制台的 **即时通讯 > 推送配置 > 证书配置** 中添加 **鸿蒙** 推送证书，上传服务账号密钥 JSON 文件，证书名称填写应用的 HarmonyOS Client ID。详见 [鸿蒙推送证书](/value-added/push/push_certificate_config.html#鸿蒙推送证书)。
2. 从 [DCloud 插件市场](https://ext.dcloud.net.cn/plugin?id=29622) 导入 `easemob-push`，确认存在 `uni_modules/easemob-push/utssdk/app-harmony`。
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

在 `App.vue` 的 `onLaunch` 中初始化插件、申请权限并注册点击监听，不要等待 IM 登录或页面加载。鸿蒙使用 `APP-HARMONY` 条件编译，`APP-PLUS` 不包含鸿蒙端。

`initPushModule()` 读取 `client_id` 并返回 `{ pushConfigTypes: [9] }`。即使缺少 `client_id`，当前实现仍会返回 `[9]` 并记录错误，因此不能将此回调视为配置校验通过或 Token 获取成功。

```javascript
// #ifdef APP-HARMONY
import {
  initPushModule,
  requestNotificationAuthorization,
  addNotificationListener,
} from '@/uni_modules/easemob-push';
// #endif

export default {
  globalData: {
    pushClickPageReady: false,
    pendingPushClicks: [],
  },
  onLaunch() {
    // #ifdef APP-HARMONY
    initPushModule(ret => {
      console.log('推送通道类型:', ret.pushConfigTypes);
    });
    requestNotificationAuthorization(ret => {
      if (!ret.status) {
        console.warn('应用尚未获得通知授权');
      }
    });
    addNotificationListener(payload => {
      // 此回调表示通知被点击，不表示消息到达。
      if (this.globalData.pushClickPageReady) {
        uni.$emit('easemob-push-click', payload);
      } else {
        this.globalData.pendingPushClicks.push(payload);
      }
    });
    // #endif
  },
};
```

页面就绪后注册业务监听、消费缓存，卸载时解除监听并重置就绪状态，参见 [处理通知点击](uniapp_push.html#步骤-4-处理通知点击) 中的页面示例。插件自身也会排队缓存尚未注册监听时的点击，并在 `addNotificationListener()` 注册后补发，但不会替应用判断页面或 IM 账号是否就绪。

默认通知点击打开主 Ability。插件通过 `UTSHarmony.onAppAbilityCreate` 和 `onAppAbilityNewWant` 接收冷、热启动 Want，无需修改 `EntryAbility` 或额外配置通知跳转的 `skills`、URI。

鸿蒙点击回调的数据结构如下：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `to`、`from` | String | 接收方和发送方；读取 `t/f` 短键或 `to/from` 全名，缺失时为空字符串。 |
| `msgId`、`groupId` | String | 消息 ID 和群组 ID；读取 `m/g` 短键或全名，缺失时为空字符串。 |
| `ext` | Object 或其他 JSON 值或 String | 读取 `e/ext`；尝试解析 JSON，解析失败时保留字符串，缺失时为空字符串。 |
| `raw` | Object | 原始 Want parameters，包含华为回传参数；序列化成功时提供。 |

`requestNotificationAuthorization()` 的 `status` 表示授权状态。用户拒绝后，可在业务交互中调用 `openSettingsForNotification()` 打开设置页；该接口的 `status` 仅表示设置页是否打开成功，不能据此判断已获授权。用户返回 App 后需重新检查通知权限。

## 手动绑定和解绑 Push Token

三端均需将插件取得的 Token 交给 IM SDK 上传。当前 V4 SDK 的 `usePlugin(..., 'push')` 自动通道映射不包含鸿蒙 `9`，因此本节显式调用 `conn.uploadPushToken()` 完成 SDK 上传，不添加虚构的鸿蒙证书配置，也不将 Token 映射为 Android 华为通道。插件 0.2.2 的仓库 Demo 已通过“绑定 Token 到环信”入口演示这一调用链。

`conn` 为已登录的连接实例。先等待 Token 获取，再等待上传结束，保存绑定信息后才能继续执行退出或账号切换。

```javascript
// #ifdef APP-HARMONY
import { onRegister, unRegister } from '@/uni_modules/easemob-push';

function getHarmonyPushToken() {
  return new Promise((resolve, reject) => {
    onRegister(ret => {
      // 当前仅获取一次 Token；鸿蒙 unRegister 不删除 Push Kit Token。
      unRegister();
      if (ret.code !== 200 || ret.push_type !== 9 || !ret.push_token) {
        reject(new Error(`鸿蒙 Token 获取失败：${ret.code} ${ret.error}`));
        return;
      }
      resolve(ret.push_token);
    });
  });
}

async function bindHarmonyPush(conn) {
  const deviceId = conn.context.jid.clientResource;
  if (!deviceId) {
    throw new Error('请先完成 IM 登录');
  }
  const notifierName = 'YOUR_HARMONY_CLIENT_ID';
  const deviceToken = await getHarmonyPushToken();
  await conn.uploadPushToken({ deviceId, deviceToken, notifierName });
  return { deviceId, notifierName };
}

// 在已完成 IM 登录的异步业务流程中调用，并保存绑定信息。
let harmonyBinding;
try {
  harmonyBinding = await bindHarmonyPush(conn);
  console.log('鸿蒙 Push Token 绑定成功');
} catch (error) {
  console.warn('鸿蒙 Token 获取或绑定失败，请检查签名、网络和证书配置');
}
// #endif
```

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `deviceId` | String | 是 | 登录后的 `conn.context.jid.clientResource`，保存为解绑使用的设备资源标识。 |
| `deviceToken` | String | 是 | `onRegister()` 的 `push_token`，仅在 `code=200`、`push_type=9` 且非空时上传，不要输出到日志。 |
| `notifierName` | String | 是 | 环信控制台的鸿蒙证书名称，与宿主 `client_id` 相同。 |

获取或上传失败时由业务侧重试。鸿蒙插件在当前进程缓存 Token，重复 `onRegister()` 返回缓存值；`addDeviceTokenListener()` 只是再次注册，不是独立的 Token 更新订阅。重启进程后再次注册会重新请求 Push Kit，Token 是否变化由厂商决定；取得新 Token 后需重新上传。

退出登录或切换账号时，先停止新的绑定并等待当前绑定流程结束，在原账号仍登录时使用保存的设备 ID 和证书名称解绑。以下代码在 `harmonyBinding` 已成功保存后执行：

```javascript
try {
  await conn.uploadPushToken({
    deviceId: harmonyBinding.deviceId,
    deviceToken: '',
    notifierName: harmonyBinding.notifierName,
  });
  console.log('鸿蒙 Push Token 解绑成功');
  conn.close();
} catch (error) {
  console.warn('鸿蒙 Push Token 解绑失败，请处理后重试退出');
}
```

不要直接依赖 `conn.unbindPushToken()` 使用的自动证书状态来解绑本节的手动绑定；显式传入设备 ID、空 Token 和鸿蒙证书名称。插件 `unRegister()` 仅清除本地回调，不解绑环信服务端，也不删除或清空缓存的 Push Kit Token。

## 设置本地角标和清理通知

鸿蒙端提供以下两个无返回值接口，直接调用插件即可，无需传给 IM SDK：

```javascript
// #ifdef APP-HARMONY
import { setBadge, clearAllNotification } from '@/uni_modules/easemob-push';

setBadge(5); // 将本地桌面角标设为 5。
setBadge(0); // 清除本地桌面角标。
clearAllNotification(); // 清理本应用的系统通知栏。
// #endif
```

`setBadge()` 调用 `notificationManager.setBadgeNumber()`，`clearAllNotification()` 调用 `notificationManager.cancelAll()`。两者用途不同，清理通知栏不代表角标或 IM 未读数被清零，也不会修改后续离线推送的服务端配置。

## 注意事项

- 鸿蒙支持从插件 0.2.0 引入，本文按 0.2.2 核对。0.2.1 已移除调试接口 `debugPublishLocalNotification`，请使用真实的 IM 离线通知链路验证，不要依赖该调试接口。
- `onRegister()` 与 `addDeviceTokenListener()` 共用同一个回调，后一次调用会覆盖前一次；不要并行注册或在账号切换过程中继续使用原账号的绑定任务。
- `unRegister()` 不清除缓存 Token，不撤销通知授权，也不清理通知栏；解绑、授权、角标和通知清理应分别处理。

## 验证 HarmonyOS 离线推送

在鸿蒙真机确认通知授权成功、回调 `push_type` 为 `9` 且 Token 上传成功。保持账号登录并终止应用进程，待用户离线后由另一账号发送消息，验证通知接收、点击冷启动和页面跳转；同时验证解绑、重新登录和账号切换。

使用插件仓库的 [Demo](https://github.com/easemob/uniapp-push/tree/dev/demo) 时，在 `demo/utils/pushCertConfig.js` 中将 `HarmonyCertificateName` 设置为环信控制台中的鸿蒙证书名称。登录 IM 后，通过 `onRegister` 获取 Token，再点击 **绑定 Token 到环信**，确认 SDK 上传成功。`HarmonyCertificateName` 仅是 Demo 的业务配置，不代表 SDK 的 `usePlugin()` 已新增鸿蒙自动映射。

## 常见错误与排查

### 常见错误码

下表同时列出 Push Kit 身份错误和安装签名错误；安装错误不会通过 `onRegister()` 的 Token 回调返回。

| 错误码 | 常量 | 说明 | 常见原因 | 处理建议 |
| :--- | :--- | :--- | :--- | :--- |
| `1000900010` | — | `Illegal application identity` | 签名未关联华为控制台登记的应用。 | 检查包名、Client ID、Push Kit 开通状态及签名关联，重新构建。 |
| `9568332` | — | `sign info inconsistent` | 设备上的旧应用与新安装包签名不一致。 | 确认签名正确后，卸载旧应用并重新安装。 |

### 常见问题

#### 为什么返回 [9] 但无法取得 Token？

`[9]` 只表示插件的鸿蒙通道类型。检查生成工程中的 `module.metadata.client_id`、已开通 Push Kit 的华为应用、包名与签名关联，并以 `onRegister()` 的 `code` 和非空 `push_token` 判断获取结果。

#### 为什么 Token 获取成功但没有离线通知？

确认 IM 登录后已成功上传 Token，环信控制台配置的是 **鸿蒙** 证书，证书名称与宿主 `client_id` 一致，且系统通知权限已开启。保持账号登录并终止进程、等待接收方离线后，再由另一账号发送 IM 消息；不要在退出并解绑后验证离线推送。

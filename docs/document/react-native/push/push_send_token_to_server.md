# 发送推送 Token 到环信服务器

环信即时通讯 IM SDK 通过 `react-native-push-collection` 获取推送 token。本文介绍如何将推送 token 发送到环信服务器。

## 普通推送 Token 实现流程

### 步骤一 添加即时通讯 SDK 依赖

在当前应用中添加即时通讯 IM SDK 依赖。

```sh
yarn add react-native-chat-sdk
```

### 步骤二 获取推送证书信息

从[环信控制台](https://console.easemob.com/user/login)获取推送证书信息，配置应用的 App Key（`appKey`）和推送证书名称（`pushId`）信息。

- `appKey`：在[环信控制台](https://console.easemob.com/user/login)的 **应用概览** 页面查看。
- `pushId`：推送证书名称。不同厂商的推送证书名称也不同。

![img](/images/react-native/push/push_get_appkey.png)

![img](/images/react-native/push/push_get_certificate_name.png)

```typescript
import { getPlatform, getDeviceType } from "react-native-push-collection";
import { ChatClient, ChatOptions, ChatPushConfig } from "react-native-chat-sdk";

// 从环信控制台获取推送 ID、pushId
const pushId = "<your push id from easemob console>";

// 设置推送类型
const pushType = React.useMemo(() => {
  let ret: PushType;
  const platform = getPlatform();
  if (platform === "ios") {
    // APNs 或 FCM
    ret = "apns";
  } else {
    // 动态获取设备 token
    ret = (getDeviceType() ?? "unknown") as PushType;
  }
  return ret;
}, []);
```

### 步骤三 初始化即时通讯 IM SDK


```typescript
const options = ChatOptions.withAppKey({
  appKey: "<your app key>",
  // 仅 iOS APNs 推送需要设置；名称应与环信控制台中的证书名称一致。
  apnsCertName: pushType === "apns" ? pushId : undefined,
  pushConfig: new ChatPushConfig({
    deviceId: pushId,
    deviceToken: undefined,
  }),
});

ChatClient.getInstance()
  .init(options)
  .then(() => {
    onLog("chat:init:success");
  })
  .catch((e) => {
    onLog("chat:init:failed:" + JSON.stringify(e));
  });
```

### 步骤四 初始化推送 SDK

```typescript
ChatPushClient.getInstance()
  .init({
    platform: getPlatform(),
    pushType: pushType,
  })
  .then(() => {
    onLog("push:init:success");
    ChatPushClient.getInstance().addListener({
      onError: (error) => {
        onLog("onError:" + JSON.stringify(error));
      },
      onReceivePushMessage: (message: any) => {
        onLog("onReceivePushMessage:" + JSON.stringify(message));
      },
      onReceivePushToken: (pushToken) => {
        onLog("onReceivePushToken:" + pushToken);
        if (pushToken) {
          // 更新服务端的推送 token
        }
      },
    } as ChatPushListener);
  })
  .catch((e) => {
    onLog("push:init:failed:" + JSON.stringify(e));
  });
```

### 步骤五 更新服务端的推送 Token

```typescript
ChatClient.getInstance()
  .updatePushConfig(
    new ChatPushConfig({
      deviceId: pushId,
      deviceToken: pushToken,
    })
  )
  .then(() => {
    onLog("updatePushConfig:success");
  })
  .catch((e) => {
    onLog("updatePushConfig:error:" + JSON.stringify(e));
  });
```

## 绑定和解绑 PushKit token

自 React Native SDK 1.21.0 起支持在 iOS 平台绑定和解绑苹果 PushKit token，用于 VoIP 推送。该功能对应的方法属于 `ChatClient`：

- `bindPushKitToken({ deviceToken })`：绑定 `PKPushRegistry` 上报的 PushKit token。
- `unbindPushKitToken()`：解绑当前用户的 PushKit token。

:::tip
1. 这两个方法仅在 iOS 平台生效，在 Android 等其他平台调用不会执行任何操作。
2. 初始化 SDK 时必须设置 `ChatOptions.pushKitCertName`，且证书名称应与环信控制台中的 PushKit 证书名称一致。该配置在 App 运行期间不可修改。
3. `deviceToken` 必须是 `PKPushRegistry` 上报的 token 转换成的十六进制字符串。
:::

初始化时配置 PushKit 证书名称：

```typescript
const options = ChatOptions.withAppKey({
  appKey: 'your-org#your-app',
  pushKitCertName: '<your_pushkit_certificate_name>',
});

await ChatClient.getInstance().init(options);
```

登录成功并获取 PushKit token 后进行绑定：

```typescript
try {
  await ChatClient.getInstance().bindPushKitToken({
    deviceToken: pushKitToken,
  });
  console.log('PushKit token 绑定成功');
} catch (error) {
  const chatError = error as ChatError;
  console.error(
    `PushKit token 绑定失败：${chatError.code}, ${chatError.description}`
  );
}
```

如果用户尚未登录，原生 SDK 会先缓存该 token，本次调用会抛出 `ChatError`，并在用户下次登录成功后自动绑定。

如需在保持当前用户登录状态的同时解绑 PushKit token，调用：

```typescript
try {
  await ChatClient.getInstance().unbindPushKitToken();
  console.log('PushKit token 解绑成功');
} catch (error) {
  const chatError = error as ChatError;
  console.error(
    `PushKit token 解绑失败：${chatError.code}, ${chatError.description}`
  );
}
```

调用 `ChatClient.logout(true)` 退出登录时已经会解绑普通推送 token 和 PushKit token，因此无需再单独调用 `unbindPushKitToken`。

## 运行示例项目

启动项目后，界面如下图所示。

<ImageGallery>
<ImageItem src="/images/react-native/push/push_example_ui.png" title="运行示例项目后的界面" />
</ImageGallery>

在该页面，你可以发送消息，接收方若离线会收到推送通知：

1. 在页面上输入 `pushtype` 和 `appkey`，点击 `init action` 按钮, 执行初始化。
   
   初始化日志以及后续日志会在空白位置显示。

2. 在页面上输入用户 ID 和密码，点击 `login action` 按钮进行登录。

3. 点击 `get token action` 按钮获取推送 Token，并发送到服务端。

4. 设置 `target id` 和 `content` 输入对端用户 ID 和消息内容，点击 `send text message` 按钮发送文本消息。
   
5. 接收方的登录设备会在通知栏收到离线推送通知，如下图所示。

**注意：接收离线消息，需要杀死当前登录的应用，否则服务端将按照在线推送消息，不推送离线消息。**

![img](/images/android/push/push_displayattribute_1.png)

## 接口列表

| API 名称 | 所属模块/类 | 返回类型 | 说明 |
| :--- | :--- | :--- | :--- |
| [`updatePushConfig`](#步骤五-更新服务端的推送-token) | `ChatClient` | `Promise<void>` | 将普通离线推送 token 更新至环信服务器。 |
| [`bindPushKitToken`](#绑定和解绑-pushkit-token) | `ChatClient` | `Promise<void>` | 在 iOS 平台绑定 PushKit token。 |
| [`unbindPushKitToken`](#绑定和解绑-pushkit-token) | `ChatClient` | `Promise<void>` | 在 iOS 平台解绑 PushKit token。 |
| [`apnsCertName`](push_easemob_console.html#配置-ios-推送证书名称) | `ChatOptions` | `string \| undefined` | 设置 iOS APNs 证书名称。 |
| [`pushKitCertName`](push_easemob_console.html#配置-ios-推送证书名称) | `ChatOptions` | `string \| undefined` | 设置 iOS PushKit 证书名称。 |

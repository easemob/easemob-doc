# 发送推送 token 到服务器端

环信即时通讯 IM SDK 通过 `react-native-push-collection` 获取推送 token。本文介绍如何将推送 token 发送到服务器端。

## 添加即时通讯 IM SDK 依赖

在当前应用中添加依赖。

```sh
yarn add react-native-chat-sdk 
```

## 更新服务端的推送 token

初始化环信即时通讯 IM SDK 和推送 SDK，更新服务端的推送 token。

在实际应用中，需要配置应用的 App Key（`appKey` 参数）和推送证书名称（`pushId` 参数）信息。
- `appKey`：在[环信即时通讯云控制台](https://console.easemob.com/user/login)的 **应用详情** 页面查看。
- `pushId`：推送证书名称。不同厂商的推送证书名称也不同。

![img](/images/react-native/push/push_get_appkey.png)

![img](/images/react-native/push/push_get_certificate_name.png)

```tsx
import { getPlatform, getDeviceType } from "react-native-push-collection";
import { ChatClient, ChatOptions, ChatPushConfig } from "react-native-chat-sdk";

// 从环信即时通讯云控制台获取推送 ID、pushId（推送证书名称）
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

// 初始化即时通讯 IM SDK
ChatClient.getInstance()
  .init(
    new ChatOptions({
      appKey: "<your app key>",
      pushConfig: new ChatPushConfig({
        deviceId: pushId,
        deviceToken: undefined,
      }),
    }),
  )
  .then(() => {
    onLog("chat:init:success");
  })
  .catch((e) => {
    onLog("chat:init:failed:" + JSON.stringify(e));
  });

// 初始化推送 SDK
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
          ChatClient.getInstance()
            .updatePushConfig(
              new ChatPushConfig({
                deviceId: pushId,
                deviceToken: pushToken,
              }),
            )
            .then(() => {
              onLog("updatePushConfig:success");
            })
            .catch((e) => {
              onLog("updatePushConfig:error:" + JSON.stringify(e));
            });
        }
      },
    } as ChatPushListener);
  })
  .catch((e) => {
    onLog("push:init:failed:" + JSON.stringify(e));
  });
```



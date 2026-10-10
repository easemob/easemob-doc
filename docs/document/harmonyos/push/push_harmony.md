# 集成 HarmonyOS 推送

环信即时通讯 IM SDK 已集成 HarmonyOS Push Kit 的 Push Token 获取与上传逻辑。使用离线推送前，还需完成以下配置。

## 步骤一 申请服务账号密钥

HarmonyOS 推送服务端通过服务账号密钥生成鉴权令牌。请先登录 [华为开发者联盟控制台](https://developer.huawei.com/consumer/cn/console/)，开通推送服务并申请服务账号密钥。

1. 开启鸿蒙推送服务。
   
![image](/images/harmonyos/push/push_harmonyos_enable.png)

2. 创建服务账号凭证。
   
![image](/images/harmonyos/push/push_harmonyos_account_create.png)

3. 凭证创建后，点击 **创建并下载 JSON**，获取服务账号密钥文件。

![image](/images/harmonyos/push/push_harmonyos_key_generate.png)

## 步骤二 上传推送证书

获取服务账号密钥后，需要在 [环信控制台](https://console.easemob.com/user/login) 上传推送证书。选择你的应用，进入 **即时通讯 > 推送配置 > 证书配置**，点击 **添加推送证书**，在弹出的窗口中选择 **鸿蒙** 页签并设置以下参数。

:::tip
控制台中的推送证书配置不依赖客户端登录状态，建议在客户端联调离线推送前完成。
:::

![image](/images/harmonyos/push/harmonyos_certificate.png)

| 推送证书参数    | 类型   | 是否必需 | 描述   |
| :-------- | :----- | :------- | :---------------- |
| 证书名称        | String | 是  | 填写应用的 HarmonyOS Client ID。证书名称是环信服务器判断目标设备所用推送通道的唯一依据，必须与客户端通过 `ChatOptions#setAppIDForPush` 及 `module.json5` 中 `client_id` 配置的值一致。详见 [华为 API Console 操作指南](https://developer.huawei.com/consumer/cn/doc/start/api-0000001062522591#section11695162765311)。|
| 上传文件     | - | 是  | 上传步骤一获取的服务账号密钥 JSON 文件。申请服务账号密钥可参考 [华为 API Console 操作指南](https://developer.huawei.com/consumer/cn/doc/start/api-0000001062522591#section11695162765311)。 |
| Category | - | 否      | 通知消息类别。详见 [HarmonyOS NEXT 官网相关文档](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/push-apply-right-V5#section16708911111611)。 |
| Action        | - | 否  | 消息接收方在收到离线推送通知时单击通知栏时打开的应用指定页面的自定义标记。 |

## 步骤三 在 SDK 初始化时配置应用的推送 Client ID

```typescript
import { ChatClient, ChatOptions } from '@easemob/chatsdk';

const options = new ChatOptions({
  appKey: 'your-org#your-app'
});

// 传入与推送证书名称及 module.json5 中 client_id 一致的 Client ID。
options.setAppIDForPush('your-client-id');
// 初始化即时通讯 IM SDK。
ChatClient.getInstance().init(context, options);
```

## 步骤四 监听 Push Token 上传结果

SDK 初始化完成后、调用 `ChatClient#loginWithToken` 登录前，注册 `PushListener` 监听 Push Token 的获取和绑定结果。登录成功后，SDK 会自动从 HarmonyOS Push Kit 获取 Push Token，并将 Token 与初始化时配置的 Client ID 上传至环信服务器，应用无需自行判断 Token 是否需要上传。

```typescript
import { ChatClient, ChatError, PushListener } from '@easemob/chatsdk';

const pushListener: PushListener = {
  onError: (error: ChatError): void => {
    // Push Token 获取或绑定失败，根据错误码和错误信息处理。
  },
  onBindTokenSuccess: (token: string): void => {
    // Push Token 绑定成功。
  }
};

const pushManager = ChatClient.getInstance().pushManager();
pushManager?.addListener(pushListener);

// 不再需要监听时，移除同一个监听器实例。
function releasePushListener(): void {
  pushManager?.removeListener(pushListener);
}
```

主动登录时，即使 Push Token 未发生变化，SDK 也会重新上传；上传失败时会清除本地保存的 Push Token。调用 `ChatClient#logout` 退出登录时，默认会解绑当前设备的 Push Token；若将 `unbindToken` 参数设置为 `false`，则仅退出 IM 账号而不解绑 Token，设备仍可能收到当前账号的离线推送通知。详见 [退出登录](/document/harmonyos/login.html#退出登录)。


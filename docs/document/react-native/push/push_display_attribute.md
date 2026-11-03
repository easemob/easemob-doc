# 设置和获取推送通知的显示属性

## 设置推送通知的显示属性

完成 SDK 初始化并成功登录后，调用 `ChatPushManager#updatePushNickname` 设置当前用户在推送通知中显示的昵称。推送昵称与用户属性中的昵称不同；若业务侧通过 `ChatUserInfoManager#updateOwnUserInfo` 更新了用户昵称，也应同步更新推送昵称，避免展示不一致。

```typescript
// 异步设置当前登录用户的推送显示昵称
async function setPushNickname(nickname: string): Promise<void> {
  try {
    // 设置当前用户的推送显示昵称
    await ChatClient.getInstance().pushManager.updatePushNickname(nickname);
    // await 正常返回表示推送昵称设置成功
  } catch (error: unknown) {
    // 设置失败，根据错误信息处理
    console.error('设置推送昵称失败：', error);
  }
}
```

示例中的 `nickname` 为业务传入的非空推送昵称。

调用 `ChatPushManager#updatePushDisplayStyle` 设置当前用户接收推送通知时的显示样式。该方法接收 `ChatPushDisplayStyle` 枚举值，省略参数时默认为 `ChatPushDisplayStyle.Simple`，返回 `Promise<void>`，示例代码如下：

```typescript
// 异步设置推送通知的显示样式
async function setPushDisplayStyle(): Promise<void> {
  // Simple：显示通用提示；如需显示消息内容，改为 ChatPushDisplayStyle.Summary
  const displayStyle = ChatPushDisplayStyle.Simple;

  try {
    // 设置当前用户接收推送通知时的显示样式
    await ChatClient.getInstance().pushManager.updatePushDisplayStyle(
      displayStyle
    );
    // await 正常返回表示显示样式设置成功
  } catch (error: unknown) {
    // 设置失败，根据错误信息处理
    console.error('设置推送显示样式失败：', error);
  }
}
```

若要在通知栏中显示消息内容，需要设置通知显示样式 `ChatPushDisplayStyle`。`ChatPushDisplayStyle` 是枚举类型，有如下两种设置：

| 参数值 | 描述 |
| :--- | :--- |
| （默认）`ChatPushDisplayStyle.Simple` | 不论推送昵称是否设置，对于推送任何类型的消息，通知栏采用默认显示设置，即推送标题为 **您有一条新消息**，推送内容为 **请点击查看**。 |
| `ChatPushDisplayStyle.Summary` | 显示消息内容。在默认推送展示规则下，设置的推送昵称只在 `Summary` 样式时用于展示，在 `Simple` 样式时不展示。 |

下表以 **单聊文本消息** 为例介绍显示属性的设置。显示样式由消息接收方设置；表中的 `nickname` 是消息发送方通过 `updatePushNickname` 设置的推送昵称，不是接收方昵称，也不是 `ChatUserInfo.nickName`。

对于 **群聊**，下表中的 **消息发送方的推送昵称** 和 **消息发送方的 IM 用户 ID** 显示为 **群组 ID**。

表中的“昵称不设置”指发送方尚未设置推送昵称，不表示可以通过 `updatePushNickname('')` 清空昵称。

| 参数设置 | 推送显示 | 图片 |
| :--- | :--- | :--- |
| - `displayStyle`：（默认）`ChatPushDisplayStyle.Simple`<br/> - `nickname`：设置或不设置 | - 推送标题：**您有一条新消息**<br/> - 推送内容：**请点击查看** | ![通用推送提示](/images/android/push/push_displayattribute_1.png) |
| - `displayStyle`：`ChatPushDisplayStyle.Summary`<br/> - `nickname`：设置具体值 | - 推送标题：**您有一条新消息**<br/> - 推送内容：**消息发送方的推送昵称：消息内容** | ![显示发送方推送昵称和消息内容](/images/android/push/push_displayattribute_2.png) |
| - `displayStyle`：`ChatPushDisplayStyle.Summary`<br/> - `nickname`：不设置 | - 推送标题：**您有一条新消息**<br/> - 推送内容：**消息发送方的 IM 用户 ID：消息内容** | ![显示发送方用户 ID 和消息内容](/images/android/push/push_displayattribute_3.png) |

以上为默认推送内容的展示示例，截图使用 Android 通知栏。iOS 的通知界面由系统呈现；如使用自定义推送标题、内容或 [推送模板](push_template.html)，实际展示应结合相应配置和推送通知载荷判断，不能仅凭显示样式确定推送通知最终显示的文本。

## 获取推送通知的显示属性

调用 `ChatPushManager#fetchPushOptionFromServer` 从服务器获取当前用户的推送通知显示属性。该方法返回 `Promise<ChatPushOption>`；获取成功时，通过 `await` 获得配置对象。发生 SDK 错误时，Promise 以 `ChatError` 拒绝，其中包含错误码 `code` 和错误信息 `description`。无需传入成功或失败回调。

通过 `ChatPushOption#displayName` 读取当前用户的推送显示昵称，类型为 `string | undefined`；通过 `displayStyle` 读取推送通知的显示样式，类型为 `ChatPushDisplayStyle | undefined`。修改返回对象的属性不会更新服务端设置；如需修改，应调用上述设置接口。

```typescript
// 异步从服务器获取当前用户的推送显示配置
async function fetchPushDisplayAttributes(): Promise<void> {
  try {
    // 从服务器获取当前用户的推送显示配置
    const options = await ChatClient.getInstance().pushManager
      .fetchPushOptionFromServer();

    // 读取当前用户的推送显示昵称；未设置时可能为空
    const pushNickname = options.displayName;

    // 读取推送通知的显示样式
    const pushDisplayStyle = options.displayStyle;

    console.log('推送显示昵称：', pushNickname);
    console.log('推送显示样式：', pushDisplayStyle);
  } catch (error: unknown) {
    // 获取推送配置失败，根据错误信息处理
    console.error('获取推送显示配置失败：', error);
  }
}
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`updatePushNickname`](#设置推送通知的显示属性) | `ChatPushManager` | 异步设置当前用户的推送显示昵称，返回 `Promise<void>`。 |
| [`updatePushDisplayStyle`](#设置推送通知的显示属性) | `ChatPushManager` | 异步设置当前用户接收推送通知时的显示样式，返回 `Promise<void>`；省略参数时默认为 `ChatPushDisplayStyle.Simple`。 |
| [`fetchPushOptionFromServer`](#获取推送通知的显示属性) | `ChatPushManager` | 异步从服务器获取当前用户的推送显示配置，返回 `Promise<ChatPushOption>`。 |
| [`displayName`](#获取推送通知的显示属性) | `ChatPushOption` | 当前用户的推送显示昵称，类型为 `string \| undefined`。 |
| [`displayStyle`](#获取推送通知的显示属性) | `ChatPushOption` | 推送通知的显示样式，类型为 `ChatPushDisplayStyle \| undefined`。 |

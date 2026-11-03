# 设置和获取推送通知的显示属性

## 设置推送通知的显示属性

完成 SDK 初始化并成功登录后，调用 `ChatPushManager#updatePushNickname` 设置当前用户在推送通知中显示的昵称。推送昵称与用户属性中的昵称不同；若业务侧通过 `ChatUserInfoManager#updateUserInfo` 更新了用户昵称，也应同步更新推送昵称，避免展示不一致。

```dart
// 异步设置当前登录用户的推送显示昵称。
Future<void> setPushNickname(String nickname) async {
  try {
    await ChatClient.getInstance.pushManager.updatePushNickname(nickname);
    // await 正常返回表示推送昵称设置成功。
  } on ChatError catch (error) {
    // 设置失败，根据错误码和错误信息处理。
    debugPrint('Update push nickname failed: '
        '${error.code}, ${error.description}');
  }
}
```

推送昵称应传入非空字符串。当前 iOS 桥接会拒绝空字符串。

调用 `ChatPushManager#updatePushDisplayStyle` 设置当前用户接收推送通知时的显示样式。该方法接收 `DisplayStyle` 枚举值，返回 `Future<void>`，示例代码如下：

```dart
// 异步设置推送通知的显示样式。
Future<void> setPushDisplayStyle() async {
  // Simple：显示通用提示；如需显示消息内容，改为 DisplayStyle.Summary。
  const DisplayStyle displayStyle = DisplayStyle.Simple;

  try {
    await ChatClient.getInstance.pushManager.updatePushDisplayStyle(
      displayStyle,
    );
    // await 正常返回表示显示样式设置成功。
  } on ChatError catch (error) {
    // 设置失败，根据错误码和错误信息处理。
    debugPrint('Update push display style failed: '
        '${error.code}, ${error.description}');
  }
}
```

若要在通知栏中显示消息内容，需要设置通知显示样式 `DisplayStyle`。`DisplayStyle` 是枚举类型，有如下两种设置：

| 参数值 | 描述 |
| :--- | :--- |
| （默认）`DisplayStyle.Simple` | 不论推送昵称是否设置，对于推送任何类型的消息，通知栏采用默认显示设置，即推送标题为 **您有一条新消息**，推送内容为 **请点击查看**。 |
| `DisplayStyle.Summary` | 显示消息内容。在默认推送展示规则下，设置的推送昵称只在 `Summary` 样式时用于展示，在 `Simple` 样式时不展示。 |

下表以 **单聊文本消息** 为例介绍显示属性的设置。显示样式由消息接收方设置；表中的 `nickname` 是消息发送方通过 `updatePushNickname` 设置的推送昵称，不是接收方昵称，也不是 `ChatUserInfo.nickName`。

对于 **群聊**，下表中的 **消息发送方的推送昵称** 和 **消息发送方的 IM 用户 ID** 显示为 **群组 ID**。

表中的“昵称不设置”指发送方尚未设置推送昵称，不表示可以通过 `updatePushNickname('')` 在各端统一清空昵称。

| 参数设置 | 推送显示 | 图片 |
| :--- | :--- | :--- |
| - `DisplayStyle`：（默认）`Simple`<br/> - `nickname`：设置或不设置 | - 推送标题：**您有一条新消息**<br/> - 推送内容：**请点击查看** | ![通用推送提示](/images/android/push/push_displayattribute_1.png) |
| - `DisplayStyle`：`Summary`<br/> - `nickname`：设置具体值 | - 推送标题：**您有一条新消息**<br/> - 推送内容：**消息发送方的推送昵称：消息内容** | ![显示发送方推送昵称和消息内容](/images/android/push/push_displayattribute_2.png) |
| - `DisplayStyle`：`Summary`<br/> - `nickname`：不设置 | - 推送标题：**您有一条新消息**<br/> - 推送内容：**消息发送方的 IM 用户 ID：消息内容** | ![显示发送方用户 ID 和消息内容](/images/android/push/push_displayattribute_3.png) |

以上为默认推送内容的展示示例，截图使用 Android 通知栏。iOS 的通知界面由系统呈现；如使用自定义推送标题、内容或 [推送模板](push_template.html)，实际展示应结合相应配置和推送通知载荷判断，不能仅凭显示样式确定推送通知最终显示的文本。

## 获取推送通知的显示属性

调用 `ChatPushManager#fetchPushConfigsFromServer` 从服务器获取当前用户的推送通知显示属性。该方法返回 `Future<ChatPushConfigs>`；获取成功时返回配置对象，获取失败时抛出 `ChatError`，包含错误码和错误信息。

通过返回对象的以下属性读取配置：

- `displayName`：推送显示昵称，类型为 `String?`。未设置时可能为 `null` 或空字符串。
- `displayStyle`：推送通知的显示样式，类型为 `DisplayStyle`。

这两个属性均为只读属性。若要更新服务端设置，应分别调用 `updatePushNickname` 和 `updatePushDisplayStyle`。

```
// 异步从服务器获取当前用户的推送显示配置。
Future<void> fetchPushDisplayAttributes() async {
  try {
    final ChatPushConfigs configs =
        await ChatClient.getInstance.pushManager.fetchPushConfigsFromServer();

    // 获取当前用户的推送显示昵称。
    final String? pushNickname = configs.displayName;

    // 获取推送通知的显示样式；Android 端的已知问题见下方说明。
    final DisplayStyle pushDisplayStyle = configs.displayStyle;

    debugPrint('Push nickname: $pushNickname');
    debugPrint('Push display style: $pushDisplayStyle');
  } on ChatError catch (error) {
    // 获取推送配置失败，根据错误码和错误信息处理。
    debugPrint(
      'Fetch push configs failed: '
      '${error.code}, ${error.description}',
    );
  }
}
```
// TODO：研发确认
:::warning
Flutter SDK 5.0.0 在 Android 端获取推送显示配置时，存在将简单样式错误解析为 `DisplayStyle.Summary` 的已知问题。该问题不影响显示样式的设置，请勿仅根据查询结果判断设置是否生效，应结合设备实际收到的离线通知验证。
:::

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`updatePushNickname`](#设置推送通知的显示属性) | `ChatPushManager` | 异步设置当前用户的推送显示昵称，返回 `Future<void>`。 |
| [`updatePushDisplayStyle`](#设置推送通知的显示属性) | `ChatPushManager` | 异步设置当前用户接收推送通知时的显示样式，返回 `Future<void>`。 |
| [`fetchPushConfigsFromServer`](#获取推送通知的显示属性) | `ChatPushManager` | 异步从服务器获取当前用户的推送显示配置，返回 `Future<ChatPushConfigs>`。 |
| [`displayName`](#获取推送通知的显示属性) | `ChatPushConfigs` | 读取当前用户的推送显示昵称，类型为 `String?`。 |
| [`displayStyle`](#获取推送通知的显示属性) | `ChatPushConfigs` | 读取解析后的显示样式，类型为 `DisplayStyle`；当前 Android 解析差异见上文说明。 |

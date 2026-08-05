# 群组 @ 消息

群组 @ 消息是指在群聊中，用户可以 @ 单个、多个或所有群成员并发送消息。群组中的每个成员均可使用 @ 功能，也可以 @ 群内所有成员。

:::tip
目前，该功能只支持文本消息和表情。
:::

例如，该功能的 UI 实现如下图所示：

1. 在输入框中输入“@”字符，选择要 @ 的群成员。
2. 选择群成员后返回聊天页面，编辑并发送消息。
3. 当前用户被 @ 时，在会话列表或消息页面显示相应提示，例如，“Somebody@You”。
4. 用户进入会话页面查看消息。

UI 实现示例图如下：

![img](/images/product/solution_common/group_mention/group_@_mobile.png)

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现过程

群组 @ 消息与普通群消息的发送流程相同。@ 功能由应用通过消息扩展字段实现，SDK 不会自动生成 @ 提示或处理相关 UI。

实现流程如下：

1. 发送方将被 @ 成员的用户 ID 写入消息扩展字段 `em_at_list`，然后发送群聊消息。
2. 接收方在 `messagesDidReceive` 回调中获取消息并解析 `ext`。
3. 如果 `em_at_list` 包含当前登录用户的用户 ID，或者其值为 `ALL`，应用应在 UI 中显示相应的 @ 提示；否则按普通群消息处理。

`em_at_list` 的数据格式如下：

- @ 单个或多个群成员：值为用户 ID 数组，例如 `"em_at_list": ["user1", "user2"]`。
- @ 群内所有成员：值为字符串 `ALL`，即 `"em_at_list": "ALL"`。

:::tip
被 @ 成员的用户 ID 不包含“@”前缀。发送方与接收方必须约定一致的字段名、字段值类型和 `ALL` 字符串。
:::

### 发送消息

发送方创建 `EMChatMessage`，将被 @ 成员的用户 ID 写入 `ext`，将 `chatType` 设置为群聊，然后发送消息。

```swift
let groupId = "groupId"
let mentionedUserIds = ["user1", "user2"]
let body = EMTextMessageBody(text: "@user1 @user2 你好")

// @ 单个或多个群成员时，em_at_list 的值为用户 ID 数组。
let ext: [String: Any] = ["em_at_list": mentionedUserIds]
let message = EMChatMessage(
    conversationID: groupId,
    body: body,
    ext: ext
)
message.chatType = .groupChat

EMClient.shared().chatManager?.send(
    message,
    progress: nil
) { _, error in
    if let error = error {
        print("群组 @ 消息发送失败：\(error.errorDescription ?? "unknown error")")
        return
    }
    print("群组 @ 消息发送成功")
}
```

若要 @ 群内所有成员，将 `em_at_list` 设置为字符串 `ALL`：

```swift
let ext: [String: Any] = ["em_at_list": "ALL"]
```

### 接收消息

接收方实现 `messagesDidReceive`，仅解析群聊文本消息的 `em_at_list` 扩展字段，并判断消息是否 @ 当前用户。

```swift
final class GroupMentionHandler: NSObject, EMChatManagerDelegate {
    func startObserving() {
        EMClient.shared().chatManager?.add(self, delegateQueue: nil)
    }

    func stopObserving() {
        EMClient.shared().chatManager?.remove(self)
    }

    func messagesDidReceive(_ messages: [EMChatMessage]) {
        for message in messages {
            guard message.chatType == .groupChat,
                  message.body.type == .text else {
                continue
            }

            handleMention(in: message)
        }
    }

    private func handleMention(in message: EMChatMessage) {
        guard let mentionValue = message.ext?["em_at_list"] else {
            return
        }

        // em_at_list 为字符串 ALL 时，表示 @ 群内所有成员。
        if let mentionTarget = mentionValue as? String,
           mentionTarget.caseInsensitiveCompare("ALL") == .orderedSame {
            // 更新 UI，显示“@所有人”等提示。
            return
        }

        // em_at_list 为字符串数组时，判断是否包含当前登录用户。
        guard let mentionedUserIds = mentionValue as? [String],
              let currentUserId = EMClient.shared().currentUsername,
              mentionedUserIds.contains(currentUserId) else {
            return
        }

        // 更新 UI，显示“有人@我”等提示。
    }
}
```

调用 `startObserving` 注册消息代理。页面或组件销毁且不再需要接收消息回调时，调用 `stopObserving` 移除同一个代理实例，避免重复回调。

## 常见问题

1. Q：@ 群内所有成员时，为何没有显示 @ 提示？

   A：请确认 `em_at_list` 的值是字符串 `ALL`。@ 功能由应用通过消息扩展实现；字段名、字段值类型或拼写不一致通常不会影响普通消息发送，但会导致接收方无法识别 @ 状态。接收方比较 `ALL` 时可以忽略大小写。

2. Q：@ 多个成员与 @ 所有成员有什么区别？

   A：@ 单个或多个成员时，`em_at_list` 的值为被 @ 成员的用户 ID 数组；@ 所有成员时，其值为字符串 `ALL`。

3. Q：SDK 是否会自动显示“有人@我”提示？

   A：不会。SDK 负责传输消息及其扩展字段，应用需要在收到消息后解析 `ext`，并自行更新会话列表或消息页面的 UI。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`initWithConversationID`](#发送消息) | `EMChatMessage` | 创建消息，并通过 `ext` 携带被 @ 成员的用户 ID 数组或字符串 `ALL`。 |
| [`chatType`](#发送消息) | `EMChatMessage` | 设置消息的会话类型；群组 @ 消息应设置为 `EMChatTypeGroupChat`。 |
| [`sendMessage`](#发送消息) | `IEMChatManager` | 发送群组 @ 消息。 |
| [`addDelegate`](#接收消息) / [`removeDelegate`](#接收消息) | `IEMChatManager` | 注册或移除消息代理。 |
| [`ext`](#接收消息) | `EMChatMessage` | 获取消息扩展字段并读取 `em_at_list`。 |
| [`currentUsername`](#接收消息) | `EMClient` | 获取当前登录用户的用户 ID。 |

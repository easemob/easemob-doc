# 群组 @ 消息

群组 @ 消息指在群组聊天中，用户可以 @ 单个、多个或所有成员，发送消息。群组中的每个成员均可使用 @ 功能，而且可以 @ 群所有成员。

:::tip
目前，该功能只支持文本消息和表情。
:::

例如，该功能的 UI 实现如下图所示：

1. 在输入框输入 "@" 字符后，选择要 @ 的群成员。
2. 选择群成员后，返回聊天界面，编辑消息，然后发送。
3. 如果有消息 @ 我，会收到会话更新，例如，“Somebody@You”。
4. 打开会话页面，查看消息。

UI 实现示例图如下所示：

![img](/images/product/solution_common/group_mention/group_@_web.png)

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现过程

在群组中，@ 某人发送消息与发送普通消息没有区别，只是被 @ 的用户在 UI 上显示会有不同。该功能可以通过扩展消息实现：

1. 发送方将要 @ 的用户的用户 ID 通过扩展字段添加到消息，并将消息发送到群组。
2. 群组成员收到消息时，检查对应的扩展字段是否存在。若存在，检查当前登录的用户 ID 是否包含在扩展字段中。
3. 若包含，需要对被 @ 的用户在 UI 上进行特殊处理，显示出相应的提示信息，如“[Somebody@You]”。若不包含，表明用户没有被 @，则 UI 无需处理。

群组 @ 消息的扩展数据结构如下：

- @ 单个或多个群组成员："em_at_list": [user1, user2, user3]
- @ 群全体成员："em_at_list":"All"

### 发送消息

发送方 @ 用户发送消息的过程如下示例代码所示。

```javascript
const message = chatSDK.message.create({
  to: "userId",
  chatType: "groupChat",
  type: "txt",
  msg: "hello",
  ext: {
    em_at_list: "ALL" || ["user1", "user2"],
  },
});

client.send(message);
```

### 接收消息

接收方收到消息时，通过解析消息扩展字段 `ext`，检查消息是否 @ 了自己，过程如下。

```javascript
receiveMessage(message){
    let mentionList = message?.ext?.em_at_list;
    // 收到文本消息            
    if (mentionList && message.from !== client.user && message.type === 'txt') {
        // 消息 @ 所有人或包含自己时，需要更新 UI。
        if (mentionList === "ALL" || mentionList.includes(client.user)) {
        }
    }
}

```

## 常见问题

1. Q：@ 群所有人时为何发消息失败？

   A：可能是 `ALL` 的拼写错误，比较时可兼容处理先统一转为小写或者大写。

2. Q：@ 多人与 @ 所有人有什么区别？  

   A：设置 `ext` 时，若 @ 单个、多个群成员，字段的值为要 @ 的用户的用户 ID 数组；@ 所有人时，字段值为 `ALL` 字符串。








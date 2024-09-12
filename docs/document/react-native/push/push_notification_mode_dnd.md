# 设置推送通知方式和免打扰模式

为优化用户在处理大量推送通知时的体验，环信即时通讯 IM 在 app 和会话层面提供了推送通知方式和免打扰模式的细粒度选项。 

**推送通知方式和免打扰模式为推送的高级功能**，若要设置，你需要在 [环信即时通讯控制台](https://console.easemob.com/user/login)的**即时通讯 > 功能配置 > 功能配置总览**页面激活推送高级功能。如需关闭推送高级功能必须联系商务，因为该操作会删除所有相关配置。

![image](/images/android/push/push_android_enable_push.png)

## 推送通知方式

推送通知方式 `remindType` 包含三种类型，如下表所示。其中，会话级别的 `remindType` 设置优先于 app 级别的设置，未设置推送通知方式的会话默认采用 app 的设置。例如，假设 app 的推送方式设置为 `MENTION_ONLY`，而指定会话的推送方式设置为 `ALL`。你会收到来自该会话的所有推送通知，而对于其他会话来说，你只会收到提及你的消息的推送通知。

<table>
<tbody>
<tr>
<td width="184">
<p><strong>推送通知方式参数</strong></p>
</td>
<td width="420">
<p><strong>描述</strong></p>
</td>
<td width="321">
<p><strong>应用范围</strong></p>
</td>
</tr>
<tr>
<td width="184">
<p>ALL</p>
</td>
<td width="420">
<p>接收所有离线消息的推送通知。</p>
</td>
<td rowspan="3" width="321">
<p>&nbsp;</p>
<p>App 或单聊/群聊会话</p>
</td>
</tr>
<tr>
<td width="184">
<p>MENTION_ONLY</p>
</td>
<td width="420">
<p>仅接收提及某些用户的消息的推送通知。</p>
<p>该参数推荐在群聊中使用。若提及一个或多个用户，需在创建消息时对 ext 字段传 "em_at_list":["user1", "user2" ...]；若提及所有人，对该字段传 "em_at_list":"all"。</p>
</td>
</tr>
<tr>
<td width="184">
<p>NONE</p>
</td>
<td width="420">
<p>不接收离线消息的推送通知。</p>
</td>
</tr>
</tbody>
</table>
<p>&nbsp;</p>

## 免打扰模式

你可以在 app 级别指定免打扰时间段和免打扰时长，即时通讯 IM 在这两个时间段内不发送离线推送通知。若既设置了免打扰时间段，又设置了免打扰时长，免打扰模式的生效时间为这两个时间段的累加。

免打扰时间参数的说明如下表所示：

| 免打扰时间参数       | 类型 |描述           | 应用范围           |
| :------------------- | :--------------------------- | :--------------------------- | :------------------- |
| `startTime` - `endTime` | Int |每天定时触发离线推送免打扰的时间段，采用 24 小时制，精确到分钟，格式为 H:M-H:M，例如 8:30-10:0，开始时间和结束时间中的小时数和分钟数的取值范围分别为 [0,23] 和 [0,59]。免打扰时间段的设置说明如下：<br/> - 开始时间和结束时间设置后，免打扰模式每天定时触发。例如，若该时间段设置为 `8:0`-`10:0`，免打扰模式在每天的 8:00-10:00 内生效。若你在 11:00 设置开始时间为 `8:0`，结束时间为 `12:0`，则免打扰模式在当天的 11:00-12:00 生效，以后每天均在 8:00-12:00 生效。<br/> - 若开始时间和结束时间相同，免打扰模式则全天生效。不过，若设置为  `0:0`-`0:0`，则关闭免打扰模式。<br/> - 若结束时间早于开始时间，则免打扰模式在每天的开始时间到次日的结束时间内生效。例如，开始时间为 `10:0`，结束时间为 `8:0`，则免打扰模式的在当天的 10:00 到次日的 8:00 生效。<br/> - 目前仅支持在每天的一个指定时间段内开启免打扰模式，不支持多个免打扰时间段，新的设置会覆盖之前的设置。<br/> - 若该参数和免打扰时长 `expireTimestamp` 均设置，免打扰模式当日在这两个时间段均生效，例如，例如，上午 8:00 将免打扰的时间段设置为 8:0-10:0，免打扰时长设置为 240 分钟（4 个小时），则 app 在当天 8:00-12:00 和以后每天 8:00-10:00 处于免打扰模式。 | 仅针对 app 生效，对单聊或群聊不生效。 |
| `expireTimestamp` | Int |免打扰时长，单位为毫秒。免打扰时长最长不超过 7 天。<br/> 与免打扰时间段（`startTime` - `endTime`）的设置每天生效不同，该参数为一次有效。设置后立即生效，例如，上午 8:00 将 app 层级的免打扰时长设置为 4 个小时，则 app 在当天 8:00-12:00 处于免打扰模式。<br/> - 若该参数和免打扰时间段均设置，免打扰模式当日在这两个时间段均生效，例如，上午 8:00 将 app 级的免打扰时间段设置为 8:00-10:00，免打扰时长设置为 4 个小时，则 app 在当前 8:00-12:00 和以后每天 8:00-10:00 处于免打扰模式。    | App 或单聊/群聊会话。|

若在免打扰时段或时长生效期间需要对指定用户推送消息，需设置[强制推送](push_extension.html#强制推送)。

**推送通知方式与免打扰时间设置之间的关系**

对于 app 和 app 中的所有会话，免打扰模式的设置优先于推送通知方式的设置。例如，假设在 app 级别指定了免打扰时间段，并将指定会话的推送通知方式设置为 `ALL`。App 在指定的时间段内进入免打扰模式，你不会收到任何推送通知。

或者，假设为会话指定了免打扰时间段，而 app 没有任何免打扰设置并且其推送通知方式设置为 `ALL`。在指定的免打扰时间段内，你不会收到来自该会话的任何推送通知，而所有其他会话的推送保持不变。  

## 设置 app 的推送通知

你可以调用 `setSilentModeForAll` 设置 app 级别的推送通知，并通过指定 `ChatSilentModeParam` 字段设置推送通知方式和免打扰模式，如下代码示例所示：

```typescript
// convId：会话 ID。
// convType：会话类型。
// 将推送通知方式设置为 `MENTION_ONLY`。
const option = ChatSilentModeParam.constructorWithNotification(
  ChatPushRemindType.MENTION_ONLY
);
// 将免打扰时长设置为 10 分钟。
const option = ChatSilentModeParam.constructorWithDuration(10);
// 将免打扰时间段设置为 10:10-11:00。
const option = ChatSilentModeParam.constructorWithPeriod({
  startTime: new ChatSilentModeTime({ hour: 10, minute: 10 }),
  endTime: new ChatSilentModeTime({ hour: 11, minute: 10 }),
});
// 设置 app 的离线推送通知。
ChatClient.getInstance()
  .pushManager.setSilentModeForAll(option)
  .then(() => {
    console.log("Succeeded in setting the push notification.");
  })
  .catch((reason) => {
    console.log("Failed to set the push notification.", reason);
  });
```

## 获取 app 的推送通知设置

你可以调用 `fetchSilentModeForAll` 获取 app 级别的推送通知设置，如以下代码示例所示：

```typescript
ChatClient.getInstance()
  .pushManager.fetchSilentModeForAll()
  .then((result) => {
    console.log("Succeeded in getting the push notification settings of the app.", result);
  })
  .catch((reason) => {
    console.log("Failed to get the push notification settings of the app.", reason);
  });
```

## 设置单个会话的推送通知

你可以调用 `setSilentModeForConversation` 方法设置指定会话的推送通知，并通过指定 `ChatSilentModeParam` 字段设置推送通知方式和免打扰模式，如以下代码示例所示：

```typescript
// convId：会话 ID。
// convType：会话类型。
// 将推送通知方式设置为 `MENTION_ONLY`。
const option = ChatSilentModeParam.constructorWithNotification(
  ChatPushRemindType.MENTION_ONLY
);
// 将免打扰时长设置为 10 分钟。
const option = ChatSilentModeParam.constructorWithDuration(10);
// 将免打扰时间段设置为 10:10-11:00。
const option = ChatSilentModeParam.constructorWithPeriod({
  startTime: new ChatSilentModeTime({ hour: 10, minute: 10 }),
  endTime: new ChatSilentModeTime({ hour: 11, minute: 10 }),
});
// 设置指定会话的推送通知。
ChatClient.getInstance()
  .pushManager.setSilentModeForConversation({
    convId,
    convType,
    option,
  })
  .then(() => {
    console.log("Succeeded in getting the push notification settings of the conversation.");
  })
  .catch((reason) => {
    console.log("Failed to get the push notification settings of the conversation.", reason);
  });
```

## 获取单个会话的推送通知

你可以调用 `fetchSilentModeForConversation` 方法获取指定会话的推送通知设置，如以下代码示例所示：

```typescript
// convId：会话 ID。
// convType：会话类型。
ChatClient.getInstance()
  .pushManager.fetchSilentModeForConversation({
    convId,
    convType,
  })
  .then(() => {
    console.log("Succeeded in getting the push notification settings of the conversation.");
  })
  .catch((reason) => {
    console.log("Failed to get the push notification settings of the conversation.", reason);
  });
```

## 获取多个会话的推送通知设置

1. 你可以在每次调用中最多获取 20 个会话的推送通知设置。

2. 如果会话使用了 app 设置或其推送通知设置已过期，则返回的字典不包含此会话。

你可以调用 `fetchSilentModeForConversations` 方法获取多个会话的推送通知设置，如以下示例代码所示：

```typescript
// conversations：会话列表。
ChatClient.getInstance()
  .pushManager.fetchSilentModeForConversations(conversations)
  .then(() => {
    console.log("Succeeded in getting the conversation list.");
  })
  .catch((reason) => {
    console.log("Failed to get the conversation list.", reason);
  });
```

## 清除单个会话的推送通知方式的设置

你可以调用 `removeSilentModeForConversation` 方法清除指定会话的推送通知方式的设置。清除后，默认情况下，该会话会使用 app 的设置。

以下代码示例显示了如何清除会话的推送通知方式：

```typescript
// convId：会话 ID。
// convType：会话类型。
ChatClient.getInstance()
  .pushManager.removeSilentModeForConversation({
    convId,
    convType,
  })
  .then(() => {
    console.log("Succeeded in deleting the push notification settings of the conversation.");
  })
  .catch((reason) => {
    console.log("Failed to delete the push notification settings of the conversation.", reason);
  });
```
# 设置推送通知方式和免打扰模式

为优化用户在处理大量推送通知时的体验，即时通讯 IM 在 app 和会话层面提供了推送通知方式和免打扰模式的细粒度选项。 

**推送通知方式和免打扰模式为推送的高级功能**，若要设置，你需要在 [环信即时通讯控制台](https://console.easemob.com/user/login)的**即时通讯 > 功能配置 > 功能配置总览**页面激活推送高级功能。如需关闭推送高级功能必须联系商务，因为该操作会删除所有相关配置。

![image](/images/android/push/push_android_enable_push.png)

## 推送通知方式

推送通知方式 `ChatPushRemindType` 包含三种类型，如下表所示。其中，会话级别的 `ChatPushRemindType` 设置优先于 app 级别的设置，未设置推送通知方式的会话默认采用 app 的设置。例如，假设 app 的推送方式设置为 `MENTION_ONLY`，而指定会话的推送方式设置为 `ALL`。你会收到来自该会话的所有推送通知，而对于其他会话来说，你只会收到提及你的消息的推送通知。

| 参数     | 描述   | App  | 单聊和群聊会话  |
| :------- | :----- | :----- | :----- |
| `ALL` | 接收所有离线消息的推送通知。 | ✓ | ✓ |
| `MENTION_ONLY` | 仅接收提及消息的推送通知。<br/>该参数推荐在群聊中使用。若提及一个或多个用户，需在创建消息时对 `ext` 字段传 "em_at_list":["user1", "user2" ...]；若提及所有人，对该字段传 "em_at_list":"all"。 | ✓ | ✓ |
| `NONE`   | 不接收离线消息的推送通知。 | ✓     | ✓ |

### 从服务器获取所有会话的推送通知方式设置

你可以调用 `EMPushManager#syncConversationsSilentMode` 方法从服务器同步所有会话的推送通知方式设置。同步后成功后的结果会存储到本地数据库，然后你可以通过`EMConversation#remindType` 查询当前会话的推送通知方式。

```dart
//同步会话的推送通知方式
await EMClient.getInstance.pushManager.syncConversationsSilentMode();

//查询会话的推送通知方式
    EMConversation? conversation =
        await EMClient.getInstance.chatManager.getConversation(
      conversationId,
    );
    ChatPushRemindType? remindType = await conversation?.remindType();
    debugPrint(remindType.toString());
```

### 本地设置推送通知方式

在本机上调用 `EMPushManager#setConversationSilentMode` 设置会话的推送通知方式，在多设备事件 `EMMultiDeviceListener#onConversationEvent` 里会回调当前操作，此时参数 `event` 的值为 `EMMultiDeviceListener#CONVERSATION_MUTE_INFO_CHANGED`。

```dart
  //对会话设置推送通知方式
  await EMClient.getInstance.pushManager.setConversationSilentMode(
    conversationId: conversationId,
    type: type,
    param: ChatSilentModeParam.remindType(
      ChatPushRemindType.MENTION_ONLY,
    ),
  );

  //多设备事件
  EMClient.getInstance.addMultiDeviceEventHandler('Identifier', EMMultiDeviceEventHandler(
    onConversationEvent: (event, conversationId, type) {
    },
  ));

```

## 免打扰模式

在你完成 SDK 初始化和成功登录 app 后，可以对 app 以及各类型的会话开启离线推送功能以及通过设置免打扰模式关闭推送。

你可以在 app 级别指定免打扰时间段和免打扰时长，即时通讯 IM 在这两个时间段内不发送离线推送通知。若既设置了免打扰时间段，又设置了免打扰时长，免打扰模式的生效时间为这两个时间段的累加。

免打扰时间参数的说明如下表所示：

| 免打扰时间参数       | 类型 | 描述       | 应用范围           |
| :------------- | :---------------- | :-------------- | :-------- |
| `silentModeInterval` | Int | 每天定时触发离线推送免打扰的时间段，采用 24 小时制，精确到分钟，格式为 H:M-H:M，例如 8:30-10:0，开始时间和结束时间中的小时数和分钟数的取值范围分别为 [0,23] 和 [0,59]。免打扰时间段的设置说明如下：<br/> - 开始时间和结束时间设置后，免打扰模式每天定时触发。例如，若该时间段设置为 `8:0`-`10:0`，免打扰模式在每天的 8:00-10:00 内生效。若你在 11:00 设置开始时间为 8:0，结束时间为 12:0，则免打扰模式在当天的 11:00-12:00 生效，以后每天均在 8:00-12:00 生效。<br/> - 若开始时间和结束时间相同，免打扰模式则全天生效。不过，若设置为 `0:0-0:0`，则关闭免打扰模式。<br/> - 若结束时间早于开始时间，则免打扰模式在每天的开始时间到次日的结束时间内生效。例如，开始时间为 `10:0`，结束时间为 `8:0`，则免打扰模式的在当天的 10:00 到次日的 8:00 生效。<br/> - 目前仅支持在每天的一个指定时间段内开启免打扰模式，不支持多个免打扰时间段，新的设置会覆盖之前的设置。<br/> - 若该参数和 `silentDuration` 均设置，免打扰模式当日在这两个时间段均生效，例如，例如，上午 8:00 将 `silentModeInterval` 设置为 8:0-10:0，`silentDuration` 设置为 240 分钟（4 个小时），则 app 在当天 8:00-12:00 和以后每天 8:00-10:00 处于免打扰模式。| 仅针对 app 生效，对单聊或群聊不生效。 |
| `silentDuration`| Int | 免打扰时长，单位为分钟。免打扰时长的取值范围为 [0,10080]，`0` 表示该参数无效，`10080` 表示免打扰模式持续 7 天。<br/> - 与免打扰时间段的设置每天生效不同，该参数为一次有效。设置后立即生效，例如，上午 8:00 将 app 层级的 `silentDuration` 设置为 240 分钟（4 个小时），则 app 在当天 8:00-12:00 处于免打扰模式。<br/> - 若该参数和 `silentModeInterval` 均设置，免打扰模式当日在这两个时间段均生效，例如，上午 8:00 将 app 级的 `silentModeInterval` 设置为 8:00-10:00，免打扰时长设置为 240 分钟（4 个小时），则 app 在当前 8:00-12:00 和以后每天 8:00-10:00 处于免打扰模式。    | App 或单聊/群聊会话。 |

:::tip
若在免打扰时段或时长生效期间需要对指定用户推送消息，需设置[强制推送](push_extension.html#强制推送)。
:::

**推送通知方式与免打扰时间设置之间的关系**

对于 app 和 app 中的所有会话，免打扰模式的设置优先于[推送通知方式](#推送通知方式)的设置。例如，假设在 app 级别指定了免打扰时间段，并将指定会话的推送通知方式设置为 `ALL`。App 在指定的时间段内进入免打扰模式，你不会收到任何推送通知。或者，假设为会话指定了免打扰时间段，而 app 没有任何免打扰设置并且其推送通知方式设置为 `ALL`。在指定的免打扰时间段内，你不会收到来自该会话的任何推送通知，而所有其他会话的推送保持不变。  

## 设置 app 的推送通知

你可以调用 `setSilentModeForAll` 方法设置 app 级别的推送通知，并通过指定 `ChatSilentModeParam` 字段设置推送通知方式和免打扰模式，如下代码示例所示：

```dart
//设置推送通知方式为 `MENTION_ONLY`。
ChatSilentModeParam param = ChatSilentModeParam.remindType(ChatPushRemindType.MENTION_ONLY);

//设置离线推送免打扰时长为 15 分钟。
ChatSilentModeParam param = ChatSilentModeParam.silentDuration(15);

//设置离线推送的免打扰时间段为 8:30 至 15:00。
ChatSilentModeParam param = ChatSilentModeParam.silentModeInterval(
  startTime: ChatSilentModeTime(hour: 8, minute: 30),
  endTime: ChatSilentModeTime(hour: 15, minute: 0),
);

try {
  //设置 app 的离线推送通知。
  await EMClient.getInstance.pushManager.setSilentModeForAll(param: param);
} on EMError catch (e) {}
```

## 获取 app 的推送通知设置

你可以调用 `fetchSilentModeForAll` 方法获取 app 级别的推送通知设置，如以下代码示例所示：

```dart
try {
  ChatSilentModeResult result =
      await EMClient.getInstance.pushManager.fetchSilentModeForAll();
  // 获取 app 的推送通知方式的设置。
  ChatPushRemindType? remindType = result.remindType;

  // 获取 app 的离线推送免打扰过期的 Unix 时间戳。
  int? timestamp = result.expireTimestamp;

  // 获取 app 的离线推送免打扰时间段的开始时间。
  ChatSilentModeTime? startTime = result.startTime;
  // 免打扰时间段的开始时间中的小时数。
  startTime?.hour;
  // 免打扰时间段的开始时间中的分钟数。
  startTime?.minute;

  // 获取 app 的离线推送免打扰时间段的结束时间。
  ChatSilentModeTime? endTime = result.endTime;
  // 免打扰时间段的结束时间中的小时数。
  endTime?.hour;
  // 免打扰时间段的结束时间中的分钟数。
  endTime?.minute;
} on EMError catch (e) {}
```

## 设置单个会话的推送通知

你可以调用 `setConversationSilentMode` 方法设置指定会话的推送通知，并通过指定 `ChatSilentModeParam` 字段设置推送通知方式和免打扰模式，如以下代码示例所示：

```dart
//设置推送通知方式为 `MENTION_ONLY`。
ChatSilentModeParam param = ChatSilentModeParam.remindType(ChatPushRemindType.MENTION_ONLY);

//设置离线推送免打扰时长为 15 分钟。
ChatSilentModeParam param = ChatSilentModeParam.silentDuration(15);

try {
  //设置会话的离线推送免打扰模式。目前，暂不支持设置会话免打扰时间段。
  EMClient.getInstance.pushManager.setConversationSilentMode(
    conversationId: conversationId,
    type: conversationType,
    param: param,
  );
} on EMError catch (e) {}
```

## 获取单个会话的推送通知设置

你可以调用 `fetchConversationSilentMode` 方法获取指定会话的推送通知设置，如以下代码示例所示：

```dart
try {
  //设置会话的离线推送免打扰模式。目前，暂不支持设置会话免打扰时间段。
  ChatSilentModeResult result =
      await EMClient.getInstance.pushManager.fetchConversationSilentMode(
    conversationId: conversationId,
    type: conversationType,
  );

  //获取会话的推送通知方式。
  result.remindType;

  // 获取会话的离线推送免打扰过期 Unix 时间戳。
  result.expireTimestamp;
} on EMError catch (e) {}
```

## 获取多个会话的推送通知设置

1. 你可以在每次调用中最多获取 20 个会话的推送通知设置。

2. 如果会话使用了 app 设置或其推送通知设置已过期，则返回的字典不包含此会话。

你可以调用 `fetchSilentModeForConversations` 方法获取多个会话的推送通知设置，如以下示例代码所示：

```dart
try {
  Map<String, ChatSilentModeResult> map = await EMClient.getInstance.pushManager.fetchSilentModeForConversations(conversationList);
} on EMError catch (e) {}
```

## 清除单个会话的推送通知方式的设置

你可以调用 `removeConversationSilentMode` 方法清除指定会话的推送通知方式的设置。清除后，默认情况下，该会话会使用 app 的设置。

以下代码示例显示了如何清除会话的推送通知方式：

```dart
try {
  await EMClient.getInstance.pushManager.removeConversationSilentMode(conversationId: conversationId, type: conversationType);
} on EMError catch (e) {}
```

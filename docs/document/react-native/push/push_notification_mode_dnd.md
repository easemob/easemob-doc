# 设置推送通知方式和免打扰模式

为优化用户在处理大量推送通知时的体验，SDK 在全局和会话层面提供了推送通知方式和免打扰模式的细粒度配置功能。你可以基于推送通知方式、指定免打扰时长或每日时间段，对离线推送进行统一控制。

本文中的全局设置指当前登录用户在 App 内的推送接收规则，不是修改 App Key 下所有用户的配置。调用接口前，需完成 SDK 初始化并成功登录；设备推送配置和 Token 绑定详见 [离线推送概述](push_overview.html)。

## 开通功能

[推送通知方式](push_notification_mode_dnd.html#推送通知方式) 和 [免打扰模式](push_notification_mode_dnd.html#免打扰模式) 是推送的高级功能。使用前，你需要在 [环信控制台](https://console.easemob.com/user/login) 免费开通。**激活后，如需关闭推送高级功能，必须联系商务，因为该操作会删除高级功能相关的所有配置。**

1. 登录 [环信控制台](https://console.easemob.com/user/login)。
2. 选择页面上方的 **应用管理**。在弹出的应用列表页面，单击你的测试版或正式版应用的 App Key。
3. 选择 **即时通讯 > 推送配置 > 离线推送配置**。
4. 点击 **免费开通**。

![开通推送高级功能](/images/android/push/push_advanced_feature_enable.png)

## 推送通知方式

推送通知方式 `ChatPushRemindType` 包含三种类型，如下表所示。该设置适用于 App 全局以及单聊和群聊具体会话。**会话级别的推送通知方式设置优先于全局级别设置**，未设置推送通知方式的会话默认继承全局设置。

例如，假设全局推送方式设置为 `MENTION_ONLY`，而指定会话的推送方式设置为 `ALL`。你会收到来自该会话的所有推送通知，而对于其他会话来说，你只会收到提及你的消息的推送通知。

| 推送通知方式 | 描述 |
| :---- | :------------- |
| `ChatPushRemindType.ALL` | 接收所有离线消息的推送通知。 |
| `ChatPushRemindType.MENTION_ONLY` | 仅接收提及当前用户的消息推送通知。该参数通常适合群聊场景。若消息需要提及一个或多个用户，可在发消息时通过 `ChatMessage.attributes` 设置 `em_at_list: ['user1', 'user2']`；若提及所有人，则设置 `em_at_list: 'all'`。SDK 的 `attributes` 对应服务端消息 JSON 的 `ext`，无需再嵌套 `ext`。 |
| `ChatPushRemindType.NONE` | 不接收离线消息的推送通知。 |

### 清除指定会话的推送通知方式设置

调用 `ChatPushManager#removeSilentModeForConversation` 清除指定会话单独设置的推送通知方式。清除后，该会话继承当前登录用户的全局推送通知方式。该接口仅清除会话的推送通知方式设置，不是清除所有免打扰规则的通用接口，也不应将其视为取消一次性免打扰时长的接口。

```typescript
async function clearConversationRemindType(
  convId: string,
  convType: ChatConversationType
): Promise<void> {
  try {
    // 清除会话单独设置的推送通知方式，恢复继承全局推送通知方式
    await ChatClient.getInstance().pushManager.removeSilentModeForConversation({
      convId,
      convType,
    });
    console.log('会话推送通知方式设置已清除');
  } catch (error: unknown) {
    // 处理清除失败
    console.error('清除会话推送通知方式失败：', error);
  }
}
```

另外，你可以设置和获取指定会话的推送通知方式：

- 调用 `ChatPushManager#setSilentModeForConversation` 设置指定单聊或群聊会话的推送通知方式。详见 [设置指定会话的推送接收规则](#设置指定会话的推送接收规则)。
- 调用 `ChatPushManager#fetchSilentModeForConversation` 获取指定单聊或群聊会话的推送通知方式。详见 [获取指定会话的推送通知方式](#获取指定会话的推送接收规则)。

## 免打扰模式

完成 SDK 初始化并成功登录后，你可以为 App 全局或指定单聊、群聊会话设置免打扰模式。免打扰模式生效期间，环信 IM 不会向对应范围内的离线用户发送推送通知。

SDK 通过 `ChatSilentModeParam` 配置免打扰规则，支持以下两种模式，分别对应 `ChatSilentModeParamType` 中的枚举值：

- `SILENT_MODE_DURATION`（一次性免打扰）：通过 `ChatSilentModeParam#constructorWithDuration` 设置，立即生效，到期后自动恢复，适用于临时不希望被打扰的场景。
- `SILENT_MODE_INTERVAL`（每日循环免打扰）：通过 `ChatSilentModeParam#constructorWithPeriod` 设置一个每日循环生效的时间段，例如从 `23:00` 到次日 `07:00`，适用于固定的休息时间。

免打扰时间参数的说明如下表所示：

| 规则模式               | 配置方法                                    | 类型               | 描述                                                         | 生效范围                       |
| :--------------------- | :------------------------------------------ | :----------------- | :----------------------------------------------------------- | :----------------------------- |
| `SILENT_MODE_INTERVAL` | `ChatSilentModeParam#constructorWithPeriod({ startTime, endTime })` | `ChatSilentModeTime` | 每日循环生效的免打扰时段，采用 24 小时制，精确到分钟。`startTime` 和 `endTime` 的小时取值范围为 `0`–`23`，分钟取值范围为 `0`–`59`。<br/> - **每日定时触发**：设置后，每天在指定时段自动进入免打扰模式。<br/> - **跨天支持**：若结束时间早于开始时间，则时段跨天生效。例如，设置为 `10:00`–`08:00`，表示当日 `10:00` 至次日 `08:00` 免打扰。<br/> - **全天与关闭**：开始和结束时间相同时，视为全天免打扰；设置为 `00:00`–`00:00` 时，关闭每日循环免打扰时段。<br/> - **单时段限制**：每天仅支持设置一个免打扰时段；新配置会覆盖旧配置。<br/> - **生效时机**：设置后立即生效。例如，当日 `11:00` 设置 `08:00`–`12:00`，则当天从 `11:00` 起生效至 `12:00`，此后每天按 `08:00`–`12:00` 执行。 | 仅 App 全局。                  |
| `SILENT_MODE_DURATION` | `ChatSilentModeParam#constructorWithDuration(duration)` | `number` | 一次性生效的免打扰持续时长，单位为分钟，应传入整数，取值范围为 `0`–`10080`（0 至 7 天）。其中，`0` 表示该参数无效。<br/> - **一次有效**：该模式设置后立即开始计时，不会按天重复触发。<br/> - **生效示例**：上午 `08:00` 设置 `duration = 240`，则当天 `08:00`–`12:00` 处于免打扰模式。 | App 全局或指定单聊、群聊会话。 |

表中的 `duration` 是传给构造方法的分钟数，对应 `ChatSilentModeParam.duration` 属性；`startTime`、`endTime` 需传入 `ChatSilentModeTime` 对象，而不是时间字符串或整数。TypeScript 构造方法没有检查上述取值范围，业务侧应传入有效的非空参数，并处理设置失败。

**`SILENT_MODE_INTERVAL` 和 `SILENT_MODE_DURATION` 同时设置时的叠加规则**

- 两者按各自的生效范围和时间 **叠加生效**，重叠时段不重复计时。
- 自次日起，只有每日循环免打扰时段继续生效；一次性免打扰时长不会重复触发。

**示例**：上午 `08:00` 设置每日免打扰时段为 `08:00`–`10:00`，同时设置 `duration = 240`（4 小时）：

- **当日**：`08:00`–`12:00` 免打扰。
- **次日起**：每天 `08:00`–`10:00` 免打扰。

每次设置只应指定一种规则模式；若需设置多种规则，应分别创建 `ChatSilentModeParam` 参数并调用设置接口，不要在一个参数对象中混合设置时段和时长。

**推送通知方式与免打扰模式的关系**

免打扰模式的优先级高于推送通知方式。例如，某个会话的推送通知方式设置为 `ALL`，但该会话当前命中免打扰时长，或 App 全局当前命中免打扰时段，则免打扰生效期间不会收到该会话的离线推送通知。

如果仅为某个会话设置一次性免打扰，而 App 全局未设置免打扰，则只有该会话在免打扰生效期间不发送离线推送通知；其他会话仍按照各自的推送通知方式或继承的全局设置发送推送通知。会话级别不支持每日循环免打扰时段，不能将全局时段设置直接套用于会话。

:::tip
若需在免打扰生效期间仍向指定用户发送离线推送通知，可设置 [强制推送](1_push_extension.html#强制推送)。
:::

## 设置全局推送接收规则

调用 `ChatPushManager#setSilentModeForAll` 设置当前登录用户的全局推送接收规则。通过 `ChatSilentModeParam` 选择本次要设置的推送通知方式、免打扰时长或每日免打扰时段。`option` 参数必填，无默认值；该方法返回 `Promise<void>`。

```typescript
async function setGlobalPushRule(): Promise<void> {
  // 设置推送通知方式为 MENTION_ONLY
  const remindParam = ChatSilentModeParam.constructorWithNotification(
    ChatPushRemindType.MENTION_ONLY
  );

  // 设置离线推送免打扰时长为 15 分钟
  const durationParam = ChatSilentModeParam.constructorWithDuration(15);

  // 设置每日免打扰时段为 08:30 至 15:00，仅支持 App 全局
  const intervalParam = ChatSilentModeParam.constructorWithPeriod({
    startTime: new ChatSilentModeTime({ hour: 8, minute: 30 }),
    endTime: new ChatSilentModeTime({ hour: 15, minute: 0 }),
  });

  // 三种参数按需选用一个；本次选择免打扰时长
  // 如需设置其他规则，改为 remindParam 或 intervalParam
  const option = durationParam;

  try {
    // 设置全局推送接收规则；await 正常返回表示设置成功
    await ChatClient.getInstance().pushManager.setSilentModeForAll(option);
    console.log('全局推送接收规则已更新');
  } catch (error: unknown) {
    // 处理设置失败
    console.error('设置全局推送接收规则失败：', error);
  }
}
```

## 获取全局推送接收规则

调用 `ChatPushManager#fetchSilentModeForAll` 获取当前登录用户的全局推送接收规则。该方法返回 `Promise<ChatSilentModeResult>`，通过 `await` 获取结果。

```typescript
async function fetchGlobalPushRule(): Promise<void> {
  try {
    // 从服务器获取当前登录用户的全局推送接收规则
    const result = await ChatClient.getInstance().pushManager
      .fetchSilentModeForAll();

    // 读取全局推送通知方式
    const remindType = result.remindType;
    // 读取一次性免打扰的到期 Unix 时间戳，单位为毫秒，不是剩余分钟数
    const expireTimestamp = result.expireTimestamp;

    // 读取每日免打扰时段的开始时间
    const startTime = result.startTime;
    // 读取开始时间的小时数和分钟数，兼容未返回时段的情况
    const startHour = startTime?.hour;
    const startMinute = startTime?.minute;

    // 读取每日免打扰时段的结束时间
    const endTime = result.endTime;
    // 读取结束时间的小时数和分钟数
    const endHour = endTime?.hour;
    const endMinute = endTime?.minute;

    console.log('全局推送通知方式及免打扰到期时间：', remindType, expireTimestamp);
    console.log('每日免打扰时段：', startHour, startMinute, endHour, endMinute);
  } catch (error: unknown) {
    // 处理查询失败
    console.error('获取全局推送接收规则失败：', error);
  }
}
```

// TODO：研发确认，需要下面的吗？

:::notice
`remindType`、`expireTimestamp`、`startTime` 和 `endTime` 均为可选字段，读取时应兼容 `undefined`。Android 端不返回值为 `0` 的 `expireTimestamp`；iOS 端可返回 `0`。不要将缺少字段直接解释为指定规则已启用，也不要用全局查询结果中的会话字段定位具体会话。

该说明同样适用于下方单个和批量会话查询。批量查询时应使用返回 Map 的键匹配会话。
:::

## 设置指定会话的推送接收规则

调用 `ChatPushManager#setSilentModeForConversation` 设置指定单聊或群聊会话的推送接收规则。通过必填的 `option` 参数传入 `ChatSilentModeParam`，选择推送通知方式或一次性免打扰时长；该参数无默认值。目前不支持设置会话的每日免打扰时段。

```typescript
async function setConversationPushRule(
  convId: string,
  convType: ChatConversationType
): Promise<void> {
  // 设置推送通知方式为 MENTION_ONLY
  const remindParam = ChatSilentModeParam.constructorWithNotification(
    ChatPushRemindType.MENTION_ONLY
  );

  // 设置一次性离线推送免打扰时长为 15 分钟
  const durationParam = ChatSilentModeParam.constructorWithDuration(15);

  // 两种参数按需选用一个；如需设置推送通知方式，改为 remindParam
  const option = durationParam;

  try {
    // 设置指定会话的规则；convType 为 ChatConversationType
    await ChatClient.getInstance().pushManager.setSilentModeForConversation({
      convId,
      convType,
      option,
    });
    // 返回类型为 Promise<void>，不返回规则对象
    console.log('会话推送接收规则已更新');
  } catch (error: unknown) {
    // 处理设置失败
    console.error('设置会话推送接收规则失败：', error);
  }
}
```

## 获取指定会话的推送接收规则

调用 `ChatPushManager#fetchSilentModeForConversation` 获取指定会话的推送接收规则，返回 `Promise<ChatSilentModeResult>`。

// TODO：研发确认，需要下面的吗？
`ChatSilentModeResult` 未提供会话是否单独设置推送通知方式的标记。不能凭 `result.remindType` 是否非空判断会话是否单独设置了推送通知方式，也不能用它区分显式设置与继承全局设置。

```typescript
async function fetchConversationPushRule(
  convId: string,
  convType: ChatConversationType
): Promise<void> {
  try {
    // 从服务器获取指定会话的推送接收规则
    const result = await ChatClient.getInstance().pushManager
      .fetchSilentModeForConversation({ convId, convType });

    // 读取返回的推送通知方式；不能据此判断是否为会话单独设置的值
    const remindType = result.remindType;
    // 读取该会话一次性免打扰的到期 Unix 时间戳，单位为毫秒
    const expireTimestamp = result.expireTimestamp;
    console.log('会话推送通知方式：', remindType);
    console.log('会话免打扰到期时间：', expireTimestamp);
  } catch (error: unknown) {
    // 处理查询失败
    console.error('获取会话推送接收规则失败：', error);
  }
}
```

## 批量获取会话的推送接收规则

1. 每次调用最多获取 20 个会话的设置。
2. 如果会话继承了全局设置或其推送通知设置已过期，则返回的字典不包含此会话。不要把返回字典缺少某个会话解释为该会话一定处于免打扰状态。

调用 `ChatPushManager#fetchSilentModeForConversations` 获取多个会话的推送接收规则。参数为必填的 `ChatConversation[]`，无默认值，不是会话 ID 字符串列表；返回 `Promise<Map<string, ChatSilentModeResult>>`，Map 的键为会话 ID，值为该会话的规则对象。输入列表中的会话 ID 不应重复。

```typescript
async function fetchConversationPushRules(
  conversationList: ChatConversation[]
): Promise<void> {
  // 业务侧检查单次批量查询数量，并提前准备已有的单聊或群聊会话对象
  if (conversationList.length === 0 || conversationList.length > 20) {
    console.warn('每次请传入 1 至 20 个会话');
    return;
  }

  try {
    // 批量从服务器获取规则；按返回 Map 的会话 ID 匹配本地会话
    const results = await ChatClient.getInstance().pushManager
      .fetchSilentModeForConversations(conversationList);
    for (const [conversationId, rule] of results) {
      // Map 的键为本条结果对应的会话 ID，值为该会话的推送接收规则
      console.log('会话推送接收规则：', conversationId,
        rule.remindType, rule.expireTimestamp);
    }
  } catch (error: unknown) {
    // 处理批量查询失败
    console.error('批量获取会话推送接收规则失败：', error);
  }
}
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`getAllConversations`](#获取所有会话的推送通知方式设置) | `ChatManager` | 获取本地会话列表，读取各会话的 `remindType` 属性；不主动从服务器同步推送规则。 |
| [`setSilentModeForConversation`](#设置指定会话的推送通知方式) | `ChatPushManager` | 设置指定会话的推送通知方式或一次性免打扰时长，返回 `Promise<void>`。 |
| [`fetchSilentModeForConversation`](#获取指定会话的推送接收规则) | `ChatPushManager` | 获取指定会话的推送接收规则，返回 `Promise<ChatSilentModeResult>`。 |
| [`setSilentModeForAll`](#设置全局推送接收规则) | `ChatPushManager` | 设置当前登录用户的全局推送接收规则，返回 `Promise<void>`。 |
| [`fetchSilentModeForAll`](#获取全局推送接收规则) | `ChatPushManager` | 获取全局推送接收规则，返回 `Promise<ChatSilentModeResult>`。 |
| [`fetchSilentModeForConversations`](#批量获取会话的推送接收规则) | `ChatPushManager` | 批量获取最多 20 个会话的推送接收规则，返回 `Promise<Map<string, ChatSilentModeResult>>`。 |
| [`removeSilentModeForConversation`](#清除指定会话的推送通知方式设置) | `ChatPushManager` | 清除会话单独设置的推送通知方式，恢复继承全局推送通知方式。 |

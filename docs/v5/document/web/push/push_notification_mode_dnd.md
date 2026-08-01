# 设置推送通知方式和免打扰模式

为优化用户在处理大量推送通知时的体验，SDK 在全局和会话层面通过 `client.pushManager` 提供了推送通知方式和免打扰模式的细粒度配置功能。你可以基于推送通知方式、指定时长或每日时间段，对移动端离线推送进行统一控制。

## 开通功能

[推送通知方式](push_notification_mode_dnd.html#推送通知方式) 和 [免打扰模式](push_notification_mode_dnd.html#免打扰模式) 是推送的高级功能。使用前，你需要在 [环信控制台](https://console.easemob.com/user/login) 免费开通。**激活后，如需关闭推送高级功能，必须联系商务，因为该操作会删除高级功能相关的所有配置。**

1. 登录 [环信控制台](https://console.easemob.com/user/login)。
2. 选择页面上方的 **应用管理**。在弹出的应用列表页面，单击你的应用的测试版或正式版的 App Key。
3. 选择 **增值服务 > 消息推送 > 离线推送**。
4. 点击 **免费开通**。

![image](/images/android/push/push_advanced_feature_enable.png)

## 推送通知方式

推送通知方式 包含三种类型，如下表所示。该设置适用于 App 全局以及单聊和群聊具体会话。**会话级别的推送通知方式设置优先于全局级别设置**，未设置推送通知方式的会话默认继承全局设置。

例如，假设全局推送方式设置为 `AT`，而指定会话的推送方式设置为 `ALL`。你会收到来自该会话的所有推送通知，而对于其他会话来说，你只会收到提及你的消息的推送通知。

| 推送通知方式 | 描述            | 
| :---- | :------------- |
| `ALL`          | 接收所有离线消息的推送通知。                                 |
| `AT`           | 仅接收提及当前用户的消息推送通知。 该参数通常更适合群聊场景。若消息需要提及一个或多个用户，可在发消息时通过消息扩展字段 ext 字段传 "em_at_list":["user1", "user2" ...]；若提及所有人，对该字段传 "em_at_list":"all"。 |
| `NONE`        | 不接收离线消息的推送通知。                                   |

## 免打扰模式

完成 SDK 初始化并成功登录后，你可以为全局（App 级别）或指定会话设置免打扰模式。免打扰模式生效期间，环信 IM 不会向对应范围内的离线用户发送推送通知。

免打扰模式支持以下两种类型：

- `DURATION`（一次性免打扰）：设置后立即生效，到期后自动恢复，适用于临时不希望被打扰的场景。
- `INTERVAL`（每日循环免打扰）：设置一个每日循环生效的时间段，例如从 `23:00` 到次日 `07:00`，适用于固定的休息时间。

免打扰时间参数的说明如下表所示：

| 规则模式 | 参数 | 类型 | 描述 | 生效范围 |
| :--- | :--- | :--- | :--- | :--- |
| `INTERVAL` | `startTime` 和 `endTime` | Object | 每日循环生效的免打扰时段，采用 24 小时制，精确到分钟，格式为 `{ hours, minutes }`。取值范围：小时 0–23，分钟 0–59。<br/> - **每日定时触发**：设置后，每天在指定时段自动进入免打扰模式。、<br/> - **跨天支持**：若结束时间早于开始时间，则时段跨天生效（从当日开始时间延续至次日结束时间）。例如，设置为 10:00–8:00 表示当日 10:00 至次日 8:00 免打扰。<br/> - **全天与关闭**：开始与结束时间相同时，视为全天生效；设置为 0:00–0:00 用于关闭免打扰模式。<br/> - **单时段限制**：仅支持设置一个每日免打扰时段，新配置覆盖旧配置。<br/> - **生效时机**：设置后立即生效。例如，当日 11:00 设置 8:00–12:00，则当天从 11:00 起生效至 12:00，此后每日按 8:00–12:00 执行。 | 仅 App 全局。 |
| `DURATION` | `duration` | Int | 一次性生效的免打扰持续时长，单位为分钟。取值范围：`0`–`10080`（即 0 到 7 天），其中 `0` 表示该参数无效。<br/> - **一次有效**：与每日循环的“免打扰时间段”不同，本参数为单次生效，设置后立即开始计时。<br/> - **生效示例**：上午 8:00 设置 `duration = 240`（4 小时），则 App 在当天 8:00–12:00 处于免打扰模式。 | App 全局或指定单聊、群聊会话。 |

**`INTERVAL` 和 `DURATION` 同时设置时的叠加规则**

- 当天两者 **叠加生效**，重叠部分不重复计时。
- 自次日起，仅 “免打扰时段” 继续每日循环生效，“免打扰时长” 不再重复触发。

**示例**：上午 8:00 将 `startTime/endTime` 设置为 8:00–10:00，同时 `duration = 240`（4 小时），则：

- **当日**：8:00–12:00 免打扰（8:00–10:00 来自时段设置，10:00–12:00 来自时长设置）。
- **次日起**：每天 8:00–10:00 免打扰（仅时段设置生效）。

**推送通知方式与免打扰模式的关系**

免打扰模式的优先级高于推送通知方式。例如，某个会话的推送通知方式设置为 `ALL`，但该会话当前命中了免打扰时间段或免打扰时长，则在免打扰生效期间，你仍不会收到该会话的离线推送通知。

如果仅为某个会话设置一次性免打扰，而 App 全局未设置免打扰，则只有该会话在免打扰生效期间不发送离线推送通知；其他会话仍按照各自的推送通知方式或继承的全局设置发送推送通知。

## 设置全局推送接收规则

你可以调用 `client.pushManager.setGlobalSilentMode` 设置全局级别的推送通知的接收规则，并通过 `rule.mode` 指定规则类型：

- `REMIND_TYPE`：设置推送通知模式，可选值为 `ALL`、`AT` 或 `NONE`。
- `DURATION`：设置一次性免打扰时长。
- `INTERVAL`：设置每日循环生效的免打扰时间段。

```typescript
await client.pushManager.setGlobalSilentMode({
  rule: {
    mode: 'REMIND_TYPE',
    remindType: 'ALL', // 可设置为 `ALL`、`AT` 或 `NONE`。
  },
});

await client.pushManager.setGlobalSilentMode({
  rule: {
    mode: 'DURATION',
    duration: 7200, // 一次性免打扰时长。
  },
});

await client.pushManager.setGlobalSilentMode({
  rule: {
    mode: 'INTERVAL', // 每日循环的免打扰时间段
    startTime: {
      hours: 8,
      minutes: 0,
    },
    endTime: {
      hours: 12,
      minutes: 0,
    },
  },
});
```

## 获取全局推送接收规则

你可以调用 `client.pushManager.getGlobalSilentMode` 获取全局离线推送通知的接收设置，示例代码如下：

```typescript
const result = await client.pushManager.getGlobalSilentMode();
```

## 获取已设置推送通知方式的会话列表

你可以调用 `client.pushManager.getConversationListByRemindType` 方法获取已经设置了推送通知方式的会话列表。

[推送通知方式](#推送通知方式)包含以下三类：
- **ALL**：接收所有离线消息的推送通知。
- **AT**：仅接收提及当前用户的消息的推送通知。
- **NONE**：不接收离线消息的推送通知。

在 SDK 中，该接口基于本地会话缓存分页过滤已设置推送通知方式的会话。分页游标由 SDK 本地生成并返回。

```typescript
const result = await client.pushManager.getConversationListByRemindType({
  // 每页获取的会话数量。取值范围为 [1,100]，默认值为 10。
  pageSize: 10,
  // 分页游标。首次请求可不传，或在运行时传 `null` / `''`；后续请求传入上次返回结果中的 `cursor`。当返回的 `cursor` 为空字符串时，表示已到达最后一页。 
  cursor: '',
});
```

## 清除指定会话的推送通知方式设置

你可以调用 `client.pushManager.clearConversationRemindType` 方法清除指定会话的推送通知方式设置。清除后，默认情况下，此会话会恢复继承全局设置。

示例代码如下：

```typescript
const result = await client.pushManager.clearConversationRemindType({
  conversationId: '12345', // 会话 ID：单聊为对方用户 ID，群聊为群组 ID，聊天室会话为聊天室 ID。
  conversationType: 'groupChat', // 会话类型：singleChat（单聊）、groupChat（群聊）或 chatRoom（聊天室）。
});
```

## 设置指定会话的推送接收规则

你可以调用 `client.pushManager.setConversationSilentMode` 设置指定会话的离线推送通知的接收规则，即推送通知方式、免打扰时长或免打扰时间段，示例代码如下。

SDK 当前仅支持 `singleChat` 和 `groupChat` 两类会话，不支持 `chatRoom`。

```typescript
// 设置会话的推送通知方式
await client.pushManager.setConversationSilentMode({
  conversationId: 'test', // 会话 ID：单聊为对方用户 ID，群聊为群组 ID，聊天室会话为聊天室 ID。
  conversationType: 'singleChat', // 会话类型：singleChat（单聊）、groupChat（群聊）和 chatRoom（聊天室）。
  rule: {
    mode: 'REMIND_TYPE', // 推送通知方式。
    remindType: 'ALL', // 可设置为 `ALL`、`AT` 或 `NONE`。
  },
});
// 设置会话的免打扰模式
await client.pushManager.setConversationSilentMode({
  conversationId: '12345567',
  conversationType: 'groupChat',
  rule: {
    mode: 'DURATION', // 免打扰时长。
    duration: 7200, // 免打扰时长，单位为毫秒。
  },
});

await client.pushManager.setConversationSilentMode({
  conversationId: '12345',
  conversationType: 'groupChat',
  rule: {
    mode: 'INTERVAL',
    startTime: {
      hours: 23,
      minutes: 0,
    },
    endTime: {
      hours: 7,
      minutes: 30,
    },
  },
});
```

## 获取指定会话的推送接收规则

调用 `client.pushManager.getConversationSilentMode` 获取指定会话的离线推送通知的接收设置，示例代码如下：

```typescript
const result = await client.pushManager.getConversationSilentMode({
  conversationId: 'test', // 会话 ID：单聊为对方用户 ID，群聊为群组 ID，聊天室会话为聊天室 ID。
  conversationType: 'singleChat', // 会话类型：singleChat（单聊）、groupChat（群聊）和 chatRoom（聊天室）。
});
```

## 批量获取会话推送接收规则

你可以调用 `client.pushManager.getConversationSilentModes` 批量获取多个会话的离线推送通知的接收规则。

使用该接口时需注意：

1. 每次最多可查询 20 个会话。
2. 返回结果会按照传入的会话列表返回各会话的推送通知接收规则；若会话未单独设置规则，则返回全局推送通知的接收规则。

示例代码如下：

```typescript
const result = await client.pushManager.getConversationSilentModes({
  conversationList: [
    {
      conversationId: 'test',  // 会话 ID：单聊为对方用户 ID，群聊为群组 ID，聊天室会话为聊天室 ID。
      conversationType: 'singleChat',  // 会话类型：singleChat（单聊）、groupChat（群聊）和 chatRoom（聊天室）。
    },
    {
      conversationId: '1234',
      conversationType: 'groupChat',
    },
  ],
});
```

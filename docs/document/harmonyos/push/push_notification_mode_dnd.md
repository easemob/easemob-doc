# 设置推送通知方式和免打扰模式

为优化用户处理大量推送通知时的体验，HarmonyOS SDK 在 App 全局和会话层面提供推送通知方式配置，并支持为 App 设置每日免打扰时间段。你可以结合这些配置统一控制离线推送通知。

## 开通功能

[推送通知方式](push_notification_mode_dnd.html#推送通知方式) 和 [免打扰模式](push_notification_mode_dnd.html#免打扰模式) 是推送的高级功能。使用前，你需要在 [环信控制台](https://console.easemob.com/user/login) 免费开通。**激活后，如需关闭推送高级功能，必须联系商务，因为该操作会删除高级功能相关的所有配置。**

1. 登录 [环信控制台](https://console.easemob.com/user/login)。
2. 选择页面上方的 **应用管理**。在弹出的应用列表页面，单击你的测试版或正式版应用的 App Key。
3. 选择 **即时通讯 > 推送配置 > 离线推送配置**。
4. 点击 **免费开通**。

![image](/images/android/push/push_advanced_feature_enable.png)

## 推送通知方式

`PushRemindType` 包含以下三种推送通知方式。该设置适用于 App 全局以及单聊和群聊会话。**会话级设置优先于 App 全局设置**；未单独设置推送通知方式的会话继承 App 全局设置。

例如，App 全局推送通知方式为 `MENTION_ONLY`，指定会话的推送通知方式为 `ALL` 时，你会收到该会话的所有离线推送通知，而其他会话仅在消息提及你时发送离线推送通知。

| 推送通知方式 | 描述 |
| :--- | :--- |
| `ALL` | 接收所有离线消息的推送通知。 |
| `MENTION_ONLY` | 仅接收提及当前用户的消息推送通知，通常用于群聊。提及一个或多个用户时，在消息扩展字段中设置 `"em_at_list": ["user1", "user2"]`；提及所有用户时，设置 `"em_at_list": "all"`。详见 [推送扩展字段](/document/server-side/push_extension.html#推送扩展字段)。 |
| `NONE` | 不接收离线消息的推送通知。 |

### 获取所有会话的推送通知方式设置

调用 `PushManager#syncConversationsSilentModeFromServer` 从服务器同步所有单聊和群聊会话的推送通知方式。同步成功后，SDK 会将结果保存到本地数据库，你可以通过 `Conversation#pushRemindType` 读取指定会话的本地设置；本地没有对应设置时，该方法默认返回 `PushRemindType.ALL`。

```typescript
const conversationId: string = 'group-id';
const conversationType: ConversationType = ConversationType.GroupChat;
const pushManager = ChatClient.getInstance().pushManager();

if (pushManager) {
  pushManager.syncConversationsSilentModeFromServer()
    .then((): void => {
      const conversation = ChatClient.getInstance()
        .chatManager()
        ?.getConversation(conversationId, conversationType);

      if (conversation) {
        const pushRemindType: PushRemindType =
          conversation.pushRemindType();
        // 使用 pushRemindType 刷新会话的推送通知设置。
      }
    })
    .catch((error: ChatError): void => {
      // 同步失败，根据错误码和错误信息处理。
    });
}
```

### 设置指定会话的推送通知方式

调用 `PushManager#setSilentModeForConversation` 为指定单聊或群聊会话设置推送通知方式。同一账号在其他设备上收到 `MultiDevicesListener#onConversationEvent` 回调时，若 `event` 为 `MultiDevicesEvent.CONVERSATION_MUTE_INFO_CHANGED`，表示会话的推送通知设置发生变化。

```typescript
const conversationId: string = 'group-id';
const conversationType: ConversationType = ConversationType.GroupChat;
const pushManager = ChatClient.getInstance().pushManager();

if (pushManager) {
  pushManager.setSilentModeForConversation(
    conversationId,
    conversationType,
    PushRemindType.ALL
  )
    .then((result: SilentModeResult): void => {
      // 设置成功。
    })
    .catch((error: ChatError): void => {
      // 设置失败，根据错误码和错误信息处理。
    });
}

const multiDevicesListener: MultiDevicesListener = {
  onContactEvent: (
    event: MultiDevicesEvent,
    target: string,
    ext: string
  ): void => {
    // 处理其他设备上的联系人事件。
  },
  onGroupEvent: (
    event: MultiDevicesEvent,
    target: string,
    userIds: Array<string>
  ): void => {
    // 处理其他设备上的群组事件。
  },
  onMessageRemoved: (
    removedConversationId: string,
    deviceId: string
  ): void => {
    // 处理其他设备上的漫游消息删除事件。
  },
  onConversationEvent: (
    event: MultiDevicesEvent,
    changedConversationId: string,
    type: ConversationType
  ): void => {
    if (event === MultiDevicesEvent.CONVERSATION_MUTE_INFO_CHANGED) {
      // 重新读取会话数据并刷新该会话的推送通知设置。
    }
  }
};

ChatClient.getInstance().addMultiDevicesListener(multiDevicesListener);

// 不再需要监听时，移除同一个监听器实例。
function releaseMultiDevicesListener(): void {
  ChatClient.getInstance()
    .removeMultiDevicesListener(multiDevicesListener);
}
```

### 清除指定会话的推送通知方式设置

调用 `PushManager#clearRemindTypeForConversation` 清除指定单聊或群聊会话的推送通知方式。清除后，该会话继承 App 全局设置。

```typescript
const conversationId: string = 'group-id';
const conversationType: ConversationType = ConversationType.GroupChat;
const pushManager = ChatClient.getInstance().pushManager();

if (pushManager) {
  pushManager.clearRemindTypeForConversation(
    conversationId,
    conversationType
  )
    .then((): void => {
      // 清除成功。
    })
    .catch((error: ChatError): void => {
      // 清除失败，根据错误码和错误信息处理。
    });
}
```

## 免打扰模式

完成 SDK 初始化和成功登录 app 后，你可以对 app 以及各类型的会话开启离线推送功能以及通过设置免打扰模式关闭推送。

HarmonyOS SDK 通过 `PushManager#setSilentModeForAll` 配置 App 全局免打扰规则，支持以下两种模式：

- `SILENT_MODE_DURATION`（一次性免打扰）：通过 `SilentDurationTypeParam` 设置。配置后立即生效，到期后自动恢复，适用于临时不希望被打扰的场景。
- `SILENT_MODE_INTERVAL`（每日循环免打扰）：通过 `SilentIntervalTypeParam` 设置每日循环生效的时间段。例如，设置为 `23:00` 至次日 `07:00`，适用于固定的休息时间。

| 规则模式    | 配置方式    | 类型   | 描述  | 生效范围    |
| :--- | :--- | :--- | :--- | :--- |
| `SILENT_MODE_INTERVAL` | 调用 `PushManager#setSilentModeForAll`，传入 `SilentIntervalTypeParam` | `SilentIntervalTypeParam` | 每日循环生效的免打扰时段，采用 24 小时制，精确到分钟。开始时间和结束时间的小时取值范围为 `0`–`23`，分钟取值范围为 `0`–`59`。<br/> - **每日定时触发**：设置后，每天在指定时段自动进入免打扰模式。<br/> - **跨天支持**：若结束时间早于开始时间，则免打扰时段跨天生效。例如，设置为 `10:00`–`08:00`，表示当日 `10:00` 至次日 `08:00` 免打扰。<br/> - **全天与关闭**：开始时间和结束时间相同时，视为全天免打扰；均设置为 `00:00` 时，关闭免打扰模式。 <br/> - **单时段限制**：每天仅支持设置一个免打扰时段，新配置会覆盖原配置。<br/> - **生效时机**：设置后立即生效。例如，当日 `11:00` 设置 `08:00`–`12:00`，则当天从 `11:00` 起进入免打扰模式，直至 `12:00`；此后每天按照 `08:00`–`12:00` 生效。 | 仅 App 全局。         |
| `SILENT_MODE_DURATION` | 调用 `PushManager#setSilentModeForAll`，传入 `SilentDurationTypeParam` | `SilentDurationTypeParam` | 免打扰时长，单位为分钟。免打扰时长的取值范围为 [0,10080]，`0` 表示该参数无效，`10080` 表示免打扰模式持续 7 天。<br/> 与免打扰时间段的设置每天生效不同，该参数为一次有效。设置后立即生效，例如，上午 8:00 将 app 层级的 `SILENT_MODE_DURATION` 设置为 240 分钟（4 个小时），则 app 在当天 8:00-12:00 处于免打扰模式。<br/> - 若该参数和 `SILENT_MODE_INTERVAL` 均设置，免打扰模式当日在这两个时间段均生效，例如，上午 8:00 将 app 级的 `SILENT_MODE_INTERVAL` 设置为 8:00-10:00，免打扰时长设置为 240 分钟（4 个小时），则 app 在当前 8:00-12:00 和以后每天 8:00-10:00 处于免打扰模式。 | App 或单聊/群聊会话。 |仅 App 全局。 |

**`SILENT_MODE_INTERVAL` 和 `SILENT_MODE_DURATION` 同时设置时的叠加规则**

- 设置当天，两种免打扰规则叠加生效，重叠时段不会重复计算。
- 自次日起，仅每日循环免打扰时段继续生效；一次性免打扰时长不会重复触发。

**示例**：上午 `08:00` 设置每日免打扰时段为 `08:00`–`10:00`，同时将一次性免打扰时长设置为 `240` 分钟（4 小时）：

- **当日**：`08:00`–`12:00` 处于免打扰状态。
- **次日起**：每天 `08:00`–`10:00` 处于免打扰状态。

**推送通知方式与免打扰模式的关系**

免打扰模式的优先级高于推送通知方式。例如，某个会话的推送通知方式设置为 `ALL`，但该会话当前命中免打扰时长，或 App 全局当前命中免打扰时段，则免打扰生效期间不会收到该会话的离线推送通知。

如果仅为某个会话设置一次性免打扰，而 App 全局未设置免打扰，则只有该会话在免打扰生效期间不发送离线推送通知；其他会话仍按照各自的推送通知方式或继承的全局设置发送推送通知。

## 设置全局推送接收规则

调用 `PushManager#setSilentModeForAll` 设置 App 全局推送通知方式或每日免打扰时间段。每次调用传入一个 `PushRemindType` 或 `SilentIntervalTypeParam`。

```typescript
async function setGlobalPushRules(): Promise<void> {
  const pushManager = ChatClient.getInstance().pushManager();
  if (!pushManager) {
    return;
  }

  // 设置 App 全局推送通知方式为仅接收提及当前用户的消息。
  await pushManager.setSilentModeForAll(
    PushRemindType.MENTION_ONLY
  );

  // 设置 App 全局每日免打扰时间段为 08:30–15:00。
  const interval: SilentIntervalTypeParam = {
    startTime: {
      hours: 8,
      minutes: 30
    },
    endTime: {
      hours: 15,
      minutes: 0
    }
  };
  await pushManager.setSilentModeForAll(interval);
}

setGlobalPushRules()
  .then((): void => {
    // 设置成功。
  })
  .catch((error: ChatError): void => {
    // 设置失败，根据错误码和错误信息处理。
  });
```

## 获取全局推送接收规则

调用 `PushManager#getSilentModeForAll` 获取 App 全局推送通知方式和免打扰设置。

```typescript
const pushManager = ChatClient.getInstance().pushManager();

if (pushManager) {
  pushManager.getSilentModeForAll()
    .then((result: SilentModeResult): void => {
      // 获取 App 全局推送通知方式。
      const remindType = result.getRemindType();

      // 获取服务端返回的免打扰过期 Unix 时间戳。
      const expireTimestamp: number =
        result.getExpireTimestamp();

      // 获取每日免打扰时间段的开始时间。
      const startTime = result.getSilentModeStartTime();
      if (startTime) {
        const startHour: number = startTime.getHour();
        const startMinute: number = startTime.getMinute();
      }

      // 获取每日免打扰时间段的结束时间。
      const endTime = result.getSilentModeEndTime();
      if (endTime) {
        const endHour: number = endTime.getHour();
        const endMinute: number = endTime.getMinute();
      }
    })
    .catch((error: ChatError): void => {
      // 获取失败，根据错误码和错误信息处理。
    });
}
```

## 设置指定会话的推送接收规则

SDK 支持通过 `PushManager#setSilentModeForConversation` 设置指定单聊或群聊会话的推送通知方式，不支持设置会话级免打扰时间段或一次性免打扰时长。

```typescript
const conversationId: string = 'user-id';
const conversationType: ConversationType = ConversationType.Chat;
const pushManager = ChatClient.getInstance().pushManager();

if (pushManager) {
  pushManager.setSilentModeForConversation(
    conversationId,
    conversationType,
    PushRemindType.MENTION_ONLY
  )
    .then((result: SilentModeResult): void => {
      // 设置成功。
    })
    .catch((error: ChatError): void => {
      // 设置失败，根据错误码和错误信息处理。
    });
}
```

## 获取指定会话的推送接收规则

调用 `PushManager#getSilentModeForConversation` 获取指定单聊或群聊会话的推送通知设置。你可以传入会话 ID 和会话类型，也可以直接传入 `Conversation` 对象。

```typescript
const conversationId: string = 'group-id';
const conversationType: ConversationType = ConversationType.GroupChat;
const pushManager = ChatClient.getInstance().pushManager();

if (pushManager) {
  pushManager.getSilentModeForConversation(
    conversationId,
    conversationType
  )
    .then((result: SilentModeResult): void => {
      // 判断该会话是否单独设置了推送通知方式。
      const enabled: boolean =
        result.isConversationRemindTypeEnabled();

      if (enabled) {
        const remindType: PushRemindType =
          result.getRemindType();
      }

      // 获取服务端返回的免打扰过期 Unix 时间戳。
      const expireTimestamp: number =
        result.getExpireTimestamp();
    })
    .catch((error: ChatError): void => {
      // 获取失败，根据错误码和错误信息处理。
    });
}
```

## 批量获取会话的推送接收规则

每次最多获取 20 个单聊或群聊会话的推送接收规则。`PushManager#getSilentModeForConversations` 会忽略传入列表中的聊天室会话。如果某个会话继承 App 全局设置，或其单独设置已经过期，返回的 `Map` 中不包含该会话。

```typescript
const chatManager = ChatClient.getInstance().chatManager();
const pushManager = ChatClient.getInstance().pushManager();

const conversations: Array<Conversation> =
  (chatManager?.getAllConversationsBySort() ?? [])
    .filter((conversation: Conversation): boolean => {
      const type: ConversationType = conversation.getType();
      return type === ConversationType.Chat ||
        type === ConversationType.GroupChat;
    })
    .slice(0, 20);

if (pushManager && conversations.length > 0) {
  pushManager.getSilentModeForConversations(conversations)
    .then((
      result: Map<string, SilentModeResult>
    ): void => {
      result.forEach((
        setting: SilentModeResult,
        conversationId: string
      ): void => {
        // 使用 conversationId 和 setting 刷新会话的推送设置。
      });
    })
    .catch((error: ChatError): void => {
      // 获取失败，根据错误码和错误信息处理。
    });
}
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`syncConversationsSilentModeFromServer`](#获取所有会话的推送通知方式设置) | `PushManager` | 从服务器同步所有会话的推送通知方式并保存到本地数据库。 |
| [`setSilentModeForConversation`](#设置指定会话的推送通知方式) | `PushManager` | 设置指定单聊或群聊会话的推送通知方式。 |
| [`getSilentModeForConversation`](#获取指定会话的推送接收规则) | `PushManager` | 获取指定单聊或群聊会话的推送接收规则。 |
| [`setSilentModeForAll`](#设置全局推送接收规则) | `PushManager` | 设置 App 全局推送接收规则。 |
| [`getSilentModeForAll`](#获取全局推送接收规则) | `PushManager` | 获取 App 全局推送接收规则。 |
| [`getSilentModeForConversations`](#批量获取会话的推送接收规则) | `PushManager` | 批量获取单聊和群聊会话的推送接收规则。 |
| [`clearRemindTypeForConversation`](#清除指定会话的推送通知方式设置) | `PushManager` | 清除指定会话的推送通知方式，使其继承 App 全局设置。 |

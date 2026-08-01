# 设置推送通知方式和免打扰模式

你可以在 app 和会话层面提供了推送通知方式和免打扰模式的细粒度选项。

## 开通功能

[推送通知方式](push_notification_mode_dnd.html#推送通知方式) 和 [免打扰模式](push_notification_mode_dnd.html#免打扰模式) 是推送的高级功能。使用前，你需要在 [环信控制台](https://console.easemob.com/user/login) 免费开通。**激活后，如需关闭推送高级功能，必须联系商务，因为该操作会删除高级功能相关的所有配置。**

1. 登录 [环信控制台](https://console.easemob.com/user/login)。
2. 选择页面上方的 **应用管理**。在应用列表中，单击测试应用或正式版应用的 App Key。
3. 选择 **增值服务 > 消息推送 > 离线推送**。
4. 点击 **免费开通**。

![image](/images/android/push/push_advanced_feature_enable.png)

## 推送通知方式

会话的 `disturbType` 属性类型为 `EMPushRemindType`，包含三种类型，如下表所示。该设置适用于 App 全局以及单聊和群聊具体会话。**会话级别的推送通知方式设置优先于全局级别设置**，未设置推送通知方式的会话默认继承全局设置。

例如，假设全局推送方式设置为 `EMPushRemindTypeMentionOnly`，而指定会话的推送方式设置为 `EMPushRemindTypeAll`。你会收到来自该会话的所有推送通知，而对于其他会话来说，你只会收到提及你的消息的推送通知。

| 推送通知方式 | 描述            | 
| :---- | :------------- |
| `EMPushRemindTypeAll`          | 接收所有离线消息的推送通知。    |
| `EMPushRemindTypeMentionOnly`           | 仅接收提及当前用户的消息推送通知。该参数通常更适合群聊场景。若消息需要提及一个或多个用户，可在发消息时通过消息扩展字段 `ext` 字段传 "em_at_list":["user1", "user2" ...]；若提及所有人，对该字段传 "em_at_list":"all"。 |
| `EMPushRemindTypeNone`        | 不接收离线消息的推送通知。    |

### 从服务器获取所有会话的推送通知方式设置

你可以调用 `syncSilentModeConversationsFromServerCompletion:` 方法从服务器同步所有会话的推送通知方式设置。同步后成功后的结果会存储到本地数据库，然后你可以通过 `EMConversation#disturbType` 查询当前会话的推送通知方式。

```swift
EMClient.shared().pushManager?.syncSilentModeConversations(fromServerCompletion: { err in
    if err == nil {
        if let conversations = EMClient.shared().chatManager?.getAllConversations() {
            for conversation in conversations {
                let disturbType = conversation.disturbType
                }
        }
    }
})

```

### 设置推送通知方式

在本机上调用 `setSilentModeForConversation` 设置会话的推送通知方式后，多设备事件会通过 `multiDevicesConversationEvent` 回调当前操作，此时参数 `event` 的值为 `EMMultiDevicesEventConversationMuteInfoChanged`。

```swift
//对会话设置推送通知方式
let param = EMSilentModeParam(paramType: .remindType)
        param.remindType = .none
        EMClient.shared().pushManager?.setSilentModeForConversation("conversationId", conversationType: .chat, params: param, completion: { result, err in
    if err == nil {
        print("setSilentModeForConversation success")
    }
})


// 监听多设备事件
EMClient.shared().addMultiDevices(delegate: self, queue: nil)

// 接收多设备事件回调
extension ViewController: EMMultiDevicesDelegate {
    func multiDevicesConversationEvent(_ event: EMMultiDevicesEvent, conversationId: String, conversationType: EMConversationType) {
        switch event {
        case .conversationMuteInfoChanged:
            print("multiDevicesConversationEvent mute info changed")
        default:
            break
        }
    }
}
```

### 清除指定会话的推送通知方式的设置

你可以调用 `clearRemindTypeForConversation` 清除指定会话的推送通知方式的设置。清除后，默认情况下，此会话会继承 app 的设置。

```objectivec
//清除指定会话的推送通知方式的设置。清除后，该会话会采取 app 的设置。
// 异步方法
EMConversationType conversationType = EMConversationTypeGroupChat;
[[EMClient sharedClient].pushManager clearRemindTypeForConversation:@"conversationId" conversationType:conversationType completion:^(EMSilentModeResult *aResult, EMError *aError) {
    if (aError) {
        NSLog(@"clearRemindTypeForConversation error---%@",aError.errorDescription);
    }
}];
```

## 免打扰模式

完成 SDK 初始化并成功登录后，你可以为 App 全局或指定单聊、群聊会话设置免打扰模式。免打扰模式生效期间，环信 IM 不会向对应范围内的离线用户发送推送通知。

iOS SDK 通过 `EMSilentModeParam` 配置免打扰规则，支持以下两种模式：

- `EMSilentModeParamTypeDuration`（一次性免打扰）：设置后立即生效，到期后自动恢复，适用于临时不希望被打扰的场景。
- `EMSilentModeParamTypeInterval`（每日循环免打扰）：设置一个每日循环生效的时间段，例如从 `23:00` 到次日 `07:00`，适用于固定的休息时间。

免打扰时间参数的说明如下表所示：

| 规则模式      | 配置方法    | 类型    | 描述   | 生效范围                       |
| :------------------- | :---------- | :--------------- | :------------------- |
| `EMSilentModeParamTypeInterval` | 设置 `silentModeStartTime` 和 `silentModeEndTime` | `EMSilentModeTime` | 每日循环生效的免打扰时段，采用 24 小时制，精确到分钟。`silentModeStartTime` 和 `silentModeEndTime` 的小时取值范围为 `0`–`23`，分钟取值范围为 `0`–`59`。<br/> - **每日定时触发**：设置后，每天在指定时段自动进入免打扰模式。<br/> - **跨天支持**：若结束时间早于开始时间，则时段跨天生效。例如，设置为 `10:00`–`08:00`，表示当日 `10:00` 至次日 `08:00` 免打扰。<br/> - **全天与关闭**：开始和结束时间相同时，视为全天免打扰；设置为 `00:00`–`00:00` 时，关闭免打扰模式。<br/> - **单时段限制**：每天仅支持设置一个免打扰时段；新配置会覆盖旧配置。<br/> - **生效时机**：设置后立即生效。例如，当日 `11:00` 设置 `08:00`–`12:00`，则当天从 `11:00` 起生效至 `12:00`，此后每天按 `08:00`–`12:00` 执行。 | 仅 App 全局。                  |
| `EMSilentModeParamTypeDuration` | 设置 `silentModeDuration`                         | `int`              | 一次性生效的免打扰持续时长，单位为分钟，取值范围为 `0`–`10080`（0 至 7 天）。其中，`0` 表示该参数无效。 <br/> - **一次有效**：该模式设置后立即开始计时，不会按天重复触发。<br/> - **生效示例**：上午 `08:00` 设置 `silentModeDuration = 240`，则当天 `08:00`–`12:00` 处于免打扰模式。 | App 全局或指定单聊、群聊会话。 |

**`EMSilentModeParamTypeInterval` 和 `EMSilentModeParamTypeDuration` 同时设置时的叠加规则**

- 当天两者 **叠加生效**，重叠时段不重复计时。
- 自次日起，只有每日循环免打扰时段继续生效；一次性免打扰时长不会重复触发。

**示例**：上午 `08:00` 设置每日免打扰时段为 `08:00`–`10:00`，同时设置 `silentModeDuration = 240`（4 小时）：

- **当日**：`08:00`–`12:00` 免打扰。
- **次日起**：每天 `08:00`–`10:00` 免打扰。

**推送通知方式与免打扰模式的关系**

免打扰模式的优先级高于推送通知方式。例如，某个会话的推送通知方式设置为 `EMPushRemindTypeAll`，但该会话当前命中免打扰时长，或 App 全局当前命中免打扰时段，则免打扰生效期间不会收到该会话的离线推送通知。

如果仅为某个会话设置一次性免打扰，而 App 全局未设置免打扰，则只有该会话在免打扰生效期间不发送离线推送通知；其他会话仍按照各自的推送通知方式或继承的全局设置发送推送通知。

:::tip 
若需在免打扰生效期间仍向指定用户发送离线推送通知，可设置 [强制推送](push_extension.html#强制推送)。 
:::

## 设置全局推送接收规则

你可以调用 `setSilentModeForAll` 设置 app 级别的推送通知，并通过指定 `EMSilentModeParam` 字段设置推送通知方式和免打扰模式，如下代码示例所示：

```objectivec
//设置推送通知方式为 `EMPushRemindTypeMentionOnly`。
EMSilentModeParam *remindTypeParam = [[EMSilentModeParam alloc] initWithParamType:EMSilentModeParamTypeRemindType];
remindTypeParam.remindType = EMPushRemindTypeMentionOnly;
//设置 app 的离线推送免打扰模式。
// 异步方法
[[EMClient sharedClient].pushManager setSilentModeForAll:remindTypeParam completion:^(EMSilentModeResult *aResult, EMError *aError) {
    if (aError) {
        NSLog(@"setSilentModeForAll error---%@", aError.errorDescription);
    }
}];

//设置离线推送免打扰时长为 15 分钟。
EMSilentModeParam *durationParam = [[EMSilentModeParam alloc] initWithParamType:EMSilentModeParamTypeDuration];
durationParam.silentModeDuration = 15;
[[EMClient sharedClient].pushManager setSilentModeForAll:durationParam completion:^(EMSilentModeResult *aResult, EMError *aError) {
    if (aError) {
        NSLog(@"setSilentModeForAll error---%@", aError.errorDescription);
    }
}];

//设置离线推送的免打扰时间段为 8:30 到 15:00。
EMSilentModeParam *intervalParam = [[EMSilentModeParam alloc] initWithParamType:EMSilentModeParamTypeInterval];
intervalParam.silentModeStartTime = [[EMSilentModeTime alloc] initWithHours:8 minutes:30];
intervalParam.silentModeEndTime = [[EMSilentModeTime alloc] initWithHours:15 minutes:0];
[[EMClient sharedClient].pushManager setSilentModeForAll:intervalParam completion:^(EMSilentModeResult *aResult, EMError *aError) {
    if (aError) {
        NSLog(@"setSilentModeForAll error---%@", aError.errorDescription);
    }
}];
```

## 获取全局推送接收规则

你可以调用 `getSilentModeForAll` 获取 app 级别的推送通知设置，如以下代码示例所示：

```objectivec
// 异步方法
[[EMClient sharedClient].pushManager getSilentModeForAllWithCompletion:^(EMSilentModeResult *aResult, EMError *aError) {
    if (!aError) {
        //获取 app 的推送通知方式。
        EMPushRemindType remindType = aResult.remindType;
        //获取 app 的离线推送免打扰过期 Unix 时间戳。
        NSTimeInterval ex = aResult.expireTimestamp;
        //获取 app 的离线推送免打扰时段的开始时间。
        EMSilentModeTime *startTime = aResult.silentModeStartTime;
        EMSilentModeTime *endTime = aResult.silentModeEndTime;
    }else{
        NSLog(@"getSilentModeForAll error---%@",aError.errorDescription);
    }
}];
```

## 设置指定会话的推送接收规则

你可以调用 `setSilentModeForConversation` 设置指定会话的推送通知，并通过指定 `EMSilentModeParam` 字段设置推送通知方式和免打扰模式，如以下代码示例所示：

```objectivec
EMConversationType conversationType = EMConversationTypeGroupChat;

//设置推送通知方式为 `EMPushRemindTypeMentionOnly`。
EMSilentModeParam *remindTypeParam = [[EMSilentModeParam alloc] initWithParamType:EMSilentModeParamTypeRemindType];
remindTypeParam.remindType = EMPushRemindTypeMentionOnly;
// 异步方法
[[EMClient sharedClient].pushManager setSilentModeForConversation:@"conversationId" conversationType:conversationType params:remindTypeParam completion:^(EMSilentModeResult *aResult, EMError *aError) {
    if (aError) {
        NSLog(@"setSilentModeForConversation error---%@", aError.errorDescription);
    }
}];

//设置离线推送免打扰时长为 15 分钟。
EMSilentModeParam *durationParam = [[EMSilentModeParam alloc] initWithParamType:EMSilentModeParamTypeDuration];
durationParam.silentModeDuration = 15;
[[EMClient sharedClient].pushManager setSilentModeForConversation:@"conversationId" conversationType:conversationType params:durationParam completion:^(EMSilentModeResult *aResult, EMError *aError) {
    if (aError) {
        NSLog(@"setSilentModeForConversation error---%@", aError.errorDescription);
    }
}];
```

## 获取指定会话的推送接收规则

你可以调用 `getSilentModeForConversation` 获取指定会话的推送通知设置，如以下代码示例所示：

```objectivec
    [EMClient.sharedClient.pushManager getSilentModeForConversation:@"conversationId" conversationType:EMConversationTypeGroupChat completion:^(EMSilentModeResult * _Nullable aResult, EMError * _Nullable aError) {
            if (aError == nil) {
                //获取会话的推送通知方式。
                EMPushRemindType remindType = aResult.remindType;
                //获取会话的离线推送免打扰过期 Unix 时间戳。
                NSTimeInterval ex = aResult.expireTimestamp;
            }
    }];
```

## 批量获取会话的推送接收规则

1. 你可以在每次调用中最多获取 20 个会话的设置。
   
2. 如果会话继承了 app 设置或其推送通知设置已过期，则返回的字典不包含此会话。

你可以调用 `getSilentModeForConversations` 获取多个会话的推送通知设置，如以下代码示例所示：

```objectivec
NSArray *conversations = @[conversation1,conversation2];
// 异步方法
    [[EMClient sharedClient].pushManager getSilentModeForConversations:conversations completion:^(NSDictionary<NSString*,EMSilentModeResult*>*aResult, EMError *aError) {
        if (aError) {
            NSLog(@"getSilentModeForConversations error---%@",aError.errorDescription);
        }
    }];
```


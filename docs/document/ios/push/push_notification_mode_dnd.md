# 设置推送通知方式和免打扰模式

环信即时通讯 IM 3.9.2 及以上版本对离线消息推送进行了优化。你可以在 app 和会话层面提供了推送通知方式和免打扰模式的细粒度选项。

推送通知方式和免打扰模式为推送的高级功能，若要设置，你需要在 [环信即时通讯控制台](https://console.easemob.com/user/login)的**即时通讯 > 功能配置 > 功能配置总览**页面激活推送高级功能。如需关闭推送高级功能必须联系商务，因为该操作会删除所有相关配置。

![image](/images/ios/push/push_ios_27_enable_push.png)

## 推送通知方式

为优化用户在处理大量推送通知时的体验，环信 IM 在 app 和会话层面提供了推送通知方式和免打扰模式的细粒度选项。

推送通知方式 `disturbType` 包含三种类型，如下表所示。其中，会话级别的 `disturbType` 设置优先于 app 级别的设置，未设置推送通知方式的会话默认采用 app 的设置。例如，假设 app 的推送方式设置为 `MentionOnly`，而指定会话的推送方式设置为 `All`。你会收到来自该会话的所有推送通知，而对于其他会话来说，你只会收到提及你的消息的推送通知。

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
<p>All</p>
</td>
<td width="420">
<p>接收所有离线消息的推送通知。</p>
</td>
<td rowspan="3" width="321">
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>App 或单聊/群聊会话</p>
</td>
</tr>
<tr>
<td width="184">
<p>MentionOnly</p>
</td>
<td width="420">
<p>仅接收提及消息的推送通知。</p>
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

### 从服务器获取所有会话的推送通知方式设置

你可以调用 `EMPushManager#syncSilentModeConversationsFromServerCompletion:` 方法从服务器同步所有会话的推送通知方式设置。同步后成功后的结果会存储到本地数据库，然后你可以通过 `EMConversation#disturbType` 查询当前会话的推送通知方式。

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

### 本地设置推送通知方式

在本机上调用 `EMPushManager#setSilentModeForConversation:conversationType:params:completion` 设置会话的推送通知方式，在多设备事件 `EMMultiDevicesDelegate#onConversationEvent:conversationId:conversationType` 里会回调当前操作，此时参数 `event` 的值为 `EMMultiDevicesEventConversationMuteInfoChanged`。

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

## 免打扰模式

完成 SDK 初始化和成功登录 app 后，你可以对 app 以及各类型的会话开启离线推送功能以及通过设置免打扰模式关闭推送。

你可以在 app 级别指定免打扰时间段和免打扰时长，环信 IM 在这两个时间段内不发送离线推送通知。若既设置了免打扰时间段，又设置了免打扰时长，免打扰模式的生效时间为这两个时间段的累加。

免打扰时间参数的说明如下表所示：

| 免打扰时间参数       | 类型 |描述           | 应用范围           |
| :------------------- | :------------------- | :--------------------------- | :------------------- |
| `EMSilentModeParamTypeInterval` | Int |每天定时触发离线推送免打扰的时间段，采用 24 小时制，精确到分钟，格式为 H:M-H:M，例如 8:30-10:0，开始时间和结束时间中的小时数和分钟数的取值范围分别为 [0,23] 和 [0,59]。免打扰时间段的设置说明如下：<br/> - 该参数仅针对 app 生效，对单聊或群聊不生效。<br/> - 开始时间和结束时间设置后，免打扰模式每天定时触发。例如，若该时间段设置为 `8:0`-`10:0`，免打扰模式在每天的 8:00-10:00 内生效。若你在 11:00 设置开始时间为 `8:0`，结束时间为 `12:0`，则免打扰模式在当天的 11:00-12:00 生效，以后每天均在 8:00-12:00 生效。<br/> - 若开始时间和结束时间相同，免打扰模式则全天生效。不过，若设置为  `0:0`-`0:0`，则关闭免打扰模式。<br/> - 若结束时间早于开始时间，则免打扰模式在每天的开始时间到次日的结束时间内生效。例如，开始时间为 `10:0`，结束时间为 `8:0`，则免打扰模式的在当天的 10:00 到次日的 8:00 生效。<br/> - 目前仅支持在每天的一个指定时间段内开启免打扰模式，不支持多个免打扰时间段，新的设置会覆盖之前的设置。<br/> - 若该参数和 `EMSilentModeParamTypeDuration` 均设置，免打扰模式当日在这两个时间段均生效，例如，上午 8:00 将 `EMSilentModeParamTypeInterval` 设置为 8:0-10:0，`EMSilentModeParamTypeDuration` 设置为 240 分钟（4 个小时），则 app 在当天 8:00-12:00 和以后每天 8:00-10:00 处于免打扰模式。 | 仅用于 app 级别，对单聊或群聊会话不生效。 |
| `EMSilentModeParamTypeDuration` | Int |免打扰时长，单位为分钟。免打扰时长的取值范围为 [0,10080]，`0` 表示该参数无效，`10080` 表示免打扰模式持续 7 天。<br/> 与免打扰时间段的设置每天生效不同，该参数为一次有效。设置后立即生效，例如，上午 8:00 将 app 层级的时长设置为 240 分钟（4 个小时），则 app 在当天 8:00-12:00 处于免打扰模式。<br/> - 若该参数和 `EMSilentModeParamTypeInterval` 均设置，免打扰模式当日在这两个时间段均生效，例如，上午 8:00 将 app 级的 `EMSilentModeParamTypeInterval` 设置为 8:00-10:00，免打扰时长设置为 240 分钟（4 个小时），则 app 在当前 8:00-12:00 和以后每天 8:00-10:00 处于免打扰模式。    | App 或单聊/群聊会话。   |

:::tip
若在免打扰时段或时长生效期间需要对指定用户推送消息，需设置[强制推送](push_extension.html#强制推送)。
:::

**推送通知方式与免打扰时间设置之间的关系**

对于 app 和 app 中的所有会话，免打扰模式的设置优先于推送通知方式的设置。例如，假设在 app 级别指定了免打扰时间段，并将指定会话的推送通知方式设置为 `All`。免打扰模式与推送通知方式的设置无关，即在指定的免打扰时间段内，你不会收到任何推送通知。或者，假设为会话指定了免打扰时间段，而 app 没有任何免打扰设置，并且其推送通知方式设置为 `All`。在指定的免打扰时间段内，你不会收到来自该会话的任何推送通知，而所有其他会话的推送保持不变。

## 设置 app 的推送通知

你可以调用 `setSilentModeForAll` 设置 app 级别的推送通知，并通过指定 `EMSilentModeParam` 字段设置推送通知方式和免打扰模式，如下代码示例所示：

```objectivec
//设置推送通知方式为 `MentionOnly`。
EMSilentModeParam *param = [[EMSilentModeParam alloc]initWithParamType:EMSilentModeParamTypeRemindType];
param.remindType = EMPushRemindTypeMentionOnly;

//设置 app 的离线推送免打扰模式。
// 异步方法
[[EMClient sharedClient].pushManager setSilentModeForAll:param completion:^(EMSilentModeResult *aResult, EMError *aError) {
        if (aError) {
            NSLog(@"setSilentModeForAll error---%@",aError.errorDescription);
        }
    }];

//设置离线推送免打扰时长为 15 分钟。
EMSilentModeParam *param = [[EMSilentModeParam alloc]initWithParamType:EMSilentModeParamTypeDuration];
param.silentModeDuration = 15;

//设置离线推送的免打扰时间段为 8:30 到 15:00。
EMSilentModeParam *param = [[EMSilentModeParam alloc]initWithParamType:EMSilentModeParamTypeInterval];
param.silentModeStartTime = [[EMSilentModeTime alloc]initWithHours:8 minutes:30];
param.silentModeEndTime = [[EMSilentModeTime alloc]initWithHours:15 minutes:0];
```

## 获取 app 的推送通知设置

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

## 设置单个会话的推送通知

你可以调用 `setSilentModeForConversation` 设置指定会话的推送通知，并通过指定 `EMSilentModeParam` 字段设置推送通知方式和免打扰模式，如以下代码示例所示：

```objectivec
//设置推送通知方式为 `MentionOnly`。
EMSilentModeParam *param = [[EMSilentModeParam alloc]initWithParamType:EMSilentModeParamTypeRemindType];
param.remindType = EMPushRemindTypeMentionOnly;

//设置离线推送免打扰时长为 15 分钟。
EMSilentModeParam *param = [[EMSilentModeParam alloc]initWithParamType:EMSilentModeParamTypeDuration];
param.silentModeDuration = 15;
                                
EMConversationType conversationType = EMConversationTypeGroupChat;
// 异步方法
[[EMClient sharedClient].pushManager setSilentModeForConversation:@"conversationId" conversationType:conversationType params:param completion:^(EMSilentModeResult *aResult, EMError *aError) {
    if (aError) {
        NSLog(@"setSilentModeForConversation error---%@",aError.errorDescription);
    }
}];
```

## 获取单个会话的推送通知设置

你可以调用 `getSilentModeForAllWithCompletion` 获取指定会话的推送通知设置，如以下代码示例所示：

```objectivec
// 异步方法
[[EMClient sharedClient].pushManager getSilentModeForAllWithCompletion:^(EMSilentModeResult *aResult, EMError *aError) {
    if (!aError) {
        //获取会话的推送通知方式。
        if(aResult.isSetConversationRemindType){
            EMPushRemindType remindType = aResult.remindType;
        }
        //获取会话的离线推送免打扰过期 Unix 时间戳。
        NSTimeInterval ex = aResult.expireTimestamp;
        //获取会话的离线推送免打扰时段的开始时间。
        EMSilentModeTime *startTime = aResult.silentModeStartTime;
        EMSilentModeTime *endTime = aResult.silentModeEndTime;
    }else{
        NSLog(@"getSilentModeForAll error---%@",aError.errorDescription);
    }s
}];
```

## 获取多个会话的推送通知设置

1. 你可以在每次调用中最多获取 20 个会话的设置。
   
2. 如果会话继承了 app 设置或其推送通知设置已过期，则返回的字典不包含此会话。

你可以调用 `getSilentModeForConversations` 获取多个会话的推送通知设置，如以下代码示例所示：

```objectivec
NSArray *conversations = @[conversation1,conversation2];
// 异步方法
    [[EMClient sharedClient].pushManager getSilentModeForConversations:conversationArray completion:^(NSDictionary<NSString*,EMSilentModeResult*>*aResult, EMError *aError) {
        if (aError) {
            NSLog(@"getSilentModeForConversations error---%@",aError.errorDescription);
        }
    }];
```

## 清除单个会话的推送通知方式的设置

你可以调用 `clearRemindTypeForConversation` 清除指定会话的推送通知方式的设置。清除后，默认情况下，此会话会继承 app 的设置。

以下代码示例显示了如何清除会话的推送通知方式的设置：

```objectivec
//清除指定会话的推送通知方式的设置。清除后，该会话会采取 app 的设置。
// 异步方法
[[EMClient sharedClient].pushManager clearRemindTypeForConversation:@"" conversationType:conversationType completion:^(EMSilentModeResult *aResult, EMError *aError) {
    if (aError) {
        NSLog(@"clearRemindTypeForConversation error---%@",aError.errorDescription);
    }
}];
```
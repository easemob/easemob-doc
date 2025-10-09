# 设置和获取推送通知的显示属性

## 设置推送通知的显示属性

你可以调用 `updatePushDisplayName` 设置推送通知中显示的昵称，如以下代码示例所示：

```objectivec
// 异步方法
[EMClient.sharedClient.pushManager updatePushDisplayName:@"displayName" completion:^(NSString * aDisplayName, EMError * aError) {
    if (aError) {
        NSLog(@"update push display name error: %@", aError.errorDescription);
    }
}];
```

你也可以调用 `updatePushDisplayStyle` 设置推送通知的显示样式，如下代码示例所示：

```objectivec
// 异步方法
[EMClient.sharedClient.pushManager updatePushDisplayStyle:EMPushDisplayStyleSimpleBanner completion:^(EMError * aError)
{
    if (aError) {
        NSLog(@"update display style error --- %@", aError.errorDescription);
    }
}];
```

若要在通知栏中显示消息内容，需要设置通知显示样式 `DisplayStyle`。`DisplayStyle` 是枚举类型，有如下两种设置：

| 参数值             | 描述                    |
| :--------------- | :---------------------- |
| （默认）`EMPushDisplayStyleSimpleBanner`   | 不论 `displayName` 是否设置，对于推送任何类型的消息，通知栏采用默认显示设置，即推送标题为**您有一条新消息**，推送内容为**请点击查看**。 |
| `EMPushDisplayStyleMessageSummary` | `EMPushDisplayStyleMessageSummary`：显示消息内容。设置的昵称只在 `DisplayStyle` 为 `EMPushDisplayStyleMessageSummary` 时生效，在 `EMPushDisplayStyleSimpleBanner` 时不生效。 |

下表以**单聊文本消息**为例介绍显示属性的设置。

对于**群聊**，下表中的**消息发送方的推送昵称**和**消息发送方的 IM 用户 ID**显示为**群组 ID**。

| 参数设置      | 推送显示 | 图片    |
| :--------- | :----- |:------------- |
| <br/> - `DisplayStyle`：（默认）`EMPushDisplayStyleSimpleBanner`<br/> - `displayName`：设置或不设置 | <br/> - 推送标题：**您有一条新消息**<br/> - 推送内容：**请点击查看**  | ![img](/images/android/push/push_displayattribute_1.png)  |
| <br/> - `DisplayStyle`：`EMPushDisplayStyleMessageSummary`<br/> - `displayName`：设置具体值 | <br/> - 推送标题：**您有一条新消息**<br/> - 推送内容：**消息发送方的推送昵称：消息内容**  | ![img](/images/android/push/push_displayattribute_2.png)|
| <br/> - `DisplayStyle`：`EMPushDisplayStyleMessageSummary`<br/> - `displayName`：不设置    | <br/> - 推送标题：**您有一条新消息**<br/> - 推送内容：**消息发送方的 IM 用户 ID: 消息内容**  | ![img](/images/android/push/push_displayattribute_3.png) |

## 获取推送通知的显示属性

你可以调用 `getPushNotificationOptionsFromServerWithCompletion` 方法获取推送通知中的显示属性，如以下代码示例所示：

```objectivec
// 异步方法
[EMClient.sharedClient.pushManager getPushNotificationOptionsFromServerWithCompletion:^(EMPushOptions * aOptions, EMError * aError)
{
    if (aError) {
        NSLog(@"get push options error --- %@", aError.errorDescription);
    }
}];
```

`EMPushOptions` 推送配置对象。 

| 属性名               | 描述                                                         |
| :------------------- | :----------------------------------------------------------- |
| `displayName`        | 对方收到推送时发送方展示的名称。                             |
| `displayStyle`       | 推送显示类型。                                               |


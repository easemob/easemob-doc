# 设置推送通知的显示内容

通知收到后，通知栏中显示的推送标题和内容可通过以下方式设置，配置的优先级为由低到高：

- 调用 `updatePushNickname` 接口设置推送显示属性。
- 使用推送模板。

## 设置推送显示属性

### 设置推送通知的显示属性

你可以调用 `updatePushNickname` 设置推送通知中显示的昵称，如以下代码示例所示：

```TypeScript
ChatClient.getInstance().pushManager()?.updatePushNickname(pushNickname).then(() => {
  // success logic
}).catch((e: ChatError) => {
  // failure logic
});
```

你也可以调用 `updatePushDisplayStyle` 设置推送通知的显示样式，如下代码示例所示：

```TypeScript
// 设置为简单样式。
const displayStyle = PushDisplayStyle.SimpleBanner;
ChatClient.getInstance().pushManager()?.updatePushDisplayStyle(displayStyle).then(() => {
  // success logic
}).catch((e: ChatError) => {
  // failure logic
})
```

`PushDisplayStyle` 是枚举类型。

| 参数             | 描述                    |
| :--------------- | :---------------------- |
| `SimpleBanner`   | 显示 “你有一条新消息”。 |
| `MessageSummary` | 显示消息内容。          |

## 使用推送模板

你可以使用推送模板设置推送标题和内容。推送模板包括默认推送模板 `default` 和自定义推送模板，你可以通过以下两种方式设置：

- [调用 REST API 配置](/document/server-side/push.html#使用推送模板)。
- 在[环信即时通讯云控制台](https://console.easemob.com/user/login)设置推送模板，详见[控制台文档](/product/enable_and_configure_IM.html#配置推送模板)。

使用推送模板有以下优势：

1. 自定义修改环信服务端默认推送内容。   

2. 接收方可以决定使用哪个模板。 

3. 按优先级选择模板使用方式。

**推送通知栏内容设置的使用优先级**

通知栏中显示的推送标题和内容可通过以下方式设置，优先级为由低到高：

1. 发送消息时使用默认的推送标题和内容：设置推送通知的展示方式 `PushDisplayStyle`。推送标题为“您有一条新消息”，推送内容为“请点击查看”。  
2. 发送消息时使用默认模板：若有默认模板 `default`，发消息时无需指定。
3. 发送消息时使用扩展字段自定义要显示的推送标题和推送内容，即 `em_push_title` 和 `em_push_content`。
4. 接收方设置了推送模板。
5. 发送消息时通过消息扩展字段指定模板名称。

#### **发送消息时使用推送模板**

创建模板后，你可以在发送消息时选择此推送模板，分为以下三种情况：

:::tip
若使用默认模板 **default**，消息推送时自动使用默认模板，创建消息时无需传入模板名称。
:::

1. 使用固定内容的推送模板，通过 `ext` 扩展字段指定推送模板名称。

这种情况下，创建消息时无需传入 `title_args` 和 `content_args` 参数。 

```TypeScript
// 下面以文本消息为例，其他类型的消息设置方法相同。
const message = ChatMessage.createTextSendMessage(conversationId, "消息内容");
if (message) {
  // 设置推送模板名称。设置前需在环信即时通讯云管理后台或调用 REST 接口创建推送模板。
  // 若为默认模板 `default`，无需传入模板名称。
  // 若为自定义模板，需传入模板名称。
  let templateName = "自定义推送模板名称";
  let pushTemplate = `{"name": "${templateName}"}`;
  message?.setJsonAttribute("em_push_template", pushTemplate);
  // 发送消息。
  ChatClient.getInstance().chatManager()?.sendMessage(message);
}
```

2. 使用自定义或者默认推送模板，模板中的推送标题和推送内容使用以下内置参数：
- `{$dynamicFrom}`：服务器按优先级从高到底的顺序填充备注、群昵称（仅限群消息）和推送昵称。
- `{$fromNickname}`：推送昵称。  
- `{$msg}`：消息内容。

群昵称即群成员在群组中的昵称，群成员在发送群消息时通过扩展字段设置，JSON 结构如下：

```json
{
  "ext":{
    "em_push_ext":{
      "group_user_nickname":"Jane"
    }
  }
}       
```

内置参数的介绍，详见[环信即时通讯控制台文档](/product/enable_and_configure_IM.html#使用默认推送模板)。

这种方式的示例代码与“使用固定内容的推送模板”的相同。

3. 使用自定义推送模板，而且推送标题和推送内容为自定义参数：

例如，推送模板的设置如下图所示：

![img](@static/images/android/push/push_template_custom.png)

使用下面的示例代码后，通知栏中弹出的推送通知为：

您收到了一条消息<br/>
请及时查看

```TypeScript
// 下面以文本消息为例，其他类型的消息设置方法相同。
const message = ChatMessage.createTextSendMessage(conversationId, "消息内容");
if (message) {
  // 设置推送模板名称。设置前需在环信即时通讯云管理后台或调用 REST 接口创建推送模板。
  // 设置填写模板标题的 value 数组。
  let titleArgs = `["您","消息,"]`;
  // 设置填写模板内容的 value 数组。
  let contentArgs = `["请","查看"]`;
  let templateName = "push"; // 此处 `push` 为已在创建的推送模版名称。
  // 设置推送模板名称。若不指定，设置默认推送模板的信息。
  let pushTemplate = `{"name":"${templateName}", "title_args": ${titleArgs}, "content_args": ${contentArgs}}`;
  ChatLog.e(pushTemplate);
  message?.setJsonAttribute("em_push_template", pushTemplate);
  // 发送消息。
  ChatClient.getInstance().chatManager()?.sendMessage(message);
}
```

#### **消息接收方使用推送模板**

消息接收方可以调用 `setPushTemplate` 方法传入推送模板名称，选择要使用的模板。

:::tip
若发送方在发送消息时使用了推送模板，则推送通知栏中的显示内容以发送方的推送模板为准。
:::

```TypeScript
ChatClient.getInstance().pushManager()?.setPushTemplate("自定义模板名称").then(() => {
  // success logic
}).catch((e: ChatError) => {
  // failure logic
})
```
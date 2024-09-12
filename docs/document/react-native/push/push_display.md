# 设置推送通知的显示内容

通知收到后，通知栏中显示的推送标题和内容可通过以下方式设置，配置的优先级为由低到高：

1. 设置推送通知的显示属性；
2. 使用默认推送模板；
3. 使用消息扩展字段；
4. 使用自定义推送模板。

## 设置推送通知的显示属性

你可以分别调用 `updatePushNickname` 和 `updatePushDisplayStyle` 方法设置推送通知中显示的昵称（`nickname`）和通知显示样式（`displayStyle`），确定通知栏中的推送标题和推送内容。

```typescript
ChatClient.getInstance()
  .pushManager.updatePushNickname(nickname)
  .then(() => {
    console.log("Succeeded in updating the nickname.");
  })
  .catch((reason) => {
    console.log("Failed to update the nickname.", reason);
  });
```

```typescript
ChatClient.getInstance()
  .pushManager.updatePushDisplayStyle(displayStyle)
  .then(() => {
    console.log("Succeeded in updating the display style.");
  })
  .catch((reason) => {
    console.log("Failed to update the display style.", reason);
  });
```

你可以调用 `fetchPushOptionFromServer` 方法获取推送通知中的显示属性，如以下代码示例所示：

```typescript
ChatClient.getInstance()
  .pushManager.fetchPushOptionFromServer()
  .then(() => {
    console.log("Succeeded in getting the push configurations.");
  })
  .catch((reason) => {
    console.log("Failed to get the push configuration.", reason);
  });
```

若要在通知栏中显示消息内容，需要设置通知显示样式 `displayStyle`。该参数有如下两种设置：

- （默认）`Simple`：不论 `nickname` 是否设置，对于推送任何类型的消息，通知栏采用默认显示设置，即推送标题为“您有一条新消息”，推送内容为“请点击查看”。
- `Summary`：显示消息内容。设置的昵称只在 `displayStyle` 为 `Summary` 时生效，在 `Simple` 时不生效。

下表以单聊文本消息为例介绍这显示属性的设置。

<div class="alert info">对于群聊，下表中的“消息发送方的推送昵称”和“消息发送方的 IM 用户 ID”显示为“群组 ID”。</div>
| 参数设置      | 推送显示 | 图片    |
| :--------- | :----- |:------------- |
| <ul><li>`displayStyle`：（默认）`Simple`</li><li>`nickname`：设置或不设置</li></ul>  | <ul><li>推送标题：“您有一条新消息”</li><li>推送内容：“请点击查看”</li></ul>   | ![img](/images/android/push/push_displayattribute_1.png) |
| <ul><li>`displayStyle`：`Summary`</li><li>`nickname`：设置具体值</li></ul>| <ul><li>推送标题：“您有一条新消息”</li><li>推送内容：“消息发送方的推送昵称：消息内容”</li></ul>      | ![img](/images/android/push/push_displayattribute_2.png) |
| <ul><li>`displayStyle`：`Summary`</li><li>`nickname`：不设置</li></ul>    | <ul><li>推送标题：“您有一条新消息”</li><li>推送内容：“消息发送方的 IM 用户 ID: 消息内容”</li></ul>       | ![img](/images/android/push/push_displayattribute_3.png)  |

## 使用推送模板

推送模板主要用于服务器提供的默认配置不满足你的需求时，可使你设置全局范围的推送标题和推送内容。例如，服务器提供的默认设置为中文和英文的推送标题和内容，你若需要使用韩语或日语的推送标题和内容，则可以设置对应语言的推送模板。推送模板包括默认推送模板 `default` 和自定义推送模板，你可以通过以下两种方式设置：

- [调用 REST API 配置](/document/server-side/push.html#使用推送模板)。
- 在[环信即时通讯云控制台](https://console.easemob.com/user/login)设置推送模板，详见[控制台文档](/product/enable_and_configure_IM.html#配置推送模板)。

使用推送模板有以下优势：

1. 自定义修改环信服务端默认推送内容。

2. 接收方可以决定使用哪个模板。

3. 按优先级选择模板使用方式：

   - 使用自定义推送模板的优先级高于默认推送模板。

   - 若发送方发消息时设置了推送模板，接收方即使设置了推送模板，收到推送通知后也按照发送方设置的推送模板显示。

:::tip
设置推送模板为推送的高级功能，使用前需要在[环信即时通讯控制台](https://console.easemob.com/user/login)的**即时通讯 > 功能配置 > 功能配置总览**页面激活推送高级功能。如需关闭推送高级功能必须联系商务，因为该操作会删除所有相关配置。
:::

### 发消息时使用推送模板

创建模板后，你可以在发送消息时选择此推送模板，分为以下三种情况：

:::tip
若使用默认模板 **default**，消息推送时自动使用默认模板，创建消息时无需传入模板名称。
:::

1. 使用固定内容的推送模板，通过 `ext` 扩展字段指定推送模板名称。

这种情况下，创建消息时无需传入 `titleArgs` 和 `contentArgs` 参数。

```ts
const message = ChatMessage.createTextMessage("<target id>", "<send content>");
// 设置推送模板
message.attributes = {
  em_push_template: {
    name: "<push template name>",
  },
};
ChatClient.getInstance().chatManager.sendMessage(message, {
  onSuccess: (message: ChatMessage): void => {
    console.log("send message success.", message);
  },
  onError: (localMsgId: string, error: ChatError): void => {
    console.log("send message fail:", localMsgId, error);
  },
} as ChatMessageStatusCallback);
```

1. 使用自定义或者默认推送模板，模板中的推送标题和推送内容使用以下内置参数：

- `{$dynamicFrom}`：服务器按优先级从高到底的顺序填充备注、群昵称（仅限群消息）和推送昵称。
- `{$fromNickname}`：推送昵称。
- `{$msg}`：消息内容。

群昵称即群成员在群组中的昵称，群成员在发送群消息时通过扩展字段设置，JSON 结构如下：

```json
{
  "ext": {
    "em_push_ext": {
      "group_user_nickname": "Jane"
    }
  }
}
```

内置参数的介绍，详见[环信即时通讯控制台文档](/product/enable_and_configure_IM.html#使用默认推送模板)。

这种方式的示例代码与“使用固定内容的推送模板”的相同。

3. 使用自定义推送模板，而且推送标题和推送内容为自定义参数：

例如，推送模板的设置如下图所示：

![img](/images/android/push/push_template_custom.png)

使用下面的示例代码后，通知栏中弹出的推送通知为：

![img](/images/android/push/push_template_custom_example.png)

```ts
const message = ChatMessage.createTextMessage("<target id>", "<send content>");
// 设置推送模板
message.attributes = {
  em_push_template: {
    name: "<push template name>",
    title_args: ["<first argument>", "<second argument>"],
    content_args: ["<first argument>", "<second argument>"],
  },
};
ChatClient.getInstance().chatManager.sendMessage(message, {
  onSuccess: (message: ChatMessage): void => {
    console.log("send message success.", message);
  },
  onError: (localMsgId: string, error: ChatError): void => {
    console.log("send message fail:", localMsgId, error);
  },
} as ChatMessageStatusCallback);
```

### 消息接收方使用推送模板

消息接收方可以调用 `setPushTemplate` 方法传入推送模板名称，选择要使用的模板。

:::tip
若发送方在发送消息时使用了推送模板，则推送通知栏中的显示内容以发送方的推送模板为准。
:::

```ts
ChatClient.getInstance()
  .pushManager.selectPushTemplate("<selected template name>")
  .then(() => {
    console.log("success");
  })
  .catch((e) => {
    console.warn("fail", e);
  });
```

## 使用消息扩展字段设置推送通知显示内容

创建推送消息时，你可以设置消息扩展字段自定义要显示的推送标题 `em_push_title` 和推送内容 `em_push_content`。

```typescript
msg.attributes = {
  // 消息扩展字段。该字段为内置内置字段，字段名不可修改。
  em_apns_ext: {
    em_push_title: "custom push title", // 自定义推送消息标题。该字段为内置内置字段，字段名不可修改。
    em_push_content: "custom push content", // 自定义推送消息内容。该字段为内置内置字段，字段名不可修改。
  },
};
```

自定义显示字段的数据结构如下：

```java
{
    "em_apns_ext": {
        "em_push_title": "custom push title",
        "em_push_content": "custom push content"
    }
}
```

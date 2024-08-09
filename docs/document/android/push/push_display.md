# 设置推送通知的显示内容

通知收到后，通知栏中显示的推送标题和内容可通过以下方式设置，配置的优先级为由低到高：

1. **设置推送通知的显示属性**：使用默认的推送标题和内容，即推送通知的展示方式 `DisplayStyle` 采用默认的值（`SimpleBanner`）。推送标题为**您有一条新消息**，推送内容为**请点击查看**。
2. **使用默认推送模板**：若有默认模板 `default`，发消息时无需指定。
3. **使用消息扩展字段**：使用扩展字段自定义要显示的推送标题和推送内容，即 `em_push_title` 和 `em_push_content`。
4. **接收方设置了推送模板**。
5. **使用自定义推送模板**：发送消息时通过消息扩展字段指定推送模板名称。

## 设置和获取推送通知的显示属性

### 设置推送通知的显示属性

你可以调用 `updatePushNickname` 方法设置推送通知中显示的昵称，如以下代码示例所示：

```java
// 需要异步处理。
EMClient.getInstance().pushManager().updatePushNickname("pushNickname");
```

你也可以调用 `updatePushDisplayStyle` 设置推送通知的显示样式，如下代码示例所示：

```java
// 设置为简单样式。
EMPushManager.DisplayStyle displayStyle = EMPushManager.DisplayStyle.SimpleBanner;
// 需要异步处理。
EMClient.getInstance().pushManager().updatePushDisplayStyle(displayStyle);
```

若要在通知栏中显示消息内容，需要设置通知显示样式 `DisplayStyle`。`DisplayStyle` 是枚举类型，有如下两种设置：

| 参数值             | 描述                    |
| :--------------- | :---------------------- |
| （默认）`SimpleBanner`   | 不论 `nickname` 是否设置，对于推送任何类型的消息，通知栏采用默认显示设置，即推送标题为**您有一条新消息**，推送内容为**请点击查看**。 |
| `MessageSummary` | `MessageSummary`：显示消息内容。设置的昵称只在 `DisplayStyle` 为 `MessageSummary` 时生效，在 `SimpleBanner` 时不生效。 |

下表以**单聊文本消息**为例介绍显示属性的设置。

对于**群聊**，下表中的**消息发送方的推送昵称**和**消息发送方的 IM 用户 ID**显示为**群组 ID**。

| 参数设置      | 推送显示 | 图片    |
| :--------- | :----- |:------------- |
| <br/> - `DisplayStyle`：（默认）`SimpleBanner`<br/> - `nickname`：设置或不设置 | <br/> - 推送标题：**您有一条新消息**<br/> - 推送内容：**请点击查看**  | ![img](/images/android/push/push_displayattribute_1.png)|
| <br/> - `DisplayStyle`：`MessageSummary`<br/> - `nickname`：设置具体值 | <br/> - 推送标题：**您有一条新消息**<br/> - 推送内容：**消息发送方的推送昵称：消息内容**  |![img](/images/android/push/push_displayattribute_2.png)  |
| <br/> - `DisplayStyle`：`MessageSummary`<br/> - `nickname`：不设置    | <br/> - 推送标题：**您有一条新消息**<br/> - 推送内容：**消息发送方的 IM 用户 ID: 消息内容**  | ![img](/images/android/push/push_displayattribute_3.png)|

### 获取推送通知的显示属性

你可以调用 `getPushConfigsFromServer` 获取推送通知中的显示属性，如以下代码示例所示：

```java
EMPushConfigs pushConfigs = EMClient.getInstance().pushManager().getPushConfigsFromServer();
// 获取推送显示昵称。
String nickname = pushConfigs.getDisplayNickname();
// 获取推送通知的显示样式。
EMPushManager.DisplayStyle style = pushConfigs.getDisplayStyle();
```

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

```java
// 下面以文本消息为例，其他类型的消息设置方法相同。
EMMessage message = EMMessage.createSendMessage(EMMessage.Type.TXT);
EMTextMessageBody txtBody = new EMTextMessageBody("消息内容");
message.setTo("6006");
// 设置推送模板。
JSONObject pushObject = new JSONObject();
try {
    // 设置推送模板名称。设置前需在环信即时通讯云管理后台或调用 REST 接口创建推送模板。
   //若为默认模板 `default`，无需传入模板名称。
   //若为自定义模板，需传入模板名称。
    pushObject.put("name", "test7");

} catch (JSONException e) {
    e.printStackTrace();
}
// 将推送扩展设置到消息中。
message.setAttribute("em_push_template", pushObject);
// 设置消息状态回调。
message.setMessageStatusCallback(new EMCallBack() {...});
// 发送消息。
EMClient.getInstance().chatManager().sendMessage(message);
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

![img](/images/android/push/push_template_custom.png)

使用下面的示例代码后，通知栏中弹出的推送通知为：

![img](/images/android/push/push_template_custom_example.png)

```java
// 下面以文本消息为例，其他类型的消息设置方法相同。
EMMessage message = EMMessage.createSendMessage(EMMessage.Type.TXT);
EMTextMessageBody txtBody = new EMTextMessageBody("消息内容");
message.setTo("6006");
// 设置推送模板。设置前需在环信即时通讯云管理后台或调用 REST 接口创建推送模板。
JSONObject pushObject = new JSONObject();
JSONArray titleArgs = new JSONArray();
JSONArray contentArgs = new JSONArray();
try {
    // 设置推送模板名称。若不指定，设置默认推送模板的信息。
    pushObject.put("name", "push");
    // 设置填写模板标题的 value 数组。
    titleArgs.put("您");
    titleArgs.put("消息,");
    //...
    pushObject.put("title_args", titleArgs);
    // 设置填写模板内容的 value 数组。
    contentArgs.put("请");
    contentArgs.put("查看");
    //...
    pushObject.put("content_args", contentArgs);
} catch (JSONException e) {
    e.printStackTrace();
}
// 将推送扩展设置到消息中。
message.setAttribute("em_push_template", pushObject);
// 设置消息状态回调。
message.setMessageStatusCallback(new EMCallBack() {...});
// 发送消息。
EMClient.getInstance().chatManager().sendMessage(message);
```

### 消息接收方使用推送模板

消息接收方可以调用 `setPushTemplate` 方法传入推送模板名称，选择要使用的模板。

:::tip
若发送方在发送消息时使用了推送模板，则推送通知栏中的显示内容以发送方的推送模板为准。
:::

```java
EMClient.getInstance().pushManager().setPushTemplate("Template Name", new EMCallBack() {
    @Override
    public void onSuccess() {

    }

    @Override
    public void onError(int code, String error) {

    }
});
```

### 使用消息扩展字段设置推送通知显示内容

创建推送消息时，你可以设置消息扩展字段自定义要显示的推送标题 `em_push_title` 和推送内容 `em_push_content`。

```java
// 这里以文本消息为例，附件等类型的消息设置方法相同。
EMMessage message = EMMessage.createSendMessage(EMMessage.Type.TXT);
EMTextMessageBody txtBody = new EMTextMessageBody("message content");
// 设置要发送用户的用户 ID。
message.setTo("toChatUsername");
// 设置自定义推送提示。
JSONObject extObject = new JSONObject();
try {
    extObject.put("em_push_title", "custom push title");
    extObject.put("em_push_content", "custom push content");
} catch (JSONException e) {
    e.printStackTrace();
}
// 将推送扩展设置到消息中。
message.setAttribute("em_apns_ext", extObject);
// 设置消息体。
message.addBody(txtBody);
// 设置消息回调。
message.setMessageStatusCallback(new CallBack() {...});
// 发送消息。
EMClient.getInstance().chatManager().sendMessage(message);
```

| 参数              | 描述                                                                     |
| :---------------- | :----------------------------------------------------------------------- |
| `toChatUsername`  | 消息接收方 ID。                                                          |
| `em_apns_ext`     | 消息扩展，使用扩展的方式向推送中添加自定义字段，该值为固定值，不可修改。 |
| `em_push_title`   | 自定义字段 key，用于设置自定义的标题，该值为固定值，不可修改。           |
| `em_push_content` | 自定义字段 key，用于设置自定义的内容，该值为固定值，不可修改。           |
# Push Templates

## Feature overview

Push templates are used to customize the title and content of push notifications when the default offline push content cannot meet business requirements. For example, if the default settings provided by the server are push titles and content in Chinese and English, and you need to use push titles and content in Korean or Japanese, you can set push templates for the corresponding languages.

You can configure push templates through EasyIM Console or the [server-side REST API for configuring push templates](/rest/push_template_create.html), and specify the template name and template parameters through message extension fields when sending messages.

Push templates include the default templates `default` and `detail`, and custom templates. Default templates apply to general push scenarios. Custom templates apply to scenarios where different push content needs to be displayed by business scenario, language, or recipient.

Push templates have the following characteristics:

1. Push templates have a higher priority than [calling the API to set push content in the notification bar](push_display_attribute.html).
2. Customizing the server-side default push content through EasyIM Console or the [server-side REST API](/rest/push_template_create.html) is supported.
3. For group messages, you can use targeted templates to push offline notifications that are different from those received by other users to certain users.
4. The recipient can configure a push template: If the sender uses a push template when sending a message, the display content in the push notification bar follows the sender's push template.
5. Priority of push template usage:
   - Custom templates have a higher priority than default templates.
   - When the sender specifies a push template in the message extension field, even if the recipient has set a push template, the push notification is displayed according to the push template set by the sender.

## Feature activation

[Push templates](push_template.html) are an advanced push feature. Before using them, you need to enable them for free in [EasyIM Console](https://console.easyim.ai/user/login). **After activation, if you need to disable advanced push features, you must contact the EasyIM business manager, because this operation deletes all configurations related to advanced features.**

1. Log in to [EasyIM Console](https://console.easyim.ai/user/login). 
2. On the **Applications** page, click the App Key of the app of the development or production environment.
3. Select **Push** in the left navigation pane and click the **Offline Push** tab.
4. Click **Enable for free**.

After activation, you can [set push templates](#set-push-templates).

![image](/images/android/push/push_advanced_feature_enable.png)

## Set push templates

You can set offline push templates in the following two ways:

- [Call the REST API to configure them](/rest/push_template_overview.html).
- Set push templates in [EasyIM Console](https://console.easyim.ai/user/login).

For the data structure related to push templates, see [Push extension fields](/rest/push_extension.html). The following describes how to set offline push templates in EasyIM Console.

### Edit the default push template

After offline push templates are enabled, two templates, `default` and `detail`, are added to the **Template Management** page by default. If no custom push template is configured, the default template is automatically used when a message is pushed, and you do not need to pass in a template name when creating a message.

 - `default`: By default, the push title is **You have a new message**, and the push content is **Please tap to view**. If the `updatePushDisplayStyle` method is called to set `DisplayStyle` to `SimpleBanner`, the default push template is `default`.
 - `detail`: By default, the push title is **You have a new message**, and the push content is the push nickname of the message sender and the message content. If the `updatePushDisplayStyle` method is called to set `DisplayStyle` to `MessageSummary`, the default push template is `detail`.

![img](/images/console/push_template_default.png)

You can choose **More > Edit** in the **Actions** column to modify the push title and push content of the default push template. The template name cannot be edited.

![img](/images/console/push_template_default_edit.png)

| Parameter | Type | Description |
| :-------------- | :----- | :----- |
| Title/content | Array | The parameters can be set in the following ways:<br/> - Enter fixed content. For example, set the title to **Hello** and the content to **You have a new message**. <br/> - Built-in parameter filling: 1. `{$dynamicFrom}`: Fills friend remarks, group nickname (group messages only), and push nickname in descending priority order. 2. `{$fromNickname}`: Push nickname. 3. `{$msg}`: Message content.<br/> - Custom parameter filling: Enter array index placeholders in the template. The format is: {0} {1} {2} ... {n} |

For the push title and content, the first two setting methods do not require this parameter to be passed in when creating a message. The third setting method requires the parameter to be passed in through the extension field.

Push template parameters are in the message extension `ext.em_push_template`. The JSON structure of push template parameters is as follows:

  ```json
  {
      "ext":{
          "em_push_template":{
              "title_args":[
                  "EasyIM"
              ],
              "content_args":[
                  "Welcome to im-push",
                  "Keep going"
              ]
          }
      }
  }
  
  # title: {0} = "EasyIM"
  # content: {0} = "Welcome to im-push" {1} = "Keep going"
  ```

  A group nickname is the nickname of a group member in the group. To display the group nickname in a push notification, the group member can set it through an extension field when sending a group message. The JSON structure is as follows:

```json
  {
    "ext":{
            "em_push_ext":{
                "group_user_nickname":"Jane"
            }
        }
  }      
```

### Add a custom push template

EasyIM supports adding custom push templates. In addition to [calling the RESTful API](/rest/push_template_create.html) to create a custom push template, you can also add a custom push template in [EasyIM Console](https://console.easyim.ai/user/login). **Custom push templates have a higher level than default templates.**

On the **Offline Push** page, click **Add push template** to create a custom push template.

| Parameter | Type | Description |
| :-------------- | :----- | :----- |
| Template name | String | The push template name, which can contain up to 64 characters and supports the following character sets:<br/> - 26 lowercase English letters a-z <br/> - 26 uppercase English letters A-Z <br/> - 10 digits 0-9 |
| Title/content | Array | For details, see [Configuration in the default push template](#edit-the-default-push-template). |

**When creating a message, you need to pass in the template name, push title, and push content by using extension fields**. The push title and content in the notification bar use the formats in the template respectively. For details, see [Parameters of the default push template in message extensions](#edit-the-default-push-template).

![img](/images/console/push_template_add.png)

## Use a push template when sending a message

You can select a push template when sending a message. Push templates can be set in three ways.

:::tip
1. If the default template **default** or **detail** is used, the default template is automatically used when the message is pushed, and you do not need to pass in the template name when creating the message.
2. When a custom template is used, the **push title** and **push content** parameters must be passed in through extension fields when creating a message, regardless of which method is used to set them.
:::

### Use a push template with fixed content

For a push template with fixed content, specify the push template name through the `ext` extension field.

In this case, you do not need to pass in the `titleArgs` or `contentArgs` parameter when creating a message.

```java
// This example uses a text message. Other message types are configured in the same way.
EMMessage message = EMMessage.createSendMessage(EMMessage.Type.TXT);
EMTextMessageBody txtBody = new EMTextMessageBody("message content");
message.setTo("6006");
// Set the push template.
JSONObject pushObject = new JSONObject();
try {
    // Set the push template name. Before setting it, create the push template in EasyIM Console or by calling the REST API.
   // If it is the default template `default` or `detail`, you do not need to pass in the template name.
   // If it is a custom template, you need to pass in the template name.
    pushObject.put("name", "test7");

} catch (JSONException e) {
    e.printStackTrace();
}
// Set the push extension to the message.
message.setAttribute("em_push_template", pushObject);
// Set the message status callback.
message.setMessageStatusCallback(new EMCallBack() {...});
// Send the message.
EMClient.getInstance().chatManager().sendMessage(message);
```

### Use a push template that contains built-in parameters

Use a custom or default push template, and use the following built-in parameters for the push title and push content in the template:

- `{$dynamicFrom}`: The server fills friend remarks, group nickname (group messages only), and push nickname in descending priority order.
- `{$fromNickname}`: Push nickname.
- `{$msg}`: Message content.

A group nickname is the nickname of a group member in the group. The group member sets it through an extension field when sending a group message. The JSON structure is as follows:

```json
  {
    "ext":{
            "em_push_ext":{
                "group_user_nickname":"Jane"
            }
        }
  }      
```

For an introduction to built-in parameters, see [Edit the default push template](#edit-the-default-push-template).

The sample code for this method is the same as [Use a push template with fixed content](#use-a-push-template-with-fixed-content).

### Use a push template that contains custom parameters

Use a custom push template where the push title and push content are custom parameters:

For example, the push template is set as shown below:

![img](/images/android/push/push_template_custom.png)

After you use the following sample code, the push notification that appears in the notification bar is:

![img](/images/android/push/push_template_custom_example.png)

```java
// This example uses a text message. Other message types are configured in the same way.
EMMessage message = EMMessage.createSendMessage(EMMessage.Type.TXT);
EMTextMessageBody txtBody = new EMTextMessageBody("message content");
message.setTo("6006");
// Set the push template. Before setting it, create the push template in EasyIM Console or by calling the REST API.
JSONObject pushObject = new JSONObject();
JSONArray titleArgs = new JSONArray();
JSONArray contentArgs = new JSONArray();
try {
    // Set the push template name. If not specified, the default push template information is set.
    pushObject.put("name", "push");
    // Set the value array used to fill the template title.
    titleArgs.put("You");
    titleArgs.put("message,");
    //...
    pushObject.put("title_args", titleArgs);
    // Set the value array used to fill the template content.
    contentArgs.put("Please");
    contentArgs.put("check");
    //...
    pushObject.put("content_args", contentArgs);
} catch (JSONException e) {
    e.printStackTrace();
}
// Set the push extension to the message.
message.setAttribute("em_push_template", pushObject);
// Set the message status callback.
message.setMessageStatusCallback(new EMCallBack() {...});
// Send the message.
EMClient.getInstance().chatManager().sendMessage(message);
```

## The message recipient uses a push template

The message recipient can call `setPushTemplate` and pass in the push template name to select the template to use.

:::tip
If the sender uses a push template when sending a message, the display content in the push notification bar follows the sender's push template.
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

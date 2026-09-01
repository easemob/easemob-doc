# Push Templates

## Feature overview

Push templates customize push-notification titles and content when the default offline-push content does not meet your business requirements. For example, the server provides default push titles and content in Chinese and English. To use Korean or Japanese push titles and content, configure a push template for the corresponding language.

Configure push templates through the EasyIM Console or the [server-side REST API](/rest/push_template_create.html), and specify the template name and parameters through message extension fields when sending a message.

Push templates include the default templates `default` and `detail` and custom templates. Default templates apply to general push scenarios. Custom templates apply when different push content must be displayed according to the business scenario, language, or recipient.

Push templates have the following characteristics:

1. You can customize the default server-side push content through the EasyIM Console or the [server-side REST API](/rest/push_template_create.html).
2. For a group message, use a targeted template to push a different offline notification to some users than to other users.
3. A recipient can configure a push template. If the sender uses a push template when sending a message, the push notification displays the content from the sender's push template.
4. Push-template priority:
   - A custom template has a higher priority than a default template.
   - When the sender specifies a push template in the message extension, the notification is displayed using the sender's push template even if the recipient configured a push template.

## Feature activation

[Push templates](push_template.html) are an advanced push feature. Before using them, enable them for free in the [EasyIM Console](https://console.easyim.ai/user/login). **After activation, to disable advanced push features, you must contact the EasyIM business manager because this operation deletes all configurations related to the advanced features.**

1. Log in to [EasyIM Console](https://console.easyim.ai/user/login). 
2. On the **Applications** page, click the App Key of the app of the development or production environment.
3. Select **Push** in the left navigation pane and click the **Offline Push** tab.
4. Click **Enable Free**.

After activation, you can [configure push templates](#configure-push-templates).

![image](/images/android/push/push_advanced_feature_enable.png)

## Configure push templates

Configure offline push templates in either of the following ways:

- [Call a REST API](/rest/push_template_overview).
- Configure push templates in the [EasyIM Console](https://console.easyim.ai/user/login).

For push-template data structures, see [Push Extension Fields](/rest/push_extension.html). The following sections describe how to configure offline push templates in the EasyIM Console.

### Edit the default push templates

After offline push templates are enabled, the **Offline Push** page generates the `default` and `detail` templates. If a custom template is not configured or specified, the server uses a default template to generate the offline push notification, and you do not need to pass a template name when sending a message.

- `default`: The default push title is **You've got a new message**, and the push content is **Please click to view**.
- `detail`: The default push title is **You've got a new message**, and the push content contains the message sender's push nickname and message content.

![img](/images/console/push_template_default.png)

In the **Actions** column, select **More > Edit** to change the push title and content of a default template. The template name is a system-defined field and cannot be edited.

![img](/images/console/push_template_default_edit.png)

| Parameter | Type | Description |
| :--- | :--- | :--- |
| Title/Content | Array | Push titles and content support the following configuration methods:<br/> - Fixed content: Enter fixed content directly, such as the title **Hello** and content **You've got a new message**.<br/> - Built-in parameters: Use server-defined placeholders to dynamically populate content. 1. `{$dynamicFrom}` populates friend remarks, the group nickname (for group messages only), or the push nickname in order of priority. 2. `{$fromNickname}` represents the push nickname. 3. `{$msg}` represents the message content.<br/> - Custom parameters: Use array-index placeholders to populate content in the format `{0}`, `{1}`, `{2}` ... `{n}`. |

For fixed content and built-in parameters, you do not need to pass additional template parameters when sending a message. For custom parameters, pass parameter values through message extension fields when sending a message.

On the Web client, pass message extension fields through the `ext` parameter when creating a message; the parameter must be a JSON-serializable object. If the template title or content uses custom placeholders, for example, the title contains `{0}` and the content contains `{0}` and `{1}`, pass the corresponding parameter values through `ext.em_push_template.title_args` and `ext.em_push_template.content_args` when sending the message.

```json
{
  "ext": {
    "em_push_template": {
      "title_args": ["EasyIM"],
      "content_args": ["Welcome to IM Push", "Keep it up"]
    }
  }
}
```

In the preceding example, `title_args[0]` populates `{0}` in the title. `content_args[0]` and `content_args[1]` populate `{0}` and `{1}` in the content, respectively.

To display a group member's nickname in the chat group in a push notification, pass the group nickname through `ext.em_push_ext.group_user_nickname` when sending a group message:

```json
{
  "ext": {
    "em_push_ext": {
      "group_user_nickname": "Jane"
    }
  }
}
```

### Add a custom push template

EasyIM supports adding custom push templates. In addition to [calling a RESTful API](/rest/push_template_create.html) to create a custom push template, you can add one in the [EasyIM Console](https://console.easyim.ai/user/login). **A custom push template has a higher priority than a default template.**

On the **Template Management** page, click **Add Push Template** to create a custom push template.

| Parameter            | Type   | Description   |
| :-------------- | :----- | :----- |
| Template name | String | Push template name. It can contain up to 64 characters from the following character sets:<br/> - 26 lowercase English letters a-z <br/> - 26 uppercase English letters A-Z <br/> - 10 digits 0-9 | 
| Title/Content  | Array   | See [Configuration of default push templates](#edit-the-default-push-templates). | 

**When creating a message, pass the template name and push-title and push-content parameters through message extension fields.** The push title and content in the notification use the formats in the template. For details, see [Parameters for default push templates in message extensions](#edit-the-default-push-templates).

![img](/images/console/push_template_add.png)

## Use a push template when sending a message

When sending a message, select a push template through a message extension field. All SDK message types support the `ext` extension field. The following example uses a text message. Other message types are configured in the same way.

:::tip
1. If you use the default template **default** or **detail**, message push automatically uses the default template, and you do not need to pass a template name when creating the message.
2. When using a custom template, regardless of how the **push title** and **push content** parameters are configured, pass them through `ext.em_push_template` when creating the message.
:::

### Use a push template with fixed content

When using a push template with fixed content, specify the push-template name through `ext.em_push_template.name`.

In this case, you do not need to pass `title_args` or `content_args` when creating the message. 

```typescript
const message = client.chatManager.createTextMessage({
  conversationId: 'username',
  conversationType: 'singleChat',
  content: 'message content',
  ext: {
    em_push_template: {
      // Set the push-template name. Before doing so, create the push template in the EasyIM Console or through a REST API.
      // If using the default template `default` or `detail`, you generally do not need to pass the template name.
      // If using a custom template, pass the template name.
      name: 'test7',
    },
  },
});

await client.chatManager.sendMessage(message);
```

### Use a push template with built-in parameters

When using a custom or default push template, its push title and content can use the following built-in parameters:

- `{$dynamicFrom}`: The server selects from friend remarks, the group nickname (for group messages only), and the push nickname in descending order of priority.
- `{$fromNickname}`: Push nickname.  
- `{$msg}`: Message content.

The group nickname is the group member's nickname in the chat group. A group member sets it through an extension field when sending a group message. The JSON structure is as follows:

```json
{
  "ext": {
    "em_push_ext": {
      "group_user_nickname": "Jane"
    }
  }
}
```

For built-in parameters, see [Edit the default push templates](#edit-the-default-push-templates).

The example code is the same as that in [Use a push template with fixed content](#use-a-push-template-with-fixed-content).

### Use a push template with custom parameters

When using a custom push template, you can use custom parameters in the push title and content.

For example, configure the push template as shown in the following image:

![img](/images/android/push/push_template_custom.png)

After you use the following example code, the notification displayed in the notification bar is:

![img](/images/android/push/push_template_custom_example.png)

```typescript
// The following example uses a text message. Other message types are configured in the same way.
const message = client.chatManager.createTextMessage({
  conversationId: "username",
  conversationType: "singleChat",
  content: "message content",
  ext: {
    em_push_template: {
      // Set the push-template name. If omitted, the server applies the default push-template logic.
      name: "push",
      // Set the value array used to populate the template title.
      title_args: ["You've", "message"],
      // Set the value array used to populate the template content.
      content_args: ["Please", "view"],
    },
  },
});

const sentMessage = await client.chatManager.sendMessage(message);
console.log('Send message success', sentMessage);
```

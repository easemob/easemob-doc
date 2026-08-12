# 推送模板

## 功能说明

推送模板用于在默认离线推送内容不满足业务需求时，自定义推送通知的标题和内容。例如，服务器提供的默认设置为中文和英文的推送标题和内容，你若需要使用韩语或日语的推送标题和内容，则可以设置对应语言的推送模板。

你可以通过环信控制台或 [服务端 REST API 配置推送模板](/document/server-side/push_template_create.html)，并在发送消息时通过消息扩展字段指定模板名称和模板参数。

推送模板包括默认模板 `default`、`detail` 和自定义模板。默认模板适用于通用推送场景；自定义模板适用于需要按业务场景、语言或接收对象展示不同推送内容的场景。

推送模板具有以下特点：

1. 支持通过环信控制台或 [服务端 REST API](/document/server-side/push_template_create.html) 自定义服务端默认推送内容。
2. 对于群组消息，你可以使用定向模板向某些用户推送与其他用户不同的离线通知。
3. 接收方可配置推送模板：若发送方在发送消息时使用了推送模板，则推送通知栏中的显示内容以发送方的推送模板为准。
4. 推送模板使用优先级：
   - 自定义模板的优先级高于默认模板。
   - 发送方在消息扩展字段中指定推送模板时，接收方即使设置了推送模板，收到推送通知后也按照发送方设置的推送模板显示。

## 开通功能

[推送模板](push_template.html) 是推送的高级功能。使用前，你需要在 [环信控制台](https://console.easemob.com/user/login) 免费开通。**激活后，如需关闭推送高级功能，必须联系商务，因为该操作会删除高级功能相关的所有配置。**

1. 登录 [环信控制台](https://console.easemob.com/user/login)。
2. 选择页面上方的 **应用管理**。在弹出的应用列表页面，单击测试版 App Key 或正式版 App Key。
3. 选择 **增值服务 > 消息推送 > 离线推送**。
4. 点击 **免费开通**。

开通后，你可以 [设置推送模板](#设置推送模板)。

![image](/images/android/push/push_advanced_feature_enable.png)

## 设置推送模板

你可以通过以下两种方式设置离线推送模板：

- [调用 REST API 配置](/document/server-side/push_template_overview)。
- 在 [环信控制台](https://console.easemob.com/user/login) 设置推送模板。

推送模板相关的数据结构，详见[推送扩展字段](/document/server-side/push_extension.html)。下面为在环信控制台设置离线推送模板。

### 编辑默认推送模板

开通离线推送模板后，**离线推送** 页面会默认生成 `default` 和 `detail` 两个模板。若未配置或未指定自定义模板，服务端会使用默认模板生成离线推送通知，发送消息时无需传入模板名称。

- `default`：默认推送标题为 **您有一条新消息**，推送内容为 **请点击查看**。
- `detail`：默认推送标题为 **您有一条新消息**，推送内容为消息发送方的推送昵称和消息内容。

![img](/images/console/push_template_default.png)

你可以在 **操作** 栏中选择 **更多 > 编辑**，修改默认模板的推送标题和推送内容。模板名称为系统预置字段，不支持编辑。

![img](/images/console/push_template_default_edit.png)

| 参数 | 类型 | 描述 |
| :--- | :--- | :--- |
| 标题/内容 | Array | 推送标题和内容支持以下设置方式：<br/> - 固定内容：直接输入固定内容，例如标题为 **您好**，内容为 **您有一条新消息**。<br/> - 内置参数：使用服务端内置占位符动态填充内容。1. `{$dynamicFrom}` 按优先级填充好友备注、群昵称（仅限群消息）或推送昵称。2. `{$fromNickname}` 表示推送昵称。3. `{$msg}` 表示消息内容。<br/> - 自定义参数：使用数组索引占位符填充内容，格式为 `{0}`、`{1}`、`{2}` ... `{n}`。 |

对于固定内容和内置参数，发送消息时无需额外传入模板参数。对于自定义参数，发送消息时需要通过消息扩展字段传入参数值。

在 Web 端，消息扩展字段通过创建消息时的 `ext` 参数传入，且必须为可 JSON 序列化的对象。若模板标题或内容使用自定义占位符，例如标题中包含 `{0}`，内容中包含 `{0}` 和 `{1}`，则发送消息时需要通过 `ext.em_push_template.title_args` 和 `ext.em_push_template.content_args` 传入对应参数值。

```json
{
  "ext": {
    "em_push_template": {
      "title_args": ["环信"],
      "content_args": ["欢迎使用im-push", "加油"]
    }
  }
}
```

上述示例中，`title_args[0]` 用于填充标题中的 `{0}`；`content_args[0]` 和 `content_args[1]` 分别用于填充内容中的 `{0}` 和 `{1}`。

此外，若需要在推送通知中展示群成员在群组中的昵称，可在发送群消息时通过 `ext.em_push_ext.group_user_nickname` 传入群昵称：

```json
{
  "ext": {
    "em_push_ext": {
      "group_user_nickname": "Jane"
    }
  }
}
```

### 添加自定义推送模板

即时通讯 IM 支持添加自定义推送模板。除了 [调用 RESTful 接口](/document/server-side/push_template_create.html) 创建自定义推送模板，你还可以在 [环信控制台](https://console.easemob.com/user/login) 添加自定义推送模板。**自定义推送模板的级别比默认模板高。**

在 **模板管理** 页面，点击 **添加推送模板** 创建自定义推送模板。

| 参数            | 类型   | 描述   |
| :-------------- | :----- | :----- |
| 模板名称 | String | 推送模板名称，最多可包含 64 个字符，支持以下字符集：<br/> - 26 个小写英文字母 a-z <br/> - 26 个大写英文字母 A-Z <br/> - 10 个数字 0-9 | 
| 标题/内容  | Array   | 详见 [默认推送模板中的配置](#编辑默认推送模板)。 | 

**创建消息时需通过消息扩展字段传入模板名称、推送标题和推送内容参数**，通知栏中的推送标题和内容分别使用模板中的格式。详见 [消息扩展中的默认推送模板的参数](#编辑默认推送模板)。

![img](/images/console/push_template_add.png)

## 发消息时使用推送模板

你可以在发送消息时通过消息扩展字段选择推送模板。SDK 中所有消息类型都支持 `ext` 扩展字段；下面以文本消息为例，其他消息类型的设置方式相同。

:::tip
1. 若使用默认模板 **default** 或 **detail**，消息推送时自动使用默认模板，创建消息时无需传入模板名称。
2. 使用自定义模板时，**推送标题** 和 **推送内容** 参数无论通过哪种方式设置，创建消息时均需通过 `ext.em_push_template` 传入。
:::

### 使用固定内容的推送模板

使用固定内容的推送模板时，可通过 `ext.em_push_template.name` 指定推送模板名称。

这种情况下，创建消息时无需传入 `title_args` 和 `content_args` 参数。 

```typescript
const message = client.chatManager.createTextMessage({
  conversationId: 'username',
  conversationType: 'singleChat',
  content: 'message content',
  ext: {
    em_push_template: {
      // 设置推送模板名称。设置前需在环信控制台或调用 REST 接口创建推送模板。
      // 若使用默认模板 `default` 或 `detail`，通常无需传入模板名称。
      // 若使用自定义模板，需传入模板名称。
      name: 'test7',
    },
  },
});

await client.chatManager.sendMessage(message);
```

### 使用包含内置参数的推送模板

使用自定义或者默认推送模板，模板中的推送标题和推送内容使用以下内置参数：

- `{$dynamicFrom}`：服务器按优先级从高到低的顺序填充备注、群昵称（仅限群消息）和推送昵称。
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

内置参数的介绍，详见[编辑默认推送模板](#编辑默认推送模板)中的介绍。

这种方式的示例代码与 [使用固定内容的推送模板](#使用固定内容的推送模板) 的相同。

### 使用包含自定义参数的推送模板

使用自定义推送模板，而且推送标题和推送内容为自定义参数：

例如，推送模板的设置如下图所示：

![img](/images/android/push/push_template_custom.png)

使用下面的示例代码后，通知栏中弹出的推送通知为：

您收到了一条消息<br/>
请及时查看

```typescript
// 下面以文本消息为例，其他类型的消息设置方法相同。
const message = client.chatManager.createTextMessage({
  conversationId: 'username',
  conversationType: 'singleChat',
  content: 'message content',
  ext: {
    em_push_template: {
      // 设置推送模板名称。若不指定，服务端按默认推送模板逻辑处理。
      name: 'push',
      // 设置填写模板标题的 value 数组。
      title_args: ['您', '消息'],
      // 设置填写模板内容的 value 数组。
      content_args: ['请', '查看'],
    },
  },
});

const sentMessage = await client.chatManager.sendMessage(message);
console.log('Send message success', sentMessage);
```

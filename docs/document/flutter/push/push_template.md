# 推送模板

## 功能说明

推送模板用于在默认离线推送内容不满足业务需求时，自定义推送通知的标题和内容。例如，服务器提供的默认设置为中文和英文的推送标题和内容，你若需要使用韩语或日语的推送标题和内容，则可以设置对应语言的推送模板。

你可以通过环信控制台或 [服务端 REST API 配置推送模板](/document/server-side/push_template_create.html)，并在发送消息时通过消息扩展字段指定模板名称和模板参数。

推送模板包括默认模板 `default`、`detail` 和自定义模板。默认模板适用于通用推送场景；自定义模板适用于需要按业务场景、语言或接收对象展示不同推送内容的场景。

推送模板具有以下特点：

1. 推送模板的优先级高于 [调用 API 设置通知栏的推送内容](push_display_attribute.html)。
2. 支持通过环信控制台或 [服务端 REST API](/document/server-side/push_template_create.html) 自定义服务端默认推送内容。
3. 对于群组消息，你可以使用定向模板向某些用户推送与其他用户不同的离线通知。定向模板的数据结构详见 [推送扩展字段](/document/server-side/push_extension.html)。
4. 接收方可配置推送模板：若发送方在发送消息时使用了推送模板，则推送通知栏中的显示内容以发送方的推送模板为准。
5. 推送模板使用优先级：
   - 自定义模板的优先级高于默认模板。
   - 发送方在消息扩展字段中指定推送模板时，接收方即使设置了推送模板，收到推送通知后也按照发送方设置的推送模板显示。

使用推送模板前，需完成设备推送配置和 Token 绑定，详见 [离线推送概述](push_overview.html)。

## 开通功能

[推送模板](push_template.html) 是推送的高级功能。使用前，你需要在 [环信控制台](https://console.easemob.com/user/login) 免费开通。**激活后，如需关闭推送高级功能，必须联系商务，因为该操作会删除高级功能相关的所有配置。**

1. 登录 [环信控制台](https://console.easemob.com/user/login)。
2. 选择页面上方的 **应用管理**。在弹出的应用列表页面，单击测试版 App Key 或正式版 App Key。
3. 选择 **即时通讯 > 推送配置 > 离线推送配置**。
4. 点击 **免费开通**。

开通后，你可以 [设置推送模板](#设置推送模板)。

![开通推送高级功能](/images/android/push/push_advanced_feature_enable.png)

## 设置推送模板

你可以通过以下两种方式设置离线推送模板：

- [调用 REST API 配置](/document/server-side/push_template_overview.html)。
- 在 [环信控制台](https://console.easemob.com/user/login) 设置推送模板。

推送模板相关的数据结构，详见 [推送扩展字段](/document/server-side/push_extension.html)。下面为在环信控制台 配置离线推送模板。

### 编辑默认推送模板

离线推送模板开通后，**离线推送配置** 页面默认添加两个模板，`default` 和 `detail`。若发送方未指定模板、接收方也未选择自定义模板，消息推送时按显示样式使用默认模板，创建消息时无需传入模板名称。

- `default`：默认情况下，推送标题为 **您有一条新消息**，推送内容为 **请点击查看**。若调用 `ChatPushManager#updatePushDisplayStyle` 将显示样式设置为 `DisplayStyle.Simple`，则对应默认模板 `default`。
- `detail`：默认情况下，推送标题为 **您有一条新消息**，推送内容为消息发送方的推送昵称和消息内容。若调用 `ChatPushManager#updatePushDisplayStyle` 将显示样式设置为 `DisplayStyle.Summary`，则对应默认模板 `detail`。推送昵称未设置时的展示规则，详见 [设置推送通知的显示属性](push_display_attribute.html#设置推送通知的显示属性)。

![默认推送模板](/images/console/push_template_default.png)

你可以在 **操作** 栏中选择 **更多 > 编辑**，修改默认推送模板的推送标题和推送内容，模板名称不能编辑。

![编辑默认推送模板](/images/console/push_template_default_edit.png)

| 参数 | 类型 | 描述 |
| :--- | :--- | :--- |
| 标题/内容 | Array | 参数的设置方式如下：<br/> - 输入固定内容，例如，标题为 **您好**，内容为 **您有一条新消息**。<br/> - 内置参数填充：`{$dynamicFrom}` 按优先级从高到低填充好友备注、群昵称（仅限群消息）和推送昵称；`{$fromNickname}` 为推送昵称；`{$msg}` 为消息内容。<br/> - 自定义参数填充：模板中输入数组索引占位符，格式为 `{0}`、`{1}`、`{2}`……`{n}`。 |

对于推送标题和内容，前两种设置方式在创建消息时无需传入参数数组；第三种方式需要通过扩展字段传入与占位符对应的参数数组。标题和内容分别使用独立的数组，均从索引 `0` 开始。

推送模板参数在服务端消息 JSON 的 `ext.em_push_template` 中，其 JSON 结构如下：

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

上例中，标题中的 `{0}` 替换为“环信”；内容中的 `{0}` 和 `{1}` 分别替换为“欢迎使用im-push”和“加油”。没有 `name` 时，为所选默认模板提供参数；仅当该模板中包含相应索引占位符时，参数才用于填充。

在 Flutter 中，将上述 `em_push_template` Map 设置到 `message.attributes` 中即可，不要额外嵌套 `ext`，也不要把 Map 转换成 JSON 字符串。

群昵称即群成员在群组中的昵称。若要在推送通知中展示群昵称，群成员在发送群消息时可通过扩展字段 `em_push_ext.group_user_nickname` 提供，JSON 结构如下：

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

在 **离线推送** 页面，点击 **添加推送模板** 创建自定义推送模板。

| 参数 | 类型 | 描述 |
| :--- | :--- | :--- |
| 模板名称 | String | 推送模板名称，最多可包含 64 个字符，支持以下字符集：<br/> - 26 个小写英文字母 a-z。<br/> - 26 个大写英文字母 A-Z。<br/> - 10 个数字 0-9。 |
| 标题/内容 | Array | 详见 [默认推送模板中的配置](#编辑默认推送模板)。 |

发送方使用自定义模板时，应在消息扩展字段 `em_push_template.name` 中传入已创建的模板名称，并根据模板内容传入必要的参数数组。具体规则详见 [发消息时使用推送模板](#发消息时使用推送模板)。

![添加推送模板](/images/console/push_template_add.png)

## 发消息时使用推送模板

你可以在发送消息时选择推送模板，按模板内容分为以下三种使用方式。

:::tip
1. 使用默认模板 `default` 或 `detail` 时，创建消息时无需传入默认模板名称。
2. 使用自定义模板时，需通过 `em_push_template.name` 指定模板名称；标题和内容的参数数组按下表规则传入。
:::

发送方指定自定义模板时，应遵循以下参数传入规则：

| 模板内容 | 消息扩展中需要传入的内容 |
| :--- | :--- |
| 固定内容 | 模板名称 `name`，无需传入 `title_args` 和 `content_args`。 |
| 内置参数 | 模板名称 `name`，无需通过 `title_args` 和 `content_args` 传入内置参数的值。 |
| 索引占位符 | 模板名称 `name`；标题包含索引占位符时传入 `title_args`，内容包含索引占位符时传入 `content_args`。 |

上述字段均位于消息扩展 `em_push_template` 中。标题和内容分别判断是否需要参数数组，不要求两个数组同时传入；数组中的值和顺序应与对应模板中的索引占位符匹配。通知栏中的标题和内容由模板格式及对应参数生成，无需另行传入完整的标题、内容文本。

下面的示例在 SDK 初始化并成功登录后调用。示例采用单聊文本消息，其他普通消息类型的模板扩展设置方式相同；群聊时将 `targetId` 改为群组 ID，并设置 `chatType: ChatType.GroupChat`。推送模板只改变离线通知展示，不改变聊天消息体。

### 使用固定内容的推送模板

使用固定内容的推送模板，通过 `ChatMessage.attributes` 中的 `em_push_template` 指定模板名称。这种情况下，创建消息时无需传入 `title_args` 和 `content_args`。

```dart
Future<void> sendFixedTemplateMessage(String userId) async {
  // 创建文本消息，同时设置接收方、消息体和会话类型。
  final ChatMessage message = ChatMessage.createTxtSendMessage(
    targetId: userId,
    content: '消息内容',
    chatType: ChatType.Chat,
  );

  // 将推送模板扩展设置到消息中，并保留已有的其他消息扩展。
  message.attributes = <String, dynamic>{
    ...?message.attributes,
    'em_push_template': <String, dynamic>{
      // 自定义模板名称：发送前需在控制台或通过 REST API 创建 test7。
      // 自动使用默认模板 default 或 detail 时，无需指定名称。
      'name': 'test7',
    },
  };

  // 注册消息状态回调并提交发送，复用下方发送函数。
  await sendTemplateMessage(message);
}

// 通用发送函数：本节和“使用包含自定义参数的推送模板”示例共用。
Future<void> sendTemplateMessage(ChatMessage message) async {
  final ChatManager manager = ChatClient.getInstance.chatManager;
  // 保存发送前的消息 ID，避免处理其他消息的发送或下载事件。
  final String localId = message.msgId;
  final String listenerId = 'push_template_$localId';

  // 发送前注册消息状态监听。
  manager.addMessageEvent(
    listenerId,
    ChatMessageEvent(
      onSuccess: (msgId, sentMessage) {
        if (msgId != localId) return;
        // 消息最终发送成功；使用回调返回的消息读取服务端消息 ID。
        debugPrint('Message sent: ${sentMessage.msgId}');
        // 异步移除监听，避免在回调分发过程中修改监听器集合。
        scheduleMicrotask(() => manager.removeMessageEvent(listenerId));
      },
      onError: (msgId, failedMessage, error) {
        if (msgId != localId) return;
        // 消息最终发送失败，根据错误码和错误信息处理。
        debugPrint('Send failed: ${error.code}, ${error.description}');
        scheduleMicrotask(() => manager.removeMessageEvent(listenerId));
      },
      onProgress: (msgId, progress) {
        if (msgId != localId) return;
        // 附件上传进度；文本消息通常没有上传进度回调。
        debugPrint('Upload progress: $progress%');
      },
    ),
  );

  try {
    // 提交发送任务；await 返回不代表最终发送成功或推送已送达。
    await manager.sendMessage(message);
  } on ChatError catch (error) {
    // 处理提交阶段的异常，并移除本次监听。
    manager.removeMessageEvent(listenerId);
    debugPrint('Submit failed: ${error.code}, ${error.description}');
  }
}
```

最终发送结果由 `ChatMessageEvent` 返回，不应在 `await sendMessage` 返回后立即移除监听。页面或业务模块提前销毁时，应通过 `removeMessageEvent` 移除其注册的监听。若消息已有 `em_push_template`，应合并其中的配置后更新需要修改的字段，避免覆盖其他模板参数。

### 使用包含内置参数的推送模板

使用自定义或默认推送模板，模板中的推送标题和推送内容可使用以下内置参数：

- `{$dynamicFrom}`：服务器按优先级从高到低填充好友备注、群昵称（仅限群消息）和推送昵称。
- `{$fromNickname}`：消息发送方的推送昵称，通过 `ChatPushManager#updatePushNickname` 设置，不是 `ChatUserInfo.nickName`。
- `{$msg}`：消息内容。

群昵称即群成员在群组中的昵称，群成员在发送群消息时通过扩展字段提供，JSON 结构如下：

```json
{
  "ext": {
    "em_push_ext": {
      "group_user_nickname": "Jane"
    }
  }
}
```

Flutter 对应设置方式如下。`message` 为已创建的群聊消息，发送时可复用上一节的 `sendTemplateMessage`。

```dart
// 获取或创建消息扩展 Map，保留已有业务字段和模板配置。
final Map<String, dynamic> attributes =
    message.attributes ?? <String, dynamic>{};
// 获取或创建 em_push_ext，保留已有推送扩展字段。
final Map<String, dynamic> pushExt = Map<String, dynamic>.from(
  (attributes['em_push_ext'] as Map?) ?? <String, dynamic>{},
);
// 提供用于本条群消息推送展示的群昵称，不会修改服务端群名片。
pushExt['group_user_nickname'] = 'Jane';
attributes['em_push_ext'] = pushExt;
message.attributes = attributes;
```

内置参数的介绍，详见 [编辑默认推送模板](#编辑默认推送模板)。这类模板的名称设置和发送代码与 [使用固定内容的推送模板](#使用固定内容的推送模板) 相同，不需要通过 `title_args` 或 `content_args` 再次传入内置参数的值。

### 使用包含自定义参数的推送模板

使用自定义推送模板时，通过 `title_args` 和 `content_args` 分别传入标题和内容中索引占位符的填充值。

例如，推送模板的设置如下图所示：

![包含自定义参数的推送模板](/images/android/push/push_template_custom.png)

按该模板配置使用下面的示例代码后，通知栏中弹出的推送通知如下。截图为 Android 通知栏，iOS 的通知界面由系统呈现。

![自定义参数推送通知示例](/images/android/push/push_template_custom_example.png)

```dart
Future<void> sendCustomTemplateMessage(String userId) async {
  // 创建单聊文本消息，聊天消息体仍为“消息内容”。
  final ChatMessage message = ChatMessage.createTxtSendMessage(
    targetId: userId,
    content: '消息内容',
    chatType: ChatType.Chat,
  );

  // 设置推送模板，保留已有的其他消息扩展。
  message.attributes = <String, dynamic>{
    ...?message.attributes,
    'em_push_template': <String, dynamic>{
      // 已在控制台或通过 REST API 创建的模板名称。
      // 若不指定名称，则为所选默认模板提供参数。
      'name': 'push',
      // 标题参数数组：依次填充标题中的 {0}、{1}。
      'title_args': <String>['您', '消息'],
      // 内容参数数组：依次填充内容中的 {0}、{1}。
      'content_args': <String>['请', '查看'],
    },
  };

  // 复用“使用固定内容的推送模板”中的函数，监听最终结果并提交发送。
  await sendTemplateMessage(message);
}
```

`name`、`title_args` 和 `content_args` 均为固定字段名，不可修改。参数数组中的值和顺序应与服务端模板的占位符对应；标题或内容没有索引占位符时，无需传入对应数组。

## 消息接收方使用推送模板

消息接收方可以在成功登录后调用 `ChatPushManager#setPushTemplate`，传入已创建的推送模板名称，选择当前用户接收离线通知时要使用的模板。该方法接收 `String` 参数，返回 `Future<void>`。

:::tip
若发送方在发送消息时使用了推送模板，则推送通知栏中的显示内容以发送方的推送模板为准。接收方调用 `setPushTemplate` 不会覆盖发送方在本条消息中指定的模板。
:::

```dart
Future<void> setReceivedPushTemplate(String templateName) async {
  try {
    // 为当前登录用户选择已有模板；不会创建模板或设置模板正文。
    await ChatClient.getInstance.pushManager.setPushTemplate(templateName);
    // await 正常返回表示模板选择设置成功。
  } on ChatError catch (error) {
    // 设置失败，根据错误码和错误信息处理。
    debugPrint('Set push template failed: '
        '${error.code}, ${error.description}');
  }
}
```

# 设置推送模板

推送模板主要用于服务器提供的默认配置不满足你的需求时，可使你设置全局范围的推送标题和推送内容。例如，服务器提供的默认设置为中文和英文的推送标题和内容，你若需要使用韩语或日语的推送标题和内容，则可以设置对应语言的推送模板。推送模板包括默认推送模板 `default` 和自定义推送模板，你可以通过以下两种方式设置：

- [调用 REST API 配置](/document/server-side/push.html#使用推送模板)。
- 在[环信即时通讯云控制台](https://console.easemob.com/user/login)设置推送模板，详见[控制台文档](/product/enable_and_configure_IM.html#配置推送模板)。

创建模板后，你可以在发送消息时选择此推送模板，分为以下三种情况：

:::tip
1. 若使用默认模板 **default**，消息推送时自动使用默认模板，创建消息时无需传入模板名称。
2. 使用自定义模板时，**推送标题** 和 **推送内容** 参数无论通过哪种方式设置，创建消息时均需通过扩展字段传入。
:::

1. 使用固定内容的推送模板，通过 `ext` 扩展字段指定推送模板名称。

这种情况下，创建消息时无需传入 `titleArgs` 和 `contentArgs` 参数。 

```javascript
// 下面以文本消息为例，其他类型的消息设置方法相同。

const option = {
  type: 'txt',
  msg: 'message content',
  to: 'username',
  chatType: 'singleChat',
};

// 设置推送模板。
option.ext = {
  em_push_template: {
    // 设置推送模板名称。设置前需在环信即时通讯云管理后台或调用 REST 接口创建推送模板。
    //若为默认模板 `default`，无需传入模板名称。
    //若为自定义模板，需传入模板名称。
    name: 'test7',
  },
};
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

您收到了一条消息<br/>
请及时查看

```javascript
// 下面以文本消息为例，其他类型的消息设置方法相同。

const option = {
  type: 'txt',
  msg: 'message content',
  to: 'username',
  chatType: 'singleChat',
};

// 设置推送模板。
option.ext = {
  em_push_template: {
    // 设置推送模板名称。若不指定，设置默认推送模板的信息。
    name: 'push',
    // 设置填写模板标题的 value 数组。
    title_args: ['您', '消息'],
    // 设置填写模板内容的 value 数组。
    content_args: ['请', '查看'],
  },
};

// 创建文本消息。
const msg = WebIM.message.create(option);
// 发送消息
conn
  .send(msg)
  .then(res => {
    console.log('Send message success', res);
  })
  .catch(e => {
    console.log('Send message fail', e);
  });
```
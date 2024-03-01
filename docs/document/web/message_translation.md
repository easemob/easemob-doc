# 翻译

<Toc />

为方便用户在聊天过程中对文字消息进行翻译，环信即时通讯 IM SDK 集成了 Microsoft Azure Translation API，支持在发送或接收消息时对文本消息进行按需翻译或自动翻译：
- 按需翻译：接收方在收到文本消息后，将消息内容翻译为目标语言。
- 自动翻译：发送方发送消息时，SDK 根据发送方设置的目标语言自动翻译文本内容，然后将消息原文和译文一起发送给接收方。

## 前提条件

开始前，请确保满足以下条件：

1. 完成 4.0.4 或以上版本 SDK 初始化，详见 [快速开始](quickstart.html)。
2. 了解环信即时通讯 IM API 的 [使用限制](/product/limitation.html)。
3. 已在 [环信即时通讯云控制台](https://console.easemob.com/user/login) 开通开通翻译功能。
4. 该功能由 Microsoft Azure Translation API 提供，因此开始前请确保你了解该功能支持的目标语言。详见 [翻译语言支持](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support)。

## 技术原理

SDK 支持你通过调用 API 在项目中实现如下功能：

- `getSupportedLanguages`：获取支持的翻译语言；
- 按需翻译：接收方在收到文本消息后调用 `translateMessage` 进行翻译；
- 自动翻译：发送方发送消息之前设置 `languages` 字段为目标语言，然后发送消息，接收方会收到消息原文和译文。

## 实现方法

### 获取翻译服务支持的语言

无论是按需翻译还是自动翻译，都需先调用 `getSupportLanguages` 获取支持的翻译语言。示例代码如下：

```javascript
conn.getSupportedLanguages().then(res => console.log(res))
```

### 按需翻译

接收方调用 `translateMessage` 将接收到的消息翻译成目标语言。示例代码如下：

```javascript
conn.translateMessage({text: 'hello', languages: [zh-Hans]})
```

### 自动翻译

设置自动翻译的目标语言后，在发送消息时 SDK 会自动将文本翻译为目标语言，并将目标语言一并发送出去。

示例代码如下：

```javascript
// 发送消息。
let option = {
    chatType: 'singleChat',
    type: 'txt',
    to: 'userId',
    msg: 'hello',
    msgConfig:{ languages: ['zh-Hans'] } // 设置目标语言。
}
let msg = WebIM.message.create(option);
conn.send(msg)

// 接收消息。
conn.addEventHandler('MESSAGE', {
    onTextMessage: (message) => {
        console.log('message', message.translations)
    }
})
```

## 参考

### 设置和获取推送的目标语言

设置推送的目标语言，设置后收到的离线推送为目标语言。如果目标语言在消息里不存在，只推送原文，详见[设置推送翻译](push.html#设置推送翻译)。
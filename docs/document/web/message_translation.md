# 文本消息翻译

SDK 支持普通文本消息的按需翻译，以及发送或编辑前自动翻译。自动翻译会将原文和译文一并提交，接收方可选择展示语言。复合消息中的文本分段不支持自动翻译。

## 前提条件

- 使用 Web／小程序 SDK 5.2.0 或以上版本，已完成 [初始化](initialization.html) 并登录。
- 已注册 `ChatManager`，通过 `client.chatManager` 调用消息接口。
- 已在环信控制台 [开通消息翻译服务](/product/console/purchase_value_added.html#消息翻译)。计费说明参见 [消息翻译计费](/product/pricing_policy.html#消息翻译)。

以下示例中的 `client` 均为已初始化并登录的 SDK 实例。

## 获取支持的语言

调用 `getSupportedTranslationLanguages()` 获取语言列表，目标语言代码可从该列表选取。

```typescript
const languages = await client.chatManager.getSupportedTranslationLanguages();
for (const language of languages) {
  console.log(language.code, language.name);
}
```

## 发送前自动翻译

创建普通文本消息时设置 `targetLanguages`。调用 `sendMessage()` 后，SDK 先翻译，再将原文与译文一起发送。不传目标语言或传空数组时，不调用翻译服务。

```typescript
import type { TextMessageBody } from 'easemob-websdk';

const message = client.chatManager.createTextMessage({
  conversationId: 'user2',
  conversationType: 'singleChat',
  content: 'Hello!',
  targetLanguages: ['zh-Hans', 'ja'],
});

try {
  const sent = await client.chatManager.sendMessage(message);
  const body = sent.body as TextMessageBody;
  console.log('原文:', body.content);
  console.log('中文译文:', body.translations?.['zh-Hans']);
} catch (error) {
  console.error('翻译或发送失败:', error);
}
```

译文位于发送结果及相关回调消息的 `body.translations`，类型为语言代码到译文的映射。SDK 保留 `body.content` 原文，不将译文回填到调用方传入的消息对象。翻译失败时，不发送消息，并通过 Promise 拒绝及 `onFailed` 回调报告错误。

## 编辑前自动翻译

调用 `modifyMessage()` 编辑普通文本消息时，设置 `message.body.targetLanguages`。SDK 对新文本翻译后再提交编辑；翻译失败则不提交编辑请求。

```typescript
try {
  const updated = await client.chatManager.modifyMessage({
    conversationId: 'user2',
    conversationType: 'singleChat',
    messageId: '已发送文本消息的服务端 ID',
    message: {
      type: 'text',
      body: {
        content: 'Updated text',
        targetLanguages: ['zh-Hans'],
      },
      ext: { edited: true },
    },
  });
  console.log('编辑结果:', updated);
} catch (error) {
  console.error('翻译或编辑失败:', error);
}
```

不传目标语言或传空数组时不翻译。编辑权限、功能开通和事件处理请参见 [编辑消息](message_modify.html)。

## 接收并展示译文

在 `onMessage` 中读取普通文本消息的 `body.translations`。没有所需语言的译文时，可回退展示原文。

```typescript
import type { TextMessageBody } from 'easemob-websdk';

client.chatManager.addEventHandler('translation-listener', {
  onMessage: message => {
    if (message.type !== 'text') return;
    const body = message.body as TextMessageBody;
    console.log('展示内容:', body.translations?.['zh-Hans'] ?? body.content);
  },
  onMessageUpdated: event => {
    if (event.message.type !== 'text') return;
    const body = event.message.body as TextMessageBody;
    console.log('编辑后展示内容:', body.translations?.['zh-Hans'] ?? body.content);
  },
});
```

## 按需翻译

调用 `translateMessage({ message, targetLanguages })` 翻译一条普通文本消息，可用于发送前或收到后的主动翻译。该方法只返回结果，不修改输入消息，也不更新业务消息缓存。业务侧可保存结果并更新展示。

```typescript
import type { Message } from 'easemob-websdk';

async function translateTextMessage(message: Message): Promise<void> {
  if (message.type !== 'text') return;
  try {
    const result = await client.chatManager.translateMessage({
      message,
      targetLanguages: ['zh-Hans'],
    });
    const translations = Object.fromEntries(
      result.translations.map(item => [item.to, item.text]),
    );
    console.log('按需翻译结果:', translations['zh-Hans']);
  } catch (error) {
    console.error('翻译失败:', error);
  }
}
```

注意返回结构的区别：`translateMessage()` 返回的 `result.translations` 是 `{ to, text }` 条目数组；自动翻译消息中的 `body.translations` 是 `Record<string, string>` 映射。

## 使用说明

- 自动翻译失败会阻止发送或编辑，请处理 Promise 异常并提供重试等交互。
- 复合消息中的文本分段即使设置 `targetLanguages` 也不生效；`translateMessage()` 仅接受普通文本消息。
- 离线推送展示语言请参见 [设置推送翻译](/document/web/push/push_translation.html)。

## 接口列表

| API | 所属模块／类 | 说明 |
| :--- | :--- | :--- |
| [`getSupportedTranslationLanguages`](#获取支持的语言) | `ChatManager` | 获取翻译语言列表。 |
| [`createTextMessage`](#发送前自动翻译) | `ChatManager` | 创建文本消息，通过 `targetLanguages` 开启自动翻译。 |
| [`sendMessage`](#发送前自动翻译) | `ChatManager` | 翻译完成后发送消息。 |
| [`modifyMessage`](#编辑前自动翻译) | `ChatManager` | 翻译完成后提交文本编辑。 |
| [`translateMessage`](#按需翻译) | `ChatManager` | 按需翻译，只返回翻译结果。 |

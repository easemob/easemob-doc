# 消息翻译

<Toc />

为方便用户在聊天过程中翻译文本消息，环信即时通讯 IM SDK 集成了 Microsoft Azure Translation API，支持以下两种方式：

- 按需翻译：接收方收到文本消息后，将消息内容翻译为目标语言。
- 自动翻译：发送方设置目标语言后，SDK 在发送消息前翻译文本，将原文和译文一起发送给接收方。

如下为按需翻译示例：

![img](/images/ios/translation.png)

## 功能开通

消息翻译为增值服务，使用前请先在 [环信控制台开通](/product/console/purchase_value_added.html#消息翻译) 。

单次翻译请求最多支持 10,000 个字符。计费字符数按 **源文本字符数 × 目标语言数量** 计算。例如，将 500 个字符翻译为 4 种语言，计费字符数为 2,000。

文本超长、服务未开通、用量达到上限或翻译失败时，请处理 SDK 返回的错误。例如，“The input text is too long” 表示文本超过上限；翻译服务的 HTTP 400 不等于 SDK 对外返回的错误码。

该服务的费用详见 [计费策略](/product/pricing_policy.html#消息翻译) 。

## 前提条件

- Web v4.x：使用 4.0.4 或以上版本；示例中的 `conn` 为 SDK 实例，`WebIM` 为所用 SDK 入口。确保使用该功能前，已完成 [初始化](/v4/web/initialization.html) 并登录成功。
- Web v5.x：本页自动翻译和编辑前翻译示例以 5.2.0 或以上版本为准；示例中的 `client` 已注册 `ChatManager`，通过 `client.chatManager` 调用消息接口。确保使用该功能前，已完成 [初始化](/document/web/initialization.html) 并登录成功。
- 
- 已 [开通消息翻译服务](#功能开通) ，并了解 IM API 的 [使用限制](/product/limitation.html) 。
- 目标语言使用服务支持的语言编码，语言范围参见 [翻译语言支持](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support) 。

## 获取翻译服务支持的语言

你可以查询翻译服务支持的语言，并从返回结果中选取目标语言编码。无论是按需翻译还是自动翻译，都需要在翻译前确认目标语言受支持。

已知有效语言编码时，无需在每次翻译前重复查询。

::: tabs#code

@tab v4.x

调用 `conn.getSupportedLanguages()` 查询支持的语言。

```javascript
// conn 为已初始化并登录的 Web v4.x 实例。
try {
  const result = await conn.getSupportedLanguages();
  for (const language of result.data || []) {
    console.log(language.code, language.name, language.nativeName);
  }
} catch (error) {
  console.error('查询语言失败:', error);
}
```

语言条目包含以下字段，列表位于 `getSupportedLanguages()` 返回结果的 `data` 中。

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `code` | `string` | 语言编码，例如 `zh-Hans`。 |
| `name` | `string` | 语言名称。 |
| `nativeName` | `string` | 该语言的本地显示名称。 |

@tab v5.x

调用 `client.chatManager.getSupportedTranslationLanguages()` 查询支持的语言。

```typescript
// client 为已初始化、注册 ChatManager 并登录的 Web v5.x 实例。
const languages = await client.chatManager.getSupportedTranslationLanguages();
for (const language of languages) {
  console.log(language.code, language.name, language.nativeName);
}
```

`getSupportedTranslationLanguages()` 直接返回 `ReadonlyArray<TranslationLanguage>`，每项字段如下：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `code` | `string` | 语言编码，例如 `zh-Hans`。 |
| `name` | `string` | 语言名称。 |
| `nativeName` | `string` | 该语言的本地显示名称。 |

:::

## 按需翻译

收到文本消息后，可按需将原文翻译为目标语言，并使用结果更新展示。

::: tabs#code

@tab v4.x

调用 `conn.translateMessage({ text, languages })`，传入待翻译文本和目标语言。以下 `receivedMessage` 为收到的文本消息；方法返回结果，不会自动更新页面展示。

```javascript
try {
  const result = await conn.translateMessage({
    text: receivedMessage.msg,
    languages: ['zh-Hans'],
  });
  const translations = result.data?.[0]?.translations || [];
  const translation = translations.find(item => item.to === 'zh-Hans');
  console.log('译文:', translation?.text ?? receivedMessage.msg);
} catch (error) {
  console.error('翻译失败:', error);
}
```

**按需翻译结果**：本页示例从 `result.data[0]` 读取翻译结果。

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `translations` | `Array<{ to: string; text: string }>` | 译文条目数组；to 为目标语言编码，text 为译文。 |
| `detectedLanguage` | `{ language: string; score: number }` | 识别出的原文语言及置信度，以服务实际返回为准。 |

@tab v5.x

调用 `translateMessage({ message, targetLanguages })`，传入普通文本消息。该方法可用于发送前或收到后的主动翻译；只返回结果，不修改输入消息，也不更新业务消息缓存。

```typescript
import type { Message } from 'easemob-websdk';

async function translateTextMessage(message: Message): Promise<void> {
  if (message.type !== 'text') return;
  try {
    const result = await client.chatManager.translateMessage({
      message,
      targetLanguages: ['zh-Hans'],
    });
    const translation = result.translations.find(item => item.to === 'zh-Hans');
    console.log('译文:', translation?.text);
  } catch (error) {
    console.error('翻译失败:', error);
  }
}
```

**按需翻译结果**：`translateMessage()` 返回 `MessageTranslationResult`：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `translations` | `ReadonlyArray<{ to: string; text: string }>` | 译文条目数组。 |
| `detectedLanguage` | `{ language: string; score: number }（可选）` | 识别出的原文语言及置信度。 |

:::

## 设置自动翻译

创建文本消息时设置目标语言，再发送消息。SDK 会先翻译，再将原文与译文一起发送。

::: tabs#code

@tab v4.x

创建文本消息时，通过 `msgConfig.languages` 设置目标语言：

```javascript
const message = WebIM.message.create({
  chatType: 'singleChat',
  type: 'txt',
  to: 'user2',
  msg: 'Hello!',
  msgConfig: { languages: ['zh-Hans', 'ja'] },
});
conn.send(message);
```

@tab v5.x

创建普通文本消息时设置 `targetLanguages`。不传或传空数组时，不调用翻译服务。译文位于发送结果及相关回调消息的 `body.translations`；原文保留，译文不会回填到调用方传入的原消息对象。

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

**编辑前自动翻译（v5.2.0）**：编辑普通文本消息时，在 `message.body.targetLanguages` 中设置目标语言；翻译成功后再提交编辑。不传或传空数组时不翻译。

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

自动翻译失败时，不发送消息或编辑请求。发送失败通过 Promise 拒绝以及已配置的 `onFailed` 回调报告；编辑失败通过 Promise 拒绝报告。

:::

## 接收并展示译文

接收方收到文本消息后，可以读取译文并选择展示语言。没有所需语言的译文时，可回退展示原文。

::: tabs#code

@tab v4.x

在 `onTextMessage` 中读取实时文本消息顶层的 `translations` 数组：

```javascript
conn.addEventHandler('translation-listener', {
  onTextMessage: message => {
    const translations = message.translations || [];
    const translation = translations.find(item => item.code === 'zh-Hans');
    console.log('展示内容:', translation?.text ?? message.msg);
  },
});
```

**实时文本消息的译文**：`onTextMessage` 中的 `message.translations` 为 `{ code, text }` 条目数组：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `code` | `string` | 译文的语言编码。 |
| `text` | `string` | 译文文本。 |

这里描述的是实时消息接收回调。历史消息接口可能使用不同的译文包装，应按相应接口的返回结构读取。

@tab v5.x

在 `onMessage` 中读取普通文本消息的 `body.translations`；其他设备收到编辑通知时，可在 `onMessageUpdated` 中更新展示。当前操作设备通过 `modifyMessage()` 的 Promise 处理编辑结果。

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

**自动翻译消息的译文**：普通文本消息的 `body` 包含以下字段：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `content` | `string` | 原文。 |
| `targetLanguages` | `string[]（可选）` | 目标语言编码列表。 |
| `translations` | `Record<string, string>（可选）` | 语言编码到译文的映射，例如 `{ "zh-Hans": "你好" }`。 |

按需翻译返回的数组与消息携带的译文映射是两种不同结构，不应混用。

:::

## 注意事项

- 消息翻译适用于普通文本消息。Web v5.x 的 [复合消息](/document/web/message_send.html#发送复合消息) 不支持按需翻译，也不会自动翻译其中的文本分段。
- Web v5.x 按需翻译结果由业务侧保存和展示；自动翻译的译文从发送结果、接收消息或编辑结果中获取。
- Web v5.x 自动翻译失败会阻止发送或编辑，请处理 Promise 异常并提供重试等交互。
- 如需设置离线推送的展示语言，参见 [设置推送翻译](/document/web/push/push_translation.html) 。

## 接口列表

| API | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| `getSupportedLanguages` | `v4.x conn` | 查询支持的语言。 |
| `translateMessage` | `v4.x conn` | 传入 text、languages，按需翻译文本。 |
| `WebIM.message.create / conn.send` | `v4.x WebIM / conn` | 创建和发送消息，通过 msgConfig.languages 开启自动翻译。 |
| `getSupportedTranslationLanguages` | `v5.x ChatManager` | 查询支持的语言。 |
| `translateMessage` | `v5.x ChatManager` | 传入 message、targetLanguages，按需翻译普通文本消息。 |
| `createTextMessage / sendMessage` | `v5.x ChatManager` | 创建和发送消息，通过 targetLanguages 开启自动翻译。 |
| `modifyMessage` | `v5.x ChatManager` | 编辑普通文本消息，可在 body.targetLanguages 中设置目标语言。 |

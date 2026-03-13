# 聊天消息搜索栏

本文介绍如何通过 `MessageSearch` 组件在会话中实现消息搜索功能，帮助用户快速查找历史聊天记录。

## 概述

`MessageSearch` 是一个专门用于会话内消息搜索的组件，可嵌入任意会话页面，帮助用户快速查找历史聊天记录。该组件提供完整的搜索界面和结果列表，支持以下功能。

- **会话内搜索**：支持单聊和群聊的历史消息检索。
- **实时搜索**：输入关键词实时显示搜索结果。
- **结果展示**：清晰的搜索结果列表，包含发送者、内容摘要和时间。
- **交互跳转**：点击搜索结果可跳转至对应消息位置。

## 基础用法

```typescript
import { MessageSearch } from 'react-native-chat-uikit';
import type { ChatConversationType } from 'react-native-chat-sdk';

function MessageSearchScreen({ route, navigation }) {
  const { convId, convType } = route.params;

  return (
    <MessageSearch
      convId={convId}
      convType={convType}
      onClickedItem={(model) => {
        console.log('点击消息:', model.msg.msgId);
        // 跳转至聊天页面并定位到该消息
        navigation.navigate('Chat', {
          convId: convId,
          convType: convType,
          msgId: model.msg.msgId,
        });
      }}
      onCancel={() => {
        navigation.goBack();
      }}
    />
  );
}
```

`MessageSearch` 组件属性如下表所示：

| 属性      | 类型      | 是否必需 | 描述            |
| :-------------- | :----- | :------- | :------------- |
| `convId`          | `string`                                | 是       | 会话 ID。 会话唯一标识符。                                                                                      |
| `convType`        | `ChatConversationType`                  | 是       | 会话类型。<br/> - `PeerChat`（0）：单聊。<br/> - `GroupChat`（1）：群聊。                       |
| `containerStyle`  | `StyleProp<ViewStyle>`                  | 否       | 容器的样式。详见 [设置容器样式](#设置容器样式)。                                                 |
| `onClickedItem`   | `(model: MessageSearchModel) => void`   | 否       | 搜索结果点击的回调函数。详见 [处理搜索结果点击](#处理搜索结果点击)。                             |
| `onCancel`        | `(data?: MessageSearchModel) => void`   | 否       | 取消按钮点击的回调函数。详见 [处理取消操作](#处理搜索取消)。                                         |
| `testMode`        | `'only-ui' \| 'with-ui' \| 'only-test'` | 否       | 测试模式。一般情况下，你无需关注此属性。<br/> - `only-ui`：仅 UI 模式。<br/> - `with-ui`：带 UI 测试。 |

:::tip
React Native 的 UIKit 不包含路由跳转功能，搜索结果的点击和取消操作需通过回调函数自行处理页面跳转。
:::

## 设置容器样式

通过 `containerStyle` 属性可以自定义搜索组件容器的样式：

```typescript
<MessageSearch
  convId={convId}
  convType={convType}
  containerStyle={{
    backgroundColor: '#f5f5f5',
    paddingTop: 10,
  }}
  onCancel={() => navigation.goBack()}
/>
```

## 处理搜索结果点击

使用 `onClickedItem` 回调处理搜索结果条目的点击事件，便于实现跳转与消息定位：

```typescript
<MessageSearch
  convId={convId}
  convType={convType}
  onClickedItem={(model) => {
    console.log('消息 ID:', model.msg.msgId);
    console.log('消息内容:', model.msg.body);
    console.log('发送者:', model.userId);
    console.log('用户名:', model.userName);

     // 跳转至聊天页面并精准定位到该消息
    navigation.navigate('Chat', {
      convId: convId,
      convType: convType,
      msgId: model.msg.msgId, // 用于消息定位的关键参数
    });
  }}
  onCancel={() => navigation.goBack()}
/>
```

消息数据模型 **MessageSearchModel** 包含以下主要字段：

| 字段   | 类型   | 是否必须     | 说明    |
| :----------- | :------------ | :------------ | :------------- |
| `msg`        | `ChatMessage`  | 是  | 完整的消息对象，包含所有消息属性。 |
| `userId`     | `string`      | 是   | 消息发送方的用户 ID。                |
| `userName`   | `string`      | 否  | 消息发送方的用户名称。     |
| `userAvatar` | `string`      | 否  | 消息发送方的头像 URL。   |

## 处理搜索取消

通过 `onCancel` 回调可处理取消按钮的点击事件，通常用于返回上级页面：

```typescript
<MessageSearch
  convId={convId}
  convType={convType}
  onClickedItem={(model) => {
    navigation.navigate('Chat', {
      convId: convId,
      convType: convType,
      msgId: model.msg.msgId,
    });
  }}
  onCancel={(data) => {
    console.log('用户取消搜索');
    navigation.goBack();
  }}
/>
```

## 自定义图标和文案

- 关于自定义搜索页面的图标，详见 [自定义图标文档](chatuikit_custom_icon.html)。
- 关于自定义搜索页面的文案，详见 [自定义图标文档](chatuikit_custom_text.html)。

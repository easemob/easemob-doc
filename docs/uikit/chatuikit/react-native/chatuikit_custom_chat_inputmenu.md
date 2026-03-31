# 设置消息输入

本文介绍如何通过消息输入组件 `MessageInput` 实现消息输入的自定义设置，包括发送文本、表情、文件、图片、语音等功能。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/rn/message_input_frame.png" title="消息输入区 MessageInput" />
</ImageGallery>

## 概述

`MessageInput` 组件用于发送文本、表情、文件、图片、语音等消息，是聊天界面的核心交互区域。你可以自定义发送菜单、扩展功能菜单，并添加自定义消息类型的发送入口。该组件通常与 `MessageList` 组件配合使用，构成完整的聊天界面。

`MessageInput` 通常作为 `ConversationDetail` 的内置组件使用，无需单独引入。通过 `input` 属性可对其进行配置和定制：

```typescript
import { ConversationDetail, MessageInput } from 'react-native-chat-uikit';
import type { MessageInputRef } from 'react-native-chat-uikit';

function ChatScreen({ route }) {
  const { convId, convType } = route.params;
  const messageInputRef = useRef<MessageInputRef>(null);

  return (
    <ConversationDetail
      type="chat"
      convId={convId}
      convType={convType}
      input={{
        props: {
          // 传递给 MessageInput 的属性
          numberOfLines: 4,
          closeAfterSend: true,
          onChangeValue: (text) => {
            console.log('输入内容变化:', text);
          },
          onClickedSend: (value) => {
            console.log('发送消息:', value);
          },
        },
        // render: MessageInput, // 可选：使用自定义的 MessageInput 组件
        ref: messageInputRef, // 获取 MessageInput 的控制器
      }}
      onBack={() => navigation.goBack()}
    />
  );
}
```

`MessageInput` 组件的属性如下表所示：

| 属性     | 类型        | 是否必需 | 描述          |
| --------- | -------- | -------- | ----------------------- |
| `type`                             | `ConversationDetailModelType`        | 是       | 消息输入组件的类型。<br/> - `chat`：普通聊天页面。<br/> - `create_thread`：创建话题页面。<br/> - `thread`：话题聊天页面。<br/> - `search`：搜索消息页面。 |
| `convId`                           | `string`                             | 是       | 会话 ID。       |
| `convType`                         | `ChatConversationType`               | 是       | 会话类型。                  |
| `numberOfLines`                    | `number`                             | 否       | 输入框的最大行数。默认为 4 行。详见 [设置输入行数](#设置输入行数)。                      |
| `top`                              | `number`                             | 否       | 键盘避让的顶部偏移量。                                                                                                                                    |
| `bottom`                           | `number`                             | 否       | 键盘避让的底部偏移量。                                                                                                                                    |
| `onClickedSend`                    | `(value) => void`                    | 否       | 点击发送按钮的回调。参数为发送的消息内容（文本、文件、图片、视频、语音或名片）。详见 [处理发送事件](#处理发送事件)。                                       |
| `closeAfterSend`                   | `boolean`                            | 否       | 发送消息后是否关闭扩展菜单和表情面板。默认为 `false`。                                                                                                    |
| `onHeightChange`                   | `(height: number) => void`           | 否       | 输入组件高度变化时的回调。                                                                                                                                |
| `onEditMessageFinished`            | `(model: MessageModel) => void`      | 否       | 编辑消息完成时的回调。                                                                                                                                    |
| `onInputMention`                   | `(groupId: string) => void`          | 否       | 点击 @ 提及功能时的回调（群聊中）。                                                                                                                       |
| `onClickedCardMenu`                | `() => void`                         | 否       | 点击名片菜单时的回调。                                                                                                                                    |
| `onInitMenu`                       | `(initItems) => InitMenuItemsType[]` | 否       | 初始化扩展菜单时的回调，可以添加、修改或删除菜单项。详见[自定义扩展菜单](#设置消息扩展菜单)。                                                               |
| `emojiList`                        | `string[]`                           | 否       | 自定义表情列表。      |
| `onChangeValue`                    | `(text: string) => void`             | 否       | 输入内容变化时的回调。详见[监听输入变化](#监听输入变化)。                                                                                                 |
| `selectType`                       | `ConversationSelectModeType`         | 否       | 消息选择模式。<br/> - `common`（默认）：普通模式。<br/> - `multi`：多选模式。<br/> **注意**: 此属性主要用于内部组件之间通信，一般用户无需关注。           |
| `multiSelectCount`                 | `number`                             | 否       | 多选模式下已选消息的数量。<br/> **注意**: 此属性主要用于内部组件之间通信，一般用户无需关注。                                                              |
| `onClickedMultiSelectDeleteButton` | `() => void`                         | 否       | 多选模式下点击删除按钮的回调。<br/> **注意**: 此属性主要用于内部组件之间通信，一般用户无需关注。 |
| `onClickedMultiSelectShareButton`  | `() => void`                         | 否       | 多选模式下点击分享按钮的回调。<br/> **注意**: 此属性主要用于内部组件之间通信，一般用户无需关注。  |
| `unreadCount`                      | `number`                             | 否       | 未读消息数量。<br/> **注意**: 此属性主要用于内部组件之间通信，一般用户无需关注。  |
| `onClickedUnreadCount`             | `() => void`                         | 否       | 点击未读消息数量按钮的回调。<br/> **注意**: 此属性主要用于内部组件之间通信，一般用户无需关注。    |

## 设置输入行数

通过 `numberOfLines` 属性控制输入框的最大行数，超过后自动出现滚动条：

```typescript
<ConversationDetail
  type="chat"
  convId={convId}
  convType={convType}
  input={{
    props: {
      numberOfLines: 6, // 最多显示 6 行，默认为 4 行
    },
  }}
  onBack={() => navigation.goBack()}
/>
```

## 监听输入变化

通过 `onChangeValue` 回调监听输入内容的变化：

```typescript
<ConversationDetail
  type="chat"
  convId={convId}
  convType={convType}
  input={{
    props: {
      onChangeValue: (text) => {
        console.log('当前输入内容:', text);

        // 可实现的功能：
        // 例如：显示正在输入状态、触发 @ 提及列表等
      },
    },
  }}
  onBack={() => navigation.goBack()}
/>
```

## 设置消息扩展菜单

消息扩展菜单提供发送附件类型消息（如图片、视频、文件）、位置消息以及自定义消息的快捷入口。点击文本输入框旁的 "+" 按钮即可展开。

### 设置菜单风格

| 风格  | 值 | 描述    |
| :---- | :----- | :------- |
| **底部弹出菜单** | `bottom-sheet` | 默认风格。点击“+”号后，菜单从屏幕底部向上弹出，占用较大显示空间，适合展示较多功能项。 |
| **微信风格**     | `extension`    | 微信风格，通过布局组件实现。菜单在输入框上方直接展开，与输入区域融为一体，操作更加连贯。 |

- 底部弹出菜单

```typescript
import { UIKitContainer } from 'react-native-chat-uikit';

<UIKitContainer
  options={chatOptions}
  messageInputBarStyle="bottom-sheet"  // 底部弹出菜单（默认）
>
  {/* 你的应用内容 */}
</UIKitContainer>
```

- 微信风格

```typescript
import { UIKitContainer } from 'react-native-chat-uikit';

<UIKitContainer
  options={chatOptions}
  messageInputBarStyle="extension"  // 扩展面板样式：类似微信风格
>
  {/* 你的应用内容 */}
</UIKitContainer>
```

:::tip
`messageInputBarStyle` 是一个 **全局配置**，会影响应用中所有聊天页面的扩展菜单样式。为了保持用户体验一致性，建议在整个应用中统一使用同一种菜单风格，避免在不同页面之间切换造成用户困惑。
:::

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/ios/message_types_1.png" title="底部弹出菜单样式" />
  <ImageItem src="/images/uikit/chatuikit/ios/message_types_2.png" title="类似微信样式" />
</ImageGallery>

### 管理菜单项

通过 `onInitMenu` 回调添加、修改或删除菜单项：

```typescript
<ConversationDetail
  type="chat"
  convId={convId}
  convType={convType}
  input={{
    props: {
      onInitMenu: (initItems) => {
        // initItems 是默认的菜单项列表
        console.log('默认菜单项:', initItems);

        // 1. 添加自定义菜单项
        const customItem = {
          name: 'custom',      // 菜单项名称
          isHigh: false,       // 是否高亮显示（通常用于警告操作）
          icon: 'star_fill',   // 菜单项图标
          onClicked: () => {
            console.log('点击自定义菜单项');
            // 实现自定义功能
          },
        };

        // 2. 修改现有菜单项
        const modifiedItems = initItems.map((item) => {
          if (item.name === 'Photo') {
            // 修改图片菜单项的图标
            return { ...item, icon: 'img' };
          }
          return item;
        });

        // 3. 删除特定菜单项
        const filteredItems = modifiedItems.filter(
          (item) => item.name !== 'File' // 删除文件选择菜单
        );

        // 返回新的菜单项列表
        return [...filteredItems, customItem];
      },
    },
  }}
  onBack={() => navigation.goBack()}
/>
```

**菜单项类型定义**：

`InitMenuItemsType` 定义了扩展菜单项的数据结构，每个菜单项包含以下属性：

```typescript
type InitMenuItemsType = {
  name: string; // 菜单项显示的文本
  isHigh: boolean; // 是否高亮显示（true 为警告样式）
  icon?: IconNameType; // 菜单项图标名称
  onClicked?: (name: string, others?: any) => void; // 点击回调
};
```

### 修改菜单图标

关于修改菜单项的图标，详见 [自定义图标文档](chatuikit_custom_icon.html)。

## 处理发送事件

通过 `onClickedSend` 回调可以拦截或扩展消息发送逻辑：

```typescript
<ConversationDetail
  type="chat"
  convId={convId}
  convType={convType}
  input={{
    props: {
      onClickedSend: (value) => {
        console.log('发送消息类型:', value.type);

        // 根据消息类型进行不同处理
        switch (value.type) {
          case 'text':
            const textValue = value as SendTextProps;
            console.log('文本内容:', textValue.content);
            break;
          case 'image':
            const imageValue = value as SendImageProps;
            console.log('图片路径:', imageValue.localPath);
            console.log('图片尺寸:', imageValue.imageWidth, imageValue.imageHeight);
            break;
          case 'video':
            const videoValue = value as SendVideoProps;
            console.log('视频路径:', videoValue.localPath);
            console.log('缩略图路径:', videoValue.thumbLocalPath);
            break;
          case 'voice':
            const voiceValue = value as SendVoiceProps;
            console.log('语音路径:', voiceValue.localPath);
            console.log('语音时长:', voiceValue.duration);
            break;
          case 'file':
            const fileValue = value as SendFileProps;
            console.log('文件路径:', fileValue.localPath);
            console.log('文件名:', fileValue.displayName);
            break;
          case 'card':
            const cardValue = value as SendCardProps;
            console.log('名片用户ID:', cardValue.userId);
            break;
        }

        // 如果需要自定义发送逻辑，可以在这里实现
        // 默认情况下，组件会自动处理消息发送
      },
    },
  }}
  onBack={() => navigation.goBack()}
/>
```

## 使用控制器

通过获取 `MessageInputRef` 引用，使用控制器方法实现更多高级功能。

### 关闭输入框

通过控制器的 `close` 方法可以关闭输入框（收起键盘、表情面板和扩展菜单）：

```typescript
import React, { useRef } from 'react';
import type { MessageInputRef } from 'react-native-chat-uikit';

function ChatScreen({ route }) {
  const { convId, convType } = route.params;
  const messageInputRef = useRef<MessageInputRef>(null);

  const handleCloseInput = () => {
    messageInputRef.current?.close();
  };

  return (
    <>
      <ConversationDetail
        type="chat"
        convId={convId}
        convType={convType}
        input={{
          ref: messageInputRef,
        }}
        onBack={() => navigation.goBack()}
      />
      <Button title="关闭输入框" onPress={handleCloseInput} />
    </>
  );
}
```

### 引用消息

通过控制器的 `quoteMessage` 方法可以引用（回复）消息，被引用的消息会显示在输入框上方，便于用户针对特定消息进行回复。

```typescript
import React, { useRef } from 'react';
import type { MessageInputRef } from 'react-native-chat-uikit';

function ChatScreen({ route }) {
  const { convId, convType } = route.params;
  const messageInputRef = useRef<MessageInputRef>(null);

  const handleQuoteMessage = (messageModel: MessageModel) => {
    messageInputRef.current?.quoteMessage(messageModel);
  };

  return (
    <ConversationDetail
      type="chat"
      convId={convId}
      convType={convType}
      input={{
        ref: messageInputRef,
      }}
      list={{
        props: {
          onClickedItem: (id, model) => {
            if (model.modelType === 'message') {
              // 点击消息时引用该消息
              handleQuoteMessage(model as MessageModel);
              return false; // 阻止默认行为
            }
          },
        },
      }}
      onBack={() => navigation.goBack()}
    />
  );
}
```

### 编辑消息

通过控制器的 `editMessage` 方法可以实现消息编辑功能，允许用户修改已发送的消息内容。编辑完成后，消息会重新发送，并在列表中更新显示。

```typescript
import React, { useRef } from 'react';
import type { MessageInputRef } from 'react-native-chat-uikit';

function ChatScreen({ route }) {
  const { convId, convType } = route.params;
  const messageInputRef = useRef<MessageInputRef>(null);

  const handleEditMessage = (messageModel: MessageModel) => {
    messageInputRef.current?.editMessage(messageModel);
  };

  return (
    <ConversationDetail
      type="chat"
      convId={convId}
      convType={convType}
      input={{
        ref: messageInputRef,
      }}
      onBack={() => navigation.goBack()}
    />
  );
}
```

### 显示/隐藏多选模式

通过控制器的 `showMultiSelect` 和 `hideMultiSelect` 方法可以开启或关闭消息多选模式。多选模式允许用户批量选择多条消息进行统一操作，如批量删除或批量转发。

```typescript
import React, { useRef } from 'react';
import type { MessageInputRef } from 'react-native-chat-uikit';

function ChatScreen({ route }) {
  const { convId, convType } = route.params;
  const messageInputRef = useRef<MessageInputRef>(null);

  const handleShowMultiSelect = () => {
    messageInputRef.current?.showMultiSelect();
  };

  const handleHideMultiSelect = () => {
    messageInputRef.current?.hideMultiSelect();
  };

  return (
    <>
      <ConversationDetail
        type="chat"
        convId={convId}
        convType={convType}
        input={{
          ref: messageInputRef,
        }}
        onBack={() => navigation.goBack()}
      />
      <View style={{ flexDirection: 'row' }}>
        <Button title="显示多选" onPress={handleShowMultiSelect} />
        <Button title="隐藏多选" onPress={handleHideMultiSelect} />
      </View>
    </>
  );
}
```

### 显示/隐藏遮罩层

通过控制器的 `showMask` 和 `hideMask` 方法可以控制输入区域遮罩层的显示与隐藏。遮罩层用于临时禁用输入框的交互，防止用户在特定状态下输入消息。

```typescript
import React, { useRef } from 'react';
import type { MessageInputRef } from 'react-native-chat-uikit';

function ChatScreen({ route }) {
  const { convId, convType } = route.params;
  const messageInputRef = useRef<MessageInputRef>(null);

  const handleShowMask = () => {
    messageInputRef.current?.showMask();
  };

  const handleHideMask = () => {
    messageInputRef.current?.hideMask();
  };

  return (
    <ConversationDetail
      type="chat"
      convId={convId}
      convType={convType}
      input={{
        ref: messageInputRef,
      }}
      onBack={() => navigation.goBack()}
    />
  );
}
```

## 控制器方法

`MessageInputRef` 提供以下控制器方法：

| 方法名            | 参数                  | 返回值 | 描述                                                     |
| ----------------- | --------------------- | ------ | -------------------------------------------------------- |
| `close`           | 无                    | `void` | 关闭输入框（收起键盘、表情面板和扩展菜单）。             |
| `quoteMessage`    | `model: MessageModel` | `void` | 引用（回复）指定消息。输入框上方会显示被引用的消息内容。 |
| `editMessage`     | `model: MessageModel` | `void` | 编辑指定消息。弹出编辑 UI 供用户修改消息内容。         |
| `showMultiSelect` | 无                    | `void` | 显示多选模式。输入组件会显示删除和分享按钮。             |
| `hideMultiSelect` | 无                    | `void` | 隐藏多选模式。恢复正常的输入框。                         |
| `showMask`        | 无                    | `void` | 显示遮罩层。通常用于置顶消息显示时，防止用户操作输入框。 |
| `hideMask`        | 无                    | `void` | 隐藏遮罩层。恢复输入框的正常交互。                       |

## 自定义事件监听

关于自定义消息输入区的事件监听，详见 [自定义数据模型文档](chatuikit_custom_data_model.html#自定义事件监听器)。

## 自定义图标和文案

- 关于自定义聊天页面的图标，详见 [自定义图标文档](chatuikit_custom_icon.html)。
- 关于自定义聊天页面的文案，详见 [自定义图标文档](chatuikit_custom_text.html)。

# 消息列表的高级设置

本文详细介绍 `MessageList` 组件的各项高级配置功能，帮助你实现自定义的消息展示、交互监听和历史消息加载。

## 概述

`MessageList` 是聊天界面核心组件，提供如下功能：

- **消息展示**：支持文本、图片、语音、视频、文件等多种消息类型
- **消息交互**：支持点击、长按、滚动加载、附件下载等操作
- **自定义扩展**：支持自定义消息样式、交互行为和消息类型

通常，`MessageList` 作为 `ConversationDetail` 组件的一部分，与 `MessageInput` 配合使用。通过 `ConversationDetail` 的 `list` 属性可进行独立配置：

```typescript
import { ConversationDetail, MessageList } from 'react-native-chat-uikit';
import type { MessageListRef } from 'react-native-chat-uikit';

function ChatScreen({ route }) {
  const { convId, convType } = route.params;
  const messageListRef = useRef<MessageListRef>(null);

  return (
    <ConversationDetail
      type="chat"
      convId={convId}
      convType={convType}
      list={{
        props: {
          // 传递给 MessageList 的属性
          onClickedItem: (id, model) => {
            console.log('点击消息:', id, model);
          },
          recvMessageAutoScroll: true,
          containerStyle: {
            backgroundColor: '#f5f5f5',
          },
        },
        // render: MessageList, // 可选：使用自定义的 MessageList 组件
        ref: messageListRef, // 获取 MessageList 的控制器
      }}
      onBack={() => navigation.goBack()}
    />
  );
}
```

## 设置容器样式

通过 `containerStyle` 自定义消息列表容器的样式，例如，调整背景色、内边距等：

```typescript
<ConversationDetail
  type="chat"
  convId={convId}
  convType={convType}
  list={{
    props: {
      containerStyle: {
        backgroundColor: '#f9f9f9',
        paddingHorizontal: 10,
      },
    },
  }}
  onBack={() => navigation.goBack()}
/>
```

## 消息布局类型

`messageLayoutType` 可调整消息的排列方式，适用于客服消息、系统通知等场景。

```typescript
<ConversationDetail
  type="chat"
  convId={convId}
  convType={convType}
  list={{
    props: {
      // 所有消息显示在左侧
      messageLayoutType: 'left',

      // 或所有消息显示在右侧
      // messageLayoutType: 'right',

      // 不设置则使用默认布局（发送消息在右，接收消息在左）
    },
  }}
  onBack={() => navigation.goBack()}
/>
```

## 自动滚动控制

`recvMessageAutoScroll` 属性控制收到新消息时是否自动滚动到底部。默认值为 `false`，避免打断用户浏览历史消息：

```typescript
<ConversationDetail
  type="chat"
  convId={convId}
  convType={convType}
  list={{
    props: {
      recvMessageAutoScroll: true, // 收到新消息时自动滚动
    },
  }}
  onBack={() => navigation.goBack()}
/>
```

## 自定义消息条目

`listItemRenderProps` 是消息列表最核心的自定义属性，提供对消息渲染的细粒度控制。通过该属性，你可以完全控制消息的显示样式，包括消息气泡、内容、头像、引用消息等。

### 可自定义组件

`listItemRenderProps` 包含以下可自定义组件：

| 组件名称  | 类型      | 描述       |
| :-------------- | :----- | :------- |
| `MessageView`         | `MessageViewRender`            | 消息视图组件，作为最外层的消息容器，包含头像、气泡等所有元素。 |
| `MessageBubble`       | `MessageBubbleRender`          | 消息气泡组件，作为消息内容的背景包裹层。                     |
| `MessageContent`      | `MessageContentRender`         | 消息内容组件，用于显示具体的消息内容（文本、图片、视频等）。   |
| `MessageQuoteBubble`  | `MessageQuoteBubbleRender`     | 引用消息气泡组件，用于显示被引用的消息内容。                   |
| `MessageThreadBubble` | `MessageThreadRender`          | 话题消息气泡组件，用于显示话题相关信息。                       |
| `MessageReaction`     | `MessageReactionRender`        | 消息表情回复组件，用于显示消息的表情回复。                     |
| `SystemTipView`       | `SystemTipViewRender`          | 系统提示组件，用于显示系统消息（如"xxx 撤回了一条消息"）。     |
| `TimeTipView`         | `TimeTipViewRender`            | 时间提示组件，用于显示消息时间分隔。                           |
| `ListItemRender`      | `MessageListItemComponentType` | 完整消息条目组件（替换所有上述组件）。 |

### 自定义消息内容

`MessageContent` 是最常用的自定义组件，用于定义消息内容的显示方式，例如，自定义图片消息的呈现效果，或添加自定义消息类型。

#### 基础用法

```typescript
import React from 'react';
import { View, Text } from 'react-native';
import {
  MessageContent,
  MessageContentProps,
  ChatMessageType,
  ChatCustomMessageBody,
} from 'react-native-chat-uikit';

// 自定义消息内容组件
export function CustomMessageContent(props: MessageContentProps) {
  const { msg, isSupport } = props;

  // 处理自定义消息类型
  if (msg.body.type === ChatMessageType.CUSTOM) {
    const body = msg.body as ChatCustomMessageBody;

    // 自定义安全提示消息
    if (body.event === 'custom_safe_tip') {
      return (
        <View style={{ padding: 10, backgroundColor: '#FFF3E0', borderRadius: 8 }}>
          <Text style={{ color: '#E65100', fontSize: 14 }}>
            {body.params?.tip || '安全提示'}
          </Text>
        </View>
      );
    }

    // 自定义红包消息
    if (body.event === 'custom_red_packet') {
      return (
        <View style={{
          padding: 15,
          backgroundColor: '#FF5722',
          borderRadius: 8,
          minWidth: 200,
        }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
            🧧 {body.params?.title || '恭喜发财，大吉大利'}
          </Text>
          <Text style={{ color: 'white', fontSize: 12, marginTop: 5 }}>
            {body.params?.subtitle || '点击领取红包'}
          </Text>
        </View>
      );
    }
  }

  // 其他类型使用默认渲染
  return <MessageContent {...props} />;
}

// 在 ConversationDetail 中使用
<ConversationDetail
  type="chat"
  convId={convId}
  convType={convType}
  list={{
    props: {
      listItemRenderProps: {
        MessageContent: CustomMessageContent,
      },
    },
  }}
  onBack={() => navigation.goBack()}
/>
```

#### 自定义图片消息显示

```typescript
import React from 'react';
import { View } from 'react-native';
import {
  MessageContent,
  MessageContentProps,
  ChatMessageType,
  DefaultImage,
  getImageShowSize,
  getImageThumbUrl,
} from 'react-native-chat-uikit';
import FastImage from 'react-native-fast-image'; // 使用第三方图片库

export function CustomMessageContent(props: MessageContentProps) {
  const { msg, contentMaxWidth } = props;
  const [thumbUrl, setThumbUrl] = React.useState<string | undefined>();

  // 自定义图片消息的显示
  if (msg.body.type === ChatMessageType.IMAGE) {
    const { width, height } = getImageShowSize(msg, contentMaxWidth);

    React.useEffect(() => {
      getImageThumbUrl(msg)
        .then((url) => setThumbUrl(url))
        .catch((error) => console.error('加载图片失败:', error));
    }, [msg]);

    return (
      <View
        style={{
          width,
          height,
          borderRadius: 12,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: '#E0E0E0',
        }}
      >
        <FastImage
          source={{ uri: thumbUrl }}
          style={{ width, height }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>
    );
  }

  // 其他消息类型使用默认渲染
  return <MessageContent {...props} />;
}
```

### 自定义消息视图

`MessageView` 是消息条目的最外层容器，整合了头像、昵称、消息气泡、状态标识等所有消息元素，是控制消息整体布局的核心入口。

例如，隐藏左侧消息的头像： 

```typescript
import React from 'react';
import { MessageView, MessageViewProps } from 'react-native-chat-uikit';

export function CustomMessageView(props: MessageViewProps) {
   // 左侧消息（接收）隐藏头像
  if (props.model.layoutType === 'left') {
    return <MessageView {...props} avatarIsVisible={false} />;
  }

  // 右侧消息（发送）保持默认
  return <MessageView {...props} />;
}

// 使用自定义组件
<ConversationDetail
  type="chat"
  convId={convId}
  convType={convType}
  list={{
    props: {
      listItemRenderProps: {
        MessageView: CustomMessageView,
      },
    },
  }}
  onBack={() => navigation.goBack()}
/>
```

### 自定义消息气泡

`MessageBubble` 是包裹消息内容的背景容器组件，负责消息气泡的视觉样式呈现，包括背景色、圆角、阴影等外观属性。详见 [消息列表的基本设置说明](chatuikit_custom_chat_basic.html#设置消息气泡)。

### 自定义消息回复 Reaction

`MessageReaction` 是用于展示消息 Reaction 的组件，支持用户通过表情对消息进行快捷回复。

### 自定义系统提示消息

`SystemTipView` 是系统提示消息的样式组件。你可通过该组件自定义提示消息的字体、颜色、字号等样式属性。

### 自定义消息时间戳

`TimeTipView` 是消息时间戳的样式组件。你可通过该组件自定义时间戳的字体、颜色、字号等样式属性。

### 组合自定义示例

- 你可以同时自定义多个组件，实现完整的个性化消息样式：

```typescript
<ConversationDetail
  type="chat"
  convId={convId}
  convType={convType}
  list={{
    props: {
      listItemRenderProps: {
        // 自定义消息视图
        MessageView: CustomMessageView,
        // 自定义消息气泡
        MessageBubble: CustomMessageBubble,
        // 自定义消息内容
        MessageContent: CustomMessageContent,
        // 自定义系统提示
        SystemTipView: CustomSystemTipView,
      },
    },
  }}
  onBack={() => navigation.goBack()}
/>
```

- 实际项目示例 

  以下示例来自 `product-uikit-demo`，展示了如何自定义图片消息的渲染，使用 `FastImage` 优化图片加载性能：

```typescript
// 自定义图片组件，使用 FastImage 优化性能
export function DemoMessageImage(props: MessageImageProps) {
  const { msg, maxWidth } = props;
  const [thumbUrl, setThumbUrl] = React.useState<string | undefined>();
  const { width, height } = getImageShowSize(msg, maxWidth);

  React.useEffect(() => {
    getImageThumbUrl(msg)
      .then((url) => setThumbUrl(url))
      .catch((error) => console.error(error));
  }, [msg]);

  return (
    <DemoMessageDefaultImage
      url={thumbUrl}
      width={width}
      height={height}
      thumbWidth={64}
      thumbHeight={64}
      iconName={'img'}
    />
  );
}

// 自定义消息内容组件
export function DemoMessageContent(props: MessageContentProps) {
  const { msg, isSupport, layoutType, contentMaxWidth, ...others } = props;

  // 处理图片消息
  if (isSupport === true) {
    if (msg.body.type === ChatMessageType.IMAGE) {
      return (
        <DemoMessageImage
          layoutType={layoutType}
          msg={msg}
          maxWidth={contentMaxWidth}
          {...others}
        />
      );
    }
  }

  // 其他消息类型使用默认渲染
  return <MessageContent {...props} />;
}

// 在聊天页面中使用
<ConversationDetail
  type="chat"
  convId={convId}
  convType={convType}
  list={{
    props: {
      listItemRenderProps: {
        MessageContent: DemoMessageContent,
      },
    },
  }}
  onBack={() => navigation.goBack()}
/>
```

## 设置长按消息菜单

在消息列表中长按任意消息，弹出操作菜单。UIKit 提供三种风格的消息长按菜单：底部弹出菜单、类似微信风格菜单和自定义菜单。关于菜单风格的选择，详见 [消息列表的基本设置说明](chatuikit_custom_chat_basic.html#设置长按消息菜单)。

通过 `onInitMenu` 属性自定义菜单项，包括添加、修改和删除菜单项。

### 管理菜单项

#### 添加菜单项

每个菜单项均为 `InitMenuItemsType` 对象，包含以下属性：

| 属性名      | 类型       | 是否必需 | 描述      |
| ----------- | ------------------------------ | -------- | ------------------ |
| `name`      | `string`                       | 是       | 菜单项文本。    |
| `isHigh`    | `boolean`                      | 是       | 是否高亮（危险操作）。  |
| `icon`      | `IconNameType`                 | 否       | 图标名称。   |
| `onClicked` | `(name, others?) => void`      | 否       | 点击回调。  |

```typescript
<ConversationDetail
  type="chat"
  convId={convId}
  convType={convType}
  list={{
    props: {
      onInitMenu: (initItems) => {
        // 在默认菜单项后面添加自定义菜单项
        return [
          ...initItems,
          {
            name: '收藏',
            isHigh: false,
            icon: 'star',
            onClicked: (name) => {
              console.log('收藏消息:', name);
              // todo: 处理收藏逻辑
            },
          },
          {
            name: '翻译',
            isHigh: false,
            icon: 'globe',
            onClicked: () => {
              // todo: 处理翻译逻辑
            },
          },
        ];
      },
    },
  }}
  onBack={() => navigation.goBack()}
/>
```

#### 修改菜单项

```typescript
<ConversationDetail
  type="chat"
  convId={convId}
  convType={convType}
  list={{
    props: {
      onInitMenu: (initItems) => {
        // 修改"删除"菜单项的文本
        return initItems.map((item) => {
          if (item.name === '删除') {
            return {
              ...item,
              name: '彻底删除',
              isHigh: true, // 设置为高亮
            };
          }
          return item;
        });
      },
    },
  }}
  onBack={() => navigation.goBack()}
/>
```

#### 删除菜单项

```typescript
<ConversationDetail
  type="chat"
  convId={convId}
  convType={convType}
  list={{
    props: {
      onInitMenu: (initItems) => {
        // 删除"转发"和"多选"菜单项
        return initItems.filter((item) => {
          return item.name !== '转发' && item.name !== '多选';
        });
      },
    },
  }}
  onBack={() => navigation.goBack()}
/>
```

### 修改菜单图标

关于修改菜单项的图标，详见 [图标自定义文档](chatuikit_custom_icon.html)。

## 使用控制器

通过 `MessageListRef` 获取控制器，实现高级功能。

`MessageListRef` 提供以下控制器方法：

| 方法名       | 参数        | 返回值          | 描述         |
| ---------- | ----------------- | --------------- | ----------- |
| `addSendMessage`                 | `value: SendMessageProps`                             | `void`          | 添加消息到列表底部位置。                               |
| `addSendMessageToUI`             | `params: {value, onFinished?, onBeforeCallback?}`     | `Promise<void>` | 添加消息到 UI，并提供回调。                            |
| `sendMessageToServer`            | `msg: ChatMessage`                                    | `void`          | 将消息发送到服务器。                                   |
| `saveMessage`                    | `msg: ChatMessage`                                    | `void`          | 将消息保存到本地数据库。                               |
| `removeMessage`                  | `msg: ChatMessage`                                    | `void`          | 从消息列表中移除消息。                                 |
| `recallMessage`                  | `msg: ChatMessage`                                    | `void`          | 撤回消息。                                             |
| `updateMessage`                  | `updatedMsg: ChatMessage, fromType: 'send' \| 'recv'` | `void`          | 更新消息。                                             |
| `loadHistoryMessage`             | `msgs: ChatMessage[], pos: 'top' \| 'bottom'`         | `void`          | 加载历史消息到指定位置。                               |
| `onInputHeightChange`            | `height: number`                                      | `void`          | 输入组件高度变化时的回调通知。                         |
| `editMessageFinished`            | `model: MessageModel`                                 | `void`          | 消息编辑完成时的回调通知。                             |
| `scrollToBottom`                 | 无                                                    | `void`          | 滚动列表到底部。                                       |
| `startShowThreadMoreMenu`        | 无                                                    | `void`          | 显示话题更多菜单。                                     |
| `cancelMultiSelected`            | 无                                                    | `void`          | 取消多选模式。                                         |
| `removeMultiSelected`            | `onResult: (confirmed: boolean) => void`              | `void`          | 移除多选的消息。                                       |
| `getMultiSelectedMessages`       | 无                                                    | `ChatMessage[]` | 获取多选的消息列表。                                   |
| `showPinMessageComponent`        | 无                                                    | `void`          | 显示置顶消息组件。                                     |
| `hidePinMessageComponent`        | 无                                                    | `void`          | 隐藏置顶消息组件。                                     |
| `requestShowPinMessageComponent` | `onResult: (count: number) => void`                   | `void`          | 请求显示置顶消息组件，可根据置顶消息数量决定是否显示。 |

### 添加消息到列表

通过以下两种方式添加消息到列表：

- 使用控制器的 `addSendMessage` 方法：

```typescript
import React, { useRef } from 'react';
import type { MessageListRef } from 'react-native-chat-uikit';

function ChatScreen({ route }) {
  const { convId, convType } = route.params;
  const messageListRef = useRef<MessageListRef>(null);

  const handleAddMessage = () => {
    messageListRef.current?.addSendMessage({
      type: 'text',
      content: 'Hello, World!',
    });
  };

  return (
    <ConversationDetail
      type="chat"
      convId={convId}
      convType={convType}
      list={{
        ref: messageListRef,
      }}
      onBack={() => navigation.goBack()}
    />
  );
}
```

- 使用 `addSendMessageToUI` 方法。该方法提供更多控制选项：

```typescript
const handleAddMessageWithCallback = async () => {
  await messageListRef.current?.addSendMessageToUI({
    value: {
      type: "text",
      content: "Hello!",
    },
    onBeforeCallback: async () => {
      console.log("添加消息前的准备工作");
    },
    onFinished: (item) => {
      console.log("消息已添加到UI:", item);
    },
  });
};
```

### 移除消息

通过控制器的 `removeMessage` 方法移除消息：

```typescript
const handleRemoveMessage = (message: ChatMessage) => {
  messageListRef.current?.removeMessage(message);
};
```

### 撤回消息

通过控制器的 `recallMessage` 方法撤回消息：

```typescript
const handleRecallMessage = (message: ChatMessage) => {
  messageListRef.current?.recallMessage(message);
};
```

### 更新消息

通过控制器的 `updateMessage` 方法更新消息：

```typescript
const handleUpdateMessage = (updatedMessage: ChatMessage) => {
  messageListRef.current?.updateMessage(updatedMessage, "send");
  // 第二个参数: 'send' 表示发送的消息，'recv' 表示接收的消息
};
```

### 滚动控制

通过控制器的 `scrollToBottom` 方法可滚动到消息列表底部：

```typescript
const handleScrollToBottom = () => {
  messageListRef.current?.scrollToBottom();
};
```

### 多选消息

通过控制器可实现多选消息：

| 方法                       | 描述               |
| :------------------------- | :----------------- |
| `cancelMultiSelected`      | 取消多选模式。       |
| `removeMultiSelected`      | 删除选中的消息。     |
| `getMultiSelectedMessages` | 获取选中的消息列表。 |

```typescript
// 取消多选模式
const handleCancelMultiSelect = () => {
  messageListRef.current?.cancelMultiSelected();
};

// 删除多选的消息
const handleRemoveMultiSelected = () => {
  messageListRef.current?.removeMultiSelected((confirmed) => {
    if (confirmed) {
      console.log("用户确认删除");
    } else {
      console.log("用户取消删除");
    }
  });
};

// 获取多选的消息列表
const handleGetMultiSelected = () => {
  const messages = messageListRef.current?.getMultiSelectedMessages() || [];
  console.log("选中的消息:", messages);
};
```

### 置顶消息

通过控制器可以控制置顶消息组件的显示和隐藏（仅群聊支持）： 

| 方法                             | 描述                     |
| :------------------------------- | :----------------------- |
| `showPinMessageComponent`        | 显示置顶消息组件。         |
| `hidePinMessageComponent`        | 隐藏置顶消息组件。         |
| `requestShowPinMessageComponent` | 根据置顶数量决定是否显示。 |

```typescript
// 显示置顶消息组件
const handleShowPinMessage = () => {
  messageListRef.current?.showPinMessageComponent();
};

// 隐藏置顶消息组件
const handleHidePinMessage = () => {
  messageListRef.current?.hidePinMessageComponent();
};

// 请求显示置顶消息组件（根据置顶消息数量决定是否显示）
const handleRequestShowPinMessage = () => {
  messageListRef.current?.requestShowPinMessageComponent((count) => {
    console.log("置顶消息数量:", count);
    // 可以根据数量决定是否显示
  });
};
```

## 自定义事件监听

关于自定义消息列表的事件监听，详见 [自定义数据模型文档](chatuikit_custom_data_model.html#自定义事件监听器)。

## 自定义图标和文案

- 关于自定义聊天页面的图标，详见 [自定义图标文档](chatuikit_custom_icon.html)。
- 关于自定义聊天页面的文案，详见 [自定义图标文档](chatuikit_custom_text.html)。


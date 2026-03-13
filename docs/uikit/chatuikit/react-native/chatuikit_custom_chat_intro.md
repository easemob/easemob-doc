# 聊天页面介绍

`ConversationDetail` 组件提供完整的聊天交互界面，支持多种消息类型收发及丰富的消息管理功能：

| 类别         | 功能                                     |
| :----------- | :--------------------------------------- |
| **消息收发** | 文本、表情、图片、语音、视频、文件、名片 |
| **消息操作** | 复制、引用、撤回、删除、编辑、重发、审核 |
| **消息管理** | 本地消息清除、消息搜索、消息多选         |
| **互动增强** | 表情回应、消息置顶、消息翻译、转发       |

## 页面组件

聊天页面通过 `ConversationDetail` 实现，由标题栏 `ConversationDetailNavigationBar`、消息列表 `MessageList` 和底部输入框 `MessageInput` 组成。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/custom_chat.png" title="聊天页面 ConversationDetail" />
</ImageGallery>

聊天页面组件是一个复杂的组件，组件结构如下：

```text
ConversationDetail
├── ConversationDetailNavigationBar    // 标题栏
├── MessageList                        // 消息列表
│   ├── AnimatedMessagePinPlaceholder  // 消息置顶占位
│   ├── FlatList                       // 消息渲染列表
│   ├── MessageLongPressMenu            // 长按操作菜单
│   ├── BottomSheetEmojiList            // 表情回应选择器
│   ├── BottomSheetReactionDetail       // 回应详情弹窗
│   └── BottomSheetMessageReport        // 消息举报弹窗
└── MessageInput                        // 消息输入区
    ├── EmojiList                        // 表情选择面板
    ├── BottomVoiceBar                    // 语音录制栏
    ├── MessageInputEditMessage            // 消息编辑框
    └── MessageInputBarMenu                // 附件扩展菜单
```

### 标题栏

聊天页面的标题栏 `ConversationDetailNavigationBar` 组件，继承自通用 `TopNavigationBar`，展示会话信息并承载操作入口：

- **会话信息**：头像、名称、免打扰状态。
- **导航操作**：返回按钮。
- **功能入口**：音视频通话、更多菜单（查看资料、搜索、清空消息等）。

关于标题栏的自定义，详见 [设置标题栏](chatuikit_custom_titlebar.html)。

### 消息列表

消息列表 `MessageList` 负责消息的渲染与交互。

#### 核心能力

消息列表的核心能力如下表所示：

| 功能         | 说明           |
| :----------- | :-----| 
| **消息展示** | 支持全部消息类型，每条消息通过 `MessageListItem` 渲染 。       |
| **消息操作** | 长按弹出菜单：复制、引用、撤回、删除、编辑、重发、举报、翻译、转发、多选、置顶。 |
| **消息回应** | 支持对消息进行表情回应（Reaction），点击回应可查看回应详情。                   |
| **消息置顶** | 群聊中置顶的消息显示在列表顶部。 |
| **消息条目** | `MessageListItem` 实现单条消息展示，包括消息气泡、用户头像、消息时间、发送状态等。     |

#### 消息列表子组件

| 子组件         | 说明           |
| :----------- | :-----| 
| **AnimatedMessagePinPlaceholder**       | 消息置顶占位组件，为置顶消息预留显示空间。          |
| **MessageLongPressMenu**         | 消息长按菜单，提供消息操作选项。         |
| **BottomSheetEmojiList**         | 表情回应选择器，用于选择对消息的回应表情。        |
| **BottomSheetReactionDetail**         | 表情回应详情，显示消息的所有回应及回应用户。         |
| **BottomSheetMessageReport**         | 消息举报弹窗，用于举报不当消息。         |

### 消息输入

`MessageInput` 提供完整的消息输入能力。

#### 核心能力

消息输入区的核心能力如下表所示：

| 模块         | 功能                                              |
| :----------- | :------------------------------------------------ |
| **文本输入** | 多行文本输入，自动调整高度。                        |
| **语音输入** | 按住录音，松开发送（`BottomVoiceBar`）。            |
| **表情输入** | 表情面板选择与发送（`EmojiList`）。                 |
| **附件发送** | 扩展菜单：图片、视频、文件、名片。                  |
| **消息编辑** | 编辑已发送的文本消息（`MessageInputEditMessage`）。 |
| **消息引用** | 在输入框上方显示被引用的消息。                      |
| **多选模式** | 进入多选后支持批量删除/转发。                       |

#### 消息输入子组件

| 子组件         | 说明           |
| :----------- | :-----| 
| **EmojiList**       | 表情选择列表，提供常用表情的选择和发送。          |
| **BottomVoiceBar**         | 语音输入栏，支持按住说话、松开发送的语音消息录制。           |
| **MessageInputEditMessage**         | 编辑消息弹窗，用于编辑已发送的文本消息。           |
| **MessageInputBarMenu**         | 扩展功能菜单，提供图片、视频、文件、名片等附件发送功能。           |

## 创建聊天页面

使用 `ConversationDetail` 组件快速搭建聊天页面。

**UIKit 不内置路由导航，页面跳转需集成 `React Navigation` 等第三方库自行实现。**

```tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { View } from 'react-native';
import {
  ConversationDetail,
  type ConversationDetailModelType,
  type ConversationDetailRef,
} from 'react-native-chat-uikit';

type Props = NativeStackScreenProps<RootScreenParamsList>;

export function ConversationDetailScreen(props: Props) {
  const { route, navigation } = props;
  const convId = ((route.params as any)?.params as any)?.convId;
  const convType = ((route.params as any)?.params as any)?.convType;
  const convRef = React.useRef<ConversationDetailRef>({} as any);

  return (
    <ConversationDetail
      type={'chat'}
      convId={convId}
      convType={convType}
      onBack={() => {
        navigation.goBack();
      }}
    />
  );
}
```

#### 参数说明

| 参数                  | 类型                                             | 必填 | 默认值 | 说明               |
| :-------------------- | :----------------------------------------------- | :--- | :----- | :----------------- |
| `type`                | - `chat`<br/> - `thread`<br/> - `search`<br/> - `create_thread` | 是   | -      | 页面类型：<br/> - `chat`：普通单聊/群聊页面 <br/> - `thread`：话题聊天页面 <br/> - `search`：消息历史搜索页面<br/> - `create_thread`：创建话题页面       |
| `convId`              | `String`                                         | 是   | -      | 会话 ID             |
| `convType`            | `number`                                         | 是   | -      | - `0`：单聊<br/> - `1`：群聊    |
| `onBack`              | `() => void`                                     | 否   | -      | 返回按钮回调       |
| `enableNavigationBar` | `Boolean`                                        | 否   | `true` | 是否显示默认标题栏 |
| `NavigationBar`       | `React.ReactElement`                             | 否   | -      | 完全自定义标题栏   |
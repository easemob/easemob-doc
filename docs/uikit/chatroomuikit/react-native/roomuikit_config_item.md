# 可配置项

`room uikit sdk` 的组件中包含各种属性，你可以根据需求进行设置。

除了[主题组件](#roomuikit_theme.html)，`room uikit sdk` 主要包括如下组件：

| 组件名称        | 组件介绍          | 
| --------------- | ---------------------------- | 
| [I18n](#国际化组件)            | 可以设置 `UIKit` 所有 UI 组件的语言。         | 
| [Chatroom](#chatroom-组件)       | 聊天室组件，集成了礼物发送、消息列表、成员列表、礼物接收等组件。     |
| [MessageList](#messagelist-组件)      | 聊天室消息区域组件，用于显示发送或者接收到的消息。             | 
| [ParticipantList](#participantlist-组件) | 聊天室成员列表组件，包括聊天室成员和禁言成员的管理。   | 
| [GiftMessageList](#giftmessagelist-组件) | 聊天室打赏消息区域组件，用于显示打赏的礼物。      | 
| [GlobalBroadcast](#globalbroadcast-组件) | 聊天室全局广播组件，用于向 app 下的所有聊天室发送消息。   | 
| [MessageInput](#messageinput-组件)    | 消息输入组件，用于发送各类消息。  | 
| [BottomToolbar](#bottomtoolbar-组件)   | 聊天室底部工具栏区域，可以与消息输入组件互相切换，支持添加自定义按钮。         | 
| [BottomSheetGift](#bottomsheetgift-组件) | 发送礼物组件，可以发送礼物，礼物来源由开发者指定。                   | 
| [ReportMessage](#reportmessage-组件)   | 聊天室举报组件。     | 

## 国际化组件

UIKit 支持多国语言切换，目前内置中文和英文，可以扩展其他语言。

例如：若要 UIKit 使用英文显示，可以如下设置：

```tsx
<Container appKey={env.appKey} language={'en'} />
```

语言设置规则：

- 若未设置语言，则使用默认的系统语言。
- 若系统语言不是中文或者英文，则国内选择中文，国外选择英文。
- 若设置的语言不是中文或者英文，并且没有提供相应的语言集合，则国内选择中文，国外选择英文。

例如，若开发者希望 `UIKit` 和应用均使用中文，设置如下：

```tsx
// ...
// 创建应用需要的语言包。
function createLanguage(type: LanguageCode): StringSet {
  return {
    'Chinese text.': '中文文本.',
  };
}
// ...
// 设置指定语言集合，并且提供语言翻译源。
<Container
  appKey={env.appKey}
  language={'zh-Hans'}
  languageExtensionFactory={createLanguage}
/>;
// ...
// 在需要国际化的地方。
const { tr } = useI18nContext();
return <Text>{tr('Chinese text.')}</Text>;
```

例如，若开发者希望应用和 UIKit 均显示法语，设置如下：

```tsx
// ...
// 创建应用扩展语言集合。
function createAppLanguage(type: LanguageCode): StringSet {
  if (type === 'fr') {
    return {
      'French text.': 'Text français.',
    };
  }
  return {
    'French text.': 'French text.',
  };
}
// 创建 UIKit 的语言集合，需要找到 UIKit 内置的文件 `StringSet.en.tsx`, 将所有的 `value` 修改为法语版本。
export function createUIKitLanguage(type: LanguageCode): StringSet {
  if (type === 'fr') {
    return {
      'Private Chat': 'Private Chat',
      '...': '...',
    };
  }
}
// ...
// 设置指定语言集合，并且提供语言翻译源。
<Container
  appKey={env.appKey}
  language={'fr'}
  languageBuiltInFactory={createUIKitLanguage}
  languageExtensionFactory={createAppLanguage}
/>;
```

## 初始化

`Chatroom UIKit SDK` 的入口为 `Container` 组件，主要负责集成其他组件和参数配置。

```tsx
export type ContainerProps = React.PropsWithChildren<{
  appKey: string;
  isDevMode?: boolean;
  language?: StringSetType;
  languageBuiltInFactory?: CreateStringSet;
  languageExtensionFactory?: CreateStringSet;
  palette?: Palette;
  theme?: Theme;
  roomOption?: PartialRoomOption;
  avatar?: {
    borderRadiusStyle?: CornerRadiusPaletteType;
  };
  fontFamily?: string;
  onInitialized?: () => void;
}>;
```

```tsx
// 主要控制 `Chatroom` 组件中的组件是否加载。
export type RoomOption = {
  globalBroadcast: {
    isVisible: boolean;
  };
  gift: {
    isVisible: boolean;
  };
  messageList: {
    isVisibleGift: boolean;
    isVisibleTime: boolean;
    isVisibleTag: boolean;
    isVisibleAvatar: boolean;
  };
};
```

| 参数         | 是否必需 | 描述     |
| :----------- | :----- | :--------------------- |
| `appKey` | 是  | 你在环信即时通讯云控制台创建应用时填入的应用名称。该参数是 App Key 的一部分。可以在[环信即时通讯云控制台](https://console.easemob.com/user/login)的 **应用详情** 页面查看。   |
| `isDevMode`  | 否 | 如果设置为 `true`，则激活日志打印等工具。  |
| `language` | 否  | 设置当前的语言，若未设置，则获取系统当前的语言作为默认值。   |
| `languageBuiltInFactory` | 否 | 若未设置则使用内置的语言资源。通常可以修改内置的 UI 内容。    |
| `languageExtensionFactory`  | 否  | 如果设置将扩展语言资源。通常应用的 UI 也需要国际化。  |
| `palette` | 否 | 设置当前的调色板，主题服务的重要依赖。  |
| `theme` | 否 | 若未设置主题，则使用 `light` 为默认主题。   |
| `roomOption` | 否 | 聊天室选项。具体参见以下全局配置参数。  |
| `avatar` | 否 | 设置全局头像的圆角样式。   |
| `fontFamily` | 否 | 支持自定义字体。默认使用系统字体。   |
| `onInitialized` | 否 | 初始化完成的回调通知。  |

全局配置参数如下：

| 参数         | 是否必需 | 描述     |
| :----------- | :----- | :--------------------- |
| `globalBroadcast`  | 否  | 全局广播组件配置，可以设置是否加载。   |
| `gift`  | 否  | 聊天室打赏消息区域组件，可以设置是否加载。   |
| `messageList`  | 否 | 聊天室消息区域配置：<br/> - `isVisibleGift`: 是否加载聊天室打赏消息区域组件；<br/> - `isVisibleTime`: 是否显示时间标签；<br/> - `isVisibleTag`: 是否显示用户标签；<br/> - `isVisibleAvatar`: 是否显示头像标签。   |

通常 `Container` 会处于应用的底层，一般为根组件，或者与根组件同一级别。例如：

```tsx
export function App() {
  return <Container appKey={'your app key'}>{children}</Container>;
}
```

## Chatroom 组件

Chatroom 组件集成了成员列表组件 `ParticipantList`、消息输入组件 `MessageInput`、消息区域组件 `MessageList`、打赏消息区域组件 `GiftMessageList` 和全局广播通知组件 `GlobalBroadcast`等。该组件为页面级组件，基本占据了整个屏幕，如果要添加组件，建议添加为 Chatroom 的子组件或背景组件。

示例如下：

```tsx
// ...
// 创建引用对象
const ref = React.useRef<Chatroom>({} as any);
// ...
// 添加组件到渲染树
<Chatroom ref={chatroomRef} roomId={room.roomId} ownerId={room.owner} />;
```

由于 `UIKit` 没有路由 （`React-Native` 未内置），所以若需要成员搜索，设置如下：

```tsx
<Chatroom
  ref={chatroomRef}
  participantList={{
    props: {
      onSearch: (memberType) => {
        // todo: 点击搜索按钮跳转到搜索页面
        navigation.push('SearchParticipant', { params: { memberType } });
      },
    },
  }}
  roomId={room.roomId}
  ownerId={room.owner}
/>
```

`Chatroom` 组件提供如下属性：

| 属性                       | 是否必需 | 描述                                                |
| -------------------------- | -------- | ---------------------------------------------------- |
| containerStyle             | 否     | 设置组件容器样式。该属性可以控制 `Chatroom` 组件的背景、位置、大小、边框等样式。 |
| GiftMessageList            | 否     | 打赏消息区域组件的渲染器。默认使用内部组件 `GiftMessageList`，可以设置类型为 `GiftMessageListComponent` 的自定义组件。替换之后的行为完全由开发者控制，如果在 `GiftMessageList` 组件的基础上进行扩展或者修改则更为方便。  |
| GlobalBroadcast            | 否     | 全局广播组件的渲染器。默认使用内部组件 `GlobalBroadcast`，可以设置类型为 `GlobalBroadcastComponent` 的自定义组件。   |
| MessageList                | 否     | 消息区域组件的渲染器。默认使用内部组件 `MessageList`，可以设置类型为 `MessageListComponent` 的自定义组件。    |
| MessageInput               | 否     | 输入组件的渲染器。默认使用内部组件 `MessageInput`，可以设置类型为 `MessageInputComponent` 的自定义组件。该组件包括聊天室底部工具栏区域组件 `BottomToolbar`，若要自定义需考虑这一点。  |
| BottomSheetParticipantList | 否     | 成员列表组件的渲染器。默认使用内部组件` BottomSheetParticipantList`，可以设置类型为 `BottomSheetParticipantListComponent` 的自定义组件。|
| input                      | 否     | 输入组件的属性。  |
| messageList                | 否     | 消息区域的属性。  |
| globalBroadcast            | 否     | 聊天室全局广播的属性。 |
| gift                       | 否     | 打赏消息的属性。|
| participantList            | 否     | 成员列表的属性。   |
| backgroundView             | 否     | 背景组件。   |

`Chatroom` 提供如下方法：

| 方法                  | 描述                                      |
| --------------------- | ------------------------------------------ |
| getGlobalBroadcastRef | 获取 `GlobalBroadcast` 组件的引用。默认通过收到后台的消息广播进行显示，开发者可以插入自定义全局广播消息。            |
| getGiftMessageListRef | 获取 `GiftMessageList` 组件的引用。            |
| getParticipantListRef | 获取 `BottomSheetParticipantList` 的组件引用。开发者可以自定义成员管理相关内容。 |
| getMessageListRef     | 获取 `MessageList` 组件的引用。默认通过发送消息或者接收消息显示消息，开发者可以手动插入自定义消息、删除消息、滚动到最底部等操作。                |
| joinRoom              | 加入聊天室。加载 `Chatroom` 组件时，你会自动加入聊天室。若由于网络等问题加入失败，开发者可以通过该方法尝试重新加入聊天室。  |
| leaveRoom             | 退出聊天室，而不用卸载组件。 |

![img](@static/images/uikit/chatroomrn/chatroom.png)

## MessageList 组件

聊天室消息区域组件 `MessageList` 提供消息的显示，聊天室接收到的文本消息、表情消息、礼物消息以及发送成功的消息会显示在该区域。

可以在消息区域中对消息进行操作，例如，翻译文本消息为目标语言、撤销消息和消息上报等。你可以通过长按消息列表项弹出菜单进行相应操作。

数据上报组件支持自定义选项，可以自定义选项上报不同内容。

示例代码如下：

```tsx
// ...
// 创建组件引用对象
const ref = React.useRef<MessageListRef>({} as any);
// 添加消息列表组件到渲染树
<MessageList ref={ref} />;
// ...
// 添加消息到消息列表，消息会显示在列表
ref?.current?.addSendedMessage?.(message);
```

`MessageList` 提供的属性如下表所示：

| 属性                     | 是否必需 | 描述                                                          |
| ------------------------ | -------- | --------------------------------------------------------------- |
| visible                  | 否     | 设置组件是否可见。                                                |
| onUnreadCount            | 否     | 未读数发生变化时的回调通知。                                      |
| onLongPressItem          | 否     | 长按消息列表项时的回调通知。                                      |
| containerStyle           | 否     | 设置组件容器样式。支持背景、位置、大小、边框等的设置。            |
| onLayout                 | 否     | 组件布局发生变化时的回调通知。                                    |
| MessageListItemComponent | 否     | 消息列表项的渲染器。                                              |
| reportProps              | 否     | 消息上报的属性。                                                 |
| maxMessageCount          | 否     | 组件可以显示的最大消息数，默认为 `1000`，超过限制后将移除最早消息。 |
| messageMenuItems         | 否     | 自定义消息菜单项，追加到内置菜单后面。                            |

`MessageList` 提供的方法如下表所示：

| 方法             | 描述                            |
| ---------------- | -------------------------------- |
| addSendedMessage | 将输入框中的内容发送到消息列表。 |
| scrollToEnd      | 滚动消息列表到底部。               |

![img](@static/images/uikit/chatroomrn/message_context_menu.png)

![img](@static/images/uikit/chatroomrn/message_report.png)

## ParticipantList 组件

聊天室成员组件可以显示和管理聊天室成员，聊天室所有者、禁言列表以及管理权限。

聊天室所有者可以修改成员状态，例如，对成员禁言或踢出聊天室。

:::tip
聊天室成员列表组件的显示的入口并不在 `UIKit`, 需要应用开发者自行实现，例如，添加一个按钮，点击后显示聊天室成员列表组件。
:::

`BottomSheetParticipantList` 组件是一个独立组件，由 `SimulativeModal` 和 `ParticipantList` 组成，可以进行显示和隐藏。

示例代码如下：

```tsx
// ...
// 创建组件引用对象
const ref = React.useRef<BottomSheetParticipantListRef>({} as any);
// 添加成员列表组件到渲染树
<BottomSheetParticipantList ref={this.ref} />;
// ...
// 用户实现显示具体动作，例如：添加按钮，点击按钮显示成员列表组件。
ref?.current?.startShow?.();
```

`BottomSheetParticipantList` 提供的属性如下表所示：

| 属性                | 是否必需 | 描述                                                |
| ------------------- | -------- | ---------------------------------------------------- |
| onSearch            | 否     | 点击搜索样式的回调通知。 |
| onNoMoreMember      | 否     | 下滑加载更多成员时，没有更多成员的回调通知。|
| containerStyle      | 否     | 设置组件容器样式。支持背景、位置、大小、边框等的设置。|
| maskStyle           | 否     | 设置组件容器以外区域样式。  |
| MemberItemComponent | 否     | 成员列表项的渲染器。  |

`BottomSheetParticipantList` 提供的方法如下表所示：

| 方法                  | 描述                             |
| --------------------- | -------------------------------- |
| startShow             | 显示成员列表组件。                         |
| startHide             | 隐藏成员列表组件，隐藏动画完成后返回通知。 |
| getParticipantListRef | 获取成员列表或者禁言列表组件的引用。                         |

`ParticipantList` 提供的方法如下表所示：

| 方法         | 描述                                           |
| ------------ | ---------------------------------------------- |
| initMenu     | 初始化自定义成员列表菜单，追加到内置菜单的后面。 |
| removeMember | 删除成员。                                       |
| muteMember   | 禁言或者解除禁言成员。                           |
| closeMenu    | 关闭菜单。                                      |

![img](@static/images/uikit/chatroomrn/member_list.png)

![img](@static/images/uikit/chatroomrn/member_context_menu.png)

## GiftMessageList 组件

聊天室打赏消息区域组件 `GiftMessageList` 用于展示发送的礼物效果，礼物消息可以显示在消息列表，也可以显示在该组件。

示例代码如下：

```tsx
// ...
// 创建组件引用对象
const ref = React.useRef<GiftMessageListRef>({} as any);
// 添加组件到渲染树
<GiftMessageList ref={ref} />;
// ...
// 添加礼物消息到组件消息队列中，排队显示。
ref.current?.pushTask({
  model: {
    id: seqId('_gf').toString(),
    nickName: 'NickName',
    giftCount: 1,
    giftIcon: 'http://notext.png',
    content: 'send Agoraship too too too long',
  },
});
```

`GiftMessageList` 提供的属性如下表所示：

| 属性                    | 是否必需 | 描述                                          |
| ----------------------- | -------- | ---------------------------------------------- |
| visible                 | 否     | 设置组件是否可见。   |
| containerStyle          | 否     | 设置组件容器样式。支持背景、位置、边框等的设置。 |
| GiftEffectItemComponent | 否     | 打赏消息列表项的渲染器。      |

`GiftMessageList` 提供的方法如下表所示：

| 方法     | 描述                                 |
| -------- | ------------------------------------ |
| pushTask | 将礼物消息任务添加到队列中，排队加载。 |

## GlobalBroadcast 组件

全局广播通知组件 `GlobalBroadcast` 接收和显示全局全局广播，也是通过添加消息到队列排队显示。

简单示例如下：

```tsx
// ...
// 创建组件引用对象
const ref = React.useRef<GlobalBroadcastRef>({} as any);
// ...
// 添加组件到渲染树
<GlobalBroadcast ref={ref} />;
// ...
// 将消息添加到任务队列，排队显示。
let count = 1;
ref.current?.pushTask?.({
  model: {
    id: count.toString(),
    content: count.toString() + content,
  },
});
```

`GlobalBroadcast` 提供的属性如下表所示：

| 属性                    | 是否必需 | 描述                                                |
| ----------------------- | -------- | ---------------------- |
| visible                 | 否     | 设置组件是否可见。                                     |
| playSpeed               | 否     | 消息播放时滚动的速度，默认值为 8。                       |
| containerStyle          | 否     | 设置组件容器样式。支持背景、位置、大小、边框等的设置。 |
| textStyle               | 否     | 设置组件文本样式。                                      |
| icon                    | 否     | 设置组件上的图标样式。                                 |
| GiftEffectItemComponent | 否     | 打赏消息列表项的渲染器。                               |
| onFinished              | 否     | 所有消息播放完成时的回调通知。                         |
| onLayout                | 否     | 组件布局发生变化时的回调通知。                         |

`GlobalBroadcast` 提供的方法如下表所示：

| 方法     | 描述                         |
| -------- | ---------------------------- |
| pushTask | 将消息添加到队列中，排队加载。 |

## MessageInput 组件

消息输入框组件 `MessageInput` 可以发送文本、表情等消息，可以与聊天室底部工具栏区域互相动态切换。当点击聊天室底部工具栏区域组件时切换到输入状态，发送消息或者关闭输入框时切换为聊天室底部工具栏区域组件。

简单示例如下：

```tsx
// ...
// 创建引用对象
const ref = React.useRef<MessageInputRef>({} as any);
// ...
// 添加组件到渲染树
<MessageInput
  ref={ref}
  onSended={(_content, message) => {
    // todo: 调用消息列表引用对象添加消息到消息列表
  }}
/>;
// ...
// 关闭输入状态
ref?.current?.close?.();
```

`MessageInput` 提供的属性如下表所示：

| 属性                   | 是否必需 | 描述                                          |
| ---------------------- | -------- | --------------------------------------------- |
| onInputBarWillShow     | 否     | 将要切换为输入状态时的回调通知。                |
| onInputBarWillHide     | 否     | 将要切换为聊天室底部工具栏区域时的回调通知。            |
| onSended               | 否     | 发送完成时的回调通知。                          |
| keyboardVerticalOffset | 否     | 键盘偏移量的数值。                              |
| closeAfterSend         | 否     | 发送消息后是否切换为聊天室底部工具栏区域。              |
| first                  | 否     | 聊天室底部工具栏区域的第一个自定义组件。                |
| after                  | 否     | 聊天室底部工具栏区域的自定义组件列表，最多可添加 3 个自定义组件。 |
| onLayout               | 否     | 聊天室底部工具栏区域的布局发生变化时的回调通知。          |

`MessageInput` 提供的方法如下表所示：

| 方法  | 描述                                |
| ----- | ------------------------------------ |
| close | 主动关闭输入状态，切换为聊天室底部工具栏区域。 |

![img](@static/images/uikit/chatroomrn/input_bar.pn)

![img](@static/images/uikit/chatroomrn/emoji_list.png)

## BottomToolbar 组件

聊天室底部工具栏区域组件 `BottomToolbar` 与消息输入框组件组成复合组件，可以互相切换。

## BottomSheetGift 组件

礼物列表组件 `BottomSheetGift` 提供自定义礼物列表，点击礼物项的发送按钮发送到聊天室。

:::tip
礼物列表组件是一个独立的组件，需要应用开发者自行实现显示和加载等操作。
:::

示例代码如下：

```tsx
// ...
// 创建引用对象
const ref = React.useRef<BottomSheetGiftSimuRef>({} as any);
// ...
// 添加组件到渲染树
<BottomSheetGift
  ref={ref}
  gifts={[
    {
      title: 'gift1',
      gifts: [
        {
          giftId: '2665752a-e273-427c-ac5a-4b2a9c82b255',
          giftIcon:
            'https://fullapp.oss-cn-beijing.aliyuncs.com/uikit/pictures/gift/AUIKitGift1.png',
          giftName: 'Sweet Heart',
          giftPrice: 1,
        },
      ],
    },
  ]}
  onSend={(giftId) => {
    // todo: 发送选择的礼物。
  }}
/>;
// ...
// 显示礼物列表组件
ref?.current?.startShow?.();
```

:::tip
发送礼物组件提供 `BottomSheetGift` 和 `BottomSheetGift2`，二者的区别为是模态组件还是非模态组件。
:::

`BottomSheetGift` 提供的属性如下表所示：

| 属性      | 是否必需 | 描述                       |
| --------- | -------- | -------------------------- |
| gifts     | 否     | 礼物列表数组。               |
| maskStyle | 否     | 设置组件容器以外区域样式。 |
| onSend    | 否     | 点击发送按钮时的回调通知。   |

`BottomSheetGift` 提供的方法如下表所示：

| 方法              | 描述                           |
| ----------------- | -------------------------------- |
| startShow         | 显示组件。                         |
| startShowWithInit | 显示组件，同时可以初始化列表。     |
| startHide         | 隐藏组件，隐藏动画完成后返回通知。 |

![img](@static/images/uikit/chatroomrn/gift_list.png)

## ReportMessage 组件

消息上报组件 `ReportMessage`，可以设置上报内容。

示例代码如下：

```tsx
// ...
// 创建引用对象
const ref = React.useRef<BottomSheetMessageReport>({} as any);
// ...
// 添加组件到渲染树
<BottomSheetMessageReport
  ref={ref}
  onReport={getOnReport.onReport}
  data={getReportData}
/>;
// ...
// 显示组件
ref?.current?.startShow?.();
// ...
// 选择列表项，确认上报。
```

`BottomSheetMessageReport` 提供的属性如下表所示：

| 属性           | 是否必需 | 描述                                                 |
| -------------- | -------- | ---------------------------------------------------- |
| data           | 否     | 上报内容列表数组。                                     |
| maskStyle      | 否     | 设置组件容器以外区域样式。                           |
| containerStyle | 否     | 设置组件容器样式。支持背景、位置、大小、边框等的设置。 |
| onReport       | 否     | 点击上报按钮时的回调通知。                             |

`BottomSheetMessageReport` 提供的方法如下表所示：

| 方法      | 描述                           |
| --------- | -------------------------------- |
| startShow | 显示组件。                         |
| startHide | 隐藏组件，隐藏动画完成后返回通知。 |


![img](@static/images/uikit/chatroomrn/message_report.png)


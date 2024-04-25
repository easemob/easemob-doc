# 进阶用法

<Toc />

`Chat UIKit SDK` UI 组件库提供主题、国际化、常用 UI 组件等。除提供默认使用方式外，该组件库支持自定义组件样式和行为。

## 入口组件 Container

`Container` 组件提供全局配置和初始化。如果没有使用该组件，则可能导致其它 UI 组件无法正常使用。

`Container` 提供了自定义参数，如下所示：

| 属性               | 类型                   | 是否必填 | 描述                                                                                                         |
| ------------------ | ---------------------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| options            | ChatOptionsType        | 是       | 复合参数集合，和 `ChatOptions` 一致，必填参数只有 `appKey`。      |
| language           | LanguageCode           | 否       | 语言码。指定 UI 组件显示内容的语言。例如：中文、英文。   |
| translateLanguage  | LanguageCode           | 否       | 语言码。指定 消息翻译的目标语言。例如：中文、英文。  |
| palette            | Palette                | 否       | 主题调色板。主题会从调色板中选择颜色和样式搭配组成主题。    |
| theme              | Theme                  | 否       | 主题。默认提供明暗两种主题。  |
| fontFamily         | string                 | 否       | 自定义 UI 组件字体的样式。 |
| emojiFontFamily    | string                 | 否       | 自定义 emoji 表情字体的样式。   |
| headerFontFamily   | string                 | 否       | 自定义 导航栏 字体的样式。   |
| releaseArea        | ReleaseArea            | 否       | 设置发布区域。例如：全球、中国。  |
| formatTime         | object                 | 否       | 会话列表、聊天页面的时间格式化回调通知。如果没有提供则使用默认格式化。   |
| recallTimeout      | number                 | 否       | 回调超时时间。单位为毫秒。默认 120 秒。  |
| group              | object                 | 否       | 创建群组选择成员数的最大数目。默认 1000.     |
| conversationDetail | ConversationDetailType | 否       | 聊天页面的配置集合。详见对应定义。    |
| avatar             | object                 | 否       | 全局头像样式设置。支持边框圆角设置。   |
| input              | object                 | 否       | 全局输入组件样式设置。支持边框圆角设置。|
| alert              | object                 | 否       | 全局警告框组件样式设置。支持边框圆角设置。    |
| onInitLanguageSet  | function               | 否       | 注册语言包的回调通知。可以自定义语言包。   |
| onInitialized      | function               | 否       | 注册初始化完成的回调通知。   |
| onUsersHandler    | function               | 否       | 注册获取用户数据的回调通知。如果用户提供该接口，那么用户的头像和昵称通过该接口获取。如果没有提供则使用默认。 |
| onGroupsHandler   | function               | 否       | 注册获取群组数据的回调通知。如果用户提供该接口，那么群组的头像和昵称通过该接口获取。如果没有提供则使用默认。 |
| onChangeStatus     | function               | 否       | 注册 Presence 状态回调通知。如果用户提供该接口，将收到用户的状态变更通知。  |
| enableTranslate    | boolean                | 否       | 是否启用翻译功能。如果启用，还需要后台开启。     |
| enableThread       | boolean                | 否       | 是否启用话题功能。如果启用，还需要后台开启。       |
| enableReaction     | boolean                | 否       | 是否启用表情回复功能。如果启用，还需要后台开启。  |
| enablePresence     | boolean                | 否       | 是否启用状态订阅功能。如果启用，还需要后台开启。  |
| enableAVMeeting    | boolean                | 否       | 是否启用音视频通话功能。如果启用，还需要后台开启。 默认开启。    |

## Chat SDK 组件 ChatService

`ChatService` 组件是对 `Chat SDK` 的封装，可以简化调用逻辑、返回标准化的结果、触发 UI 变化的事件等。

常用接口包括：登录、登出、添加和删除事件监听、添加和删除 `Chat SDK` 事件监听等。

核心的常用方法定义如下：

| 方法              | 类型     | 描述                                                       |
| ----------------- | -------- | ---------------------------------------------------------- |
| login             | function | 登录。                                                     |
| logout            | function | 登出。                                                     |
| autoLogin         | function | 自动登录。                                                 |
| loginState        | function | 当前登录状态。                                             |
| userId            | get      | 获取当前登录用户 ID。                                      |
| updateDataList | function | 主动更新指定数据的头像和昵称。将触发已加载的 UI 组件刷新。 |

`ChatService` 提供的方法非常多，详见[对应定义](https://github.com/easemob/react-native-chat-library)。

### 监听器

`ChatService` 提供常用监听器 `EventServiceListener` 和 `ConnectServiceListener`。

- `ConnectServiceListener`：接收 SDK 与服务器的连接状态变化的通知。

| 方法           | 描述                                    |
| -------------- | --------------------------------------- |
| onConnected    | 已连接。                                |
| onDisconnected | 断开连接。详见 `DisconnectReasonType`。 |

- `EventServiceListener`：接收指定接口调用的事件变化的通知。

| 方法       | 描述                     |
| ---------- | ------------------------ |
| onBefore   | 接口调用前的通知。       |
| onFinished | 接口调用完成的通知。     |
| onError    | 接口调用发生错误的通知。 |

## 自定义 hooks

以下介绍常见的 hooks。

### useColors

通常配合 `usePaletteContext` 使用，自定义颜色对象，改变组件颜色。

例如：

```tsx
export function SomeView() {
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  return (
    <View
      style={{
        backgroundColor: getColor("bg"),
      }}
    />
  );
}
```

### useDelayExecTask

延迟执行任务。如果在超时发生之前再次调用，则继续延迟，直到超时发生在执行任务。

例如：

```tsx
export function SomeView() {
  const [value, setValue] = React.useState("");
  const { delayExecTask: deferSearch } = useDelayExecTask(
    500,
    React.useCallback((keyword: string) => {
      // 执行搜索
    }, [])
  );
  return (
    <Search
      onCancel={onCancel}
      onChangeText={(v) => {
        setValue(v);
        deferSearch?.(v);
      }}
      value={value}
    />
  );
}
```

### useForceUpdate

`useForceUpdate` 提供强制更新。如果组件没有状态，或者需要手动更新，可以使用该 hook。

例如：

```tsx
export function SomeView() {
  const count = React.useRef(0);
  const { updater } = useForceUpdate();
  return (
    <View style={{ paddingTop: 100, flexGrow: 1 }}>
      <Pressable
        onPress={() => {
          count.current += 1;
          updater();
        }}
      >
        <Text>{"test updater"}</Text>
      </Pressable>
      <Text>{`${count.current}`}</Text>
    </View>
  );
}
```

### useGetStyleProps

`useGetStyleProps` 提供获取组件样式属性。通常和 `getStyleSize` 配合使用。

例如：

```tsx
export function SomeView(props) {
  const { containerStyle } = props;
  const { getStyleSize } = useGetStyleProps();
  const { width: propsWidth } = getStyleSize(containerStyle);
  const { checkType } = useCheckType();
  if (propsWidth) {
    checkType(propsWidth, "number");
  }
  return <View style={{ width: propsWidth }} />;
}
```

### useKeyboardHeight

`useKeyboardHeight` 获取用户的键盘高度。

:::tip
至少需要弹出一次键盘才能获取高度。
:::

### usePermissions

`usePermissions` 请求 UI 组件库需要的权限。

例如：

```tsx
export function SomeView() {
  const { getPermission } = usePermissions();
  React.useEffect(() => {
    getPermission({
      onResult: (isSuccess: boolean) => {
        // 获取权限成功。
      },
    });
  }, [getPermission]);
  return <View />;
}
```

## 事件通知

目前 `Chat UIKit SDK` UI 组件库主要提供两种事件通知方式：

1. SDK 事件通知：`Chat SDK` 转发的事件，侧重于数据变化。

- ConnectServiceListener：监听 SDK 和服务器的连接变化的通知。
- MessageServiceListener：监听消息相关的通知。
- ConversationListener：监听会话相关的通知。
- GroupServiceListener：监听群组相关的通知。
- ContactServiceListener：监听联系人相关的通知。
- PresenceServiceListener：监听用户状态订阅的通知。
- CustomServiceListener：监听自定义的通知。
- MultiDeviceStateListener：监听多设备相关的通知。
- EventServiceListener：监听事件通知，例如，添加好友之前的通知、添加好友成功的通知和添加好友失败的通知。

2. UI 事件通知：应用主动行为触发可能导致列表 item 增加、删除和变更、列表刷新和列表重载。例如，在群详情页面修改了群名称，会话列表组件的页面也会更新。很多情况下，单个界面行可能会导致多个 UI 组件发生的变化。详见 [UIListener](#监听器)。

- UIConversationListListener：监听会话列表的变更的通知。
- UIContactListListener：监听联系人列表的变更的通知。
- UIGroupListListener：监听群组列表的变更的通知。
- UIGroupParticipantListListener：监听群成员列表的变更的通知。
- UINewRequestListListener：监听好友请求列表的变更的通知。

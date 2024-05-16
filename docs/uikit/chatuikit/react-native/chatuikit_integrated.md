# 集成单群聊 UIKit

<Toc />

本文介绍如何将 `Chat UIKit SDK` 集成到现有的项目中。

与快速开始不同，集成单群聊 UIKit 需要应用中使用路由功能实现页面间的切换和跳转。`react-native` 本身没有路由功能，需要使用三方库，推荐 `react-navigation`，该库比 `react-native-navigation` 更流行。

## 前提条件

开始前，确保你的开发环境满足如下条件：

- MacOS 12 或以上版本；
- React Native 0.71 或以上版本；
- NodeJs 16.18 或以上版本；
- 对于 iOS 平台，需要 Xcode 工具，版本建议 14 或以上；
- 对于 Android 平台，需要 Android studio 工具，版本建议 2022 或以上。

## 已有项目

已有项目需要满足一定条件，如果 React Native 版本太低可能会出现编译或者运行问题。如果 Xcode 或者 Android Studio 版本太低，也可能导致编译和运行问题。通常推荐同期的工具和组件，兼容性也是 React Native 常见问题。

## 集成单群聊 UIKit SDK npm 包

`Chat UIKit SDK` npm 包 `react-native-chat-uikit` 需要依赖包，可通过以下代码安装。

你可以通过 `npm ls` 或者 `yarn list` 命令查看依赖关系。

```sh
yarn add @react-native-async-storage/async-storage@^1.17.11 \
@react-native-camera-roll/camera-roll@^5.6.0 \
@react-native-clipboard/clipboard@^1.11.2 \
date-fns@^2.30.0 \
pinyin-pro@^3.18.3 \
pure-uuid@^1.6.3 \
react@18.2.0 \
react-native@0.73.2 \
react-native-agora@^4.2.6 \
react-native-chat-uikit@2.1.0 \
react-native-chat-sdk@1.3.1 \
react-native-audio-recorder-player@^3.5.3 \
@easemob/react-native-create-thumbnail@^1.6.6 \
react-native-device-info@^10.6.0 \
react-native-document-picker@^9.0.1 \
react-native-fast-image@^8.6.3 \
react-native-file-access@^3.0.4 \
react-native-gesture-handler@~2.9.0 \
react-native-get-random-values@~1.8.0 \
react-native-image-picker@^7.0.3 \
react-native-permissions@^3.8.0 \
react-native-safe-area-context@4.5.0 \
react-native-screens@^3.20.0 \
react-native-video@^5.2.1 \
react-native-web@~0.19.6 \
react-native-webview@13.2.2 \
twemoji@>=14.0.2
```

### iOS 平台

更新 iOS 文件夹下 `ProjectName/Info.plist` 文件内容：

在 dict 节点下，追加下面的权限。示例如下：

```xml
<dict>
  <!-- 追加部分开始 -->
        <key>NSCameraUsageDescription</key>
        <string></string>
        <key>NSMicrophoneUsageDescription</key>
        <string></string>
        <key>NSPhotoLibraryUsageDescription</key>
        <string></string>
  <!-- 追加部分结束 -->
</dict>
```

### Android 平台

更新 `AndroidManifest.xml` 文件：

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
</manifest>
```

## 集成 UI 组件

`Chat UIKit SDK` 组件库提供主题、国际化、联系人列表、会话列表和会话详情等页面。这些页面均支持默认设置和自定义设置。

### 初始化

使用任何 UI 组件前，均需初始化。`Container` 组件可以完成全局配置和初始化工作。

例如：

```tsx
function App(): React.JSX.Element {
  return (
    <Container options={{ appKey: "appKey" }}>
      {/* 设置需要添加的组件。例如：会话列表。 */}
    </Container>
  );
}
```

### 设置主题

通过 `Container` 组件提供的属性设置主题，示例代码如下：

```tsx
function App(): React.JSX.Element {
  const palette = usePresetPalette();
  const light = useLightTheme(palette);
  return (
    <Container options={{ appKey: "appKey" }} palette={palette} theme={light}>
      {/* 设置需要添加的组件。例如：会话列表。 */}
    </Container>
  );
}
```

## 设置国际化

通过 `Container` 组件提供的属性设置国际化，示例代码如下：

```tsx
function App(): React.JSX.Element {
  return (
    <Container options={{ appKey: "appKey" }} language={"zh-Hans"}>
      {/* 设置需要添加的组件。例如：会话列表。 */}
    </Container>
  );
}
```

## 使用路由

页面间跳转需要使用路由组件，需要根页面进行设置。将需要跳转的页面都放在组件里面。

例如：

```tsx
function App(): React.JSX.Element {
  return (
    <Container options={{ appKey: "appKey" }}>
      <NavigationContainer>
        <Root.Navigator initialRouteName={"Login"}>
          <Root.Screen name={"Login"} component={LoginScreen} />
          {/* 更多页面组件放在这里 */}
        </Root.Navigator>
      </NavigationContainer>
    </Container>
  );
}
```

## 使用安全区域组件

推荐使用 `SafeAreaView` 组件。该组件确保正确显示需显示的页面，不会和状态栏、底部手势区域重叠。

## 集成会话列表组件

会话列表组件 `ConversationList`。 该组件可以管理会话列表，最近的历史聊天记录都可以在这里找到。

如果想要进行搜索，需要使用 `SearchConversation` 组件，例如：

```tsx
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ConversationListScreen(props: Props) {
  const { navigation } = props;

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <ConversationList
        onClickedSearch={() => {
          // 跳转到搜索页面
          navigation.push("SearchConversation", {});
        }}
        onClickedItem={(data) => {
          // 跳转到会话详情页面
          if (data === undefined) {
            return;
          }
          const convId = data?.convId;
          const convType = data?.convType;
          const convName = data?.convName;
          navigation.push("ConversationDetail", {
            params: {
              convId,
              convType,
              convName: convName ?? convId,
            },
          });
        }}
      />
    </SafeAreaView>
  );
}
```

## 集成联系人列表组件

联系人使用场景非常多。除了显示联系人列表，可以在创建群组、添加群成员等场景使用。

例如：

```tsx
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ContactListScreen(props: Props) {
  const { navigation } = props;

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <ContactList
        contactType={"contact-list"}
        onClickedSearch={() => {
          navigation.navigate("SearchContact", {
            params: { searchType: "contact-list" },
          });
        }}
        onClickedItem={(data) => {
          if (data?.userId) {
            navigation.push("ContactInfo", { params: { userId: data.userId } });
          }
        }}
      />
    </SafeAreaView>
  );
}
```

## 集成聊天页面

聊天页面组件 `ConversationDetail` 可以显示、收发消息、加载历史消息。

例如：

```tsx
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootParamsName, RootScreenParamsList } from "../routes";
type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ConversationDetailScreen(props: Props) {
  const { route } = props;
  const name = route.name as RootParamsName;

  // 必须填写的参数
  const convId = ((route.params as any)?.params as any)?.convId;
  const convType = ((route.params as any)?.params as any)?.convType;

  // 搜索模式
  const messageId = ((route.params as any)?.params as any)?.messageId;

  // 是否是多选模式
  const selectType = ((route.params as any)?.params as any)?.selectType;

  // 话题模式的参数
  const thread = ((route.params as any)?.params as any)?.thread;
  const firstMessage = ((route.params as any)?.params as any)?.firstMessage;

  // 组件模式
  const comType = React.useRef<ConversationDetailModelType>(
    name === "ConversationDetail"
      ? "chat"
      : name === "MessageThreadDetail"
      ? "thread"
      : name === "MessageHistory"
      ? "search"
      : "create_thread"
  ).current;

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <ConversationDetail
        type={comType}
        convId={convId}
        convType={convType}
        msgId={messageId}
        thread={thread}
        firstMessage={firstMessage}
        selectType={selectType}
      />
    </SafeAreaView>
  );
}
```

# 集成单群聊 ChatroomUIKit

利用 ChatroomUIKit，你可以轻松实现聊天室内的用户交互。本文介绍如何实现在聊天室中发送消息。

## 开发环境需求

- MacOS 12 或以上版本
- React-Native 0.71 或以上版本
- NodeJs 20.18 或以上版本
- iOS 平台：Xcode 15 或以上版本
- Android 平台：Android Studio 2022.3 或以上版本

## 开发者账号

有效的环信即时通讯 IM 开发者账号和 [App Key](/product/enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。

## 操作流程

### 第一步 创建项目

如果已经有项目，则跳过此步。

1. 创建项目

```sh
npx @react-native-community/cli@latest init --skip-install --version 0.76 simple_roomkit_demo # 推荐创建稳定版本示例
```

2. 初始化项目

```sh
yarn set version 4.9.1
yarn config set nodeLinker node-modules
yarn
```

### 第二步 集成 ChatroomUIKit

```sh
yarn add react-native-chat-room
```

### 第三步 添加第三方依赖

添加 `ChatroomUIKit` 必须的第三方依赖：

```sh
yarn add react-native-linear-gradient \
react-native-chat-sdk \
react-native-safe-area-context
```

### 第四步 添加权限

添加必要的应用权限。

- iOS 平台

更新 `Info.plist` 文件内容，增加需要的权限。

```xml
<dict>
	<key>NSCameraUsageDescription</key>
	<string></string>
	<key>NSMicrophoneUsageDescription</key>
	<string></string>
	<key>NSPhotoLibraryUsageDescription</key>
	<string></string>
</dict>
```

- Android 平台

更新 `AndroidManifest.xml` 文件内容，增加需要的权限。

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
</manifest>
```

### 第五步 添加代码

```typescript
import * as React from "react";
import {
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Chatroom,
  Container,
  TextInput,
  useRoomContext,
} from "react-native-chat-room";

const appKey = "<your app key>";
const userId = "<current login id>";
const userName = "<current login name>";
const userToken = "<current login token or password>";
const userAvatar = "<current login avatar url>";
const roomId = "<chat room ID>";
const room = {
  roomId: roomId,
  owner: userId,
};

function SendMessage() {
  const [page, setPage] = React.useState(0);
  const [_appKey, setAppKey] = React.useState(appKey);
  const [id, setId] = React.useState(userId);
  const [ps, setPs] = React.useState(userToken);
  const im = useRoomContext();
  const { top } = useSafeAreaInsets();

  if (page === 0) {
    return (
      // Log in page
      <SafeAreaView style={styles.common}>
        <TextInput
          placeholder="Please App Key."
          value={_appKey}
          onChangeText={setAppKey}
        />
        <TextInput
          placeholder="Please Login ID."
          value={id}
          onChangeText={setId}
        />
        <TextInput
          placeholder="Please Login token or password."
          value={ps}
          onChangeText={setPs}
        />
        <Pressable
          style={styles.login}
          onPress={() => {
            // Use a custom avatar and nickname.
            im.login({
              userId: id,
              userToken: ps,
              userNickname: userName,
              userAvatarURL: userAvatar,
              result: (res) => {
                console.log("login result", res);
                if (res.isOk === true) {
                  setPage(1);
                }
              },
            });
          }}
        >
          <Text>{"Login"}</Text>
        </Pressable>
        <Pressable
          style={styles.login}
          onPress={() => {
            im.logout({
              result: () => {},
            });
          }}
        >
          <Text>{"Logout"}</Text>
        </Pressable>
      </SafeAreaView>
    );
  } else if (page === 1) {
    // chat room page
    return (
      <SafeAreaView style={styles.common}>
        <Chatroom
          messageList={{
            props: {
              visible: true,
              reportProps: {
                data: [],
              },
            },
          }}
          input={{
            props: {
              keyboardVerticalOffset: Platform.OS === "ios" ? top : 0,
              after: [],
            },
          }}
          roomId={room.roomId}
          ownerId={room.owner}
          onError={(e) => {
            console.log("ChatroomScreen:onError:", e.toString());
          }}
        >
          <Pressable
            style={[styles.logout, styles.login]}
            onPress={() => {
              setPage(0);
              im.logout({
                result: () => {},
              });
            }}
          >
            <Text>{"log out"}</Text>
          </Pressable>
        </Chatroom>
      </SafeAreaView>
    );
  } else {
    return <View />;
  }
}

function App(): React.JSX.Element {
  // initialize the chat room
  return (
    <Container
      opt={{ appKey: appKey, autoLogin: false, debugModel: true } as any}
    >
      <SendMessage />
    </Container>
  );
}

const styles = StyleSheet.create({
  common: {
    flex: 1,
  },
  logout: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  login: {
    height: 40,
    backgroundColor: "darkseagreen",
    borderColor: "floralwhite",
    borderWidth: 1,
  },
});

export default App;
```

### 第六步 设置配置选项

在 [环信控制台](https://console.easemob.com/) 上获取以下信息，然后设置配置选项。

- 获取 App Key。详见 [查看应用详情文档](/product/enable_and_configure_IM.html#获取环信即时通讯-im-的信息) 
- 创建用户，获取用户 ID 和 token。详见 [创建用户文档](/product/enable_and_configure_IM.html#创建-im-用户)。
- 获取聊天室 ID。详见 [创建聊天室文档](/product/enable_and_configure_IM.html#创建聊天室)。

```tsx
const appKey = "<your app key>";
const userId = "<current login id>";
const userName = undefined;
const userToken = "<current login token or password>";
const userAvatar  = undefined;
const roomId = "<chat room ID>";
```

### 第七步 编译运行

- iOS

1. 安装 pod 依赖：

```sh
cd ios && pod install && cd ..
```

2. 运行项目：

```sh
yarn run ios
```

- Android

```sh
yarn run android
```

### 第八步 发送消息

点击 **Login** 按钮登录进入聊天页面，输入文本消息，然后发送，即可开始聊天。

| 登录            | 发送消息   | 
| :--------------: | :-----: |
| <img src="/images/uikit/chatrn/room_quick_start_login.png" alt="description">  | <img src="/images/uikit/chatrn/room_quick_start_chat.png" alt="description"> | 

## 常见问题

// todo: 请看xx章节或者可以点击链接
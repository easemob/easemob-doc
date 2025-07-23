# 快速开始

利用 `react-native-chat-uikit` 提供的 UI 组件，你可以轻松实现应用内的聊天。本文介绍如何实现在单聊会话中发送消息。

## 前提条件

在集成之前，需要满足以下条件：

1. 有效的环信即时通讯 IM 开发者账号，创建应用并获取 App Key。
2. 在[环信控制台](/product/enable_and_configure_IM/index)[创建两个用户用于聊天](/product/enable_and_configure_IM.html#创建-im-用户)。

## 开发环境需求

- MacOS 12 或以上版本
- React-Native 0.71 或以上版本
- NodeJs 20.18 或以上版本
- iOS 平台：Xcode 15 或以上版本
- Android 平台：Android Studio 2022.3 或以上版本

## 发送消息示例

### 第一步 创建 RN 示例项目

```sh
npx @react-native-community/cli@latest init --skip-install --version 0.76.7 sample_app
```

### 第二步 初始化项目

```sh
yarn set version 4.7.0
yarn config set nodeLinker node-modules
yarn install
```

### 第三步 集成 uikit 到项目

```sh
yarn add @react-native-async-storage/async-storage \
@react-native-camera-roll/camera-roll \
@react-native-clipboard/clipboard \
react-native-audio-recorder-player \
react-native-chat-sdk \
react-native-create-thumbnail \
react-native-device-info \
@react-native-documents/picker \
react-native-chat-uikit \
react-native-fast-image \
react-native-file-access \
react-native-gesture-handler \
react-native-image-picker \
react-native-safe-area-context \
react-native-video
```

### 第四步 配置 iOS

更新 `ios/sample_app/Info.plist` 文件内容，增加需要的权限。

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

构建 native ios 项目

```sh
cd ios && pod install
```

### 第五步 配置 Android

更新 `android/app/src/main/AndroidManifest.xml` 文件内容，增加需要的权限。

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
</manifest>
```

### 第六步 编写代码实现聊天

```typescript
import * as React from "react";
import { Pressable, SafeAreaView, Text, View } from "react-native";
import {
  Container,
  ConversationDetail,
  TextInput,
  useChatContext,
} from "react-native-chat-uikit";

const appKey = "<your app key>";
const userId = "<current login id>";
const userPassword = "<current login password or token>";
const usePassword = true; // or false;
const peerId = "<chat peer id>";

function SendMessage() {
  const [page, setPage] = React.useState(0);
  const [_appKey, setAppKey] = React.useState(appKey);
  const [id, setId] = React.useState(userId);
  const [ps, setPs] = React.useState(userPassword);
  const [peer, setPeer] = React.useState(peerId);
  const im = useChatContext();

  if (page === 0) {
    return (
      // 登录页面
      <SafeAreaView style={{ flex: 1 }}>
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
        <TextInput
          placeholder="Please peer ID."
          value={peer}
          onChangeText={setPeer}
        />
        <Pressable
          onPress={() => {
            im.login({
              userId: id,
              userToken: ps,
              usePassword: usePassword,
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
    // 聊天页面
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ConversationDetail
          convId={peer}
          convType={0}
          onBack={() => {
            setPage(0);
            im.logout({
              result: () => {},
            });
          }}
          type={"chat"}
        />
      </SafeAreaView>
    );
  } else {
    return <View />;
  }
}

export default function App(): React.JSX.Element {
  // 初始化 UIKit
  return (
    <Container options={{ appKey: appKey, autoLogin: false }}>
      <SendMessage />
    </Container>
  );
}
```

### 第七步 运行示例项目

```sh
yarn run ios
# or
yarn run android
```

### 第八步 发送消息

<img src="/images/uikit/chatrn/uikit_quick_start_login.png" alt="description" width="50%">
<img src="/images/uikit/chatrn/uikit_quick_start_chat.png" alt="description" width="50%">

## 常见问题

初始化项目之后找不到 node_modules，怎么办？
- `yarn 4.x.x`： 需要设置使用本地配置 `yarn config set nodeLinker node-modules`。
- `yarn 1.x.x`： 不存在该问题。

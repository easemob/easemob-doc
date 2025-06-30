# 快速开始

利用 ChatroomUIKit，你可以轻松实现聊天室内的用户交互。本文介绍如何实现在聊天室中发送消息。

## 开发环境需求

- MacOS 12 或以上版本
- React-Native 0.71 或以上版本
- NodeJs 20.18 或以上版本
- iOS 平台：Xcode 15 或以上版本
- Android 平台：Android Studio 2022.3 或以上版本

## 开发者账号

- 有效的环信即时通讯 IM 开发者账号和 [App Key](/product/enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。

## 操作流程

### 第一步 创建聊天室和用户

在环信控制台[创建聊天室](/product/enable_and_configure_IM.html#创建聊天室)和[用户](/product/enable_and_configure_IM.html#用户管理)。

### 第二步 创建项目

创建应用：

```sh
npx @react-native-community/cli@latest init --skip-install --version 0.76.7 sample_app
```

初始化项目：

```sh
yarn set version 4.7.0
yarn config set nodeLinker node-modules
yarn install
```

### 第三步 项目中安装 ChatroomUIKit 以及依赖项

进入创建的项目，执行以下命令：

```sh
yarn add react-native-linear-gradient \
react-native-chat-room \
react-native-chat-sdk \
react-native-safe-area-context
```

### 第四步 编写代码实现集成聊天室

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

export default function App(): React.JSX.Element {
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
```

### 第五步 运行示例项目

```sh
yarn run ios
# or
yarn run android
```

### 第六步 发送消息

<img src="/images/uikit/chatrn/room_quick_start_login.png" alt="description" width="50%">

<img src="/images/uikit/chatrn/room_quick_start_chat.png" alt="description" width="50%">

## 常见问题

初始化项目之后找不到 node_modules，怎么办？
- `yarn 4.x.x`： 需要设置使用本地配置 `yarn config set nodeLinker node-modules`。
- `yarn 1.x.x`： 不存在该问题。

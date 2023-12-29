# 快速开始

利用 ChatroomUIKit，你可以轻松实现聊天室内的用户交互。本文介绍如何实现在聊天室中发送消息。

## 前提条件

- MacOS 12 或以上版本；
- React-Native 0.66 或以上版本；
- NodeJs 16.18 或以上版本；
- iOS 应用：Xcode 13 或以上版本以及它的相关依赖工具；
- Android 应用：Android Studio 2021 或以上版本以及它的相关依赖工具；
- 有效的环信即时通讯 IM 开发者账号和 [App Key](/product/enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。

## 操作流程

### 第一步 创建聊天室和用户

在环信控制台[创建聊天室](/product/enable_and_configure_IM.html#创建聊天室)和[用户](/product/enable_and_configure_IM.html#创建-im-用户)。

### 第二步 创建项目

```sh
npx react-native init MyApp --version 0.71.11
```

### 第三步 项目中安装 UIKit

进入创建的项目，执行以下命令：

```sh
npm install react-native-chat-room
# or
yarn add react-native-chat-room
# or
npx expo install react-native-chat-room
```

### 第四步 初始化 ChatroomUIKit

你可以在应用加载时或使用 ChatroomUIKit 之前对其进行初始化。

初始化时，需要填写必要的参数和配置，将 `Container` 放在组件树的根部。

初始化时，需传入 App Key。你可以在[环信即时通讯云控制台](https://console.easemob.com/user/login)的**应用详情**页面查看 App Key。

```tsx
export function App() {
  const appKey = '<your app key>';
  return <Container appKey={appKey}>{/* // todo: 在这里添加组件 */}</Container>;
}
```

### 第五步 登录 ChatroomUIKit

进入聊天室前，需首先通过用户 ID 和用户 Token 登录 ChatroomUIKit。

:::tip
若你已集成了 IM SDK，SDK 的所有用户 ID 均可用于登录 ChatroomUIKit。
:::

为了方便快速体验，你可以在[环信控制台](https://console.easemob.com/user/login)的**应用概览** > **用户认证**页面创建用户并查看用户 token。**用户认证**页面中的用户仅用于快速体验或调试目的。

在开发环境中，你需要在环信控制台[创建 IM 用户](/product/enable_and_configure_IM.html#创建-im-用户)，从你的 App Server 获取用户 token，详见[使用环信用户 token 鉴权](/product/easemob_user_token.html)。

```tsx
// ...
// 获取 IM 服务对象
const im = useRoomContext();
// ...
// 登录服务
// userId 和 userToken 为必填项
im.login({
  userId: '<user ID>',
  userToken: '<user token>',
  userNickname: '<user nick name>',
  userAvatarURL: '<user avatar url>',
  gender: 1,
  identify: '<user custom data>',
  result: ({ isOk, error }) => {
    // todo: isOk === true 用户登录成功
    // todo: isOk === false 用户登录失败
  },
});
```

### 第六步 进入聊天室

进入聊天室前，需要调用 `im.fetchChatroomList` 方法获取要加入的聊天室 ID 以及该聊天室的创建者的用户 ID。

通过加载 `Chatroom` 组件，你会自动加入聊天室，并返回是否成功加入。若该组件加载失败，你可以调用加入聊天室的 API 加入聊天室。

```tsx
// ...
// 创建组件引用对象。
const chatroomRef = React.useRef<Chatroom>({} as any);
// ...
// 关注组件状态变化。
useRoomListener(
  React.useMemo(() => {
    return {
      onError: (params) => {
        // todo: 失败通知处理。错误类型可参考 UIKitError。
        // todo: 例如：被踢出聊天室后，可调用 API 重新加入：chatroomRef.current?.joinRoom({roomId, ownerId}}); 
      },
      onFinished: (params) => {
        // todo: 该通知会包含完成结果。例如：加入聊天室之后收到通知。通知类型可以参考 RoomEventType。
      },
    };
  }, [])
);
// ...
// 加载组件到渲染树。
<Chatroom ref={chatroomRef} roomId={room.roomId} ownerId={room.owner} />;
// ...
```

### 第七步 发送第一条消息  

在屏幕下方输入消息内容，点击 **发送** 按钮，发送消息。

![img](@static/images/uikit/chatroomandroid/click_chat.png =500x500)

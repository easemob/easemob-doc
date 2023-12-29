# 最佳实践

## 初始化 ChatroomUIKit

初始化是使用 ChatroomUIKit 的必要步骤，需在所有接口方法调用前完成。

```tsx
export function App() {
  const palette = usePresetPalette();
  const dark = useDarkTheme(palette);
  const light = useLightTheme(palette);
  const [theme, setTheme] = React.useState(light);
  // const [isReady, setIsReady] = React.useState(false);
  // const fontFamily = 'Twemoji-Mozilla';
  // const [fontsLoaded] = useFonts({
  //   [fontFamily]: require('../assets/twemoji.ttf'),
  // });

  return (
    <Container
      appKey={env.appKey}
      isDevMode={env.isDevMode}
      palette={palette}
      theme={theme}
      roomOption={{
        globalBroadcast: { isVisible: true },
        messageList: {
          isVisibleTag: false,
        },
      }}
      // language={'zh-Hans'}
      languageExtensionFactory={(language) => {
        if (language === "zh-Hans") {
          return createStringSetCn();
        } else {
          return createStringSetEn();
        }
      }}
      // fontFamily={fontFamily}
      onInitialized={() => {
        // todo: ChatroomUIKit 完成初始化的回调通知。
      }}
      avatar={{ borderRadiusStyle: "large", localIcon: a_default_avatar }}
    >
      {/* todo: 添加应用程序代码 */}
    </Container>
  );
}
```

## 登录 ChatroomUIKit

你可以通过使用工程中的用户对象并遵守 `UserInfoProtocol` 协议登录 ChatroomUIKit，示例代码如下：

```tsx
export function LoginScreen(props: Props) {
  const {} = props;
  const im = useRoomContext();
  const [isLoading, setIsLoading] = React.useState(false);
  // ...
  const loginAction = React.useCallback(
    (onFinished: (isOk: boolean) => void) => {
      // ...
      im.login({
        userId,
        userToken: params.token!,
        userNickname: nickName,
        userAvatarURL: avatar,
        result: (params) => {
          if (params.isOk) {
            // todo: 登录成功
          } else {
            // todo: 登录失败
          }
        },
      });
    },
    [im]
  );

  return (
    <View style={{ flex: 1 }}>
      {/* todo: 登录页面代码， 触发登录 loginAction  */}
    </View>
  );
}
```

## 初始化聊天室视图

1. 获取聊天室列表，加入指定的聊天室。除此之外，你还可以在环信即时通讯云控制台上[创建聊天室](/product/enable_and_configure_IM.html#创建聊天室)，获取聊天室 ID。

2. 加载聊天室视图 `Chatroom`，传入的参数包括聊天室 ID、聊天室所有者的用户 ID 及一些选项。

```tsx
export function ChatroomScreen(props: Props) {
  return (
    <View>
      <Chatroom roomId={room.roomId} ownerId={room.owner} {...othersProps} />
    </View>
  );
}
```

## 监听聊天室的事件和错误

你可以调用 `useRoomListener` 方法添加监听器用于监听聊天室的事件和错误。

```tsx
useRoomListener(
  React.useMemo(() => {
    return {
      onError: (params) => {
        // todo: 处理错误通知
      },
      onFinished: (params) => {
        // todo: 操作完成通知
      },
    };
  }, [])
);
```

## 参考

若要了解以上最佳实践的详情，请访问 [GitHub 仓库](https://github.com/AsteriskZuo/react-native-chat-room-demo)。
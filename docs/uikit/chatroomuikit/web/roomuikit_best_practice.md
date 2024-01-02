# 最佳实践

<Toc />

## 初始化

`Chatroom` 和 `ChatroomMember` 组件需要包裹在 `UIKitProvider` 组件内部使用。如果 `UIKitProvider` 在初始化完成前在组件内部使用 `useClient` 获取 SDK，则会获取失败，所以建议将 `UIKitProvider` 放在使用 `Chatroom` 或 `ChatroomMember` 组件的父组件中。

```tsx
// App.ts
// ...
const App = () => {
    return <Chatroom />
}

// idnex.ts
// ...
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <UIKitProvider>
        <App>
    </UIKitProvider>
)
```

## 登录

UIKit 提供两种登录方式：

- 初始化时指定 `userId` 和 `password/token` 进行自动登录。
- 使用 `useClient` 获取 SDK 实例进行手动登录。

```tsx
// 手动登录
// ...
const App = () => {
    const client = useClient()
    const login = () => {
        client.open({
            user: 'userId',
            token: 'token'
        })
    }
    return <Button onClick={login}>登录</Button>
}

// 自动登录
// ...
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <UIKitProvider initConfig={{
        userId: 'userId',
        token: 'token'
    }}>
        <App>
    </UIKitProvider>
)
```

## 参考

若要了解以上最佳实践的详情，请访问 [GitHub 仓库](https://github.com/easemob/ChatroomDemo/tree/dev/WEB/ChatroomDemo)。

# 登录

<Toc />

如果[初始化](chatuikit_integrated.html#第三步-初始化)时设置了用户 ID `userId` 和 `token`，单群聊 UIKit 在 [Provider](chatuikit_provider.html) 加载完成时会自动登录，在 Provider 被卸载时会自动登出。

```javascript
import { UIKitProvider } from "easemob-chat-uikit";

const App = () => {
  return (
    <UIKitProvider
      initConfig={{
        appKey: "",
        userId: "",
        token: "",
      }}
    ></UIKitProvider>
  );
};
```

若要手动登录登出，你可以获取即时通讯 IM SDK connection 实例，然后[调用 SDK 的 API 进行登录登出](/document/web/overview.html#手动登录)。

```javascript
import { useClient } from "easemob-chat-uikit";

const ChatApp = () => {
  const client = useClient();
  const login = () => {
    client.open({
      user: "userId",
      token: "chat token",
    });
  };
  const logout = () => {
    client.close();
  };
  return (
    <div>
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

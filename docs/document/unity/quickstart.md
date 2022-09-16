# 环信即时通讯 IM 快速开始

<Toc />

本文介绍如何快速集成环信即时通讯 IM Unity SDK 实现发送和接收单聊文本消息。

## 技术原理

下图展示在客户端发送和接收单聊文本消息的工作流程。

![img](@static/images/android/sendandreceivemsg.png)

如上图所示，发送和接收单聊消息的步骤如下：

1. 客户端向你的应用服务器请求 Token，你的应用服务器返回 Token。
2. 客户端 A 和客户端 B 使用获得的 Token 登录环信即时通讯系统。
3. 客户端 A 发送消息到环信即时通讯服务器。
4. 环信即时通讯服务器将消息发送到客户端 B，客户端 B 接收消息。

## 前提条件

开始前，请确保你的开发环境满足以下条件：

- Unity Editor 2019.4.28 或以上版本
- Unity SDK 1.0.5 或以上
- 目前 Unity SDK 仅支持 x86 指令集及 Intel 芯片。
- 操作系统与编译器要求：

| 开发平台                | 操作系统版本    | 编译器版本                                                         |
| :-------------------- | :------ | :----------------------------------------------------------- |
| Android                  | Android 5.0 或以上  | Android Studio 3.0 或以上                                    |
| iOS                | iOS 10 或以上 | Xcode 建议最新版本    |
| macOS        | macOS 10.0 或以上  |  Xcode 9.0 或以上，Visual Studio for Mac 2019 或以上   |
| Windows              | Windows 10 或以上 | Microsoft Visual Studio 2019 或以上            |

- 有效的环信即时通讯 IM 开发者账号和 App Key，见 [环信即时通讯云管理后台](https://console.easemob.com/user/login)。
- 如果你的网络环境部署了防火墙，请联系环信技术支持设置白名单。

## 项目设置

实现发送和接收单聊文本消息之前，参考以下步骤设置你的项目。

### 1. 下载并设置 Unity Demo 项目

参考以下步骤：

1. 克隆 [chat_unity_demo](https://github.com/easemob/chat_unity_demo) 至本地。
2. 打开 Unity Hub，选择 **Projects** 页签，点击 **Open** 右边的下拉菜单，选择 **Add project from disk**，然后选择步骤 1 中本地路径下的 `chat_unity_quickstart`。这时，**Projects** 列表中显示 **chat_unity_quickstart** 项目。
3. 单击 **chat_unity_quickstart** 打开项目。

   如果正常打开，该流程结束。

  :::notice
   如果 Demo 项目与本地 Unity Editor 版本不一致，你需要进行以下操作：

   1. 在弹出的 **Editor version not installed** 提示框下方，选择 **Choose another Editor version**。

   2. 在弹出的 **Select Editor version and platform** 窗口中，选择本地安装的 Editor 版本，并根据后续提示打开项目。
   :::

### 2. 集成环信即时通讯 SDK

你可以参考以下步骤集成 SDK：

1. 在 [Unity 项目](https://github.com/easemob/emclient-unity) 页面点击 **下载 Unity SDK**，获取最新版的环信即时通讯 IM Unity SDK（`hyphenateCWrapper.unitypackage`）。
2. 在 Unity Editor 中，选择 **Assets > Import Package > Custom Package...**，然后选择刚下载的 `hyphenateCWrapper.unitypackage` 导入。
3. 在弹出的 **Import Unity Package** 页面，点击右下角的 **Import**。

## 实现发送和接收单聊消息

本节介绍如何使用即时通讯 SDK 在你的 unity 项目中实现发送和接收单聊消息。

### 1. 打开代码文件进行编辑

在 Unity Editor 中左侧导航栏下方，选择 **Project** 页签，然后选择 **Assets** 目录下的 **Scripts** 目录，双击 **TestCode.cs** 文件打开 Visual Studio。

:::notice
如果双击 **TestCode.cs** 文件无法打开 Visual Studio 开发环境，需将 Visual Studio 配置为 Unity 的外部工具：点击左上角的 Unity 菜单（Windows 为 **Edit**，Mac 为 **Unity**），依次选择 **Preference > External Tools > External Script Editor**，将脚本编辑器设置为 Visual Studio。
:::

以下代码编辑操作均在 Visual Studio 中进行。

### 2. 添加命名空间

在 **TestCode.cs** 头部添加以下命名空间：

```csharp
using ChatSDK;
using ChatSDK.MessageBody;
```

### 3. 初始化 SDK

在 `InitSDK` 方法中添加以下代码完成 SDK 初始化：

```csharp
var options = new Options(appKey: APPKEY);
SDKClient.Instance.InitWithOptions(options);
```

将 APPKEY 替换为 `easemob-demo#easeim`。本项目用于演示目的，在正式环境中，请使用你在环信控制台申请的 App Key。

### 4. 创建账号

在 `SignUpAction` 方法尾部添加以下代码，创建即时通讯系统的登录账户，示例代码如下：

```csharp
SDKClient.Instance.CreateAccount(username: Username.text, Password.text, handle: new CallBack(
  onSuccess: () => {
    AddLogToLogText("sign up sdk succeed");
  },
  onError: (code, desc) => {
    AddLogToLogText($"sign up sdk failed, code: {code}, desc: {desc}");
  }
));
```

:::notice
该注册模式在客户端实现，简单方便，主要用于测试，但不推荐在正式环境中使用。正式环境中应使用服务器端调用 Restful API 进行注册，详见 [注册单个用户](/document/server-side/account_system.html#注册单个用户)。
:::

### 5. 登录账号

在 `SignInAction` 方法尾部添加以下代码，使用账号登录即时通讯系统，示例代码如下：

```csharp
SDKClient.Instance.Login(username: Username.text, pwdOrToken: Password.text, handle: new CallBack(
  onSuccess: () => {
    AddLogToLogText("sign in sdk succeed");
  },
  onError:(code, desc) => {
    AddLogToLogText($"sign in sdk failed, code: {code}, desc: {desc}");
  }
));
```

### 6. 登出账号

在 `SignOutAction` 方法尾部添加以下代码，登出即时通讯系统，示例代码如下：

```csharp
SDKClient.Instance.Logout(true, handle: new CallBack(
  onSuccess: () => {
    AddLogToLogText("sign out sdk succeed");
  },
  onError: (code, desc) => {
    AddLogToLogText($"sign out sdk failed, code: {code}, desc: {desc}");
  }
));
```

### 7.发送一条文本消息

在 `SendMessageAction` 方法尾部添加以下代码，创建和发送一条文本消息，示例代码如下：

```csharp
Message msg = Message.CreateTextSendMessage(SignChatId.text, MessageContent.text);
SDKClient.Instance.ChatManager.SendMessage(ref msg, new CallBack(
  onSuccess: () => {
    AddLogToLogText($"send message succeed, receiver: {SignChatId.text},  message: {MessageContent.text}");
  },
  onError:(code, desc) => {
    AddLogToLogText($"send message failed, code: {code}, desc: {desc}");
  }
));
```

### 8.接收消息

接收消息需要对象继承 `IChatManagerDelegate` 并实现相关的回调方法，同时将对象加入到监听列表中。

示例代码如下：

在类声明的头部继承 `IChatManagerDelegate` 对象。

```csharp
public class TestCode : MonoBehaviour, IChatManagerDelegate

```

在 `TestCode` 类内部添加以下回调方法。

由于这里只测试消息接收回调，所以其他回调暂时无需实现，保留空函数即可。

```csharp
public void OnMessagesReceived(List<Message> messages)
{
    foreach (Message msg in messages) {
        if (msg.Body.Type == MessageBodyType.TXT)
        {
            TextBody txtBody = msg.Body as TextBody;
            AddLogToLogText($"received text message: {txtBody.Text}, from: {msg.From}");
        }
        else if (msg.Body.Type == MessageBodyType.IMAGE)
        {
            ImageBody imageBody = msg.Body as ImageBody;
            AddLogToLogText($"received image message, from: {msg.From}");
        }
        else if (msg.Body.Type == MessageBodyType.VIDEO) {
            VideoBody videoBody = msg.Body as VideoBody;
            AddLogToLogText($"received video message, from: {msg.From}");
        }
        else if (msg.Body.Type == MessageBodyType.VOICE)
        {
            VoiceBody voiceBody = msg.Body as VoiceBody;
            AddLogToLogText($"received voice message, from: {msg.From}");
        }
        else if (msg.Body.Type == MessageBodyType.LOCATION)
        {
            LocationBody localBody = msg.Body as LocationBody;
            AddLogToLogText($"received location message, from: {msg.From}");
        }
        else if (msg.Body.Type == MessageBodyType.FILE)
        {
            FileBody fileBody = msg.Body as FileBody;
            AddLogToLogText($"received file message, from: {msg.From}");
        }
    }
}

public void OnCmdMessagesReceived(List<Message> messages)
{

}

public void OnMessagesRead(List<Message> messages)
{

}

public void OnMessagesDelivered(List<Message> messages)
{

}

public void OnMessagesRecalled(List<Message> messages)
{

}

public void OnReadAckForGroupMessageUpdated()
{

}

public void OnGroupMessageRead(List<GroupReadAck> list)
{

}

public void OnConversationsUpdate()
{

}

public void OnConversationRead(string from, string to)
{

}

public MessageReactionDidChange(List<MessageReactionChange> list)
{
}
```

在 `AddChatDelegate` 方法中添加以下代码，将 `TestCode` 对象实例加入监听列表。

```csharp
SDKClient.Instance.ChatManager.AddChatManagerDelegate(this);
```

在 `RemoveChatDelegate` 方法中添加以下代码，在对象释放时将其在监听列表中移除。

```csharp
SDKClient.Instance.ChatManager.RemoveChatManagerDelegate(this);
```

## 运行和测试项目

在 Unity Editor 的左侧导航栏下方，点击 **Project** 页签，选择 **Assets** 下的 **Scenes** 目录，双击右侧的 **SampleScene** 场景，然后点击 Unity Editor 上方的 Play 按钮运行场景。

![图片](@static/images/unity/unity-running.png)

:::notice
若未安装 iOS Build Support，运行项目前，将 `Assets/ChatSDK/Scripts/Editor` 路径下的 `iOSBuildSetting.cs` 文件移除项目文件夹。

1. 注册用户：在 **user id** 文本框中输入用户 ID，在 **password** 文本框中输入密码，点击 **Sign up** 进行用户注册。注册结果会在下方显示。可创建两个用户，例如 **quickstart_sender** 和 **quickstart_receiver**，分别用于发送和接收消息。
2. 用户登录：在 **user id** 文本框中输入用户 ID，例如 **quickstart_sender**，在 **password** 文本框中输入密码，点击 **Sign in** 进行登录。登录结果会在下方显示。
3. 发送消息：在 **single chat id** 文本框中输入消息接收方的用户 ID，例如 **quickstart_receiver**，在 **message content** 文本框中输入要发送的文本内容，如 **how are you.**，点击 **Send**  发送消息，消息发送结果会在下方显示。
4. 退出登录：直接点击 **Sign out** 退出登录，退出结果会在下方显示。
5. 接收消息：在 **user id** 文本框中输入接收消息的用户 ID，例如 **quickstart_receiver**，在 **password** 文本框输入密码，点击 **Sign in** 进行登录。登录成功后，下方会显示收到的消息，例如步骤 3 中发送的 ''how are you.''。
:::

## 后续步骤

文中示例仅作为演示和测试用途。在生产环境中，为保障通信安全，你需要自行部署服务器签发 Token，详见 [使用 User Token 鉴权](/document/server-side/easemob_user_token.html)。
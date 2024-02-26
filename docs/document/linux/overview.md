# Linux SDK 集成说明

------

环信 IM Linux SDK 是为在 Linux 及嵌入式设备中集成 IM 功能提供的 SDK，用户可以用 SDK 收发消息，目前支持文本消息、图片、语音、位置等消息以及透传消息，目前为测试版，已经可以应用在 Linux、Mac 及树莓派平台上。

## 集成准备

获取环信 IM Linux SDK，SDK 中包含如下文件：

- libeasemob_v0.1.a
- include
- doc
- demo

libeasemob_v0.1.a 是 SDK 静态库文件，include 目录包含 sdk 的头文件，doc 目录包含对 sdk 的详细说明，demo 包含使用 SDK 的 demo 程序。

## 集成示例

### 获取 EMChatClient

EMChatClient 是 IM 服务的入口，可以直接调用 EMChatClient 的入口，也可以通过 EMChatClient 获得相应 EMContactManager、EMChatManager 进行相应的操作。

```
#include "emchatclient.h" 
... 
using namespace easemob; 

EMChatClient::EMChatConfigs configs(resourcePath, workPath, "easemob-demo#chatdemoui"); 
chatClient = EMChatClient::create(configs);
```

### 注册及登录

调用 chatclient 的 register()、login() 接口可以实现注册，登录功能。

```
easemob::EMErrorPtr result = chatClient->register("test01", "test02");
if(result->mErrorCode == EMError::NO_ERROR) { 
    cout << "login success" << endl; 
} else { 
    cout << result->mDescription << endl; 
}
```

登录的示例

```
easemob::EMErrorPtr result = chatClient->login("test01", "test02");
if(result->mErrorCode == EMError::NO_ERROR) { 
    cout << "login success" << endl; 
} else { 
    cout << result->mDescription << endl; 
}
```

注意：register()、login() 是需要与后台服务器通讯的操作，可能需要一定时间，如果程序想同时显示 UI 的话，需要放在单独线程中处理。

### 添加好友

管理好友的操作需要通过 EMChatManager 进行。

```
chatClient->getContactManager().inviteContact("contact01", "hi, contact01");
```

添加好友需要等待对方的确认，也可以由程序设置成自动接受好友邀请。

### 与好友聊天

接收消息需要实现 EMChatManagerListener 的 onReceiveMessage() 方法并且注册该 listener。

```
class Chat : public easemob::EMChatManagerListener { 
    void onReceiveMessage(const easemob::EMMessagePtr message); 
} 

chatClient->getChatManager().addListener(this);
```

发送消息需要创建 EMMessage 实例，目前支持文本、图片、音频文件等消息类型。

```
EMTextMessageBody* body = new EMTextMessageBody("How are you, du");
easemob::EMMessagePtr msg = EMMessage::createSendMessage(loginUser, to, body);
easemob::EMCallbackPtr callback(new easemob::EMCallback(mHandle,
    [=]()->bool{ 
        window_->AddOutput("Msg send success"); 
        return true; 
    }, 
    [=](const easemob::EMErrorPtr error)->bool{ 
         window_->AddOutput( "Send message failed: " + error->mDescription); 
         return true; 
    }));
 
chatClient->getChatManager().sendMessage(msg, callback);
```

请注意 callback 的定义，为了能够获知 callback 的拥有者是否仍然存在，需要在您的类中定义'EMCallbackObserverHandle'。

```
easemob::EMCallbackObserverHandle mHandle;
```

具体接口说明及使用可以参考 SDK 中的文档和 demo 程序。
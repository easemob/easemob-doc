# 快速开始

<Toc />

本文介绍如何极简集成环信即时通讯 React-Native SDK，在你的 app 中实现发送和接收单聊文本消息。

## 实现原理

下图展示在客户端发送和接收一对一文本消息的工作流程。

![img](/images/android/sendandreceivemsg.png)

## 前提条件

集成前请确认 app 的开发和运行环境满足以下要求。以下以本文使用的 React Native 0.83.2 为基准，需使用新架构；这些要求不代表 SDK 在所有 React Native 版本下的最低环境要求。

对于 iOS 平台：

- macOS、Xcode 及命令行工具，版本满足 React Native 0.83.2 的构建要求
- React Native 0.83.2，使用新架构
- 推荐 Node.js 24 LTS，包含 npm 包管理工具
- Ruby、Bundler 和 CocoaPods 包管理工具
- Yarn 编译运行工具
- Watchman 调试工具
- 运行环境真机或模拟器 iOS 15.1 或以上版本

对于 Android 平台：

- macOS 或 Windows，版本满足 React Native 0.83.2 的构建要求
- Android Studio 及 Android SDK、NDK、CMake 构建工具，版本与 React Native 0.83.2 工程匹配；JDK 17 或以上版本
- React Native 0.83.2，使用新架构
- 如果用 Windows 开发，需要 Powershell 5.1 或以上版本
- 推荐 Node.js 24 LTS，包含 npm 包管理工具
- Yarn 编译运行工具
- Watchman 调试工具（macOS 下可选）
- 运行环境真机或模拟器 Android 7.0（API 24）或以上版本

配置开发或者运行环境如果遇到问题，请参考 [React Native 官网](https://reactnative.dev/)。

### 其他要求

有效的环信即时通讯 IM 开发者账号和 App key，详见 [环信控制台文档](/product/console/app_manage.html#管理应用)。

## 项目设置

创建一个 React Native 项目，集成 IM SDK：

1. 根据开发系统和目标平台准备开发环境；
2. 打开终端，进入需要创建项目的目录，输入命令创建 React Native 项目：

```sh
npx @react-native-community/cli@latest init --version "0.83.2" simple_demo # 推荐创建稳定版本示例
```

创建好的项目名称是 `simple_demo`。

初始化项目如下：

```sh
cd simple_demo
yarn set version 1.22.19
yarn
```

也可以使用 npm 等其他工具。

3. 在终端命令行，输入以下命令添加依赖:

```sh
yarn add react-native-chat-sdk
```

4. native 部分初始化

iOS 平台需要使用 `cocoapods` 进行初始化。以下命令通过 CocoaPods 安装原生依赖，该方式在 SDK 5.x 中仍受支持；如需使用推荐的 SPM 方式，请参见 [添加依赖](integration.html#ios-原生依赖)。

```sh
bundle install
cd ios && bundle exec pod install && cd ..
```

## 创建用户

在 [环信控制台](https://console.easemob.com/user/login) 创建用户，获取用户 ID 和用户 token 用于登录。详见 [创建用户文档](/product/console/operation_user.html#创建用户)。

在生产环境中，为了安全考虑，你需要在你的应用服务器集成 [获取 App Token API](/document/server-side/easemob_app_token.html) 和 [获取用户 Token API](/document/server-side/easemob_user_token.html) 实现获取 Token 的业务逻辑，使你的用户从你的应用服务器获取 Token。

## 实现发送和接收单聊消息

建议使用 `visual studio code` 打开文件夹 `simple_demo`，将默认生成的 `App.tsx` 重命名为 `App.js`（已有 `App.js` 时直接使用），删除全部内容，并添加如下内容:

等待日志显示 `init success` 后再登录，显示 `onConnected` 后再发送消息。发送是否成功以 `onSuccess` 或 `onError` 回调为准，`ChatManager#sendMessage` 返回的 Promise 正常结束不表示消息已发送成功。Token 即将过期时，需从业务服务器获取新 Token 并调用 `ChatClient#renewToken`；Token 已过期时，需获取有效 Token 后重新登录，详见 [登录](login.html)。

```javascript

// Import depend packages.
import React, {useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  ChatClient,
  ChatOptions,
  ChatMessageChatType,
  ChatMessage,
} from 'react-native-chat-sdk';

// Defines the App object.
const App = () => {
  // Defines the variable.
  const title = 'ChatQuickstart';
  // Replaces <your appKey> with your app key.
  const appKey = '<your appKey>';
  // Replaces <your userId> with your user ID.
  const [username, setUsername] = React.useState('<your userId>');
  // Replaces <your token> with your token.
  const [chatToken, setChatToken] = React.useState('<your token>');
  const [targetId, setTargetId] = React.useState('');
  const [content, setContent] = React.useState('');
  const [logText, setWarnText] = React.useState('Show log area');
  const chatClient = ChatClient.getInstance();
  const chatManager = chatClient.chatManager;


  // Outputs console logs.
  useEffect(() => {
    logText.split('\n').forEach((value, index, array) => {
      if (index === 0) {
        console.log(value);
      }
    });
  }, [logText]);

  // Outputs UI logs.
  const rollLog = text => {
    setWarnText(preLogText => {
      let newLogText = text;
      preLogText
        .split('\n')
        .filter((value, index, array) => {
          if (index > 8) {
            return false;
          }
          return true;
        })
        .forEach((value, index, array) => {
          newLogText += '\n' + value;
        });
      return newLogText;
    });
  };

  useEffect(() => {
    let active = true;
    // Registers listeners for messaging.
    const msgListener = {
      onMessagesReceived(messages) {
        for (let index = 0; index < messages.length; index++) {
          rollLog('received msgId: ' + messages[index].msgId);
        }
      },
      onCmdMessagesReceived: messages => {},
      onMessageReadReceipts: receipts => {},
      onMessagesDelivered: messages => {},
      onMessagesRecalledInfo: messages => {},
      onConversationsUpdate: () => {},
    };

    const listener = {
      onTokenWillExpire() {
        rollLog('token will expire; renew it with a new token.');
      },
      onTokenDidExpire() {
        rollLog('token did expire; log in again with a valid token.');
      },
      onConnected() {
        rollLog('onConnected');
      },
      onDisconnected(errorCode) {
        rollLog('onDisconnected:' + (errorCode ?? 'unknown'));
      },
    };

    // Initializes the SDK.
    // 先初始化 SDK，再调用登录等接口
    const init = () => {
      let o = ChatOptions.withAppKey({
        appKey: appKey,
      });
      chatClient
        .init(o)
        .then(() => {
          if (!active) return;
          rollLog('init success');
          // 初始化完成后注册一次监听器，重连时不重复注册
          chatManager.addMessageListener(msgListener);
          chatClient.addConnectionListener(listener);
        })
        .catch(error => {
          if (!active) return;
          rollLog(
            'init fail: ' +
              (error instanceof Object ? JSON.stringify(error) : error),
          );
        });
    };

    init();
    return () => {
      active = false;
      // 组件卸载时移除同一个监听器，不影响其他模块
      chatManager.removeMessageListener(msgListener);
      chatClient.removeConnectionListener(listener);
    };
  }, [chatClient, chatManager, appKey]);

  // Logs in with an account ID and a token.
  const login = () => {
    rollLog('start login ...');
    chatClient
      .loginWithToken(username, chatToken)
      .then(() => {
        rollLog('login operation success.');
      })
      .catch(reason => {
        rollLog('login fail: ' + JSON.stringify(reason));
      });
  };

  // Logs out from server.
  const logout = () => {
    rollLog('start logout ...');
    chatClient
      .logout()
      .then(() => {
        rollLog('logout success.');
      })
      .catch(reason => {
        rollLog('logout fail:' + JSON.stringify(reason));
      });
  };

  // Sends a text message to somebody.
  const sendmsg = () => {
    let msg = ChatMessage.createTextMessage(
      targetId,
      content,
      ChatMessageChatType.PeerChat,
    );
    const callback = new (class {
      onProgress(locaMsgId, progress) {
        rollLog(`send message process: ${locaMsgId}, ${progress}`);
      }
      onError(locaMsgId, error) {
        rollLog(`send message fail: ${locaMsgId}, ${JSON.stringify(error)}`);
      }
      onSuccess(message) {
        rollLog('send message success: ' + message.localMsgId);
      }
    })();
    rollLog('start send message ...');
    chatClient.chatManager
      .sendMessage(msg, callback)
      .then(() => {
        rollLog('send request submitted: ' + msg.localMsgId);
      })
      .catch(reason => {
        rollLog('send fail: ' + JSON.stringify(reason));
      });
  };

  // Renders the UI.
  return (
    <SafeAreaView>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <ScrollView>
        <View style={styles.inputCon}>
          <TextInput
            multiline
            style={styles.inputBox}
            placeholder="Enter username"
            onChangeText={text => setUsername(text)}
            value={username}
            autoCapitalize={'none'}
          />
        </View>
        <View style={styles.inputCon}>
          <TextInput
            multiline
            style={styles.inputBox}
            placeholder="Enter chatToken"
            onChangeText={text => setChatToken(text)}
            value={chatToken}
            autoCapitalize={'none'}
          />
        </View>
        <View style={styles.buttonCon}>
          <Text style={styles.eachBtn} onPress={login}>
            SIGN IN
          </Text>
          <Text style={styles.eachBtn} onPress={logout}>
            SIGN OUT
          </Text>
        </View>
        <View style={styles.inputCon}>
          <TextInput
            multiline
            style={styles.inputBox}
            placeholder="Enter the username you want to send"
            onChangeText={text => setTargetId(text)}
            value={targetId}
            autoCapitalize={'none'}
          />
        </View>
        <View style={styles.inputCon}>
          <TextInput
            multiline
            style={styles.inputBox}
            placeholder="Enter content"
            onChangeText={text => setContent(text)}
            value={content}
            autoCapitalize={'none'}
          />
        </View>
        <View style={styles.buttonCon}>
          <Text style={styles.btn2} onPress={sendmsg}>
            SEND TEXT
          </Text>
        </View>
        <View>
          <Text style={styles.logText}>{logText}</Text>
        </View>
        <View>
          <Text style={styles.logText}>{}</Text>
        </View>
        <View>
          <Text style={styles.logText}>{}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Sets UI styles.
const styles = StyleSheet.create({
  titleContainer: {
    height: 60,
    backgroundColor: '#6200ED',
  },
  title: {
    lineHeight: 60,
    paddingLeft: 15,
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  inputCon: {
    marginLeft: '5%',
    width: '90%',
    height: 60,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  inputBox: {
    marginTop: 15,
    width: '100%',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonCon: {
    marginLeft: '2%',
    width: '96%',
    flexDirection: 'row',
    marginTop: 20,
    height: 26,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  eachBtn: {
    height: 40,
    width: '28%',
    lineHeight: 40,
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    backgroundColor: '#6200ED',
    borderRadius: 5,
  },
  btn2: {
    height: 40,
    width: '45%',
    lineHeight: 40,
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    backgroundColor: '#6200ED',
    borderRadius: 5,
  },
  logText: {
    padding: 10,
    marginTop: 10,
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default App;
```

## 编译和运行项目

编译运行 iOS 平台应用:

```sh
yarn run ios
```

编译运行 Android 平台应用:

```sh
yarn run android
```

运行调试服务:

```sh
yarn run start
```

下图为 Android 和 iOS 平台的效果展示：

| Android        | iOS   | 
| :--------- | :----- |
| <img src=/images/react-native/android-1.png  width="300" height="700"/>      |  <img src=/images/react-native/ios-1.png  width="300" height="700"/>  | 

## 测试你的 app

使用已在环信控制台创建的账号，参考以上示例测试登录、发送和接收消息。

1. 日志显示 `init success` 后，输入用户名和 token，点击 **SIGN IN**；显示 `onConnected` 后即可发送消息。
2. 在另外设备可以登录另外一个用户。
3. 第一个用户，填写接收方用户 ID、编辑消息并点击 **SEND TEXT**，第二个用户将接收消息。

_同时，你可以在下方查看日志，检查登录、发送和接收消息是否成功。_

## 更多操作

在生产环境中，为了安全考虑，你需要在你的应用服务器集成[获取 App Token API](/document/server-side/easemob_app_token.html) 和[获取用户 Token API](/document/server-side/easemob_user_token.html) 实现获取 Token 的业务逻辑，使你的用户从你的应用服务器获取 Token。

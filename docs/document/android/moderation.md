# 消息审核（举报）

<Toc />

即时通讯 IM SDK 提供消息举报接口。你的用户可以在客户端举报违规消息。当服务器收到举报消息后，会将举报消息存储到数据库，并在[环信即时通讯云控制台](https://console.easemob.com/user/login)展示。你可在环信即时通讯云控制台查看举报记录，并进行相应处理。

:::tip
1. 使用前，你需要在[环信即时通讯云控制台](https://console.easemob.com/user/login) 开通该功能。
2. 消息举报功能与内容审核功能为两个独立的功能，没有任何关联，因此使用该功能无需提前开通内容审核功能。
:::

关于如何开通消息举报和查看举报记录，详见[环信即时通讯云控制台文档说明](/product/enable_and_configure_IM.html#消息举报)。

## 技术原理

环信即时通讯 IM Android SDK 通过 [EMChatManager](https://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_chat_manager.html) 类实现举报违规消息功能：

- `EMChatManager#reportMessage`：举报违规消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 已在 [环信即时通讯云控制台开通消息举报功能](/product/enable_and_configure_IM.html#消息举报)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

举报违规消息的示例代码如下：

```java
EMClient.getInstance().chatManager().asyncReportMessage(msgid, tag, reason, new EMCallBack() {
    @Override
    public void onSuccess() {
    }

    @Override
    public void onError(int code, String error) {
    }

    @Override
    public void onProgress(int progress, String status) {
    }
});
```

该方法传入的参数描述如下表所示：

| 参数       | 类型   | 描述 | 
| :--------- | :----- | :------- | 
| `msgid`     | String | 要举报的消息 ID。 | 
| `tag` | String | 非法消息的标签。你需要自定义标签，例如**涉政**或**广告**。该字段对应环信即时通讯云控制台的消息举报记录页面的**词条标记**字段。 | 
| `reason` | String | 举报原因。你需要自行填写举报原因，最长不能超过 512 字节。该字段对应环信即时通讯云控制台的消息举报记录页面的**举报原因**字段。 |

要在[环信即时通讯云控制台](https://console.easemob.com/user/login)上查询消息举报页面，需在首页选择应用，点击**操作**一栏中的**管理**，选择**即时通讯 > 内容审核 > 消息举报**。

![img](/images/android/message_report.png)

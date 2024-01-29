# 消息审核（举报）

<Toc />

即时通讯 IM SDK 提供消息举报接口。开发者可以在客户端调用该接口举报违规消息。当服务器端审核服务收到举报消息后，会将举报消息存储到数据库，并在 Console 展示。审核员可在 Console 查看举报记录，并进行相应处理。

## 技术原理

环信即时通讯 IM SDK 提供 `ReportMessage` 方法实现举报违规消息功能。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 开通消息审核服务，详见管理后台。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

举报违规消息的示例代码如下：

```csharp
// msgId：要举报的消息 ID。
// tag：非法消息的标签。你需要自定义标签，例如`涉政`或`广告`。该字段对应环信即时通讯云控制台的消息举报记录页面的`词条标记`字段。
// reason：举报原因。你需要自行填写举报原因，最长不能超过 512 字节。该字段对应环信即时通讯云控制台的消息举报记录页面的`举报原因`字段。
SDKClient.Instance.ChatManager.ReportMessage(msgId, tag, reason, new CallBack(
    onSuccess: () =>
    {
        Debug.Log($"ReportMessage success.");
    },
    onError: (code, desc) =>
    {
        Debug.Log($"ReportMessage failed, code:{code}, desc:{desc}");
    }
));
```
# 消息审核（举报）

<Toc />

## 功能描述

新增消息举报接口，SDK 可以调用该接口举报对应消息。当服务器端审核服务收到举报消息后，会将举报消息存储到数据库，并提供接口供 Console 后台搜索展示。审核员可以对举报记录进行相应处理。

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
// tag：非法消息的标签，可传入`涉政`、`涉黄`、`广告`、`辱骂`、`暴恐`、`违禁`或`其他`。
// reason：举报原因。具体原因需自行填写。
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
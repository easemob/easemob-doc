# 消息举报

<Toc />

环信即时通讯 IM SDK 提供消息举报接口。开发者可以在客户端调用该接口举报违规消息。当服务器端审核服务收到举报消息后，会将举报消息存储到数据库，并在环信即时通讯 IM Console 展示。审核员可在环信即时通讯 IM Console 查看举报记录，并进行相应处理。

## 技术原理

环信即时通讯 IM React Native SDK 提供 `reportMessage` 方法实现举报违规消息功能。

## 前提条件

开始前，请确保满足以下条件：

1. 完成 SDK 初始化，详见 [快速开始](quickstart.html) 及 [SDK 集成概述](overview.html)。
2. 了解环信即时通讯 IM API 的 [使用限制](/product/limitation.html)。
3. 在 [环信即时通讯 IM 管理后台](https://console.easemob.com/app/im-service/func/function-config) 开通消息审核服务。

## 实现方法

举报违规消息的示例代码如下：

```typescript
// msgId: 将要上报的消息 ID
// tag: 指定上报消息的分类标签
// reason: 上报的具体原因
ChatClient.getInstance()
  .chatManager.reportMessage(msgId, tag, reason)
  .then((result) => {
    console.log("success: ", result);
  })
  .catch((error) => {
    console.log("fail: ", error);
  });
```
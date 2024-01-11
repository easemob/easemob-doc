# 更新消息

<Toc />

本文介绍环信即时通讯 IM Flutter SDK 如何更新本地消息。

## 技术原理

环信即时通讯 IM Flutter SDK 支持更新本地数据库中的消息，其中包含如下主要方法：

- `EMChatManager#updateMessage`：更新消息到本地数据库。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 更新消息到本地数据库

```dart
Future<void> updateMessage(EMMessage message) async {
  Map req = {"message": message.toJson()};
  Map result =
      await ChatChannel.invokeMethod(ChatMethodKeys.updateChatMessage, req);
  try {
    EMError.hasErrorFromResult(result);
  } on EMError catch (e) {
    throw e;
  }
}
```


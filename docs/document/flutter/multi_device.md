# 在多个设备上登录

<Toc />

环信即时通讯 IM 支持同一个用户 ID 在多个平台或者多个设备上登录；

客户端支持查询当前账号的已登录设备列表，可强制该账号从其他已登录设备下线；

环信即时通讯 IM Flutter SDK 支持在同一账号所有已登录设备上同步在线和离线消息以及对应的回执和已读状态、接收离线推送通知、同步好友、群组以及聊天室相关的操作。

默认最多支持 4 个设备同时在线，具体见 [环信即时通讯 IM 价格](https://www.easemob.com/pricing/im)。如需增加支持的设备数量，可以联系环信即时通讯 IM 的商务经理。

## 技术原理

用户在 Flutter 端上初始化 SDK 时会生成设备识别 ID，用于多设备登录和推送。服务器会将新消息发送到已登录的设备。环信即时通讯 IM Flutter SDK 提供如下方法实现多个设备上的互动功能。

- `getSelfIdsOnOtherPlatform` 获取其他登录设备的 ID；
- `MultiDeviceEventHandler` 获取其他设备上进行的好友或者群组操作。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 了解环信即时通讯 IM 的套餐包，详见 [环信即时通讯 IM 价格](https://www.easemob.com/pricing/im)。

## 实现方法

### 获取其他登录设备的 ID 和对其他设备发送消息

你可以调用 `EMContactManager#getSelfIdsOnOtherPlatform` 方法获取其他登录设备的 ID。你在当前设备上发送消息时，其他设备通过这些 ID 接收消息，实现不同设备之间的消息传输。

```dart
try {
  List<String>? list =
      await EMClient.getInstance.contactManager.getSelfIdsOnOtherPlatform();
} on EMError catch (e) {
}
```

### 获取其他设备上进行的好友或者群组操作

账号 A 同时在设备 A 和设备 B 上登录，账号 A 在设备 A 上进行一些操作，设备 B 上会收到这些操作对应的通知。

你需要先实现 `EMMultiDeviceEventHandler` 监听其他设备上的操作，再设置多设备监听器。

```dart
    // 添加多设备监听
    EMClient.getInstance.addMultiDeviceEventHandler(
      "UNIQUE_HANDLER_ID",
      EMMultiDeviceEventHandler(),
    );

    // 移除多设备监听
    EMClient.getInstance.removeMultiDeviceEventHandler("UNIQUE_HANDLER_ID");
```
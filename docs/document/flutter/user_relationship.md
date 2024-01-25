# 管理用户关系

<Toc />

用户登录后，可进行添加联系人、获取好友列表等操作。

SDK 提供用户关系管理功能，包括好友列表管理和黑名单管理：

- 好友列表管理：查询好友列表、申请添加好友、同意好友申请、拒绝好友申请、删除好友和设置好友备注等操作。
- 黑名单管理：查询黑名单列表、添加用户至黑名单以及将用户移除黑名单等操作。

本文介绍如何通过环信即时通讯 IM Flutter SDK 管理用户关系。

## 技术原理

环信即时通讯 IM Flutter SDK 提供 `EMContactManager` 类实现好友的添加移除，黑名单的添加移除等功能。主要方法如下：

- `addContact` 申请添加好友；
- `deleteContact` 删除好友；
- `acceptInvitation` 同意好友申请；
- `declineInvitation` 拒绝好友申请；
- `setContactRemark` 设置好友备注；
- `fetchAllContacts`/`fetchContacts`：一次性/分页从服务器获取好友列表（每个好友对象包含好友的用户 ID 和好友备注）；
- `fetchAllContactIds` 一次性从服务器获取好友列表(列表只包含好友的用户 ID)；
- `getContact`：获取本地单个好友（单个好友的用户 ID 和好友备注）；
- `getAllContacts`：一次性获取本地好友列表（每个好友对象包含好友的用户 ID 和好友备注）；
- `getAllContactIds`：一次性获取本地好友列表（列表只包含好友的用户 ID）；
- `addUserToBlockList` 添加用户到黑名单；
- `removeUserFromBlockList` 将用户从黑名单移除；
- `getBlockListFromServer` 从服务器获取黑名单列表。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 添加好友

1. 用户添加指定用户为好友

```dart
// 要添加为联系人的用户 ID
String userId = "foo";
// 申请加为好友的理由
String reason = "Request to add a friend.";
try{
  await EMClient.getInstance.contactManager.addContact(userId, reason);
} on EMError catch (e) {
}
```

2. 对方收到申请，同意成为好友，或者拒绝成为好友

同意成为好友示例代码如下：

```dart
// 用户 ID
String userId = "bar";
try{
  await EMClient.getInstance.contactManager.acceptInvitation(userId);
} on EMError catch (e) {
}
```

拒绝成为好友示例代码如下：

```dart
// 用户 ID
String userId = "bar";
try{
  await EMClient.getInstance.contactManager.declineInvitation(userId);
} on EMError catch (e) {
}
```

3. 接收方对于同意，申请方收到监听事件 `onContactInvited`。

```dart
// 注册监听
    EMClient.getInstance.contactManager.addEventHandler(
      "UNIQUE_HANDLER_ID",
      EMContactEventHandler(
    onFriendRequestAccepted: (userId, reason) {},
      ),
    );

// 移除监听
EMClient.getInstance.contactManager.removeEventHandler("UNIQUE_HANDLER_ID");
```

4. 对方拒绝，收到监听事件 `onFriendRequestDeclined`。

```dart
// 注册监听
    EMClient.getInstance.contactManager.addEventHandler(
      "UNIQUE_HANDLER_ID",
      EMContactEventHandler(
        onFriendRequestDeclined: (userId) {},
      ),
    );

// 移除监听
    EMClient.getInstance.contactManager.removeEventHandler("UNIQUE_HANDLER_ID");
```

### 删除好友

删除联系人时会同时删除对方联系人列表中的该用户，建议执行双重确认，以免发生误删操作。删除操作不需要对方同意或者拒绝。

可同时选择是否保留聊天会话，示例代码如下：

```dart
// 用户 ID
String userId = "tom";
// 是否保留聊天会话
bool keepConversation = true;
try {
  await EMClient.getInstance.contactManager.deleteContact(
    userId,
    keepConversation,
  );
} on EMError catch (e) {
}
```

### 设置好友备注

自 4.2.0 版本开始，你可以调用 `asyncSetContactRemark` 方法设置单个好友的备注。

好友备注的长度不能超过 100 个字符。

```dart
void updateRemark(String userId, String newRemark) async {
  try {
    await EMClient.getInstance.contactManager.setContactRemark(
      userId: userId,
      remark: newRemark,
    );
  } on EMError catch (e) {
    // error.
  }
}
```

### 从服务端获取好友列表

自 4.2.0 版本开始，你可以调用 `fetchAllContactsFromServer` 方法从服务器一次性或分页获取好友列表，其中每个好友对象包含好友的用户 ID 和好友备注。

- 一次性获取服务端好友列表。

```dart
void fetchAllContactsFromServer() async {
  try {
    List<EMContact> list = await EMClient.getInstance.contactManager.fetchAllContacts();
  } on EMError catch (e) {
    // error.
  }
}
```

- 分页获取服务端好友列表。

```dart
// pageSize 的取值范围为 [1,50]
void fetchContactsFromServer(String cursor, int pageSize) async {
  try {
    EMCursorResult<EMContact> result =
        await EMClient.getInstance.contactManager.fetchContacts(
      cursor: cursor,
      pageSize: pageSize,
    );
  } on EMError catch (e) {
    // error.
  }
}
```

此外，你也可以调用 `fetchAllContactIds` 方法从服务器获取所有好友的列表，该列表只包含好友的用户 ID。

```dart
void fetchAllContactIds() async {
  try {
    List<String> userIds =
        await EMClient.getInstance.contactManager.fetchAllContactIds();
  } on EMError catch (e) {
    // error.
  }
}
```

### 从本地获取好友列表

自 4.2.0 版本开始，你可以调用 `getContact` 方法从本地获取单个好友的用户 ID 和好友备注；你也可以调用 `getAllContacts` 方法一次性获取整个好友列表，其中每个好友对象包含好友的用户 ID 和好友备注。

:::tip
需要从服务器获取好友列表之后，才能从本地获取到好友列表。
:::

- 获取本地单个好友。

```dart
void getLocalContact(String userId) async {
  try {
    EMContact? contact =
        await EMClient.getInstance.contactManager.getContact(userId: userId);
  } on EMError catch (e) {
    // error.
  }
}
```

- 一次性获取本地好友列表。

```dart
void getAllLocalContact() async {
  try {
    List<EMContact> contacts =
        await EMClient.getInstance.contactManager.getAllContacts();
  } on EMError catch (e) {
    // error.
  }
}
```

此外，你也可以调用 `getAllContactIds` 方法从本地一次性获取所有好友的列表，该列表只包含好友的用户 ID。

示例代码如下：

```dart
void getAllLocalContactIds() async {
  try {
    List<String> userIds =
        await EMClient.getInstance.contactManager.getAllContactIds();
  } on EMError catch (e) {
    // error.
  }
}
```

#### 将用户加入黑名单

黑名单是与好友无任何关系的独立体系。可以将任何用户加入黑名单，不论该用户与你是否是好友关系。

黑名单功能包括加入黑名单，从黑名单移出用户和获取黑名单列表。对于获取黑名单，你可从服务器获取黑名单列表，也可从本地数据库获取已保存的黑名单列表。

你可以调用 `addUserToBlockList` 将指定用户加入黑名单。用户被加入黑名单后将无法向你发送消息，也无法发送好友申请。

用户可以将任何其他用户添加到黑名单列表，无论该用户是否是好友。好友被加入黑名单后仍在好友列表上显示。

```dart
// 用户 ID
String userId = "tom";
try {
  await EMClient.getInstance.contactManager.addUserToBlockList(userId);
} on EMError catch (e) {
}
```

### 查看当前用户黑名单列表

1. 通过服务器获取黑名单列表

从服务器获取黑名单列表之后，才能从本地数据库获取到黑名单列表。

```dart
try {
  List<String> list =
      await EMClient.getInstance.contactManager.getBlockListFromServer();
} on EMError catch (e) {
}
```

2. 使用本地缓存获取黑名单列表

```dart
try {
  List<String> list =
      await EMClient.getInstance.contactManager.getBlockListFromDB();
} on EMError catch (e) {
}
```

### 将用户从黑名单移除

你可以调用 `removeUserFromBlockList` 将用户从黑名单移除，用户发送消息等行为将恢复。

```dart
String userId = "tom";
try {
  await EMClient.getInstance.contactManager.removeUserFromBlockList(userId);
} on EMError catch (e) {
}
```
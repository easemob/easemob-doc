# 管理聊天室属性

<Toc />

聊天室是支持多人沟通的即时通讯系统。聊天室属性可分为聊天室名称、描述和公告等基本属性和自定义属性（key-value）。若聊天室基本属性不满足业务要求，用户可增加自定义属性并同步给所有成员。利用自定义属性可以存储直播聊天室的类型、狼人杀等游戏中的角色信息和游戏状态以及实现语聊房的麦位管理和同步等。聊天室自定义属性以键值对（key-value）形式存储，属性信息变更会实时同步给聊天室成员。

本文介绍如何管理聊天室属性信息。

## 技术原理

环信即时通讯 IM SDK 提供 `ChatRoomManager` 类和 `ChatRoom` 类用于聊天室管理，支持你通过调用 API 在项目中实现如下功能：

- 获取和更新聊天室基本属性；
- 获取聊天室自定义属性；
- 设置和强制设置聊天室自定义属性；
- 删除和强制删除聊天室自定义属性。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)；
- 了解环信即时通讯 IM 的 [使用限制](/product/limitation.html)；
- 了解聊天室的数量限制，详见 [套餐包详情](https://www.easemob.com/pricing/im)。

## 实现方法

### 获取聊天室公告

聊天室所有成员均可调用 `fetchChatroomAnnouncement` 方法获取聊天室公告。

示例代码如下：

```TypeScript
ChatClient.getInstance().chatroomManager()?.fetchChatroomAnnouncement(chatRoomId).then(announcement => console.log(announcement));
```

### 更新聊天室公告

仅聊天室所有者和聊天室管理员可以调用 `changeChatroomAnnouncement` 方法设置和更新聊天室公告，聊天室公告的长度限制为 512 个字符。公告更新后，其他聊天室成员收到 `onAnnouncementChanged` 回调。

示例代码如下：

```TypeScript
ChatClient.getInstance().chatroomManager()?.changeChatroomAnnouncement(chatRoomId, announcement).then(chatroom => {
    // success logic
});
```

### 修改聊天室名称

仅聊天室所有者和聊天室管理员可以调用 `changeChatroomName` 方法设置和修改聊天室名称，聊天室名称的长度限制为 128 个字符。

示例代码如下：

```TypeScript
ChatClient.getInstance().chatroomManager()?.changeChatroomName(chatRoomId, newName).then(chatroom => {
    // success logic
});
```

### 修改聊天室描述

仅聊天室所有者和聊天室管理员可以调用 `changeChatroomDescription` 方法设置和修改聊天室描述，聊天室描述的长度限制为 512 个字符。

示例代码如下：

```TypeScript
ChatClient.getInstance().chatroomManager()?.changeChatroomDescription(chatRoomId, newDescription).then(chatroom => {
    // success logic
});
```

### 管理聊天室自定义属性（key-value）

#### 获取聊天室所有自定义属性和指定自定义属性

聊天室所有成员均可调用 `fetchChatroomAttributes` 方法获取聊天室指定自定义属性。

示例代码如下：

```TypeScript
// 举例，如有'key1'和'key2'两个聊天室自定义 key 。
const keyArr = ['key1', 'key2'];
ChatClient.getInstance().chatroomManager()?.fetchChatroomAttributes(chatroomId, keyArr).then(mapResult => {
  // success logic
}).catch((e: ChatError) => {
  // failure logic
})
```

如果不设置`keyArr` 参数，则表示获取聊天室所有自定义属性。

```TypeScript
ChatClient.getInstance().chatroomManager()?.fetchChatroomAttributes(chatroomId).then(mapResult => {
  // success logic
}).catch((e: ChatError) => {
  // failure logic
})
```

#### 设置聊天室自定义属性

聊天室成员可以调用 `setChatroomAttributes` 方法设置单个聊天室自定义属性。该方法只可添加新自定义属性字段和更新自己设置的现有属性。设置后，其他聊天室成员收到 `onAttributesUpdate` 回调。

示例代码如下：

```TypeScript
let params: SetChatroomAttributeParams = {
  chatroomId: chatroomId,// 聊天室 ID
  attributeKeyOrMap: 'key',// 聊天室属性 key
  attributeValue: 'value',// 聊天室属性 value
  autoDelete: true,// 成员退出聊天室时是否删除其设置的聊天室自定义属性（可选，默认为 `true`）
  isForced: false,// 强制设置聊天室自定义属性，即是否支持覆盖其他成员设置的属性（可选，默认为 `false`）
}
ChatClient.getInstance().chatroomManager()?.setChatroomAttributes(params).then(result => {
  // success logic
}).catch((e: ChatError) => {
  // failure logic
})
```

聊天室成员也可以调用 `setChatroomAttributes` 方法设置多个聊天室自定义属性，`attributeKeyOrMap` 参数传入 Map<string, string> 结构的聊天室自定义属性，不设置`attributeValue` 参数。

示例代码如下：

```TypeScript
let attributeMap = new Map<string, string>();
attributeMap.set('key1', 'value1');
attributeMap.set('key2', 'value2');
let params: SetChatroomAttributeParams = {
  chatroomId: chatroomId,// 聊天室 ID
  attributeKeyOrMap: attributeMap,// 聊天室属性，为 Map<string, string> 格式
  autoDelete: true,// 成员退出聊天室时是否删除其设置的聊天室自定义属性（可选，默认为 `true`）
  isForced: false,// 强制设置聊天室自定义属性，即是否支持覆盖其他成员设置的属性（可选，默认为 `false`）
}
ChatClient.getInstance().chatroomManager()?.setChatroomAttributes(params).then(result => {
  if (result.code === ChatError.EM_NO_ERROR) {
    // success logic
  } else {
    // partial success logic
    result.errorKeyMap?.forEach((errorCode, key) => {
      // 'errorCode' 是 ‘key’ 设置失败的原因
    })
  }
}).catch((e: ChatError) => {
  // failure logic
})
```

如果除了设置自己的自定义属性还需覆盖其他聊天室成员设置的该属性，需将参数 `SetChatroomAttributeParams#isForced` 设置为 `true`。

#### 删除聊天室自定义属性

聊天室成员可以调用 `removeChatroomAttributes` 方法删除聊天室自定义属性。删除后，聊天室其他成员收到 `onAttributesRemoved` 回调。

示例代码如下：

```TypeScript
let params: RemoveChatroomAttributeParams = {
  chatroomId: chatroomId,// 聊天室 ID
  attributeKey: 'key',// 聊天室属性 key
  isForced: false,// 强制删除聊天室自定义属性，即是否支持删除其他成员设置的属性（可选，默认为 `false`）
}
ChatClient.getInstance().chatroomManager()?.removeChatroomAttributes(params).then(result => {
  // success logic
}).catch((e: ChatError) => {
  // failure logic
})
```
如果除了删除自己设置的自定义属性还需删除其他聊天室成员设置的该属性，需将参数 `RemoveChatroomAttributeParams#isForced` 设置为 `true`。

如果要删除多个自定义属性，需将参数`RemoveChatroomAttributeParams#attributeKey` 设置为数组即可。


### 监听聊天室事件

详见 [监听聊天室事件](room_manage.html#监听聊天室事件)。
# 管理子区

<Toc />

子区是群组成员的子集，是支持多人沟通的即时通讯系统，本文介绍如何使用环信即时通讯 IM SDK 在实时互动 app 中创建和管理子区，并实现子区相关功能。

:::notice
私有化版本不支持子区功能。
:::

## 技术原理

环信即时通讯 IM SDK 支持你通过调用 API 在项目中实现如下功能：

- 创建、解散子区
- 加入、退出子区
- 修改子区名称
- 获取子区详情
- 获取子区成员列表
- 获取子区列表
- 批量获取子区中的最新消息

## 前提条件

开始前，请确保满足以下条件：

- 完成 4.0.7 或以上版本 SDK 初始化，详见 [快速开始](quickstart.html)；
- 了解环信即时通讯 IM API 的 [使用限制](/product/limitation.html)。
- 了解子区和子区成员数量限制，详见 [使用限制](/product/limitation.html)。
- 联系商务开通子区功能。

## 实现方法

本节介绍如何使用环信即时通讯 IM SDK 提供的 API 实现上述功能。

### 创建子区

所有群成员均可以调用 `createChatThread` 方法，基于一条群组消息新建子区。

单设备登录时，子区所属群组的所有成员均会收到 `onChatThreadChange` 回调，事件为 `create`；多设备登录时，其他设备会同时收到 `onMultiDeviceEvent` 回调，事件为 `chatThreadCreate`。

示例代码如下：

```javascript
// 创建子区
conn.createChatThread({parentId: 'parentId',name: 'threadName',messageId: 'messageId'})
// 监听子区创建回调
conn.addEventHandler('THREAD',{
  onChatThreadChange:(threadMsg) =>{
			console.log(threadMsg)
	},
});
```

### 解散子区

仅子区所在群组的群主和群管理员可以调用 `destroyChatThread` 方法解散子区。

单设备登录时，子区所属群组的所有成员均会收到 `onChatThreadChange` 回调，事件为 `destroy`；多设备登录时，其他设备会同时收到 `onMultiDeviceEvent` 回调，事件为 `chatThreadDestroy`。

示例代码如下：

```javascript
// 创建子区
conn.destroyChatThread({chatThreadId: 'chatThreadId'})
// 监听子区解散回调
conn.addEventHandler('THREAD',{
  onChatThreadChange:(threadMsg) =>{
			console.log(threadMsg)
	},
});
```

### 加入子区

子区所在群组的所有成员均可以调用 `joinChatThread` 方法加入子区。

加入子区的具体步骤如下：

1. 收到 `onChatThreadChange` 回调或调用 `getChatThreads` 方法从服务器查询指定群组的子区列表，获得要加入的子区 ID。
2. 调用 `joinChatThread` 传入子区 ID 加入对应子区。  

多设备登录时，其他设备会同时收到 `onMultiDeviceEvent` 回调，事件为 `chatThreadJoin`。

示例代码如下：

```javascript
// 加入子区
conn.joinChatThread({chatThreadId: 'chatThreadId'});
```

### 退出子区

#### 子区成员主动退出子区

子区成员均可以调用 `leaveChatThread` 方法主动退出子区。退出子区后，该成员将不会再收到子区消息。

多设备登录时，其他设备会同时收到 `onMultiDeviceEvent` 回调，事件为 `chatThreadLeave`。

示例代码如下：

```javascript
conn.leaveChatThread({chatThreadId: 'chatThreadId'});
```

#### 子区成员被移出子区

仅群主和群管理员可以调用 `removeChatThreadMember` 方法将指定成员 (群管理员或普通成员) 踢出子区，被踢出子区的成员将不再接收到子区消息。

单设备登录时，被踢出子区的成员会收到 `onChatThreadChange` 回调，事件为 `userRemove`。

示例代码如下：

```javascript
// chatThreadId: 子区 ID
// username: 子区成员的用户 ID
conn.removeChatThreadMember({chatThreadId: 'chatThreadId',username:'username'}); 
```

### 修改子区名称

仅群主和群管理员以及子区的创建者可以调用 `changeChatThreadName` 方法修改子区名称。

单设备登录时，子区所属群组的所有成员会收到 `onChatThreadChange` 回调，事件为 `update`；多设备登录时，其他设备会同时收到 `onMultiDeviceEvent` 回调，事件为 `chatThreadNameUpdate`。

示例代码如下：

```javascript
// chatThreadId：子区 ID
// name：修改后的子区名称，长度不超过 64 个字符
conn.changeChatThreadName({chatThreadId: 'chatThreadId',name: 'name'})
// 监听子区更新
conn.addEventHandler('THREAD',{
  onChatThreadChange:(threadMsg) =>{
			console.log(threadMsg)
	},
});
```

### 获取子区详情

子区所有成员均可以调用 `getChatThreadDetail` 从服务器获取子区详情。

示例代码如下：

```javascript
// chatThreadID：子区 ID
conn.getChatThreadDetail({chatThreadId: 'chatThreadId'}).then((res)=>{
  console.log(res)
});
```

### 获取子区成员列表

子区所属群组的所有成员均可以调用 `getChatThreadMembers` 方法从服务器分页获取子区成员列表。

```javascript
// chatThreadId：子区 ID
// pageSize：单次请求返回的成员数，取值范围为 [1,50]
// cursor：开始获取数据的游标位置，首次调用方法时传 `null` 或空字符串
conn.getChatThreadMembers({chatThreadId: 'chatThreadId ',pageSize:20,cursor:'cursor'}).then((res)=>{
  console.log(res)
});
```

### 获取子区列表

1. 用户可以调用 `getJoinedChatThreads` 方法从服务器分页获取自己加入的子区列表：

```javascript
// pageSize：单次请求返回的子区数，取值范围为 [1,50]
// cursor：开始获取数据的游标位置，首次调用方法时传 `null` 或空字符串
conn.getJoinedChatThreads({cursor: 'cursor',pageSize: 20}).then((res)=>{
  console.log(res)
});
```

2. 用户可以调用 `getJoinedChatThreads` 方法从服务器分页获取指定群组中自己加入的子区列表：

```javascript
// parentId：群组 ID
// pageSize：单次请求返回的子区数，取值范围为 [1,50]
// cursor：开始获取数据的游标位置，首次调用方法时传 `null` 或空字符串
conn.getJoinedChatThreads({parentId: 'parentId',cursor: 'cursor',pageSize: 20}).then((res)=>{
  console.log(res)
});
```

3. 用户还可以调用 `getChatThreads` 方法从服务器分页获取指定群组的子区列表：

```javascript
// parentId：群组 ID
// pageSize：单次请求返回的子区数，取值范围为 [1,50]
// cursor：开始获取数据的游标位置，首次调用方法时传 `null` 或空字符串
conn.getChatThreads({parentId: 'parentId', cursor:'cursor', pageSize: 20}).then((res)=>{
  console.log(res)
});
```

### 批量获取子区中的最新消息

用户可以调用 `getChatThreadLastMessage` 方法从服务器批量获取子区中的最新一条消息。

示例代码如下：

```javascript
// chatThreadIds：要查询的子区 ID 列表，每次最多可传入 20 个子区 ID
conn.getChatThreadLastMessage({chatThreadIds: ['chatThreadId1','chatThreadId2']}).then((res)=>{
  console.log(res)
});
```

### 监听子区事件

SDK 提供 `addEventHandler` 方法用于注册监听事件。开发者可以通过设置此监听，获取群组中的事件。

示例代码如下：

```javascript
// 创建一个子区事件监听器
conn.addEventHandler("eventName", {
  onChatThreadChange: function (msg) {
    switch (msg.operation) {
      // 子区创建。子区所属群组的所有成员收到该事件。
      case "create":
        break;
      // 子区名称修改、子区中新增或撤回消息。子区所属群组的所有成员会收到该事件。
      case "update":
        break;
      // 子区解散。子区所属群组的所有成员会收到该事件。
      case "destroy":
        break;
      // 子区成员被移除。被踢出子区的成员收到该事件。
      case "userRemove":
        break;
      default:
        break;
    }
  },
});
```
# 管理本地会话

环信即时通讯 IM Web SDK 内部使用 IndexedDB 在本地数据库中保存单聊和群聊会话，通过 `LocalCache` 模块对本地会话数据进行管理，支持现代浏览器，例如 Chrome、Firefox、Safari 以及使用这些引擎的其他浏览器（例如 Microsoft Edge），**不支持 Internet Explorer（IE）浏览器**。

使用环信即时通讯 IM Web SDK 时，要支持本地会话存储，需要集成本地存储插件。**该插件只支持通过[按需导入](import_sdk_minicore.html)的方式集成**。

示例代码如下：

```javascript
import MiniCore from "easemob-websdk/miniCore/miniCore";
import * as contactPlugin from "easemob-websdk/contact/contact";
import * as localCachePlugin from "easemob-websdk/localCache/localCache";

const miniCore = new MiniCore({
  appKey: "your appKey",
});
// 使用联系人插件, "contact" 为固定值。
miniCore.usePlugin(contactPlugin, "contact");
// 使用本地存储插件, "localCache" 为固定值。
miniCore.usePlugin(localCachePlugin, "localCache");

// 登录即时通讯 IM。
miniCore.open({
  username: "userId",
  password: "password",
});
```

## 技术原理

环信即时通讯 IM SDK 支持你通过调用 API 在项目中实现如下功能：

- `getLocalConversations`：获取本地会话列表；
- `getLocalConversation`：获取单个本地会话；
- `setLocalConversationCustomField`：设置会话自定义字段；
- `clearConversationUnreadCount`：对会话的未读消息数清零；
- `removeLocalConversation`：删除单个本地会话；
- `getServerConversations`：同步服务端会话列表到本地数据库。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 4.2.1 或以上版本初始化，详见 [SDK 集成概述](overview.html#sdk-初始化)；
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)；
- 集成本地会话存储插件。

## 实现方法

本节介绍如何使用环信即时通讯 IM Web SDK 提供的 API 实现上述功能。

会话对象的结构如下所示:

```typescript
interface ConversationItem {
	// 会话 ID。
	conversationId: string;
	// 会话类型：单聊和群聊分别为 `singleChat` 和 `groupChat`。
	conversationType: ConversationType;
	// 会话的未读消息数。
	unReadCount?: number;
	// 最新的一条消息。
	lastMessage?: LocalMessageBody;
	// 会话自定义字段。
	customField?: Record<string, any>;
}
```

### 获取本地会话列表

你可以调用 `getLocalConversations` 方法一次性获取本地所有会话的列表。获取会话后，SDK 按照会话活跃时间（最新一条消息的时间戳）的倒序返回会话列表。会话列表数据为 <ConversationItem[]> 结构。

示例代码如下：

```javascript

miniCore.localCache.getLocalConversations().then((res)=>{
   // 获取本地会话列表成功。
   console.log(res)
})
```

### 获取单个本地会话

你可以调用 `getLocalConversation` 方法获取单个本地会话对象，示例代码如下：

```javascript
const options = {
   // 会话类型：单聊和群聊分别为 `singleChat` 和 `groupChat`。
   conversationType: 'singleChat',
   // 会话 ID。
   conversationId: 'conversationId'
}

miniCore.localCache.getLocalConversation(options).then((res)=>{
   // 获取本地会话成功。
   console.log(res)
})
```

### 设置会话自定义字段

你可以调用 `setLocalConversationCustomField` 方法设置本地会话的自定义字段，即传入 key-value 对象，key 为字段名，value 是字段值。

示例代码如下：

```javascript

const options = {
   // 会话类型：单聊和群聊分别为 `singleChat` 和 `groupChat`。
   conversationType: 'singleChat',
   // 会话 ID。
   conversationId: 'conversationId',
   // 会话自定义字段。
   customField: { custom: 'custom' }
}

miniCore.localCache.setLocalConversationCustomField(options).then(()=>{
   // 设置会话自定义字段成功。
})
```

### 对会话的未读消息数清零

你可以调用 `clearConversationUnreadCount` 方法对单个本地会话的未读消息数清零。示例代码如下：

```javascript

const options = {
   // 会话类型：单聊和群聊分别为 `singleChat` 和 `groupChat`。
   conversationType: 'singleChat',
   // 会话 ID。
   conversationId: 'conversationId'
}

miniCore.localCache.clearConversationUnreadCount(options).then(()=>{
   // 对指定会话的未读消息数清零成功。
})
```

### 删除单个本地会话

你可以调用 `removeLocalConversation` 方法删除单个本地会话。会话删除后，其他用户不受影响。

示例代码如下：

```javascript
const options = {
   // 会话类型：单聊和群聊分别为 `singleChat` 和 `groupChat`。
   conversationType: 'singleChat',
   // 会话 ID。
   conversationId: 'conversationId',
   // 是否删除本地消息, 默认值为 `true`。
   isRemoveLocalMessage: true
}

miniCore.localCache.removeLocalConversation(options).then(()=>{
   // 删除本地会话成功。
})
```

### 同步服务端会话列表到本地

你可以调用 `getServerConversations` 方法获取服务端会话列表并同步到本地数据库。示例代码如下：

```javascript
const options = {
   /** 每页期望获取的会话数量。取值范围为 [1,50]，默认为 `20`。*/
   pageSize: 20,
   /** 开始获取数据的游标位置。若传空字符串（''），SDK 从最新活跃的会话开始获取。*/
   cursor: ''
}
miniCore.contact.getServerConversations(options).then((res)=>{
   // 获取服务端会话列表并同步本地成功。
   console.log(res)
})
```


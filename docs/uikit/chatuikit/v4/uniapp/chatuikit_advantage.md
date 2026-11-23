# 进阶用法

<Toc />

## 自定义开发

UIKit 内置了 Store 模块，提供了丰富的状态管理和数据操作方法。你可以通过阅读 `ChatUIKit/Store` 模块源码，基于 Store 模块进行自定义开发。

### 获取会话消息未读数

通过 `conversationStore` 可以获取所有会话的消息未读数：

```javascript
// 获取所有会话的消息未读数
const unRead = ChatUIKit.conversationStore.totalUnreadCount
```

### 设置群组头像

通过 `groupStore` 可以手动设置群组头像：

```javascript
// 设置群组头像
ChatUIKit.groupStore.setGroupAvatar('groupId', 'group avatar url');
```

### 使用自定义用户属性

如果你需要使用自己的用户属性系统，可以隐藏环信内置的用户属性功能，然后通过 `appUserStore` 设置自定义用户属性：

```javascript
// 隐藏环信内置的用户属性功能
ChatUIKit.hideFeature(['useUserInfo'])

// 设置自定义用户属性
ChatUIKit.appUserStore.setUserInfo('userId', {
	nickname: '张三',
	avatarurl: 'user avatar url'
})
```

## 隐藏 UIKit 功能

如果 UIKit 的某些内置功能不符合你的业务需求，你可以在 UIKit 初始化后，调用 `ChatUIKit.hideFeature` 方法隐藏这些功能。


### 使用方法

调用 `ChatUIKit.hideFeature` 方法，传入需要隐藏的功能名称数组：

```javascript
// 隐藏单个功能
ChatUIKit.hideFeature(['useUserInfo'])

// 隐藏多个功能
ChatUIKit.hideFeature([
  'useUserInfo',
  'pinConversation',
  'deleteConversation'
])
```

### 可隐藏的功能列表

| 功能名称 | 功能说明 |
|---------|---------|
| `useUserInfo` | 是否使用 SDK 的用户属性 |
| `usePresence` | 是否开启 Presence（在线状态） |
| `muteConversation` | 是否启用会话免打扰 |
| `pinConversation` | 是否开启置顶会话功能 |
| `deleteConversation` | 是否开启删除会话功能 |
| `messageStatus` | 是否展示消息状态 |
| `copyMessage` | 是否开启复制消息 |
| `deleteMessage` | 是否开启删除消息 |
| `recallMessage` | 是否开启撤回消息 |
| `editMessage` | 是否开启编辑消息 |
| `replyMessage` | 是否开启回复消息 |
| `inputEmoji` | 是否开启表情消息 |
| `inputImage` | 是否开启图片消息 |
| `inputAudio` | 是否开启语音消息 |
| `inputVideo` | 是否开启视频消息 |
| `inputFile` | 是否开启文件消息（目前仅 H5 和小程序支持发送文件消息） |
| `inputMention` | 是否开启 Mention 消息（@消息） |

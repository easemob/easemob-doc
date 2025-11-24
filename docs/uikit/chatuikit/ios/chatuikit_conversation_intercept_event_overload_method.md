# 会话列表页面拦截点击跳转事件与ViewModel 中可重载的方法

## 拦截点击跳转事件

对于会话列表页面的点击跳转事件，你可以利用原有的逻辑，也可以在原有的逻辑上添加自己的扩展和实现。

你可以继承 `ConversationListController` 并赋值注册到 `ComponentsRegister.shared.ConversationsController` 中，然后即可重载如下想要拦截的点击事件方法。

| 方法名    |   用途    | 是否可重载 |
| -------- | -------- | -------- |
| `createNavigationBar`    | 导航栏创建方法 | 是     |
| `createSearchBar`        | 搜索框创建方法 | 是     |
| `createList`             | 会话列表创建方法 | 是     |
| `navigationClick`        | 导航点击方法     | 是     |
| `pop`                    | 页面返回方法     | 是     |
| `toChat`                 | 跳转聊天方法     | 是     |
| `searchAction`           | 搜索框点击方法     | 是     |
| `rightActions`           | 导航右侧按钮点击方法     | 是     |
| `selectContact`          | 跳转选择联系人页面方法     | 是     |
| `chatToContact`          | 跳转聊天页面指定联系人聊天方法     | 是     |
| `createChat`             | 根据类型创建对应类型会话开始聊天方法     | 是     |
| `addContact`             | 唤起添加联系人弹窗方法     | 是     |
| `createGroup`            | 创建群组跳转选择群成员页面方法     | 是     |
| `create`                 | 创建群组方法     | 是     |

## ViewModel 中可重载的方法

环信即时通讯 IM SDK 的会话页面的回调事件监听以及 UI 触发事件的监听在会话列表页面的 `ViewModel` 中。

你可以利用原有的逻辑，也可以在原有的逻辑上添加自己的扩展和实现。

你可以继承 `ConversationViewModel` 并赋值注册到 `ComponentsRegister.shared.ConversationViewService` 中，即可重载如下想要拦截的监听方法。

| 方法名 | 用途 | 是否可重载 |
| -------- | -------- | -------- |
| `loadExistLocalDataIfEmptyFetchServer`    | 拉取会话列表出现错误时回调方法，此方法会重新获取会话列表。     | 是     |
| `pin`    | 会话列表左滑后点击置顶按钮后触发回调。  | 是     |
| `unpin`    | 会话列表左滑后点击取消置顶按钮后触发回调。     | 是     |
| `mute`    | 会话列表左滑后点击禁言按钮后触发回调。     | 是     |
| `unmute`    | 会话列表左滑后点击取消禁言按钮后触发回调。     | 是     |
| `delete`    | 会话列表左滑后点击删除按钮后触发回调。     | 是     |
| `read`    | 会话列表左滑后点击已读按钮后触发回调。     | 是     |
| `conversationDidSelected`    | 会话列表点击后回调。     | 是     |
| `moreAction`   | 会话列表右滑后点击 `...` 回调。     | 是     |
| `conversationLastMessageUpdate`   | 会话列表中会话最后一条消息更新时回调。     | 是     |
| `playNewMessageSound`   | 收到新消息时播放音频方法。     | 是     |
| `conversationMessageAlreadyReadOnOtherDevice`   | 会话中消息在其它设备上已读。     | 是     |
| `conversationEventDidChanged`   | 对会话的多设备操作时间发生变更回调。     | 是     |
| `mapper`  | 映射 `ConversationInfo` 对象方法。     | 是     |


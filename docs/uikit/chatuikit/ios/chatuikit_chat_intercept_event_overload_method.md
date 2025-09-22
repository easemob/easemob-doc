# 聊天页面拦截点击跳转事件与ViewModel 中可重载的方法

## 拦截点击跳转事件

对于聊天页面的点击跳转事件，你可以利用原有的逻辑，也可以在原有的逻辑上添加自己的扩展和实现。

你可以继承 `MessageListController` 并赋值注册到 `ComponentsRegister.shared.MessageViewController` 中，然后即可重载如下想要拦截的点击事件方法。

| 方法名    |   用途    | 是否可重载 |
| -------- | -------- | -------- |
| `createNavigation`    | 创建导航栏方法     | 是     |
| `createLoading`    | 创建Loading页面方法     | 是     |
| `navigationClick`    | 导航栏所有点击方法     | 是     |
| `viewDetail`   | 查看联系人或群组详情页面     | 是     |
| `rightItemsAction`    | 导航右侧按钮点击方法     | 是     |
| `pop`   | 页面返回上一级方法     | 是     |
| `messageWillSendFillExtensionInfo`    | 消息即将发送前可添加扩展信息方法     | 是     |
| `filterMessageActions`    | 过滤长按后弹出菜单上菜单项的方法     | 是     |
| `showMessageLongPressedDialog`   | 显示消息长按后的菜单     | 是     |
| `processMessage`  | 处理消息长按后弹窗点击事件     | 是     |
| `editAction`    | 点击消息长按后菜单中的编辑后弹出编辑弹窗方法     | 是     |
| `reportAction`    | 点击消息长按后菜单中的举报按钮弹出举报弹窗的方法     | 是     |
| `messageAttachmentLoading`    | 图片视频以及附件消息点击后是否需要显示loading页面方法     | 是     |
| `messageBubbleClicked`    | 消息气泡点击方法     | 是     |
| `viewContact`   | 查看联系人页面    | 是     |
| `messageAvatarClick`   | 消息头像点击     | 是     |
| `audioDialog`  | 显示录制音频弹窗     |      |
| `mentionAction`    | 群聊中输入框中输入@符号触发事件     | 是     |
| `attachmentDialog`    | 显示发送图片视频以及文件消息的弹窗    | 是     |
| `selectFile`    | 选择文件     | 是     |
| `selectPhoto`    | 打开相册选择照片     | 是     |
| `openCamera`    | 打开相机拍摄视频照片     | 是     |
| `selectContact`   | 选择联系人发送卡片     | 是     |
| `openFile`   | 打开选择文件     | 是     |
| `processImagePicker是`   | 处理点击选择图片以及视频发送消息方法     | 是     |
| `documentPickerOpenFile`   | 打开文件选择器的方法     | 是     |

## ViewModel 中可重载的方法

环信即时通讯 IM SDK 的聊天页面的回调事件监听以及 UI 触发事件的监听在聊天页面的 `ViewModel` 中。

你可以利用原有的逻辑，也可以在原有的逻辑上添加自己的扩展和实现。

你可以继承 `MessageListViewModel` 并赋值注册到 `ComponentsRegister.shared.MessagesViewModel` 中，然后即可重载如下想要拦截的监听方法。

| 方法名 | 用途 | 是否可重载 |
| -------- | -------- | -------- |
| `messageDidReceived`    | 收到新消息回调。     | 是     |
| `messageDidRecalled`    | 收到消息撤回回调。     | 是     |
| `onMessageDidEdited`    | 收到消息被编辑回调。     | 是     |
| `messageStatusChanged`    | 收到消息状态发生变更回调。     | 是     |
| `messageAttachmentStatusChanged`    | 收到消息附件状态变更回调。     | 是     |

若在发送前需修改消息，你需要调用 `constructMessage` 方法重新构造自己的消息。

UI 事件的回调，详见 [拦截点击跳转事件](#拦截点击跳转事件) 。


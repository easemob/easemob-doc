# Flutter 单群聊 UIKit 更新日志

## 版本 2.3.0-dev.1
- 依赖的 `Flutter SDK` 升级:
- - `Flutter SDK` 升级至 4.15.2

- 合并 chatroom uikit并完整本地化；
- 修复 缩略图显示模糊问题;
- 修复 设置空会话没有生效的问题;
- 修复 @消息无法正常工作的问题;
- 修复 自定义 MessagesView 中 itemBuilder null时,不会发已读ack的问题;
- 修复 弹出键盘后emoji面板没有完全遮挡的问题;
- 修复 部分插件依赖问题;

## 版本 2.2.0
- 依赖的 `Flutter SDK` 升级:
- - `Flutter SDK` 升级至 4.13.0

- 升级 第三方库；
- 修改 撤回消息回调；
- 修改 群默认头像设置；
- 修复 收到会话回执没有标记消息的问题；
- 修复 消息列表背景无法点击；

## 版本 2.1.0

- 依赖的 `Flutter SDK` 升级:
- - `Flutter SDK` 升级至 4.8.2

### 新增特性

- [消息长按菜单样式新增微信风格样式](chatuikit_custom_chat.html#自定义消息长按后显示的操作)；
- [发送附件消息菜单新增微信风格样式](chatuikit_custom_chat.html#自定义消息上下文菜单样式)。

### 优化

- 修改 `ChatUIKitBottomSheetItem` 为 `ChatUIKitEventAction`；
- 依赖 IM SDK 升级为 `im_flutter_sdk: 4.8.2`；
- 依赖 Flutter 版本升级为 `3.19.0`；
- 修改主题设置方式。

## 版本 2.0.3

- 依赖的 `Flutter SDK` 升级:
- - `Flutter SDK` 升级至 ^4.6.1+2

- 优化会话列表展示逻辑。
- 优化消息加载。

## 版本 2.0.2

- 依赖的 `Flutter SDK` 升级:
- - `Flutter SDK` 升级至 ^4.6.1

- 添加黑名单列表组件 `blockListView`。
- 修改联系人详情，群组详情页自定义内容实现。
- 移除消息中长按 `listItem` 的回调，统一使用 `onItemLongPressHandler` 修改和添加消息长按事件。

## 版本 2.0.1

- 依赖的 `Flutter SDK` 升级:
- - `Flutter SDK` 升级至 ^4.5.0

### 修复

添加消息图片过期或者下载失败时的占位图
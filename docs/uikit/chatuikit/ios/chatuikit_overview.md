# 概述

<Toc />

环信聊天 UIKit 是基于环信即时通讯云 IM SDK 开发的一款即时通讯 UI 组件库，提供各种组件实现会话列表、聊天界面、联系人列表及后续界面等功能，帮助开发者根据实际业务需求快速搭建包含 UI 界面的即时通讯应用。

若要访问源码，请点击[这里](https://github.com/easemob/chatuikit-ios)。

## 项目结构

```
Classes
├─ Service // 基础服务组件。
│ ├─ Client //单群聊 UIKit 用户主要初始化、登录、缓存等使用 API。
│ ├─ Protocol // 业务协议。
│ │ ├─ ConversationService // 会话协议，包含对会话的各种处理操作等。
│ │ ├─ ContactService // 联系人协议，包含后续的联系人增加和删除等操作。
│ │ ├─ ChatService // 聊天协议，包含对消息的各种处理操作等。
│ │ ├─ UserService // 用户登录协议，包含用户登录以及socket连接状态变更等。
│ │ ├─ MultiService // 多设备通知协议，包含单群聊、会话、联系人、成员变更等。
│ │ └─ GroupService // 实现群聊管理协议，包括加入和离开群组以及群组信息的修改等。
│ └─ Implement // 对应协议的实现组件。
│
└─ UI // 基本 UI 组件，不带业务。
    ├─ Resource // 图像或本地化文件。
    ├─ Component // 包含具体业务的 UI 模块。单群聊 UIKit 中的一些功能性 UI 组件。
    │ ├─ Chat // 所有聊天视图的容器。
    │ ├─ Contact // 联系人、群组及其详情等容器。
    │ └─ Conversation // 会话列表容器。
    └─ Core
       ├─ UIKit // 一些常见的 UIKit 组件和自定义组件以及一些 UI 相关的工具类。
       ├─ Foundation // 日志以及一些音频转换工具类。
       ├─ Theme // 主题相关组件，包括颜色、字体、换肤协议及其组件。
       └─ Extension // 一些方便的系统类扩展。
 ```    

## 功能介绍

单群聊 UIKit 中业务相关的 UI 控件主要包含在以下三个模块：Chat 模块、Conversation 模块 和 Contact 模块。

### 聊天页面功能

Chat 模块提供所有聊天视图的容器。

<ImageGallery :columns="3">
  <ImageItem src="/images/uikit/chatuikit/ios/chat_detail.png" title="聊天页面" />
  <ImageItem src="/images/uikit/chatuikit/ios/message_types.png" title="发送多种类型的消息" />
  <ImageItem src="/images/uikit/chatuikit/ios/message_longpress.png" title="消息长按操作" />
  <ImageItem src="/images/uikit/chatuikit/ios/message_reply.png" title="消息引用" />
  <ImageItem src="/images/uikit/chatuikit/ios/message_deliveryreceipt.png" title="已发送回执" />
  <ImageItem src="/images/uikit/chatuikit/ios/message_readreceipt.png" title="已读回执" />
</ImageGallery>

### 会话列表页面功能

Conversation 模块提供会话列表容器。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/ios/conversation_slide.png" title="会话左滑/右滑" />
  <ImageItem src="/images/uikit/chatuikit/ios/conversation_operation.png" title="会话操作" />
</ImageGallery>

### 通讯录页面功能

Contact 模块提供联系人、群组及其详情等容器。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/ios/contact_list.png" title="联系人列表" />
  <ImageItem src="/images/uikit/chatuikit/ios/contact_detail.png" title="联系人详情" />
  <ImageItem src="/images/uikit/chatuikit/ios/block_list.png" title="联系人黑名单" />
  <ImageItem src="/images/uikit/chatuikit/ios/group_list.png" title="群组列表" />
</ImageGallery>

### 群组管理页面功能

群组管理页面提供以下功能：

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/ios/group_detail.png" title="群详情管理" />
  <ImageItem src="/images/uikit/chatuikit/ios/group_member.png" title="群成员管理" />
  <ImageItem src="/images/uikit/chatuikit/ios/group_thread.png" title="话题" />
  <ImageItem src="/images/uikit/chatuikit/ios/group_pin.png" title="消息置顶" />
</ImageGallery>

### 页面搜索功能

单群聊 UIKit 提供以下搜索功能：

<ImageGallery :columns="3">
  <ImageItem src="/images/uikit/chatuikit/ios/search_conversation.png" title="搜索会话名称" />
  <ImageItem src="/images/uikit/chatuikit/ios/search_contact.png" title="搜索联系人名称" />
  <ImageItem src="/images/uikit/chatuikit/ios/search_chat_history.png" title="搜索聊天历史" />
</ImageGallery>


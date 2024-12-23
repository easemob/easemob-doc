# 单群聊 UIKit 通用特性

本文介绍单群聊 UIKit 通用特性，包括会话列表、聊天、群组和联系人等相关功能。

<Toc />

## 会话列表

会话列表呈现了用户所有正在进行的对话，帮助用户快速找到所需联系人并查看消息进展。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/main_conversation_list.png" title="会话列表" />
</ImageGallery>

## 聊天	

聊天是即时通讯的核心功能之一，它允许用户与其他用户进行实时文字交流。聊天通常以会话的形式进行，每个会话由两个或多个用户组成。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/main_chat.png" title="聊天页面" />
</ImageGallery>

## 创建会话

创建会话是即时通讯的核心功能之一，它允许用户启动与一个或多个其他用户交流。

![img](/images/uikit/chatuikit/uniapp/conversation_create.png)

## 创建群组	

群组是允许多个用户加入的聊天会话。

![img](/images/uikit/chatuikit/uniapp/group_create.png)

## 用户列表	

用户列表显示了用户的所有联系人，包括联系人列表，群成员列表和黑名单等。用户可以通过用户列表快速找到需要联系的人。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/contact_list.png" title="联系人列表" />
</ImageGallery>

## 已发送回执	

已发送回执用于告知消息发送者，其发送的消息已经成功发送到服务器、接收方以及发送失败。

![img](/images/uikit/chatuikit/uniapp/message_receipt_delivery.png  =350x750) 

## 已读回执

已读回执用于告知消息发送者，接收者已经阅读了其发送的消息。

![img](/images/uikit/chatuikit/uniapp/message_receipt_read.png  =350x750) 

## 语音消息

语音消息指以语音形式发送和接收的消息，可替代文字交流。

![img](/images/uikit/chatuikit/uniapp/message_audio.png =700x730) 

## 消息审核

消息审核对用户发送的消息内容进行审查，判断其是否符合平台的社区准则、服务条款和相关法律法规。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/uniapp/message_report.png" title="消息审核" />
</ImageGallery>

## 群组 @ 提及 

群组 @ 提及功能使用户能在群聊中通过 @ 符号直接提及特定成员，被提及者将收到特别通知。该功能便于高效传递重要信息，确保关键消息得到及时关注和回应。

#### 如何使用

群组 @ 提及特性默认开启。要关闭该特性，则可以调用 `ChatUIKit.hideFeature`方法隐藏。

示例代码如下：

```javascript
    ChatUIKit.hideFeature(['inputMention'])
```


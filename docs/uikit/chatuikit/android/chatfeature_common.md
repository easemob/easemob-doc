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

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/common/android/conversation_create.png" title="创建会话" />
</ImageGallery>

## 创建群组	

群组是允许多个用户加入的聊天会话。用户可以邀请其他用户加入群组，并对群组进行管理。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/common/android/group_create.png" title="创建群组" />
</ImageGallery>

## 群组管理员	

群组管理员拥有对群组的所有权限，包括：添加或删除群成员，修改群组名称、描述和头像，禁言或踢出群成员等。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/common/android/group_admin.png" title="群组管理员" />
</ImageGallery>

## 用户列表	

用户列表显示了用户的所有联系人，包括联系人列表，群成员列表和黑名单等。用户可以通过用户列表快速找到需要联系的人。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/contact_list.png" title="联系人列表" />
</ImageGallery>

## 文件共享	

文件共享允许用户通过即时通讯应用发送和接收文件。文件共享可以用于分享文档、图片、视频等文件。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/common/android/file_share.png" title="文件共享" />
</ImageGallery>

## 未读消息数	

未读消息数是指用户收到的但尚未查看的消息数量。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/common/android/message_unread_count.png" title="未读消息数" />
</ImageGallery>

## 已发送回执	

已发送回执用于告知消息发送者，其发送的消息已经成功发送到服务器、接收方以及发送失败。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/common/android/message_delivery_receipt.png" title="已发送回执	" />
</ImageGallery>

## 已读回执

已读回执用于告知消息发送者，接收者已经阅读了其发送的消息。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/common/android/message_read_receipt.png" title="已读回执" />
</ImageGallery>

## 联系人名片	

联系人名片指包含联系人详细信息的电子卡片，通常包括头像和昵称等信息。通过联系人名片，用户可以快速添加联系人或开始会话。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/common/android/contact_namecard.png" title="联系人名片" />
</ImageGallery>

## 语音消息

语音消息指以语音形式发送和接收的消息，可替代文字交流。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/common/android/message_audio.png" title="语音消息" />
</ImageGallery>

## 消息审核

消息审核对用户发送的消息内容进行审查，判断其是否符合平台的社区准则、服务条款和相关法律法规。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/uniapp/message_report.png" title="消息审核" />
</ImageGallery>

## 本地搜索

本地搜索功能允许用户快速根据类型搜索，包括搜索联系人（带有或无选择框）、会话、历史消息和黑名单，支持关键词匹配。该功能帮助用户高效找到所需信息，提高工作效率和信息管理的便捷性。

UIKit 提供封装的 `ChatUIKitSearchActivity` 搜索页面，用户根据 `ChatUIKitSearchType` 和输入关键词后，将根据 `ChatUIKitSearchType` 类型搜索数据展示搜索结果。

同时，UIKit 也提供搜索基类 `ChatUIKitBaseSearchFragment`，用户可以更好地继承扩展实现。`ChatUIKitBaseSearchFragment` 中的 `initAdapter()` 抽象方法实现自己的 adapter，进行数据处理和展示。

例如，以下为搜索消息的页面。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/common/android/message_search.png" title="本地消息搜索" />
</ImageGallery>

#### 如何使用

跳转 `ChatUIKitSearchActivity` 页面，根据自己需要搜索的类型（`ChatUIKitSearchType：USER、SELECT_USER、CONVERSATION、MESSAGE、BLOCK_USER`）传入需要的参数，将匹配关键词并展示搜索结果。

例如，搜索黑名单的示例代码如下 ：

```kotlin
    
    private val returnSearchClickResult: ActivityResultLauncher<Intent> = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result -> onClickResult(result) }

    returnSearchClickResult.launch(
        ChatUIKitSearchActivity.createIntent(
            context = mContext,
            searchType = ChatUIKitSearchType.BLOCK_USER
        )
    )
    private fun onClickResult(result: ActivityResult) {
        if (result.resultCode == Activity.RESULT_OK) {
            result.data?.getSerializableExtra("user")?.let {
                if (it is ChatUIKitUser) {
                    // it 为搜索结果 
                }
            }
        }
    }

```

## 群组 @ 提及

群组 @ 提及功能使用户能在群聊中通过 @ 符号直接提及特定成员，被提及者将收到特别通知。该功能便于高效传递重要信息，确保关键消息得到及时关注和回应。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/common/android/group_@.png" title="群组 @ 提及" />
</ImageGallery>

#### 如何使用

群组 @ 提及特性默认开启。要关闭该特性，则需将 `enableMention` 设置为 `false`。

示例代码如下：

```kotlin
    ChatUIKitClient.getConfig()?.chatConfig?.enableMention == false
```


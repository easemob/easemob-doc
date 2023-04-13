# EaseIMKit 使用指南

<Toc />

在您阅读此文档时，我们假定您已经具备了基础的 Android 应用开发经验，并能够理解相关基础概念。此文档是针对导入 EaseIMKit 库的快速集成文档，如果只是导入 SDK 集成使用，请参考 [环信即时通讯 IM Android 快速开始](quickstart.html)。

## 简介

EaseIMKit 是什么？

**EaseIMKit** 是 EaseUI 的升级版，是基于环信 IM SDK 的一款 UI 组件库，它提供了一些通用的 UI 组件，例如‘会话列表’、‘聊天界面’和‘联系人列表’等，开发者可根据实际业务需求通过该组件库快速地搭建自定义 IM 应用。EaseIMKit 中的组件在实现 UI 功能的同时，调用 IM SDK 相应的接口实现 IM 相关逻辑和数据的处理，因而开发者在使用 EaseIMKit 时只需关注自身业务或个性化扩展即可。

EaseIMKit 源码地址

- [EaseIMKit](https://github.com/easemob/easeui/tree/EaseIMKit)

使用 EaseIMKIt 的环信 IM APP 源码地址：

- [环信 IM](https://github.com/easemob/chat-android)

## 导入 EaseIMKit

### 开发环境要求

- Android Studio 3.2 以上
- Gradle 4.6 以上
- targetVersion 26 以上
- Android SDK API 19 以上
- Java JDK 1.8 以上

### 集成说明

EaseIMKit 支持 Gradle 接入和 Module 源码集成

#### Gradle 接入集成

:::notice 重大变动
远程仓库统一由 JCenter 迁移到 `MavenCentral`，依赖库的域名由 “com.hyphenate” 修改为 “io.hyphenate”，详见 [环信即时通讯 IM Android 快速开始](quickstart.html)。
:::

```gradle
implementation 'io.hyphenate:ease-im-kit:xxx版本'
implementation 'io.hyphenate:hyphenate-chat:xxx版本'
```

**EaseIMKit 必须依赖环信 IM SDK，因而在使用 EaseIMKit 时必须同时添加环信 IM SDK 依赖。**

:::notice

1. IM SDK **3.8.0** 版本以后，远程依赖的 `artifactId` 修改为 `hyphenate-chat`，且该版本以后中不再包含音视频相关逻辑。
2. IM SDK **3.8.0** 以下，远程依赖，包含音视频的 `artifactId` 为 `hyphenate-sdk`，不包含音视频的 `artifactId` 为 `hyphenate-sdk-lite`。如果想使用不包含音视频通话的 SDK，用 `implementation 'io.hyphenate:hyphenate-sdk-lite:xxx版本`'。

版本号参考 [Android SDK 更新日志](releasenote.html)。
:::

#### Module 源码集成

```gradle
implementation project(':ease-im-kit')
```

#### 依赖的第三方库

- Glide: 图片处理库，显示用户头像时用到。
- BaiduLBS_Android.jar: 百度地图定位库。

#### 关于位置消息说明

EaseIMKit 中位置消息使用的是百度地图定位 jar 包，为了防止出现百度地图类冲突的问题，EaseIMKit 库打包时对百度地图定位 jar 包采用了只编译的方式，这就要求如果开发者想要使用位置消息，需要在自己的项目中添加百度地图定位的 jar 包及其 so 文件。

### 初始化

在 application 的 onCreate 下调用初始化 EaseIMKit 的方法。

:::notice
EaseIMKit 初始化里已包含 SDK 的初始化，不需要再去调用 SDK 的初始化。
:::

```java
public class DemoApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();

        //EaseIM 初始化
        if(EaseIM.getInstance().init(context, options)){
            //在做打包混淆时，关闭 debug 模式，避免消耗不必要的资源
            EMClient.getInstance().setDebugMode(true);
            //EaseIM 初始化成功之后再调用注册消息监听的代码 ...
        }
    }
}
```

## 快速搭建

EaseIMKit 封装了常用 IM 功能，提供了会话，聊天及联系人等基本的 fragment，旨在帮助开发者快速集成环信 SDK。

### 创建会话列表界面

EaseIMKit 提供了 EaseConversationListFragment，需要将其或者其子类添加到 Activity 中。开发者需要对刷新事件（新消息，删除消息，删除会话等）进行处理。

![img](@static/images/android/easeim.jpeg)

:::notice
要实现自定义头像及昵称，请参考 [设置头像和昵称](userprofile.html#设置当前用户的属性)。
:::

### 创建聊天界面

EaseIMKit 提供了 EaseChatFragment，添加到 Activity 中并传递相应的参数即可用。
必须向 EaseChatFragment 传递的参数为：

- `conversationId`——会话 ID，单聊时指对方 ID，群聊和聊天室时指群和聊天室 ID；
- `chatType`——聊天类型，整型，分别为单聊（1）、群聊（2）和聊天室（3）；

可选传递参数为：

- `history_msg_id`——消息 ID，用于查询历史记录时的定位消息 ID；
- `isRoaming`——是否开启漫游，布尔类型，用于标记是否优先从服务器拉取消息。

```java
public class ChatActivity extends BaseActivity {
    private EaseChatFragment chatFragment;

    @Override
    protected void onCreate(Bundle arg0) {
        super.onCreate(arg0);
        setContentView(R.layout.em_activity_chat);
        //use EaseChatFratFragment
        chatFragment = new EaseChatFragment();
        //pass parameters to chat fragment
        chatFragment.setArguments(getIntent().getExtras());
        getSupportFragmentManager().beginTransaction().add(R.id.container, chatFragment).commit();
    }
}
```

![img](@static/images/android/easeim1.jpeg)

### 添加联系人界面

EaseIMKit 提供了 EaseContactListFragment，添加其及其子类到 Activity 中。开发者需要对刷新事件（添加联系人，删除联系人等）进行处理。

![img](@static/images/android/easeim2.jpeg)

## 设置样式

### 设置标题栏

EaseIMKit 提供了自定义的标题栏控件 EaseTitleBar。

![img](@static/images/android/easeim-titlebar.jpeg)

标题栏除了做为 View 所具有的属性功能外，还可以设置标题的位置等。

xml 中设置如下：

```xml
<com.hyphenate.easeui.widget.EaseTitleBar
    android:id="@+id/title_bar"
    android:layout_width="match_parent"
    android:layout_height="@dimen/em_common_title_bar_height"
    app:titleBarTitle="@string/em_chat_group_detail_title"
    android:background="@color/white"
    app:titleBarDisplayHomeAsUpEnabled="true"/>
```

其中 `titleBarDisplayHomeAsUpEnabled` 属性为设置返回按钮是否可见，设置标题位置可设置 `titleBarTitlePosition`，可选值为 `center`，`left` 和 `right`。

也可进行代码设置，如下：

```java
EaseTitleBar titleBarMessage = findViewById(R.id.title_bar_message);
//设置右侧菜单图标
titleBarMessage.setRightImageResource(R.drawable.chat_user_info);
//设置标题
titleBarMessage.setTitle("标题");
//设置标题位置
titleBarMessage.setTitlePosition(EaseTitleBar.TitlePosition.Left);
//设置右侧菜单图标的点击事件
titleBarMessage.setOnRightClickListener(this);
//设置返回按钮的点击事件
titleBarMessage.setOnBackPressListener(this);
```

当然设置右侧菜单，您也可以通过 Android 提供的添加 `menu xml` 的形式实现。修改按钮图标，可以调用 `titleBarMenuResource` 属性进行设置。

### 设置会话列表

会话列表可以修改如下样式:

- 头像：头像大小，头像形状（方形，带圆角的方形，圆形），描边
- 标题、内容、时间等文字：字体大小，字体颜色
- 未读消息：可设置是否展示，展示位置（左式和右式）

在 `EaseConversationListFragment` 及其子类中可以直接获取到 `EaseConversationListLayout` 这个控件，然后通过这个控件进行设置。

代码如下：

```java
//设置头像尺寸
conversationListLayout.setAvatarSize(EaseCommonUtils.dip2px(mContext, 50));
//设置头像样式：0 为默认，1 为圆形，2 为方形(设置方形时，需要配合设置 avatarRadius，默认的 avatarRadius 为 50dp)
conversationListLayout.setAvatarShapeType(2);
//设置圆角半径
conversationListLayout.setAvatarRadius((int) EaseCommonUtils.dip2px(mContext, 5));
//设置标题字体的颜色
conversationListLayout.setTitleTextColor(ContextCompat.getColor(mContext, R.color.red));
//设置是否隐藏未读消息数，默认为不隐藏
conversationListLayout.hideUnreadDot(false);
//设置未读消息数展示位置，默认为左侧
conversationListLayout.showUnreadDotPosition(EaseConversationSetStyle.UnreadDotPosition.LEFT);
```

效果如下图：

![img](@static/images/android/easeim3.jpeg)
更多样式请参考 EaseContactListLayout 控件。

#### 增加长按菜单项

`EaseConversationListLayout` 提供了增加菜单项的 API，开发者可方便的增加更多的菜单功能。
示例代码如下：

```java
@Override
public void initView(Bundle savedInstanceState) {
   super.initView(savedInstanceState);
   ......
   conversationListLayout.addItemMenu(Menu.NONE, R.id.action_con_delete, 4, getString(R.string.ease_conversation_menu_delete));
}

......

@Override
public boolean onMenuItemClick(MenuItem item, int position) {
    EaseConversationInfo info = conversationListLayout.getItem(position);
    Object object = info.getInfo();
    if(object instanceof EMConversation) {
        switch (item.getItemId()) {
            case R.id.action_con_make_top :
                // 将会话置顶
                conversationListLayout.makeConversationTop(position, info);
                return true;
            case R.id.action_con_cancel_top :
                // 取消会话置顶
                conversationListLayout.cancelConversationTop(position, info);
                return true;
            case R.id.action_con_delete :
                showDeleteDialog(position, info);
                return true;
        }
    }
    return super.onMenuItemClick(item, position);
}
```

### 设置聊天窗口

聊天窗口包括标题栏（不包含在 EaseChatFragment 中），聊天区，输入区及扩展展示区，如下图所示:

![img](@static/images/android/easeim4.png)

标题区 EaseTitleBar 的具体布局及实现不在 EaseIMKit 库的聊天控件及 fragment 中，需要你自己去实现。
开发者可以在 EaseChatFragment 中获取到 EaseChatLayout 这个控件，然后通过这个控件进一步获取到获取其他控件，代码如下：

```java
//获取到聊天列表控件
EaseChatMessageListLayout messageListLayout = chatLayout.getChatMessageListLayout();
//获取到菜单输入父控件
EaseChatInputMenu chatInputMenu = chatLayout.getChatInputMenu();
//获取到菜单输入控件
IChatPrimaryMenu primaryMenu = chatInputMenu.getPrimaryMenu();
//获取到扩展区域控件
IChatExtendMenu chatExtendMenu = chatInputMenu.getChatExtendMenu();
//获取到表情区域控件
IChatEmojiconMenu emojiconMenu = chatInputMenu.getEmojiconMenu();
```

#### 修改聊天列表样式

聊天列表区域可以修改背景，文字，气泡，是否展示昵称及聊天展示样式等，更多设置请参考 IChatMessageItemSet。

#### 修改聊天列表背景

```java
//获取到聊天列表控件
EaseChatMessageListLayout messageListLayout = chatLayout.getChatMessageListLayout();
//设置聊天列表背景
messageListLayout.setBackground(new ColorDrawable(Color.parseColor("#DA5A4D")));
```

效果如下图：

![img](@static/images/android/easeim5.jpeg)

#### 修改头像属性

开发者可以设置默认头像和头像形状。

```java
//获取到聊天列表控件
EaseChatMessageListLayout messageListLayout = chatLayout.getChatMessageListLayout();
//设置默认头像
messageListLayout.setAvatarDefaultSrc(ContextCompat.getDrawable(mContext, R.drawable.ease_default_avatar));
//设置头像形状：0 为默认，1 为圆形，2 为方形
messageListLayout.setAvatarShapeType(1);
```

效果如下图：

![img](@static/images/android/easeim6.jpeg)

#### 修改聊天文本

开发者可以修改聊天文本的字体大小及字体颜色，发送方及接收方需保持一致。

```java
//获取到聊天列表控件
EaseChatMessageListLayout messageListLayout = chatLayout.getChatMessageListLayout();
//设置文本字体大小
messageListLayout.setItemTextSize((int) EaseCommonUtils.sp2px(mContext, 18));
//设置文本字体颜色
messageListLayout.setItemTextColor(ContextCompat.getColor(mContext, R.color.red));
```

效果如下图：

![img](@static/images/android/easeim7.jpeg)

#### 修改时间线样式

开发者可以修改时间线的背景，文字的大小及颜色。

```java
//获取到聊天列表控件
EaseChatMessageListLayout messageListLayout = chatLayout.getChatMessageListLayout();
//设置时间线的背景
messageListLayout.setTimeBackground(ContextCompat.getDrawable(mContext, R.color.gray_normal));
//设置时间线的文本大小
messageListLayout.setTimeTextSize((int) EaseCommonUtils.sp2px(mContext, 18));
//设置时间线的文本颜色
messageListLayout.setTimeTextColor(ContextCompat.getColor(mContext, R.color.black));
```

效果如下图：

![img](@static/images/android/easeim8.jpeg)

#### 修改聊天列表展示样式

开发者可以设置聊天列表的样式，发送方和接收方位于两侧还是位于一侧。

```java
//获取到聊天列表控件
EaseChatMessageListLayout messageListLayout = chatLayout.getChatMessageListLayout();
//设置聊天列表样式：两侧及均位于左侧
messageListLayout.setItemShowType(EaseChatMessageListLayout.ShowType.LEFT);
```

效果如下图：

![img](@static/images/android/easeim9.jpeg)

#### 修改输入区样式

输入区控件为 EaseChatInputMenu，它由输入控件 EaseChatPrimaryMenu，扩展控件 EaseChatExtendMenu 和表情控件 EaseEmojiconMenu 组成。

```java
//获取到菜单输入父控件
EaseChatInputMenu chatInputMenu = chatLayout.getChatInputMenu();
//获取到菜单输入控件
IChatPrimaryMenu primaryMenu = chatInputMenu.getPrimaryMenu();
//获取到扩展区域控件
IChatExtendMenu chatExtendMenu = chatInputMenu.getChatExtendMenu();
//获取到表情区域控件
IChatEmojiconMenu emojiconMenu = chatInputMenu.getEmojiconMenu();
```

开发者可以修改菜单输入控件的样式，其有 5 种模式，即 `完整模式`，`不可用语音模式`，`不可用表情模式`，`不可用语音和表情模式` 和 `只有文本输入模式`。

```java
//获取到菜单输入父控件
EaseChatInputMenu chatInputMenu = chatLayout.getChatInputMenu();
//获取到菜单输入控件
IChatPrimaryMenu primaryMenu = chatInputMenu.getPrimaryMenu();
if(primaryMenu != null) {
    //设置菜单样式为不可用语音模式
    primaryMenu.setMenuShowType(EaseInputMenuStyle.DISABLE_VOICE);
}
```

效果（EaseInputMenuStyle.DISABLE_VOICE）如下图：

![img](@static/images/android/easeim10.jpeg)

其他样式为：

完整模式（EaseInputMenuStyle.All）：

![img](@static/images/android/easeim11.jpeg)

不可用表情模式（EaseInputMenuStyle.DISABLE_EMOJICON）：

![img](@static/images/android/easeim12.jpeg)

不可用语音和表情模式（EaseInputMenuStyle.DISABLE_VOICE_EMOJICON）：

![img](@static/images/android/easeim13.jpeg)

只有文本输入模式（EaseInputMenuStyle.ONLY_TEXT）：

![img](@static/images/android/easeim14.jpeg)

#### 增加自定义消息类型及其布局

EaseIMKit 中已经为八种基本消息类型文本，表情，图片，视频，语音，文件，定位及 Custom 提供了基本的布局，ViewHolder 及 Delegate，开发者可以直接使用。但是这些类型很可能不能满足开发者的需求，那么就需要添加新的消息类型及其布局和逻辑。
使用 EaseIMKit 只需按照以下 5 步即可快速添加自定义消息类型。
下面我们以自定一个新的文本消息为例：

1、新建 ChatTxtNewAdapterDelegate 继承 EaseMessageAdapterDelegate。

```java
public class ChatTxtNewAdapterDelegate extends EaseMessageAdapterDelegate <EMMessage, EaseChatRowViewHolder> {
    @Override
    protected EaseChatRow getEaseChatRow(ViewGroup parent, boolean isSender) {
        return null;
    }

    @Override
    protected EaseChatRowViewHolder createViewHolder(View view, MessageListItemClickListener itemClickListener) {
        return null;
    }
}
```

2、新建 ChatRowTxtNew 继承 EaseChatRow 并实现相关方法

```java
public class ChatRowTxtNew extends EaseChatRow {
    private TextView contentView;

    public ChatRowTxtNew(Context context, boolean isSender) {
        super(context, isSender);
    }

    @Override
    protected void onInflateView() {
        inflater.inflate(isSender ? R.layout.ease_row_sent_txt_new : R.layout.ease_row_received_txt_new, this);
    }

    @Override
    protected void onFindViewById() {
        contentView = (TextView) findViewById(com.hyphenate.easeui.R.id.tv_chatcontent);
    }

    @Override
    protected void onSetUpView() {
        EMTextMessageBody txtBody = (EMTextMessageBody) message.getBody();
        contentView.setText(txtBody.getMessage());
    }
}
```

布局文件以 R.layout.ease_row_sent_txt_new 为例，如下：

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="https://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    xmlns:tools="https://schemas.android.com/tools"
    android:gravity="center_horizontal"
    android:orientation="vertical"
    android:paddingTop="13dp">

    <TextView
        android:id="@+id/timestamp"
        style="@style/chat_text_date_style"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content" />

    <RelativeLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="@dimen/margin_chat_activity" >

        <com.hyphenate.easeui.widget.EaseImageView
            android:id="@+id/iv_userhead"
            style="@style/ease_row_sent_iv_userhead_style"/>

        <RelativeLayout
            android:id="@+id/bubble"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginRight="@dimen/margin_chat_activity"
            android:layout_toLeftOf="@id/iv_userhead"
            android:minWidth="30dp"
            android:padding="8dp"
            android:layout_marginTop="2dp"
            android:background="@drawable/ease_chat_bubble_send_bg"
            android:layout_below="@id/tv_userid">

            <TextView
                android:id="@+id/tv_chatcontent"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_centerVertical="true"
                android:autoLink="web"
                android:gravity="center|left"
                android:lineSpacingExtra="2dp"
                android:maxWidth="225.0dip"
                android:minHeight="@dimen/ease_chat_text_min_height"
                android:textColor="#000000"
                tools:text="环信"
                android:textSize="15sp" />

        </RelativeLayout>

        <ImageView
            android:id="@+id/msg_status"
            android:layout_toLeftOf="@id/bubble"
            style="@style/ease_row_sent_iv_fail_style"/>

        <TextView
            android:id="@+id/tv_ack"
            style="@style/chat_text_name_style"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_centerVertical="true"
            android:layout_toLeftOf="@id/bubble"
            android:layout_marginRight="@dimen/ease_chat_ack_margin_bubble"
            android:text="@string/text_ack_msg"
            android:textSize="12sp"
            android:visibility="invisible" />

        <TextView
            android:id="@+id/tv_delivered"
            style="@style/chat_text_name_style"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_centerVertical="true"
            android:layout_toLeftOf="@id/bubble"
            android:layout_marginRight="@dimen/ease_chat_ack_margin_bubble"
            android:text="@string/text_delivered_msg"
            android:textSize="12sp"
            android:visibility="invisible" />

        <ProgressBar
            android:id="@+id/progress_bar"
            style="?android:attr/progressBarStyle"
            android:layout_width="25dp"
            android:layout_height="25dp"
            android:indeterminateDrawable="@drawable/ease_chat_loading_progress_bar"
            android:layout_toLeftOf="@id/bubble"
            android:visibility="invisible" />

        <TextView
            android:id="@+id/tv_userid"
            style="@style/chat_text_name_style"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginRight="@dimen/chat_nick_margin_left"
            android:textSize="@dimen/chat_nick_text_size"
            android:layout_toLeftOf="@id/iv_userhead"
            android:visibility="gone" />

    </RelativeLayout>

</LinearLayout>
```

其中 ID 为 bubble 控件外的控件为发送端布局的基本组成，需要开发者拷贝进去。一般而言，开发者需要添加的控件，放在 bubble 控件内即可。如上所示，开发者只需在 `onFindViewById()` 方法中找到自己添加的控件，并在 `onSetUpView()` 方法内处理展示逻辑即可。

3、新建 ChatTxtNewViewHolder 继承 EaseChatRowViewHolder 并实现相关方法

```java
public class ChatTxtNewViewHolder extends EaseChatRowViewHolder {
    public ChatTxtNewViewHolder(@NonNull View itemView, MessageListItemClickListener itemClickListener) {
        super(itemView, itemClickListener);
    }

    @Override
    public void onBubbleClick(EMMessage message) {
        super.onBubbleClick(message);
        // 实现相关点击方法
    }
}
```

自定义的 ChatTxtNewViewHolder 可以复写实现 onBubbleClick(EMMessage message) 及 onResendClick(EMMessage message) 方法。需要注意的是，如果在其他地方设置了 MessageListItemClickListener 监听，并将相应的方法实现并返回 true 以后，ViewHolder 中的这两个方法会被拦截。 自定义的 ViewHolder 可以复写 onDetachedFromWindow() 方法，可以做一些释放资源的处理。 自定义的 ViewHolder 需要根据消息的方向（发送发或者接收方）对消息进行处理，可以分别复写 handleSendMessage(final EMMessage message) 或者 handleReceiveMessage(EMMessage message)。

4、补全 ChatTxtNewAdapterDelegate 并重写 isForViewType 方法

```java
public class ChatTxtNewAdapterDelegate extends EaseMessageAdapterDelegate <EMMessage, EaseChatRowViewHolder> {
    @Override
    public boolean isForViewType(EMMessage item, int position) {
        return item.getType() == EMMessage.Type.TXT && item.getBooleanAttribute(EaseConstant.MESSAGE_ATTR_IS_TXT_NEW, false);
    }

    @Override
    protected EaseChatRow getEaseChatRow(ViewGroup parent, boolean isSender) {
        return new ChatRowTxtNew(parent.getContext(), isSender);
    }

    @Override
    protected EaseChatRowViewHolder createViewHolder(View view, MessageListItemClickListener itemClickListener) {
        return new ChatTxtNewViewHolder(view, itemClickListener);
    }
}
```

:::notice
（1）相同的消息类型（比如例子中消息类型是 EMMessage.Type.TXT）且通过标记判断类型时，在第 5 步注册对话类型时，应将该对话类型注册于基类的对话类型之前（即 ChatTxtNewAdapterDelegate 注册应在 EaseTextAdapterDelegate 之前）。

（2）对于 `item.getBooleanAttribute(EaseConstant.MESSAGE_ATTR_IS_TXT_NEW, false)` 可以理解为一种标记，在发送消息时设置，如下；
:::

```java
/**
 * 发送新文本消息
 * @param content
 */
public void sendTxtNewMessage(String content) {
    EMMessage message = EMMessage.createTxtSendMessage(content, toChatUsername);
    message.setAttribute(DemoConstant.MESSAGE_ATTR_IS_TXT_NEW, true);
    EMClient.getInstance().chatManager().sendMessage(message);
}
```

其中 `DemoConstant.MESSAGE_ATTR_IS_TXT_NEW` 为定义的一个常量，通常为字符串类型。

5、注册 ChatTxtNewAdapterDelegate 对话类型（通过 EaseMessageTypeSetManager 进行注册）

```java
/**
 * 注册对话类型
 */
private void registerConversationType() {
    EaseMessageTypeSetManager.getInstance()
            .addConversationType(EaseExpressionAdapterDelegate.class)       //自定义表情
            .addConversationType(EaseFileAdapterDelegate.class)             //文件
            ......
            .addConversationType(ChatTxtNewAdapterDelegate.class)           //新文本消息
            .setDefaultConversionType(EaseTextAdapterDelegate.class);       //文本
}
```

需要开发者注意的是，自定义的消息类型需要注册到 EaseMessageTypeSetManager 中，具体用法可以参考环信 App 中的 [DemoHelper](https://github.com/easemob/chat-android/blob/master/app/src/main/java/com/hyphenate/easeim/DemoHelper.java) 类中的 `registerConversationType()` 方法，并在初始化时调用 `registerConversationType()` 方法。

开发者在注册消息类型时，一定要在最后设置默认项（即调用 `setDefaultConversionType()`），并建议将 `EaseTextAdapterDelegate` 设置默认项。如果没有符合的消息类型，EaseIMKit 会选择默认的消息类型进行展示(注：需要展示的消息类型也需要符合默认消息的消息类型，否则会造成 EMMessageBody 强转时报错)。

#### 增加长按菜单项

EaseChatLayout 提供了增加菜单项的 API，开发者可方便的增加更多的菜单功能。

示例代码如下：

```java
@Override
public void initView(Bundle savedInstanceState) {
    super.initView(savedInstanceState);
    ......
    // 构建菜单项 model 并通过 EaseChatLayout 添加
    MenuItemBean itemMenu = new MenuItemBean(0, R.id.action_chat_forward, 11, getString(R.string.action_forward));
    itemMenu.setResourceId(R.drawable.ease_chat_item_menu_forward);
    chatLayout.addItemMenu(itemMenu );
}

......

@Override
public boolean onMenuItemClick(MenuItemBean item, EMMessage message) {
    switch (item.getItemId()) {
        case R.id.action_chat_forward :
            // 增加实现逻辑，并返回 true
            return true;
    }
    return false;
}
```

#### 增加更多扩展功能

EaseIMKit 提供了常用的一些扩展功能，比如发送图片，发送文件，发送定位等，但是实际开发中可能满足不了开发者的需求，EaseIMKit 提供了增加扩展功能的接口，以实现发送短视频消息、音视频通话等。

以添加视频通话和音视频会议为例，示例代码如下：

```java
private void resetChatExtendMenu() {
    // 获取到扩展功能控件
    IChatExtendMenu chatExtendMenu = chatLayout.getChatInputMenu().getChatExtendMenu();
    if(chatExtendMenu == null) {
        return;
    }
    // 清除所有的扩展项
    chatExtendMenu.clear();
    // 添加自己需要的扩展功能
    chatExtendMenu.registerMenuItem(R.string.attach_picture, R.drawable.ease_chat_image_selector, EaseChatExtendMenu.ITEM_PICTURE);
    chatExtendMenu.registerMenuItem(R.string.attach_take_pic, R.drawable.ease_chat_takepic_selector, EaseChatExtendMenu.ITEM_TAKE_PICTURE);
    // 根据消息类型添加不同的扩展功能
    if(chatType == EaseConstant.CHATTYPE_SINGLE){
        chatExtendMenu.registerMenuItem(R.string.attach_media_call, R.drawable.em_chat_video_call_selector, ITEM_VIDEO_CALL);
    }
    if (chatType == EaseConstant.CHATTYPE_GROUP) { // 音视频会议
        chatExtendMenu.registerMenuItem(R.string.voice_and_video_conference, R.drawable.em_chat_video_call_selector, ITEM_CONFERENCE_CALL);
    }
}

......

@Override
public void onChatExtendMenuItemClick(View view, int itemId) {
    super.onChatExtendMenuItemClick(view, itemId);
    // 只需实现不满足需求或者开发者自己添加的扩展功能
    switch (itemId) {
        case ITEM_VIDEO_CALL:
            // 实现条目点击事件
            break;
        case ITEM_CONFERENCE_CALL:
            // 实现条目点击事件
            break;
    }
}
```

#### 增加自定义表情

EaseIMKit 也提供了增加自定义表情的接口，开发者可仿照 EmojiconExampleGroupData 进行定义类型的表情类，然后调用相应接口加入即可。

代码如下：

```java
// 添加扩展表情
chatLayout.getChatInputMenu().getEmojiconMenu().addEmojiconGroup(EmojiconExampleGroupData.getData());
```

### 设置联系人列表

通讯录列表界面可以设置如下样式：

- 展示模式：分为简洁模式和常规模式
- 条目：设置条目背景，条目高度及 header 背景
- 头像：设置默认头像，头像样式及头像大小等

在 EaseContactListFragment 及其子类中可以直接获取到 EaseContactLayout 这个控件，然后通过这个控件进行设置。

代码如下：

```java
// 获取列表控件
EaseContactListLayout contactList = contactLayout.getContactList();
// 设置条目高度
contactList.setItemHeight((int) EaseCommonUtils.dip2px(mContext, 80));
// 设置条目背景
contactList.setItemBackGround(ContextCompat.getDrawable(mContext, R.color.gray));
// 设置头像样式：0 为默认，1 为圆形，2 为方形(设置方形时，需要配合设置 avatarRadius，默认的 avatarRadius 为 50dp)
contactList.setAvatarShapeType(2);
// 设置头像圆角
contactList.setAvatarRadius((int) EaseCommonUtils.dip2px(mContext, 5));
// 设置 header 背景
contactList.setHeaderBackGround(ContextCompat.getDrawable(mContext, R.color.white));
```

效果如图：

![img](@static/images/android/easeim15.jpeg)

设置简洁模式

```java
//设置为简洁模式
contactLayout.showSimple();
```

效果如图：

![img](@static/images/android/easeim16.jpeg)

#### 增加长按菜单项

EaseContactListLayout 提供了增加菜单项的 API，开发者可方便的增加更多的菜单功能。

示例代码如下：

```java
// 通过增加 `OnPopupMenuPreShowListener` 监听，并在 `onMenuPreShow` 中增加菜单项更简单
@Override
public void onMenuPreShow(EasePopupMenuHelper menuHelper, int position) {
    super.onMenuPreShow(menuHelper, position);
    // 增加需要的菜单项，其中传入的第三项 order 决定了菜单项的位置
    menuHelper.addItemMenu(1, R.id.action_friend_block, 2, getString(R.string.em_friends_move_into_the_blacklist_new));
    menuHelper.addItemMenu(1, R.id.action_friend_delete, 1, getString(R.string.ease_friends_delete_the_contact));
}

......

@Override
public boolean onMenuItemClick(MenuItem item, int position) {
    EaseUser user = contactLayout.getContactList().getItem(position);
    switch (item.getItemId()) {
        case R.id.action_friend_block :
            // 增加处理逻辑并返回 `true`
            return true;
        case R.id.action_friend_delete:
            // 增加处理逻辑并返回 `true`
            return true;
    }
    return super.onMenuItemClick(item, position);
}
```

#### 增加头布局

EaseIMKit 默认是不再通讯录列表之前增加头布局的，但是内部预设了添加头布局的逻辑，开发者可通过 EaseContactListLayout 提供的 API 快速的增加一个或者多个头布局。

示例代码如下：

```java
/**
 * 添加头布局
 */
public void addHeader() {
    // 增加多个头布局
    contactLayout.getContactList().addCustomItem(CUSTOM_NEW_CHAT, R.drawable.em_friends_new_chat, getString(R.string.em_friends_new_chat));
    contactLayout.getContactList().addCustomItem(CUSTOM_GROUP_LIST, R.drawable.em_friends_group_chat, getString(R.string.em_friends_group_chat));
    contactLayout.getContactList().addCustomItem(CUSTOM_CHAT_ROOM_LIST, R.drawable.em_friends_chat_room, getString(R.string.em_friends_chat_room));
}

......

@Override
public void initListener() {
    super.initListener();
    ......
    contactLayout.getContactList().setOnCustomItemClickListener(new OnItemClickListener() {
        @Override
        public void onItemClick(View view, int position) {
            EaseContactCustomBean item = contactLayout.getContactList().getCustomAdapter().getItem(position);
            switch (item.getId()) {
                case CUSTOM_NEW_CHAT :
                    // 增加实现逻辑
                    break;
                case CUSTOM_GROUP_LIST :
                    // 增加实现逻辑
                    break;
                case CUSTOM_CHAT_ROOM_LIST :
                    // 增加实现逻辑
                    break;
            }
        }
    });
}
```

### 设置用户头像和昵称属性

#### 设置头像和昵称

环信 IM SDK 不做用户信息存储，如果用户想要展示自定义的头像及昵称，可以通过 EaseUserProfileProvider 进行提供。

首先需要在合适的时机去设置 EaseUserProfileProvider，例如：

```java
EaseIM.getInstance().setUserProvider(new EaseUserProfileProvider() {
    @Override
    public EaseUser getUser(String username) {
        //根据 username，从数据库中或者内存中取出之前保存的用户信息，如从数据库中取出的用户对象为 DemoUserBean
        DemoUserBean bean = getUserFromDbOrMemery(username);
        EaseUser user = new EaseUser(username);
        ......
        //设置用户昵称
        user.setNickname(bean.getNickname());
        //设置头像地址
        user.setAvatar(bean.getAvatar());
        //最后返回构建的 EaseUser 对象
        return user;
    }
});
```

EaseIMKit 中会话列表，聊天列表及联系人列表，内部已经添加 EaseUserProfileProvider 的判断，当展示数据时优先从 EaseUserProfileProvider 获取头像和昵称数据，如果有则展示，如果没有头像采用默认头像，昵称展示为环信 ID。

:::notice 建议方案
开发者先将相关用户信息从服务器中获取并存储到数据库中，在 getUser(String username) 方法调用时，从数据库中根据 username（环信 ID）取出相应的用户数据，生成 EaseUser 对象 user，并给 user 赋值 nickname 及 avatar 属性，最后返回这个 user 即可。
:::

#### 统一设置头像样式

EaseIMKit 提供了 `EaseAvatarOptions` 这个类用于全局配置头像的样式，包括形状，圆角半径，描边宽度及描边颜色。会话，聊天及联系人中已经增加了对于 EaseAvatarOptions 的支持。

示例代码如下：

```java
//设置头像配置属性
EaseIM.getInstance().setAvatarOptions(getAvatarOptions());
......
/**
 * 统一配置头像
 * @return
 */
private EaseAvatarOptions getAvatarOptions() {
    EaseAvatarOptions avatarOptions = new EaseAvatarOptions();
    //设置头像形状为圆形，1 代表圆形，2 代表方形
    avatarOptions.setAvatarShape(1);
    return avatarOptions;
}
```

使用时可以直接调用 EaseUserUtils 中的 `setUserAvatarStyle(EaseImageView imageView)` 方法即可设置。

## 事件处理

EaseIMKit 还帮助开发者实现了一系列的事件监听接口，比如条目的点击事件，条目的长按事件，菜单项的点击事件等。

### 会话列表

#### 条目点击事件

开发者如果使用 `EaseConversationListFragment` 及其子类，可以重写 `onItemClick(View view, int position)` 方法即可。

代码如下：

```java
@Override
public void onItemClick(View view, int position) {
    super.onItemClick(view, position);
    //添加点击事件实现逻辑
}
```

开发者如果直接使用的 `EaseConversationListLayout` 控件，则可通过该控件设置条目的点击事件。

代码如下：

```java
conversationListLayout.setOnItemClickListener(new OnItemClickListener() {
    @Override
    public void onItemClick(View view, int position) {
        //添加点击事件实现逻辑
    }
});
```

#### 长按事件及弹出菜单点击事件

`EaseConversationListLayout` 中已经实现了一套默认的长按弹出菜单逻辑，开发者只需实现弹出菜单的点击事件即可。

如果开发者使用的是 `EaseConversationListFragment` 及其子类，则直接重写 `onMenuItemClick(MenuItem item, int position)` 即可。

代码如下：

```java
@Override
public boolean onMenuItemClick(MenuItem item, int position) {
    //添加具体的点击事件实现逻辑，并返回 true
    return super.onMenuItemClick(item, position);
}
```

开发者如果直接使用的 EaseConversationListLayout 控件，则可通过该控件设置弹出菜单的点击事件。

代码如下：

```java
conversationListLayout.setOnPopupMenuItemClickListener(new OnPopupMenuItemClickListener() {
    @Override
    public boolean onMenuItemClick(MenuItem item, int position) {
        //添加具体的点击事件实现逻辑，并返回 true
        return false;
    }
});
```

如果开发者需要自己实现弹出菜单，通过 EaseConversationListLayout 控件添加条目的长按监听并实现即可。

代码如下：

```java
conversationListLayout.setOnItemLongClickListener(new OnItemLongClickListener() {
    @Override
    public boolean onItemLongClick(View view, int position) {
        //添加弹出菜单的逻辑，并返回 true
        return false;
    }
});
```

### 聊天区域

#### 聊天列表事件

开发者如果使用的是 EaseChatFragment 及其子类，则可以根据需要重写相关的事件方法即可。聊天列表中的常用监听事件均封装到了 OnChatLayoutListener 接口中，EaseChatFragment 已经设置了该监听。

`OnChatLayoutListener` 中有如下事件监听：

```java
public interface OnChatLayoutListener {
    /**
     * 点击消息 bubble 区域
     * @param message
     * @return
     */
    boolean onBubbleClick(EMMessage message);

    /**
     * 长按消息 bubble 区域
     * @param v
     * @param message
     * @return
     */
    boolean onBubbleLongClick(View v, EMMessage message);

    /**
     * 点击头像
     * @param username
     */
    void onUserAvatarClick(String username);

    /**
     * 长按头像
     * @param username
     */
    void onUserAvatarLongClick(String username);

    /**
     * 条目点击
     * @param view
     * @param itemId
     */
    void onChatExtendMenuItemClick(View view, int itemId);

    /**
     * EditText 文本变化监听
     * @param s
     * @param start
     * @param before
     * @param count
     */
    void onTextChanged(CharSequence s, int start, int before, int count);

    /**
     * 聊天中错误信息
     * @param code
     * @param errorMsg
     */
    void onChatError(int code, String errorMsg);

    /**
     * 用于监听其他人正在数据事件
     * @param action 输入事件 TypingBegin为开始 TypingEnd 为结束
     */
    default void onOtherTyping(String action){}

}
```

如果开发者使用的是 EaseChatLayout 控件，则通过该控件实现 OnChatLayoutListener 接口即可。

#### 长按事件及弹出菜单点击事件

EaseChatLayout 中已经实现了一套默认的长按弹出菜单逻辑，并对默认的菜单项进行了处理，如果开发者对默认菜单项有其他实现需求，只需实现弹出菜单的点击事件即可。

如果开发者使用的是 EaseChatFragment 及其子类，则直接重写 onMenuItemClick(MenuItemBean item, EMMessage message) 即可。

代码如下：

```java
@Override
public boolean onMenuItemClick(MenuItemBean item, EMMessage message) {
    //添加菜单条目点击事件实现逻辑，并返回 true
    //返回 true 表示不采用默认的实现逻辑
    return false;
}
```

如果开发者需要在弹出菜单展示前对菜单项进行处理，重写 `onPreMenu(EasePopupWindowHelper helper, EMMessage message)` 并处理即可。

示例代码如下：

```java
@Override
public void onPreMenu(EasePopupWindowHelper helper, EMMessage message) {
    // 默认两分钟后，即不可撤回
    if(System.currentTimeMillis() - message.getMsgTime() > 2 * 60 * 1000) {
        helper.findItemVisible(R.id.action_chat_recall, false);
    }
    EMMessage.Type type = message.getType();
    helper.findItemVisible(R.id.action_chat_forward, false);
    switch (type) {
        case TXT:
            if(!message.getBooleanAttribute(DemoConstant.MESSAGE_ATTR_IS_VIDEO_CALL, false)
                    && !message.getBooleanAttribute(DemoConstant.MESSAGE_ATTR_IS_VOICE_CALL, false)) {
                helper.findItemVisible(R.id.action_chat_forward, true);
            }
            break;
        case IMAGE:
            helper.findItemVisible(R.id.action_chat_forward, true);
            break;
    }

    if(chatType == DemoConstant.CHATTYPE_CHATROOM) {
        helper.findItemVisible(R.id.action_chat_forward, true);
    }
}
```

开发者如果直接使用的 EaseChatLayout 控件，则可通过该控件设置弹出菜单的点击事件。

代码如下：

```java
chatLayout.setOnPopupWindowItemClickListener(new OnMenuChangeListener() {
    @Override
    public void onPreMenu(EasePopupWindowHelper helper, EMMessage message) {
        // 菜单预处理逻辑
    }
    @Override
    public boolean onMenuItemClick(MenuItemBean item, EMMessage message) {
        // 菜单项点击事件，如果默认实现不满足，则自己实现并返回 true。
        return false;
    }
});
```

如果开发者需要自己实现弹出菜单，通过 EaseChatLayout 控件找到 EaseChatMessageListLayout 并添加条目的长按监听并实现即可。

代码如下：

```java
chatLayout.getChatMessageListLayout().setOnItemLongClickListener(new OnItemLongClickListener() {
    @Override
    public boolean onItemLongClick(View view, int position) {
        //添加弹出菜单的逻辑，并返回 true
        return false;
    }
});
```

### 通讯录列表

#### 条目点击事件

开发者如果使用 EaseContactListFragment 及其子类，可以重写 `onItemClick(View view, int position)` 方法即可。

代码如下：

```java
@Override
public void onItemClick(View view, int position) {
    super.onItemClick(view, position);
    //添加点击事件实现逻辑
}
```

开发者如果直接使用的 EaseContactLayout 控件，则可通过该控件找到 EaseContactListLayout 并设置条目的点击事件。

代码如下：

```java
contactLayout.getContactList().setOnItemClickListener(new OnItemClickListener() {
    @Override
    public void onItemClick(View view, int position) {
        //添加点击事件实现逻辑
    }
});
```

#### 长按事件及弹出菜单点击事件

EaseContactListLayout 中已经实现了一套默认的长按弹出菜单逻辑，开发者只需实现弹出菜单的点击事件即可。

如果开发者使用的是 EaseContactListFragment 及其子类，则直接重写 `onMenuItemClick(MenuItem item, int position)` 即可。

代码如下：

```java
@Override
public boolean onMenuItemClick(MenuItem item, int position) {
    // 添加具体的点击事件实现逻辑，并返回 'true'
    return super.onMenuItemClick(item, position);
}
```

如果开发者需要在弹出菜单展示前对菜单项进行处理，重写 `onMenuPreShow(EasePopupWindowHelper helper, EMMessage message)` 并处理即可。

开发者如果直接使用的 EaseContactLayout 控件，则可通过该控件找到 EaseContactListLayout 并设置弹出菜单的点击事件。

代码如下：

```java
contactLayout.getContactList().setOnPopupMenuItemClickListener(new OnPopupMenuItemClickListener() {
    @Override
    public boolean onMenuItemClick(MenuItem item, int position) {
        //添加具体的点击事件实现逻辑，并返回 true
        return false;
    }
});
```

相应的菜单项预处理，需要通过 EaseContactListLayout 设置菜单预处理监听事件。 代码如下：

```java
contactLayout.getContactList().setOnPopupMenuPreShowListener(new OnPopupMenuPreShowListener() {
    @Override
    public void onMenuPreShow(EasePopupMenuHelper menuHelper, int position) {
        //菜单预处理逻辑
    }
});
```

如果开发者需要自己实现弹出菜单，通过 EaseContactListLayout 控件添加条目的长按监听并实现即可。

代码如下：

```java
contactLayout.getContactList().setOnItemLongClickListener(new OnItemLongClickListener() {
    @Override
    public boolean onItemLongClick(View view, int position) {
        //添加弹出菜单的逻辑，并返回 true
        return false;
    }
});
```

## 功能扩展

### 系统消息

EaseIMKit 中 EaseConversationListLayout 已经封装了 IM 通知的展示逻辑，但是需要开发者将 IM 的通知封装成系统消息并保存到本地数据库。为了方便开发者封装成符合 EaseIMKit 能够使用的系统消息，EaseIMKit 中提供了 EaseSystemMsgManager 管理类，开发者可通过该管理类，方便的封装及更新系统消息。

EaseIMKit 可处理的系统消息有如下要求：

```java
// 设置为文本消息
EMMessage emMessage = EMMessage.createReceiveMessage(EMMessage.Type.TXT);
// 设置 from 为固定的 "em_system"
emMessage.setFrom(EaseConstant.DEFAULT_SYSTEM_MESSAGE_ID);
emMessage.setMsgId(UUID.randomUUID().toString());
emMessage.setStatus(EMMessage.Status.SUCCESS);
```

当然 EaseSystemMsgManager 管理类已经做了默认处理，开发者只需传入文本内容（会话列表中展示的内容）及扩展内容 ext(Map<String, Object>)即可。 示例如下：

```java
@Override
public void onFriendRequestDeclined(String username) {
    EMLog.i("ChatContactListener", "onFriendRequestDeclined");
    Map<String, Object> ext = EaseSystemMsgManager.getInstance().createMsgExt();
    ext.put(DemoConstant.SYSTEM_MESSAGE_FROM, username);
    ext.put(DemoConstant.SYSTEM_MESSAGE_STATUS, InviteMessageStatus.BEREFUSED.name());
    EMMessage message = EaseSystemMsgManager.getInstance().createMessage(PushAndMessageHelper.getSystemMessage(ext), ext);
    ......
}
```

同时 EaseConversationListLayout 提供了是否展示系统消息的 API，showSystemMessage(boolean show) 用于控制是否展示系统消息。

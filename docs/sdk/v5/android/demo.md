# EasyIM Android Demo

The EasyIM Android Demo provides user login, one-to-one chat, chat groups, message threads, sending and management of messages (text, emoji, voice, video, image, file, and others), conversation management, friend management, user attributes, presence, and real-time audio and video calls.

## Try the Demo

1. [Download the Demo](https://www.easemob.com/download/demo).
2. Enter your phone number, obtain a verification code, and enter it. **Verification codes are not supported on an emulator. Use a physical device.**
3. Agree to the Easemob Terms of Service and Easemob Privacy Policy, and click **Login** to log in to the Demo.

![img](/images/demo/android_login.png =350x750)

The following are some UI examples:

<ImageGallery :columns="2">
  <ImageItem src="/images/uikit/chatuikit/android/main_chat.png" title="One-to-one chat page" />
  <ImageItem src="/images/uikit/chatuikit/android/main_chat_group.png" title="Group chat page" />
  <ImageItem src="/images/uikit/chatuikit/android/main_conversation_list.png" title="Conversation list" />
  <ImageItem src="/images/uikit/chatuikit/android/main_contact_list.png" title="Contacts" />
</ImageGallery>

## Quickly Run the Demo Source Code

### Development environment requirements

- Android Studio Flamingo | 2022.2.1 or later
- Gradle 8.0 or later
- targetVersion 26 or later
- Android SDK API 21 or later
- JDK 17 or later

### Run the project

1. [Create an app](/product/console/app_create.html). 
2. [Obtain the app's App Key](/product/console/app_manage.html#管理应用).
3. [Create a user](/product/console/operation_user.html#创建用户).
4. Download the EasyIM Demo project source code from [GitHub](https://github.com/easemob/easemob-demo-android) or [Gitee](https://gitee.com/easemob-code/easemob-demo-android).
5. Open Android Studio, click **File > Open**, and open the downloaded Demo (`easemob-demo-android`) project root directory.
6. Enter your app's App Key in `local.properties` in the Demo project root directory using the format `APPKEY = 你申请的appkey`.
7. If the data center corresponding to the App Key is China Zone 1, add `CHAT_REST_SERVER_DOMAIN=a1.easemob.com` to `local.properties`. If it is China Zone 2, add `CHAT_REST_SERVER_DOMAIN=ngi-a1.easemob.com`.
8. Build and run the project.
9. Log in with the registered user ID and password.

### App Server

To help developers quickly try EasyIM features, the Demo source code uses a registered user ID and password to log in directly by default and does not require a deployed App Server. In this mode, phone verification codes, user avatars, EaseCallKit real-time audio and video, and related features are unavailable. Deploy App Server to try all features.

App Server provides the following features for the Demo:

- Obtain a verification code through a phone number.
- Return an Easemob user ID and user token through a phone number and verification code.
- Upload an avatar and return its URL.
- Generate a token required for [EaseCallKit](/callkit/android/easecallkit.html) login based on user information.
- Retrieve the mapping between the Easemob user ID and Agora UID for audio and video calls.

Deploy App Server as follows:

1. Deploy App Server. See the server source code on [GitHub](https://github.com/easemob/easemob-demo-appserver/tree/dev-demo) or [Gitee](https://gitee.com/easemob-code/easemob-demo-appserver/tree/dev-demo).
2. In `local.properties` in the Demo project root directory, replace the following configuration properties according to your deployed App Server:
 
```gradle
# App Server domain or IP address
APP_SERVER_DOMAIN=xxx.xxx.com

# App Server user management URL path
APP_BASE_USER=/inside/app/user

# App Server chat group management URL path
APP_BASE_GROUP=/inside/app/group

# App Server login management URL path
APP_SERVER_LOGIN=/login/V2

# App Server user image upload URL path
APP_UPLOAD_AVATAR=/avatar/upload

# App Server chat group image URL path
APP_GROUP_AVATAR=/avatarurl

# URL path for retrieving the RTC token used for CallKit login from the server
APP_RTC_TOKEN_URL=/inside/token/rtc/channel

# RTC APP ID (https://doc.easemob.com/callkit/android/easecallkit.html)
RTC_APPID=xxxxxxxxxxxxxxxxxxxxxxx

# URL path for retrieving the mapping between RTC UID and Easemob username
APP_RTC_CHANNEL_MAPPER_URL=/inside/agora/channel/mapper

# AES key used to encrypt App Server parameters when obtaining a verification code
SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxx
```

3. Enter `LOGIN_WITH_APPSERVER = true` in `local.properties` in the Demo project root directory to enable App Server and try all features.
4. (Optional) Configure offline push.
   
After obtaining the push Appkey/AppSecret/AppID from each vendor, enter them in `local.properties` in the Demo project root directory to use the corresponding vendor's push service.

```gradle
MEIZU_PUSH_APPKEY=xxxxxxxxxxxxxxxxxxxxxxx
MEIZU_PUSH_APPID=xxxxxxxxxxxxxxxxxxxxxxx
OPPO_PUSH_APPKEY=xxxxxxxxxxxxxxxxxxxxxxx
OPPO_PUSH_APPSECRET=xxxxxxxxxxxxxxxxxxxxxxx
VIVO_PUSH_APPID=xxxxxxxxxxxxxxxxxxxxxxx
VIVO_PUSH_APPKEY=xxxxxxxxxxxxxxxxxxxxxxx
MI_PUSH_APPKEY=xxxxxxxxxxxxxxxxxxxxxxx
MI_PUSH_APPID=xxxxxxxxxxxxxxxxxxxxxxx
FCM_SENDERID=xxxxxxxxxxxxxxxxxxxxxxx
HONOR_PUSH_APPID=xxxxxxxxxxxxxxxxxxxxxxx
```

**The App Key on the server must be the same as the App Key on the client.**

## Demo Project Structure

### Demo architecture

```
└── com 
    └── hyphenate
        └── chatdemo
            ├── DemoApplication.kt  // Program entry point
            ├── DemoHelper.kt   // App helper class
            ├── MainActivity.kt // Main page
            ├── base    // Contains base classes
            │   ├── ActivityState.kt
            │   ├── BaseDialogFragment.kt   // Dialog base classes
            │   ├── BaseInitActivity.kt // Activity base class
            │   ├── ErrorCode.kt    // Common error codes
            │   └── UserActivityLifecycleCallbacks.kt
            ├── bean    // Serializable bean classes
            ├── callkit
            │   ├── CallKitActivityLifecycleCallback.kt // Activity lifecycle callback class in CallKit
            │   ├── CallKitManager.kt   // CallKit manager class
            │   ├── CallUserInfo.kt
            │   ├── ConferenceInviteActivity.kt
            │   ├── ConferenceInviteAdapter.kt
            │   ├── ConferenceInviteFragment.kt
            │   ├── ConferenceMemberSelectViewHolder.kt
            │   ├── MultipleVideoActivity.kt    // Multi-user audio and video page
            │   ├── VideoCallActivity.kt    // One-to-one audio and video page
            │   ├── extensions  // CallKit extension function classes
            │   ├── viewholder  // Adapters for one-to-one and group call message notification types, including event handling
            │   └── views   // Layouts for one-to-one and group call message notification types
            ├── common  // Common app classes
            │  
            ├── controller  
            │   └── PresenceController.kt   // Presence-related manager class
            ├── interfaces  // Interface definition classes
            ├── repository  // App data repository
            ├── ui
            │   ├── chat
            │   │   ├── ChatActivity.kt // One-to-one and group chat Activity
            │   │   ├── ChatFragment.kt // One-to-one and group chat Fragment
            │   │   └── CustomMessagesAdapter.kt    // Custom message adapter
            │   ├── contact
            │   │   ├── ChatContactCheckActivity.kt     // Page for checking whether a user is a friend
            │   │   ├── ChatContactDetailActivity.kt    // Friend details page
            │   │   ├── ChatContactListFragment.kt      // Friend list page
            │   │   ├── ChatContactRemarkActivity.kt    // Friend remarks page
            │   │   └── ChatNewRequestActivity.kt       // New request item on the friend page
            │   ├── conversation
            │   │   └── ConversationListFragment.kt // Conversation list page
            │   ├── group
            │   │   ├── ChatCreateGroupActivity.kt  // Create chat group page
            │   │   └── ChatGroupDetailActivity.kt  // Chat group details page
            │   ├── login
            │   │   ├── LoginActivity.kt    // Login page Activity
            │   │   ├── LoginFragment.kt    // Login page Fragment
            │   │   ├── ServerSetFragment.kt
            │   │   └── SplashActivity.kt   // Splash page
            │   └── me // Pages corresponding to buttons under Me
            │       ├── AboutActivity.kt    
            │       ├── AboutMeFragment.kt   // About Me page
            │       ├── CurrencyActivity.kt     // General settings page for dark mode, language, styles, and others
            │       ├── EditUserNicknameActivity.kt // Change user nickname page
            │       ├── FeaturesActivity.kt
            │       ├── LanguageSettingActivity.kt
            │       ├── NotifyActivity.kt
            │       ├── StyleSettingActivity.kt
            │       ├── UserInformationActivity.kt
            │       ├── WebViewActivity.kt
            │       └── controller
            ├── uikit
            │   └── UIKitManager.kt // UIKit manager class
            ├── utils   // Utility classes
            └── viewmodel // Contains ViewModel classes
```


### Core classes

| Module | Description | 
| :------------------- | :----- |
| DemoHelper | Easemob Demo global helper class. It primarily initializes the EasyIM SDK and [ChatUIKit](/uikit/chatuikit/android/chatuikit_overview.html), [EaseCallKit](/callkit/android/easecallkit.html), and related components, and registers conversation types. | 
| ConversationListFragment | Inherits `ChatUIKitConversationListFragment` from [ChatUIKit](/uikit/chatuikit/android/chatuikit_overview.html). It displays all current-user conversations, including one-to-one and group chats but excluding chat rooms, and provides conversation search, deletion, pinning, and DND. | 
| ChatActivity and ChatFragment | `ChatActivity` inherits `UIKitChatActivity` from [ChatUIKit](/uikit/chatuikit/android/chatuikit_overview.html) and mainly requests permissions such as camera and microphone permissions. `ChatFragment` inherits `UIKitChatFragment` from [ChatUIKit](/uikit/chatuikit/android/chatuikit_overview.html) and provides:<br/> - Sending and receiving text, emoji, image, voice, video, file, and contact card messages.<br/> - Copying, quoting, recalling, deleting, editing, resending, and moderating messages.<br/> - Clearing local messages. | 
| ChatContactListFragment | Inherits `ChatUIKitContactsListFragment` from [ChatUIKit](/uikit/chatuikit/android/chatuikit_overview.html). It displays contacts, including friend search, adding friends, the friend request list entry, the chat group list entry, and the friend list. |
| ChatGroupDetailActivity | Inherits `ChatUIKitGroupDetailActivity` from [ChatUIKit](/uikit/chatuikit/android/chatuikit_overview.html). It manages chat group members and attributes, uploads shared files, sets message DND, and destroys or leaves chat groups. | 

### Core modules

| Module | Description | 
| :------------------- | :----- |
| Chat module | Shows how to implement a chat page with [ChatUIKit](/uikit/chatuikit/android/chatuikit_overview.html), send and manage messages, extend message types, and add extension menus. | 
| Conversation list module | Shows how to implement a conversation list with [ChatUIKit](/uikit/chatuikit/android/chatuikit_overview.html) and how to implement system messages. | 
| Friend module | Shows how to implement a friend list with [ChatUIKit](/uikit/chatuikit/android/chatuikit_overview.html). | 
| Me module | Provides account management, presence management, and app feature style settings. | 
| Developer module | Shows common EasyIM SDK features that developers can configure. | 


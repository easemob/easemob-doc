# EasyIM iOS Demo

The EasyIM iOS Demo provides user login, one-to-one chat, chat groups, message threads, sending and management of messages (text, emoji, voice, video, image, file, and other messages), conversation management, friend management, user attributes, presence, and real-time audio and video calls.

## Try the Demo

EasyIM provides an iOS sample app for you to try.

1. [Download the Demo](https://www.easemob.com/download/demo).
2. Enter your mobile number, obtain a verification code, and enter the code.
3. Agree to the Easemob Terms of Service and Easemob Privacy Policy, and click **Log in** to log in to the Demo.

![img](/images/demo/ios_login.png =350x650)

The following shows some UI screens:

<ImageGallery :columns="2">
  <ImageItem src="/images/uikit/chatuikit/ios/main_chat.png" title="One-to-one chat page" />
  <ImageItem src="/images/uikit/chatuikit/ios/main_chat_group.png" title="Group chat page" />
  <ImageItem src="/images/uikit/chatuikit/ios/main_conversation_list.png" title="Conversation list" />
  <ImageItem src="/images/uikit/chatuikit/ios/main_contact_list.png" title="Contacts" />
</ImageGallery>

## Run the Demo source code

### Development environment requirements

- Xcode 26.0 or later
- CocoaPods 1.14.3 or later
- iOS 15.0 or later

### Steps

1. [Create an app](/product/console/app_create.html). 
2. [Obtain the app's App Key](/product/console/app_manage.html#管理应用).
3. [Create a user](/product/console/operation_user.html#创建用户).
4. Download the EasyIM Demo source code from [GitHub](https://github.com/easemob/easemob-demo-ios) or [Gitee](https://gitee.com/easemob-code/easemob-demo-ios).
5. After the download is complete, open the `EaseChatDemo` directory and run `pod install`.
6. Open `EaseChatDemo/CustomConstants/PublicDefines.swift` and modify the placeholders in the file. Enter the App Key obtained in step 2 for `AppKey`. You can enter an empty string for `ServerHost`.
7. Open `EaseChatDemo.xcworkspace` using Xcode, and compile and run the project.
8. Log in using the registered user ID and password.

### App Server

To allow developers to quickly try EasyIM features, the Demo source code uses the developer's registered user ID and password for direct login by default and does not require deployment of an App Server. However, in this mode, features such as mobile verification codes, user avatars, and EaseCallKit real-time audio and video are unavailable. You can deploy the App Server to try all these features.

The App Server provides the following features for the Demo:

- Obtains a verification code using a mobile number.
- Returns an EasyIM user ID and EasyIM user Token using a mobile number and verification code.
- Uploads an avatar and returns its address.
- Generates the Token required for [EaseCallKit](https://doc.easemob.com/document/ios/easecallkit.html) login based on user information.
- Retrieves the mapping between an EasyIM user ID and Agora UID during an audio or video call.

Deploy the App Server as follows:

1. Deploy the App Server. For details, see the server source code on [GitHub](https://github.com/easemob/easemob-im-app-server/tree/dev-demo) or [Gitee](https://gitee.com/easemob-code/easemob-demo-appserver/tree/dev-demo).  
2. In `EaseChatDemo/CustomConstants/PublicDefines.swift` under the Demo project directory, enter the domain name or IP address of the App Server.
3. In `EaseChatDemo/CustomConstants/PublicDefines.swift` under the Demo project root directory, enter the Shengwang App ID.

**The App Key on the server must be the same as the App Key on the client.**

## Pod libraries used

- EasyIM SDK pod 'HyphenateChat'
- EasyIM UI library pod 'EaseChatUIKit'
- EasyIM audio and video UI library pod 'EaseCallKit'
- Shengwang audio and video SDK pod 'AgoraRtcEngine_iOS'

Third-party libraries include:

```
- Swift JSON parsing library pod 'KakaJSON'
- Convenient database library that encapsulates FFDB pod 'SwiftFFDBHotFix'
```

## Main modules

The Demo contains several major UI feature modules. During integration, add the corresponding modules to your project.

- Utils—Utility classes.
- Main—Main screen module that includes the Provider implementation and one-to-one and multi-user real-time calling features.
- LoginViewController—Login module for applying EaseChatUIKit login in the Demo.
- AppDelegate&SceneDelegate—Application of EaseChatUIKit initialization, configuration items, inheritance registration, and other operations in the Demo.
- CustomConstants—Custom constant module that mainly contains the AppKey and ServerHost to be entered by the user.
- IntegratedFromEaseChatUIKit—Class module for inheriting classes from EaseChatUIKit and performing secondary custom development.
- Me—Personal information, EaseChatUIKit-related configuration items, and examples of how they take effect.

## Main classes

- **MainViewController**: This page contains initialization and callback handling for the Provider implementation and one-to-one and multi-user real-time calling features.
- **MineMessageListViewController&MineContactDetailViewController&MineGroupDetailViewController**: Sample code showing how `EaseCallManager.shared()` initiates an audio or video call.
- **DemoLanguage**: Switches the Demo-layer language preference.
- **MineMessageListViewController**: The chat page in the Demo.
- **EasemobBusinessRequest**: Implements utility classes for several basic RESTful business requests. It can return the corresponding model based on the parameter type required in a response without requiring users to parse it, but it depends on the third-party parsing library `Kakajson`. It also provides request methods that return only a Dictionary for ease of use.
- **Appdelegate&NotificationService**: Push-related settings.

# EasyIM React Demo

The EasyIM React Demo provides user login, one-to-one chat, group chat, chat rooms, message threads, the sending and management of messages (text, emoji, voice, video, image, file, and other messages), conversation management, friend management, user attributes, presence, and real-time audio and video calls.

## Try the Demo 

1. [Log in to the Demo](https://webim-h5.easemob.com/login).
2. Enter your mobile phone number, obtain a verification code, and then enter the code.
3. Agree to the Easemob Terms of Service and Easemob Privacy Policy, and then click **Log In** to log in to the Demo.
   
![img](/images/demo/web_react_login.png)

The following images show some of the UI pages:

<ImageGallery :columns="1">
  <ImageItem src="/images/uikit/chatuikit/web/main_conversation_list_chat.png" title="Conversation list + chat page" />
  <ImageItem src="/images/uikit/chatuikit/web/main_conversation_list_group_detail.png" title="Conversation list + group settings" />
  <ImageItem src="/images/uikit/chatuikit/web/main_conversation_list_contact_detail.png" title="Conversation list + friend settings" />
  <ImageItem src="/images/uikit/chatuikit/web/main_contact_list_group.png" title="Friend list + chat groups" />
  <ImageItem src="/images/uikit/chatuikit/web/main_contact_list_contact.png" title="Friend list + friends" />
</ImageGallery>  

## Run the Demo source code

### Steps

1. [Create an app](/product/console/app_create.html). 
2. [Obtain the App Key](/product/console/app_manage.html#管理应用).
3. [Create a user](/product/console/operation_user.html#创建用户).
4. Download the EasyIM Demo source code. See the sample project on [GitHub](https://github.com/easemob/easemob-demo-react/tree/dev_4.0) or [Gitee](https://gitee.com/easemob-code/easemob-demo-react/tree/dev_4.0).
5. After the download is complete, open a terminal in the project root directory and install the dependencies.
   
```
npm install
```

6. Start the project.
  
```
npm start
```

7. On the login page, turn on **Use Custom Configuration**, enter your App Key, and then click **Save**.
8. Log in with the registered user ID and password.

### App Server

To help developers quickly try EasyIM features, the Demo source code uses the user ID and password registered by the developer to log in by default and does not require a deployed App Server. In this mode, however, features related to mobile phone verification codes, user avatars, and real-time audio and video are unavailable. Deploy the App Server to try these features fully.

The App Server provides the following features for the Demo:

- Obtain a verification code using a mobile phone number.
- Return an EasyIM user ID and user token using a mobile phone number and verification code.
- Upload an avatar and return its URL.
- Generate the token required to log in to [CallKit](https://doc.easemob.com/document/web/easecallkit.html) based on the user's information.
- Obtain the mapping between the EasyIM user ID and Agora UID during an audio or video call.

Deploy the App Server as follows:

1. Deploy the App Server. Deploy the App Server. For the server source code, see [GitHub](https://github.com/easemob/easemob-demo-appserver/tree/dev-demo) or the [Gitee repository](https://gitee.com/easemob-code/easemob-demo-appserver/tree/dev-demo).  
2. In the Demo project root directory, replace the services used in src/service with your own services. Then replace appKey and appId in src/config with the same values used in appServer.

**The App Key on the server must be the same as the App Key on the client.**

## Main modules

The main modules in the Demo are as follows:

| Module name     | Description                                     |
| :----------- | :--------------------------------------- |
| `components` | Components defined in the project.                       |
| `config`     | SDK initialization configuration.                         |
| `containers` | Container components for friends, chats, login, and registration. |
| `layout`     | Layout for chats.                         |
| `selectors`  | Cached data for performance optimization.                     |
| `utils`      | Database and utility methods.                       |

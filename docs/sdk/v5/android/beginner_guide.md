# Beginner's Guide

EasyIM supports sending text, image, location, voice, video, and other message types, and provides services such as one-to-one chat, group chat, chat rooms, offline push, account authentication, user attributes, and user relationships.       

## Integration process

<div style="text-align: center">
  <img src=/images/android/beginner_guide.png  width="400"/>
</div>

## Integration steps

| Step | Description | 
| :-------------- | :----- | 
| [Register an account](/product/console/account_register.html#注册账号) | Before using EasyIM products, first [register an account](/product/console/account_register.html#注册账号) in [EasyIM Console](https://console.easyim.ai/user/login).<br/>An EasyIM account uniquely identifies a developer in EasyIM Console. Developers use their accounts to log in to the console and configure and manage apps. When integrating their own apps with EasyIM, developers must map EasyIM accounts to the accounts in their apps. |
| [Create an app](/product/console/app_create.html)<br/><br/>[Obtain the App Key](/product/console/app_manage.html#获取应用凭证) | 1. To access EasyIM services, first [create an app](/product/console/app_create.html) in EasyIM Console.<br/> 2. EasyIM assigns an App Key to the created app as its unique identifier. [Obtain the app's App Key](/product/console/app_manage.html#获取应用凭证) and pass it when integrating the SDK. |
| [Activate an EasyIM plan](/product/pricing_method.html#订阅-升级套餐包) | EasyIM offers Free, Pro, and Enterprise plans. See the [Purchase Guide](/product/pricing_method.html#订阅-升级套餐包) and subscribe to a plan as needed.<br/>In addition to plans, you can [activate and subscribe to EasyIM value-added services](/product/console/purchase_value_added.html), including real-time audio and video, content moderation, message translation, and immediate push. |
| [Create a user](/document/android/login.html#user-registration) <br/><br/>[Implement token retrieval](/rest/easemob_app_token.html) | - **Create a user**: You can [call the REST API to create a user](/rest/account_register_open.html) or create a user in [EasyIM Console](https://console.easyim.ai/user/login). For details, see [User Registration](login.html#user-registration).<br/> - **Obtain a token**: Integrate the [Get App Token API](/rest/easemob_app_token.html) and [Get User Token API](/rest/easemob_user_token.html) into your app server to implement token retrieval. Your app can call its own server to obtain a token from the EasyIM server. |
| [Import the SDK](/document/android/integration.html) | [Integrate the SDK into your project](/document/android/integration.html). The integration method depends on the client platform. |
| [Initialize the SDK](/document/android/initialization.html) | You must initialize the SDK before using EasyIM features. Pass your app's App Key during [initialization](/document/android/initialization.html). During initialization, you can configure important features such as notifications for joining and leaving chat groups. |
| [Log in to EasyIM](/document/android/login.html) | Log in to EasyIM as a created user. After login succeeds, you can use EasyIM features. |
| Integrate features | Integrate the main features:<br/> - [Message management](/document/android/message_send.html) <br/> - [Conversation management](/document/android/conversation_overview.html)<br/> - [Chat group management](/document/android/group_overview.html) <br/> - [Chat room management](/document/android/room_overview.html) <br/> - [User management](/document/android/user_relationship.html)<br/> - [Offline push](/document/android/push/push_overview.html) |

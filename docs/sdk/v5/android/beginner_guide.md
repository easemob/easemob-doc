# Beginner's Guide

EasyIM supports sending text, image, location, voice, video, and other message types, and provides services such as one-to-one chat, group chat, chat rooms, offline push, account authentication, user attributes, and user relationships.       

## Integration process

<div style="text-align: center">
  <img src=/images/android/beginner_guide.png  width="400"/>
</div>

## Integration steps

| Step | Description | 
| :-------------- | :----- | 
| [Register an account](/product/console/account_register.html#register-an-account) | Before using EasyIM, first [register an account](/product/console/account_register.html#register-an-account) in [EasyIM Console](https://console.easyim.ai/user/login).<br/>An EasyIM account uniquely identifies a developer in EasyIM Console. Developers use their accounts to log in to the console and configure and manage apps. When integrating their own apps with EasyIM, developers must map EasyIM accounts to the accounts in their apps. |
| [Create an app](/product/console/app_create.html)<br/><br/>[Obtain the App Key](/product/console/app_manage.html#obtain-app-credentials) | 1. To access EasyIM services, first [create an app](/product/console/app_create.html) in EasyIM Console.<br/> 2. EasyIM assigns an App Key to the created app as its unique identifier. [Obtain the app's App Key](/product/console/app_manage.html#obtain-app-credentials) and pass it when integrating the SDK. |
| [Activate an EasyIM plan](/product/pricing_method.html#subscribe-to-or-upgrade-a-plan) | EasyIM offers Free, Professional, and Flagship plans. See the [Purchase Guide](/product/pricing_method.html#subscribe-to-or-upgrade-a-plan) and subscribe to a plan as needed. |
| [Create a user](login.html#user-registration) <br/><br/>[Implement token retrieval](/rest/easemob_app_token.html) | - **Create a user**: You can [call the REST API to create a user](/rest/account_register_open.html) or create a user in [EasyIM Console](https://console.easyim.ai/user/login). For details, see [User Registration](login.html#user-registration).<br/> - **Obtain a token**: Integrate the [Get App Token API](/rest/easemob_app_token.html) and [Get User Token API](/rest/easemob_user_token.html) into your app server to implement token retrieval. Your app can call its own server to obtain a token from the EasyIM server. |
| [Import the SDK](integration.html) | [Integrate the SDK into your project](integration.html). The integration method depends on the client platform. |
| [Initialize the SDK](initialization.html) | You must initialize the SDK before using EasyIM features. Pass your app's App Key during [initialization](initialization.html). During initialization, you can configure important features such as notifications for joining and leaving chat groups. |
| [Log in to EasyIM](login.html) | Log in to EasyIM as a created user. After login succeeds, you can use EasyIM features. |
| Integrate features | Integrate the main features:<br/> - [Message management](message_send.html) <br/> - [Conversation management](conversation_overview.html)<br/> - [Chat group management](group_overview.html) <br/> - [Chat room management](room_overview.html) <br/> - [User management](user_relationship.html)<br/> - [Offline push](/sdk/v5/android/push/push_overview.html) |

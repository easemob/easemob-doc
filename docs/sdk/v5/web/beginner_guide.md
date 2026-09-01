# Beginner's Guide

EasyIM supports text, image, location, voice, video, and other message types and provides services such as one-to-one chat, group chat, chat rooms, offline push, account authentication, user attributes, and user relationships.

## Integration process

<div style="text-align: center">
  <img src=/images/android/beginner_guide.png  width="400"/>
</div>

## Integration steps

| Step            | Description | 
| :-------------- | :----- | 
| [Register an account](/product/console/account_register.html#register-an-account)  | Before using EasyIM, first go to the [EasyIM Console](https://console.easyim.ai/user/login) to [register an account](/product/console/account_register.html#register-an-account).<br/>Your EasyIM account uniquely identifies you as a developer in the EasyIM Console. Use the account to log in to the console and configure and manage apps. When integrating your app with EasyIM, map the EasyIM accounts to the accounts in your app. |
| [Create an app](/product/console/app_create.html)<br/><br/>[Obtain the App Key](/product/console/app_manage.html#obtain-app-credentials) | 1. To integrate EasyIM services, first [create an app](/product/console/app_create.html) in the EasyIM Console.<br/> 2. EasyIM assigns an App Key to the app as its unique identifier. [Obtain the App Key](/product/console/app_manage.html#obtain-app-credentials) and pass it when integrating the SDK.  |
| [Activate an EasyIM plan](/product/pricing_method.html#subscribe-to-or-upgrade-a-plan)     | EasyIM offers Free, Professional, and Flagship plans. See the [purchase guide](/product/pricing_method.html#subscribe-to-or-upgrade-a-plan) and subscribe to a plan as needed.| 
| [Create a user](login.html#register-a-user) <br/><br/>[Implement token retrieval](/rest/easemob_app_token.html)    | - **Create a user**: You can [call a REST API to create a user](/rest/account_register_open.html) or create one in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see [Register a user](login.html#register-a-user).<br/> - **Obtain a token**: Integrate the Integrate the [app token retrieval API](/rest/easemob_app_token.html) and [user token retrieval API](/rest/easemob_user_token.html) into your app server to implement token retrieval. Your app can call its own server to obtain a token from the EasyIM server.   |
| [Import the SDK](integration.html)          | [Integrate the SDK into your project](integration.html). |
| [Initialize the SDK](initialization.html)         | You must initialize the SDK before using EasyIM features. Pass your app's App Key to [initialize the SDK](initialization.html). During initialization, you can configure important features such as automatic login and notifications for joining or leaving chat groups.| 
| [Log in to EasyIM](login.html)       | Log in to EasyIM as the user you created. After a successful login, you can use EasyIM features. |
| Integrate features         | Integrate the main features:<br/> - [Message management](message_send.html) <br/> - [Conversation management](conversation_overview.html)<br/> - [Chat group management](group_overview.html) <br/> - [Chat room management](room_overview.html) <br/> - [User management](user_relationship.html)|


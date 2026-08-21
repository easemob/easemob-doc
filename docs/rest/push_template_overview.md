# Use Push Templates

## Push template overview

Push templates are primarily used to set global push titles and content when the default offline push configuration provided by the server does not meet your requirements. For example, the server provides default push titles and content in Chinese and English. If you need Korean or Japanese push titles and content, you can configure push templates for those languages.

## Push template types

You can use push templates to set push titles and content. Push templates include the default **default** and **detail** templates and custom push templates.

In addition to calling the REST API to configure default push templates, you can also configure push templates in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see [Push template configuration](/document/android/push/push_template.html).

## Push template features

1. Push templates take precedence over [setting push content in the notification bar by calling the API](push_display_mode_set.html).
2. You can customize the default push content on the EasyIM server.   
3. For group messages, you can use a directed template to send certain users offline notifications that differ from those sent to other users.
4. The receiver can choose which template to use. 
5. Templates are selected according to the following priority rules: 
   - Custom push templates take precedence over default push templates.
   - If the sender sets a push template when sending a message, the push notification is displayed according to the sender's template even if the receiver has also set a push template.

## Priority of push templates and other methods

You can set the push title and content displayed in the notification bar in the following ways, listed from lowest to highest priority:

1. Use the default push title and content when sending a message: Set the push notification display mode using `notification_display_style`. The push title is "You have a new message," and the push content is "Please click to view."  
2. Use a default template when sending a message: If the default **default** and **detail** templates are available, you do not need to specify one when sending a message.
3. Use the `em_push_title` and `em_push_content` extension fields to customize the push title and content displayed when sending a message.
4. The receiver sets a push template.
5. Specify a template name through a message extension field when sending a message.

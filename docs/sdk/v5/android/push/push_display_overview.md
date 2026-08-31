# Configure push notification display content

After a notification is received, the push title and content displayed in the notification bar can be set in the following ways. The priority is from low to high:

1. [**Set push notification display attributes**](push_display_attribute.html): Use the default push title and content, that is, the push notification display mode `DisplayStyle` uses the default value (`SimpleBanner`). The push title is **You have a new message**, and the push content is **Please tap to view**.
2. [**Use the default push template**](push_template.html#edit-the-default-push-template): If the default template `default` exists, you do not need to specify it when sending a message.
3. [**Use the message extension field**](push_display_field.html): Set the push title and push content through the `em_push_ext` extension field of the message. For the field structure and key names, see the linked document.
4. [**The receiver sets a push template**](push_template.html#the-message-receiver-uses-a-push-template).
5. [**Use a custom push template**](push_template.html#): Specify the push template name through the message extension field when sending a message.

:::tip
Push templates are an advanced feature of offline push. Before using this feature, you need to [enable it in EasyIM Console](push_template.html#feature-activation).
:::

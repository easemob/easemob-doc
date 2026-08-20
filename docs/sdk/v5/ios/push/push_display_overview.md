# Configure push notification display content

You can configure the push title and content shown in the notification center in the following ways, listed from lowest to highest priority:

1. **Configure push notification display attributes**: Use the default title and content. The display style `EMPushDisplayStyle` uses its default value (`EMPushDisplayStyleSimpleBanner`). The title is **You have a new message** and the content is **Tap to view**.
2. **Use the default push template**: If the `default` template exists, you do not need to specify a template when sending a message.
3. **Use message extension fields**: Use the fixed `em_push_ext` extension fields to customize the title and content, configured with `title` and `content`, respectively.
4. **The recipient has configured a push template**.
5. **Use a custom push template**: Specify the template name in the message extension fields when sending a message.

:::tip
Push templates are an advanced offline-push feature. Enable them in the Easemob Console before use.
:::

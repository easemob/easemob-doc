# 常见问题

## 推送通知未显示时如何排查

如果 HarmonyOS 设备未显示离线推送通知，请按以下顺序排查：

1. 确认已在 HarmonyOS Push Kit 开通推送服务并申请服务账号密钥，且已在 [环信控制台](https://console.easemob.com/user/login) 上传对应的 HarmonyOS 推送证书。详见 [集成 HarmonyOS 推送](push_harmony.html)。
2. 确认 [环信控制台](https://console.easemob.com/user/login) 中的推送证书名称、应用模块 `module.json5` 中的 `client_id` 以及 `ChatOptions#setAppIDForPush` 设置的 Client ID 完全一致。
3. 在 SDK 初始化后、登录前注册 `PushListener`。登录成功后，确认收到 `PushListener#onBindTokenSuccess`；若收到 `PushListener#onError`，请根据错误信息检查 Push Kit 配置、网络以及 Token 绑定状态。
4. 确认接收方用户存在，并在环信控制台中检查该用户是否已绑定正确的推送证书名称和 Push Token。
5. 确认接收方处于离线状态。应用退到后台但 SDK 与服务器仍保持连接时，不会触发离线推送。
6. 检查系统中的应用通知权限是否开启；若推送证书配置了 Category，还需确认相应通知类别具备所需权益。
7. 检查 App 全局及当前会话的 [推送通知方式和免打扰设置](push_notification_mode_dnd.html)，确认当前通知未被关闭或过滤。
8. 如果消息指定了 [推送模板](push_template.html)，检查模板名称及 `em_push_template` 扩展字段中的参数是否正确。

完成以上检查后仍无法收到通知时，可在环信控制台使用对应的证书和 Push Token 进行推送测试，并将 `PushListener#onError` 返回的错误信息提供给环信技术支持进一步排查。

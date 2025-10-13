# CallKit 更新日志

## 版本 2.0.1 2025-08-29

从该版本开始，CallKit 移到 `easemob-chat-uikit` 中，为 UIKit 的中的一个组件，代码迁移至 [新 repo](https://github.com/easemob/easemob-uikit-react)，老版本不再维护。

该版本的 CallKit 主要变更如下：

1. 优化了 [单群聊音视频通话的 UI 界面](product_overview.html#界面效果)。
2. 优化了群组通话的呼叫信令交互。
3. [群组通话的邀请界面](integration.html#发起群组通话) 改为 UIKit 内部实现，不再需要开发者自己实现。
4. 通话使用的声网 RTC App ID 及 Token 在 CallKit 内部通过 IM SDK 接口获取，不再依赖 App Server。
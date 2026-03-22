# iOS CallKit 更新日志

## v4.16.0

该版本在 2025 年 8 月 29 日发布。

从该版本开始，iOS CallKit 源码使用 Swift 语言开发，并且支持 iOS 15.0 及以上版本，代码迁移至 [GitHub 新 repo](https://github.com/easemob/easemob-callkit-iOS) 和 [Gitee 地址](https://gitee.com/easemob-code/easemob-callkit-iOS)。老版本不再维护。

该版本的 CallKit 主要变更如下：
1. 优化了 [单群聊音视频通话的 UI 界面](product_overview.html#界面效果)。
2. 单人视频通话支持[画中画](picture_in_picture.html)。
3. 被叫离线时，支持 [使用 LiveCommunicationKit 进行呼叫](livecommunicationkit.html)。
4. 优化了 [群组通话的呼叫信令交互](signaling.html#群组通话信令交互流程)。
5. [群组通话的邀请界面](integration.html#发起群组通话) 改为 UIKit 内部实现，不再需要开发者自己实现。
6. 通话使用的声网 RTC App ID 及 Token 在 CallKit 内部通过 IM SDK 接口获取，不再依赖 App Server。
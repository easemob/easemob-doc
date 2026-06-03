# 产品概述

## CallKit 介绍

环信音视频通话 CallKit 是基于环信即时通讯 IM 和声网实时音视频 RTC 深度整合开发的实时音视频通话框架，实现了一对一及群组音视频通话功能。开发者只需简单集成，即可快速获得稳定流畅的高品质音视频通话能力。环信音视频通话 CallKit 可用于在线互动课堂、视频客服中心、远程会诊系统或视频相亲等场景。

<img src="/images/callkit/android/callkit_poster.png" width="600" alt="图片描述" style="display: block; margin: 0 auto" />

## CallKit 优势

| 优势           | 描述   | 
| :-------------- | :----- | 
| 三位一体技术整合  | - 环信即时通讯 IM + 声网实时音视频 RTC + UI 组件深度整合 <br/> - 双平台服务一键开通，免除多系统对接成本  | 
| 多重唤醒系统 | Android 平台支持离线推送 和 Telecom 实现来电通知   | 
| 高质量通话品质    | - 声网全球网络：超过 99.99% 服务可用性 <br/> - 超低延时：低于 76ms 的端到端延迟 <br/> - 抗丢包技术：80% 丢包仍可流畅通话 | 

## 主要功能

| 基本功能           | 高级功能   | 功能优势 |
| :-------------- | :----- | :------- |
| - 一对一语音/视频通话 <br/>- 群组语音/视频通话（16 人及以下）：通话中邀请他人 <br/> - 自定义铃声：支持主叫、被叫、挂断、超时铃声 <br/> - 打开/关闭悬浮窗<br/> - 自定义 UI 界面 | - 高画质/高音质音视频  <br/> - 离线推送<br/> - 通话质量检测<br/> - 全球互通<br/> - 弱网卡顿优化<br/> - 视频降噪| - 高质量音视频通话 <br/> - 完善的 UI 交互 <br/> - 支持多平台互联互通<br/> - 离线推送稳定且多样化   |

## 界面效果

### 一对一视频通话

<ImageGallery :columns="4">
  <ImageItem src="/images/callkit/android/1v1_video_caller_invitation.png" title="主叫发起通话邀请" />
  <ImageItem src="/images/callkit/android/1v1_video_callee_invitation.png" title="被叫收到通话邀请" />
  <ImageItem src="/images/callkit/android/1v1_video_ongoing.png" title="通话中" />
  <ImageItem src="/images/callkit/android/1v1_video_float.png" title="悬浮窗" />
</ImageGallery>

### 一对一音频通话

<ImageGallery :columns="4">
  <ImageItem src="/images/callkit/android/1v1_voice_caller_invitation.png" title="主叫发起通话邀请" />
  <ImageItem src="/images/callkit/android/1v1_voice_callee_invitation.png" title="被叫收到通话邀请" />
  <ImageItem src="/images/callkit/android/1v1_voice_ongoing.png" title="通话中" />
  <ImageItem src="/images/callkit/android/1v1_voice_float.png" title="悬浮窗" />
</ImageGallery>

### 群组通话

<ImageGallery :columns="3">
  <ImageItem src="/images/callkit/android/group_call_caller_user_selection.png" title="主叫选择用户进入通话" />
  <ImageItem src="/images/callkit/android/group_call_callee_invitation.png" title="被叫收到通话邀请" />
  <ImageItem src="/images/callkit/android/group_call_ongoing.png" title="通话中" />
  <ImageItem src="/images/callkit/android/group_call_ongoing_add.png" title="通话中添加他人" />
  <ImageItem src="/images/callkit/android/group_call_float.png" title="悬浮窗" />
</ImageGallery>

### 来电通知

<ImageGallery :columns="3">
  <ImageItem src="/images/callkit/android/1v1_video_notification_inapp.png" title="一对一视频通话-应用内来电通知" />
  <ImageItem src="/images/callkit/android/1v1_voice_notification_inapp.png" title="一对一音频通话-应用内来电通知" />
  <ImageItem src="/images/callkit/android/group_call_notification_inapp.png" title="群组通话-应用内来电通知" />
  <ImageItem src="/images/callkit/android/notification_lock.png" title="锁屏 Telecom 来电通知" />
  <ImageItem src="/images/callkit/android/notification_background.png" title="应用后台运行时 Telecom 来电通知" />
</ImageGallery>

## 使用限制

- 群组音视频通话默认最多支持 16 人。
- 关于声网 RTC 的使用限制，详见 [声网 RTC 关键性能指标](https://doc.shengwang.cn/doc/rtc/android/overview/product-overview#%E5%85%B3%E9%94%AE%E6%80%A7%E8%83%BD%E6%8C%87%E6%A0%87) 和 [配额限制](https://doc.shengwang.cn/doc/rtc/android/overview/product-overview#%E9%85%8D%E9%A2%9D%E9%99%90%E5%88%B6)。

## 其他参考

- **开通 CallKit**：详见开通 [实时音视频服务开通指南](product_activation.md)。
- **购买与计费**：详见 [购买指南](product_purchase.md) 和 [计费说明](/product/pricing_policy.html#实时音视频)。
- **用量查询**：可调用 [RESTful API](/document/server-side/rtc_usage_query.html) 获取当前自然月内的 RTC 用量汇总数据，帮助开发者了解当月资源消耗情况及剩余可用量。

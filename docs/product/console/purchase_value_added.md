# 开通增值服务

即时通讯 IM 的增值服务包括实时音视频服务、内容审核、即时推送和消息翻译。你可以在 [环信控制台](https://console.easemob.com/user/login) 订阅增值服务。

按如下步骤开通增值服务：

1. 登录 [环信控制台](https://console.easemob.com/user/login)。 
2. 选择页面上方的 **应用管理**。在应用列表中，点击测试版或正式版的 App Key。
3. 在左侧导航栏，选择 **增值服务**。
4. 选择 **实时音视频**、**内容审核**、**消息推送**、**消息翻译**。

## 前提条件

开通增值服务前，请确保你满足以下条件：
- 已 [注册环信账号](account_register.html)。
- 创建了至少一个应用。若未创建应用，请参考 [创建应用](app_create.html)。

## 实时音视频服务

使用环信音视频通话 CallKit 之前，你需要开通实时音视频服务。

在左侧导航栏，选择 **增值服务** > **实时音视频** 页签，点击 **立即订阅** 开通实时音视频服务。开通后，你可以订阅 RTC 服务的套餐或加油包。

开通后，你可以 [对实时音视频服务进行配置](/callkit/android/product_activation.html)，也可以通过服务端 API [查询 RTC 当月用量](/document/server-side/rtc_usage_query.html)，了解当月资源消耗情况及剩余可用量。。

![img](/images/callkit/product/rtc_activation.png)

## 大模型开发平台

大模型开发平台服务当前仅限于灰度测试，如需使用，请联系商务经理开通。

![img](/images/console/llm_activation.png)

## 内容审核

在左侧导航栏，选择 **增值服务** > **内容审核**，你可以开通以下内容审核服务：

- 开通基础内容审核服务需确保账户余额大于 500 元。首次开通，免费使用 7 天。
- 对于免费版套餐包，若账户余额充足，也可付费开通内容审核和关键词审核服务。

![img](/images/console/content_moderation.png)

你可以根据需要开通文本审核、图片审核、音频审核和视频审核服务。

开通后，你可以对内容审核服务进行配置，详见 [相关配置文档](/value-added/moderation/moderation_rule_config.html)。

:::tip
如果使用自定义消息的审核，需首先开通文本审核和图片审核，再联系商务开通自定义消息审核。
:::

## 即时推送

在左侧导航栏，选择 **增值服务** > **消息推送**，在 **即时推送** 页面点击 **立即订阅**。

开通后，你可以对即时推送进行配置，详见 [相关配置文档](/value-added/push/push_task_create.html)。

![img](/images/console/push_activation.png)

## 消息翻译

在左侧导航栏，选择 **增值服务** > **消息翻译**，点击 **立即订阅**，联系商务开通消息翻译服务。

![img](/images/console/translation_activation.png)

服务开通后，你可以查看消息翻译额度、总使用量以及指定时间段内每天的使用量。

![img](/images/console/translation_statistics.png)

## 测试版应用试用说明

测试版应用可试用实时音视频、内容审核、消息翻译和即时推送服务中，享受 [免费额度](/product/pricing_policy.html#增值服务)，无需付费。

**内容审核/消息翻译/即时推送**
- 上线正式版前，若你暂不需要该服务，可点击 **关闭服务**。关闭后，应用转为正式版时不会产生相关费用。
- 若关闭内容审核后再上线正式版，相关配置会丢失。

**实时音视频**
即使测试版已开通，上线后也不会自动保留，若要使用需单独订阅。






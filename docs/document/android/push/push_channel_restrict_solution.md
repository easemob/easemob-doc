# 厂商通道限制及解决方案

## 华为

华为推送通道将根据应用类型对资讯营销类消息的每日推送数量进行上限管理。详情请参考[推送数量管理细则](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/message-restriction-description-0000001361648361)。

环信建议你做出以下调整：

1. [申请华为消息自分类权益功能](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/message-classification-0000001149358835)。

2. 环信证书补充华为配置 category，如下图所示：

![image](/images/android/push/huawei-notifier-category.png)

## OPPO

OPPO 推送服务将增加区分应用类型的推送频控限制，公信消息单用户限制 2~5 条，私信消息不受限。详情请登录OPPO PUSH 开发者账号，管理中心查阅《【OPPO PUSH】推送服务规则更新说明》。

环信建议您做出以下调整：

1. [申请 OPPO PUSH 私信通道权限](https://open.oppomobile.com/new/developmentDoc/info?id=11227)。

2. [客户端创建私信通道](https://open.oppomobile.com/new/developmentDoc/info?id=11252)。

3. 环信推送证书补充 OPPO 配置 channelId，如下图所示：

![image](/images/android/push/oppo-notifier-channelId.png)

## 小米

小米推送通道将分为“私信消息”和“公信消息”两个类别，不同类别对应不同的权限，若应用选择不接入私信或公信，则会接入默认通道，单个应用单个设备单日 1 条消息。详情查看[小米推送消息限制说明](https://dev.mi.com/console/doc/detail?pId=2086)。

环信建议你做出以下调整：

1. [申请小米公私信渠道id](https://dev.mi.com/console/doc/detail?pId=2422#_2)。

2. 环信推送证书补充小米配置 channel ID，如下图所示：

![image](/images/android/push/xiaomi-notifier-channelId.png)

## vivo

vivo 推送通道区分 “系统消息” 和”运营消息”，消息类别决定单日单用户推送量上限（环信服务端默认”系统消息”，即 classification = 1）。

[推送消息限制说明](https://dev.vivo.com.cn/documentCenter/doc/695#w1-53292792)，在此基础上进行消息分类优化，新增 “二级分类”功能，根据推送内容界定不同推送分类。

环信建议你做出以下调整：

1. [二级分类说明和申请](https://dev.vivo.com.cn/documentCenter/doc/359#_Toc64906673)。

2. 环信推送证书补充 vivo 配置 category，如下图所示：

:::tip
vivo 提醒配置使用请确保 category 与**推送类型**为正确对应关系，否则推送失败。
:::

![image](/images/android/push/vivo-notifier-category.png)
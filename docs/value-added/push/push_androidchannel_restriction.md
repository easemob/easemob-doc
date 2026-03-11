# 厂商通道限制及解决方案

## 华为

华为PUSH通道将根据应用类型对资讯营销类消息的每日推送数量进行上限管理。详情请参考[推送数量管理细则](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/message-restriction-description-0000001361648361)。

环信建议您做出以下调整：

1、[申请华为消息自分类权益功能](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/message-classification-0000001149358835)。

2、环信服务端请求，补充华为配置category的传值。

## OPPO

OPPO PUSH推送服务将增加区分应用类型的推送频控限制，公信消息单用户限制2~5条，私信消息不受限。详情请登录OPPO PUSH开发者账号，管理中心查阅《【OPPO PUSH】推送服务规则更新说明》。

环信建议您做出以下调整：

1、[申请OPPO PUSH私信通道权限](https://open.oppomobile.com/new/developmentDoc/info?id=11227)。

2、[客户端创建私信通道](https://open.oppomobile.com/new/developmentDoc/info?id=11252)。

3、环信服务端请求，补充OPPO配置channelId的传值。

## 小米

小米推送通道将分为“私信消息”和“公信消息”两个类别，不同类别对应不同的权限，若应用选择不接入私信或公信，则会接入默认通道，单个应用单个设备单日1条消息。详情查看[小米推送消息限制说明](https://dev.mi.com/console/doc/detail?pId=2086)。

环信建议您做出以下调整：

1、[申请小米公私信渠道id](https://dev.mi.com/console/doc/detail?pId=2422#_2)。

2、环信服务端请求，补充小米配置 channelId的传值。

## vivo

vivo 推送通道区分 “系统消息” 和”运营消息”，消息类别决定单日单用户推送量上限（环信服务端默认”系统消息”，即 classification = 1）。

[推送消息限制说明](https://dev.vivo.com.cn/documentCenter/doc/695#w1-53292792) ，在此基础上进行消息分类优化，新增 “二级分类”功能，根据推送内容界定不同推送分类。

环信建议您做出以下调整：

1、[二级分类说明和申请](https://dev.vivo.com.cn/documentCenter/doc/359#_Toc64906673)。

2、环信服务端请求，补充 vivo 配置 category 传值。

注意：vivo 提醒配置使用请保证category与classification是正确对应关系，否则推送失败。

## 荣耀

荣耀推送服务将通知消息分为资讯营销、服务与通讯两大类别。资讯营销类消息的每日推送数量根据应用类型对推送数量进行上限管理，服务与通讯类消息每日推送数量不受限。

1、荣耀推送消息分类。[基础服务-消息分类标准 | 荣耀开发者服务平台](https://developer.hihonor.com/cn/kitdoc?category=基础服务&kitId=11002&navigation=guides&docId=notification-class.md)

2、荣耀推送数量限制。[基础服务-推送数量管理细则 | 荣耀开发者服务平台](https://developer.hihonor.com/cn/kitdoc?category=基础服务&kitId=11002&navigation=guides&docId=notification-push-standards.md&token=)

3、环信服务端请求，补充honor 配置 importance 传值。

环信服务端请求体示例：

```json
{
  "pushMessage":{
    "title":"title",
    "content":"content",
    "huawei":{
      "message":{
        "android":{
          "category":"IM"
        }
      }
    },
    "oppo":{
      "channelId":"test-channel-id"
    },
    "xiaomi":{
      "channelId":"10135"
    },
    "vivo":{
      "category":"IM"
    },
    "honor":{
        "androidConfig": {
            "androidNotification":{
                "importance":"NORMAL"                           
            }        
        }
    }
  }
}
```
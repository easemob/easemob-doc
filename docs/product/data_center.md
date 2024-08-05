# 数据中心和加速节点

针对客户不同的业务覆盖区域，环信为客户提供了多地数据中心和加速节点的选择。目前环信支持的国内、国外数据中心：

| 类型         | 名称                                            |
| :--------- | :----- |
| 国内数据中心 | 国内 1 区、国内 2 区、国内 VIP 区          |
| 海外数据中心 | 新加坡 1 区、新加坡 2 区、美东 1 区、德国 2 区 |

目前支持的海外加速节点：

| 类型         | 名称 |
| :--------- | :----- |
| 海外加速节点 | 全球 |

## 数据中心说明

| 名称                 | 用途                                        |
| :--------- | :----- |
| 国内 1 区、国内 2 区     | 环信 IM 社区版、企业版、旗舰版、免费版和专业版客户所在集群    |
| 国内 VIP 区            | 尊享版客户、单独购买 VIP 集群服务客户所在集群 |
| 新加坡 1 区、新加坡 2 区 | 环信海外客户所在集群                        |
| 美东 1 区              | 环信海外客户所在集群                        |
| 德国 2 区              | 环信海外客户所在集群                        |

应用所在数据中心可以在环信用户管理后台的**即时通讯>服务概览**页面中查看：

![img](/images/product/data_center.png)

## 国内数据中心

### 应用场景

绝大部分终端用户均在国内的应用。

### 集成说明

移动端 SDK 默认连接国内数据中心，目前采取的策略是随机分配用户到国内 1 区、国内 2 区，2 个集群服务没有区别。Web 端和桌面端 SDK 集成需要根据所在数据中心，填写配置对应的 webSocket 地址。

| 数据中心名称 | socket3.0 地址          | socket2.0(老版本)地址   |
| :--------- | :----- | :----- |
| 国内 1 区      | im-api-v2.easemob.com 或 im-api-v2.easecdn.com       | im-api.easemob.com 或 im-api.easecdn.com       |
| 国内 2 区      | im-api-v2-31.easemob.com 或 im-api-v2-31.easecdn.com | im-api-31.easemob.com 或 im-api-31.easecdn.com |
| 国内 VIP 区    | 请咨询你的商务经理                                   |                                                |

不同数据中心 RESTful 接口调用不同，具体地址如下：

| 数据中心名称 | RESTful API 请求地址                   |
| :--------- | :----- |
| 国内 1 区      | a1.easemob.com 或 a1.easecdn.com   |
| 国内 2 区      | a31.easemob.com 或 a31.easecdn.com |
| 国内 VIP 区    | 请咨询你的商务经理                 |

不同数据中心微信小程序、支付宝小程序的具体地址如下：

| 数据中心名称 | 微信小程序      | 支付宝小程序           |
| :--------- | :----- | :----- |
| 国内 1 区      | im-api-wechat.easemob.com 或 im-api-wechat.easecdn.com       | im-api-alipay.easemob.com 或 im-api-alipay.easecdn.com   |
| 国内 2 区      | im-api-wechat-31.easemob.com 或 im-api-wechat-31.easecdn.com | im-api-alipay-31.easemob.com 或 im-api-alipay-31.easecdn.com |
| 国内 VIP 区    | 请咨询你的商务经理   | 请咨询你的商务经理                                                          |

### 国内集群迁移到海外

请查看[平滑迁移文档](migrate_to_easemob.html)。

## 海外数据中心

### 应用场景

绝大部分终端用户均在国外的应用。

### 集成说明

移动端SDK配置海外集群 App Key 后，会自动连接到对应的海外集群。Web 端和桌面端 SDK集成需要填写配置对应的 webSocket 地址。

| 集群名称  | WebSocket 地址                                          |
| :--------- | :----- |
| 新加坡 1 区 | im-api-sgp-v2.easemob.com 或 im-api-sgp-v2.easecdn.com |
| 新加坡 2 区 | msync-api-61.easemob.com 或 msync-api-61.easecdn.com   |
| 美东 1 区   | msync-api-41.easemob.com 或 msync-api-41.easecdn.com   |
| 德国 2 区   | msync-api-71.easemob.com 或 msync-api-71.easecdn.com   |

不同数据中心 RESTful 接口调用不同，RESTful 接口调用具体地址如下：

| 集群名称  | RESTful API请求地址                         |
| :--------- | :----- |
| 新加坡 1 区 | a1-sgp.easemob.com 或 a1-sgp.easecdn.com |
| 新加坡 2 区 | a61.easemob.com 或 a61.easecdn.com       |
| 美东 1 区   | a41.easemob.com 或 a41.easecdn.com       |
| 德国 2 区   | a71.easemob.com 或 a71.easecdn.com       |

不同集群名称微信小程序的具体地址如下：

| 集群名称  | 微信小程序                                                   |
| :--------- | :----- |
| 新加坡 1 区 | im-api-wechat-sgp.easemob.com 或 im-api-wechat-sgp.easecdn.com |
| 新加坡 2 区 | im-api-wechat-61.easemob.com 或 im-api-wechat-61.easecdn.com |
| 美东 1 区   | im-api-wechat-41.easemob.com 或 im-api-wechat-41.easecdn.com |
| 德国 2 区   | im-api-wechat-71.easemob.com 或 im-api-wechat-71.easecdn.com |

:::tip
根据海外数据隐私保护协议规定，选择新加坡 1 区、新加坡 2 区、美东 1 区、德国 2 区集群后不可迁移至其他集群。
:::

### 海外加速服务

#### 应用场景

一部分终端用户在国内、一部分终端用户在海外，跨国用户之间需要发消息沟通。

#### 使用说明

根据你所在的数据中心及终端用户分布，我们将为你开通需要的网络加速节点。加速节点默认带宽为 1 Mbps，可以根据实际流量需求配置合适的带宽。具体服务开通请联系你的商务经理。

#### 节点分布

| 名称         | 节点 |
| :--------- | :----- |
| 海外加速节点 | 全球 |

节点价格请查看[价格页](https://www.easemob.com/pricing/im)。
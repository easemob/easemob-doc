# Data Centers and Acceleration Nodes

To meet deployment requirements across different business coverage regions, EasyIM provides multiple data centers and acceleration nodes. You can select the appropriate data center and network acceleration solution based on end-user distribution, business deployment regions, and compliance requirements.

## Data centers

### Selecting and viewing the database

When creating an app in the [EasyIM Console](https://console.easyim.ai/user/login), you can select the data center:

The default overseas data center is **Singapore Zone 1**. You can also select **US East Zone 1** or **Germany Zone 2**. To use Singapore Zone 2, contact the EasyIM business manager.

![img](/images/product/data_center_selection.png)

You can view the app's data center and server domain on the **Overview** page of the EasyIM Console.

![img](/images/product/data_center.png)

When integrating an SDK, use the WebSocket address, RESTful API address, and Mini Program address corresponding to the app's data center.

### WebSocket addresses

| Cluster name    | WebSocket address                                             |
| :---------- | :--------------------------------------------------------- |
| Singapore Zone 1 | `im-api-sgp-v2.easemob.com` or `im-api-sgp-v2.easecdn.com` |
| Singapore Zone 2 | `msync-api-61.easemob.com` or `msync-api-61.easecdn.com`   |
| US East Zone 1   | `msync-api-41.easemob.com` or `msync-api-41.easecdn.com`    |
| Germany Zone 2   | `msync-api-71.easemob.com` or `msync-api-71.easecdn.com`   |

### RESTful API addresses

The following table lists the RESTful API request addresses for each overseas data center:

| Cluster name    | RESTful API request address                         |
| :---------- | :------------------------------------------- |
| Singapore Zone 1 | `a1-sgp.easemob.com` or `a1-sgp.easecdn.com` |
| Singapore Zone 2 | `a61.easemob.com` or `a61.easecdn.com`       |
| US East Zone 1   | `a41.easemob.com` or `a41.easecdn.com`       |
| Germany Zone 2   | `a71.easemob.com` or `a71.easecdn.com`       |

### WeChat Mini Program addresses

The following table lists the WeChat Mini Program addresses for each overseas cluster:

| Cluster name    | WeChat Mini Program                                                   |
| :---------- | :----------------------------------------------------------- |
| Singapore Zone 1 | `im-api-wechat-sgp.easemob.com` or `im-api-wechat-sgp.easecdn.com` |
| Singapore Zone 2 | `im-api-wechat-61.easemob.com` or `im-api-wechat-61.easecdn.com` |
| US East Zone 1   | `im-api-wechat-41.easemob.com` or `im-api-wechat-41.easecdn.com` |
| Germany Zone 2   | `im-api-wechat-71.easemob.com` or `im-api-wechat-71.easecdn.com` |

:::tip
Under data privacy agreements, after selecting Singapore Zone 1, Singapore Zone 2, US East Zone 1, or Germany Zone 2, you cannot migrate to another cluster.
:::

## Acceleration service

EasyIM activates the required network acceleration nodes based on the app's data center and the distribution of its end users. The overseas acceleration node (Global) is suitable when some end users are in the Chinese mainland and others are outside, requiring cross-country message exchange.

The default bandwidth of an acceleration node is **1 Mbps**. You can configure a more appropriate bandwidth based on your actual traffic requirements.

To activate the service or for node pricing, contact your EasyIM business manager. For pricing details, see the [pricing page](https://www.easemob.com/pricing/im).

## FAQ

#### 1. Why are some data centers unavailable when I create an app?

By default, only some commonly used data centers are available in the EasyIM Console. To use another data center, contact the EasyIM business manager to request activation.

#### 4. Can I migrate between data centers?

Under data privacy agreements, after selecting Singapore Zone 1, Singapore Zone 2, US East Zone 1, or Germany Zone 2, you cannot migrate to another overseas cluster.

#### 5. When do I need overseas acceleration?

If your end users are located both inside and outside the Chinese mainland and frequently exchange messages across countries, we recommend activating overseas acceleration to improve the cross-region access experience.

#### 6. What is the default bandwidth of an overseas acceleration node, and can I adjust it?

The default bandwidth of an overseas acceleration node is **1 Mbps**. If your business traffic is higher, you can configure more bandwidth based on your requirements. Contact the EasyIM business manager for details.

#### 7. Do I need to configure different addresses for each data center on each client?

Yes.
  
Each data center has different WebSocket, RESTful API, and Mini Program access addresses. During integration, enter the addresses corresponding to the app's data center.

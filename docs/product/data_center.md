# Data Centers and Acceleration Nodes

To meet deployment requirements across different business coverage regions, EasyIM provides multiple data centers and acceleration nodes. You can select the appropriate data center and network acceleration solution based on end-user distribution, business deployment regions, and compliance requirements.

EasyIM currently supports the following data centers and acceleration nodes.

## Overview

The following table lists the data centers:

| Name                     | Purpose                                                       |
| :----------------------- | :--------------------------------------------------------- |
| Singapore Zone 1 and Singapore Zone 2 | Clusters for EasyIM's overseas customers.                                       |
| US East Zone 1                | Cluster for EasyIM's overseas customers.                                       |
| Germany Zone 2                | Cluster for EasyIM's overseas customers.                                       |

The following table lists the overseas acceleration nodes.

| Type         | Name |
| :----------- | :--- |
| Overseas acceleration node | Global |

You can select a data center based on where most of your end users are located:

- If most end users are in the Chinese mainland, we recommend selecting a domestic data center.
- If most end users are outside the Chinese mainland, we recommend selecting an overseas data center.
- If end users are located both inside and outside the Chinese mainland and frequently communicate across countries, we recommend activating overseas acceleration for your existing data center.
- If you require dedicated resources or a higher-specification cluster service, select a domestic VIP zone or contact the EasyIM business manager to purchase the appropriate service.

When creating an app in the EasyIM Console:
- The default domestic data center is **Domestic Zone 2**. To use another data center, contact the EasyIM business manager.
- The default overseas data center is **Singapore Zone 1**. You can also select **US East Zone 1** or **Germany Zone 2**. To use Singapore Zone 2, contact the EasyIM business manager.

![img](/images/product/data_center_selection.png)

You can view the app's data center and server domain on the **App Overview** page of the EasyIM Console.

![img](/images/product/data_center.png)

## Data centers

### Use case

Suitable for apps whose end users are primarily outside the Chinese mainland.

### Integration instructions

The default overseas data center is **Singapore Zone 1**.

When integrating an SDK, use the WebSocket address, RESTful API address, and Mini Program address corresponding to the app's data center.

#### WebSocket addresses

| Cluster name    | WebSocket address                                             |
| :---------- | :--------------------------------------------------------- |
| Singapore Zone 1 | `im-api-sgp-v2.easemob.com` or `im-api-sgp-v2.easecdn.com` |
| Singapore Zone 2 | `msync-api-61.easemob.com` or `msync-api-61.easecdn.com`   |
| US East Zone 1   | `msync-api-41.easemob.com` or `msync-api-41.easecdn.com`   |
| Germany Zone 2   | `msync-api-71.easemob.com` or `msync-api-71.easecdn.com`   |

#### RESTful API addresses

The following table lists the RESTful API request addresses for each overseas data center:

| Cluster name    | RESTful API request address                         |
| :---------- | :------------------------------------------- |
| Singapore Zone 1 | `a1-sgp.easemob.com` or `a1-sgp.easecdn.com` |
| Singapore Zone 2 | `a61.easemob.com` or `a61.easecdn.com`       |
| US East Zone 1   | `a41.easemob.com` or `a41.easecdn.com`       |
| Germany Zone 2   | `a71.easemob.com` or `a71.easecdn.com`       |

#### WeChat Mini Program addresses

The following table lists the WeChat Mini Program addresses for each overseas cluster:

| Cluster name    | WeChat Mini Program                                                   |
| :---------- | :----------------------------------------------------------- |
| Singapore Zone 1 | `im-api-wechat-sgp.easemob.com` or `im-api-wechat-sgp.easecdn.com` |
| Singapore Zone 2 | `im-api-wechat-61.easemob.com` or `im-api-wechat-61.easecdn.com` |
| US East Zone 1   | `im-api-wechat-41.easemob.com` or `im-api-wechat-41.easecdn.com` |
| Germany Zone 2   | `im-api-wechat-71.easemob.com` or `im-api-wechat-71.easecdn.com` |

:::tip
Under overseas data privacy agreements, after selecting Singapore Zone 1, Singapore Zone 2, US East Zone 1, or Germany Zone 2, you cannot migrate to another cluster.
:::

## Acceleration service

### Use case

Suitable when some end users are in the Chinese mainland, others are outside the Chinese mainland, and users need to exchange messages across countries.

### Instructions

EasyIM activates the required network acceleration nodes based on the app's data center and the distribution of its end users.

The default bandwidth of an acceleration node is **1 Mbps**. You can configure a more appropriate bandwidth based on your actual traffic requirements.  

To activate the service, contact your EasyIM business manager.

### Node distribution

| Name         | Node |
| :----------- | :--- |
| Overseas acceleration node | Global |

For node pricing, see the [pricing page](https://www.easemob.com/pricing/im).

## FAQ

### 1. Why are some data centers unavailable when I create an app?

By default, only some commonly used data centers are available in the EasyIM Console. To use another data center, contact the EasyIM business manager to request activation.

### 4. Can I migrate between data centers?

Under data privacy agreements, after selecting Singapore Zone 1, Singapore Zone 2, US East Zone 1, or Germany Zone 2, you cannot migrate to another overseas cluster.

### 5. When do I need overseas acceleration?

If your end users are located both inside and outside the Chinese mainland and frequently exchange messages across countries, we recommend activating overseas acceleration to improve the cross-region access experience.

### 6. What is the default bandwidth of an overseas acceleration node, and can I adjust it?

The default bandwidth of an overseas acceleration node is **1 Mbps**. If your business traffic is higher, you can configure more bandwidth based on your requirements. Contact the EasyIM business manager for details.

### 7. Do I need to configure different addresses for each data center on each client?

Yes.
  
Each data center has different WebSocket, RESTful API, and Mini Program access addresses. During integration, enter the addresses corresponding to the app's data center.

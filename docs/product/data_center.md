# Data Center and Acceleration Node

EasyIM provides data centers and acceleration nodes to ensure stable and fast global message delivery. This document explains how to select a data center for your app and enable acceleration services based on your user distribution.

## Data center

When creating an app in the [EasyIM Console](https://console.easyim.ai/user/login), you can select the data center **Singapore 2**. 

![img](/images/product/data_center_selection.png)

You can view the app's data center and server domain on the **Overview** page of the EasyIM Console.

When integrating an SDK, use the WebSocket address and RESTful API address corresponding to the app's data center.

![img](/images/product/data_center.png)

## Acceleration node

EasyIM activates the required network acceleration nodes based on the app's data center and the distribution of its end users. The acceleration node (Global) is suitable when some end users are in the Chinese mainland and others are outside, requiring cross-country message exchange.

The default bandwidth of an acceleration node is **1 Mbps**. You can configure a more appropriate bandwidth based on your actual traffic requirements.

To activate the service or for node pricing, contact your EasyIM business manager. For pricing details, see the [pricing page](http://easyim.ai/pricing).

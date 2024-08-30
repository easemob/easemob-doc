# 消息量统计

环信即时通讯 IM 会对 app 以及 app 内的单聊、群聊和聊天室的消息数量进行统计。你可以选择目标应用后，在左侧导航栏选择**即时通讯** > **数据统计** > **消息量统计**查看 app 的所有会话、单聊、群聊以及聊天室中的消息统计。

要了解消息统计逻辑，需要首先明确以下概念：

- **上行消息数**：环信服务器收到的发送方发出的消息数量。用户将一条消息发送到服务端，上行消息总数 +1。
- **下行消息数**：环信服务器发送给接收方的消息数量，即用户在线时收到的消息 + 离线消息数。服务端尝试给用户投递一条消息，下行消息数 +1。
- **离线消息数**：用户离线时，服务器端的离线消息数量。服务端发送一条消息时检测到接收方不在线，离线消息数+1。
- **消息分发总数**：下行消息数 + 离线消息数

## app 消息统计

在**消息量统计**页面，选择**汇总**页签，设置数据统计时间，包括**近7天**、**当前月**或自定义时间，查看 app 的消息统计数据，包括上行消息总数、下行消息总数、 离线消息总数和消息分发总数。各项数据的含义如下：

app 消息分发总数 = app 下行消息总数 + app 离线消息总数

app 下行消息总数：app 用户在线时收到的消息 + app 离线消息总数

app 离线消息数：用户离线时，服务器端的离线消息总数量。

设置数据统计时间后，你还可以查看 app 总体消息趋势和上行/下行/离线消息类型趋势，或点击页面右上角的**导出**按钮导出 XLS 格式的数据统计表。

![img](/images/message_statistics_image/message_statistics_app_overview.png)

### 总体消息趋势

在**消息趋势**区域，你可以查看 app 的上行消息、下行消息、离线消息和消息分发趋势。

![img](/images/message_statistics_image/message_statistics_app_overall_trend.png)

### 上行/下行/离线消息类型趋势

上行/下行/离线消息趋势图展示以下类型的消息趋势：

- 单聊
- 群聊
- 聊天室
- 编辑类消息
- 回执消息
- 撤回消息
- 用户进群和聊天室消息
- 用户退群和聊天室消息

![img](/images/message_statistics_image/message_statistics_app_uplink.png)

![img](/images/message_statistics_image/message_statistics_app_downlink.png)

![img](/images/message_statistics_image/message_statistics_app_offline.png)

## 单聊消息统计

在**消息量统计**页面，选择**单聊**页签，设置数据统计时间，包括**近7天**、**当前月**或自定义时间，查看单聊会话的消息统计数据，包括单聊上行消息总数、单聊下行消息总数、单聊离线消息总数和单聊消息分发总数。各项数据的含义如下：

单聊消息分发总数 = 单聊下行消息总数 + 单聊离线消息总数

单聊下行消息总数：用户在线时收到的消息 + 单聊离线消息总数

单聊离线消息数：用户离线时，服务器端的单聊离线消息总数量。

设置数据统计时间后，你还可以查看单聊会话的总体消息趋势和单聊上行/下行/离线消息类型趋势，或点击页面右上角的**导出**按钮导出 XLS 格式的数据统计表。

![img](/images/message_statistics_image/message_statistics_single_overview.png)

### 总体消息趋势

在**单聊消息趋势**区域，你可以查看单聊会话的上行消息、下行消息、离线消息和消息分发的总体趋势。

![img](/images/message_statistics_image/message_statistics_single_overall_trend.png)

### 上行/下行/离线消息趋势

在**单聊上行/下行/离线消息类型趋势**区域，你可以查看以下类型的消息的趋势：

- 文本消息
- 图片消息
- 视频消息
- 语音消息
- CMD消息
- 地理位置消息
- 文件消息
- 自定义消息
- 合并转发消息
- 空消息
  
![img](/images/message_statistics_image/message_statistics_single_uplink.png)

![img](/images/message_statistics_image/message_statistics_single_downlink.png)

![img](/images/message_statistics_image/message_statistics_single_offline.png)

## 群聊/聊天室的消息统计

群聊和聊天室会话的消息统计数据和消息趋势中的消息统计类型与单聊类似。

1. 对于群聊，各项统计数据的含义如下：

群聊消息分发总数 = 群聊下行消息总数 + 群聊离线消息总数

群聊下行消息总数：群聊用户在线时收到的消息 + 群聊离线消息总数

群聊离线消息数：用户离线时，服务器端的群聊离线消息总数量。

![img](/images/message_statistics_image/message_statistics_group_overview.png)

![img](/images/message_statistics_image/message_statistics_group_overall_trend.png)

![img](/images/message_statistics_image/message_statistics_group_uplink.png)

![img](/images/message_statistics_image/message_statistics_group_downlink.png)

![img](/images/message_statistics_image/message_statistics_group_offline.png)

2. 对于聊天室，聊天室消息分发总数，即聊天室下行消息数。

![img](/images/message_statistics_image/message_statistics_room_overview.png)

![img](/images/message_statistics_image/message_statistics_room_overall_trend.png)

![img](/images/message_statistics_image/message_statistics_room_uplink.png)

![img](/images/message_statistics_image/message_statistics_room_downlink.png)












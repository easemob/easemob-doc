# 获取本地消息的流量统计信息

<Toc />

即时通讯 IM 提供本地消息的流量统计功能。该功能默认关闭。若要使用该功能，需在 SDK 初始化前设置 `EMOptions#setEnableStatistics(boolean)` 开启。

SDK 只支持统计该功能开启后最近 30 天内发送和接收的消息。各类消息的流量计算方法如下：

- 对于文本、透传、位置消息，消息流量为消息体的流量；
- 对于图片和视频消息，消息流量为消息体、图片或视频文件以及缩略图的流量之和；
- 对于文件和语音消息，消息流量为消息体和附件的流量。

:::tip
 1. 统计时间段的开始时间和结束时间均为服务器接收消息的 Unix 时间戳。
 2. 对于携带附件的消息，下载成功后 SDK 才统计附件的流量。若附件下载多次，则会对下载的流量进行累加。
 3. 对于从服务器拉取的漫游消息，如果本地数据库中已经存在，则不进行统计。
:::

SDK 仅统计本地消息的流量，而非消息的实际流量。一般而言，该统计数据小于实际流量，原因如下：
- 未考虑发送消息时通用协议数据的流量；
- 对于接收到的消息，服务端会进行消息聚合，添加通用字段，而消息流量统计为各消息的流量，未考虑通用字段的流量消耗。

## 技术原理

环信即时通讯 IM Android SDK 提供 `EMStatisticsManager` 类支持获取本地消息的流量统计信息，包含如下主要方法：

- `EMStatisticsManager#getMessageStatistics`：根据消息 ID 获取消息流量统计信息；
- `EMStatisticsManager#getMessageCount`：获取一定时间段内发送和/或接收的指定或全部类型的消息条数；
- `EMStatisticsManager#getMessageSize`：获取一定时间段内发送和/或接收的指定或全部类型的消息的总流量。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 根据消息 ID 获取消息流量统计信息

你可以根据消息 ID 获取指定消息的统计信息。该方法返回的消息流量统计信息包括消息 ID、消息的发送方和接收方、消息体类型、会话类型、消息方向、消息流量大小（单位为字节）以及服务器收到该消息的 Unix 时间戳。

示例代码如下：

```java
EMMessageStatistics statistics = EMClient.getInstance().statisticsManager().getMessageStatistics(messageId);
```

### 获取一定时间段内发送和/或接收的消息条数

你可以统计一定时间段内发送和/或接收的指定或全部类型的消息，示例代码如下：

```java
int number = EMClient.getInstance().statisticsManager().getMessageCount(startTime, endTime, direct, style);
```

### 获取一定时间段内发送和/或接收的消息的总流量

你可以统计一定时间段内发送和/或接收的指定或全部类型的消息的总流量，流量单位为字节。

示例代码如下：

```java
long size = EMClient.getInstance().statisticsManager().getMessageSize(startTime, endTime, direct, style);
```
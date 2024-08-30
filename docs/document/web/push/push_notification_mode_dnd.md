# 设置推送通知方式和免打扰模式

为优化用户在处理大量推送通知时的体验，环信 IM 在 app 和会话层面提供了推送通知方式和免打扰模式的细粒度选项。

**推送通知方式和免打扰模式为推送的高级功能**，若要设置，你需要在 [环信即时通讯控制台](https://console.easemob.com/user/login)的**即时通讯 > 功能配置 > 功能配置总览**页面激活推送高级功能。如需关闭推送高级功能必须联系商务，因为该操作会删除所有相关配置。

## 推送通知方式

会话级别的推送通知方式设置优先于 app 级别的设置，未设置推送通知方式的会话默认采用 app 的设置。

例如，假设 app 的推送方式设置为 `AT`，而指定会话的推送方式设置为 `ALL`。你会收到来自该会话的所有推送通知，而对于其他会话来说，你只会收到提及你的消息的推送通知。

<table>
<tbody>
<tr>
<td width="184">
<p><strong>推送通知方式参数</strong></p>
</td>
<td width="420">
<p><strong>描述</strong></p>
</td>
<td width="321">
<p><strong>应用范围</strong></p>
</td>
</tr>
<tr>
<td width="184">
<p>ALL</p>
</td>
<td width="420">
<p>接收所有离线消息的推送通知。</p>
</td>
<td rowspan="3" width="321">
<p>&nbsp;</p>
<p>App 或单聊/群聊会话</p>
</td>
</tr>
<tr>
<td width="184">
<p>AT</p>
</td>
<td width="420">
<p>仅接收提及某些用户的消息的推送通知。</p>
<p>该参数推荐在群聊中使用。若提及一个或多个用户，需在创建消息时对 ext 字段传 "em_at_list":["user1", "user2" ...]；若提及所有人，对该字段传 "em_at_list":"all"。</p>
</td>
</tr>
<tr>
<td width="184">
<p>NONE</p>
</td>
<td width="420">
<p>不接收离线消息的推送通知。</p>
</td>
</tr>
</tbody>
</table>
<p>&nbsp;</p>

## 免打扰模式

你可以在 app 级别指定免打扰时间段和免打扰时长，环信 IM 在这两个时间段内不发送离线推送通知。若既设置了免打扰时间段，又设置了免打扰时长，免打扰模式的生效时间为这两个时间段的累加。

免打扰时间参数的说明如下表所示：

| 免打扰时间参数       | 类型 |描述           | 应用范围           |
| :------------------- | :------------------- | :--------------------------- | :------------------- |
| startTime & endTime | Int |每天定时触发离线推送免打扰的时间段，采用 24 小时制，精确到分钟，格式为 H:M-H:M，例如 8:30-10:0，开始时间和结束时间中的小时数和分钟数的取值范围分别为 [0,23] 和 [0,59]。免打扰时间段的设置说明如下：<br/> - 该参数仅针对 app 生效，对单聊或群聊不生效。<br/> - 开始时间和结束时间设置后，免打扰模式每天定时触发。例如，若该时间段设置为 `8:0`-`10:0`，免打扰模式在每天的 8:00-10:00 内生效。若你在 11:00 设置开始时间为 `8:0`，结束时间为 `12:0`，则免打扰模式在当天的 11:00-12:00 生效，以后每天均在 8:00-12:00 生效。<br/> - 若开始时间和结束时间相同，免打扰模式则全天生效。不过，若设置为  `0:0`-`0:0`，则关闭免打扰模式。<br/> - 若结束时间早于开始时间，则免打扰模式在每天的开始时间到次日的结束时间内生效。例如，开始时间为 `10:0`，结束时间为 `8:0`，则免打扰模式的在当天的 10:00 到次日的 8:00 生效。<br/> - 目前仅支持在每天的一个指定时间段内开启免打扰模式，不支持多个免打扰时间段，新的设置会覆盖之前的设置。<br/> - 若该参数和 `duration` 均设置，免打扰模式当日在这两个时间段均生效，例如，例如，上午 8:00 将  `startTime 和 endTime` 设置为 8:0-10:0，`duration` 设置为 240 分钟（4 个小时），则 app 在当天 8:00-12:00 和以后每天 8:00-10:00 处于免打扰模式。 | 仅用于 app 级别，对单聊或群聊会话不生效。 |
| duration | Int |免打扰时长，单位为分钟。免打扰时长的取值范围为 [0,10080]，`0` 表示该参数无效，`10080` 表示免打扰模式持续 7 天。<br/> 与免打扰时间段的设置每天生效不同，该参数为一次有效。设置后立即生效，例如，上午 8:00 将 app 层级的时长设置为 240 分钟（4 个小时），则 app 在当天 8:00-12:00 处于免打扰模式。<br/> - 若该参数和 `startTime 和 endTime` 均设置，免打扰模式当日在这两个时间段均生效，例如，上午 8:00 将 app 级的 `startTime 和 endTime` 设置为 8:00-10:00，免打扰时长设置为 240 分钟（4 个小时），则 app 在当前 8:00-12:00 和以后每天 8:00-10:00 处于免打扰模式。    | App 或单聊/群聊会话。   |

**推送通知方式与免打扰时间设置之间的关系**

对于 app 和 app 中的所有会话，免打扰模式的设置优先于推送通知方式的设置。例如，假设在 app 级别指定了免打扰时间段，并将指定会话的推送通知方式设置为 `ALL`。免打扰模式与推送通知方式的设置无关，即在指定的免打扰时间段内，你不会收到任何推送通知。

或者，假设为会话指定了免打扰时间段，而 app 没有任何免打扰设置，并且其推送通知方式设置为 `ALL`。在指定的免打扰时间段内，你不会收到来自该会话的任何推送通知，而所有其他会话的推送保持不变。

## 设置 app 的推送通知

你可以调用 `setSilentModeForAll` 方法在 app 级别设置推送通知，并通过指定 `paramType` 字段设置推送通知方式和免打扰模式，如下代码示例所示：

```javascript
/**
  options // 推送通知配置选项。
	options: {
    paramType: 0, // 推送通知方式。
    remindType: 'ALL' // 可设置为 `ALL`、`AT` 或 `NONE`。
  }
  options: {
    paramType: 1, // 免打扰时长。
    duration: 7200000 // 免打扰时长，单位为毫秒。
  }
  options: {
    paramType: 2, // 免打扰时间段。
    startTime: {
    	hours: 8, // 免打扰时间段的开始时间中的小时数。
    	minutes: 0 // 免打扰时间段的开始时间中的分钟数。
    }，
    endTime: {
    	hours: 12, // 免打扰时间段的结束时间中的小时数。
    	minutes: 0 // 免打扰时间段的结束时间中的分钟数。
    }
  }
*/
const params = {
  options: {
    paramType: 0,
    remindType: 'ALL'
  }
}
WebIM.conn.setSilentModeForAll(params)
```

## 获取 app 的推送通知设置

你可以调用 `getSilentModeForAll` 获取 app 的推送通知设置，示例代码如下：

```javascript
// 无需传参数，直接调用。
WebIM.conn.getSilentModeForAll()
```

## 获取设置了推送通知方式的所有会话

你可以调用 `getAllSilentModeConversations` 方法获取设置了推送通知方式的所有会话。

[推送通知方式](#推送通知方式)包含以下三类：接收所有离线消息的推送通知、仅接收提及某些用户的消息的推送通知、不接收离线消息的推送通知。

```javascript
// pageSize 的取值范围为 [1,100]，默认值为 10。
connection.getAllSilentModeConversations({pageSize: 10})
```

## 设置单个会话的推送通知

你可以调用 `setSilentModeForConversation` 设置指定会话的推送通知设置，即推送通知方式或免打扰时间（时长或时间段）示例代码如下。

调用该接口后，你的其他设备会收到 `onMultiDeviceEvent#setSilentModeForConversation` 事件。

```javascript
/**
	const params = {
    conversationId: 'test', // 会话 ID：单聊为对方用户 ID，群聊为群组 ID，聊天室会话为聊天室 ID。
    type: 'singleChat', // 会话类型：singleChat（单聊）、groupChat（群聊）和 chatRoom（聊天室）。
    options: {
      paramType: 0, // 推送通知方式。
      remindType: 'ALL' // 可设置为 `ALL`、`AT` 或 `NONE`。
    }
  }
	
	const params = {
    conversationId: '12345567',
    type: 'groupChat',
    options: {
      paramType: 1, // 免打扰时长。
      duration: 7200000 // 免打扰时长，单位为毫秒。
    }
  }
  
  const params = {
    conversationId: '121231233',
    type: 'chatRoom',
    options: {
      paramType: 2, // 免打扰时间段。
      startTime: {
        hours: 8, // 免打扰时间段的开始时间中的小时数。
        minutes: 0 // 免打扰时间段的开始时间中的分钟数。
      }，
      endTime: {
        hours: 12, // 免打扰时间段的结束时间中的小时数。
        minutes: 0 // 免打扰时间段的结束时间中的分钟数。
      }
    }
  }
*/
const params = {
  conversationId: '12345',
  type: 'groupChat',
  options: {
    paramType: 0,
    remindType: 'ALL'
  }
}
WebIM.conn.setSilentModeForConversation(params)
```

## 获取单个会话的推送通知设置

调用 `getSilentModeForConversation` 获取单个会话的推送通知设置，示例代码如下：

```javascript
const params = {
  conversationId: 'test', // 会话 ID：单聊为对方用户 ID，群聊为群组 ID，聊天室会话为聊天室 ID。
  type: 'singleChat', // 会话类型：singleChat（单聊）、groupChat（群聊）和 chatRoom（聊天室）。
}
WebIM.conn.getSilentModeForConversation(params)
```

## 获取多个会话的推送通知设置

1. 每次最多可获取 20 个会话的推送通知设置。
2. 如果会话继承了 app 设置或其推送通知设置已过期，则返回的字典不包含此会话。

你可以调用 `getSilentModeForConversations` 获取多个会话的推送通知设置，示例代码如下：

```javascript
const params = {
  conversationList: [
    {
      id: 'test', // 会话 ID：单聊为对方用户 ID，群聊为群组 ID，聊天室会话为聊天室 ID。
      type: 'singleChat' // 会话类型：singleChat（单聊）、groupChat（群聊）和 chatRoom（聊天室）。
    },
    {
      id: '1234',
      type: 'groupChat'
    }
  ]
}
WebIM.conn.getSilentModeForConversations(params)
```

## 清除单个会话的推送通知方式的设置

你可以调用 `clearRemindTypeForConversation` 方法清除指定会话的推送通知方式的设置。清除后，默认情况下，此会话会继承 app 的设置。

调用该接口后，你的其他设备会收到 `onMultiDeviceEvent#removeSilentModeForConversation` 事件。

示例代码如下：

```javascript
const params = {
  conversationId: '12345', // 会话 ID：单聊为对方用户 ID，群聊为群组 ID，聊天室会话为聊天室 ID。
  type: 'groupChat', // 会话类型：singleChat（单聊）、groupChat（群聊）或 chatRoom（聊天室）。
}
WebIM.conn.clearRemindTypeForConversation(params)
```

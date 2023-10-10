# APNs 内容解析

## 单聊

### 不显示详情

```
{
	"aps":{
		"alert":{
			"body":"您有一条新消息"
		},	 
		"badge":1,				 
		"sound":"default"		 
	},
	"f":"6001",					 
	"t":"6006",					 
	"m":"373360335316321408"			 
}
```

- alert: 显示信息
- badge: 角标，表示离线消息数
- sound: 收到 APNs 时的提示音
- f: 消息发送方的环信 ID
- t: 消息接收方的环信 ID
- m: 消息 ID

------

### 显示详情

```
{
	"aps":{
		"alert":{
			"body":"ApnsNickName:xxxx"
		},	 
		"badge":1,				 
		"sound":"default"		 
	},
	"f":"6001",					 
	"t":"6006",					 
	"m":"373360335316321408"			 
}
```

- alert: 显示信息
- ApnsName: 发送方设置的用户名（即环信管理后台中看到的用户昵称）
- xxxx: 消息内容（发送方发的什么，就显示什么）
- badge: 角标，表示离线消息数
- sound: 收到 APNs 时的提示音
- f: 消息发送方的环信 ID
- t: 消息接收方的环信 ID
- m: 消息 ID

------

## 群聊

### 不显示详情

```
{
	"aps":{
        "alert":{
            "body":"您有一条新消息"
        },	 
		"badge":1,				 
		"sound":"default"		 
	},
	"f":"6001",					 
	"t":"6006",	
	"g":"1421300621769",				 
	"m":"373360335316321408"			 
}
```

- alert: 显示信息
- badge: 角标，表示离线消息数
- sound: 收到 APNs 时的提示音
- f: 消息发送方的环信 ID
- t: 消息接收方的环信 ID
- g: 群组 ID
- m: 消息 ID

------

### 显示详情

```
{
	"aps":{
        "alert":{
            "body":"ApnsName:xxxx"
        },	 
		"badge":1,				 
		"sound":"default"		 
	},
	"f":"6001",					 
	"t":"6006",		
	"g":"1421300621769",
	"m":"373360335316321408"			 
}
```

- alert: 显示信息
- ApnsName: 发送方设置的用户名（即环信管理后台中看到的用户昵称）
- xxxx: 消息内容（发送方发的什么，就显示什么）
- badge: 角标，表示离线消息数
- sound: 收到 APNs 时的提示音
- f: 消息发送方的环信 ID
- t: 消息接收方的环信 ID
- g: 群组 ID
- m: 消息 ID

------

## 向 APNs 中添加扩展字段

APNs 扩展（em_apns_ext）：添加后，您收到的 APNs 中将带有您填写的字段，可以帮助您区分 APNs。

环信提供以下几种扩展字段：

| 扩展字段                | 描述                                 |
| :---------------------- | :----------------------------------- |
| em_push_content         | 自定义推送显示                       |
| em_push_category        | 向 APNs Payload 中添加 category 字段 |
| em_push_sound           | 自定义推送提示音                     |
| em_push_mutable_content | 开启 APNs 通知扩展                   |

#### 解析内容

```
{
    "apns": {
        "alert": {
            "body": "hello from rest"
        }, 
        "badge": 1, 
        "sound": "default"
    }, 
    "e": "自定义推送扩展", 
    "f": "6001", 
    "t": "6006", 
    "m": "373360335316321408"
}
```

- e: 您发送的自定义推送扩展

#### REST 发送

（[REST 发消息](https://docs-im.easemob.com/ccim/rest/message#发送消息)）

```
{
    "target_type": "users", 
    "target": [
        "6006"
    ], 
    "msg": {
        "type": "txt", 
        "msg": "hello from rest"
    }, 
    "ext": {
        "em_apns_ext": {
            "extern": "自定义推送扩展"
        }
    }, 
    "from": "6001"
}
```

#### iOS 发送

（[iOS 发消息](message.html#构造扩展消息)）

```
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"test"];
EMMessage *message = [[EMMessage alloc] initWithConversationID:@"6006" from:@"6001" to:@"6006" body:body ext:nil];
message.ext = @{@"em_apns_ext":@{@"extern":@"自定义推送扩展"}}; // 此处的ext和message初始化时传递的ext效果是一样的，此处单独抽出来的目的是表示的更清晰。
message.chatType = EMChatTypeChat; // 设置消息类型
[EMClient.sharedClient.chatManager sendMessage:message progress:nil completion:nil];￼
```

------

### 自定义显示

设置后，您收到的 APNs 的 alert 信息将是您设置的信息。

#### 解析

```
{
	"aps":{
		"alert":{
			"body":"自定义推送显示"
		},	 
		"badge":1,				 
		"sound":"default"		 
	},
	"f":"6001",					 
	"t":"6006",					 
	"m":"373360335316321408"			 
}
```

#### REST 发送

([REST 发消息](/document/v1/server-side/message_single.html))

```
{
    "target_type": "users", 
    "target": [
        "6006"
    ], 
    "msg": {
        "type": "txt", 
        "msg": "hello from rest"
    }, 
    "from": "6001", 
    "ext": {
        "em_apns_ext": {
            "em_push_content": "自定义推送显示"
        }
    }
}
```

如果要兼容Android端，需要在消息的扩展中增加以下字段

```
"ext":{
      ...
      "em_android_push_ext":{
          //指定自定义渠道
          "em_push_channel_id":"Channel id",
          "em_push_sound":"/raw/appsound"
      }
  }
```

#### iOS 发送

([iOS 发消息](message.html#构造扩展消息))

```
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"test"];
EMMessage *message = [[EMMessage alloc] initWithConversationID:@"6006" from:@"6001" to:@"6006" body:body ext:nil];
message.ext = @{@"em_apns_ext":@{@"em_push_content":@"自定义推送显示"}}; // 此处的ext和message初始化时传递的ext效果是一样的，此处单独抽出来的目的是表示的更清晰。
message.chatType = EMChatTypeChat; // 设置消息类型
[EMClient.sharedClient.chatManager sendMessage:message progress:nil completion:nil];
```

------

### 自定义显示与自定义扩展

自定义显示与自定义扩展同时发给对方。

#### 解析

```
{
	"aps":{
		"alert":{
			"body":"自定义推送显示"
		},	 
		"badge":1,				 
		"sound":"default"		 
	},
	"f":"6001",					 
	"t":"6006",					 
	"m":"373360335316321408",
	"e": "自定义推送扩展", 
}
```

#### REST 发送

（[REST 发消息](https://docs-im.easemob.com/im/server/basics/messages#发送扩展消息)）

```
{
    "target_type": "users", 
    "target": [
        "6006"
    ], 
    "msg": {
        "type": "txt", 
        "msg": "hello from rest"
    }, 
    "from": "6001", 
    "ext": {
        "em_apns_ext": {
            "em_push_content": "自定义推送显示",
            "extern": "自定义推送扩展"
        }
    }
}
```

#### iOS 发送

([iOS 发消息](message.html#构造扩展消息))

```
NSString *willSendText = [EaseConvertToCommonEmoticonsHelper convertToCommonEmoticons:text];
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"test"];
EMMessage *message = [[EMMessage alloc] initWithConversationID:@"6006" from:@"6001" to:@"6006" body:body ext:nil];
message.ext = @{@"em_apns_ext":@{@"extern":@"自定义推送扩展",@"em_push_content":@"自定义推送显示"}}; // 此处的ext和message初始化时传递的ext效果是一样的，此处单独抽出来的目的是表示的更清晰。
message.chatType = EMChatTypeChat; // 设置消息类型
[EMClient.sharedClient.chatManager sendMessage:message progress:nil completion:nil];
```

------

### 添加category字段

向 APNs Payload 中添加 category 字段。

[苹果描述](https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/CreatingtheNotificationPayload.html#//apple_ref/doc/uid/TP40008194-CH10-SW1)

#### REST 发送

（[REST 发消息](https://docs-im.easemob.com/im/server/basics/messages#发送扩展消息)）

```
{
    "target_type": "users", 
    "target": [
        "6006"
    ], 
    "msg": {
        "type": "txt", 
        "msg": "hello from rest"
    }, 
    "from": "6001", 
    "ext": {
        "em_apns_ext": {
              "em_push_category" : "NEW_MESSAGE_CATEGORY"
        }
    }
}
```

------

### 自定义推送提示音

设置后，您收到的 APNs 的提示音将是您设置的提示音。

**注：**

- 如果没有设置该字段，则播放默认提示音；有此字段，如果找到了指定的声音就播放该声音，否则播放默认声音，如果此字段为空字符串，iOS 7 为默认声音，iOS 8 及以上系统为无声音。

- 以下示例自定义提示音文件名称为custom.caf。

- 集成方式：将自定义提示音的caf格式音频文件导入iOS工程，发送消息按以下示例增加消息扩展，当接收方离线收到APNs离线推送时，即可播放自定义的提示音。

支持格式 Linear PCM MA4 (IMA/ADPCM) µLaw aLaw

存放路径 AppData/Library/Sounds,时长不得超过30秒。 具体信息，可以参考苹果官方文档[Generating a Remote Notification](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/generating_a_remote_notification?language=objc)

#### 解析

```
{
    "aps":{
        "alert":{
            "body":"您有一条新消息"
        },  
        "badge":1,  
        "sound":"custom.caf"  
    },
    "f":"6001",  
    "t":"6006",  
    "m":"373360335316321408"  
}
```

#### REST 发送

（[REST 发消息](https://docs-im.easemob.com/im/server/basics/messages#发送扩展消息)）

**注：**“em_push_sound”为设置自定义 APNs 提示音的扩展字段，value 值为音频文件名，字符串类型。

```
{
    "target_type": "users", 
    "target": [
        "6006"
    ], 
    "msg": {
        "type": "txt", 
        "msg": "hello from rest"
    }, 
    "from": "6001", 
    "ext": {
        "em_apns_ext": {
            "em_push_sound": "custom.caf"
        }
    }
```

#### iOS 发送

([iOS 发消息](message.html#构造扩展消息))

```
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"test"];
EMMessage *message = [[EMMessage alloc] initWithConversationID:@"6006" from:@"6001" to:@"6006" body:body ext:nil];
message.ext = @{@"em_apns_ext":@{@"em_push_sound":@"custom.caf"}}; // 设置自定义APNs提示音的扩展字段，value值为音频文件名，字符串类型
message.chatType = EMChatTypeChat; // 设置消息类型
[EMClient.sharedClient.chatManager sendMessage:message progress:nil completion:nil];
```

------

### 开启 APNs 通知扩展

（UNNotificationServiceExtension）

设置后，该条消息的 APNs 推送将在服务端支持 UNNotificationServiceExtension ，还需要APP在项目中集成 UNNotificationServiceExtension ，才可使用 APNs 通知扩展。iOS 集成方式见 [Apple官方文档](https://developer.apple.com/documentation/usernotifications/unnotificationserviceextension?language=objc)

#### 解析

```
{
    "aps":{
        "alert":{
            "body":"您有一条新消息"
        },  
        "badge":1,  
        "sound":"default",
        "mutable-content":1  
    },
    "f":"6001",  
    "t":"6006",  
    "m":"373360335316321408"  
}
```

#### REST发送

（[REST 发消息](https://docs-im.easemob.com/im/server/basics/messages#发送扩展消息)）

**注：**“em_push_mutable_content”的 value 值为 bool 类型，true 为开启；false 或不设置，则是普通的 Remote Notification。

```
{
    "target_type": "users", 
    "target": [
        "6006"
    ], 
    "msg": {
        "type": "txt", 
        "msg": "hello from rest"
    }, 
    "from": "6001", 
    "ext": {
        "em_apns_ext": {
            "em_push_mutable_content": true
        }
    }
}
```

#### iOS发送

([iOS 发消息](message.html#构造扩展消息))

```
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"test"];
EMMessage *message = [[EMMessage alloc] initWithConversationID:@"6006" from:@"6001" to:@"6006" body:body ext:nil];
message.ext = @{@"em_apns_ext":@{@"em_push_mutable_content":@YES}}; // @YES为开启，@NO或不设置，则是普通的 Remote Notification
message.chatType = EMChatTypeChat; // 设置消息类型
[EMClient.sharedClient.chatManager sendMessage:message progress:nil completion:nil]; 
```

------

## APNs推送国际化配置

环信消息的离线推送可支持 APNs 以下几个国际化配置的 key：`title-loc-key`，`title-loc-args`，`loc-key`，`loc-args`

关于这几个 key 的官方解释：

- title-loc-key（String）：The key for a localized title string. Specify this key instead of the title key to retrieve the title from your app’s Localizable.strings files. The value must contain the name of a key in your strings file.

- title-loc-args（Array of strings）：An array of strings containing replacement values for variables in your title string. Each %@ character in the string specified by the title-loc-key is replaced by a value from this array. The first item in the array replaces the first instance of the %@ character in the string, the second item replaces the second instance, and so on.

- loc-key（String）：The key for a localized message string. Use this key, instead of the body key, to retrieve the message text from your app's Localizable.strings file. The value must contain the name of a key in your strings file.

- loc-args（Array of strings）：An array of strings containing replacement values for variables in your message text. Each %@ character in the string specified by loc-key is replaced by a value from this array. The first item in the array replaces the first instance of the %@ character in the string, the second item replaces the second instance, and so on.

[苹果官方开发文档](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/generating_a_remote_notification)

**注：**

- `title-loc-key` 与 `title-loc-args` 组成一对，没有 `title-loc-key` ， `title-loc-args` 不生效，如无可变参数，可以只设置 `title-loc-key`;

- `loc-key` 与 `loc-args` 组成一对，没有 `loc-key` ， `loc-args` 不生效，如无可变参数，可以只设置 `loc-key`；

- 以上两对也可以只设置其中一对。

### iOS 客户端配置

- 配置国际化文件 `Localizable.strings` ，如 demo 中配置了 `Localizable.strings (Chinese (Simplified))`、`Localizable.strings (English)`；

- 在 `Localizable.strings` 中配置 `title-loc-key` 和 `loc-key` ，并赋值，需要使用 `title-loc-args` 和 `loc-args` 中的可变参数的字符串，用 `%@` 代替；如下：

在 `Localizable.strings (Chinese (Simplified))` 中配置：

```
"GAME_PLAY_REQUEST_FORMAT" = "%@ 游戏邀请 %@";
"GAME_PLAY_REQUEST" = "游戏邀请";
```

在 `Localizable.strings (English)` 中配置：

```
"GAME_PLAY_REQUEST_FORMAT" = "%@ GAME_PLAY_REQUEST_FORMAT %@";
"GAME_PLAY_REQUEST" = "GAME_PLAY_REQUEST_CUSTOM";
```

### 发消息时设置消息扩展

#### REST 发送

```
{
    "target_type" : "users",
    "target" : ["6006"],
    "msg" : {
        "type" : "txt",
        "msg" : "hello from rest"
        },
    "ext": {
        "em_apns_ext": {
            "em_push_content": "自定义推送显示", # 可以同时设置自定义推送显示，没有配置loc-key的app，会显示"自定义推送显示"
            "em_push_title_loc_key" : "GAME_PLAY_REQUEST_FORMAT", # 对应title_loc_key
            "em_push_title_loc_args" : ["Shelly", "Rick"], # 对应title_loc_args
            "em_push_body_loc_key" : "GAME_PLAY_REQUEST_FORMAT", # 对应loc_key
            "em_push_body_loc_args" : ["Shelly", "Rick"] # 对应loc_args
        }
    },
    "from" : "6001"
}
```

#### iOS 发送

```
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"test"];
EMMessage *message = [[EMMessage alloc] initWithConversationID:@"6006" from:@"6001" to:@"6006" body:body ext:nil];
message.ext = @{@"em_apns_ext":@{@"em_push_title_loc_key":@"GAME_PLAY_REQUEST_FORMAT", @"em_push_title_loc_args":@[@"Shelly", @"Rick"], @"em_push_body_loc_key":@"GAME_PLAY_REQUEST_FORMAT", @"em_push_body_loc_args":@[@"Shelly", @"Rick"]}};
message.chatType = EMChatTypeChat; // 设置消息类型
[EMClient.sharedClient.chatManager sendMessage:message progress:nil completion:nil];
```

### 解析

```
{ 
    "aps":{ 
        "alert":{ 
            "body":"自定义推送显示",
            "title-loc-key":"GAME_PLAY_REQUEST_FORMAT",
            "title-loc-args":["Shelly","Rick"],
	    "loc-key":"GAME_PLAY_REQUEST_FORMAT", 
            "loc-args":["Shelly","Rick"] 
        },	
        "badge":1,	
        "sound":"default"	
    }, 
    "f":"6001",	
    "t":"6006",	
    "m":"373360335316321408"	
} 
```

## 发送静默消息

（em_ignore_notification）

不发APNs。发送时添加后，该消息将不会有 APNs 推送。

### REST 发送

（[REST 发消息](https://docs-im.easemob.com/im/server/basics/messages#发送扩展消息)）

```
{
	"target_type":"users",
	"target":[
		"6006"
	],
	"msg":{
		"type":"txt",
		"msg":"hello from rest"
	},
	"from":"6001",
	"ext":{
		"em_ignore_notification":true
	}
}
```

------

### iOS 发送

([iOS 发消息](message.html#构造扩展消息))

```
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"test"];
EMMessage *message = [[EMMessage alloc] initWithConversationID:@"6006" from:@"6001" to:@"6006" body:body ext:nil];
message.ext = @{@"em_ignore_notification":@YES};
message.chatType = EMChatTypeChat; // 设置消息类型
// 发送消息示例
[EMClient.sharedClient.chatManager sendMessage:message progress:nil completion:nil];
```

------

## 设置强制推送型 APNs

（em_force_notification）

设置后，将强制推送消息，即使客户端设置了免打扰时间，也会得到推送。优先级比 em_ignore_notification 低，即同时设置 em_ignore_notification 后，该属性将失效。

### REST 发送

（[REST 发消息](https://docs-im.easemob.com/im/server/basics/messages#发送扩展消息)）

```
{
	"target_type":"users",
	"target":[
		"6006"
	],
	"msg":{
		"type":"txt",
		"msg":"hello from rest"
	},
	"from":"6001",
	"ext":{
		"em_force_notification":true
	}
}
```

------

### iOS 发送

([iOS 发消息](message.html#构造扩展消息))

```
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"test"];
EMMessage *message = [[EMMessage alloc] initWithConversationID:@"6006" from:@"6001" to:@"6006" body:body ext:nil];
message.ext = @{@"em_force_notification":@YES};
message.chatType = EMChatTypeChat; // 设置消息类型
// 发送消息示例
[EMClient.sharedClient.chatManager sendMessage:message progress:nil completion:nil];
```
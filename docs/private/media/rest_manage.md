# 会议管理


环信使用 REST 的方式来对音视频会议进行管理操作，包括**创建会议**，**解散会议**，**获取会议**及**从会议中踢人**。

**注：**

- 原会议类型模式目前已经进行优化，用户可以直接使用普通模式， 大会议模式和直播模式将弃用。

- 在[语音连麦聊天室](scenario_tc.html)中，环信仅使用了**创建会议**，**解散会议**两个API，开发者可根据自身需求，选择使用。

# REST API

音视频会议管理在集成过程中，可以使用以下4个接口来对会议进行管理操作。请查看以下 REST API 详细文档说明。

| 名称               | 请求                                                  | Method |
| :----------------- | :---------------------------------------------------- | :----- |
| 创建一个会议       | /{orgName}/{appName}/conferences                      | POST   |
| 解散一个会议       | /{orgName}/{appName}/conferences/{confrId}            | DELETE |
| 获取会议信息       | /{orgName}/{appName}/conferences/{confrId}            | GET    |
| 从会议中踢掉一个人 | /{orgName}/{appName}/conferences/{confrId}/{userName} | DELETE |

## 创建会议

#### HTTP Request

| ![img](/images/privitization/post.png) | /{org_name}/{app_name}/conferences |
| :----------------------------------------------------------- | :--------------------------------- |

#### Request Headers

| 参数          | 说明             |
| :------------ | :--------------- |
| Content-Type  | application/json |
| Authorization | Bearer ${token}  |

#### Request Body

| 名称                     | 类型    | 描述                                                         |
| :----------------------- | :------ | :----------------------------------------------------------- |
| confrType                | int     | 10: 普通模式 ~~11: 大会议模式 12: 直播模式~~                 |
| password                 | string  | 指定密码时，将使用此密码；不指定，将由服务端生成             |
| confrDelayMillis         | long    | 会议临时保留时长，指从会议创建成功到第一个用户加入会议之间的时长，单位是毫秒。超过这个保留时间，会议将被解散。第一个人加入会议之后，此保留时间失效，当最后一人离开会议，会议会立即被销毁。此参数默认是120秒，建议不要设置超过60分钟。 |
| memDefaultRole           | int     | 会议成员默认角色。用户A通过会议 ID 密码获取加入会议后的角色就是这个 1:观众，3:主播，7:管理员（拥有主播权限）。 缺省时，根据会议类型设置，目前规则如下：普通模式默认主播；~~大会议模式默认主播；直播模式默认观众~~ |
| allowAudienceTalk        | boolean | true 允许观众上麦                                            |
| creator                  | string  | 指定创建者，creator 将会成为这个会议的管理员，拥有管理员权限 |
| rec                      | boolean | true 此会议将被录制                                          |
| recMerge                 | boolean | true 此会议的所有通话将被合并到一个文件                      |
| supportWechatMiniProgram | boolean | true 这个会议将支持小程序，同时会议编码被强制更新为H264,VP8。注意：默认的会议是不支持小程序的，如果想要支持小程序，请手动指定这个参数为true |
| useVCodes                | 数组    | 指定会议将要采用的编码方式如[“H264”,“VP8”]                   |
| maxTalkerCount           | int     | 会议主播人数                                                 |
| maxVideoCount            | int     | 会议最大视频数                                               |
| maxAudienceCount         | int     | 会议中的最大人数                                             |

#### Response Body

| 名称              | 类型    | 描述                                                         |
| :---------------- | :------ | :----------------------------------------------------------- |
| type              | int     | 10: 普通模式 ~~11: 大会议模式 12: 直播模式~~                 |
| talkerLimit       | int     | 主播上限数，~~大会议模式全部是是主播~~                       |
| id                | string  | 会议ID                                                       |
| password          | string  | 会议密码                                                     |
| allowAudienceTalk | boolean | 允许观众上麦，~~大会议模式时忽略此项~~                       |
| audienceLimit     | int     | 观众上限数，~~大会议模式无观众~~                             |
| expireDate        | Date    | 过期时间，创建会议后，如果在 expireDate 之前没有人加入会议，将会被系统强制解散 |

#### 请求示例

```
curl -L -X POST 'http://127.0.0.1:9090/easemob-demo/hcl/conferences' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YWMtaJszCI5vEemOhnkmxEo52QAAAAAAAAAAAAAAAAAAAAHmqirKW28R6ZB2cYf5QmSUAQMAAAFrVLgKfgBPGgC863CANqOsZOAF1tnxLeMc0Z-gRFCQwqV-0MB5nVAB5A' \
--header 'Content-Type: application/json' \
--data-raw '{
	"confrType": 10,
    "password": "",
	"confrDelayMillis": 100000,
	"memDefaultRole":3,
	"allowAudienceTalk": false,
    "confrId": "",
    "creator":"122",
	"rec":false,
	"recMerge":false,
    "supportWechatMiniProgram": true,
    "useVCodes": [
        "H264",
        "VP8"
    ],
    "maxTalkerCount":9,
    "maxVideoCount":9,
    "maxAudienceCount":20

    
}'
```

#### 可能返回的结果示例

- 返回值200，表示会议创建成功
- 返回值401，未授权[无token、token错误、token过期]
- 返回值403，没有开通音视频增值服务调用接口失败

```
{
    "error": 0,
    "id": "IM3SKW51SKH4TB80LV45000C7",
    "type": 10,
    "mixed": false,
    "password": "0.37898245722568236",
    "audienceLimit": 600,
    "talkerLimit": 6,
    "expireDate": "2019-06-14 15:41:58",
    "allowAudienceTalk": true
}
```



------

## 解散会议

#### HTTP Request

| ![img](/images/privitization/delete.png) | /{orgName}/{appName}/conferences/{confrId} |
| :----------------------------------------------------------- | :----------------------------------------- |

需要在请求时对应填写{confrId}，需要删除的会议 ID 。

#### Request Headers

| 参数          | 说明             |
| :------------ | :--------------- |
| Content-Type  | application/json |
| Authorization | Bearer ${token}  |

#### 请求示例

```
curl -X DELETE -H 'Accept: application/json' -H 'Authorization: Bearer YWMt7CoyjusbEeixOi3iod4eDAAAAAAAAAAAAAAAAAAAAAGL4CTw6XgR6LaXXVmNX4QCAgMAAAFnJlhJIwBPGgCqtjiyVnR209iyr8kNbhJhhanNQDdP9CMmpK2G-NIUOQ' 'http://a1.easemob.com/easemob-demo/testapp/conferences/TURN25AIYAVxASW7PL1Q00C51'
```

#### 可能返回的结果

- 返回值200，表示会议解散成功
- 返回值404，表示该会议ID不存在
- 返回值401，未授权[无token、token错误、token过期]
- 返回值403，没有开通音视频增值服务调用接口失败

------

## 踢掉会议中成员

#### HTTP Request

| ![img](/images/privitization/delete.png) | /{orgName}/{appName}/conferences/{confrId}/{userName} |
| :----------------------------------------------------------- | :----------------------------------------- |

需要在请求时对应填写{confrId}，需要删除的会议 ID 。

userName为成员用户名。

#### Request Headers

| 参数          | 说明             |
| :------------ | :--------------- |
| Content-Type  | application/json |
| Authorization | Bearer ${token}  |

#### 请求示例

```
curl -X DELETE -H 'Accept: application/json' -H 'Authorization: Bearer YWMt7CoyjusbEeixOi3iod4eDAAAAAAAAAAAAAAAAAAAAAGL4CTw6XgR6LaXXVmNX4QCAgMAAAFnJlhJIwBPGgCqtjiyVnR209iyr8kNbhJhhanNQDdP9CMmpK2G-NIUOQ' 'http://a1.easemob.com/easemob-demo/testapp/conferences/TURN25AIYAVxASW7PL1Q00C51/yangss'
```

#### 可能返回的结果

- 返回值200，表示会议解散成功
- 返回值404，表示该会议ID不存在
- 返回值401，未授权[无token、token错误、token过期]
- 返回值403，没有开通音视频增值服务调用接口失败

------

## 获取会议信息

#### HTTP Request

| ![img](/images/privitization/get.png) | /{orgName}/{appName}/conferences/{confrId} |
| :----------------------------------------------------------- | :----------------------------------------- |

需要在请求时对应填写{confrId}，需要获取的会议 ID 。

#### Request Headers

| 参数          | 说明             |
| :------------ | :--------------- |
| Content-Type  | application/json |
| Authorization | Bearer ${token}  |

#### Response Body

| 名称              | 类型    | 描述                                                         |
| :---------------- | :------ | :----------------------------------------------------------- |
| type              | int     | 10: 普通模式 ~~11: 大会议模式 12: 直播模式~~                 |
| talkerLimit       | int     | 主播上限数，~~大会议模式全部是是主播~~                       |
| id                | string  | 会议ID                                                       |
| password          | string  | 会议密码                                                     |
| allowAudienceTalk | boolean | 允许观众上麦，~~大会议模式时忽略此项~~                       |
| audienceLimit     | int     | 观众上限数，~~大会议模式无观众~~                             |
| expireDate        | Date    | 过期时间，创建会议后，如果在 expireDate 之前没有人加入会议，将会被系统强制解散 |
| mems              | Array   | 现有成员列表                                                 |

#### 请求示例

```
curl -X GET \
  http://a1.easemob.com/1100181023201864/voicechatroom/conferences/IM3SKW51SKH4TB80LV45000C7 \
  -H 'Accept: */*' \
  -H 'Authorization: Bearer YWMtaJszCI5vEemOhnkmxEo52QAAAAAAAAAAAAAAAAAAAAHmqirKW28R6ZB2cYf5QmSUAQMAAAFrVLgKfgBPGgC863CANqOsZOAF1tnxLeMc0Z-gRFCQwqV-0MB5nVAB5A'
```

#### 可能返回的结果示例

- 返回值200，表示会议获取成功
- 返回值404，表示该会议ID不存在
- 返回值401，未授权[无token、token错误、token过期]
- 返回值403，没有开通音视频增值服务调用接口失败

```
{
  "error": 0,
  "id": "13H05522N8TEXW49ESW00C10618",
  "type": 11,
  "mixed": true,
  "password": "",
  "audienceLimit": 0,
  "talkerLimit": 30,
  "allowAudienceTalk": true,
  "mems": [{
	       "memberId": "13H05522N8TEXW49ESW00C10618M2",
	       "memName": "easemob-demo#chatdemoui_lulu3",
	       "role": 7
	}]
}
```


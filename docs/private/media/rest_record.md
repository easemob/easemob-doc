# 录制及提取

------

环信使用 REST 的方式来获取实时音视频的录制文件，包括录制的音频文件和视频文件。

- 录制功能可以调用SDK接口控制开启，支持1v1录制和多人录制以及录制合成。
- 录制文件默认仅在音视频服务器保存30天，到期后会进行删除，如需长期使用，请在部署前确认保存时长。
- 录制系统会自动根据音视频编码选择文件格式，一般是.webm，.mkv和.mp4三种；合成录制文件固定为.mp4格式。
- 如果需要其他格式，用户可以自己下载转换，转换工具建议用ffmpeg。
- 获取录制文件后，如果需要下载，需要通过文件详情中的URL直接下载保存。
- SDK开启录制
  - [Android 1v1](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_call_manager.html#af7447a6669e37d5d0bbf976b098b435b)
  - [Android 多人](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a6a9bd493a33203869d37780d7f8cdbfe)
  - [iOS 1v1](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_call_manager-p.html#a429bded3e8040875d02e84936cd75521)
  - [iOS 多人](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a7cd6cdf1b116964fe114d700baf26dc6)
  - [Web 1v1](http://webim-h5.easemob.com/webrtc/jsdoc/out/global.html#makeVideoCall)
  - [Web 多人](http://webim-h5.easemob.com/emedia/jsdoc/out/global.html#createConference)
- 获取录制文件时所需要的confrId，可以从SDK中获取，下面以新版本SDK属性名称为例，老版本以各端SDK头文件内的属性名称为准。
  - 移动端：
    - iOS：
      - 1v1时：在监听通话建立完成的回调中 - (void)callDidConnect:(EMCallSession *)aSession，通过 aSession.serverVideoId 获取（serverVideoId为 EMCallSession 的属性，只有在通话建立完成后通过 EMCallSession 才能拿到 serverVideoId，否则在通话未建立完成时通过 EMCallSession 取到 serverVideoId 的为空）；
      - 多人时：在创建并加入会议 createAndJoinConferenceWithType 或者加入会议室 joinConferenceWithConfId 成功后，通过回调中的 EMCallConference 对象 aCall.confId 获取到；
    - Android：
      - 1v1时：在通话状态改变的监听中 void onCallStateChanged (CallState callState, CallError error)，通过判断 callState 的状态为 connected 通话建立完成时，通过 EMCallSession 的 getServerRecordId () 获取到录制文件id；
      - 多人时：在创建并加入会议 createAndJoinConference 或者加入会议室 joinConference 成功后，通过 callback 中的 EMConference 对象 调用 getConferenceId () 获取到；
  - web端：1v1时为WebIM.call.getServerRecordId()；多人时可以在createConference的回调里拿到；

服务器端存储的是压缩后的视频。录制文件的大小（每分钟）为：

- 240p: 0.75M ~ 3M
- 480p: 2.2M ~ 7.5M
- 720p: 6.5M ~ 18.5M
- 1080p: 15M ~ 37.5M



:::notice
1、通话时长<5s可能会出现服务器录制失败的情况。<br>
2、生成录制文件所花的时间和通话时长有关，通话时间越长，生成录制文件的时间也越长。一般情况下，通话时间1小时以下，在通话结束后2小时可以获取到，为了保证录制文件数据完整建议在24小时后获取。
:::

------

# REST API

服务器录制文件获取在集成过程中，可以使用以下4个接口获取录制文件。请查看以下 REST API 详细文档说明。

| 名称                             | 请求                                                         |
| :------------------------------- | :----------------------------------------------------------- |
| 会议ID获取全部录制文件           | {orgName}/{appName}/audio/{confrId}                          |
| 开始结束时间获取全部录制文件     | {orgName}/{appName}/audio/{beginTime}/{endTime}/{startId}/{length} |
| 开始结束时间获取全部合成录制文件 | {orgName}/{appName}/audio/merge/{beginTime}/{endTime}/{startId}/{length} |
| 获取会议内user全部录制文件       | {orgName}/{appName}/audio/{userName}/{confrId}               |

## 会议ID获取全部录制文件

通过指定会议ID获取全部的录制文件。

:::tip
录制的文件默认保存30天。
:::
#### HTTP Request

| ![img](@static/images/privitization/get.png)  | **{orgName}/{appName}/audio/{confrId}** |
| :----------------------------------------------------------- | :-------------------------------------- |

需要在请求时对应填写{confrId}会议ID，如果当前没有会议ID，请从其他接口获取。

#### Request Headers

| 参数          | 说明             |
| :------------ | :--------------- |
| Content-Type  | application/json |
| Authorization | Bearer ${token}  |

#### Response Body

返回的文件数据列表是以文件编号id，升序排列。

| 参数           | 说明                                                         |
| :------------- | :----------------------------------------------------------- |
| id             | 录制文件数字编号                                             |
| owner          | 录制文件所在的appkey                                         |
| confrBeginTime | 录制文件所在多人会议的开始时间                               |
| confrEndTime   | 录制文件所在多人会议的结束时间                               |
| confrType      | 会议类型，“CONFR”、“COMMUNICATION”均是普通会议、~~“COMMUNICATION_MIX”混音会议最多支持30人以下的音频混合、“LIVE”互动会议~~ |
| confrId        | 会议ID，全局唯一                                             |
| userName       | 参加会议人员，以appkey_username表示（talker，直播模式下的主播） |
| memberName     | 参加会议人员，以appkey_username表示（talker，直播模式下的主播）IM情况下为 JID，系统唯一的ID |
| accessId       | 参加会议时链接的ID                                           |
| pubStreamId    | 推流ID                                                       |
| recordType     | 录制文件类型，“ONLY_REC_ONE_AV”是单人音视频，“ONLY_REC_ONE_DESKTOP”是单人共享桌面，“MERGE_ALL”合成视频文件 |
| recordTime     | 录制完成时间                                                 |
| expireTime     | URL过期时间                                                  |
| url            | 录制文件的下载链接                                           |

#### 请求示例

```
curl -X GET -i "http://a1.easemob.com/easemob-demo/testapp/audio/IM_X364829524644331520C14" -H 'Authorization: Bearer YWMte3bGuOukEeiTkNP4grL7iwAAAAAAAAAAAAAAAAAAAAGL4CTw6XgR6LaXXVmNX4QCAgMAAAFnKdc-ZgBPGgBFTrLhhyK8woMEI005emtrLJFJV6aoxsZSioSIZkr5kw' -H 'Content-Type: application/json'
```

#### 可能返回的结果示例

- 返回值200，表示成功获取录制文件
- 返回结果是500，可能是服务器故障
- 返回结果是**429、503**或者其他**5xx**，有可能代表该接口被限流了，请稍微暂停一下并重试。详见[接口限流说明](../../product/limitationapi.html)

```
{
    "id": 109,
    "owner": "easemob-demo#testapp",
    "confrBeginTime": "2019-02-21 17:56:04",
    "confrEndTime": "2019-02-21 17:56:46",
    "confrType": "LIVE",
    "confrId": "IM_X364829548358926336C16",
    "memberId": "IM_X364829548358926336C16M21",
    "memberName": "easemob-demo#testapp_user1",
    "userName": "easemob-demo#testapp_user1",
    "accessId": "HI365195406759428096",
    "pubStreamId": "rtc-10-xbd__Of_C16M21",
    "recordType": "ONLY_REC_ONE_AV",
    "recordTime": "2019-02-21 17:56:49",
    "expireTime": "2019-03-23 17:56:49",
    "url": "http://kefu-media-files.oss-cn-beijing.aliyuncs.com/1esugl4lgti4qbtle1l450gunvphf9uhi3kmb6b9rdc10cn0jf8g/20190221170556-000000410.webm?Expires=9223372036854775&OSSAccessKeyId=LTAI3pBwoxnmCWUw&Signature=tpQRDw0HS9feBkgnvmYObY2U850%3D"
}
```



------

## 开始结束时间获取全部录制文件

开始到结束时间内，以某个录制文件为起始点，获取之后一定数量的录制文件接口。

:::tip
录制的文件默认保存30天。
:::

#### HTTP Request

| ![img](@static/images/privitization/get.png) | **{orgName}/{appName}/audio/{beginTime}/{endTime}/{startId}/{length}** |
| :----------------------------------------------------------- | :----------------------------------------------------------- |


需要在请求时对应填写{beginTime}/{endTime}，起始录制文件id编号{startId}，获取的数量{length}。`length限制长度是100，如果请求超过100是会返回错误`。

 **如果要取从开始至结束时间的前100个录制文件，起始录制文件id可以为0，获取数量100；如果要继续获取后面的100个录制文件，需要将上次获取的最后一个录制文件id作为下一次请求的起始id继续发起请求。**

#### Request Headers

| 参数          | 说明             |
| :------------ | :--------------- |
| Content-Type  | application/json |
| Authorization | Bearer ${token}  |

#### 请求示例

```
curl -X GET -i "http://a1.easemob.com/easemob-demo/testapp/audio/20190101080607/20190304050607/0/2" -H 'Authorization: Bearer YWMte3bGuOukEeiTkNP4grL7iwAAAAAAAAAAAAAAAAAAAAGL4CTw6XgR6LaXXVmNX4QCAgMAAAFnKdc-ZgBPGgBFTrLhhyK8woMEI005emtrLJFJV6aoxsZSioSIZkr5kw' -H 'Content-Type: application/json'
```

#### 可能返回的结果示例

- 返回值200，表示成功获取录制文件
- 返回结果是500，可能是服务器故障
- 返回结果是**429、503**或者其他**5xx**，有可能代表该接口被限流了，请稍微暂停一下并重试。详见[接口限流说明](../../product/limitationapi.html)


```
{
    "id": 112,
    "owner": "easemob-demo#testapp",
    "confrBeginTime": "2019-02-21 17:56:04",
    "confrEndTime": "2019-02-21 17:56:46",
    "confrType": "LIVE",
    "confrId": "IM_X364829548358926336C16",
    "memberId": "IM_X364829548358926336C16M21",
    "memberName": "easemob-demo#testapp_user1",
    "userName": "easemob-demo#testapp_user1",
    "accessId": "HI365195406759428096",
    "recordType": "ONLY_REC_ONE",
    "recordTime": "2019-02-21 17:56:49",
    "expireTime": "2019-03-23 17:56:49",
    "url": "http://kefu-media-files.oss-cn-beijing.aliyuncs.com/mlgh7n0ltu09sehvst53dh8huurqrj6f5knbhfbnopppgoocr67/20190221170556-000000408.webm?Expires=9223372036854775&OSSAccessKeyId=LTAI3pBwoxnmCWUw&Signature=hZk4jJDcMsuJfioscv%2B4L1zk1aA%3D"
}
```


------

## 开始结束时间获取全部合成录制文件

开始到结束时间内，以某个录制文件为起始点，获取之后一定数量的合成录制文件接口。

:::tip
录制的文件默认保存30天。
:::

#### HTTP Request

| ![img](@static/images/privitization/get.png) | **{orgName}/{appName}/audio/merge/{beginTime}/{endTime}/{startId}/{length}** |
| :----------------------------------------------------------- | :----------------------------------------------------------- |

需要在请求时对应填写{beginTime}/{endTime}，起始录制文件id编号{startId}，获取的数量{length}。`length限制长度是100，如果请求超过100是会返回错误`。 

**如果要取从开始至结束时间的前100个合成录制文件，起始录制文件id可以为0，获取数量100；如果要继续获取后面的100个合成录制文件，需要将上次获取的最后一个合成录制文件id作为下一次请求的起始id继续发起请求。**

#### Request Headers

| 参数          | 说明             |
| :------------ | :--------------- |
| Content-Type  | application/json |
| Authorization | Bearer ${token}  |

#### 请求示例

```
curl -X GET -i "http://a1.easemob.com/easemob-demo/testapp/audio/merge/20190101080607/20190304050607/0/2" -H 'Authorization: Bearer YWMte3bGuOukEeiTkNP4grL7iwAAAAAAAAAAAAAAAAAAAAGL4CTw6XgR6LaXXVmNX4QCAgMAAAFnKdc-ZgBPGgBFTrLhhyK8woMEI005emtrLJFJV6aoxsZSioSIZkr5kw' -H 'Content-Type: application/json'
```

#### 可能返回的结果示例

- 返回值200，表示成功获取录制文件
- 返回结果是500，可能是服务器故障
- 返回结果是**429、503**或者其他**5xx**，有可能代表该接口被限流了，请稍微暂停一下并重试。详见[接口限流说明](../../product/limitationapi.html)


```
{
    "id": 112,
    "owner": "easemob-demo#testapp",
    "confrBeginTime": "2019-02-21 17:56:04",
    "confrEndTime": "2019-02-21 17:56:46",
    "confrType": "LIVE",
    "confrId": "IM_X364829548358926336C16",
    "memberId": "IM_X364829548358926336C16M21",
    "memberName": "easemob-demo#testapp_user1",
    "userName": "easemob-demo#testapp_user1",
    "accessId": "HI365195406759428096",
    "recordType": "MERGE_ALL",
    "recordTime": "2019-02-21 17:56:49",
    "expireTime": "2019-03-23 17:56:49",
    "url": "http://kefu-media-files.oss-cn-beijing.aliyuncs.com/mlgh7n0ltu09sehvst53dh8huurqrj6f5knbhfbnopppgoocr67/20190221170556-000000408.webm?Expires=9223372036854775&OSSAccessKeyId=LTAI3pBwoxnmCWUw&Signature=hZk4jJDcMsuJfioscv%2B4L1zk1aA%3D"
}
```


------

## 获取会议内user全部录制文件

指定会议ID内的用户获取全部录制文件。

:::tip
录制的文件默认保存30天。
:::

#### HTTP Request

| ![img](@static/images/privitization/get.png)| **{orgName}/{appName}/audio/{userName}/{confrId}** |
| :----------------------------------------------------------- | :------------------------------------------------- |

需要在请求时对应填写{confrId}会议ID，如果当前没有会议ID，请从其他接口获取。以及{userName}用户名。

#### Request Headers

| 参数          | 说明             |
| :------------ | :--------------- |
| Content-Type  | application/json |
| Authorization | Bearer ${token}  |

#### 请求示例

```
curl -X GET "http://a1.easemob.com/easemob-demo/testapp/audio/user1/IM_X364829524644331520C14" -H 'Authorization: Bearer YWMte3bGuOukEeiTkNP4grL7iwAAAAAAAAAAAAAAAAAAAAGL4CTw6XgR6LaXXVmNX4QCAgMAAAFnKdc-ZgBPGgBFTrLhhyK8woMEI005emtrLJFJV6aoxsZSioSIZkr5kw' -H 'Content-Type: application/json'
```

#### 可能返回的结果示例

- 返回值200，表示成功获取录制文件
- 返回结果是500，可能是服务器故障
- 返回结果是**429、503**或者其他**5xx**，有可能代表该接口被限流了，请稍微暂停一下并重试。详见[接口限流说明](../../product/limitationapi.html)


```
{
    "id": 112,
    "owner": "easemob-demo#testapp",
    "confrBeginTime": "2019-02-21 17:56:04",
    "confrEndTime": "2019-02-21 17:56:46",
    "confrType": "LIVE",
    "confrId": "IM_X364829548358926336C16",
    "memberId": "IM_X364829548358926336C16M21",
    "memberName": "easemob-demo#testapp_user1",
    "userName": "easemob-demo#testapp_user1",
    "accessId": "HI365195406759428096",
    "recordType": "ONLY_REC_ONE",
    "recordTime": "2019-02-21 17:56:49",
    "expireTime": "2019-03-23 17:56:49",
    "url": "http://kefu-media-files.oss-cn-beijing.aliyuncs.com/mlgh7n0ltu09sehvst53dh8huurqrj6f5knbhfbnopppgoocr67/20190221170556-000000408.webm?Expires=9223372036854775&OSSAccessKeyId=LTAI3pBwoxnmCWUw&Signature=hZk4jJDcMsuJfioscv%2B4L1zk1aA%3D"
}
```

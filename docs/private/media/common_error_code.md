# 音视频错误码描述

## 服务端错误码

SUCCESS(0) 成功

TOKEN_AUTHZ_FAIL(-100) imtoken认证失败

ILLEGAL_RIGHTS(-101) 权限不够，比如观众不允许发布流

REQUEST_PARAMS_ERROR(-200) 请求参数不正确

CONFR_NOT_EXIST(-301) 会议不存在，可能是超时

CONFR_DISBAND(-302) 会议被解散

SYS_REFUSE_CRT_CONFR(-700) 不允许创建会议

SYS_REFUSE_ENTER_CONFR(-701) 不允许加入会议

SYS_REFUSE_CHANAGE_ROLES(-702) 不允许更改成员权限

RTC_SERVICE_NON_ACTIVATED(-706) rtc服务不可用，比如没有开通rtc服务

RTC_SERVICE_ARREARS(-707) rtc服务欠费

RTC_SERVICE_DISABLE(-708) rtc服务被封

RTC_SERVICE_CLOSED(-709) rtc服务被关闭

EXCEPTION(-501) 异常操作，比如在不允许pub流时强行pub流

TICKET_INVALID(-500) ticket不可用，比如解析失败

TICKET_EXPIRED(-502) ticket过期

MEMBER_INVALID(-504) 成员不正确，比如ticket验证失败，成员过期

CONFR_INVALID(-506) 会议不可用，比如会议过期，被关闭

PASSWORD_INVALID(-508) 密码不正确

NOT_SUPPORT_CLIENT(-510) 不支持的终端

SUBFAIL_NOT_SUPPORT_VCODES(-520) 不支持的编码方式

CONFR_MEMBER_TOO_MANY(-522) 会议成员太多

CONFR_TALKER_TOO_MANY(-523) 会议主播太多

PUB_VIDEO_TOO_MANY(-524) 发布视频流太多

REQUIRE_SDP(-550) 需要提供sdp

REQUIRE_RTC(-552) 需要支持rtc

PUB_INACTIVE(-554) 发布流失败

BAD_REQUEST(-501) 错误的请求，包含很多情况

NOT_SUPPORT_OPER(-507) 不支持的操作，比如不可见的成员要求更改流设置

## 移动端错误码

### Android端错误码

GENERAL_ERROR = 1 一般错误，未细分的错误一般通过此errorcode抛出来

NETWORK_ERROR = 2 网络异常

CALL_INVALID_ID = 800 callid无效

CALL_BUSY = 801 正在通话中

CALL_REMOTE_OFFLINE = 802 对方不在线

CALL_CONNECTION_ERROR = 803 建立连接失败

CALL_CONFERENCE_CREATE_FAILED = 804 会议创建失败

CALL_CONFERENCE_CANCEL = 805 会议取消

CALL_ALREADY_JOIN = 806 已经加入

CALL_ALREADY_PUB = 807 已经 Publish

CALL_ALREADY_SUB = 808 已经 Subscribe

CALL_NO_SESSION = 809 没有 Session

CALL_NO_PUBLISH = 810 没有 Publish

CALL_NO_SUBSCRIBE = 811 没有 Subscribe

CALL_NO_STREAM = 812 没有 Stream

CALL_TICKET_INVALID = 813 会议 Ticket 无效

CALL_TICKET_EXPIRED = 814 会议 Ticket 过期

CALL_SESSION_EXPIRED = 815 会议会话过期

CALL_CONFERENCE_NO_EXIST = 816 会议不存在或者已经解散

CALL_INVALID_CAMERA_INDEX = 817 无效的摄像头编号

CALL_INVALID_PARAMS = 818 无效的会议参数

CALL_CONNECTION_TIMEOUT = 819 通话连接超时

CALL_JOIN_TIMEOUT = 820 通话加入超时

CALL_OTHER_DEVICE = 821 通过其他设备加入会议

CALL_CONFERENCE_DISMISS = 822 会议解散

CALL_TALKER_ISFULL = 823 主播已满

CALL_CONFERENCE_ALREADY_IN_CONFERENCE = 824 主播已经在当前会议中

### iOS端错误码

EMErrorGeneral = 1, 一般错误

EMErrorNetworkUnavailable = 2, 网络不可用

EMErrorCallInvalidId = 800, 实时通话ID无效

EMErrorCallBusy = 801, 已经在进行实时通话了

EMErrorCallRemoteOffline = 802, 对方不在线

EMErrorCallConnectFailed = 803, 实时通话建立连接失败

EMErrorCallCreateFailed = 804, 创建实时通话失败

EMErrorCallCancel = 805, 取消实时通话

EMErrorCallAlreadyJoined= 806, 已经加入了实时通话

EMErrorCallAlreadyPub= 807, 已经上传了本地数据流

EMErrorCallAlreadySub= 808, 已经订阅了该数据流

EMErrorCallNotExist = 809, 实时通话不存在

EMErrorCallNoPublish = 810, 实时通话没有已经上传的数据流

EMErrorCallNoSubscribe = 811, 实时通话没有订阅数据流

EMErrorCallNoStream = 812, 实时通话没有数据流

EMErrorCallInvalidTicket = 813, 无效的ticket

EMErrorCallTicketExpired = 814, ticket已过期

EMErrorCallSessionExpired = 815, 实时通话已过期

EMErrorCallInvalidParams = 818, 无效的会议参数

EMErrorCallSpeakerFull = 823, 主播个数已达到上限

EMErrorCallVideoFull = 824, 视频个数已达到上限

EMErrorCallCDNError = 825, cdn推流错误

# 超级社区错误码

本文介绍环信超级社区（Circle） iOS SDK 中接口调用或者回调中的错误码。你可以根据错误码判断错误原因。

下表中的错误码为超级社区特有，其他的与即时通讯 IM SDK 相同，详见 [iOS SDK 错误码](/document/ios/error.html)。

| 错误码 |  错误信息     | 可能原因  |
| :-----: | :----------------------------- | :--------------------------- |
| 7     |  EMErrorPartialSuccess   | 请求返回成功，但有一些错误，例如，批量设置语聊频道的属性，若某条属性其他用户已设置，则设置失败，其它的可以设置成功。                       |
| 112     | EMErrorQueryParamReachesLimit    | 参数超过限制，例如，社区名称超过了 50 个字符。   |
| 113  | EMErrorReachLimit           | 用户加入社区的数量超过限制。     |
| 114  | EMErrorRepeatedOperation          | 用户已经在社区中。    |
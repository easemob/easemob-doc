# 主动文本审核

对于文本审核，除了 [配置文本审核规则](moderation_rule_config.html#添加文本审核规则)和 [关键词审核](moderation_keyword.html) 外，你还可以调用 [主动文本审核](/document/server-side/moderation_text_active.html) REST API 传入文本内容进行审核。

## 与文本审核规则的区别

该 API 和 [文本审核服务](moderation_rule_config.html#添加文本审核规则) 的区别如下表所示。你可以根据业务场景选择使用。

|  文本审核类型     | 审核对象| 使用方式 |  服务开通 |
| :-------------- | :----- | :------- | :----------------------------------------------------------- |
| 主动文本审核 REST API  | 业务服务器传入的文本内容。   | 调用文本审核 API，业务服务器传入需审核的文本内容，环信服务器进行审核，返回审核结果。| 1. 在环信控制台 [开通文本审核服务](moderation_enable.html)。<br/> 2. 联系环信商务开通该 API 的使用。 |                                                          |
| 文本审核服务            | 即时通讯 IM 发送的文本类型消息。   | 文本审核服务开箱即用。你基于业务的审核规则，配置单聊、群组或聊天室会话的 [文本审核规则](moderation_rule_config.html#添加文本审核规则)。  | 在环信控制台 [开通文本审核服务](moderation_enable.html)。                                                         |

## 使用主动文本审核 API

使用该 API 前，你需要在环信控制台 [开通文本审核服务](moderation_enable.html)，并且 **联系环信商务** 开通该 API 的使用。

关于该 API 的详情，请参见 [主动文本审核 REST API](/document/server-side/moderation_text_active.html)。
# 规则测试

## 前提条件

[开通内容审核服务](moderation_enable.html)。

## 测试审核效果

本文以文本审核服务为例，介绍如何使用后台**规则测试**页面快捷测试审核效果。

**1、进入规则测试页**

选择**内容审核 > 文本审核 > 规则测试**，打开**规则测试**页面。

![img](@static/images/moderation/moderation_rule_test_01.png)

**2、选择规则名称**

**规则名称**可显示当前已创建的所有规则，选择后即会按对应规则审核，此处以单聊文本为例演示。

![img](@static/images/moderation/moderation_rule_test_02.png)

**3、输入要审核的文本内容**

![img](@static/images/moderation/moderation_rule_test_03.png)

**4、点击立即审核，查看结果**

![img](@static/images/moderation/moderation_rule_test_04.png)

审核结果：表示智能模型审核返回的结果。如果该结果不符合预期，可通过新增自定义调整，如有疑问可联系商务。

- 调用成功时，会返回 通过/拒绝/疑似；
- 调用异常，会出现 无权限/调用失败（即超时未返回结果）2 类情况。

消息处理结果：表示消息的下发结果，根据规则里配置得出；存在通过/拦截/替换*** 3 种情况。如果该结果不符合预期，可通过修改规则配置调整，详见[规则配置](moderation_rule_config.html)。
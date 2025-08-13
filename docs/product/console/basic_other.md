# 其他功能

创建应用后，除了用户、消息、群组和聊天室等功能，你还可以开通敏感词、REST IP 白名单和实时消息人工审核功能。

你可以按以下步骤打开其他配置页面：

1. 登录 [环信控制台](https://console.easemob.com/user/login)。
2. 选择页面上方的 **应用管理**。在弹出的应用列表页面，单击你的应用的 **操作** 栏中的 **管理**。
3. 在左侧导航栏，选择 **功能配置** > **基础功能**。
4. 在 **其他** 页面，开通其他配置。

## 敏感词

敏感词服务为涉政词库。你可以根据当前的套餐包版本开通该服务：

- 免费版：点击 **立即升级** 升级至专业版或旗舰版。
- 专业版/旗舰版：点击 **免费开通** 开通该服务。

![img](/images/console/basic_other_sensitive_word.png)

![img](/images/console/basic_other_sensitive_word_service.png)

敏感词服务仅提供默认词库，保障基础安全，不支持自行添加词汇。若业务需要个性化的过滤效果，请开通内容审核服务。
你可以点击 **服务设置** 对应的 **编辑** 设置敏感词过滤策略：
- **屏蔽策略**：消息内容匹配到敏感词时的处理策略：
   - 发送端不能发送：消息不能从发出。
   -  接收端使用***代替：首先用 `***` 代替消息内容中的敏感词，然后再发送给接收方。
- **忽略大小写**：消息内容与敏感词匹配时忽略大小写：**是** 表示忽略；**否** 表示大小写敏感。

![img](/images/console/basic_other_sensitive_word_config.png)

## REST-IP 白名单

若仅允许通过某些 IP 地址调用 REST 接口发送消息，你可以将这些 IP 地址添加到 IP 白名单，而 IP 白名单之外的 IP 地址不能调用 RESTful 接口发送消息。

你可以点击 **免费开通** 开通 REST IP 白名单功能。

![img](/images/console/basic_other_rest_ip.png)

### 添加 IP 地址

1. 开通 REST IP 白名单后，点击 **设置** 进入 REST IP 白名单列表页面。

![img](/images/console/basic_other_rest_ip_set.png)

2. 点击 **添加白名单**。

![img](/images/console/basic_other_rest_ip_list.png)

3. 添加 IP 地址。

你需要输入正确的 IPv4 地址，一次只能输入 1 个 IP 地址，最多可添加 8 个。
添加的 IP 在 10 分钟左右生效。若 IP 白名单为空，表示所有 IP 地址都可以调用 REST API。

![img](/images/console/basic_other_rest_ip_add.png)

### 删除 IP 地址

如果你不再允许某个 IP 地址继续发送 REST 消息，可以在 IP 白名单中将其删除。如果你删除了 IP 白名单中所有 IP，即白名单列表为空，则默认所有 IP 地址均可发送 REST 消息。

1. IP 白名单列表中，点击指定 IP 地址的 **操作** 栏中的 **删除**。

![img](/images/console/basic_other_rest_ip_delete.png)

2. 在弹出的确认框中点击 **确认** 删除该 IP 地址。

![img](/images/console/basic_other_rest_ip_delete_confirm.png)

## 实时消息人工审核

你可以根据当前的套餐包版本开通该服务：

- 免费版：点击 **立即升级** 升级至专业版或旗舰版。
- 专业版/旗舰版：点击 **立即购买** 单独开通服务。

功能开通后，你可以对群组和聊天室中的消息和操作进行实时管理审核，详见 [群组审核管理](operation_group.html#群组审核管理) 和 [聊天室审核管理](opeartion_chatroom.html#聊天室审核管理) 文档。

![img](/images/console/basic_other_message_moderation.png)



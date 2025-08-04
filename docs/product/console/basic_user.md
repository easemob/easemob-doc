# 用户

创建应用后，你可以在 [环信控制台](https://console.easemob.com/user/login) 开通用户相关配置，包括用户注册、好友、用户状态、多端多设备等配置。

你可以按以下步骤打开用户配置页面：

1. 登录 [环信控制台](https://console.easemob.com/user/login)。
2. 选择页面上方的 **应用管理**。在弹出的应用列表页面，单击你的应用的 **操作** 栏中的 **管理**。
3. 在左侧导航栏，选择 **功能配置** > **基础功能**。
4. 在 **用户** 页面，开通用户相关配置。

![img](/images/console/basic_user.png)

## 注册用户总数上限

应用支持的注册用户总数上限取决于订阅的套餐版本：

- 免费版：支持 100 个注册用户。若要提升上限，点击 **升级** 升级至专业版或旗舰版。
- 专业版/旗舰版：对注册用户数无限制。

![img](/images/console/basic_user_count.png)

## 用户注册模式

用户注册模式包括授权注册和开发注册。你可以点击 **编辑** 切换用户注册模式。

- 授权注册：以应用管理员身份调用环信提供的 REST API 注册环信用户账号，注册后保存到你的服务器或返给客户端。该方式用于正式环境。相关的 REST API 介绍，详见 [授权注册单个用户](/document/server-side/account_system.html#授权注册单个用户) 和 [批量授权注册用户](/document/server-side/account_system.html#批量授权注册用户)的接口介绍。
- 开放注册：用户登录客户端 SDK 后自行通过账号密码注册账号。该方式一般用于体验 Demo 和测试环境，不推荐在正式环境中使用。相关的 API 介绍，详见 [客户端](/document/android/login.html#用户注册) 和 [REST API](/document/server-side/account_system.html#开放注册单个用户) 文档。

![img](/images/console/basic_user_registration.png)

## 单个用户好友数上限

单个用户的好友数量取决于订阅的套餐版本：
- 免费版：单个用户最多可有 100 个好友。若要提升该上限，点击 **升级** 升级至专业版或旗舰版。
- 专业版/旗舰版：单个用户最多可有 3000 个好友。

![img](/images/console/basic_user_friends.png)

## 好友关系检查

好友关系检查功能默认关闭，表示用户之间无需添加好友即可聊天。开启后，仅允许好友之间发送单聊消息。

对于各版本套餐包，使用该功能前需要先开启。

![img](/images/console/basic_user_friend_check.png)

## 用户黑名单

若需屏蔽某个用户的消息，可将其拉入黑名单。用户可将任何其他用户加入黑名单，不论该用户是否在好友列表上。用户被加入黑名单后，无法向对方发送消息或好友申请。关于该功能的详情，请参见 [黑名单文档](/document/server-side/user_relationship_blacklist_add.html)。

对于各版本套餐包，该功能默认关闭，使用前需点击 **免费开通**，然后开启。

![img](/images/console/basic_user_blocklist.png)

## 用户离在线状态实时同步

用户在线状态（Presence）包含用户的在线、离线和自定义状态。用户可设置自己的在线状态，订阅和查询其他用户的状态。关于该功能的详情，请参见 [在线状态订阅文档](/document/server-side/presence.html)。

你可以根据当前的套餐包版本开通该服务：

- 免费版：点击 **立即升级** 升级至专业版或旗舰版。
- 专业版：点击 **立即购买** 单独购买和开通服务。
- 旗舰版：点击 **免费开通** 开通服务。

![img](/images/console/basic_user_presence.png)

## 全局禁言

全局禁言指对单个用户设置单聊、群组或聊天室消息全局禁言。禁言后，该用户无法调用客户端 API 或 REST API 在单聊、群组或聊天室中发送消息。禁言到期后，服务器会自动解除禁言，恢复该用户发送消息的权限。关于该功能的详情，请参见 [全局禁言文档](/document/server-side/user_global_mute.html)。

你可以根据套餐版本开通该服务：

- 免费版：点击 **立即升级** 升级至专业版或旗舰版。
- 专业版：点击 **立即购买** 单独开通服务。
- 旗舰版：点击 **免费开通** 开通服务。

![img](/images/console/basic_user_mute.png)

## 多端多设备

多端多设备功能指同一账号在多个终端设备上同时使用。你可以根据当前的套餐版本开通该服务：

- 免费版：点击 **立即升级** 升级至专业版或旗舰版。
- 专业版/旗舰版：点击 **免费开通** 开通服务。开通后，点击 **设置** 设置多端登录时各端设备的数量。每端默认最多支持 4 个设备同时在线。如需提升该上限，请联系商务经理。并且，你可以单击 **新增自定义平台** 添加自定义平台，例如，将 Android 手机和 Android 系统的平板电脑设置为两个单独的平台。
关于该功能的详情，请参见 [多端多设备](/document/android/multi_device.html) 文档。

![img](/images/console/basic_user_multidevice.png)

![img](/images/console/basic_user_multidevice_activate.png)

![img](/images/console/basic_user_multidevice_set.png)

![img](/images/console/basic_user_multidevice_set_device.png)




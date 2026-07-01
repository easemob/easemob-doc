# Java Server SDK 2.0

## 功能概述

Server SDK 2.0 是对环信 IM [REST API](overview.html) 的封装，这样做是为了节省服务器端开发者对接环信 API 的时间，只需要配置自己的 App Key 相关信息即可使用。

Server SDK 2.0 提供了用户、消息、群组、聊天室等资源的操作管理能力。

## 前提条件

- Java 1.8
- 有效的环信即时通讯 IM 开发者账号和 App Key、Client ID、ClientSecret、BasePath (对应的 RESTful API 域名。详见环信控制台的 **应用概览**页面下的 **开发配置信息** 区域的 RESTful API 的服务器域名)。

## 实现方法

### 安装

如果你的项目使用 Maven 构建，在 pom.xml 中添加下面代码：

```xml
<dependency>
    <groupId>com.easemob.im</groupId>
    <artifactId>im-sdk-core</artifactId>
    <version>1.0.19</version>
</dependency>
```

如果你的项目使用 Gradle 构建，可以在 build.gradle 中添加下面代码：

```gradle
implementation 'com.easemob.im:im-sdk-core:V1.0.19'
```

### 使用

在使用 Java Server SDK 前，需要进行初始化。以下为使用 Easemob App Credentials 的情况：

```java
SDK 初始化建议写到配置类中，示例如下：
@Configuration
public class Config {

    static {
        try {
            com.easemob.im.Configuration.setDefaultApiClient(ApiClient.builder()
            //BasePath 对应的 RESTful API 域名。详见环信控制台的 “应用概览” 页面中的 “开发配置信息” 区域的 RESTful API 的服务器域名。
                    .setBasePath("BasePath")
                    .setAppKey("Appkey")
                    .setClientId("Client ID")
                    .setClientSecret("Client Secret")
                    .build());
        } catch (ApiException e) {
            // exception handling
        }
    }

}
```

根据业务资源，API 分为：

- [ChatFile](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/ChatFileApi.html) 用于上传下载附件。
- [Block](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/BlockApi.html) 用于限制访问(将用户加入黑名单)。
- [Contact](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/ContactApi.html) 用于管理好友(添加好友等)。
- [Group](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/GroupApi.html) 用于管理群组。
- [Thread](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/ThreadApi.html) 用于管理群组消息话题。
- [Message](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/MessageApi.html) 用于发送消息。
- [HistoryMessage](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/HistoryMessageApi.html) 用于下载历史消息记录。
- [User](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/UserApi.html) 用于管理用户。
- [Metadata](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/MetadataApi.html) 用于管理用户属性、群成员属性。
- [Token](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/TokenApi.html) 用于获取用户 Token。
- [Room](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/RoomApi.html) 用于管理聊天室。
- [Push](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/PushApi.html) 用于管理推送设置。
- [Presence](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/PresenceApi.html) 用于管理用户在线状态订阅。
- [Reaction](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/ReactionApi.html) 用于管理消息表情回复。

每个业务资源对应一个类，例如，用户相关的 API，都可以在 `UserAPi`中 找到。

举个例子，我们要注册一个用户，就可以这样写：

注意：在使用各业务 API 前，一定要保证 SDK 初始化完成。

```java
@Service
public class UserService {

    private UserApi userApi = new UserApi();

    private void createUser() {
        List<EMCreateUser> emCreateUserList = new ArrayList<>();
        EMCreateUser createUser = new EMCreateUser();
        createUser.setUsername("user1");
        createUser.setPassword("123");
        emCreateUserList.add(createUser);
      
        try {
            EMCreateUsersResult result = userApi.createUsers(emCreateUserList);
        } catch (EMException e) {
            e.getMessage();
        }

    }
}
```

各业务 API 的使用可以参考 [集成测试](https://github.com/easemob/easemob-im-server-sdk/tree/master_java_2.0/src/test/java/com/easemob/im/api)。

## 参考

- [Server SDK 开源地址](https://github.com/easemob/easemob-im-server-sdk/tree/master_java_2.0)。

## 常见问题

### 使用问题

如果开发者请求的 API 量比较大，可以设置连接池的连接数量、连接空闲时间等进行调优。

示例：

```java
try {
        Configuration.setDefaultApiClient(ApiClient.builder()
                .setBasePath("Rest BasePath")
                .setAppKey("Appkey")
                .setClientId("Client ID")
                .setClientSecret("Client Secret")
                .setMaxIdleConnections(100)
                .setConnectKeepAliveMilliSeconds(10000)
                .setConnectTimeoutMilliSeconds(10000)
                .setDispatcherMaxRequests(200)   // 该参数在 1.0.15 及以上版本支持，如需使用请升级 SDK 版本。
                .setDispatcherMaxRequestsPerHost(200) // 该参数在 1.0.15 及以上版本支持，如需使用请升级 SDK 版本。
                .build());
        } catch (ApiException e) {
            throw new RuntimeException(e);
        }
```

## 注意事项

1.使用代理的情况

前提需要你的代理支持 `CONNECT` 方法，确保你的代理配置文件中有 connectport 80 存在。

如果你使用的代代理不需要认证，那么需要传入自己的 IP、端口。

```java
ApiClient.EMProxy proxy = ApiClient.EMProxy.builder()
                .setIP("ip")
                .setPort(80)
                .build();

try {
    Configuration.setDefaultApiClient(ApiClient.builder()
            .setProxy(proxy) 
            .setBasePath("Rest BasePath")
            .setAppKey("Appkey")
            .setClientId("Client ID")
            .setClientSecret("Client Secret")
            .build());
} catch (ApiException e) {
    throw new RuntimeException(e);
}
```

如果你使用的代理需要认证，那么需要传入自己的 IP、端口、账号以及密码。

```java
ApiClient.EMProxy proxy = ApiClient.EMProxy.builder()
                .setIP("ip")
                .setPort(80)
                .setUsername("username")
                .setPassword("password")
                .build();

try {
    Configuration.setDefaultApiClient(ApiClient.builder()
            .setProxy(proxy)                       
            .setBasePath("Rest BasePath")
            .setAppKey("Appkey")
            .setClientId("Client ID")
            .setClientSecret("Client Secret")
            .build());
} catch (ApiException e) {
    throw new RuntimeException(e);
}
```

## 更新日志

### V1.0.19 2026-06-24

| 新增功能                     | 描述                                                    |
| :--------------------------- | :----------------------------------------------------------- |
|  批量撤回消息            | `batchRecallMessages`/`batchRecallMessagesAsync`：一次可撤回发送成功的多条消息，每次最多可撤回 30 条。<br/>详见 [MessageApi 中的 API 介绍](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/MessageApi.html#batchRecallMessages(com.easemob.im.api.model.EMBatchRecallMessages))。|
|  校验黑名单            |  `userBlockCheck`/`userBlockCheckAsync`：批量校验用户是否在黑名单中。 <br/>详见 [BlockApi 中的 API 介绍](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/BlockApi.html#userBlockCheck(com.easemob.im.api.model.EMUserBlockCheck))。|
|  翻译消息内容           | `translateMessage`/`translateMessageAsync`：翻译消息内容 翻译文本消息的内容，只支持文本消息。<br/>详见 [MessageApi 中的 API 介绍](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/MessageApi.html#translateMessage(com.easemob.im.api.model.EMMessageTranslate))。 |
|  获取翻译语言列表            | `getTranslateSupportLanguages`：获取翻译语言列表。<br/>详见 [MessageApi 中的 API 介绍](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/MessageApi.html#getTranslateSupportLanguages())。|
|  检测文本的源语言            | `detectTranslateLanguage`：检测文本的源语言。<br/>详见 [MessageApi 中的 API 介绍](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/MessageApi.html#detectTranslateLanguage(com.easemob.im.api.model.EMDetectTranslateLanguage))。|

### V1.0.18 2026-05-22

| 新增功能                     | 描述                                                    |
| :--------------------------- | :----------------------------------------------------------- |
| 批量移除聊天室成员功能             | 详见 [RoomApi](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/RoomApi.html)。 |

### V1.0.17 2026-04-03

| 新增功能                     | 描述                                                    |
| :--------------------------- | :----------------------------------------------------------- |
| 新增校验好友功能             | - `userContactCheck`：该 API 校验指定用户是否为好友关系<br/> - 详见 [ContactApi.userContactCheck](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/ContactApi.html#userContactCheck(com.easemob.im.api.model.EMUserContactCheck)) |
| 撤回消息增加扩展参数         | - `recallMessageExtensionInfo`：该参数指定撤回消息时传入扩展信息<br/> - 详见 [EMRecallMessage](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/model/EMRecallMessage.html) |
| 修改聊天室增加所有者变更参数 | - `newowner`：该参数为修改聊天室接口新增，用于变更聊天室所有者。<br/> - **文档**：[EMModifyRoom](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/api/model/EMModifyRoom.html) |

### V1.0.16 2025-07-25

1. 增加 "批量获取用户属性" 功能。
2. 增加 "获取群组成员数量" 功能。
3. 增加 "获取聊天室成员数量" 功能。

以上更新内容请到 MetadataApi、GroupApi、RoomApi 中查看。

### v1.0.15 2025-07-01

为帮助你在高并发请求场景下优化性能，`ApiClient` 新增以下两个参数，适用于 Server SDK 使用过程中出现请求延迟较大时的调优需求。

| 新增 API                          | 描述                                                         |
| :-------------------------------- | :----------------------------------------------------------- |
| `setDispatcherMaxRequests`        | 设置整个 `OkHttpClient` 实例允许同时处理的最大请求数（包含正在执行与排队中的请求）。详见 [API 介绍](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/ApiClient.Builder.html#setDispatcherMaxRequests(int))。 |
| `setDispatcherMaxRequestsPerHost` | 设置每个主机（host）允许同时处理的最大请求数。详见 [API 介绍](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/ApiClient.Builder.html#setDispatcherMaxRequestsPerHost(int))。 |

### V1.0.13 2025-04-22

1. 增加 "向 app 在线用户发送广播消息" 功能。
2. 兼容 TLS 1.0/1.1。

以上更新内容请到 MessageApi 中查看。

### V1.0.12 2025-03-04

1. 在 `EMCreateMessage` 中增加 `roamIgnoreUsers` 参数，用于发送消息时设置哪些用户拉漫游消息时拉不到该消息。
2. 增加 "群组成员解除禁言" 功能。

以上更新内容请到 EMCreateMessage、 GroupApi 中查看。

### V1.0.11 2024-11-20

1. 增加 '批量设置群成员自定义属性' 功能。

以上更新内容请到 MetadataApi 中查看。

### V1.0.10 2024-09-21

1. 增加[根据消息 ID 单向删除单聊漫游消息](message_delete_roam_single_msgid.html)功能。
2. 增加[根据消息 ID 单向删除群聊漫游消息](message_delete_roam_group_room_msgid.html)功能。
3. 增加根据指定 ID 创建聊天室的功能。
4. 增加根据指定 ID 创建群组的功能。

以上更新内容请到 MessageApi、RoomApi、GroupApi 中查看。

### V1.0.9 2024-07-29

1. 增加[发送聊天室全局广播消息](broadcast_to_chatrooms.html)功能。
2. 增加[导入好友列表](user_friend_import.html)功能。
3. 增加[强制用户从单设备下线](account_offline_device_single.html)功能。
4. [创建群组增加群组头像属性](group_create.html)。
5. [修改群组信息支持群组头像修改](group_modify.html)。
6. [获取群组详情增加群组头像属性](group_obtain_detail.html)。
7. [获取用户已加入的群组列表](group_obtain_joined)中增加群组头像属性。

以上更新内容请到 MessageApi、ContactApi、UserApi、GroupApi 中查看。

### V1.0.8 2024-07-15

1. 解决依赖冲突的问题。

### V1.0.7 2024-06-28

1. 增加[批量修改用户推送昵称](push_nickname_set_batch.html)功能。

2. 增加发送图片、语音、视频、文件、透传、扩展、自定义消息示例功能。

以上更新内容请到 UserApi、MessageApiTest 中查看。

### V1.0.6 2024-06-07

1. 增加 [批量移除群组成员](group_members_remove_batch.html) 功能。

2. 增加[一次性获取好友列表](user_friend_list_obtain.html)功能。

3. [注册用户](account_register_open.html)增加推送昵称参数。

以上更新内容请到 GroupApi、ContactApi、UserApi 中查看。

### V1.0.5 2024-04-08

处理开发者引用 okhttp、gson 与 sdk 内部引用相同依赖版本不同产生的冲突问题。

### V1.0.4 2024-04-08

修复 "群组和聊天室定向消息" 功能不生效的问题。

以上更新内容请到 MessageApi 中查看。

### V1.0.3 2024-03-28

1. 增加 "单向清空漫游消息" 功能。

2. 增加 "修改文本或自定义消息" 功能。

3. 增加 "群组和聊天室定向消息" 功能。

4. 对 "创建群组" 和 "修改群组信息" 方法中的 membersonly 注释进行修改。

5. "获取单个用户加入的所有群组" 方法返回值增加 total 参数。

以上更新内容请到 MessageApi 、EMCreateMessage、EMCreateGroup、EMModifyGroup、EMGetUserJoinedGroupsResult 中查看。

###  V1.0.2 2024-03-21

1. 增加 Push & Presence & Reaction 管理功能。

2. 降低 OkHttp 版本，避免与开发者引入的版本冲突。

###  V1.0.0 2024-03-08

1. Java Server SDK 2.0 版本发布。

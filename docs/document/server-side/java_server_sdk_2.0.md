# Java Server SDK 2.0

<Toc />

## 功能概述

Server SDK 2.0 是对环信 IM [REST API](overview.html) 的封装，这样做是为了节省服务器端开发者对接环信 API 的时间，只需要配置自己的 App Key 相关信息即可使用。

Server SDK 2.0 提供了用户、消息、群组、聊天室等资源的操作管理能力。

## 前提条件

- Java 1.8
- 有效的环信即时通讯 IM 开发者账号和 App Key、Client ID、ClientSecret、BasePath，登录 [环信管理后台](https://console.easemob.com/user/login) 到“应用列表” → 点击“查看”即可获取到 App Key、Client ID、ClientSecret，到"即时通讯" → 点击"服务概览"获取到 "Rest api" 的服务器域名。

## 实现方法

### 安装

如果你的项目使用 Maven 构建，在 pom.xml 中添加下面代码：

```xml
<dependency>
    <groupId>com.easemob.im</groupId>
    <artifactId>im-sdk-core</artifactId>
    <version>1.0.5</version>
</dependency>
```

如果你的项目使用 Gradle 构建，可以在 build.gradle 中添加下面代码：

```gradle
implementation 'com.easemob.im:im-sdk-core:1.0.5'
```

### 使用

在使用 Java Server SDK 前，需要进行初始化：

#### 1. 使用 Easemob App Credentials 的情况

```java
确保在服务启动之后进行初始化 SDK 即可，示例如下：
try {
    Configuration.setDefaultApiClient(ApiClient.builder()
            .setBasePath("Rest BasePath")
            .setAppKey("Appkey")
            .setClientId("Client ID")
            .setClientSecret("Client Secret")
            .build());
} catch (ApiException e) {
    throw new RuntimeException(e);
}
```

根据业务资源，API 分为：

- ChatFile 用于上传下载附件。
- Block 用于限制访问(将用户加入黑名单)。
- Contact 用于管理联系人(添加好友等)。
- Group 用于管理群组。
- Thread 用于管理群组子区。
- Message 用于发送消息。
- HistoryMessage 用于下载历史消息记录。
- User 用于管理用户。
- Metadata 用于管理用户属性、群成员属性。
- Token 用于获取用户 Token。
- Room 用于管理聊天室。
- Push 用于管理推送设置。
- Presence 用于管理用户在线状态订阅。
- Reaction 用于管理消息表情回复。

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

#### 2.私有化配置，将你自己的私有化 REST 服务器地址设置给 `setBasePath` 即可。

建议写到配置类中，示例如下：

```java
try {
    Configuration.setDefaultApiClient(ApiClient.builder()
            .setBasePath("https://Your privatized address name")
            .setAppKey("Appkey")
            .setClientId("Client ID")
            .setClientSecret("Client Secret")
            .build());
} catch (ApiException e) {
    throw new RuntimeException(e);
}
```

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

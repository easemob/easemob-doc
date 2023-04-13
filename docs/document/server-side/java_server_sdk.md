# Java Server SDK

<Toc />

## 功能概述

Server SDK 是对环信 IM [REST API](overview.html) 的封装，这样做是为了节省服务器端开发者对接环信 API 的时间，只需要配置自己的 App Key 相关信息即可使用。

Server SDK 提供了用户、消息、群组、聊天室等资源的操作管理能力。

## 前提条件

- Java 1.8
- [Reactor](https://projectreactor.io/)(io.projectreactor:reactor-bom:2020.0.4)
- 有效的环信即时通讯 IM 开发者账号和 App Key、Client ID、ClientSecret，登录 [环信管理后台](https://console.easemob.com/user/login) 到“应用列表” → 点击“查看”即可获取到 App Key、Client ID、ClientSecret。

## 实现方法

### 安装

如果你的项目使用 Maven 构建，在 pom.xml 中添加下面代码：

```xml
<dependency>
    <groupId>com.easemob.im</groupId>
    <artifactId>im-sdk-core</artifactId>
    <version>0.6.6</version>
</dependency>
```

如果你的项目使用 Gradle 构建，可以在 build.gradle 中添加下面代码：

```gradle
implementation 'com.easemob.im:im-sdk-core:0.6.6'
```

### 使用

[EMService](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/server/EMService.html) 是所有 API 的入口，可以这样初始化：

#### 1. 使用 Easemob App Credentials 的情况

```java
建议写到配置类中，示例如下：
@Configuration
public class Config {

    @Bean
    public EMService service() {

        EMProperties properties = EMProperties.builder()
                .setAppkey("Appkey")
                .setClientId("Client ID")
                .setClientSecret("ClientSecret")
                .build();

        return new EMService(properties);
    }
}
```

根据业务资源，API 分为：

- [Attachment](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/server/api/attachment/AttachmentApi.html) 用于上传下载附件。
- [Block](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/server/api/block/BlockApi.html) 用于限制访问(将用户加入黑名单、群组/聊天室禁言等)。
- [Contact](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/server/api/contact/ContactApi.html) 用于管理联系人(添加好友等)。
- [Group](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/server/api/group/GroupApi.html) 用于管理群组。
- [Message](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/server/api/message/MessageApi.html) 用于发送消息。
- [User](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/server/api/user/UserApi.html) 用于管理用户。
- [UserMetadata](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/server/api/metadata/MetadataApi.html) 用于管理用户属性。
- [Push](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/server/api/push/PushApi.html) 用于管理用户推送(设置推送免打扰等)。
- [Token](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/server/api/token/TokenApi.html) 用于获取用户 Token。
- [Room](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/server/api/room/RoomApi.html) 用于管理聊天室。

每个业务资源对应一个方法，例如，用户相关的 API，都可以在 `.user()` 找到。

举个例子，我们要注册一个用户，就可以这样写：

```java
@Service
public class UserService {

    @Autowired
    private EMService service;

    private void createUser() {
        try {
            EMUser user = service.user().create("username", "password").block();
        } catch (EMException e) {
            e.getErrorCode();
            e.getMessage();
        }

    }
}
```

API 的返回值是响应式的，如果希望阻塞，可以使用上面例子中的 `.block()`。

:::notice
如果你的项目不是响应式的编程，那么请在调用的 Server SDK API 的结尾添加 `.block()`
对使用的 API 添加 try/catch ，如果使用的 API 没有抛出异常，代表请求成功，反之则请求失败，通过异常 `EMException` 对象的 `getErrorCode()/getMessage()` 拿到错误码以及错误描述。
:::

#### 2.私有化配置，将你自己的私有化 REST 服务器地址设置给 `setBaseUri` 即可。

建议写到配置类中，示例如下：

```java
@Configuration
public class Config {

    @Bean
    public EMService service() {

        EMProperties properties = EMProperties.builder()
                 .setBaseUri("https://Your privatized address name")
                .setAppkey("Appkey")
                .setClientId("Client ID")
                .setClientSecret("ClientSecret")
                .build();

        return new EMService(properties);
    }
}
```

## 参考

- [Server SDK 的 API 文档](https://easemob.github.io/easemob-im-server-sdk/) 。
- [Server SDK 开源地址](https://github.com/easemob/easemob-im-server-sdk)。

## 常见问题

### 集成问题

如果你想看 Server SDK 的请求与响应，可以在配置文件中添加:

```properties
logging.level.com.easemob.im.http=debug
```

如果在 Mac 系统上使用 Server SDK 出现 Dns 的警告，可以在配置文件中添加:

```properties
logging.level.com.easemob.im.shaded.io.netty=error
```

## 注意事项

1. Server SDK 是对环信 IM [REST API](overview.htmml) 的封装，但并没有封装所有的 API，只封装了开发者常用的 API，点击 [这里](#使用) 查看 Server SDK API。

对于注册环信 ID 的规则，Server SDK 有自己的限制，正则为 `^[a-z][0-9a-z-]{1,32}$`，这点与 [官网 REST API 文档](account_system.html#开放注册单个用户) 中说明的环信 ID 规则是有区别的，例如用户 ID 长度限制为 32 字节以内，这样做是因为目前环信 ID 注册的限制范围比较广，Server SDK 考虑缩小环信 ID 注册的限制范围使其更加规范。

如果不想使用 Server SDK 注册环信 ID 的限制，可以在初始化配置时添加 ‘turnOffUserNameValidation()’ （SDK 需要使用 0.3.5 以上的版本）

```java
// 强烈建议不要使用纯数字或者有规律的字符串来注册环信 ID，否则用户可能容易遭受到攻击、接收到垃圾消息。
EMProperties properties = EMProperties.builder()
        .setAppkey("appkey")
        .setClientId("Client ID")
        .setClientSecret("ClientSecret")
        .turnOffUserNameValidation()
        .build();
```

1. 使用代理的情况

前提需要你的代理支持 `CONNECT` 方法，确保你的代理配置文件中有 connectport 80 存在。

如果你使用的代代理不需要认证，那么需要传入自己的 IP、端口。

```java
EMProxy proxy = EMProxy.builder()
                .setIP("ip")
                .setPort(80)
                .build();

EMProperties properties = EMProperties.builder()
        .setProxy(proxy)
        .setAppkey("appkey")
        .setClientId("Client ID")
        .setClientSecret("ClientSecret")
        .build();
```

如果你使用的代理需要认证，那么需要传入自己的 IP、端口、账号以及密码。

```java
EMProxy proxy = EMProxy.builder()
                .setIP("ip")
                .setPort(80)
                .setUsername("username")
                .setPassword("password")
                .build();

EMProperties properties = EMProperties.builder()
        .setProxy(proxy)
        .setAppkey("appkey")
        .setClientId("Client ID")
        .setClientSecret("ClientSecret")
        .build();
```

## 更新日志

### V0.6.6 2022-12-02

修复创建/获取/删除用户方法使用大写字母出现异常的问题。

### V0.6.3

- 新增 离线推送设置 功能。
- 新增 分页获取用户已加入的群组列表 功能。
- 新增 批量获取用户属性 功能。
- 新增 指定群组 ID 建群 功能，需要联系商务开通。
- 修复了一些 Bug。

以上更新内容请到 PushApi/GroupApi/MetadataApi 中查看。

### V0.6.0

- 新增 聊天室全员禁言/解禁 功能。
- 新增 获取聊天室详情返回当前成员人数。
- 新增 获取聊天室详情返回成员列表。
- 新增 发送消息不返回消息 ID 的方法。
- 新增 发送消息可携带 `sync_device` 字段。

- 修复添加群组管理员参数错误无法捕捉异常的问题。

以上更新内容请到 `RoomApi/MessageApi` 中查看。

### V0.5.5

- 新增 消息撤回 功能。
- 新增 删除单向会话 功能。
- 建群时增加群组名称是否需要审核参数。
- 获取群成员功能增加是否排序的参数。
- 获取群组详情返回群组名称、描述等数据。
- 修复调用群组批量移除成员方法移除单个成员时，抛出异常的问题。

以上更新内容请到 `GroupApi`/`MessageApi` 中查看。

### V0.5.4

- 新增 设置用户全局禁言/查询单个用户全局禁言剩余时间/查询所有用户全局禁言剩余时间 功能。

以上更新内容请到 `MuteApi` 中查看。

### V0.5.3

- 创建群组方法增加 `needInviteConfirm`(邀请用户加群，受邀用户是否需要确认) 参数。
- 创建聊天室方法增加 `custom` 参数。
- 新增聊天室转让方法。

以上更新内容请到 `GroupApi`/`RoomApi` 中查看。

### V0.5.2

- 修改群组信息方法增加 `custom` 参数。
- 新增群组转让方法。

以上更新内容请到 `GroupApi` 中查看。

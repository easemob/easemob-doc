# Java Server SDK

[[toc]]

## 功能概述

Server SDK 是对环信 IM [服务端 API](http://docs-im.easemob.com/im/server/ready/intro) 的封装，这样做是为了节省服务器端开发者对接环信 API 的时间，只需要配置自己的 App Key 相关信息即可使用。

Server SDK 提供了用户、消息、群组、聊天室等资源的操作管理能力。

## 前提条件

- Java 1.8
- [Reactor](https://projectreactor.io/)(io.projectreactor:reactor-bom:2020.0.4)
- 有效的环信即时通讯 IM 开发者账号和 App Key、Client ID、ClientSecre，登陆 [环信管理后台](https://console.easemob.com/user/login) 到“应用列表” → 点击“查看”即可获取到 App Key、Client ID、ClientSecret。

## 实现方法

### 安装

如果你的项目使用 Maven 构建，在 pom.xml 中添加下面代码：

```
<dependency>
    <groupId>com.easemob.im</groupId>
    <artifactId>im-sdk-core</artifactId>
    <version>0.5.2</version>
</dependency>
```

如果你的项目使用 Gradle 构建，可以在 build.grade 中添加下面代码：

```
implementation 'com.easemob.im:im-sdk-core:0.5.2'
```

### 使用

[EMService](https://easemob.github.io/easemob-im-server-sdk/com/easemob/im/server/EMService.html) 是所有 API 的入口，可以这样初始化：

#### 1. 使用 Easemob App Credentials 的情况

```
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

每个业务资源对应一个方法，例如，用户相关的 API，都可以在 .user() 找到。

举个例子，我们要注册一个用户，就可以这样写：

```
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

API的返回值是响应式的，如果希望阻塞，可以使用上面例子中的 `.block()`。

**注意：**

如果你的项目不是响应式的编程，那么请在调用的 Server SDK API 的结尾添加 `.block()`
对使用的 API 添加 try/catch ，如果使用的 API 没有抛出异常，代表请求成功，反之则请求失败，通过异常 `EMException` 对象的 `getErrorCode()/getMessage()` 拿到错误码以及错误描述。

### 参考

1. [Server SDK 的 API 文档](https://easemob.github.io/easemob-im-server-sdk/) 。

2. [Server SDK 开源地址](https://github.com/easemob/easemob-im-server-sdk)。

------

### 常见问题

#### 集成问题

如果你想看 Server SDK 的请求与响应，可以在配置文件中添加:

```
logging.level.com.easemob.im.http=debug
```

### 注意事项

1.Server SDK 是对环信 IM [服务端 API](http://docs-im.easemob.com/im/server/ready/intro) 的封装，但并没有封装所有的 API，只封装了开发者常用的 API，点击 [这里](http://docs-im.easemob.com/im/server/ready/sdk#使用) 查看 Server SDK API。

对于注册环信 ID 的规则，Server SDK 有自己的限制, 正则为 `^[a-z][0-9a-z-]{1,32}$`，这点与 [官网文档](http://docs-im.easemob.com/im/server/ready/user#环信_id_使用规则) 中说明的环信 ID 规则是有区别的，这样做是因为目前环信 ID 注册的限制范围比较广，Server SDK 考虑缩小环信 ID 注册的限制范围使其更加规范，在此说明一下。

如果不想使用 Server SDK 注册环信 ID 的限制，可以在初始化配置时添加 'turnOffUserNameValidation()' （SDK 需要使用 0.3.5 以上的版本）

```
强烈建议不要使用纯数字或者有规律的字符串来注册环信 ID，否则自己的用户可能会遭受到攻击、垃圾消息等后果。
EMProperties properties = EMProperties.builder()
        .setAppkey("appkey")
        .setClientId("Client ID")
        .setClientSecret("ClientSecret")
        .turnOffUserNameValidation()
        .build();
```

2.使用代理的情况

前提需要你的代理支持 CONNECT 方法，确保你的代理配置文件中有 connectport 80 存在。

如果你使用的代代理不需要认证，那么需要传入自己的 IP、端口。

```
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

```
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

### 更新日志

#### V0.5.2

- 修改群组信息方法增加 custom 参数。
- 新增群组转让方法。

以上更新内容请到 GroupApi 中查看。
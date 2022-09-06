# PHP Server SDK

[[toc]]

### 介绍
PHP SDK 是对环信 IM [服务端 API](https://docs-im.easemob.com/im/server/ready/intro) 的封装，这样做是为了节省服务器端开发者对接环信 API 的时间，只需要配置自己的 appkey 相关信息即可使用。

### 功能
PHP SDK 提供了用户、消息、群组、聊天室等资源的操作管理能力。

### 依赖
- PHP 5.3+

### 安装
直接使用 [composer](https://www.phpcomposer.com/) 进行安装

```
composer require maniac/easemob-php
```

### 目录结构
- examples 示例文件目录
- runtime 临时文件、缓存文件目录
- src 核心文件目录
- tests 测试文件目录

### 准备
在使用 PHP SDK 之前，需要准备环信 appkey、Client ID、ClientSecret。

如果你有环信管理后台账号并创建过应用，请先登录环信管理后台，点击 [这里](https://console.easemob.com/user/login)，然后到“应用列表” → 点击“查看”即可获取到 appkey、Client ID、ClientSecret。

如果你没有环信管理后台账号，请先注册账号，点击 [这里](https://console.easemob.com/user/register)，注册成功后请登录，然后点击“添加应用”，添加成功后点击“查看”即可获取到 appkey、Client ID、ClientSecret。

### 使用
如果使用 Laravel、YII、ThinkPHP 之类的框架，composer 安装的库会自动加载，如果没有使用框架，需要手动引入 `vendor/autoload.php` 文件。

使用所有的类之前，都要先初始化授权对象，然后再初始化其他类时，传入授权对象
```php
require 'vendor/autoload.php';

use Easemob\Auth;
use Easemob\User;

$auth = new Auth("appKey", "Client ID", "ClientSecret");
$user = new User($auth);
```

根据业务资源，API 分为：

- Attachment 用于上传下载附件
- Block 用于限制访问(将用户加入黑名单、群组/聊天室禁言等)
- Contact 用于管理联系人(添加好友等)
- Group 用于管理群组
- Message 用于发送消息
- User 用于管理用户
- UserMetadata 用于管理用户属性
- Push 用于管理用户推送(设置推送免打扰等)
- Room 用于管理聊天室
- WhiteList 用于管理白名单

每个业务资源对应一个方法，例如，用户相关的 API，都可以在 User 类中找到。

举个例子，我们要注册一个用户，就可以这样写：

```php
require 'vendor/autoload.php';

use Easemob\Auth;
use Easemob\User;

$auth = new Auth("appKey", "Client ID", "ClientSecret");
$user = new User($auth);

// 注册单个用户
$data = array(
    'username' => 'user1',
    'password' => 'user1',
    'nickname' => 'user1',
);
$user->create($data);

 
// 批量注册用户
$data = array(
    array(
        'username' => 'user2',
        'password' => 'user2',
        'nickname' => 'user2',
    ),
    array(
        'username' => 'user3',
        'password' => 'user3',
        'nickname' => 'user3',
    ),
);
$user->create($data);
```

### 参考
- PHP SDK 的 api 文档在 [这里](https://easemob.github.io/im-php-server-sdk/annotated.html)
- PHP SDK 开源地址在 [这里](https://github.com/easemob/im-php-server-sdk)

### 常见问题

1.关于 PHP 低版本中文乱码问题

在纯 PHP 页面中使用

```php
header("Content-Type:text/html;charset=utf-8");
```

在 HTML 和 PHP 混编的页面中使用

```html
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
```

2.关于 SDK 返回的错误码和错误描述

PHP SDK 会直接返回 REST API 的错误码及错误描述，具体请参考 [服务器端 REST API 常见错误码](https://docs-im.easemob.com/im/other/errorcode/restapi)

3.使用代理的情况

在初始化授权对象 Auth 之后，可以设置代理：

```php
require 'vendor/autoload.php';

use Easemob\Auth;
use Easemob\Http\Http

$easemob = $config['easemob'];
$auth = new Auth("appKey", "Client ID", "ClientSecret");
// 设置代理
Http::setProxy("ip地址", 8080);
```

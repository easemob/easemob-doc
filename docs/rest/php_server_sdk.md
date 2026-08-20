# PHP Server SDK

<Toc />

## Introduction

The PHP SDK is a wrapper for the EasyIM [REST API](overview.html). It saves server-side developers time when integrating with the EasyIM API. To use it, you only need to configure your App Key information.

## Features

The PHP SDK provides APIs for managing resources such as users, messages, chat groups, and chat rooms.

## Dependencies

- PHP 5.3+

## Installation

Refer directly to version `1.1.0` in the PHP Server SDK repository:

```shell
https://github.com/easemob/im-php-server-sdk/tree/1.1.0
```

## Directory structure

- examples: Example files
- runtime: Temporary and cache files
- src: Core files
- tests: Test files

## Prerequisites

Before using the PHP SDK, obtain an EasyIM App Key, REST API server domain name, Client ID, and Client Secret.

If you have an Easemob Console account and have created an app, click [here](https://console.easemob.com/user/login) to log in to the Easemob Console. In **App List**, click **Manage** to obtain the appkey, Client ID, and ClientSecret. In the left navigation pane, select **EasyIM** > **Service Overview**. On the **Service Overview** page, find the REST API server domain name in the **Domain Configuration** section.

If you do not have an Easemob Console account, click [here](https://console.easemob.com/user/register) to register. After registration, log in and click **Add App**. After creating the app, click **Manage** to obtain the appkey, Client ID, and ClientSecret. In the left navigation pane, select **EasyIM** > **Service Overview**. On the **Service Overview** page, find the REST API server domain name in the **Domain Configuration** section.

## Usage

If you use a framework such as Laravel, YII, or ThinkPHP, libraries installed by Composer are loaded automatically. If you do not use a framework, you must manually include the `vendor/autoload.php` file.

Before using any class, initialize the authorization object and pass it when initializing other classes.

```php
require 'vendor/autoload.php';

use Easemob\Auth;
use Easemob\User;

$auth = new Auth("appKey", "Client ID", "ClientSecret");
$auth->setApiUri("rest api domain");

$user = new User($auth);
```

The APIs are organized by resource as follows:

- Attachment: Uploads and downloads attachments.
- Block: Restricts access, such as adding users to the blocklist or muting chat group or chat room members.
- Contact: Manages contacts, such as adding contacts.
- Group: Manages chat groups.
- Message: Sends messages.
- User: Manages users.
- UserMetadata: Manages user attributes.
- Push: Manages user push settings, such as setting Do Not Disturb.
- Room: Manages chat rooms.
- WhiteList: Manages the allowlist.

Each resource corresponds to a class. For example, all user-related APIs are available in the User class.

For example, the following code registers users:

```php
require 'vendor/autoload.php';

use Easemob\Auth;
use Easemob\User;

$auth = new Auth("appKey", "Client ID", "ClientSecret");
$auth->setApiUri("rest api domain");

$user = new User($auth);

// Register a single user
$data = array(
    'username' => 'user1',
    'password' => 'user1',
    'nickname' => 'user1',
);
$user->create($data);


// Register users in a batch
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

## References

- See the PHP SDK API documentation [here](https://easemob.github.io/im-php-server-sdk/annotated.html).
- See the PHP SDK source code [here](https://github.com/easemob/im-php-server-sdk/tree/1.1.0).

## FAQs

1. Garbled Chinese characters in earlier PHP versions

For a PHP-only page, use:

```php
header("Content-Type:text/html;charset=utf-8");
```

For a page that combines HTML and PHP, use:

```html
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
```

2. Error codes and descriptions returned by the SDK

The PHP SDK directly returns the REST API error code and description. For details, see [Common Server-Side REST API Error Codes](error.html).

3. Using a proxy

After initializing the Auth authorization object, you can configure a proxy:

```php
require 'vendor/autoload.php';

use Easemob\Auth;
use Easemob\Http\Http

$easemob = $config['easemob'];
$auth = new Auth("appKey", "Client ID", "ClientSecret");
// Configure a proxy
Http::setProxy("ip地址", 8080);
```

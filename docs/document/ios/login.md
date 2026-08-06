# 登录

初始化 iOS SDK V5 后，应用需要使用用户 ID 和用户 Token 登录。登录成功并连接到 IM 服务器后，才能调用需要访问服务器的即时通讯功能。

## 用户注册

登录 SDK 前，你需要先创建环信 IM 用户。创建用户前，需先在 [环信控制台](https://console.easemob.com/user/login) 的 **即时通讯 > 基础功能** > **用户** 页面设置用户注册模式。

用户注册模式分为以下两种：

 - **授权注册**：通过环信提供的 REST API 注册用户。该方式适用于正式生产环境，注册成功后，你可以将用户账号保存到你的应用服务器或返回给客户端。
 - **开放注册**：允许客户端或 REST API 直接注册用户。该方式一般用于体验 Demo 和测试环境，正式环境不推荐使用。

设置注册模式后，你可以通过以下方式创建用户：

1. **调用 REST API 创建用户**

   - 授权注册：调用 [授权注册单个用户](/document/server-side/account_register_authorized_single.html) 或 [批量授权注册用户](/document/server-side/account_register_authorized_batch.html) 接口创建用户。
   - 开放注册：开启开放注册后，可通过客户端或 [REST API 开放注册用户](/document/server-side/account_register_open.html) 创建用户。

2. **通过环信控制台创建用户**

   你可以在 [环信控制台](https://console.easemob.com/user/login) 创建正式环境或测试环境下的用户，详见 [创建用户](/product/console/operation_user.html#创建用户)。

:::tip
iOS SDK V5 不再提供客户端注册用户、通过用户名和密码获取 Token 或密码登录的公开 API。生产环境应由应用服务器完成用户认证并获取 IM Token，客户端仅使用用户 ID 和 Token 登录 SDK。
:::

## 登录

SDK 通过用户 ID 和 IM Token 登录。调用 `loginWithUsername` 时，需传入用户 ID 和 Token。登录成功后，SDK 会建立到消息服务的长连接。

测试环境下，你在 [环信控制台](https://console.easemob.com/user/login) 创建用户后，环信服务器会自动为这些用户分配用户 Token，详见 [创建用户](/product/console/operation_user.html#创建用户)。

生产环境中，建议在你的应用服务器集成 [获取 App Token API](/document/server-side/easemob_app_token.html) 和 [获取用户 Token API](/document/server-side/easemob_user_token.html)，由客户端从你的应用服务器获取用户 Token 后再登录 SDK。

```objectivec
[[EMClient sharedClient] loginWithUsername:userId
                                     token:token
                                completion:^(NSString *username, EMError *error) {
    if (!error) {
        // 登录成功。
    } else {
        // 登录失败，根据 error.code 和 error.errorDescription 处理。
    }
}];
```

:::tip
应用可以通过 `isLoggedIn` 和 `isConnected` 分别判断登录状态和服务器连接状态，但不能依赖 SDK 自动发起登录。每次应用启动或需要 IM 会话时，应由业务层保存凭证并显式调用 `loginWithUsername`。
:::

## 登录完成前使用本地数据库

iOS SDK V5 支持在在线登录完成前打开当前用户的本地数据库。应用初始化 SDK 并注册 `EMClientDelegate` 后，调用 `loginWithUsername`。SDK 在登录流程中打开本地数据库，完成后触发 `onDatabaseOpened`。

收到该回调后，即使在线登录尚未完成，应用也可以使用已打开的本地数据库中的缓存数据提前渲染页面；调用需要访问服务器的接口时，仍需等待登录 completion 成功并通过 `connectionStateDidChange` 确认已连接。数据库打开不表示会话、好友或群组数据已经同步完成；若配置了 `EMOptions#dataSyncType`，应在 `syncDataFinished` 成功后刷新相应本地数据。

在发起登录前注册 `EMClientDelegate`，并在回调中处理数据库和连接状态：

```objectivec
@interface LoginViewController () <EMClientDelegate>
@end

@implementation LoginViewController

- (void)startLoginWithUserId:(NSString *)userId token:(NSString *)token {
    [[EMClient sharedClient] addDelegate:self delegateQueue:nil];

    [[EMClient sharedClient] loginWithUsername:userId
                                         token:token
                                    completion:^(NSString *username, EMError *error) {
        if (!error) {
            // 在线登录成功；连接状态以 connectionStateDidChange: 回调为准。
        } else {
            // 登录失败。
        }
    }];
}

- (void)onDatabaseOpened:(EMError *)error username:(NSString *)username {
    if (!error) {
        // username 对应的本地数据库已打开。
        // 此处可使用本地缓存数据刷新兜底 UI。
    }
}

- (void)connectionStateDidChange:(EMConnectionState)aConnectionState {
    if (aConnectionState == EMConnectionConnected) {
        // 已连接到 IM 服务器，可以调用需要联网的接口。
    } else {
        // 与 IM 服务器断开连接。
    }
}

- (void)syncDataFinished:(EMError *)error type:(EMDataSyncType)type {
    if (!error && (type & EMDataSyncTypeConversations) == EMDataSyncTypeConversations) {
        // 会话数据同步完成后，刷新本地会话列表。
    }
}

@end
```

不再需要监听时，应移除监听器：

```objectivec
[[EMClient sharedClient] removeDelegate:self];
```

:::tip
`onDatabaseOpened` 只表示指定用户的本地数据库已经打开，不表示在线登录成功，也不能替代 `connectionStateDidChange`。数据库打开后可以使用本地数据；调用需要访问服务器的接口前，仍需等待登录成功和连接建立。数据同步完成后，仍需在 `syncDataFinished` 中按同步类型刷新本地数据。
:::

## Token 续期

使用 Token 登录后，SDK 会通过 `tokenWillExpire` 和 `tokenDidExpire` 通知 Token 状态：

 - `tokenWillExpire`：Token 即将过期时触发。应用应从业务服务器获取新 Token，并调用 `renewToken` 更新。
 - `tokenDidExpire`：Token 已过期时触发。应用应获取新 Token；若当前登录状态已经失效，应重新调用 `loginWithUsername` 登录。

收到 `tokenWillExpire` 回调后，应用应从自己的业务服务器异步获取新的 IM Token，并调用 `renewToken` 更新。completion 中 `error` 为 `nil` 表示更新成功；非 `nil` 表示更新失败，可根据错误码和错误信息处理。

```objectivec
- (void)tokenWillExpire:(EMErrorCode)aErrorCode {
    // requestNewTokenFromAppServerWithCompletion: 仅表示从应用服务器异步获取 Token，非 SDK API。
    [self requestNewTokenFromAppServerWithCompletion:^(NSString *newToken) {
        [[EMClient sharedClient] renewToken:newToken completion:^(EMError *error) {
            if (!error) {
                // Token 更新成功。
            } else {
                // Token 更新失败。
            }
        }];
    }];
}

- (void)tokenDidExpire:(EMErrorCode)aErrorCode {
    // Token 已过期。获取新 Token 后，必要时重新调用异步登录接口。
}
```

## 获取当前登录的用户

调用 `currentUsername` 获取当前登录用户的用户 ID：

```objectivec
NSString *currentUser = [EMClient sharedClient].currentUsername;
```

## 获取登录状态

调用 `isLoggedIn` 判断当前用户是否已登录，调用 `isConnected` 判断 SDK 是否已连接到 IM 服务器。登录状态与连接状态含义不同，例如网络断开时，用户可能仍处于登录状态，但当前未连接到服务器。

```objectivec
BOOL loggedIn = [EMClient sharedClient].isLoggedIn;
BOOL connected = [EMClient sharedClient].isConnected;
```

## 退出登录

调用 `logout` 退出当前账号。`aIsUnbindDeviceToken` 表示退出时是否解绑设备推送 Token：

 - `YES`：解绑设备推送 Token。
 - `NO`：不解绑设备推送 Token。

通过 completion 获取异步退出结果：

```objectivec
[[EMClient sharedClient] logout:YES completion:^(EMError *error) {
    if (!error) {
        // 退出成功。
    } else {
        // 退出失败。
    }
}];
```

:::tip
1. 如果应用集成了 APNs 或 PushKit 等推送，退出登录时建议将 `logout` 的 `aIsUnbindDeviceToken` 参数设置为 `YES`，使 SDK 同时解绑当前设备的推送 Token。否则，退出登录后仍可能收到当前账号的离线推送通知。

如果因网络异常导致推送 Token 解绑失败，completion 会返回错误。应用可以提示用户解绑失败及继续退出后可能仍收到推送的风险。若用户确认继续退出，可以将参数设置为 `NO` 后再次调用 `logout`，仅退出 IM 账号而不解绑推送 Token。网络恢复后，应在适当时机处理遗留的推送 Token 解绑问题，不建议通过后台线程无限重试。

2. 调用异步退出方法 `logout` 时，应等待 completion 返回 `nil` 错误后，再登录其他账号或执行依赖退出完成的操作。若返回错误，表示退出或推送 Token 解绑失败，应用应根据错误码和业务场景处理。
:::

## 账号切换

从当前账号切换到其他账号时，应先调用 `logout`，待退出成功后，再使用新账号的用户 ID 和 Token 调用 `loginWithUsername`。不要在当前账号尚未退出时直接发起其他账号的登录。

```objectivec
[[EMClient sharedClient] logout:NO completion:^(EMError *error) {
    if (!error) {
        [[EMClient sharedClient] loginWithUsername:nextUserId
                                             token:nextToken
                                        completion:^(NSString *username, EMError *loginError) {
            // 根据 loginError 处理切换结果。
        }];
    }
}];
```

## 多设备登录

iOS SDK 支持同一账号在多个设备上登录。多设备登录的设备数量、互踢策略和数据同步规则由服务端配置决定。若登录设备数量超过限制，新登录设备可能会将已登录设备踢下线。详见 [多设备登录](multi_device.html)。

**配置登录设备信息**

iOS SDK 可以通过以下 `EMOptions` 属性配置当前登录设备的信息。这些属性应在 SDK 初始化前设置：

| API | 参数类型 | 说明 |
| :--- | :--- | :--- |
| `customOSType` | `NSInteger` | 设置登录设备的自定义系统类型。 |
| `customDeviceName` | `NSString *` | 设置当前设备的自定义名称，用于在多设备登录场景中区分设备。 |
| `loginExtensionInfo` | `NSString *` | 设置登录时携带的扩展信息，支持 JSON 字符串，当前长度上限为 1024 个字符。 |

示例代码如下：

```objectivec
EMOptions *options = [EMOptions optionsWithAppkey:@"your-org#your-app"];

// 以下属性应在 SDK 初始化前设置。
options.customOSType = 10;
options.customDeviceName = @"ios-custom-device";
options.loginExtensionInfo = @"login from iOS";

// 使用 options 初始化 SDK 后，再通过异步 Token 登录接口登录。
[[EMClient sharedClient] loginWithUsername:userId
                                     token:token
                                completion:^(NSString *username, EMError *error) {
    // 根据 error 处理登录结果。
}];
```

**设备互踢**

当其他设备使用同一账号登录时，SDK 会触发 `userAccountDidLoginFromOtherDeviceWithInfo`。应用可以通过 `deviceName` 和 `extensionInfo` 获取新登录设备的名称和扩展信息。

当当前账号被服务端强制退出时，SDK 会触发 `userAccountDidForcedToLogout`。应用应根据 `code` 判断退出原因，并按业务需要提示用户或引导用户重新登录。

```objectivec
- (void)userAccountDidLoginFromOtherDeviceWithInfo:(EMLoginExtensionInfo *)info {
    NSString *deviceName = info.deviceName;
    NSString *extensionInfo = info.extensionInfo;
    // 当前账号已在其他设备登录；根据业务策略处理当前设备状态。
}

- (void)userAccountDidForcedToLogout:(EMError *)error {
    // 当前账号被强制退出。根据 error.code 处理设备数量超限、账号禁用或强制下线等情形。
}
```

常见多设备相关错误码如下：

| 场景 | iOS SDK 错误码 | 说明 |
| :--- | :--- | :--- |
| 用户在其他设备登录并将当前设备踢下线 | `206` / `EMErrorUserLoginOnAnotherDevice` | 可通过 `userAccountDidLoginFromOtherDeviceWithInfo` 提示用户账号已在其他设备登录，并读取新设备名称和扩展信息。 |
| 当前账号绑定了其他设备 | `213` / `EMErrorUserBindAnotherDevice` | 应根据设备绑定策略引导用户处理。 |
| 登录设备数量超过限制 | `214` / `EMErrorUserLoginTooManyDevices` | 应先处理设备数量限制，不建议直接反复登录。 |
| 用户因修改密码被踢下线 | `216` / `EMErrorUserKickedByChangePassword` | 应重新获取有效 Token 后登录。 |
| 用户在其他设备、控制台或通过服务端接口被强制退出 | `217` / `EMErrorUserKickedByOtherDevice` | 可以提示用户当前账号已被强制退出。 |
| 登录设备发生变化 | `220` / `EMErrorUserDeviceChanged` | 应根据业务场景提示用户并重新登录。 |

**获取其他设备的登录信息**

调用 `getLoggedInDevicesFromServerWithUserId` 可以从服务器获取指定用户当前已登录的设备信息。该接口为异步接口；调用前应确保拥有有效的用户 ID 和 Token。

```objectivec
[[EMClient sharedClient] getLoggedInDevicesFromServerWithUserId:userId
                                                          token:token
                                                     completion:^(NSArray<EMDeviceConfig *> *devices, EMError *error) {
    if (!error) {
        for (EMDeviceConfig *device in devices) {
            NSString *resource = device.resource;
            NSString *deviceUUID = device.deviceUUID;
            NSString *deviceName = device.deviceName;
            // 使用 resource、deviceUUID 和 deviceName 展示或管理该登录设备。
        }
    } else {
        // 获取失败。
    }
}];
```

该接口的 completion 返回 `NSArray<EMDeviceConfig *> *`。数组中的每个 `EMDeviceConfig` 对应一个已登录设备，设备信息如下：

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| `resource` | `NSString *` | 登录设备的资源标识。 |
| `deviceUUID` | `NSString *` | 登录设备的 UUID。 |
| `deviceName` | `NSString *` | 登录设备的名称。 |

例如，若该接口返回的 `resource` 为 `ios_xxx`，则该值表示对应 iOS 登录设备的资源标识。应用应将该字段与 `deviceUUID`、`deviceName` 结合展示或管理，不应依赖资源标识的固定字符串格式。

## 更多

### 登录被封禁账号的提示

若 IM 应用服务已被禁用，调用 `loginWithUsername` 登录时，completion 会返回错误码 `EMErrorServerServingForbidden`（305）。应用应根据该错误码提示应用服务已被禁用或进行相应处理，不建议依赖 `"service is disabled"` 等错误文本进行判断。

若当前已登录用户账号被服务端禁用，SDK 会触发 `userDidForbidByServer`，应用应在该回调中提示用户并停止使用需要登录状态的 IM 功能。

## 接口列表

| API 名称 | 所属模块/类型 | 说明 |
| :--- | :--- | :--- |
| [`loginWithUsername`](#登录) | `EMClient` | 使用用户 ID 和 Token 异步登录。 |
| [`renewToken`](#token-续期) | `EMClient` | 异步更新当前登录使用的 Token。 |
| [`currentUsername`](#获取当前登录的用户) | `EMClient` | 获取当前登录用户的用户 ID。 |
| [`isLoggedIn`](#获取登录状态) | `EMClient` | 判断当前用户是否已登录。 |
| [`isConnected`](#获取登录状态) | `EMClient` | 判断 SDK 是否已连接到 IM 服务器。 |
| [`logout`](#退出登录) | `EMClient` | 异步退出当前账号，并按参数决定是否解绑设备推送 Token。 |
| [`customOSType`](#多设备登录) | `EMOptions` | 设置登录设备的自定义系统类型。 |
| [`customDeviceName`](#多设备登录) | `EMOptions` | 设置当前设备的自定义名称。 |
| [`loginExtensionInfo`](#多设备登录) | `EMOptions` | 设置登录时携带的扩展信息。 |
| [`getLoggedInDevicesFromServerWithUserId`](#多设备登录) | `EMClient` | 异步获取指定用户已登录的设备信息。 |
| [`resource`](#多设备登录) / [`deviceName`](#多设备登录) | `EMDeviceConfig` | 获取登录设备的资源标识和设备名称。 |

# 多设备登录

## 功能说明

即时通讯 IM 支持同一账号在多个设备上登录。使用该功能前，需要在 [环信控制台](https://console.easemob.com/user/login) 开通多端多设备服务。详见 [环信控制台文档](/product/console/basic_user.html#多端多设备)。

iOS SDK 在登录时会将设备相关信息同步到服务器。服务器根据多端多设备策略维护当前账号的在线设备状态。当同一账号在其他设备上执行好友、群组、消息话题、会话或单向删除服务端历史消息等操作时，当前设备可通过 `addMultiDevicesDelegate` 注册的 `EMMultiDevicesDelegate` 接收相应事件。

多端多设备登录场景下，iOS SDK 支持以下功能：

 - 接收当前账号其他设备触发的多设备事件。
 - 同步好友、群组、消息话题、会话以及单向删除服务端历史消息等操作。
 - 获取当前用户的其他已登录设备的登录 ID 列表。
 - 获取指定账号的在线登录设备列表。
 - 设置登录设备的名称、平台和扩展信息。
 - 将指定账号从单个或所有设备踢下线。

多端登录时，即时通讯 IM 每端默认最多支持 4 个设备同时在线。如需增加支持的设备数量，可以联系环信即时通讯 IM 的商务经理。你可以在环信控制台的 **即时通讯 > 基础功能** > **用户** 页面设置各端设备的数量：

![img](/images/common/multidevice_device_count.png)

## 互踢策略

单端和多端登录场景下的互踢策略如下表所示：

| 单端/多端登录 | 互踢策略 |
| :---: | :--- |
| **单端登录** | 新登录的设备会将当前在线设备踢下线。 |
| **多端登录** | 若一端的登录设备数量达到上限，最新登录的设备会将该端最早登录的设备踢下线。<br><br>即时通讯 IM 仅支持同端互踢，不支持各端之间互踢。 |

## 前提条件

开始前，请确保满足以下条件：

 - 完成 iOS SDK 初始化并登录，详见 [快速开始](quickstart.html)。
 - 已在 [环信控制台](https://console.easemob.com/user/login) 开通多端多设备功能。详见 [环信控制台文档](/product/console/basic_user.html#多端多设备)。

## 获取当前用户的其他登录设备的登录 ID 列表

调用 `getSelfIdsOnOtherPlatformWithCompletion` 异步获取当前账号在其他平台（Windows 或 Web）上的登录 ID 列表，然后选择目标登录 ID 作为消息接收方向指定设备发送消息。该登录 ID 可以作为单聊消息的接收方使用，使用方式与好友用户 ID 类似。

该接口适用于多设备登录场景，用于查询当前账号在其他设备上的登录状态。返回结果中会自动排除当前设备，通常可用于展示已登录设备列表、识别异常登录、进行多端登录提醒，或配合服务端接口对指定设备执行下线等管理操作。

```objectivec
[[EMClient sharedClient].contactManager getSelfIdsOnOtherPlatformWithCompletion:^(NSArray<NSString *> *loginIds, EMError *error) {
    if (!error) {
        NSString *loginId = loginIds.firstObject;
        // loginId 可作为单聊消息的接收方。
    } else {
        // 获取失败。
    }
}];
```

每项登录 ID 均采用 `userId/resource` 格式：

- `userId`：当前用户的用户 ID。
- `resource`：已登录设备对应的资源标识，用于区分该用户的具体登录设备。

其中，`resource` 与服务端 [单设备下线接口](/document/server-side/account_offline_device_single.html)中的 `resourceId` 参数，以及服务端[获取指定账号在线设备列表](/document/server-side/account_online_device_obtain.html)返回的 `res` 字段，在语义上是一致的，均用于标识用户的某个登录设备。

iOS 客户端接口返回完整的 `userId/resource` 登录 ID；服务端相关接口通常只需要 `/` 后面的 `resource`。因此，若业务需要调用服务端单设备下线接口，应先从登录 ID 中提取 `resource`，再将其作为 `resourceId` 传入。

## 获取指定账号的在线登录设备列表

调用 `getLoggedInDevicesFromServerWithUserId`，传入用户 ID 和有效 Token，从服务器异步获取指定账号的在线登录设备列表。

```objectivec
[[EMClient sharedClient] getLoggedInDevicesFromServerWithUserId:userId
                                                          token:token
                                                     completion:^(NSArray<EMDeviceConfig *> *devices, EMError *error) {
    if (!error) {
        for (EMDeviceConfig *device in devices) {
            NSString *resource = device.resource;
            NSString *deviceUUID = device.deviceUUID;
            NSString *deviceName = device.deviceName;
            // 使用 resource、deviceUUID 和 deviceName 展示或管理设备。
        }
    } else {
        // 获取失败。
    }
}];
```

该接口返回的 `EMDeviceConfig` 字段如下：

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| `resource` | `NSString *` | 登录设备的资源标识，用于指定目标设备。 |
| `deviceUUID` | `NSString *` | 登录设备的 UUID。 |
| `deviceName` | `NSString *` | 登录设备名称；未设置自定义名称时，通常为设备型号。 |

## 设置登录设备的名称

环信即时通讯 IM 支持自定义设置设备名称，这样在多设备场景下，若有设备被踢下线，被踢设备可明确是被哪个设备挤下线。

初始化 SDK 时，你可以调用 `EMOptions#customDeviceName` 设置当前设备的自定义名称。设置设备名称后，若登录设备时因达到了登录设备数量限制而导致在已登录的设备上强制退出时，被踢设备收到的 `userAccountDidLoginFromOtherDeviceWithInfo` 回调里会包含导致该设备被踢下线的自定义设备名称。

```objectivec
EMOptions *options = [EMOptions optionsWithAppkey:@"your-org#your-app"];
options.customDeviceName = @"Alice 的 iPad";

// 使用 options 初始化 SDK 后，再通过异步 Token 登录接口登录。
```

## 设置登录设备的平台

可通过 `EMOptions#customOSType` 设置当前设备所属的自定义平台，例如将手机和平板电脑设置为单独的平台，方便用户精细化控制同一平台的登录设备数量及平台间互踢等行为。

1. 在环信控制台的 **即时通讯** > **基础功能** > **用户** 页面，在**多端多设备** 区域，点击 **设置**。在弹出的对话框中点击 **新增自定义平台**，在 **添加自定义平台** 对话框中设置 **设备平台** 和 **设备数量**。

**设备平台**的取值范围为 [1,100]，**设备数量**的取值范围为 [0,4]。

![img](/images/common/multidevice_device_platform.png)

2. 初始化 SDK 时，调用 `initializeSDKWithOptions` 方法设置 `EMOptions#customOSType` 属性添加自定义平台。确保该属性的值与环信控制台的 **新增自定义平台** 对话框中设置的 **设备平台** 的值相同。

:::tip
登录成功后才会将该设置发送到服务器。
:::

```objectivec
EMOptions *options = [EMOptions optionsWithAppkey:@"your-org#your-app"];
options.customOSType = 60;

// 使用 options 初始化 SDK 后，再通过异步 Token 登录接口登录。
```

## 设置登录设备的扩展信息

环信即时通讯 IM 支持为登录设备设置自定义扩展信息。在多设备登录场景下，该功能可用于传递当前登录设备的附加标识信息，便于业务侧进行设备识别和管理，例如，若有设备被踢下线，被踢设备能获得该设备的自定义扩展信息。

初始化 SDK 时，可通过 `EMOptions#loginExtensionInfo` 属性设置设备扩展信息。设置后，多设备场景下，登录该设备后，若因达到了登录设备数量限制而导致当前登录设备被踢下线（`206` 错误，`EMErrorUserLoginOnAnotherDevice`），被踢设备收到的 `userAccountDidLoginFromOtherDeviceWithInfo` 回调的 `EMLoginExtensionInfo` 参数中包含新登录设备的设备名称 `deviceName` 和扩展信息 `extensionInfo`。

:::tip
登录成功后才会将该设置发送到服务器。
:::

```objectivec
EMOptions *options = [EMOptions optionsWithAppkey:@"your-org#your-app"];
options.loginExtensionInfo = @"{\"source\":\"iPad\"}";

// 使用 options 初始化 SDK 后，再通过异步 Token 登录接口登录。

- (void)userAccountDidLoginFromOtherDeviceWithInfo:(EMLoginExtensionInfo *)info {
    NSString *deviceName = info.deviceName;
    NSString *extensionInfo = info.extensionInfo;
    // 根据新登录设备信息提示当前用户。
}
```

## 强制指定账号从单个设备下线

调用 `kickDeviceWithUserId` 可将指定账号从单个设备踢下线。你需要首先调用 `getLoggedInDevicesFromServerWithUserId` 获取目标设备的 `resource`，再传入该资源标识。

:::tip
不登录也可以使用该接口。
:::

```objectivec
[[EMClient sharedClient] getLoggedInDevicesFromServerWithUserId:userId
                                                          token:token
                                                     completion:^(NSArray<EMDeviceConfig *> *devices, EMError *error) {
    if (error || devices.count == 0) {
        return;
    }

    NSString *resource = devices.firstObject.resource;
    [[EMClient sharedClient] kickDeviceWithUserId:userId
                                             token:token
                                          resource:resource
                                        completion:^(EMError *kickError) {
        if (!kickError) {
            // 踢出指定设备成功。
        } else {
            // 踢出失败。
        }
    }];
}];
```

## 强制指定账号从所有设备下线

调用 `kickAllDevicesWithUserId` 可将指定账号从所有设备踢下线。

:::tip
不登录也可以使用该接口。
:::

```objectivec
[[EMClient sharedClient] kickAllDevicesWithUserId:userId
                                             token:token
                                        completion:^(EMError *error) {
    if (!error) {
        // 踢出所有设备成功。
    } else {
        // 踢出失败。
    }
}];
```

## 监听多设备事件

例如，账号 A 同时在设备 A 和 B 上登录，账号 A 在设备 A 上进行操作，设备 B 会收到这些操作对应的通知。

实现 `EMMultiDevicesDelegate` 并调用 `addMultiDevicesDelegate` 注册监听。无需监听时调用 `removeMultiDevicesDelegate` 移除。

:::tip
多端多设备场景下，不提供聊天室操作相关的多设备事件；聊天室仅支持消息收发同步。
:::

```objectivec
@interface MultiDeviceObserver () <EMMultiDevicesDelegate>
@end

@implementation MultiDeviceObserver

- (void)startObserveMultiDeviceEvents {
    [[EMClient sharedClient] addMultiDevicesDelegate:self delegateQueue:nil];
}

- (void)stopObserveMultiDeviceEvents {
    [[EMClient sharedClient] removeMultiDevicesDelegate:self];
}

- (void)multiDevicesContactEventDidReceive:(EMMultiDevicesEvent)event
                                  username:(NSString *)username
                                       ext:(NSString *)ext {
    // 处理 EMMultiDevicesEventContactRemove、ContactAccept、ContactDecline、ContactBan 或 ContactAllow。
}

- (void)multiDevicesGroupEventDidReceive:(EMMultiDevicesEvent)event
                                 groupId:(NSString *)groupId
                                     ext:(id)ext {
    // 处理群组创建、解散、加群、退群、邀请、禁言等事件。
}

- (void)multiDevicesChatThreadEventDidReceive:(EMMultiDevicesEvent)event
                                      threadId:(NSString *)threadId
                                           ext:(id)ext {
    // 处理 EMMultiDevicesEventChatThreadCreate、Destroy、Join、Leave、Update 或 Kick。
}

- (void)multiDevicesConversationEvent:(EMMultiDevicesEvent)event
                        conversationId:(NSString *)conversationId
                      conversationType:(EMConversationType)conversationType {
    // 处理会话置顶、取消置顶、删除、标记、免打扰及未读数清零等事件。
    // 收到会话事件后，按业务需要刷新本地会话数据。
}

- (void)multiDevicesMessageBeRemoved:(NSString *)conversationId deviceId:(NSString *)deviceId {
    // 当前用户在其他设备上单向删除了服务端某个会话的历史消息。
}

@end
```



多设备清除未读数事件使用以下枚举值：

 - `EMMultiDevicesEventConversationUnreadMessageCountCleared`（65）：其他设备清除了指定会话的未读数。
 - `EMMultiDevicesEventAllConversationUnreadMessageCountCleared`（66）：其他设备清除了全部会话的未读数。

## 典型示例

当 PC 端和移动端登录同一个账号时，移动端可以异步获取 PC 端的登录 ID，并向该登录 ID 发送单聊消息：

```objectivec
[[EMClient sharedClient].contactManager getSelfIdsOnOtherPlatformWithCompletion:^(NSArray<NSString *> *loginIds, EMError *error) {
    if (error || loginIds.count == 0) {
        return;
    }

    NSString *to = loginIds.firstObject;
    EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"Hello World"];
    EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:to body:body ext:nil];
    message.chatType = EMChatTypeChat;

    [[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:^(EMChatMessage *message, EMError *sendError) {
        // 根据 sendError 处理发送结果。
    }];
}];
```

## 接口列表

| API 名称 | 所属模块/类型 | 说明 |
| :--- | :--- | :--- |
| [`getSelfIdsOnOtherPlatformWithCompletion`](#获取当前用户的其他登录设备的登录-id-列表) | `IEMContactManager` | 异步获取当前用户在其他平台的登录 ID 列表。 |
| [`getLoggedInDevicesFromServerWithUserId`](#获取指定账号的在线登录设备列表) | `EMClient` | 使用用户 ID 和 Token 异步获取指定账号的在线设备列表。 |
| [`customDeviceName`](#设置登录设备的名称) | `EMOptions` | 设置当前登录设备的名称。 |
| [`customOSType`](#设置登录设备的平台) | `EMOptions` | 设置当前登录设备的平台编号。 |
| [`loginExtensionInfo`](#设置登录设备的扩展信息) | `EMOptions` | 设置当前登录设备的扩展信息。 |
| [`kickDeviceWithUserId`](#强制指定账号从单个设备下线) | `EMClient` | 异步将指定账号从指定设备踢下线。 |
| [`kickAllDevicesWithUserId`](#强制指定账号从所有设备下线) | `EMClient` | 异步将指定账号从所有设备踢下线。 |
| [`resource`](#获取指定账号的在线登录设备列表) / [`deviceUUID`](#获取指定账号的在线登录设备列表) / [`deviceName`](#获取指定账号的在线登录设备列表) | `EMDeviceConfig` | 获取登录设备的资源标识、UUID 和名称。 |
| [`deviceName`](#设置登录设备的扩展信息) / [`extensionInfo`](#设置登录设备的扩展信息) | `EMLoginExtensionInfo` | 获取导致当前设备下线的新设备名称和扩展信息。 |

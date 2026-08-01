# 管理聊天室属性

## 功能说明

聊天室是支持多人沟通的即时通讯系统。聊天室属性可分为聊天室名称、描述和公告等基本属性和自定义属性（key-value）。若聊天室基本属性不满足业务要求，用户可增加自定义属性并同步给所有成员。利用自定义属性可以存储直播聊天室的类型、狼人杀等游戏中的角色信息和游戏状态以及实现语聊房的麦位管理和同步等。聊天室自定义属性以键值对（key-value）形式存储，key 和 value 均为字符串，属性信息变更会实时同步给聊天室成员。

## 前提条件

开始前，请确保满足以下条件：

 - 完成 SDK 初始化，详见 [快速开始](quickstart.html)；
 - 了解环信即时通讯 IM 的 [使用限制](/product/limitation.html)。
 - 了解聊天室的数量限制，详见 [套餐包详情](https://www.easemob.com/pricing/im)。

## 管理聊天室基本属性

### 获取聊天室详情

聊天室所有成员均可调用 `getChatroomSpecificationFromServerWithId` 获取聊天室详情，查看聊天室名称和描述。聊天室公告、管理员列表、成员列表、黑名单列表和禁言列表需要分别调用对应接口获取。

示例代码如下：

```objectivec
// 异步方法。
[[EMClient sharedClient].roomManager getChatroomSpecificationFromServerWithId:@"chatroomId"
                                                                   completion:^(EMChatroom *chatroom, EMError *error) {
    if (!error) {
        NSString *subject = chatroom.subject;
        NSString *description = chatroom.description;
    }
}];
```

### 获取聊天室公告

聊天室所有成员均可调用 `getChatroomAnnouncementWithId` 获取聊天室公告。

示例代码如下：

```objectivec
// 异步方法。
[[EMClient sharedClient].roomManager getChatroomAnnouncementWithId:@"chatroomId"
                                                        completion:^(NSString *announcement, EMError *error) {
    if (!error) {
        // announcement 为聊天室公告。
    }
}];
```

### 更新聊天室公告

仅聊天室所有者和聊天室管理员可以调用 `updateChatroomAnnouncementWithId` 设置和更新聊天室公告，聊天室公告的长度限制为 512 个字符。公告更新后，其他聊天室成员收到 `chatroomAnnouncementDidUpdate` 回调。

示例代码如下：

```objectivec
// 异步方法。
[[EMClient sharedClient].roomManager updateChatroomAnnouncementWithId:chatroomId
                                                           announcement:textString
                                                            completion:^(EMChatroom *chatroom, EMError *error) {
    // 处理更新结果。
}];
```

### 修改聊天室名称

仅聊天室所有者和聊天室管理员可以调用 `updateSubject` 设置和修改聊天室名称，聊天室名称的长度限制为 128 个字符。

示例代码如下：

```objectivec
// 异步方法。
[[EMClient sharedClient].roomManager updateSubject:textString
                                        forChatroom:chatroomId
                                         completion:^(EMChatroom *chatroom, EMError *error) {
    // 处理更新结果。
}];
```

### 修改聊天室描述

仅聊天室所有者和聊天室管理员可以调用 `updateDescription` 设置和修改聊天室描述，聊天室描述的长度限制为 512 个字符。

示例代码如下：

```objectivec
// 异步方法。
[[EMClient sharedClient].roomManager updateDescription:textString
                                            forChatroom:chatroomId
                                             completion:^(EMChatroom *chatroom, EMError *error) {
    // 处理更新结果。
}];
```

## 管理聊天室自定义属性（key-value）

### 获取聊天室指定自定义属性

聊天室所有成员均可调用 `fetchChatroomAttributes` 获取聊天室指定自定义属性。

示例代码如下：

```objectivec
// 异步方法。
[[EMClient sharedClient].roomManager fetchChatroomAttributes:chatroomId
                                                        keys:@[@"123"]
                                                  completion:^(EMError *error, NSDictionary<NSString *, NSString *> *properties) {
    // properties 为获取到的属性。
}];
```

### 获取聊天室所有自定义属性

聊天室成员可以调用 `fetchChatroomAllAttributes` 获取聊天室所有自定义属性。

示例代码如下：

```objectivec
// 异步方法。
[[EMClient sharedClient].roomManager fetchChatroomAllAttributes:chatroomId
                                                      completion:^(EMError *error, NSDictionary<NSString *, NSString *> *properties) {
    // properties 为获取到的属性。
}];
```

### 设置单个聊天室属性

聊天室成员可以调用 `setChatroomAttribute` 设置和更新单个聊天室自定义属性。该方法只可添加新自定义属性字段和更新自己设置的现有属性。设置后，其他聊天室成员收到 `chatroomAttributesDidUpdated` 回调。

示例代码如下：

```objectivec
// 异步方法。
[[EMClient sharedClient].roomManager setChatroomAttribute:chatroomId
                                                       key:@"234"
                                                     value:@"123"
                                                autoDelete:YES
                                           completionBlock:^(EMError *error) {
    // 处理设置结果。
}];
```

### 强制设置单个聊天室属性

如果除了设置自己的单个自定义属性还需覆盖其他聊天室成员设置的该属性，需调用 `setChatroomAttributeForced` 方法。设置成功后，其他聊天室成员收到 `chatroomAttributesDidUpdated` 回调。

示例代码如下：

```objectivec
// 异步方法。
[[EMClient sharedClient].roomManager setChatroomAttributeForced:chatroomId
                                                             key:@"234"
                                                           value:@"123"
                                                      autoDelete:YES
                                                 completionBlock:^(EMError *error) {
    // 处理设置结果。
}];
```

### 设置多个聊天室自定义属性

聊天室成员可以调用 `setChatroomAttributes` 方法设置多个聊天室自定义属性。该方法只能添加新属性字段以及更新当前用户已添加的属性字段。设置成功后，其他聊天室成员收到 `chatroomAttributesDidUpdated` 回调。

示例代码如下：

```objectivec
// 异步方法。
[[EMClient sharedClient].roomManager setChatroomAttributes:chatroomId
                                                attributes:@{@"testKey": @"123"}
                                               autoDelete:YES
                                          completionBlock:^(EMError *error, NSDictionary<NSString *, EMError *> *failureKeys) {
    // failureKeys 包含设置失败的属性及对应错误。
}];
```

### 强制设置多个聊天室自定义属性

如果除了设置自己的多个自定义属性还需覆盖其他聊天室成员设置的这些属性，需调用 `setChatroomAttributesForced` 方法。设置成功后，其他聊天室成员收到 `chatroomAttributesDidUpdated` 回调。

示例代码如下：

```objectivec
// 异步方法。
[[EMClient sharedClient].roomManager setChatroomAttributesForced:chatroomId
                                                      attributes:@{@"testKey": @"123"}
                                                     autoDelete:YES
                                                completionBlock:^(EMError *error, NSDictionary<NSString *, EMError *> *failureKeys) {
    // failureKeys 包含设置失败的属性及对应错误。
}];
```

### 删除单个聊天室自定义属性

聊天室成员可以调用 `removeChatroomAttribute` 方法删除单个聊天室自定义属性。该方法只能删除自己设置的自定义属性。移除后，其他聊天室成员收到 `chatroomAttributesDidRemoved` 回调。

示例代码如下：

```objectivec
// 异步方法。
[[EMClient sharedClient].roomManager removeChatroomAttribute:chatroomId
                                                          key:@"234"
                                               completionBlock:^(EMError *error) {
    // 处理删除结果。
}];
```

### 强制删除单个聊天室自定义属性

如果除了删除自己设置的单个自定义属性还需删除其他聊天室成员设置的该属性，需调用 `removeChatroomAttributeForced` 方法。删除后，聊天室其他成员收到 `chatroomAttributesDidRemoved` 回调。

示例代码如下：

```objectivec
// 异步方法。
[[EMClient sharedClient].roomManager removeChatroomAttributeForced:chatroomId
                                                                key:@"234"
                                                     completionBlock:^(EMError *error) {
    // 处理删除结果。
}];
```

### 删除多个聊天室自定义属性

聊天室成员可以调用 `removeChatroomAttributes` 方法删除多个聊天室自定义属性。该方法只能删除自己设置的自定义属性。删除后，聊天室其他成员收到 `chatroomAttributesDidRemoved` 回调。

示例代码如下：

```objectivec
// 异步方法。
[[EMClient sharedClient].roomManager removeChatroomAttributes:chatroomId
                                                    attributes:@[@"testKey"]
                                               completionBlock:^(EMError *error, NSDictionary<NSString *, EMError *> *failureKeys) {
    // failureKeys 包含删除失败的属性及对应错误。
}];
```

### 强制删除多个聊天室自定义属性

如果除了删除自己设置的多个自定义属性还需删除其他聊天室成员设置的这些属性，需调用 `removeChatroomAttributesForced` 方法。删除后，聊天室其他成员收到 `chatroomAttributesDidRemoved` 回调。

示例代码如下：

```objectivec
// 异步方法。
[[EMClient sharedClient].roomManager removeChatroomAttributesForced:chatroomId
                                                          attributes:@[@"testKey"]
                                                     completionBlock:^(EMError *error, NSDictionary<NSString *, EMError *> *failureKeys) {
    // failureKeys 包含删除失败的属性及对应错误。
}];
```

## 监听聊天室事件

详见 [监听聊天室事件](room_manage.html#监听聊天室事件)。

## 接口列表

| API 名称 | 所属模块/类型 | 说明 |
| :--- | :--- | :--- |
| [`getChatroomSpecificationFromServerWithId`](#获取聊天室详情) | `IEMChatroomManager` | 异步获取聊天室详情。 |
| [`getChatroomAnnouncementWithId`](#获取聊天室公告) | `IEMChatroomManager` | 异步获取公告。 |
| [`updateChatroomAnnouncementWithId`](#更新聊天室公告) | `IEMChatroomManager` | 异步更新公告。 |
| [`updateSubject`](#修改聊天室名称) | `IEMChatroomManager` | 异步修改聊天室名称。 |
| [`updateDescription`](#修改聊天室描述) | `IEMChatroomManager` | 异步修改聊天室描述。 |
| [`fetchChatroomAttributes`](#获取聊天室指定自定义属性) | `IEMChatroomManager` | 异步获取指定自定义属性。 |
| [`fetchChatroomAllAttributes`](#获取聊天室所有自定义属性) | `IEMChatroomManager` | 异步获取全部自定义属性。 |
| [`setChatroomAttribute`](#设置单个聊天室属性) | `IEMChatroomManager` | 异步设置单个自定义属性。 |
| [`setChatroomAttributes`](#设置多个聊天室自定义属性) | `IEMChatroomManager` | 异步设置多个自定义属性。 |
| [`removeChatroomAttribute`](#删除单个聊天室自定义属性) | `IEMChatroomManager` | 异步删除单个自定义属性。 |
| [`removeChatroomAttributes`](#删除多个聊天室自定义属性) | `IEMChatroomManager` | 异步删除多个自定义属性。 |

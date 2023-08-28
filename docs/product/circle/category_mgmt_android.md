# 管理频道分组

环信超级社区（Circle）支持将多个频道归入一个频道分组，方便频道管理。例如，可将歌剧频道、民歌频道和流行歌曲频道划分为声乐频道分组。

社区创建时会创建默认的频道分组，包含默认频道。

**超级社区中的频道基于即时通讯 IM 的群组或聊天室（频道 ID 为群组 ID 或聊天室 ID）创建，删除群组或聊天室时需注意以下几点：**

**1. 在环信控制台或者通过客户端删除群组或聊天室、群组或聊天室加人、踢人等操作时请谨慎操作，需确保操作的群组或者聊天室不是超级社区使用的。**
**2. 如果将超级社区使用的频道对应的群组或者聊天室删除，会出现数据不一致情况，导致用户加入不了社区、频道、在频道内发不了消息等情况发生。**
**3. 在清理群组或者聊天室数据时，需先确认要删除的群组 ID 或聊天室 ID 与超级社区的频道 ID 是否一致。你可以调用[获取频道详情 API](channel_mgmt_android.html#获取频道详情) 确认要删除的群组或聊天室是否为超级社区的频道。如果是，请不要进行删除。**
**4. 如果需要清理超级社区数据，调用[删除社区](server_mgmt_android.html#解散社区)和[删除频道](channel_mgmt_android.html#解散频道)等 API。**

## 技术原理

环信即时通讯 IM Android SDK 提供 `EMCircleManager` 类和 `EMCircleCategory` 类用于频道分组管理，支持你通过调用 API 实现如下功能：

- 创建和管理频道分组；
- 监听频道分组事件。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 3.9.9.2 版本的初始化，详见 [快速开始](/document/android/quickstart.html)；
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 创建频道分组

仅社区所有者可以调用 `createCategory` 方法创建频道分组。创建频道分组时需设置频道分组所属的社区 ID 和频道分组名称。频道分组创建后，社区所有成员（除创建者外）会收到 `EMCircleCategoryListener#onCategoryCreated` 事件。 

每个社区下最多可创建 50 个频道分组，超过需要联系商务。

示例代码如下：

```java
EMClient.getInstance().chatCircleManager().createCategory(serverId, categoryName, new EMValueCallBack<EMCircleCategory>() {
    @Override
    public void onSuccess(EMCircleCategory value) {
        
    }

    @Override
    public void onError(int error, String errorMsg) {
        
    }
});
```

### 修改频道分组名称

仅社区所有者和管理员可调用 `updateCategory` 方法修改频道分组名称。频道分组名称修改后，社区所有成员（除操作者外）会收到 `EMCircleCategoryListener#onCategoryUpdated` 事件。

示例代码如下：

```java
EMClient.getInstance().chatCircleManager().updateCategory(serverId, categoryId, categoryName, new EMValueCallBack<EMCircleCategory>() {
    @Override
    public void onSuccess(EMCircleCategory value) {
        
    }

    @Override
    public void onError(int error, String errorMsg) {
        
    }
});
```

### 删除频道分组

仅社区所有者可调用 `destroyCategory` 方法删除频道分组。社区所有成员（除操作者外）会收到 `EMCircleCategoryListener#onCategoryDestroyed` 事件。频道分组删除后，该频道分组下的所有频道会移至当前社区的默认频道分组下。

示例代码如下：

```java
EMClient.getInstance().chatCircleManager().destroyCategory(serverId, categoryId, new EMCallBack() {
                    @Override
                    public void onSuccess() {

                    }

                    @Override
                    public void onError(int code, String error) {
                        
                    }
                });
```

### 分页获取社区下的频道分组列表

社区中的所有成员可以调用 `fetchCategoriesInServer` 方法获取社区下的频道分组列表。

示例代码如下：

```java
EMClient.getInstance().chatCircleManager().fetchCategoriesInServer(serverID, 20, null, new EMValueCallBack<EMCursorResult<EMCircleCategory>>() {
            @Override
            public void onSuccess(EMCursorResult<EMCircleCategory> value) {
                
            }

            @Override
            public void onError(int error, String errorMsg) {
                
            }
        });
```

### 更换指定频道的频道分组

仅社区所有者和管理员可以调用 `transferChannel` 方法将指定频道从一个频道分组转移至另一个频道分组。频道分组更换后，社区所有成员（除操作者外）会收到 `EMCircleCategoryListener#onChannelTransfered` 事件。

:::tip
调用该方法时，若 `newCategoryId` 参数传入 `null` 或空字符串 `""`，表示将频道归入社区默认的频道分组。
:::

示例代码如下：

```java
EMClient.getInstance().chatCircleManager().transferChannel(serverId,channelId, newCategoryId, new EMCallBack() {
                    @Override
                    public void onSuccess() {
                       
                    }

                    @Override
                    public void onError(int code, String error) {
                        
                    }
                });
```

### 监听频道分组事件

`EMCircleManager` 中提供频道分组事件的监听接口。开发者可以通过设置此监听，获取频道分组中的事件，并做出相应处理。如果不再使用该监听，需要移除，防止出现内存泄漏。

```java
EMCircleCategoryListener chatCategoryListener = new EMCircleCategoryListener() {
    //创建了频道分组。社区所有成员（除创建者外）会收到该事件。
    @Override
    public void onCategoryCreated(EMCircleCategory category, String creator) {

    }
    //删除了频道分组。社区所有成员（除操作者外）会收到该事件。
    @Override
    public void onCategoryDestroyed(String serverId, String categoryId, String initiator) {

    }
    //修改了频道分组名称。社区所有成员（除操作者外）会收到该事件。
    @Override
    public void onCategoryUpdated(EMCircleCategory category, String initiator) {

    }
    //频道更换了分组。社区所有成员（除操作者外）会收到该事件。
    @Override
    public void onChannelTransfered(String serverId, String fromCategoryId, String toCategoryId, String channelId, String initiator) {

    }
};

//添加频道分组监听。
EMClient.getInstance().chatCircleManager().addCategoryListener(chatCategoryListener);
//移除频道分组监听。
EMClient.getInstance().chatCircleManager().removeCategoryListener(chatCategoryListener);
//清除所有频道分组监听。
EMClient.getInstance().chatCircleManager().clearCategoryListeners();
```
# 通讯录页面拦截点击跳转事件与 ViewModel 中可重载的方法

## 拦截点击跳转事件

对于联系人页面的点击跳转事件，你可以利用原有的逻辑，也可以在原有的逻辑上添加自己的扩展和实现。

你可以继承 `ContactViewController` 并赋值注册到 `ComponentsRegister.shared.ContactsController` 中，然后即可重载如下想要拦截的点击事件方法。

| 方法名    |   用途    | 是否可重载 |
| -------- | -------- | -------- |
| `createNavigation`    | 创建导航栏方法     | 是     |
| `navigationClick`    | 导航栏所有点击方法     | 是     |
| `viewContact`   | 查看联系人详情页面     | 是     |
| `rightItemsAction`    | 导航右侧按钮点击方法     | 是     |
| `pop`   | 页面返回上一级方法     |   是   |
| `setupTitle`    | 设置不同类型联系人页面导航标题     | 是     |
| `receiveContactHeaderAction`    | 联系人列表 Header Cell 的点击事件 | 是     |
| `searchAction`    | 点击搜索框     | 是     |
| `addContact`    | 添加联系人弹窗     | 是     |
| `confirmAction`    | 导航右侧文本按钮点击事件     | 是     |
| `viewNewFriendRequest`   | 查看新好友请求页面     | 是     |
| `viewJoinedGroups`   | 查看加入的群组列表页面     | 是     |

## ViewModel 中可重载的方法

环信即时通讯 IM SDK 的通讯录页面的回调事件监听以及 UI 触发事件的监听在通讯录页面的 `ViewModel` 中。

你可以利用原有的逻辑，也可以在原有的逻辑上添加自己的扩展和实现。

你可以继承 `ContactViewModel` 并赋值注册到 `ComponentsRegister.shared.ContactViewService` 中，即可重载如下想要拦截的监听方法。

| 方法名 | 用途 | 是否可重载 |
| -------- | -------- | -------- |
| `processFriendDidAgree`    | 收到添加联系人对方同意回调。     | 是     |
| `processFriendRequestDidDecline`   | 收到添加联系人对方拒绝回调。     | 是     |
| `processFriendshipDidRemove`    | 收到好友关系被移除回调。     | 是     |
| `processFriendshipDidAddSuccessful`    | 收到好友关系添加成功回调。     | 是     |
| `processFriendRequestDidReceive`    | 收到添加好友申请回调。     | 是     |
| `contactEventDidChanged`    | 联系人多设备事件变更回调。     | 是     |

UI 事件的回调，详见 [拦截点击跳转事件](#拦截点击跳转事件) 。


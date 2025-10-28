# 通讯录页面

## 概述

联系人列表 `ContactsView` 是 `ChatUIKit` 提供的主要组件, 用于展示用户的所有联系人，包括联系人搜索，添加联系人，好友申请列表入口，群组列表入口，联系人列表。

昵称在中文或者英文的情况下可以实现按首字母分类。

`ContactsView` 可以直接使用，也可以通过[路由](chatuikit_advancedusage.html#路由的使用)使用。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/flutter/custom_contact_list.png" title="设置联系人列表页面" />
</ImageGallery> 

## 创建创建通讯录页面

添加会话列表时，只需要将 `ContactsView` 添加到页面上即可。

```dart
@override
Widget build(BuildContext context) {
  return const ContactsView();
}
```

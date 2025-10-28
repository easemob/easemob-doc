# 通讯录页面

## 概述

`ChatUIKitContactsListFragment` 用于展示通讯录列表，包括联系人搜索，添加联系人，好友申请列表入口，群组列表入口，联系人列表。

昵称在中文或者英文的情况下可以实现按首字母分类。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/page_contact_list.png" title="通讯录" />
</ImageGallery>

## 使用示例

```kotlin
class ContactListActivity: AppCompactActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_contact_list)

        ChatUIKitContactsListFragment.Builder()
                        .build()?.let { fragment ->
                            supportFragmentManager.beginTransaction()
                                .replace(R.id.fl_fragment, fragment).commit()
                        }
    }
}
```



## 创建通讯录页面

单群聊 UIKit 提供 `ChatUIKitContactsListFragment`，添加到 Activity 中即可使用。

示例如下：

```kotlin
class ContactListActivity: AppCompactActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_contact_list)

        ChatUIKitContactsListFragment.Builder()
                        .build()?.let { fragment ->
                            supportFragmentManager.beginTransaction()
                                .replace(R.id.fl_fragment, fragment).commit()
                        }
    }
}
```


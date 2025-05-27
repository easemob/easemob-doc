# 设置联系人详情页面

你可以配置联系人详情页面的标题栏和中间的按钮等。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/custom_contact_details.png" title="联系人详情页面" />
</ImageGallery>

## 设置标题栏

聊天页面、会话列表页面、联系人列表页面、群详情页面和联系人详情页面的标题栏均使用 `ChatUIKitTitleBar`。如果聊天页面的标题栏不满足需求，建议设置标题栏。关于标题栏中的标题、头像、背景色、标题栏右侧按钮的显示图片和左侧的头像，详见[设置会话列表页面的标题栏](chatuikit_custom_conversation_list.html#设置标题栏)。

## 自定义按钮

联系人详情页面中按钮数据源可配项以及按钮点击事件，例如，添加音频通话、视频通话按钮。默认情况下，`super.getDetailItem()` 包含聊天和搜索。 

```kotlin
    // 实现 MyContactDetailActivity 继承 ChatUIKitContactDetailsActivity 并重写以下方法

    override fun getDetailItem(): MutableList<ChatUIKitMenuItem>? {
        val list = super.getDetailItem()
        val audioItem = ChatUIKitMenuItem(
            title = getString(R.string.detail_item_audio),
            resourceId = R.drawable.uikit_phone_pick,
            menuId = R.id.contact_item_audio_call,
            titleColor = ContextCompat.getColor(this, com.hyphenate.easeui.R.color.ease_color_primary),
            order = 2
        )

        val videoItem = ChatUIKitMenuItem(
            title = getString(R.string.detail_item_video),
            resourceId = R.drawable.uikit_video_camera,
            menuId = R.id.contact_item_video_call,
            titleColor = ContextCompat.getColor(this, com.hyphenate.easeui.R.color.ease_color_primary),
            order = 3
        )
        list?.add(audioItem)
        list?.add(videoItem)
        return list
    }

    override fun onMenuItemClick(item: ChatUIKitMenuItem?, position: Int): Boolean {
        item?.let {
            when(item.menuId){
                R.id.contact_item_audio_call -> {
                    CallKitManager.startSingleAudioCall(user?.userId)
                    return true
                }
                R.id.contact_item_video_call -> {
                    CallKitManager.startSingleVideoCall(user?.userId)
                    return true
                }
                else -> {
                    return super.onMenuItemClick(item, position)
                }
            }
        }
        return false
    }


```


 
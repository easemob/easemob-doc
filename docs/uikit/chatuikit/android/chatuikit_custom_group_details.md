# 设置群组详情页面

你可以配置群组详情页面的标题栏和中间的按钮等。

![img](/images/uikit/chatuikit/android/custom_group_details.png)

## 设置标题栏

聊天页面、会话列表页面、联系人列表页面、群详情页面和联系人详情页面的标题栏均使用 `EaseTitleBar`。如果聊天页面的标题栏不满足需求，建议设置标题栏。关于标题栏中的标题、头像、背景色、标题栏右侧按钮的显示图片和左侧的头像，详见[设置会话列表页面的标题栏](chatuikit_custom_conversation_list.html#设置标题栏)。

## 自定义按钮

群组详情页面中按钮数据源可配项以及按钮点击事件，例如，添加音频通话、视频通话按钮。默认情况下，`super.getDetailItem()` 包含聊天和搜索。 

```kotlin
    // 实现 MyGroupDetailActivity 继承 EaseGroupDetailActivity 并重写以下方法

    override fun getDetailItem(): MutableList<EaseMenuItem>? {
        val list = super.getDetailItem()
        val audioItem = EaseMenuItem(
            title = getString(R.string.detail_item_audio),
            resourceId = R.drawable.ease_phone_pick,
            menuId = R.id.contact_item_audio_call,
            titleColor = ContextCompat.getColor(this, com.hyphenate.easeui.R.color.ease_color_primary),
            order = 2
        )

        val videoItem = EaseMenuItem(
            title = getString(R.string.detail_item_video),
            resourceId = R.drawable.ease_video_camera,
            menuId = R.id.contact_item_video_call,
            titleColor = ContextCompat.getColor(this, com.hyphenate.easeui.R.color.ease_color_primary),
            order = 3
        )
        list?.add(audioItem)
        list?.add(videoItem)
        return list
    }

    override fun onMenuItemClick(item: EaseMenuItem?, position: Int): Boolean {
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
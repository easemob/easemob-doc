# 可配项修改

- 修改 `UiOptions` 中的可配项。例如，你可以修改 `UiOptions` 中的 `useGiftsInList` 配置消息列表上是否显示礼物。

```kotlin
val chatroomUIKitOptions = ChatroomUIKitOptions(
      uiOptions = UiOptions(
      targetLanguageList = listOf(GlobalConfig.targetLanguage.code),
      useGiftsInList = false,
    )
)
```

- 修改 `ViewModel` 中的可配项。例如，你可以修改 `MessageListViewModel` 中的可配项，配置是否显示时间和头像。

```kotlin
class MessageListViewModel(
  private val isDarkTheme: Boolean? = false,
  private val showDateSeparators: Boolean = true,
  private val showLabel: Boolean = true,
  private val showAvatar: Boolean = true,
  private val roomId: String,
  private val chatService: UIChatroomService,
  private val composeChatListController: ComposeChatListController
)
```


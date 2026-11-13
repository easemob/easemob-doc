# 初始化

在使用 UIKit 的控件前，必须要先初始化。例如在 `Application` 中：

```kotlin
import com.hyphenate.chat.EMOptions.EMDataSyncType
import java.util.EnumSet

class DemoApplication: Application() {
    
    override fun onCreate() {
        val options = ChatOptions()
        options.appKey = "你的appkey"
        // 开启 SDK 用户信息托管：消息携带发送者资料、登录后自动同步用户属性等。UIKit 展示用户昵称和头像依赖该配置。
        options.setEnableUserInfo(true)
        // 设置登录后自动同步的数据类型：会话、联系人和已加入的群组。默认仅同步会话数据。
        options.setDataSyncType(EnumSet.of(EMDataSyncType.CONVERSATIONS, EMDataSyncType.CONTACTS, EMDataSyncType.JOINED_GROUPS))
        ChatUIKitClient.init(this, options)
    }
}
```

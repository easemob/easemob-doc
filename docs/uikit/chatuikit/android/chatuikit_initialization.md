# 初始化

在使用 UIKit 的控件前，必须要先初始化。例如在 `Application` 中：

```kotlin
class DemoApplication: Application() {
    
    override fun onCreate() {
        val options = ChatOptions()
        options.appKey = "你的appkey"
        ChatUIKitClient.init(this, options)
    }
}
```

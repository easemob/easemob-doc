# 国际化

目前，单群聊 UIKit 支持的语言仅包括中文和英文。如有其他语言支持需求，需发版前在 `EaseChatResource.bunlde` 中增加与中英文一致格式的语言文件。

若要设置界面语言，需在 `Appearance` 中设置 `ease_chat_language` 属性，此属性为枚举。

示例代码:

```Swift
    Appearance.ease_chat_language = .Chinese
    Appearance.ease_chat_language = .English
```

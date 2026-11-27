# 国际化

目前，单群聊 UIKit 默认支持中文和英文，作为界面展示语言。你可以使用默认语言包，也可以增加其他语言包，传入对应的 `languageCode`，即语言的 ISO 639-1 代码，例如，`en` 表示英语，`zh` 表示中文。

## 设置界面语言

```kotlin
object LanguageUtil {
    fun changeLanguage(languageCode:String){
        val appLocale: LocaleListCompat = LocaleListCompat.forLanguageTags(languageCode)
        // 由于可能需要 Activity.restart()，在主线程上调用该方法。
        AppCompatDelegate.setApplicationLocales(appLocale)
    }
}
```

## 新增语言包

1. 创建语言资源文件。
   
在 `res` 目录下，你可以为每种语言创建一个新的资源文件夹。每个文件夹的命名约定为 `res/values-<language_code>`。

示例文件夹结构：

```xml
res/
    values/               # 默认语言（通常是英语）
        strings.xml
    values-zh/           # 中文
        strings.xml
    values-es/           # 西班牙语
        strings.xml
```

2. 添加字符串资源。
   
在每个 `strings.xml` 文件中，添加对应语言的字符串资源。



# 主题

<Toc />

EaseChatUIKit 内置浅色和深色主题，默认为浅色主题。

- 浅色主题

![img](/images/uikit/chatuikit/android/light_mode.png)

- 深色主题

![img](/images/uikit/chatuikit/android/dark_mode.png)

## 实现方式

Android 利用自己的平台特性，可以在 `res` 目录下创建 `values-night` 资源文件。Android 系统会跟随系统明暗色的切换使用对应的资源包。

单群聊 UIKit 定义了一组基础颜色，满足 UIKit 自身主题颜色的需求。客户如想要自定义 UIKit 主题色，可以在自己的项目中新建 `values-night` 文件夹，并复制 `ease_colors.xml` 到文件夹中，然后对其中的基础颜色修改。

## 切换为内置主题 

若从当前的主题切换到 EaseChatUIKit 内置的浅色或深色主题，可使用以下方法：

```kotlin
 // 在 sp 中存入一个 Boolean 类型变量，记录当前是浅色还是深色主题。
 val isBlack = EasePreferenceManager.getInstance().getBoolean("isBlack")
 // 调用系统 API 切换模式。
 AppCompactDelegate.setDefaultNightMode(if (isBlack) AppCompactDelegate.MODE_NIGHT_NO else AppCompactDelegate.MODE_NIGHT_YES)
 EasePreferenceManager.getInstance().putBoolean("isBlack", !isBlack)
```

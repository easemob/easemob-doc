# 集成 ChatroomUIKit

使用 `chatroom_uikit` 之前，你需要将 `chatroom_uikit` 集成到你的应用中。

## 前提条件

- 即时通讯 SDK 3.0.0（包含）-4.0.0；
- Flutter 3.3.0 或以上版本；
- 有效的环信即时通讯 IM 开发者账号和 [App Key](/product/enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。
- 对于 `iOS` 应用：
  - Xcode 13 或以上版本;
  - ios 11 或以上版本;
- 对于 `Android` 应用：
  - minSDKVersion 21。
  - release 时需要在 `xxx/android/app/proguard-rules.pro` 中设置免混淆规则：

```java
-keep class com.hyphenate.** {*;}
-dontwarn  com.hyphenate.**
```

## 安装 UIKit 到项目中

进入项目，执行以下命令：

```sh
flutter pub get add chatroom_uikit
```


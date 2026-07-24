# 集成 ChatroomUIKit

<Toc />

ChatroomUIKit 已合并到单群聊 UIKit 包 `em_chat_uikit` 中，当前版本不再单独发布 `chatroom_uikit` 包。使用聊天室 UIKit 能力时，请集成 `em_chat_uikit`，不要再执行 `flutter pub add chatroom_uikit`。

## 前提条件

- Flutter 3.3.0 或以上版本；
- 有效的环信即时通讯 IM 开发者账号和 [App Key](/product/console/app_manage.html#管理应用)。
- 对于 `iOS` 应用：
  - Xcode 13 或以上版本;
  - iOS 12 或以上版本;
- 对于 `Android` 应用：
  - minSDKVersion 24。

## 安装 UIKit 到项目中

进入项目，执行以下命令：

```sh
flutter pub add em_chat_uikit
```

在 Dart 文件中引入 UIKit：

```dart
import 'package:em_chat_uikit/chat_uikit.dart';
```

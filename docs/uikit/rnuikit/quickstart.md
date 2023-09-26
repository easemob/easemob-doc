利用 react-native-chat-uikit 提供的 UI 组件，你可以轻松实现应用内的聊天。react-native-chat-uikit 支持单聊、群聊和聊天室会话，本文介绍如何实现在单聊会话中发送消息。

## 前提条件

### iOS 平台

- MacOS 10.15.7 或以上版本
- Xcode 12.4 或以上版本，包括命令行工具
- React Native 0.63.4 或以上版本
- NodeJs 16 或以上版本，包含 npm 包管理工具
- CocoaPods 包管理工具
- Yarn 编译运行工具
- Watchman 调试工具
- 运行环境真机或模拟器 iOS 10.0 或以上版本

### Android 平台   

- MacOS 10.15.7 或以上版本
- Android Studio 4.0 或以上版本，包括 JDK 1.8 或以上版本
- React Native 0.63.4 或以上版本
- 如果用 Macos 系统开发，需要 CocoaPods 包管理工具
- NodeJs 16 或以上版本，包含 npm 包管理工具
- Yarn 编译运行工具
- Watchman 调试工具
- 运行环境真机或模拟器 Android 6.0 或以上版本

## 发送第一条消息

### 第一步 创建 RN 示例项目

```sh
npx react-native init RNUIkitQuickExample --version 0.71.11  
``` 

### 第二步 初始化项目

在生成的 `env` 中配置 `appkey` 等信息。

```sh
yarn && yarn run env
```

### 第三步 添加依赖到该项目

其中 `react-native-chat-sdk` 为即时通讯 IM SDK， `react-native-chat-uikit` 为 UIkit，其它为三方依赖。

```json
{
  "dependencies": {
    "@react-native-async-storage/async-storage": "^1.17.11",
    "@react-native-camera-roll/camera-roll": "^5.6.0",
    "@react-native-clipboard/clipboard": "^1.11.2",
    "@react-native-firebase/app": "^18.0.0",
    "@react-native-firebase/messaging": "^18.0.0",
    "react-native-audio-recorder-player": "^3.5.3",
    "react-native-chat-sdk": "^1.2.0",
    "react-native-chat-uikit": "^1.0.0",
    "react-native-create-thumbnail": "^1.6.4",
    "react-native-document-picker": "^9.0.1",
    "react-native-fast-image": "^8.6.3",
    "react-native-file-access": "^3.0.4",
    "react-native-get-random-values": "~1.8.0",
    "react-native-image-picker": "^5.4.2",
    "react-native-permissions": "^3.8.0",
    "react-native-safe-area-context": "4.5.0",
    "react-native-screens": "^3.20.0",
    "react-native-video": "^5.2.1"
  }
}
```

#### 第四步 配置 iOS

添加以下内容到 `ios/Podfile` 文件。

```ruby
target 'RNUIkitQuickExample' do

  pod 'GoogleUtilities', :modular_headers => true
  pod 'FirebaseCore', :modular_headers => true

  permissions_path = File.join(File.dirname(`node --print "require.resolve('react-native-permissions/package.json')"`), "ios")
  pod 'Permission-Camera', :path => "#{permissions_path}/Camera"
  pod 'Permission-MediaLibrary', :path => "#{permissions_path}/MediaLibrary"
  pod 'Permission-Microphone', :path => "#{permissions_path}/Microphone"
  pod 'Permission-Notifications', :path => "#{permissions_path}/Notifications"
  pod 'Permission-PhotoLibrary', :path => "#{permissions_path}/PhotoLibrary"

end

```

添加以下内容到 `ios/RNUIkitQuickExample/Info.plist` 文件。

```xml
<dict>
	<key>NSCameraUsageDescription</key>
	<string></string>
	<key>NSMicrophoneUsageDescription</key>
	<string></string>
	<key>NSPhotoLibraryUsageDescription</key>
	<string></string>
</dict>
```

#### 第四步 配置 Android

添加以下内容到 `android/build.gradle` 文件。

```groovy
buildscript {
    ext {
        kotlinVersion = '1.6.10'
        if (findProperty('android.kotlinVersion')) {
            kotlinVersion = findProperty('android.kotlinVersion')
        }
    }
    dependencies {
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion")
    }
}
```

添加以下内容到 `android/app/src/main/AndroidManifest.xml` 文件。

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />

</manifest>
```

### 第五步 初始化和进入聊天页面

必要的代码包括初始化 react-native-chat-uikit、登录服务器、进入聊天页面开始聊天。下面添加了简单的页面路由和跳转用于演示目的。

1. 初始化 react-native-chat-uikit：

```typescript
export const App = () => {
  return (
    <UikitContainer
      option={{
        appKey: appKey,
        autoLogin: true,    
        debugModel: true,
      }}
    >
      <NavigationContainer>
        <Root.Navigator initialRouteName="Main">
          <Root.Screen name="Main" component={MainScreen} />
          <Root.Screen name="Chat" component={ChatScreen} />
        </Root.Navigator>
      </NavigationContainer>
    </UikitContainer>
  );
};
```

2. 添加聊天详情页面：

```typescript
export function ChatScreen({
  route,
}: NativeStackScreenProps<typeof RootParamsList>): JSX.Element {
  return (
    <ScreenContainer mode="padding" edges={["right", "left", "bottom"]}>
      <ChatFragment
        screenParams={{
          params: route.params as any,
        }}
      />
    </ScreenContainer>
  );
}
```

### 第六步 运行示例项目

```sh
yarn run ios
# or
yarn run android
```

### 第七步 发送消息验证

![img](@static/images/rnuikit/uikit_quick_start.png)

## 示例源码参考

[查看示例完整源码](https://github.com/easemob/react-native-chat-library/tree/dev/examples/uikit-quick-start)。

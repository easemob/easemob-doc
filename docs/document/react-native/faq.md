# 常见问题

## 1. 找不到 debug.keystore 文件怎么办？

需要在 Android 应用模块目录（通常为 `android/app`，SDK 示例项目为 `example/android/app`）通过 `keytool` 工具生成该文件。例如，`keytool -genkeypair -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"`。该文件仅用于调试签名，正式发布时应使用独立的发布签名。

## 2. 找不到 google-services.json 文件怎么办？

`google-services.json` 是 Firebase 的 Android 应用配置文件，不是 SDK 单聊消息收发的必需文件。

如果你的项目集成了 Firebase/FCM，请从 Firebase 控制台下载与应用包名匹配的配置文件，放入 Android 应用模块目录（通常为 `android/app`）。如果未使用 Firebase，请检查是否误启用了 Google Services 插件或相关初始化代码，不要用其他项目的配置文件替代。

## 3. 找不到 GoogleService-Info.plist 怎么办？

`GoogleService-Info.plist` 是 Firebase 的 iOS 应用配置文件，不是 SDK 单聊消息收发的必需文件。

如果你的项目集成了 Firebase，请从 Firebase 控制台下载与应用 Bundle ID 匹配的配置文件，并添加至对应的 iOS 应用 target。如果未使用 Firebase，请检查是否仍有 Firebase 配置文件引用或初始化代码；仅通过 APNs 接收离线推送时，也不需要此文件。

## 4. 本地图片路径包含特殊符号，Image 组件加载失败，如何处理？

可以将本地文件路径转换为符合 `Image` 组件要求的 URI。`encodeURI` 不会编码 `#` 和 `?`，需对路径各段分别编码，避免将文件名中的字符解析为 URI 片段或查询参数。

以下示例仅用于未进行 URI 编码的绝对文件路径，也支持带 `file://` 前缀的未编码路径。已经编码的文件 URI 不要重复编码；`content://` 等其他 URI 应按其原有格式处理，不要添加 `file://`。该转换仅用于界面展示，无需修改 SDK 消息对象中的附件路径。

```tsx
function formatLocalImagePath(path: string | null | undefined): string | undefined {
  if (!path) return undefined;

  const localPath = path.startsWith("file://") ? path.slice(7) : path;

  // 保留路径分隔符，编码路径中的 #、?、空格等特殊字符
  return `file://${localPath.split("/").map(encodeURIComponent).join("/")}`;
}

// 使用示例
<Image
  source={{
    uri: formatLocalImagePath("/storage/emulated/0/.../easemob#easeim/..."),
  }}
  style={{ width: 200, height: 200 }}
/>;
```

路径打印:

```typescript
const originalPath =
  "/storage/emulated/0/Android/data/com.example/easemob#easeim/file.jpg";
const formattedPath = formatLocalImagePath(originalPath);

console.log("原始路径:", originalPath); // /storage/emulated/0/Android/data/com.example/easemob#easeim/file.jpg
console.log("格式化后:", formattedPath); // file:///storage/emulated/0/Android/data/com.example/easemob%23easeim/file.jpg
```

## 5. 初始化项目后找不到 node_modules 怎么办？

- `yarn 4.x.x`：启用 Plug'n'Play 时，可能不会生成 `node_modules`。React Native 工程可通过 `yarn config set nodeLinker node-modules` 配置使用该目录，再重新执行 `yarn` 安装依赖。当前 SDK 示例项目已使用此配置。
- `yarn 1.x.x`：默认使用 `node_modules`。如果目录不存在，请确认已在项目根目录执行 `yarn`，且依赖安装成功。

## 6. 页面提示 “No script URL provided. Make sure the packager is running or you have embedded a JS bundle in your application bundle”, 如何处理？

对于从 Metro 加载 JavaScript 的调试构建，需要确保本地调试服务已启动：`yarn run start`。

- 如果使用模拟器，按照终端或服务提示信息操作即可。
- 如果真机通过局域网连接 Metro，需保证手机和开发电脑处于同一局域网内；使用 USB 调试时，可按 React Native 的要求配置端口转发。

如果应用需要脱离 Metro 运行（例如发布构建），应将 JavaScript bundle 打包进应用。仅启动 Metro 不能替代该构建步骤。

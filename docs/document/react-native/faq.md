# 常见问题

## 1. 找不到 debug.keystore 文件怎么办？

需要通过 `keytool` 工具生成该文件。例如，`keytool -genkeypair -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"`

## 2. 找不到 google-services.json 文件怎么办？

可临时使用 template 文件内的模板进行替换，以便通过编译。

## 3. 找不到 GoogleService-Info.plist 怎么办？

可临时使用 template 文件内的模板进行替换，以便通过编译。

## 4. 本地图片路径包含特殊符号，Image 组件加载失败，如何处理？

可以通过修改本地路径，符合 Image 组件要求来加载。

```js
function formatLocalImagePath(path) {
  if (!path) return null;

  // 添加 file:// 前缀（如果没有的话）
  const formattedPath = path.startsWith("file://") ? path : `file://${path}`;

  // 编码特殊字符
  return encodeURI(formattedPath);
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

```js
const originalPath =
  "/storage/emulated/0/Android/data/com.example/easemob#easeim/file.jpg";
const formattedPath = formatLocalImagePath(originalPath);

console.log("原始路径:", originalPath); // /storage/emulated/0/Android/data/com.example/easemob#easeim/file.jpg
console.log("格式化后:", formattedPath); // file:///storage/emulated/0/Android/data/com.example/easemob%23easeim/file.jpg
```

## 5. 初始化项目后找不到 node_modules 怎么办？

- `yarn 4.x.x`： 需要设置使用本地配置 `yarn config set nodeLinker node-modules`。
- `yarn 1.x.x`： 不存在该问题。

## 6. 页面提示 “No script URL provided. Make sure the packager is running or you have embedded a JS bundle in your application bundle”, 如何处理？

需要确保本地调试服务已启动：`yarn run start`。
- 如果使用模拟器，按照终端或服务提示信息操作即可。
- 如果使用真机，需保证手机和开发电脑处于同一局域网内。
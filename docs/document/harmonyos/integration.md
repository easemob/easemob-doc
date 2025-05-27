# 集成 SDK

本文介绍如何将环信即时通讯 IM SDK 集成到你的 HarmonyOS 项目。

## 开发环境要求

- DevEco Studio NEXT Release（5.0.3.900）及以上；
- HarmonyOS SDK API 12 及以上；
- HarmonyOS NEXT.0.0.71 或以上版本的设备。

## 集成 SDK

打开 [SDK 下载](https://www.easemob.com/download/im)页面，获取最新版的环信即时通讯 IM HarmonyOS SDK，得到 `har` 形式的 SDK 文件。

将 SDK 文件，拷贝到 `entry` 模块或者其他需要的模块下的 `libs` 目录。

修改模块目录的 `oh-package.json5` 文件，在 `dependencies` 节点增加依赖声明。

```json
{
  "dependencies": {
    "@easemob/chatsdk": "file:./libs/chatsdk-x.x.x.har"
  }
}
```
最后单击 **File > Sync and Refresh Project** 按钮，直到同步完成。

### 添加项目权限

在模块的 `module.json5` ，例如：`entry` 模块的 `module.json5` 中，配置示例如下：

```json
{
  module: {
    requestPermissions: [
      {
        name: "ohos.permission.GET_NETWORK_INFO",
      },
      {
        name: "ohos.permission.INTERNET",
      },
    ],
  },
}
```

### 在工程 `build-profile.json5` 中设置支持字节码 HAR 包。

修改工程级 `build-profile.json5` 文件，在 `products` 节点下设置 `useNormalizedOHMUrl` 为 `true`。

```json
{
  "app": {
    "products": [
      {
         "buildOption": {
           "strictMode": {
             "useNormalizedOHMUrl": true
           }
         }
      }
    ]
  }
}
````

:::tip
- 此配置需要将 `DevEco Studio` 升级到 `Beta2（5.0.3.502）` 及以上版本。
- SDK 1.3.0 及以上版本采用字节码构建方式打包，必须设置 `useNormalizedOHMUrl` 为 `true`。
:::
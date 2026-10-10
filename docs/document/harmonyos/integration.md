# 导入 SDK

本文介绍如何将环信即时通讯 IM SDK 集成到你的 HarmonyOS 项目。

## 开发环境要求

- DevEco Studio NEXT Release（5.0.3.900）及以上；
- HarmonyOS SDK API 12 及以上；
- HarmonyOS 5.0.0（API 12）或以上版本的真机或模拟器。

## 导入 SDK

### 远程依赖

在需要使用 SDK 的模块目录（例如 `entry`）下执行如下命令，安装指定版本的 SDK。请将 `x.y.z` 替换为实际的 SDK 版本号：

```shell
ohpm install @easemob/chatsdk@x.y.z
```

该命令会将依赖添加到当前模块的 `oh-package.json5` 中。若要安装当前可获取的最新版本，可不指定版本号：

```shell
ohpm install @easemob/chatsdk
```

:::tip
- HarmonyOS SDK v5.x 支持通过 OHPM 添加远程依赖。
- 安装后，请确认实际使用 SDK 的模块已在 `oh-package.json5` 的 `dependencies` 中声明 `@easemob/chatsdk`。
:::

### 本地依赖

打开 [SDK 下载](https://www.easemob.com/download/im#HarmonyOS) 页面，获取最新版的环信即时通讯 IM HarmonyOS SDK，得到 HAR 文件。

将 SDK 文件复制到 `entry` 模块或其他需要使用 SDK 的模块下的 `libs` 目录。

修改模块目录的 `oh-package.json5` 文件，在 `dependencies` 节点增加依赖声明。

```json5
{
  "dependencies": {
    "@easemob/chatsdk": "file:./libs/chatsdk-x.y.z.har"
  }
}
```

请将 `x.y.z` 替换为实际的 SDK 版本号，并确保依赖路径中的文件名与 `libs` 目录下的 HAR 文件名一致。

最后单击 **File > Sync and Refresh Project** 按钮，直到同步完成。

### 添加项目权限

在模块的 `module.json5`（例如 `entry` 模块的 `module.json5`）中声明 SDK 所需的网络权限：

```json5
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

若应用还使用录音、读取媒体文件等功能，需根据实际功能另行声明并申请对应权限。

### 设置支持字节码 HAR 包

修改工程级 `build-profile.json5` 文件，在 `products` 节点下设置 `useNormalizedOHMUrl` 为 `true`。

```json5
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
```

:::tip
- HarmonyOS SDK v5.x 采用字节码 HAR 方式打包，必须将 `useNormalizedOHMUrl` 设置为 `true`。
- 工程包含多个 product 时，应在实际参与构建的各个 product 中设置该选项。
:::

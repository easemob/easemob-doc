# 添加依赖

<Toc />

使用单群聊 UIKit 之前，你需要将其集成到你的应用中。

## 前提条件

- DevEco Studio NEXT Release（5.0.3.900）及以上；
- HarmonyOS SDK API 12 及以上；
- HarmonyOS NEXT.0.0.71 或以上版本的模拟器或者真机；
- 有效的环信即时通讯 IM 开发者账号和 App Key，请参见 [环信控制台文档](/product/console/app_manage.html#查看应用信息)。

## 远程依赖

在项目根目录下执行如下命令：

```shell
ohpm install @easemob/chatuikit
```

:::tip
上面的命令在根目录执行，会将 SDK 依赖添加到项目级别；如果要将 SDK 依赖到 Module 级别，需要在对应的 Module 目录下执行上面的命令。
:::

## 本地依赖

从 GitHub 获取 [UIKit 源码](https://github.com/easemob/easemob-uikit-harmonyos)，按照下面的方式集成：

- 点击 **Import**，选择 **Import Module**，导入 `chatuikit` 模块。
- 在项目 Module 中引入 `chatuikit` 模块。

修改模块目录的 **oh-package.json5** 文件，在 **dependencies** 节点增加依赖声明。

```json
"dependencies": {
    "@easemob/chatuikit": "file:./../chatuikit"
}
```

然后点击同步按钮，同步完成后，就可以在模块中使用 `chatuikit`。

## 添加项目权限

在模块的 `module.json5` ，例如：`HelloWorld` 中 `entry` 模块的 `module.json5` 中，配置示例如下：

```
{
  module: {
    requestPermissions: [
      {
        name: "ohos.permission.GET_NETWORK_INFO",
      },
      {
        name: "ohos.permission.INTERNET",
      },
      {
        "name": "ohos.permission.MICROPHONE",
        "reason": "$string:record_permission_reason",
        "usedScene": {
          "abilities": [
            "EntryAbility"
          ],
          "when": "always"
        }
      }
    ],
  },
}
```

需要在对应模块的 `string.json` 文件中增加如下：

```json
{
    "name": "record_permission_reason",
    "value": "录制语音需要"
}
```
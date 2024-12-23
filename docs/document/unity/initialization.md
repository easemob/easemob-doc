# SDK 初始化

初始化是使用 SDK 的必要步骤，需在所有接口方法调用前完成。

如果进行多次初始化操作，只有第一次初始化以及相关的参数生效。

:::tip
需要在主进程中进行初始化。
:::

## 前提条件

有效的环信即时通讯 IM 开发者账号和 App key，详见[环信即时通讯云控制台的相关文档](enable_and_configure_IM.html#创建应用)。

## 初始化

初始化示例代码：

```csharp
var options = new Options("appkey"); //将该参数设置为你的 App Key
//其他 Options 配置。
SDKClient.Instance.InitWithOptions(options);
```

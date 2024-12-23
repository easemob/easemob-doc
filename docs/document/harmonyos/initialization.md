# SDK 初始化

初始化是使用 SDK 的必要步骤，需在所有接口方法调用前完成。

如果进行多次初始化操作，只有第一次初始化以及相关的参数生效。

## 前提条件

有效的环信即时通讯 IM 开发者账号和 App key，详见[环信即时通讯云控制台的相关文档](enable_and_configure_IM.html#创建应用)。

## 初始化

初始化示例代码：

```typescript
let options = new ChatOptions("Your appkey");
......// 其他 ChatOptions 配置。
// 初始化时传入上下文以及 options
ChatClient.getInstance().init(context, options);
```

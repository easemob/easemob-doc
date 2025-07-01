# SDK 初始化

初始化是使用 SDK 的必要步骤，需在所有接口方法调用前完成。

如果进行多次初始化操作，只有第一次初始化以及相关的参数生效。

## 前提条件

有效的环信即时通讯 IM 开发者账号和 App key，详见[环信即时通讯云控制台的相关文档](/product/enable_and_configure_IM.html#创建应用)。

## 初始化

初始化示例代码：

```typescript
let options = new ChatOptions({
  appKey: "你的 AppKey"
});
......// 其他 ChatOptions 配置。
// 初始化时传入上下文以及 options
ChatClient.getInstance().init(context, options);
```

自 SDK 1.8.0 开始，支持通过字面量的方式设置初始化时的条件，示例代码如下：
  
```typescript
ChatClient.getInstance().init(this.context, {
  appKey: "您的AppKey",
  appIDForPush: "您在 AppGallery Connect 获取到的 ClientID。",
  // 关闭自动登录
  isAutoLogin: false,
  // 其他更多设置
});
```

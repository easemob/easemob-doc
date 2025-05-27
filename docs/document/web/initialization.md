# SDK 初始化

初始化是使用 SDK 的必要步骤,需在所有接口方法调用前完成。

## 前提条件

有效的环信即时通讯 IM 开发者账号和 App key，详见[环信即时通讯云控制台的相关文档](enable_and_configure_IM.html#创建应用)。

## 初始化参数说明

```javascript
import ChatSDK from "easemob-websdk";
const conn = new ChatSDK.connection({
  appKey: "Your appKey",
});
```

| 参数          | 类型   | 是否必需 | 描述                       |
| ------------- | ------ | -------- | -------------------------- |
| appKey        | String | 是       | 环信应用的唯一标识         |


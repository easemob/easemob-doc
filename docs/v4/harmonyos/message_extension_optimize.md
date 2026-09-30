# 消息扩展升级指南

## 变更概述

SDK v1.6.0、v1.7.0 及 v1.11.0 版本中对 `ChatMessage` 类的 `setExt` 和 `setJsonAttribute` 方法进行了重要优化，以更好地支持对象类型的扩展属性。

- `setExt`：设置消息的扩展属性。
- `setJsonAttribute`：设置消息的 JSON 扩展属性。

## 版本变更详情

### v1.6.0

1. **setExt 方法增强**：

   - 支持对象类型扩展：`MessageExtType` 类型从 `string | boolean | number` 扩展为 `string | boolean | number | object`。
   - 自动 JSON 序列化：当传入 `object` 类型时，SDK 内部自动调用 `JSON.stringify` 转换为字符串。
   - 向后兼容：原有 `string`、`boolean`、`number` 类型使用方式保持不变。
  
2. **setJsonAttribute 方法调整**：

   - 方法签名变更：从 `setJsonAttribute(key: string, jsonValue: string)` 改为 `setJsonAttribute(key: string, value: string | object)`。
   - 支持对象参数：可直接传入对象，SDK 会自动序列化。
  
3. **ext 方法增强**：

   自动 JSON 解析：读取扩展属性时，如果值是 JSON 格式字符串，会自动解析为对象返回。

### v1.7.0

**修复 ext() 方法的 JSON 解析问题**：
   - 修复了判断字符串是否为 JSON 格式时的转换错误
   - 使用 `isJson()` 辅助函数和 `getJsonAttribute()` 方法确保正确识别和解析 JSON 字符串

### v1.11.0

**setJsonAttribute 方法限制**：
   - 参数类型限制：`value` 参数现在只支持 `object` 类型，不再支持 `string` 类型。
   - 方法签名：`setJsonAttribute(key: string, value: object)`

## 升级步骤

### 步骤 1：检查现有代码

查找项目中所有使用 `setExt` 和 `setJsonAttribute` 的地方：

```typescript
// 查找 setExt 使用
message.setExt(...)

// 查找 setJsonAttribute 使用  
message.setJsonAttribute(...)
```

### 步骤 2：迁移 setJsonAttribute 调用

**旧代码（v1.5.0 及之前）：**

```typescript
// 方式 1：传入 JSON 字符串
message.setJsonAttribute("userInfo", '{"nickname":"张三","userId":"123"}');

// 方式 2：需要手动序列化对象
let userInfo：UserInfo = { nickname: "张三", userId: "123" };
message.setJsonAttribute("userInfo", JSON.stringify(userInfo));
```

**新代码（v1.6.0+，推荐使用 setExt）：**

```typescript
// 推荐方式：使用 setExt，传入对象时需要使用类型断言
let ext = new Map<string, MessageExtType>();
ext.set("userInfo", { nickname: "张三", userId: "123" } as UserInfo);
ext.set("priority", "high");
message.setExt(ext);

// 或者先定义变量再使用
let userInfo: UserInfo = { nickname: "张三", userId: "123" };
ext.set("userInfo", userInfo);

// 单独设置 JSON 属性（v1.6.0+）：必须使用类型断言
message.setJsonAttribute("userInfo", { nickname: "张三", userId: "123" } as UserInfo);

// v1.11.0+：setJsonAttribute 只支持对象类型，必须使用类型断言
message.setJsonAttribute("userInfo", { nickname: "张三", userId: "123" } as UserInfo);
```

### 步骤 3：更新读取扩展属性的代码

**旧代码：**

```typescript
let ext = message.ext();
let userInfoStr = ext.get("userInfo") as string;
let userInfo = JSON.parse(userInfoStr) as UserInfo; // 需要手动解析
```

**新代码（v1.6.0+）：**

```typescript
let ext = message.ext();
let userInfo = ext.get("userInfo"); // 如果是 JSON，自动解析为对象
// userInfo 可能是 string、number、boolean 或 object
if (typeof userInfo === 'object') {
  // 注意：需要将 object 类型转换为具体类型才能访问属性
  let userInfoObj = userInfo as UserInfo;
  console.log(`用户：${userInfoObj.nickname}，id：${userInfoObj.userId}`);
} else if (typeof userInfo === 'string') {
  // 普通字符串
  console.log(userInfo);
}
```

## 示例代码

例如，设置多个扩展属性：

```typescript
import { ChatMessage, MessageExtType } from '@easemob/chatsdk';

// 创建消息
let message = ChatMessage.createTextSendMessage("user123", "Hello");

// 设置扩展属性 - 推荐方式
let ext = new Map<string, MessageExtType>();

ext.set("userInfo", { nickname: "张三", userId: "123" } as UserInfo);
ext.set("messageType", "order");
ext.set("priority", 1);
ext.set("isImportant", true);
ext.set("description", "这是一条重要消息");

message.setExt(ext);

// 读取扩展属性
let messageExt = message.ext();
let userInfo = messageExt.get("userInfo");
if (typeof userInfo === 'object') {
  // 注意：需要将 object 类型转换为具体类型才能访问属性
  let userInfoObj = userInfo as UserInfo;
  console.log(`用户：${userInfoObj.nickname}，id：${userInfoObj.userId}`);
}

let priority = messageExt.get("priority");
if (typeof priority === 'number') {
  console.log(`优先级：${priority}`);
}
```

## 注意事项

1. **类型安全**

   - 使用 `setExt` 时，`MessageExtType` 现在包含 `object` 类型。
   - 读取扩展属性时，需要检查返回值的类型，可能是 `string | boolean | number | object`。
   - 读取对象类型时，需要使用类型断言转换为具体类型才能访问属性：
  
     ```typescript
     let value = ext.get("userInfo");
     if (typeof value === 'object') {
       let obj = value as UserInfo;
       console.log(obj.nickname);
     }
     ```

2. **JSON 序列化限制**

   - `JSON.stringify` 只能处理 `Object` 和 `Array` 类型。
   - 对于其他对象类型（如 `Date`、`Map`、`Set` 等），需要先转换为普通对象。
  
3. **向后兼容性**

   - v1.6.0+ 完全兼容旧版本的 `setExt` 使用方式（基本类型）。
   - `setJsonAttribute` 在 v1.11.0+ 只支持对象类型，不再支持字符串参数。

4. **性能考虑**
   
   对象类型的属性会在设置时自动序列化，读取时自动反序列化。

## 常见问题

 **1. 为何不建议使用 `setJsonAttribute`？**

`setExt` 方法已经支持对象类型，功能更强大且使用更方便。`setJsonAttribute` 保留是为了向后兼容，但推荐使用 `setExt`。

**2. v1.11.0+ 中 `setJsonAttribute` 可否传字符串？**

不能。v1.11.0+ 版本中 `setJsonAttribute` 只支持 `object` 类型参数。如果需要设置 JSON 字符串，请使用 `setExt` 方法。

**3. 如何判断读取到的扩展属性是对象或字符串？**

使用 `typeof` 操作符检查：

```typescript
let value = message.ext().get("key");
if (typeof value === 'object') {
  // 是对象
} else if (typeof value === 'string') {
  // 是字符串
}
```

## 参考文档

- [ChatMessage API 使用文档](message_extension.html)
- [HarmonyOS SDK 更新日志](releasenote.html)

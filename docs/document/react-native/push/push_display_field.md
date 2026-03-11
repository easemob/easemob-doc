# 使用消息扩展字段设置推送通知显示内容

创建推送消息时，你可以设置消息扩展字段自定义要显示的推送标题和推送内容 。

```typescript
msg.attributes = {
  // 消息扩展字段。该字段为内置内置字段，字段名不可修改。
  em_push_ext: {
    title: "custom push title", // 自定义推送消息标题。该字段为内置内置字段，字段名不可修改。
    content: "custom push content", // 自定义推送消息内容。该字段为内置内置字段，字段名不可修改。
  },
};
```

自定义显示字段的数据结构如下：

```java
{
    "em_push_ext": {
        "title": "custom push title",
        "content": "custom push content"
    }
}
```

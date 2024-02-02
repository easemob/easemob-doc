# 注册事件监听

<Toc />

单群聊 UIKit 提供 eventHandler 注册监听事件，可以监听 UIKit 内部所有调用的 API，事件名称则为 SDK 提供的相应 API 的名字。

## 使用示例

```javascript
import React, { useEffect } from "react";
import { eventHandler } from "easemob-chat-uikit";

const ChatApp = () => {
  useEffect(() => {
    eventHandler.addEventHandler("handlerId", {
      onError: (err) => {
        // 所有的事件的 error 事件同时会在 onError 回调出来
        console.error(err);
      },
      recallMessage: {
        success: () => {
          toast.success("撤回成功");
        },
        error: (error) => {
          toast.error("撤回失败");
        },
      },
      reportMessage: {
        success: () => {
          toast.success("举报成功");
        },
        error: (error) => {
          toast.error("举报失败");
        },
      },
      sendMessage: {
        error: (error) => {
          if (error.type == 507) {
            toast.error("你已被禁言，无法发送消息");
          } else if (
            error.type == 602 &&
            error.message == "not in group or chatroom"
          ) {
            toast.error("消息发送失败，你已不在当前群组");
          }
        },
      },
    });
  }, []);
  return <div> </div>;
};
```

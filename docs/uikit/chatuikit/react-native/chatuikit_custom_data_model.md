# 自定义数据模型

通过继承并扩展核心服务类，你可以定制数据行为，满足特定业务需求。

## 实现自定义数据模型

继承 `ChatServiceImpl` 并重载相关方法，可实现更灵活的业务逻辑。

```typescript
// 1. 集成 ChatServiceImpl 接口，实现自定义接口
class ChatServiceDemo extends ChatServiceImpl {
  // 自定义接口、自定义数据、修改监听器等等
}

// 2. 定义全局对象
let chatServiceDemo;
function getChatServiceDemo(): ChatService {
  if (!chatServiceDemo) {
    chatServiceDemo = new ChatServiceDemo();
  }
  return chatServiceDemo;
}

// 3. 注册自定义数据模型
function App() {
 return (
  <UIKitContainer
    options={options}
    onGetChatService={getChatServiceDemo}
  >
    {/* 应用内容 */}
  </UIKitContainer>
 );
}
```

## 典型应用场景

### 通过手机号添加好友

通过重载 `addNewContact`，将前端输入的手机号转换为真实的用户 ID 后再发起请求。

```tsx
class ChatServiceDemo extends ChatServiceImpl {
  constructor() {
    super();
  }

  override addNewContact(params: {
    userId: string;
    reason?: string;
    onResult?: ResultCallback<void>;
  }): void {
    const processAsync = async () => {
      const chatUserName = await this.client.getCurrentUsername();
      const userToken = await this.client.getAccessToken();

      // 先请求 App Server API，通过手机号获取用户 ID
      RestApi.requestGetUserByPhone({
        phone: params.userId,
        chatUserName: chatUserName ?? "",
        userToken: userToken ?? "",
      })
        .then((result) => {
          if (result.isOk || result.value?.code === 200) {
            // 通过调用 IM SDK API 添加好友
            super.addNewContact(
              params && ({ userId: result.value?.chatUserName } as any),
            );
          } else {
            params.onResult?.({ isOk: false, error: result.error });
          }
        })
        .catch((error) => {
          params.onResult?.({ isOk: false, error });
        });
    };
    processAsync();
  }
}
```

### 自定义事件监听器

通过重载接口，可在数据操作时触发自定义事件，让组件接收特定通知。

```tsx
class ChatServiceDemo extends ChatServiceImpl {
  // 自定义事件监听器集合
  private customListeners: Map<string, Set<(data: any) => void>> = new Map();

  constructor() {
    super();
  }

  // 注册自定义事件监听器
  addCustomListener(event: string, listener: (data: any) => void): void {
    if (!this.customListeners.has(event)) {
      this.customListeners.set(event, new Set());
    }
    this.customListeners.get(event)?.add(listener);
  }

  // 移除自定义事件监听器
  removeCustomListener(event: string, listener: (data: any) => void): void {
    this.customListeners.get(event)?.delete(listener);
  }

  // 触发自定义事件
  private emitCustomEvent(event: string, data: any): void {
    this.customListeners.get(event)?.forEach((listener) => {
      listener(data);
    });
  }

  override sendMessage(params: {
    message: ChatMessage;
    onResult?: ResultCallback<ChatMessage>;
  }): void {
    // 发送消息前触发自定义事件
    this.emitCustomEvent("beforeSendMessage", {
      message: params.message,
      timestamp: Date.now(),
    });

    // 调用原始发送方法
    super.sendMessage({
      message: params.message,
      onResult: (result) => {
        // 发送消息后触发自定义事件
        if (result.isOk) {
          this.emitCustomEvent("afterSendMessage", {
            message: result.value,
            timestamp: Date.now(),
          });
        } else {
          this.emitCustomEvent("sendMessageError", {
            error: result.error,
            timestamp: Date.now(),
          });
        }
        params.onResult?.(result);
      },
    });
  }

  override removeConversation(params: {
    convId: string;
    onResult?: ResultCallback<void>;
  }): void {
    // 删除会话前触发自定义事件，可用于数据备份或确认
    this.emitCustomEvent("beforeRemoveConversation", {
      convId: params.convId,
      timestamp: Date.now(),
    });

    super.removeConversation({
      convId: params.convId,
      onResult: (result) => {
        if (result.isOk) {
          // 删除成功后触发自定义事件
          this.emitCustomEvent("afterRemoveConversation", {
            convId: params.convId,
            timestamp: Date.now(),
          });
        }
        params.onResult?.(result);
      },
    });
  }
}

// 在组件中使用自定义事件
function MyCustomComponent() {
  const chatService = useChatService();

  React.useEffect(() => {
    const handleBeforeSend = (data: any) => {
      console.log("准备发送消息:", data);
      // 可在这里执行自定义逻辑，如显示加载状态
    };

    const handleAfterSend = (data: any) => {
      console.log("消息发送成功:", data);
      // 可在这里执行自定义逻辑，如隐藏加载状态、显示提示
    };

    // 注册监听器
    if (chatService instanceof ChatServiceDemo) {
      chatService.addCustomListener("beforeSendMessage", handleBeforeSend);
      chatService.addCustomListener("afterSendMessage", handleAfterSend);
    }

    return () => {
      // 清理监听器
      if (chatService instanceof ChatServiceDemo) {
        chatService.removeCustomListener("beforeSendMessage", handleBeforeSend);
        chatService.removeCustomListener("afterSendMessage", handleAfterSend);
      }
    };
  }, [chatService]);

  return <View>{/* 组件内容 */}</View>;
}
```

### 数据过滤与增强

通过重载接口，在数据返回前进行处理，如过滤黑名单、敏感词替换、排序等。

```tsx
class ChatServiceDemo extends ChatServiceImpl {
  // 黑名单用户 ID 列表
  private blockedUsers: Set<string> = new Set();
  // 敏感词列表
  private sensitiveWords: string[] = ["敏感词1", "敏感词2"];

  constructor() {
    super();
  }

  // 添加到黑名单
  addToBlockedList(userId: string): void {
    this.blockedUsers.add(userId);
  }

  // 从黑名单移除
  removeFromBlockedList(userId: string): void {
    this.blockedUsers.delete(userId);
  }

  override fetchHistoryMessage(params: {
    convId: string;
    convType: ChatConversationType;
    startMsgId?: string;
    loadCount?: number;
    onResult?: ResultCallback<ChatMessage[]>;
  }): void {
    super.fetchHistoryMessage({
      ...params,
      onResult: (result) => {
        if (result.isOk && result.value) {
          // 过滤黑名单用户的消息
          const filteredMessages = result.value.filter((msg) => {
            return !this.blockedUsers.has(msg.from);
          });

          // 过滤包含敏感词的消息
          const cleanMessages = filteredMessages.map((msg) => {
            if (msg.body.type === ChatMessageType.TXT) {
              let content = (msg.body as ChatTextMessageBody).content;
              this.sensitiveWords.forEach((word) => {
                content = content.replace(new RegExp(word, "gi"), "***");
              });
              (msg.body as ChatTextMessageBody).content = content;
            }
            return msg;
          });

          params.onResult?.({ isOk: true, value: cleanMessages });
        } else {
          params.onResult?.(result);
        }
      },
    });
  }

  override fetchConversationList(params: {
    onResult?: ResultCallback<Array<ChatConversation>>;
  }): void {
    super.fetchConversationList({
      onResult: (result) => {
        if (result.isOk && result.value) {
          // 过滤置顶会话和黑名单用户会话
          const filteredConversations = result.value.filter((conv) => {
            // 过滤黑名单用户的单聊会话
            if (
              conv.convType === ChatConversationType.PeerChat &&
              this.blockedUsers.has(conv.convId)
            ) {
              return false;
            }
            return true;
          });

          // 按最后消息时间排序
          const sortedConversations = filteredConversations.sort((a, b) => {
            return b.lastMessage?.localTime - a.lastMessage?.localTime;
          });

          params.onResult?.({ isOk: true, value: sortedConversations });
        } else {
          params.onResult?.(result);
        }
      },
    });
  }

  override fetchContactList(params: {
    onResult?: ResultCallback<Array<ChatContact>>;
  }): void {
    super.fetchContactList({
      onResult: (result) => {
        if (result.isOk && result.value) {
          // 过滤黑名单用户
          const filteredContacts = result.value.filter((contact) => {
            return !this.blockedUsers.has(contact.userId);
          });

          // 按备注名或用户ID排序
          const sortedContacts = filteredContacts.sort((a, b) => {
            const nameA = a.remark || a.userId;
            const nameB = b.remark || b.userId;
            return nameA.localeCompare(nameB);
          });

          params.onResult?.({ isOk: true, value: sortedContacts });
        } else {
          params.onResult?.(result);
        }
      },
    });
  }
}
```

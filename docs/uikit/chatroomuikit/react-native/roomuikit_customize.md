# 自定义

本文以 `Chatroom` 组件为例介绍如何添加自己的业务逻辑，实现个性化业务需求。

`Chatroom` 组件为页面级组件，包括成员列表组件 `ParticipantList`、输入组件 `MessageInput`、消息区域组件 `MessageList`、打赏消息区域组件 `GiftMessageList` 和全局广播通知组件 `GlobalBroadcast` 等。除了提供各种属性实现自定义配置，Chatroom 组件中的子组件支持自定义，你可以基于自己的逻辑实现更新或替换这些子组件。

## 自定义 GiftMessageList 组件

若 ChatroomUIKit 中内置的打赏消息组件 `GiftMessageList` 无法满足需求，你可以在满足 `GiftMessageListComponent` 的约束的前提下创建新组件，例如 `MyGiftMessageList`，实现自定义业务逻辑和自定义样式。

```tsx
export const MyGiftMessageList: GiftMessageListComponent = React.forwardRef<
  GiftMessageListRef,
  GiftMessageListProps
>(function (
  props: GiftMessageListProps,
  ref?: React.ForwardedRef<GiftMessageListRef>
) {
  // todo：实现你的业务逻辑或修改现有的业务逻辑。
  const {} = props;
  React.useImperativeHandle(
    ref,
    () => {
      return {
        pushTask: (task: GiftMessageListTask) => {
          // todo: 实现该接口。
        },
      };
    },
    []
  );
  return <></>;
});
```

利用新的 `MyGiftMessageList` 组件替换内置的 `GiftMessageList` 组件，添加到 Chatroom 组件。

```tsx
<Chatroom GiftMessageList={MyGiftMessageList} />
```

## 自定义 GlobalBroadcast 组件

若 ChatroomUIKit 中内置的全局广播消息组件 `GlobalBroadcast` 无法满足需求，你可以在满足 `GlobalBroadcastComponent` 的约束的情况下创建新组件，例如 `MyGlobalBroadcast`，实现自定义业务逻辑和自定义样式。

```tsx
export const MyGlobalBroadcast = React.forwardRef<
  GlobalBroadcastRef,
  GlobalBroadcastProps
>(function (
  props: GlobalBroadcastProps,
  ref?: React.ForwardedRef<GlobalBroadcastRef>
) {
  // todo: 实现自己的业务逻辑或修改当前业务逻辑。
  React.useImperativeHandle(
    ref,
    () => {
      return {
        pushTask: (task: GlobalBroadcastTask) => {
          // todo：实现该接口。
        },
      };
    },
    []
  );
  return <></>;
});
```

利用 `MyGlobalBroadcast` 组件替换内置的 `GlobalBroadcast` 组件。

```tsx
<Chatroom GlobalBroadcast={MyGlobalBroadcast} />
```

## 自定义消息列表项样式

修改组件的消息样式。示例代码如下：

```tsx
export function MyMessageListItem(props: MessageListItemProps) {
  // todo：实现自己的业务逻辑或修改当前业务逻辑。
  return <></>;
}
export const MyMessageListItemMemo = React.memo(MyMessageListItem);
```

更新消息列表项的样式。示例代码如下：

```tsx
<Chatroom
  messageList={{
    props: {
      MessageListItemComponent: MyMessageListItemMemo,
    },
  }}
/>
```

## 自定义聊天室成员列表项样式

修改聊天室成员组件的列表项样式。示例代码如下：

```tsx
export function MyParticipantListItem(props: ParticipantListItemProps) {
  // todo：实现自己的业务逻辑或修改当前业务逻辑。
  return <></>;
}

export const MyParticipantListItemMemo = React.memo(MyParticipantListItem);
```

更新聊天室成员组件的列表项样式。示例代码如下：

```tsx
<Chatroom
  participantList={{
    props: {
      MemberItemComponent: MyParticipantListItemMemo,
    },
  }}
/>
```

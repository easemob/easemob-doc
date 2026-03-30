# 会话列表的基本设置

本文介绍 `ConversationList` 组件的常用配置项，包括标题栏控制、搜索样式、事件监听等基础功能。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/rn/custom_conversation_list.png" title="会话列表页面 ConversationList" />
</ImageGallery>

## 基本设置

### 使用示例

```typescript
import { ConversationList } from 'react-native-chat-uikit';

function ConversationListScreen() {
  return (
    <ConversationList
      // 控制标题栏显示
      navigationBarVisible={true}
      // 控制搜索样式显示
      searchStyleVisible={true}
      // 设置容器样式
      containerStyle={{ backgroundColor: '#f5f5f5' }}
      // 点击会话条目
      onClickedItem={(data) => {
        console.log('clicked:', data);
        // 跳转到聊天页面
        navigation.navigate('Chat', { convId: data.convId });
      }}
      // 长按会话条目
      onLongPressedItem={(data) => {
        console.log('long pressed:', data);
      }}
      // 点击搜索
      onClickedSearch={() => {
        // 跳转到搜索页面
        navigation.navigate('SearchConversation');
      }}
      // 点击新会话按钮
      onClickedNewConversation={() => {
        // 跳转到创建新会话页面
        navigation.navigate('NewConversation');
      }}
      // 点击新群组按钮
      onClickedNewGroup={() => {
        // 跳转到创建群组页面
        navigation.navigate('CreateGroup');
      }}
      // 点击新联系人按钮
      onClickedNewContact={() => {
        // 跳转到添加联系人页面
        navigation.navigate('AddContact');
      }}
      // 过滤空会话
      filterEmptyConversation={true}
      // 监听未读总数变化
      onChangeUnreadCount={(count) => {
        console.log('total unread:', count);
      }}
    />
  );
}
```

### 属性列表

`ConversationList` 组件基本属性如下表所示：

| 属性     | 类型            | 描述             |
| ------------ | ------------- | ------------------------------- |
| `navigationBarVisible`     | `boolean`                                              | 是否显示标题栏。<br/> - `true`（默认）：显示。<br/> - `false`：隐藏。<br/> 详见 [显示或隐藏标题栏](chatuikit_custom_titlebar.html#如何隐藏默认导航栏)。           |
| `customNavigationBar`      | `React.ReactElement`                                   | 自定义标题栏组件，完全替换默认标题栏。<br/> 详见 [设置页面标题栏](chatuikit_custom_titlebar.html#完全自定义导航栏)。                              |
| `searchStyleVisible`       | `boolean`                                              | 是否显示搜索样式组件。<br/> - `true`（默认）：显示。<br/> - `false`：隐藏。<br/> 详见 [显示或隐藏搜索样式](chatuikit_custom_conversation_list_searchbar.html)。 |
| `customSearch`             | `React.ReactElement`                                   | 自定义搜索组件，完全替换默认搜索样式。                                                                                           |
| `onClickedSearch`          | `(data?: any) => void`                                 | 点击搜索组件的回调。                                                                                                             |
| `containerStyle`           | `StyleProp<ViewStyle>`                                 | 会话列表容器的样式。                                                                                                             |
| `onClickedItem`            | `(data?: ConversationModel) => boolean \| void`        | 点击会话条目的回调。返回 `true` 可阻止默认行为。                                                                                 |
| `onLongPressedItem`        | `(data?: ConversationModel) => boolean \| void`        | 长按会话条目的回调。返回 `true` 可阻止默认行为。                                                                                 |
| `onClickedNewConversation` | `() => void`                                           | 点击"新会话"按钮的回调，通常需要跳转到新会话页面。                                                                               |
| `onClickedNewGroup`        | `() => void`                                           | 点击"创建群组"按钮的回调，通常需要跳转到创建群组页面。                                                                           |
| `onClickedNewContact`      | `() => void`                                           | 点击"添加联系人"按钮的回调，通常需要跳转到添加联系人页面。                                                                       |
| `filterEmptyConversation`  | `boolean`                                              | 是否过滤空会话（无消息的会话）。                                                                                               |
| `onChangeUnreadCount`      | `(unreadCount: number) => void`                        | 会话列表总未读数变化时的回调。                                                                                                   |
| `flatListProps`            | `Omit<FlatListProps, 'ref' \| 'data' \| 'renderItem'>` | 传递给内部 FlatList 的其他属性。                                                                                                 |

## 设置容器样式

通过 `containerStyle` 属性可自定义会话列表容器的样式：

```typescript
<ConversationList
  containerStyle={{
    // 设置会话列表的背景颜色
    backgroundColor: '#f5f5f5',
    // 标准的容器样式之一，修改组件上部空白区域大小
    paddingTop: 10,
  }}
/>
```

## 默认会话操作

长按会话时，默认操作菜单功能如下：

| 会话操作              | 描述                                                             |
| :-------------------- | :--------------------------------------------------------------- |
| 置顶/取消置顶     | 置顶的会话会显示在列表顶部。                 |
| 免打扰/取消免打扰 | 设置或取消会话免打扰，免打扰会话只显示红点，不计数。 |
| 标记已读          | 会话标记为已读状态，清除未读数。                               |
| 删除              | 删除会话及其所有消息     |

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/conversation_long_press.png" title="会话长按显示的操作" />
</ImageGallery>

## 设置事件监听

### 会话点击事件

通过 `onClickedItem` 处理会话条目的点击事件：

```typescript
<ConversationList
  onClickedItem={(data) => {
    console.log('点击会话:', data.convId, data.convName);
    // 跳转到聊天页面
    navigation.navigate('Chat', {
      convId: data.convId,
      convType: data.convType,
    });
  }}
/>
```

### 会话长按事件

通过 `onLongPressedItem` 处理会话条目的长按事件：

```typescript
<ConversationList
  onLongPressedItem={(data) => {
    console.log('长按会话:', data.convId);
    // 默认会弹出操作菜单（置顶、删除、免打扰等）
    // 返回 true 则会阻止默认菜单弹出，可实现自己的菜单逻辑。
  }}
/>
```

:::tip
长按默认菜单包含：置顶/取消置顶、免打扰、标记已读、删除。
:::

## 处理新建入口

标题栏右侧 "+" 菜单中的选项需自行处理导航：

React Native UIKit 不内置页面跳转功能，创建新会话、群组或添加联系人时的页面跳转需通过回调函数自行实现。

```typescript
<ConversationList
  onClickedNewConversation={() => {
    // 跳转到新会话页面（选择联系人）
    navigation.navigate('NewConversation');
  }}
  onClickedNewGroup={() => {
    // 跳转到创建群组页面
    navigation.navigate('CreateGroup');
  }}
  onClickedNewContact={() => {
    // 跳转到添加联系人页面
    navigation.navigate('AddContact');
  }}
/>
```

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/ios/conversation_operation.png" title="导航栏更多菜单" />
</ImageGallery>

## 过滤空会话

若希望会话列表仅显示有消息记录的会话，可通过 `filterEmptyConversation` 属性过滤掉无消息的空会话：

```typescript
<ConversationList
  filterEmptyConversation={true}  // 启用空会话过滤
/>
```

## 监听未读数变化

通过 `onChangeUnreadCount` 回调可以监听会话列表中所有会话的总未读数变化：

```typescript
<ConversationList
  onChangeUnreadCount={(unreadCount) => {
    console.log('未读总数:', unreadCount);
    // 可以用于更新应用角标、标题等
    updateBadge(unreadCount);
  }}
/>
```

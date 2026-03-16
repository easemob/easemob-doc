# 设置会话搜索栏

会话列表页面支持按会话名称搜索会话。你可以控制搜索栏的显示、自定义搜索样式以及处理搜索点击事件。

:::tip
React Native UIKit 不内置的路由跳转功能，也未集成第三方路由库。搜索相关的页面跳转需在你的应用层自行实现。
:::

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/searchbar.png" title="搜索栏 SearchView" />
</ImageGallery>

## 通用性设计

UIKit 的搜索栏的设计特点如下：

- **统一的设计架构**：所有搜索组件均基于通用的 `ListSearch` 基础组件构建，确保使用体验一致且易于扩展。
- **场景适配**：在统一架构基础上，针对会话、联系人、群组等不同数据对象进行定制。
- **即插即用**：可直接在任意页面引入，满足多样化搜索需求。

UIKit 提供如下内置的搜索组件：

| 组件                 | 作用       |
| :------------------- | :--------- |
| `SearchConversation` | 搜索会话   |
| `SearchContact`      | 搜索联系人 |
| `SearchGroup`        | 搜索群组   |

## 使用默认搜索栏

在会话列表组件中，默认显示搜索样式组件。你可以通过 `searchStyleVisible` 属性控制搜索栏是否显示（默认显示）：

```typescript
import { ConversationList } from 'react-native-chat-uikit';

<ConversationList
  searchStyleVisible={true} // 默认为 true，显示搜索栏
  onClickedSearch={() => {
    // 处理搜索栏点击事件
    // 通常需要跳转到搜索页面
    navigation.navigate('SearchConversation');
  }}
/>
```

## 自定义搜索栏样式

若默认样式不满足需求，可通过 `customSearch` 完全自定义：

```typescript
import { ConversationList } from 'react-native-chat-uikit';
import { Pressable, Text, View } from 'react-native';

<ConversationList
  customSearch={
    <Pressable
      onPress={() => {
        navigation.navigate('SearchConversation');
      }}
    >
      <View style={{ padding: 10, backgroundColor: '#f0f0f0' }}>
        <Text>自定义搜索栏</Text>
      </View>
    </Pressable>
  }
/>
```

## 使用搜索会话组件

UIKit 提供独立的搜索会话组件 `SearchConversation`，供你在搜索页面中使用。

```typescript
import { SearchConversation } from 'react-native-chat-uikit';
import type { ConversationModel } from 'react-native-chat-uikit';

function SearchConversationScreen() {
  return (
    <SearchConversation
      onCancel={() => {
        // 取消搜索，返回上一页
        navigation.goBack();
      }}
      onClicked={(data?: ConversationModel) => {
        if (data) {
          // 点击搜索结果，导航到会话详情页
          navigation.navigate('ConversationDetail', {
            convId: data.convId,
            convType: data.convType,
            convName: data.convName,
            convAvatar: data.convAvatar,
          });
        }
      }}
      filterEmptyConversation={true} // 过滤空会话
      containerStyle={{ flex: 1 }} // 自定义容器样式
    />
  );
}
```

`SearchConversation` 组件的属性如下表所示：

| 属性 | 类型 | 是否必填 | 说明 |
| :-------------- | :----- | :------- | :------------- |
| `onCancel` | `() => void` | 是 | 点击取消按钮的回调 |
| `onClicked` | `(data?: ConversationModel) => void` | 否 | 点击搜索结果的回调 |
| `containerStyle` | `StyleProp<ViewStyle>` | 否 | 容器样式 |
| `filterEmptyConversation` | `boolean` | 否 | 是否过滤空会话（没有消息的会话） |

## 完整使用示例

以下是如何在会话列表页面集成搜索功能的完整使用示例：

- **会话列表页面（HomeScreen.tsx）：**

```typescript
import React from 'react';
import { ConversationList } from 'react-native-chat-uikit';

export function HomeScreen({ navigation }) {
  return (
    <ConversationList
      searchStyleVisible={true}
      onClickedSearch={() => {
        // 点击搜索栏，跳转到搜索页面
        navigation.navigate('SearchConversation');
      }}
    />
  );
}
```

- **搜索页面（SearchConversationScreen.tsx）：**

```typescript
import React from 'react';
import { SafeAreaView } from 'react-native';
import { SearchConversation } from 'react-native-chat-uikit';

export function SearchConversationScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SearchConversation
        onCancel={() => {
          navigation.goBack();
        }}
        onClicked={(data) => {
          if (data) {
            // 返回上一页
            navigation.pop();
            // 导航到会话详情页
            navigation.navigate('ConversationDetail', {
              convId: data.convId,
              convType: data.convType,
              convName: data.convName,
              convAvatar: data.convAvatar,
            });
          }
        }}
        filterEmptyConversation={true}
      />
    </SafeAreaView>
  );
}
```



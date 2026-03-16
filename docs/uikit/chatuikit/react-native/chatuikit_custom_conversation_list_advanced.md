# 会话列表的高级设置

本文介绍如何通过 `ConversationList` 组件实现会话列表的高级设置，包括自定义排序、自定义菜单、自定义列表项样式、列表控制器以及状态监听等。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/ios/main_conversation_list.png" title="会话列表页面 ConversationList" />
</ImageGallery>

## 概述

以下是通过 `ConversationList` 组件进行多种高级设置的完整示例：

```typescript
import React, { useRef } from 'react';
import { View, Button } from 'react-native';
import { ConversationList, ConversationListRef } from 'react-native-chat-uikit';

function AdvancedConversationListScreen({ navigation }) {
  const listRef = useRef<ConversationListRef>(null);

  return (
    <View style={{ flex: 1 }}>
      <ConversationList
        // 基本设置
        navigationBarVisible={true}
        searchStyleVisible={true}
        filterEmptyConversation={true}

        // 自定义排序
        onSort={(prev, next) => {
          // 置顶优先
          if (prev.data.isPinned && !next.data.isPinned) return -1;
          if (!prev.data.isPinned && next.data.isPinned) return 1;
          // 然后按时间排序
          const prevTime = prev.data.lastMessage?.localTime || 0;
          const nextTime = next.data.lastMessage?.localTime || 0;
          return nextTime - prevTime;
        }}

        // 自定义导航栏菜单
        onInitNavigationBarMenu={(items) => [
          ...items,
          {
            name: 'custom_action',
            isHigh: false,
            icon: 'setting',
            onClicked: () => navigation.navigate('Settings'),
          },
        ]}

        // 自定义会话长按菜单
        onInitBottomMenu={(items) => [
          ...items.map(item =>
            item.name === 'delete' ? { ...item, isHigh: true } : item
          ),
        ]}

        // 控制器
        propsRef={listRef}

        // 状态监听
        onStateChanged={(state) => {
          console.log('State:', state);
        }}

        // 事件处理
        onClickedItem={(data) => {
          navigation.navigate('Chat', { convId: data.convId });
        }}

        onClickedSearch={() => {
          navigation.navigate('SearchConversation');
        }}

        // FlatList 属性
        flatListProps={{
          showsVerticalScrollIndicator: false,
        }}
      />

      <Button
        title="刷新列表"
        onPress={() => listRef.current?.refresh()}
      />
    </View>
  );
}
```

// TODO：研发添加
// TODO：设置会话条目标题
// TODO：设置会话条目的消息内容
// TODO：设置显示/隐藏头像和昵称，设置头像的圆角、方角
// TODO：设置会话条目时间
// TODO：添加设置会话免打扰图标
// TODO：添加设置消息未读计数图标

## 设置会话条目样式

通过 `ListItemRender` 属性实现会话条目的样式、布局修改，例如，会话列表项的高度、宽度、背景色、上下边距、左右边距以及会话列表项的自定义点击行为和长按行为等。

```tsx
type MyConversationListScreenProps = {};
function MyConversationListScreen(props: MyConversationListScreenProps) {
  const {} = props;
  const convRef = React.useRef<ConversationListRef>({} as any);

  return (
    <ConversationList
      propsRef={convRef}
      ListItemRender={() => {
        // todo: 自定义列表项样式
        return (
          <Pressable
            style={{
              height: 40,
              width: '100%',
              marginVertical: 10,
              backgroundColor: 'red',
            }}
            onPress={() => {
              // todo: 自定义点击行为
            }}
            onLongPress={() => {
              // todo: 自定义长按行为
            }}
          />
        );
      }}
    />
  );
}
```

## 设置头像和昵称

会话列表 `ConversationList` 中的条目分为 **用户会话** 和 **群组会话** 两种类型。头像和昵称的显示遵循以下优先级规则：

| 优先级 | 数据来源       | 说明                                                         |
| :----- | :------------- | :----------------------------------------------------------- |
| 1      | 自定义数据 | 通过注册回调或主动调用 API 提供的个性化数据。 两种方式的说明见下表。                 |
| 2      | 默认数据   | 未提供自定义数据时的降级方案：<br/> - 用户会话：显示默认头像和用户 ID。 <br/> - 群组会话：显示默认头像和群组 ID。 |

可通过以下方式提供头像和昵称：

| 方式 | 说明       | 特点                                                        |
| :----- | :------------- | :----------------------------------------------------------- |
| 注册回调  | 在 `Container` 组件中通过 `onUsersHandler` 和 `onGroupsHandler` 属性提供数据。   | - 按需加载：仅在需要展示时请求数据，避免无效请求 <br/> - 自动缓存：内部维护数据缓存，减少重复请求 <br/> - 实时更新：数据更新后 UI 自动刷新   |
| 主动调用  | 使用 `ChatService.updateDataList` 方法主动更新数据。   | - 主动推送：可在任意时机主动更新数据，无需等待组件请求 <br/> - 批量处理：支持一次性更新多个用户或群组的数据<br/> - 实时生效：数据更新后立即触发 UI 刷新，无需手动干预<br/> - 事件驱动：更新时会触发内部事件分发，可自定义事件句柄实现精细化控制<br/> -全局同步：自动刷新所有已加载的组件页面，保证数据一致性   |

// TODO：添加设置默认头像、设置会话条目的样式、显示或隐藏头像

## 设置会话排序

默认情况下，会话列表按照 **最后一条消息的时间倒序** 排列，**置顶会话** 始终显示在列表顶部。通过 `onSort` 属性，你可以完全掌控会话的排序逻辑，满足各种业务需求。

```typescript
<ConversationList
  onSort={(prevProps, nextProps) => {
    // 返回 -1, 0, 1 表示排序顺序
    // -1: prevProps 在前
    //  0: 顺序不变
    //  1: nextProps 在前

    // 示例：优先按免打扰状态排序
    if (prevProps.data.doNotDisturb && !nextProps.data.doNotDisturb) {
      return 1;  // 免打扰的会话排在后面
    }
    if (!prevProps.data.doNotDisturb && nextProps.data.doNotDisturb) {
      return -1;
    }

    // 其次按时间排序
    const prevTime = prevProps.data.lastMessage?.localTime || 0;
    const nextTime = nextProps.data.lastMessage?.localTime || 0;
    return nextTime - prevTime;
  }}
/>
```

:::tip
自定义排序会完全覆盖默认排序逻辑。默认的置顶功能不会自动生效，如需保留置顶效果，必须在自定义排序函数中显式处理 **isPinned** 属性。
:::

## 设置导航栏菜单

//  TODO：统一导航栏和标题栏的说法

会话列表导航栏右侧的 "+" 按钮点击后弹出操作菜单，默认包含 "新会话"、"创建群组"、"添加联系人"等选项。你可以通过 `onInitNavigationBarMenu` 自定义菜单项。

#### 菜单项类型定义

每个菜单项均为 `InitMenuItemsType` 对象，包含以下属性：

| 属性名      | 类型       | 是否必需 | 描述      |
| ----------- | ------------------------------ | -------- | ------------------ |
| `name`      | `String`                       | 是       | 菜单项文本。    |
| `isHigh`    | `Boolean`                      | 是       | 是否高亮。  |
| `icon`      | `IconNameType`                 | 否       | 图标名称。   |
| `onClicked` | `(name, others?) => void`      | 否       | 点击回调。  |

`InitMenuItemsType` 类型定义：

```typescript
type InitMenuItemsType = {
  name: string; // 菜单项唯一标识
  isHigh: boolean; // 是否高亮显示
  icon: string; // 图标名称
  onClicked: () => void; // 点击回调
};
```

#### 添加自定义菜单项

```typescript
<ConversationList
  onInitNavigationBarMenu={(initItems) => {
    // initItems 是默认的菜单项数组
    // 可以添加、删除或修改菜单项

    //添加一个自定义菜单项
    return [
      ...initItems,
      {
        name: 'custom_scan',
        isHigh: false,
        icon: 'qrcode_scan',
        onClicked: () => {
          console.log('扫一扫');
          // 跳转到扫码页面
        },
      },
    ];
  }}
/>
```

#### 删除默认菜单项

```typescript
<ConversationList
  onInitNavigationBarMenu={(initItems) => {
    // 移除"添加联系人"菜单项
    return initItems.filter(item => item.name !== 'new_contact');
  }}
/>
```

## 设置会话长按菜单

长按会话条目会显示会话操作菜单，默认包含"置顶"、"免打扰"、"标记已读"、"删除"等操作。你可以通过 `onInitBottomMenu` 自定义菜单项。

- 添加自定义菜单项：

```typescript
<ConversationList
  onInitBottomMenu={(initItems) => {
    // initItems 是默认的菜单项数组

    // 示例：添加一个"分享"菜单项
    return [
      ...initItems,
      {
        name: 'share',
        isHigh: false,
        icon: 'share',
        onClicked: () => {
          console.log('分享会话');
        },
      },
    ];
  }}
/>
```

- 设置菜单项样式：

例如，将删除按钮设置为红色高亮：

```typescript
<ConversationList
  onInitBottomMenu={(initItems) => {
    return initItems.map(item => {
      if (item.name === 'delete') {
        // 将删除按钮设置为高亮（红色）
        return { ...item, isHigh: true };
      }
      return item;
    });
  }}
/>
```

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/conversation_long_press.png" title="会话长按显示的操作" />
</ImageGallery>

## 设置侧滑菜单

默认组件不支持侧滑菜单，需要通过自定义列表项组件实现。UIKit 提供了 `SlideListItem` 组件来快速实现侧滑效果。

```typescript
type MyConversationListScreenProps = {};
function MyConversationListScreen(props: MyConversationListScreenProps) {
  const {} = props;
  const convRef = React.useRef<ConversationListRef>({} as any);

  return (
    <ConversationList
      propsRef={convRef}
      ListItemRender={() => {
        const { data } = props;
        return (
          <SlideListItem    
            height={100}
            leftExtraWidth={100}
            rightExtraWidth={100}
            data={data}
            key={data.convId}
            containerStyle={{
              backgroundColor: 'orange',
            }}
            onPress={() => {
              console.log('test:zuoyu: onPress');
            }}
            onLongPress={() => {
              console.log('test:zuoyu: onLongPress');
            }}
          >
            <View 
              style={{
                width: Dimensions.get('window').width + 200,
                height: '100%',
                backgroundColor: 'orange',
                flexDirection: 'row',
              }}
            >
              <View
                style={{
                  backgroundColor: 'yellow',
                  height: '100%',
                  width: 100,
                }}
              />
              <View
                style={{
                  backgroundColor: 'blue',
                  height: '100%',
                  width: Dimensions.get('window').width,
                }}
              />
              <View />
            </View>
          </SlideListItem>
        );
      }}
    />
  );
}
```

## 自定义会话条目

如果默认的会话条目样式不满足需求，可以通过 `ListItemRender` 属性完全自定义会话条目组件：

```typescript
import { ConversationListItemProps } from 'react-native-chat-uikit';

// 自定义会话条目组件
function CustomConversationItem(props: ConversationListItemProps) {
  const { data, onClicked, onLongPressed } = props;

  return (
    <TouchableOpacity
      onPress={() => onClicked?.(data)}
      onLongPress={() => onLongPressed?.(data)}
    >
      <View style={{ padding: 16, flexDirection: 'row' }}>
        {/* 自定义布局 */}
        <Image source={{ uri: data.convAvatar }} style={{ width: 40, height: 40 }} />
        <View style={{ marginLeft: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{data.convName}</Text>
          <Text style={{ fontSize: 14, color: '#666' }}>
            {data.lastMessage?.content || '暂无消息'}
          </Text>
        </View>
        {data.unreadMessageCount > 0 && (
          <View style={{ backgroundColor: 'red', borderRadius: 10, padding: 4 }}>
            <Text style={{ color: 'white' }}>{data.unreadMessageCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}  

// 使用自定义会话条目
<ConversationList
  ListItemRender={CustomConversationItem}
/>
```

:::tip
自定义会话条目组件需要实现 `ConversationListItemProps` 接口，包括 `data`、`onClicked`、`onLongPressed` 等属性。
:::

## 使用控制器操作列表

通过 `propsRef` 获取会话列表控制器，可在外部操作列表数据：

```typescript
import { useRef } from 'react';
import { ConversationListRef } from 'react-native-chat-uikit';

function ConversationListScreen() {
  const listRef = useRef<ConversationListRef>(null);

  // 添加会话
  const addConversation = (conv: ConversationModel) => {
    listRef.current?.addItem(conv);
  };

  // 更新会话
  const updateConversation = (conv: ConversationModel) => {
    listRef.current?.updateItem(conv);
  };

  // 删除会话
  const deleteConversation = (convId: string) => {
    listRef.current?.removeItem(convId);
  };

  // 刷新列表
  const refreshList = () => {
    listRef.current?.refresh();
  };

  return (
    <View>
      <ConversationList
        propsRef={listRef}
      />
      <Button title="刷新" onPress={refreshList} />
    </View>
  );
}
```

`ConversationListRef` 方法说明如下表所示：

| 方法    | 描述                |
| ------------------- | -------------------- |
| `addItem`           | 添加会话。       |
| `updateItem`        | 更新会话。<br/> - 支持更新的字段：`unreadMessageCount`、`doNotDisturb`、`ext`。<br/> - `convName` 和 `convAvatar`：通过 `onUsersProvider` 或 `onGroupsProvider` 更新。<br/> - `unreadMessageCount`：可设置为 `0`，其他值无效。<br/> - 如需自定义，可在 `ext` 字段保存数据并重新定义 `ListItemRender`。 |
| `removeItem`        | 删除会话。          |
| `refresh`           | 刷新列表。      |
| `showStatusActions` | 显示个人状态菜单。         |
| `showMoreActions`   | 显示更多操作菜单。      |

:::tip
操作失败时会通过 `ErrorServiceListener.onError` 返回错误信息。
:::

## 自定义事件监听

会话列表组件已内置完整的事件监听机制，能够自动响应各类数据变化并更新 UI。在绝大多数情况下，你无需额外处理事件监听。

如需自定义事件监听，详见 [自定义数据模型文档](chatuikit_custom_data_model.html#自定义事件监听器)。

## 监听会话列表状态

通过 `onStateChanged` 可监听会话列表的加载状态变化：

```typescript
<ConversationList
  onStateChanged={(state) => {
    console.log('列表状态:', state);
    // 状态值: 'loading' | 'empty' | 'error' | 'normal'

    switch (state) {
      case 'loading':
        console.log('正在加载...');
        break;
      case 'empty':
        console.log('列表为空');
        break;
      case 'error':
        console.log('加载失败');
        break;
      case 'normal':
        console.log('加载完成');
        break;
    }
  }}
/>
```

状态说明：

| 状态      | 说明     | 典型场景               |
| :-------- | :------- | :--------------------- |
| `loading` | 加载中   | 首次进入、下拉刷新。     |
| `empty`   | 列表为空 | 新用户、已清空所有会话。 |
| `error`   | 加载失败 | 网络异常、token 失效等。   |
| `normal`  | 正常显示 | 数据加载完成。           |

## 通用属性设置

`ConversationList` 组件继承了一系列通用属性，提供测试、初始化、导航等基础能力配置。

### 测试模式

通过 `testMode` 属性可开启 UI 独立测试模式，适用于 UI 自动化测试和组件样式调试等场景：

```typescript
<ConversationList
  testMode="only-ui"  // 仅 UI 模式，不加载真实数据
/>
```

### 初始化回调

监听列表初始化完成事件，可用于执行后续操作：

```typescript
<ConversationList
  onInitialized={(data) => {
    console.log('会话列表初始化完成', data);
  }}
/>
```

### 返回按钮回调

当标题栏显示返回按钮时，可通过 `onBack` 处理返回事件：

```typescript
<ConversationList
  onBack={(data) => {
    console.log('点击返回按钮');
    navigation.goBack();
  }}
/>
```

### 搜索栏配置

关于搜索栏配置，详见 [搜索栏配置文档](chatuikit_custom_conversation_list_searchbar.html)。

### 标题栏配置

关于标题栏配置，详见 [设置页面标题栏](chatuikit_custom_titlebar.html)。

### FlatList 属性扩展

通过 `flatListProps` 可以透传属性给内部的 `FlatList` 组件，实现列表行为的精细化控制：

```typescript
<ConversationList
  flatListProps={{
    // 任何 FlatList 支持的属性（除了 ref、data、renderItem）
    showsVerticalScrollIndicator: false,
    bounces: false,
    ItemSeparatorComponent: () => <View style={{ height: 1, backgroundColor: '#eee' }} />,
    ListHeaderComponent: <Text>会话列表头部</Text>,
    ListFooterComponent: <Text>会话列表底部</Text>,
  }}
/>
```

### 长按菜单配置

消息长按菜单的相关配置，详见 [会话条目长按菜单](#设置会话条目长按菜单) 介绍。

## 高级属性总览

以下是会话列表高级属性的完整列表：

| 属性   | 类型    | 描述    | 所属 Props 类型    |
| :-------------- | :----- | :------- | :------------- |
| `onSort`                  | `(prev, next) => number`                               | 自定义会话排序规则。 | |
| `onInitNavigationBarMenu` | `(items) => InitMenuItemsType[]`                       | 自定义导航栏菜单项。 | |
| `onInitBottomMenu`        | `(items) => InitMenuItemsType[]`                       | 自定义会话长按菜单。 | `PropsWithMenu` |
| `ListItemRender`          | `ConversationListItemComponentType`                    | 自定义会话条目组件。 | |
| `propsRef`                | `React.MutableRefObject<ConversationListRef>`          | 列表控制器引用。 | |
| `onStateChanged`          | `(state: ListStateType) => void`                       | 列表状态变化回调。  | |
| `testMode`                | `'only-ui' \| undefined`                               | 测试模式。 | `PropsWithTest` |
| `onInitialized`           | `(data?: any) => void`                                 | 初始化完成回调。  | `PropsWithInit` |
| `onBack`                  | `(data?: any) => void`                                 | 返回按钮点击回调。 | `PropsWithBack` |
| `flatListProps`           | `Omit<FlatListProps, 'ref' \| 'data' \| 'renderItem'>` | `FlatList` 组件的其他属性。| `PropsWithFlatList` |

## 完整示例

以下是高级设置的完整示例：

```typescript
import React, { useRef } from 'react';
import { View, Button } from 'react-native';
import { ConversationList, ConversationListRef } from 'react-native-chat-uikit';

function AdvancedConversationListScreen({ navigation }) {
  const listRef = useRef<ConversationListRef>(null);

  return (
    <View style={{ flex: 1 }}>
      <ConversationList
        // 基本设置
        navigationBarVisible={true}
        searchStyleVisible={true}
        filterEmptyConversation={true}

        // 自定义排序
        onSort={(prev, next) => {
          // 置顶优先
          if (prev.data.isPinned && !next.data.isPinned) return -1;
          if (!prev.data.isPinned && next.data.isPinned) return 1;
          // 然后按时间排序
          const prevTime = prev.data.lastMessage?.localTime || 0;
          const nextTime = next.data.lastMessage?.localTime || 0;
          return nextTime - prevTime;
        }}

        // 自定义导航栏菜单
        onInitNavigationBarMenu={(items) => [
          ...items,
          {
            name: 'custom_action',
            isHigh: false,
            icon: 'setting',
            onClicked: () => navigation.navigate('Settings'),
          },
        ]}

        // 自定义底部菜单
        onInitBottomMenu={(items) => [
          ...items.map(item =>
            item.name === 'delete' ? { ...item, isHigh: true } : item
          ),
        ]}

        // 控制器
        propsRef={listRef}

        // 状态监听
        onStateChanged={(state) => {
          console.log('State:', state);
        }}

        // 事件处理
        onClickedItem={(data) => {
          navigation.navigate('Chat', { convId: data.convId });
        }}

        onClickedSearch={() => {
          navigation.navigate('SearchConversation');
        }}

        // FlatList 属性
        flatListProps={{
          showsVerticalScrollIndicator: false,
        }}
      />

      <Button
        title="刷新列表"
        onPress={() => listRef.current?.refresh()}
      />
    </View>
  );
}
```

## 自定义资源

- 关于自定义会话列表页面的图标，详见 [自定义图标文档](chatuikit_custom_icon.html)。
- 关于自定义会话列表页面的文案，详见 [自定义文案文档](chatuikit_custom_text.html)。

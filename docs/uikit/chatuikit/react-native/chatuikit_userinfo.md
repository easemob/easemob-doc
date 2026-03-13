# 用户自定义信息

UIKit 内部通过 `DataProfileProvider` 统一管理用户和群组的基础信息（头像、昵称、备注等），负责数据的缓存与分发。应用层可通过两种方式与 UIKit 的数据管理模块交互：
- 在 `Container`（`UIKitContainer`）中注册回调句柄。
- 直接调用 `ChatService`（`im`）提供的方法。

## 数据模型

```typescript
/** 数据类型：用户或群组 */
type DataModelType = "user" | "group";

type DataModel = {
  /** 用户 ID、群组 ID 或群成员 ID */
  id: string;
  /** 用户名、群组名或群成员名 */
  name?: string;
  /** 头像 URL */
  avatar?: string;
  /** 备注（仅 user 类型） */
  remark?: string;
  /** 数据类型 */
  type: DataModelType;
  /** 如果是群成员，填写所属群组 ID */
  groupId?: string;
};
```

## 用户信息注入方式

UIKIt 提供两种用户信息注入方式，两者可同时使用，相互补充。

| 方式     | 适用场景       | 入口     | 说明 |
| :------ | :--------- | :-------------- | :----------------- |
| **注册回调句柄**（按需拉取） | UIKit 需要渲染某批 ID 的信息时，自动回调应用层拉取 | `Container` 的 `onUsersHandler`/`onGroupsHandler` | 配置简单，UIKit 按需驱动请求，避免全量拉取，适用于头像、昵称等数据随用随取的场景。 |
| **主动推送**（推送写入） | 应用层已获取最新数据，主动写入 UIKit 缓存          | `im.updateDataList()`                             | 当应用在特定时机（如登录完成、群组列表刷新）持有完整数据时主动推送，让组件立即获得最新信息，减少延迟。 |

### 注册回调句柄

在 `Container` 初始化时，通过 `onUsersHandler` 和 `onGroupsHandler` 注册回调。当 UIKit 需要展示某些 ID 的头像/昵称时，会自动调用这两个回调，传入待查询的 ID 集合。应用层从自己的服务端或 SDK 查询后，以相同的 `Map<id, DataModel>` 格式返回结果。

已查询并缓存过的 ID 默认不会重复触发回调（通过 `requestHasData` 控制，默认 `true` 表示有缓存也重新请求）。

#### 示例代码

```tsx
import {
  Container as UIKitContainer,
  DataProfileProvider,
} from "react-native-chat-uikit";

export function App() {
  const im = useChatContext();

  // 用户信息回调：UIKit 需要显示这批用户时，会自动调用
  const onUsersHandler = React.useCallback(
    async (data: Map<string, DataModel>) => {
      if (data.size === 0) return data;
      const userIds = Array.from(data.keys());
      return new Promise<Map<string, DataModel>>((resolve, reject) => {
        im.getUsersInfo({
          userIds,
          onResult: (res) => {
            if (res.isOk && res.value) {
              const users = res.value.map<DataModel>((u) => ({
                id: u.userId,
                type: "user",
                name: u.userName,
                avatar: u.avatarURL,
                remark: u.remark,
              }));
              resolve(DataProfileProvider.toMap(users));
            } else {
              reject(data);
            }
          },
        });
      });
    },
    [im],
  );

  // 群组信息回调：UIKit 需要显示这批群组时自动调用
  const onGroupsHandler = React.useCallback(
    async (data: Map<string, DataModel>) => {
      if (data.size === 0) return data;
      return new Promise<Map<string, DataModel>>((resolve, reject) => {
        im.getJoinedGroups({
          onResult: (res) => {
            if (res.isOk && res.value) {
              const groups = res.value.map<DataModel>((g) => ({
                id: g.groupId,
                type: "group",
                name: g.groupName,
                avatar: g.groupAvatar,
              }));
              resolve(DataProfileProvider.toMap(groups));
            } else {
              reject(data);
            }
          },
        });
      });
    },
    [im],
  );

  return (
    <UIKitContainer
      options={{ appKey: "<your app key>" }}
      onUsersHandler={onUsersHandler}
      onGroupsHandler={onGroupsHandler}
    >
      {/* 其他内容 */}
    </UIKitContainer>
  );
}
```

#### 回调签名

```typescript
// 支持同步或异步
type ProfileHandler =
  | ((data: Map<string, DataModel>) => Map<string, DataModel>)
  | ((data: Map<string, DataModel>) => Promise<Map<string, DataModel>>);
```

- **入参**：`Map<id, DataModel>`，`key` 为待查询的 ID，`value` 为 UIKit 内已有的旧数据（可用于对比或忽略）。
- **返回值**：`Map<id, DataModel>`，`key` 为 ID，`value` 为查询到的最新信息。未查询到的 ID 无需包含在返回结果中。

### 主动推送

当应用层自行获取到用户/群组信息后（例如，登录后批量拉取、列表刷新后），可主动调用 `im.updateDataList()` 将数据写入 UIKit 缓存，并触发相关组件刷新。

```typescript
im.updateDataList(params: {
  dataList: Map<string, DataModel>;
  isUpdateNotExisted?: boolean;   // 缓存中不存在的 ID 是否也写入，默认 false
  disableDispatch?: boolean;       // 是否禁止通知组件刷新，默认 false
  dispatchHandler?: (data: Map<string, DataModel>) => boolean;
                                   // 自定义分发逻辑，返回 false 则阻止内部 dispatch
}): void;
```

#### 仅更新缓存，不触发刷新

```tsx
im.updateDataList({
  dataList: DataProfileProvider.toMap(groups),
  isUpdateNotExisted: true,
  disableDispatch: true, // 不通知 UI，仅写缓存
});
```

#### 更新缓存并自定义通知


当需要同时更新缓存并向特定组件（如群列表）发送事件时，可通过 `dispatchHandler` 拦截默认分发逻辑，实现自定义事件通知。

```tsx
im.updateDataList({
  dataList: DataProfileProvider.toMap(groups),
  isUpdateNotExisted: true,
  dispatchHandler: (data) => {
    // 将更新项转换为群组模型，并通知群列表组件刷新
    const items = Array.from(data.entries()).map(
      ([groupId, d]) =>
        ({
          groupId,
          groupName: d.name,
          groupAvatar: d.avatar,
        }) as GroupModel,
    );
    im.sendUIEvent(UIListenerType.Group, "onUpdatedListEvent", items);
    return false; // 阻止 DataProfileProvider 内部的默认分发  
  },
});
```

#### 典型用法：登录后批量写入群组信息

```tsx
export function App() {
  const im = useChatContext();
  const updatedRef = React.useRef(false);

  const updateGroupData = React.useCallback(() => {
    if (updatedRef.current) return;
    updatedRef.current = true;

    im.getJoinedGroups({
      onResult: (r) => {
        if (r.value) {
          const groups: DataModel[] = r.value.map((g) => ({
            id: g.groupId,
            type: "group",
            name: g.groupName,
            avatar: g.groupAvatar,
          }));
          im.updateDataList({
            dataList: DataProfileProvider.toMap(groups),
            isUpdateNotExisted: true,
          });
        }
      },
    });
  }, [im]);

  React.useEffect(() => {
    const listener = {
      onFinished: (params: { event: string }) => {
        if (params.event === "getAllConversations") {
          // 会话列表加载完成后，批量刷新群信息
          setTimeout(updateGroupData, 500);
        }
      },
    };
    im.addListener(listener);
    return () => im.removeListener(listener);
  }, [im, updateGroupData]);

  return (
    <UIKitContainer options={{ appKey: "<your app key>" }}>
      {/* 其他内容 */}
    </UIKitContainer>
  );
}
```

## 核心 API

以下方法可通过 `im.getDataFileProvider()` 获取 `DataProfileProvider` 实例后直接调用，或通过 `im` 的封装方法间接调用。

| 方法                       | 说明                                                         |
| :------------------------- | :----------------------------------------------------------- |
| `toMap(data: DataModel[])` | 将 `DataModel[]` 转换为 `Map<id, DataModel>`，常用于构造入参 |
| `toArray(data: Map<...>)`  | 将 Map 转换为数组                                            |
| `getDataById(id)`          | 从缓存中查询单个数据                                         |
| `getDataList(list)`        | 批量从缓存中查询，未命中则返回原始数据                       |
| `getUserList(ids)`         | 批量获取用户缓存，未命中则返回 `{id, type:'user'}` 占位      |
| `getGroupList(ids)`        | 批量获取群组缓存，未命中则返回 `{id, type:'group'}` 占位     |
| `updateDataList(params)`   | 写入缓存并可选择触发组件 dispatch                      |
| `requestDataList(params)`  | 调用注册的句柄拉取数据，完成后写入缓存并 dispatch            |
| `clearDataList()`          | 清空缓存（注销时调用）                                       |
| `addObserver(fn)`          | 添加数据变化观察者，返回 `EmitterSubscription`               |
| `removeObserver(sub)`      | 移除观察者                                                   |
| `dispatch(list)`           | 手动触发通知，将变化的 Map 广播给所有观察者                  |

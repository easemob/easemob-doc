# 通讯录

<Toc />

`ContactList` 组件显示和管理联系人列表。默认情况下提供添加联系人、删除联系人、添加联系人备注功能。

联系人按照名称首字母分类排序，如果是中文则使用汉字首字母排序，如果没有昵称则使用用户 ID。

![img](/images/uikit/chatuikit/android/page_contact_list.png =400x850)

默认使用示例如下：

```tsx
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ContactListScreen(props: Props) {
  const { navigation } = props;

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <ContactList
        contactType={"contact-list"}
        onClickedSearch={() => {
          navigation.navigate("SearchContact", {
            params: { searchType: "contact-list" },
          });
        }}
        onClickedItem={(data) => {
          if (data?.userId) {
            navigation.push("ContactInfo", { params: { userId: data.userId } });
          }
        }}
        onClickedGroupList={() => {
          navigation.navigate("GroupList", {
            params: {},
          });
        }}
        onClickedNewRequest={() => {
          navigation.navigate("NewRequests", {
            params: {},
          });
        }}
      />
    </SafeAreaView>
  );
}
```

## 自定义联系人列表

`ContactList` 组件的核心属性如下：

| 属性                  | 类型      | 是否必选 | 描述                                                                   |
| --------------------- | --------- | -------- | ---------------------------------------------------------------------- |
| containerStyle        | object    | 否       | 修改组件样式。                                                         |
| onSort                | function  | 否       | 自定义列表排序策略。                                                   |
| onInitListItemActions | function  | 否       | 自定义联系人列表组件中的单独列表项。默认包括联系人申请列表、群组列表。 |
| groupId               | string    | 否       | 该参数只会用在 `add-group-member` 类型的联系人列表中。                 |
| onClickedNewRequest   | function  | 否       | 点击联系人通知列表的回调。例如，进行路由跳转。                               |
| onClickedGroupList    | function  | 否       | 点击群列表的回调。                                                     |
| ListItemRender        | function  | 否       | 自定义联系人列表项的组件。可以实现修改布局、样式、是否可见等。         |
| ListItemHeaderRender  | function  | 否       | 自定义联系人列表项 header 的组件。可以实现修改布局、样式、是否可见等。 |
| onStateChanged        | function  | 否       | 列表组件状态通知。包括：加载失败、列表为空等。                         |
| propsRef              | reference | 否       | 列表组件的引用对象，可以主动添加、修改、删除会话列表项，注意操作条件。 |
| onForwardMessage      | function  | 否       | 转发的回调通知。例如，进行路由跳转。                                         |
| onChangeRequestCount  | function  | 否       | 新通知数量变更的回调通知。例如，进行路由跳转。                               |
| getFullLetter         | function  | 否       | 获取分类排序的回调通知。例如：返回汉字的全拼音。 例如，进行路由跳转。        |
| indexList             | array     | 否       | 索引头列表。默认为 `ABCDEFGHIJKLMNOPQRSTUVWXYZ#`                        |
| visibleEmptyIndex     | boolean   | 否       | 是否显示空索引分类，默认不显示。                                       |

## 头像和昵称

`ContactList` 组件内部并没有头像和昵称的默认值，需要用户提供。若未提供，则展示默认头像和用户 ID。

可通过以下方式提供头像和昵称：

- 注册回调：使用 `Container` 组件的 `onUsersHandler` 属性实现。
- 主动调用：使用 `ChatService#updateDataList` 方法实现。调用该方法会触发内部事件分发，刷新已加载的组件页面。

:::tip
无论哪种更新方式，都会更新缓存数据，主动更新还会触发 UI 组件刷新。
:::

## 事件通知

事件通知在列表中已经实现，收到对应事件会更新列表。通常情况下，不需要开发者关注。

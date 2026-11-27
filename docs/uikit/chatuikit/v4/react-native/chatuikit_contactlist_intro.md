# 通讯录页面

## 概述

通讯录页面组件 `ContactList` 组件显示和管理好友列表。默认情况下提供添加好友、删除好友、添加好友备注功能。

好友按照名称首字母分类排序，如果是中文则使用汉字首字母排序，如果没有昵称则使用用户 ID。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/rn/custom_contact_list.png" title="通讯录页面 ContactList" />
</ImageGallery>

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

## 通讯录页面的核心属性

`ContactList` 组件的核心属性如下：

| 属性                  | 类型      | 是否必选 | 描述               |
| --------------------- | --------- | -------- | --------------------- |
| containerStyle        | object    | 否       | 修改组件样式。      |
| onSort                | function  | 否       | 自定义列表排序策略。      |
| onInitListItemActions | function  | 否       | 自定义好友列表组件中的单独列表项。默认包括好友申请列表、群组列表。 |
| groupId               | string    | 否       | 该参数只会用在 `add-group-member` 类型的好友列表中。    |
| onClickedNewRequest   | function  | 否       | 点击好友通知列表的回调。例如，进行路由跳转。   |
| onClickedGroupList    | function  | 否       | 点击群列表的回调。   |
| ListItemRender        | function  | 否       | 自定义好友列表项的组件。可以实现修改布局、样式、是否可见等。  |
| ListItemHeaderRender  | function  | 否       | 自定义好友列表项 header 的组件。可以实现修改布局、样式、是否可见等。 |
| onStateChanged        | function  | 否       | 列表组件状态通知。包括：加载失败、列表为空等。     |
| propsRef              | reference | 否       | 列表组件的引用对象，可以主动添加、修改、删除会话列表项，注意操作条件。 |
| onForwardMessage      | function  | 否       | 转发的回调通知。例如，进行路由跳转。                                         |
| onChangeRequestCount  | function  | 否       | 新通知数量变更的回调通知。例如，进行路由跳转。                               |
| getFullLetter         | function  | 否       | 获取分类排序的回调通知。例如：返回汉字的全拼音。 例如，进行路由跳转。        |
| indexList             | array     | 否       | 索引头列表。默认为 `ABCDEFGHIJKLMNOPQRSTUVWXYZ#`。                        |
| visibleEmptyIndex     | boolean   | 否       | 是否显示空索引分类，默认不显示。                                       |

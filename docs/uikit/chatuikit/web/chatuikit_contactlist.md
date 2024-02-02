# 通讯录

<Toc />

`ContactList` 组件用于展示通讯录，包含联系人列表、群组列表和好友请求列表。昵称在中文或者英文的情况下可以实现按首字母分类。

// TODO：添加组件图，研发提供
[](./image2/contactList.png)

## 使用示例

```jsx
import React, { useEffect, useState } from "react";
import { ContactList } from "easemob-chat-uikit";
import "easemob-chat-uikit/style.css";

const Conversation = () => {
  return (
    <div style={{ width: "30%", height: "100%" }}>
      <ContactList />
    </div>
  );
};
```

## 自定义联系人列表

### 自定义联系人列表 Header

例如，将通讯录页面默认标题名称**联系人列表**修改为**自定义 Header**，示例代码如下。

```jsx
import React, { useEffect, useState } from "react";
import { ContactList } from "easemob-chat-uikit";
import "easemob-chat-uikit/style.css";

const Conversation = () => {
  return (
    <div style={{ width: "30%", height: "100%" }}>
      <ContactList header={<div>自定义 Header</div>} />
    </div>
  );
};
```

[](./image2/contact-header.png)

### 在联系人列表中添加黑名单

在联系人列表中添加联系人黑名单，示例代码如下：

```jsx
import React, { useEffect, useState } from "react";
import { ContactList } from "easemob-chat-uikit";
import "easemob-chat-uikit/style.css";

const Conversation = () => {
  return (
    <div style={{ width: "30%", height: "100%" }}>
      <ContactList
        menu={[
          "contacts",
          "groups",
          "requests",
          {
            title: "Block list",
            data: [
              {
                remark: "Nickname",
                userId: "userId",
              },
            ],
          },
        ]}
        onItemClick={(data) => {
          console.log("data", data);
        }}
      />
    </div>
  );
};
```

[](./image2/contact-block.png)

### 设置成可选择的联系人列表

例如，创建群组时需添加多个用户，可点击联系人对应的复选框进行选择。

```jsx
import React, { useEffect, useState } from "react";
import { ContactList } from "easemob-chat-uikit";
import "easemob-chat-uikit/style.css";

const ContactListContainer = () => {
  return (
    <div style={{ width: "30%", height: "100%" }}>
      <ContactList
        onCheckboxChange={handleSelect}
        checkable
        menu={["contacts"]}
        hasMenu={false} // 只有一个菜单项时生效
        header={<></>}
        checkedList={checkedList}
        defaultCheckedList={defaultCheckedUsers || []}
      />
    </div>
  );
};
```

[](./image2/contact-select.png)

## ContactList 属性总览

`ContactList` 组件包含以下属性：

<table>
<tr>
    <td>属性</td>
    <td>类型</td>
    <td>描述</td>
</tr>
  <tr>
    <td style=font-size:10px>
	    className
	  </td>
    <td style=font-size:10px>
	    String
	  </td>
	  <td style=font-size:10px>
	    组件的类名。
	  </td>
  </tr>
	  <tr>
	    <td style=font-size:10px>prefix</td>
      <td style=font-size:10px>String</td>
		  <td style=font-size:10px>CSS 类名的前缀。</td>
	  </tr>
	  <tr>
	    <td style=font-size:10px>style</td>
        <td style=font-size:10px>React.CSSProperties</td>
		<td style=font-size:10px>ContactList 组件的样式。</td>
	  </tr>
	  <tr>
	    <td style=font-size:10px>onItemClick</td>
        <td style=font-size:10px>(info: { id: string; type: 'contact' | 'group' | 'request'; name: string }) => void;</td>
		<td style=font-size:10px>点击每一个 item 的回调。</td>
	  </tr>
	  <tr>
	    <td style=font-size:10px>hasMenu</td>
        <td style=font-size:10px> boolean </td>
		<td style=font-size:10px>是否显示分类的菜单项，默认值 `true`。通讯录中只有一个菜单项时才能设置为 `false`。</td>
	  </tr>
	  <tr>
	    <td style=font-size:10px>checkable</td>
        <td style=font-size:10px>boolean</td>
		<td style=font-size:10px>是否在联系人后面显示复选框。</td>  
	  </tr>
	   <tr>
	    <td style=font-size:10px>onCheckboxChange</td>
        <td style=font-size:10px>(checked: boolean, data: UserInfoData) => void; </td>
		<td style=font-size:10px>点击联系人后面显示复选框的回调。 </td>
	  </tr>
	  <tr>
	    <td style=font-size:10px>header </td>
         <td style=font-size:10px>React.ReactNode; </td>
		<td style=font-size:10px>组件的 Header。</td>
	  </tr>
	  <tr>
	    <td style=font-size:10px>checkedList</td>
        <td style=font-size:10px>{ id: string; type: 'contact' | 'group'; name?: string }[] </td>
		<td style=font-size:10px>checkable 为 true 的情况下，设置已经选中的 item。</td>  
	  </tr>
    <tr>
	    <td style=font-size:10px>defaultCheckedList</td>
        <td style=font-size:10px>{ id: string; type: 'contact' | 'group'; name?: string }[] </td>
		<td style=font-size:10px>checkable 为 true 的情况下，设置默认选中的 item。</td>  
	  </tr>
    <tr>
	    <td style=font-size:10px>menu</td>
        <td style=font-size:10px>(
        | 'contacts'
        | 'groups'
        | 'requests'
        | {
            title: string;
            data: ({ remark?: string; userId: string } | { groupname: string; groupid: string })[];
          }
      )[];</td>
		<td style=font-size:10px>自定义 ContactList 有哪些菜单项。</td>  
	  </tr>
   </tr>
</table>

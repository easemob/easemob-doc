# 通讯录

## 概述

`ContactList` 组件用于展示通讯录，包含好友列表、群组列表和好友请求列表。昵称在中文或者英文的情况下可以实现按首字母分类。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/web/custom_contact_list.png" title="通讯录页面 ContactList" />
</ImageGallery>


## 使用示例

```jsx
import React, { useEffect, useState } from "react";
import { ContactList } from "easemob-chat-uikit";
import "easemob-chat-uikit/style.css";

const ContactList = () => {
  return (
    <div style={{ width: "30%", height: "100%" }}>
      <ContactList />
    </div>
  );
};
```
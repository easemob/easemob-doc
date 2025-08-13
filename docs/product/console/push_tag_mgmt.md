# 标签管理

环信即时推送平台支持用户标签自定义，个性化用户属性，方便企业对客户精细化管理。

[开通即时推送](push_task_create.html#开通服务) 后，选择 **功能配置** > **增值服务** > **即时推送** > **标签管理**，你可以创建标签、绑定或解绑用户、以及删除标签等操作。

![img](/images/console/push_tag_mgmt.png)

## 创建标签

在 **标签管理** 页面，点击 **创建标签** 创建推送标签。每个应用最多支持 100 个标签。

- **标签名称**：最多支持 20 个字符，支持中英文字符。
- **标签描述**：最多支持 100 个字符。

![img](/images/console/push_tag_create.png)

## 绑定用户

在 **标签管理** 页面，点击指定推送标签的 **操作** 栏中的 **用户名绑定**，向该标签添加用户。每个标签的用户数上线为 2 万。若需要增加标签的用户数，请联系商务。

你可以通过以下两种方式绑定用户：

- **手动输入**：最多可输入 100 个用户 ID，每行一个，可多次绑定。
  
![img](/images/console/push_bindtaguser_manual.png)

- **文件上传**：支持 csv 格式，单个文件不能超过 2 MB，文件最多 2 万行（超过 2 万行只读取前 2 万数据），可多次上传。

![img](/images/console/push_bindtaguser_fileupload.png)

## 解绑用户

- 在 **标签管理** 页面，点击指定推送标签的 **操作** 栏中的 **解绑**，解绑单个用户。 

![img](/images/console/push_tag_unbinduser.png)

- 选择多个用户，点击 **解绑所选用户**，批量解绑用户。

![img](/images/console/push_tag_unbinduser_all.png)

## 删除标签

当标签下没有用户时，可删除标签。若标签下有绑定的用户，需要先解绑所有用户，再删除标签。

![img](/images/console/push_tag_delete.png)




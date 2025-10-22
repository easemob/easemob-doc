# 操作保护

## 概述

操作保护指你在环信控制台进行敏感操作时，环信给你提供的保护。

开启操作保护后，你在进行如下敏感操作时，需要首先进行身份认证：
- [修改账号密码](account_security_password_change.html)
- [修改账号绑定的手机号和邮箱](account_security_mobile_email.html)
- [开启和关闭登录保护](account_security_protection_login.html)
- [添加、激活和移除成员](account_sub_create.html)
- [关闭操作保护](account_security_protection_operation.html)

## 操作保护类型

| 操作保护类型       | 描述   |
| :--------- | :----- |
| 开启 MFA 验证       | 进行敏感操作前，输入 MFA 验证码完成认证。  |
| 开启手机验证码认证       | 进行敏感操作前，输入手机号和验证码完成认证。<br/>使用这种保护的前提是你的账号成功绑定了手机号。 |
| 开启邮箱验证码认证     | 进行敏感操作前，输入邮箱和验证码完成认证。<br/>使用这种保护的前提是你的账号已完成了 [邮箱认证](account_register.html#注册账号)。  |

## 开启操作保护

1. 登录 [环信控制台](https://console.easemob.com/user/login)。
2. 鼠标悬停或单击右上角账号管理下拉菜单，选择 **账号信息**。
3. 在左侧导航栏中选择 **安全设置**。
4. 在右侧的 **安全设置** 页面中，在 **账号保护** 一栏中开启操作保护。
   
   ![img](/images/console/account_security_operation_protection_enable.png)

5. 在弹出的对话框中点击 **确定**，完成开启操作保护。
   
   ![img](/images/console/account_security_operation_protection_confirm.png)

## 关闭操作保护

1. 登录 [环信控制台](https://console.easemob.com/user/login)。
2. 鼠标悬停或单击右上角账号管理下拉菜单，选择 **账号信息**。
3. 在左侧导航栏中选择 **安全设置**。
4. 在右侧的 **安全设置** 页面中，在 **账号保护** 一栏中关闭操作保护。
   
   ![img](/images/console/account_security_operation_protection_disable.png)

5. 进行身份验证。
   例如，输入 MFA 验证码。若开启了 MFA 验证，该验证优先级最高。

   ![img](/images/console/account_security_operation_protection_auth.png)

 6. 在弹出的确认关闭操作的对话框中，点击 **确定**。  

    ![img](/images/console/account_security_operation_protection_disable_confirm.png)











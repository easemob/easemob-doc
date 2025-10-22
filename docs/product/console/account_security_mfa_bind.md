# 绑定 MFA 设备

## 概述

MFA（Multi-Factor Authentication）即多重身份验证，是一种通过要求用户提供两种或两种以上不同类型的身份证明来验证其身份的安全技术。MFA 验证比传统的仅凭用户名和密码（单因素验证）更安全，因为它在密码被盗的情况下仍能提供额外的安全层。

目前，环信即时通讯 IM 支持两种 MFA 设备： Google Authenticator 和 Microsoft Authenticator。

:::tip
1. 如用户绑定了多种认证方式，优先级从高到低分别为：MFA 验证、手机+验证码、邮箱+验证码。
2. 如果您需要换 MFA 设备，请参见 [解绑 MFA 设备](account_security_MFA_unbind.html) 进行解绑后，再根据以下步骤绑定新的 MFA 设备。
:::

## MFA 验证前提

通过以下两种方式登录时，可进行二次验证：
- 手机号+密码
- 邮箱+密码

因此，你需要正确绑定手机号或邮箱的至少一种，否则无法进行 MFA 认证。

若通过手机号+验证码登录，则不触发二次验证。

## 绑定步骤 

1. 登录 [环信控制台](https://console.easemob.com/user/login)。
2. 鼠标悬停或单击右上角账号管理下拉菜单，选择 **账号信息**。
3. 在左侧导航栏中选择 **安全设置**。
4. 在右侧的 **安全设置** 页面中，在 **基本设置** 一栏中点击 **绑定**。
5. 进行身份验证。
   你可以通过手机或邮箱进行身份验证。例如，进行手机验证，点击 **获取验证码**，拖动滑块，输入验证码。

   ![img](/images/console/account_security_auth_code.png)

6. 选择 MFA 应用，绑定环信账号。
   
   确保你在手机上已经安装 Google Authenticator 或 Microsoft Authenticator。
   
   例如，在手机上打开 Google Authenticator 应用，扫描右侧二维码。

   ![img](/images/console/account_security_qr_code.png)

7. 输入扫描后的第一组 MFA 动态口令。

   ![img](/images/console/account_security_dynamic_code.png)

8.  设定启用范围，登录保护操作保护。
   - 默认勾选 **登录保护**，即在登录时必须验证 MFA 设备上的 6 位动态安全码。
   - 若你勾选了 **操作保护**，在环信控制台进行敏感操作时必须验证 MFA 设备上的 6 位动态安全码。
  
   ![img](/images/console/account_security_dynamic_code_scope.png)

9.  单击 **提交**，弹出如下界面，完成 MFA 设备绑定。

   注：**如果你要卸载 Authenticator/Microsoft Authenticator 或者更换手机，请记得解绑 MFA 并重新绑定**。

   ![img](/images/console/account_security_bind_success.png)


    
       



   


 











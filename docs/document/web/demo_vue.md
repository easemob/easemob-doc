# 环信即时通讯 IM Vue 3 Demo

环信即时通讯 IM 提供基于 Vue 3 开发的 Web Demo，覆盖单聊、群聊、消息管理、群组管理和联系人管理等常用功能，并集中展示环信 Vue 3 UIKit 的组件能力与配置效果。你可以通过该 Demo 快速体验环信 IM，也可以将其作为 Web 端集成与二次开发的参考。

本文介绍如何在本地运行 Demo、接入自己的环信应用，并完成单聊和群聊消息收发。

## 在线体验

在本地运行 Demo 前，可以先访问 [在线 Demo](https://webim-vue3.easemob.com/login)，体验单聊、群聊和联系人管理等功能，并了解 UIKit 的配置效果。

![在线 Demo 界面](/images/demo/web_vue3_home.png)

## 跑通 Demo

### 前提条件

**1. 检查开发环境**

请准备以下工具：

| 工具 | 要求 |
| --- | --- |
| Node.js | 20.19.0 或以上版本，且满足所安装依赖的版本要求。 |
| pnpm | 10.x，建议使用 Demo `package.json` 中 `packageManager` 指定的版本。 |
| Git | 用于下载 Demo 源码。。 |

执行以下命令，确认 Node.js 和 pnpm 已安装：

```bash
node -v
pnpm -v
```

**2. 创建应用并获取配置**

登录 [环信控制台](https://console.easemob.com)，[注册账号](/product/console/account_register.html#注册账号) 并 [创建应用](/product/console/app_create.html)。然后，在该应用的 **应用概览** 页面获取 App Key、Client ID 和 Client Secret。

App Key 的格式为 `orgName#appName`，例如 `1111222233334444#demo`。

**3. 创建测试用户并获取用户 Token**

在同一应用的 **用户管理** 页面创建两个用户，分别记为用户 A 和用户 B，并记录各自的用户 ID。具体操作详见 [控制台文档](/product/console/operation_user.html#创建用户)。

获取用户 Token 时，先使用应用的 Client ID 和 Client Secret 获取 [App Token](/document/server-side/easemob_app_token.html)，再携带 App Token，根据用户 ID 为用户 A 和用户 B 分别获取 [用户 Token](/document/server-side/easemob_user_token.html)。

获取 Token 的操作应在服务端或受控的本地调试环境中执行。请勿将 Client Secret 或 App Token 写入前端代码。生产环境中，应由应用服务器验证用户身份、获取用户 Token，并分发给对应的客户端。

### 下载并启动 Demo

在终端中依次执行以下命令，下载 [Demo 源码](https://github.com/Easemob-Community/easemob-demo-vue3)、安装依赖并启动开发服务器：

```bash
git clone https://github.com/Easemob-Community/easemob-demo-vue3.git
cd easemob-demo-vue3
pnpm install
pnpm dev
```

启动成功后，使用浏览器打开终端输出的地址，默认为 `http://localhost:5173`。如果端口被占用，Vite 会尝试使用下一个可用端口（例如，端口 5174），以终端实际输出为准。

### 配置并登录

**1. 配置 App Key**

开发模式默认开启 **开发者配置** 面板，并显示用户 ID 和用户 Token 登录表单。

![登录界面与开发者配置面板](/images/demo/web_vue3_login.png)

以下两种配置方式任选其一。两者均有配置时，**开发者配置** 面板中保存的 App Key 优先于环境变量。

- 通过界面配置：在 **开发者配置** 面板的 **AppKey** 输入框中填写自己的应用 App Key，点击 **保存配置**。保存成功后，页面会自动刷新，使配置生效。
- 通过环境变量配置：在 Demo 项目根目录的 `.env.development` 中添加或修改以下配置，然后重启开发服务器。如果已通过 **开发者配置** 面板保存过 App Key，请直接在面板中修改。

```dotenv
VITE_APP_KEY="你的orgName#你的appName"
```

**2. 登录**

1. 在普通浏览器窗口中，确认 App Key 已配置为自己的应用。
2. 在登录表单中分别填写用户 A 的用户 ID 和用户 Token，点击 **立即登录**。
3. 打开浏览器无痕窗口，访问相同的本地地址，确认使用同一应用的 App Key 后，使用用户 B 的用户 ID 和用户 Token 登录。

:::tip
通过 **开发者配置** 面板保存的 App Key 不会在普通窗口和无痕窗口之间共享。若使用此方式配置，请在两个窗口中分别设置相同的 App Key。
:::

登录成功后，会进入 **会话** 页面。使用普通窗口和无痕窗口可以隔离两个用户的登录状态，便于验证消息收发。

![登录后的会话列表](/images/demo/web_vue3_conversation_list.png)

### 收发单聊消息

完成两个用户的登录后，按以下步骤添加好友并验证单聊消息收发：

1. 在用户 A 的窗口中切换到 **通讯录** 页面，点击右上角的 **添加好友** 图标，打开 **添加联系人** 弹窗。
2. 输入用户 B 的用户 ID。如需说明申请原因，可填写 **附言**，然后点击 **确认**，发送好友申请。

   ![添加联系人弹窗](/images/demo/web_vue3_contact_add.png)

3. 在用户 B 的窗口中进入 **通讯录** > **新请求**，通过用户 A 的好友申请。
4. 在用户 A 的 **通讯录** > **好友列表** 中选择用户 B，在联系人详情中点击 **发消息**，进入单聊会话。
5. 在 **消息输入框** 中输入文本，按 Enter 键发送。
6. 在用户 B 的窗口中查看收到的消息，并回复一条消息，确认用户 A 也能收到。

   ![单聊消息发送成功](/images/demo/web_vue3_1v1_chat.png)

:::tip
使用自己的 App Key 时，请按环信用户 ID 添加好友。按手机号添加好友需要 App Server 提供手机号与环信用户 ID 的映射查询服务，不能仅通过更换 App Key 实现。
:::

### 收发群聊消息

完成好友添加后，按以下步骤创建群组并验证群聊消息收发：

1. 在用户 A 的 **通讯录** 页面进入 **群组列表**，点击右上角的 **+** 图标，打开 **创建群组** 弹窗。
2. 在弹窗左侧勾选用户 B，在右侧确认已选成员，然后点击 **完成**。Demo 会按照“群组 + 创建日期时间”的格式自动命名群组，例如 `群组 2026-10-16 10:30:00`。

   ![创建群组弹窗](/images/demo/web_vue3_group_create.png)

3. 在 **群组列表** 中选择新创建的群组，在群组详情中点击 **发消息**，进入群聊会话。

   ![群组详情](/images/demo/web_vue3_group_detail.png.png)

4. 在用户 A 的群聊 **消息输入框** 中输入文本，按 Enter 键发送。
5. 在用户 B 的窗口中打开对应的群聊会话，确认收到消息，并回复一条消息，确认用户 A 也能收到。

   ![群聊消息发送成功](/images/demo/web_vue3_group_chat.png)

## 常见问题

#### 为什么更换 App Key 后无法使用手机号和短信验证码登录？

该登录方式依赖环信官方 Demo 的 App Server 和短信服务，仅适用于官方 Demo 的应用配置。接入自己的应用后，请使用用户 ID 和用户 Token 登录。

如果业务需要手机号验证码登录，应由自己的 App Server 完成验证码校验、业务账号与环信用户的映射，以及用户 Token 获取和分发。接口清单及前端对接说明见 Demo 仓库的 [App Server 接口文档](https://github.com/Easemob-Community/easemob-demo-vue3/blob/main/docs/prod-server-apis.md)。

#### 为什么用户 Token 无法用于登录？

请依次检查：

- 登录表单中填写的是用户 Token，而非 App Token。
- 用户 Token 对应的用户 ID 与登录时填写的用户 ID 一致。
- 用户 ID、Token 和 Demo 使用的 App Key 属于同一应用。
- 用户 Token 未过期，用户未被封禁，复制时未带入多余空格或换行。

若 Token 已过期，请重新获取后登录。不要仅通过 Token 的字符串前缀判断其类型或有效性。

#### 为什么修改环境变量后 App Key 没有变化？

**开发者配置** 面板中保存的 App Key 优先于 `VITE_APP_KEY`。请先检查面板中的值，并通过 **保存配置** 更新；仅使用环境变量时，修改 `.env.development` 后需要重启开发服务器。

#### 启动时提示 5173 端口被占用，应该如何处理？

Vite 默认会尝试使用下一个可用端口，例如 5174。请访问终端实际输出的地址，也可以通过以下命令指定端口：

```bash
pnpm dev --port 5174
```

#### 修改代码或升级依赖后，页面为什么没有更新？

先刷新页面，并确认开发服务器正常运行。如果仍未更新，可停止开发服务器，再执行以下命令，强制 Vite 重新预构建依赖：

```bash
pnpm dev --force
```

#### Client Secret 或 App Token 可以放在前端吗？

不可以。Client Secret 和 App Token 具有应用级权限，仅应在服务端或受控的本地调试环境中使用。生产环境应由 App Server 调用需要管理员权限的接口，并仅向通过身份验证的客户端返回其对应的用户 ID 和用户 Token。

## 参考文档

- [Demo 源码](https://github.com/Easemob-Community/easemob-demo-vue3)
- [App Token 文档](/document/server-side/easemob_app_token.html)
- [用户 Token 文档](/document/server-side/easemob_user_token.html)

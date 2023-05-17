# Windows 常见错误代码

<Toc />

本文主要介绍在调用环信即时通讯 Windows SDK 中的接口过程中，SDK 返回的错误码和错误信息。

你可以根据如下错误码及错误信息了解出错的可能原因，并采取响应措施。

环信即时通讯 Windows SDK 在运行过程中，可能通过如下方式返回错误码和错误信息：

- 调用方法失败时的返回值。
- 通过 `onError` 回调报告错误码。

例如，注册时用户返回已存在的错误可以这样检测：

```csharp
SDKClient.Instance.Login(username, passwd,
    callback: new CallBack(
        onSuccess: () =>
        {
        },
        onError: (code, desc) =>
        {
            //注册失败，回调函数会返回错误码和错误描述
            //如：code为：USER_ALREADY_EXIST(203)
            //desc : User already exist.
        }
    )
);
```

错误码定义如下：

<table>
	<thead>
        <tr>
            <th style="width: 120px;">错误码</th>
            <th>错误信息</th>
            <th>描述</th>
            <th>可能原因</th>
        </tr>
	</thead>
	<tbody>
        <tr>
            <td>0</td>
            <td>EM_NO_ERROR</td>
            <td>操作成功</td>
            <td>提示操作成功。</td>
        </tr>
        <tr>
            <td>1</td>
            <td>GENERAL_ERROR</td>
            <td>默认未区分类型的错误</td>
            <td>提示 SDK 内部未正确初始化，或者请求服务器时未识别出具体原因的错误。</td>
        </tr>
        <tr>
            <td>2</td>
            <td>NETWORK_ERROR</td>
            <td>网络错误</td>
            <td>无网络服务时会回调此错误，表示 SDK 与服务器的连接已断开。</td>
        </tr>
        <tr>
            <td>4</td>
            <td>EXCEED_SERVICE_LIMIT</td>
            <td>超过服务限制</td>
            <td>超过服务版本的数量限制，比如创建的用户 ID 数量超过购买服务的限制时提示该错误。</td>
        </tr>
        <tr>
            <td>5</td>
            <td>SERVICE_ARREARAGES</td>
            <td>服务欠费</td>
            <td>该错误码已废弃。</td>
        </tr>
        <tr>
            <td>100</td>
            <td>INVALID_APP_KEY</td>
            <td>App Key 不合法</td>
            <td>用户的 App Key 格式不正确。</td>
        </tr>
        <tr>
            <td>101</td>
            <td>INVALID_USER_NAME</td>
            <td>用户 ID 不正确</td>
            <td>一般是用户 ID 为空时提示该错误，比如使用邀请好友 <abbr title="" data-original-title="Application Programming Interface">API</abbr> 时 username 参数为空字符。</td>
        </tr>
        <tr>
            <td>102</td>
            <td>INVALID_PASSWORD</td>
            <td>用户密码不正确</td>
            <td>登录时提供的密码为空或不正确。</td>
        </tr>
        <tr>
            <td>103</td>
            <td>INVALID_<abbr title="" data-original-title="Uniform Resource Locator">URL</abbr></td>
            <td><abbr title="" data-original-title="Uniform Resource Locator">URL</abbr> 不正确</td>
            <td>该错误码已废弃。</td>
        </tr>
        <tr>
            <td>104</td>
            <td>INVALID_TOKEN</td>
            <td>用户 token 不正确</td>
            <td>登录时提供的 token 为空或不正确。</td>
        </tr>
        <tr>
            <td>105</td>
            <td>USER_NAME_TOO_LONG</td>
            <td>用户名过长</td>
            <td>用户名长度限制 64 个字节。</td>
        </tr>
        <tr>
            <td>108</td>
            <td>TOKEN_EXPIRED</td>
            <td>声网 token 已过期</td>
            <td>超出声网 token 有效期时间。</td>
        </tr>
        <tr>
            <td>109</td>
            <td>TOKEN_WILL_EXPIRE</td>
            <td>声网 token 即将过期</td>
            <td>超出声网 token 有效期一半时间时会开始回调此错误码。</td>
        </tr>
        <tr>
            <td>200</td>
            <td>USER_ALREADY_LOGIN</td>
            <td>用户已经登录</td>
            <td>同一个用户 ID 已经登录。</td>
        </tr>
        <tr>
            <td>201</td>
            <td>USER_NOT_LOGIN</td>
            <td>用户未登录</td>
            <td>如果未登录成功时发送消息，或者使用群组操作的 API，SDK 会提示该错误。</td>
        </tr>
        <tr>
            <td>202</td>
            <td>USER_AUTHENTICATION_FAILED</td>
            <td>用户鉴权失败</td>
            <td>一般是 token 鉴权失败或者 token 已经过期。</td>
        </tr>
        <tr>
            <td>203</td>
            <td>USER_ALREADY_EXIST</td>
            <td>用户已经存在</td>
            <td>注册用户 ID 时如果该 ID 已经存在会提示该错误。</td>
        </tr>
        <tr>
            <td>204</td>
            <td>USER_NOT_FOUND</td>
            <td>用户不存在</td>
            <td>比如登录或者获取用户会话列表时用户 ID 不存在。</td>
        </tr>
        <tr>
            <td>205</td>
            <td>USER_ILLEGAL_ARGUMENT</td>
            <td>用户参数不正确</td>
            <td>比如创建用户 ID 时不符合格式要求， 或者更新用户属性时用户参数为空等。</td>
        </tr>
        <tr>
            <td>206</td>
            <td>USER_LOGIN_ANOTHER_DEVICE</td>
            <td>用户在其他设备登录</td>
            <td>如果未开启多设备登录，则在其他设备登录会将当前登录的设备踢下线，用户会收到此错误。</td>
        </tr>
        <tr>
            <td>207</td>
            <td>USER_REMOVED</td>
            <td>用户已经被注销</td>
            <td>如果登录用户被从管理后台删除 ID 则会收到此错误。</td>
        </tr>
        <tr>
            <td>208</td>
            <td>USER_REG_FAILED</td>
            <td>用户注册失败</td>
            <td>注册用户 ID 时失败，比如未开启开放注册功能等原因。</td>
        </tr>
        <tr>
            <td>209</td>
            <td>PUSH_UPDATECONFIGS_FAILED</td>
            <td>更新推送配置错误</td>
            <td>用户更新推送昵称，设置免推送配置时失败。</td>
        </tr>
        <tr>
            <td>210</td>
            <td>USER_PERMISSION_DENIED</td>
            <td>用户无权限</td>
            <td>例如如果用户被封禁，发送消息时会提示该错误。</td>
        </tr>
        <tr>
            <td>211</td>
            <td>USER_BINDDEVICETOKEN_FAILED</td>
            <td>用户更新推送 token 错误</td>
            <td>该错误码已废弃。</td>
        </tr>
        <tr>
            <td>212</td>
            <td>USER_UNBIND_DEVICETOKEN_FAILED</td>
            <td>用户更新推送 token 错误</td>
            <td>该错误码已废弃。</td>
        </tr>
        <tr>
            <td>213</td>
            <td>USER_BIND_ANOTHER_DEVICE</td>
            <td>用户已经在另外设备登录</td>
            <td>如果用户设置为先登录的设备优先，则后登录设备登录失败并提示该错误。</td>
        </tr>
        <tr>
            <td>214</td>
            <td>USER_LOGIN_TOO_MANY_DEVICES</td>
            <td>用户登录设备数超过限制</td>
            <td>用户同一 ID 登录设备数量超过限制提示该错误。</td>
        </tr>
        <tr>
            <td>215</td>
            <td>USER_MUTED</td>
            <td>用户在群组聊天室中被禁言</td>
            <td>用户被禁言后发送消息时提示该错误。</td>
        </tr>
        <tr>
            <td>216</td>
            <td>USER_KICKED_BY_CHANGE_PASSWORD</td>
            <td>用户密码更新</td>
            <td>当前登录的用户密码被修改后，当前登录会断开并提示该错误。</td>
        </tr>
        <tr>
            <td>217</td>
            <td>USER_KICKED_BY_OTHER_DEVICE</td>
            <td>用户被踢下线</td>
            <td>开启多设备后，如果用户在其他设备上通过调用 <abbr title="" data-original-title="Application Programming Interface">API</abbr> 或者管理后台将当前设备登录的 ID 强制退出登录，SDK 会提示该错误。</td>
        </tr>
        <tr>
            <td>218</td>
            <td>USER_ALREADY_LOGIN_ANOTHER</td>
            <td>其他用户已登录</td>
            <td>SDK 未退出登录前又被使用不同的账户登录。</td>
        </tr>
        <tr>
            <td>219</td>
            <td>USER_MUTED_BY_ADMIN</td>
            <td>用户被禁言</td>
            <td>用户在当前 app key 被禁言后发送消息时提示该错误。</td>
        </tr>
        <tr>
            <td>220</td>
            <td>USER_DEVICE_CHANGED</td>
            <td>用户登录设备与上次不一致</td>
            <td>用户登录设备与上次登录设备不一致，需要用户重新登录，注意：默认会允许用户登录，踢掉另一个设备上的登录，此 error 在打开不踢掉另外设备上的登录开关后才会生效。</td>
        </tr>
        <tr>
            <td>221</td>
            <td>USER_NOT_FRIEND</td>
            <td>非好友禁止发消息</td>
            <td>开通非好友禁止发消息后，非好友间发消息提示此错误。该功能可在控制台开通。</td>
        </tr>
        <tr>
            <td>300</td>
            <td>SERVER_NOT_REACHABLE</td>
            <td>请求服务失败</td>
            <td>发送或撤回消息时，如果 SDK 与消息服务器未保持连接，会返回该错误；操作群组、好友等请求时，如果因网络连接太差而不成功，也会返回该错误。</td>
        </tr>
        <tr>
            <td>301</td>
            <td>SERVER_TIMEOUT</td>
            <td>请求服务超时</td>
            <td>如果调用 <abbr title="" data-original-title="Application Programming Interface">API</abbr> 在特定时间内服务器未响应则返回该错误，一般是 30 秒或者 60 秒。</td>
        </tr>
        <tr>
            <td>302</td>
            <td>SERVER_BUSY</td>
            <td>服务器忙碌</td>
            <td>服务器当前忙碌会返回该错误，建议稍后再尝试请求。</td>
        </tr>
        <tr>
            <td>303</td>
            <td>SERVER_UNKNOWN_ERROR</td>
            <td>服务请求的通用错误码</td>
            <td>当请求服务器未成功时的默认错误，该错误发生情况较多，需要根据日志进一步排查。</td>
        </tr>
        <tr>
            <td>304</td>
            <td>SERVER_GET_DNSLIST_FAILED</td>
            <td>获取服务器配置信息错误</td>
            <td>SDK 获取当前应用的服务器配置时失败。</td>
        </tr>
        <tr>
            <td>305</td>
            <td>SERVER_SERVICE_RESTRICTED</td>
            <td>当前 app 被禁用</td>
            <td>如果 app 因为某种原因被禁用时会返回该错误。</td>
        </tr>
        <tr>
            <td>400</td>
            <td>FILE_NOT_FOUND</td>
            <td>文件未找到</td>
            <td>当用户获取不到日志文件，或者下载附件失败时提示该错误。</td>
        </tr>
        <tr>
            <td>401</td>
            <td>FILE_INVALID</td>
            <td>文件异常</td>
            <td>当上传消息附件或者群组共享文件时可能会提示该错误。</td>
        </tr>
        <tr>
            <td>402</td>
            <td>FILE_UPLOAD_FAILED</td>
            <td>上传文件错误</td>
            <td>上传消息附件失败时提示该错误。</td>
        </tr>
        <tr>
            <td>403</td>
            <td>FILE_DOWNLOAD_FAILED</td>
            <td>下载文件错误</td>
            <td>下载消息附件失败时提示该错误。</td>
        </tr>
        <tr>
            <td>404</td>
            <td>FILE_DELETE_FAILED</td>
            <td>删除文件错误</td>
            <td>通过 <abbr title="" data-original-title="Application Programming Interface">API</abbr> 获取日志文件时会将旧的日志文件删除，如果删除失败提示该错误。</td>
        </tr>
        <tr>
            <td>405</td>
            <td>FILE_TOO_LARGE</td>
            <td>文件太大</td>
            <td>消息附件或群共享文件超过文件大小限制时提示该错误。</td>
        </tr>
        <tr>
            <td>406</td>
            <td>FILE_CONTENT_IMPROPER</td>
            <td>文件内容不合规</td>
            <td>消息附件或群共享文件内容不合规时提示该错误。</td>
        </tr>
        <tr>
            <td>500</td>
            <td>MESSAGE_INVALID</td>
            <td>消息异常错误</td>
            <td>如果要发送的消息为空，或者消息 ID 为空，或者消息的发送方 ID 与当前登录 ID 不同则会提示该错误。</td>
        </tr>
        <tr>
            <td>501</td>
            <td>MESSAGE_INCLUDE_ILLEGAL_CONTENT</td>
            <td>消息含有非法内容</td>
            <td>如果消息被过滤系统识别为非法消息时返回该错误。</td>
        </tr>
        <tr>
            <td>502</td>
            <td>MESSAGE_SEND_TRAFFIC_LIMIT</td>
            <td>消息限流</td>
            <td>发送消息过快时提示该错误，建议降低频率或者减少消息内容的大小。</td>
        </tr>
        <tr>
            <td>503</td>
            <td>MESSAGE_ENCRYPTION_ERROR</td>
            <td>消息加密错误</td>
            <td>该错误码已废弃。</td>
        </tr>
        <tr>
            <td>504</td>
            <td>MESSAGE_RECALL_TIME_LIMIT</td>
            <td>消息撤回超时错误</td>
            <td>如果超过消息撤回允许的时间尝试撤回时提示该错误。</td>
        </tr>
        <tr>
            <td>505</td>
            <td>SERVICE_NOT_ENABLED</td>
            <td>服务未开启</td>
            <td>尝试使用某些未开通的功能时提示该错误。</td>
        </tr>
        <tr>
            <td>506</td>
            <td>MESSAGE_EXPIRED</td>
            <td>消息已过期</td>
            <td>发送群组回执时如果已经超过时间限制 (默认 3 天) 会提示该错误。</td>
        </tr>
        <tr>
            <td>507</td>
            <td>MESSAGE_ILLEGAL_WHITELIST</td>
            <td>用户未在白名单中</td>
            <td>如果群组聊天室开启全员禁言，且用户未在白名单中发送消息时提示该错误。</td>
        </tr>
        <tr>
            <td>508</td>
            <td>MESSAGE_EXTERNAL_LOGIC_BLOCKED</td>
            <td>消息执行发送前回调，被用户自己的逻辑拦截</td>
            <td>发送的消息被用户自己的服务器定义的规则拦截掉时提示该错误。</td>
        </tr>
        <tr>
            <td>509</td>
            <td>MESSAGE_CURRENT_LIMITING</td>
            <td>单个用户 ID 发送消息超出频率限制。</td>
            <td>默认情况下，SDK 对单个用户 ID 发送群消息未做频率限制。如果你联系了环信商务设置了该限制，一旦在在单聊、群聊或聊天室中单个用户的消息发送频率超过设定的上限，则会提示该错误。</td>
        </tr>
        <tr>
            <td>600</td>
            <td>GROUP_INVALID_ID</td>
            <td>群组 ID 异常</td>
            <td>使用群组相关 API，提供的群组 ID 为空时提示该错误。</td>
        </tr>
        <tr>
            <td>601</td>
            <td>GROUP_ALREADY_JOINED</td>
            <td>已在该群组中</td>
            <td>调用加入群组的 <abbr title="" data-original-title="Application Programming Interface">API</abbr> 时如果已经在该群组中则提示该错误。</td>
        </tr>
        <tr>
            <td>602</td>
            <td>GROUP_NOT_JOINED</td>
            <td>未加入该群组</td>
            <td>尝试在未加入的群组中发送消息或进行群组操作时提示该错误。</td>
        </tr>
        <tr>
            <td>603</td>
            <td>GROUP_PERMISSION_DENIED</td>
            <td>无权限的群组操作</td>
            <td>没有权限进行群组操作，比如群组成员不能设置群组管理员。</td>
        </tr>
        <tr>
            <td>604</td>
            <td>GROUP_MEMBERS_FULL</td>
            <td>群组已满</td>
            <td>群组已经达到人数上限。</td>
        </tr>
        <tr>
            <td>605</td>
            <td>GROUP_NOT_EXIST</td>
            <td>群组不存在</td>
            <td>尝试对不存在的群组进行操作时提示该错误。</td>
        </tr>
        <tr>
            <td>700</td>
            <td>CHATROOM_INVALID_ID</td>
            <td>聊天室 ID 异常</td>
            <td>使用聊天室相关 API，提供的聊天室 ID 为空时提示该错误。</td>
        </tr>
        <tr>
            <td>701</td>
            <td>CHATROOM_ALREADY_JOINED</td>
            <td>已在该聊天室中</td>
            <td>调用加入聊天室的 <abbr title="" data-original-title="Application Programming Interface">API</abbr> 时如果已经在该聊天室中则提示该错误。</td>
        </tr>
        <tr>
            <td>702</td>
            <td>CHATROOM_NOT_JOINED</td>
            <td>未加入该聊天室</td>
            <td>尝试在未加入的聊天室中发送消息或进行聊天室操作时提示该错误。</td>
        </tr>
        <tr>
            <td>703</td>
            <td>CHATROOM_PERMISSION_DENIED</td>
            <td>无权限的聊天室操作</td>
            <td>没有权限进行聊天室操作，比如聊天室成员不能设置聊天室管理员。</td>
        </tr>
        <tr>
            <td>704</td>
            <td>CHATROOM_MEMBERS_FULL</td>
            <td>聊天室已满</td>
            <td>聊天室已经达到人数上限。</td>
        </tr>
        <tr>
            <td>705</td>
            <td>CHATROOM_NOT_EXIST</td>
            <td>聊天室不存在</td>
            <td>尝试对不存在的聊天室进行操作时提示该错误。</td>
        </tr>
        <tr>
            <td>900</td>
            <td>PUSH_NOT_SUPPORT</td>
            <td>第三方推送不支持</td>
            <td>如果用户配置的第三方推送在当前设备上不支持，会提示该错误。</td>
        </tr>
        <tr>
            <td>901</td>
            <td>PUSH_BIND_FAILED</td>
            <td>绑定第三方推送 token 失败</td>
            <td>如果将第三方推送 token 上传到服务器失败时会返回该错误。</td>
        </tr>
        <tr>
            <td>902</td>
            <td>PUSH_UNBIND_FAILED</td>
            <td>解绑第三方推送 token 失败</td>
            <td>如果解绑第三方推送 token 失败会提示该错误。</td>
        </tr>
    </tbody>
</table>

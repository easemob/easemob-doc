# 自定义  

// TODO：单独弄一篇自定义文档，放这些，这里只放个文档链接即可。iOS 也这样调整一下

### 自定义铃声

CallKit 支持发起呼叫时的声音、接收呼叫时的声音以及被挂断时的声音。铃声文件支持 MP3、WAV 等格式，建议铃声时长为 1-20 秒，文件大小不超过 1 MB。// TODO：三种铃声的说法是否准确？

CallKit 支持多种铃声配置方式：

```kotlin
val config = CallKitConfig().apply {
    // 方式 1：使用 assets 文件夹中的文件
    incomingRingFile = "assets://custom_incoming.mp3"
    outgoingRingFile = "assets://custom_outgoing.mp3"
    dingRingFile = "assets://custom_ding.mp3"
    
    // 方式 2 ：使用 res/raw 文件夹中的文件
    // incomingRingFile = "raw://incoming_ring"
    
    // 方式 3 ：使用绝对路径
    // incomingRingFile = "/storage/emulated/0/Download/ringtone.mp3"
}
```

### 通话超时设置

你可以设置用户呼出通话和接听通话超时时间，超时后退出通话。

```kotlin
val config = CallKitConfig().apply {
    // 设置通话超时时间（毫秒）
    callTimeout = 30000L  // 30秒
}
```

### 自定义用户信息

// TODO：图像改为头像？

默认情况下，音视频通话时，对于用户信息，CallKit 会显示默认图像和用户 ID；对于群信息，CallKit 会根据群组 ID 从 SDK 中拉取群信息来对应显示群组名称和群图像。

如果要在一对一通话界面显示自定义用户头像和昵称，群聊通话显示自定义群图像和群名称，你可以通过 `CallInfoProvider` 实现自定义用户信息：

```kotlin
class MyCallInfoProvider : CallInfoProvider {
    
    override fun asyncFetchUsers(
        userIds: List<String>,
        onValueSuccess: OnValueSuccess<List<CallKitUserInfo>>
    ) {
        // 异步获取用户信息
        GlobalScope.launch {
            val userInfos = mutableListOf<CallKitUserInfo>()
            
            userIds.forEach { userId ->
                // 从你的用户系统获取用户信息
                val userInfo = getUserFromApi(userId)
                userInfos.add(
                    CallKitUserInfo().apply {
                        this.userId = userId
                        this.nickName = userInfo.nickname
                        this.avatar = userInfo.avatar
                    }
                )
            }
            
            // 回调用户信息
            onValueSuccess.onSuccess(userInfos)
        }
    }
    
    override fun asyncFetchGroupInfo(
        groupId: String,
        onValueSuccess: OnValueSuccess<CallKitGroupInfo>
    ) {
        // 异步获取群组信息
        GlobalScope.launch {
            val groupInfo = getGroupFromApi(groupId)
            val callKitGroupInfo = CallKitGroupInfo().apply {
                this.groupID = groupId
                this.groupName = groupInfo.name
                this.groupAvatar = groupInfo.avatar
            }
            // 回调群组信息
            onValueSuccess.onSuccess(callKitGroupInfo)
        }
    }
    
    private suspend fun getUserFromApi(userId: String): UserInfo {
        // 实现你的用户信息获取逻辑
        return UserInfo(userId, "昵称", "头像URL")
    }
    
    private suspend fun getGroupFromApi(groupId: String): GroupInfo {
        // 实现你的群组信息获取逻辑
        return GroupInfo(groupId, "群组名称", "群组头像URL")
    }
}

// 设置用户信息提供者
CallKitClient.callInfoProvider = MyCallInfoProvider()
```

### 私有化部署

// TODO：是否需要提及？
如果使用私有化的声网服务，可以在 RTC 引擎创建时进行配置：

```kotlin
private val callKitListener = object : CallKitListener {
    
    override fun onRtcEngineCreated(engine: RtcEngine) {
        // 私有化部署配置
        val configuration = LocalAccessPointConfiguration().apply {
            // 设置你的私有化地址
            ipList = arrayListOf("111.111.111.111")
            verifyDomainName = "ap.xxx.agora.local"
            mode = LOCAL_RPOXY_LOCAL_ONLY
        }
        engine.setLocalAccessPoint(configuration)
    }
    
    // ... 其他回调
}
```
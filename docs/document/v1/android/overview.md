# SDK 集成概述

## SDK 中相关异步/同步处理方法介绍

- 同步方法：SDK 里大部分方法都为同步方法，即这个方法执行完毕，才会走后面的代码。
- 异步方法：带有 callback 以及 API 注释里明确写明异步方法的方法，即不需要等这个方法走完，后边的代码就已经在执行了，通过 callback 得到方法执行的结果。

## 取本地log

以Demo为例，获取本地的log

```
adb pull /sdcard/Android/data/com.hyphenate.chatuidemo/easemob-demo#chatdemoui/core_log/easemob.log
```

其中com.hyphenate.chatuidemo是packagename, easemob-demo#chatdemoui是appkey，需要替换成自己对应的路径。

## 初始化 SDK

**要求在 application 的`oncreate`方法中做初始化**，初始化的时候需要传入设置好的 options。

```
EMOptions options = new EMOptions();
// 默认添加好友时，是不需要验证的，改成需要验证
options.setAcceptInvitationAlways(false);
// 是否自动将消息附件上传到环信服务器，默认为True是使用环信服务器上传下载，如果设为 false，需要开发者自己处理附件消息的上传和下载
options.setAutoTransferMessageAttachments(true);
// 是否自动下载附件类消息的缩略图等，默认为 true 这里和上边这个参数相关联
options.setAutoDownloadThumbnail(true);
...
//初始化
EMClient.getInstance().init(applicationContext, options);
//在做打包混淆时，关闭debug模式，避免消耗不必要的资源
EMClient.getInstance().setDebugMode(true);
```

注：如果你的 APP 中有第三方的服务启动，请在初始化 SDK（`EMClient.getInstance().init(applicationContext, options)`）方法的前面添加以下相关代码（相应代码也可参考 Demo 的 application），使用 EaseUI 库的就不用理会这个。

```
appContext = this;
int pid = android.os.Process.myPid();
String processAppName = getAppName(pid);
// 如果APP启用了远程的service，此application:onCreate会被调用2次
// 为了防止环信SDK被初始化2次，加此判断会保证SDK被初始化1次
// 默认的APP会在以包名为默认的process name下运行，如果查到的process name不是APP的process name就立即返回

if (processAppName == null ||!processAppName.equalsIgnoreCase(appContext.getPackageName())) {
    Log.e(TAG, "enter the service process!");
    
    // 则此application::onCreate 是被service 调用的，直接返回
    return;
}
```

如何获取`processAppName`请参考以下方法。

```
private String getAppName(int pID) {
	String processName = null;
	ActivityManager am = (ActivityManager) this.getSystemService(ACTIVITY_SERVICE);
	List l = am.getRunningAppProcesses();
	Iterator i = l.iterator();
	PackageManager pm = this.getPackageManager();
	while (i.hasNext()) {
		ActivityManager.RunningAppProcessInfo info = (ActivityManager.RunningAppProcessInfo) (i.next());
		try {
			if (info.pid == pID) {
				processName = info.processName;
				return processName;
			}
		} catch (Exception e) {
			// Log.d("Process", "Error>> :"+ e.toString());
		}
	}
	return processName;
}
```

## 注册

注册模式分两种，开放注册和授权注册。只有开放注册时，才可以客户端注册。

- 开放注册是为了测试使用，正式环境中不推荐使用该方式注册环信账号；
- 授权注册的流程应该是您服务器通过环信提供的 REST API 注册，之后保存到您的服务器或返回给客户端。

注册用户名会自动转为小写字母，所以建议用户名均以小写注册。

```
强烈建议开发者通过后台调用 REST 接口去注册环信 ID，客户端注册方法不建议使用。
//注册失败会抛出HyphenateException
EMClient.getInstance().createAccount(username, pwd);//同步方法
```

## 登录

**注意：**

- 除了注册监听，其他的 SDK 操作均需在登陆之后才能进行。

- 登录成功后需要调用`EMClient.getInstance().chatManager().loadAllConversations();`和`EMClient.getInstance().groupManager().loadAllGroups();`。

- 以上两个方法是为了保证进入主页面后本地会话和群组都 load 完毕。

- 另外如果之前登录过，APP 长期在后台再进的时候也可能会导致加载到内存的群组和会话为空，可以在主页面的 oncreate 里也加上这两句代码，当然，更好的办法应该是放在程序的开屏页，可参考 Demo 的 SplashActivity。

```
EMClient.getInstance().login(userName,password,new EMCallBack() {//回调
	@Override
	public void onSuccess() {
		EMClient.getInstance().groupManager().loadAllGroups();
		EMClient.getInstance().chatManager().loadAllConversations();
	        Log.d("main", "登录聊天服务器成功！");		
	}

	@Override
	public void onProgress(int progress, String status) {

	}

	@Override
	public void onError(int code, String message) {
		Log.d("main", "登录聊天服务器失败！");
	}
});
```

## 使用token登录

SDK也支持使用token登录，比如在app的服务器获取token，然后交给应用使用token登录。

**`请注意： 使用token 登录时需要处理token过期的问题，比如在每次登录时更新token 等机制。`**

```
public void loginWithToken(String username, String token, final EMCallBack callback)
```

## 自动登录

即首次登录成功后，不需要再次调用登录方法，在下次 APP 启动时，SDK 会自动为您登录。并且如果您自动登录失败，也可以读取到之前的会话信息（以上情况是在未调用登出的情况下实现的）。

SDK 中自动登录属性默认是 true 打开的，如果不需要自动登录，在初始化 SDK 初始化的时候，调用`options.setAutoLogin(false);`设置为 false 关闭。

自动登录在以下几种情况下会被取消：

- 用户调用了 SDK 的登出动作；
- 用户在别的设备上更改了密码，导致此设备上自动登录失败；
- 用户的账号被从服务器端删除；
- 用户从另一个设备登录，把当前设备上登录的用户踢出。

## 退出登录

同步方法

```
EMClient.getInstance().logout(true);
```

异步方法

```
EMClient.getInstance().logout(true, new EMCallBack() {
            
	@Override
	public void onSuccess() {
	    // TODO Auto-generated method stub
	    
	}
	
	@Override
	public void onProgress(int progress, String status) {
	    // TODO Auto-generated method stub
	    
	}
	
	@Override
	public void onError(int code, String message) {
	    // TODO Auto-generated method stub
	    
	}
});
```

如果集成了FCM等第三方推送，方法里第一个参数需要设为`true`，这样退出的时候会解绑设备token，否则可能会出现退出了，还能收到消息的现象。
有时候可能会碰到网络问题而解绑失败，app处理时可以弹出提示框让用户选择，是否继续退出(弹出框提示继续退出能收到消息的风险)，如果用户选择继续退出，传`false`再调用logout方法退出成功；
当然也可以失败后还是返回退出成功，然后在后台起个线程不断调用logout方法直到成功，这样有个风险是：用户kill了app，然后网络恢复，用户还是会继续收到消息。

还有一个需要注意的是：如果调用异步退出方法，在收到onsucess的回调后才去调用IM相关的方法，比如login

## 用户被封禁后的提示

在[IM管理后台](/document/v1/privatization/uc_configure.html#用户管理)可以对用户进行管理，例如可以在后台封禁用户。 用户被封禁后会提示SDK登录会返回 SERVER_SERVING_DISABLED(305)， 可以根据用户这个返回值来进行相应的提示或者处理。

需要注意的是app整个被禁用时也会返回上述错误码，由于app一般不会被禁用，所以可以用来提示用户被封禁。

## 注册连接状态监听

当掉线时，Android SDK 会自动重连，无需进行任何操作，通过注册连接监听来知道连接状态。

- 在聊天过程中难免会遇到网络问题，在此 SDK 为您提供了网络监听接口，实时监听

- 可以根据 disconnect 返回的 error 判断原因。若服务器返回的参数值为`EMError.USER_LOGIN_ANOTHER_DEVICE`，则认为是有同一个账号异地登录；若服务器返回的参数值为`EMError.USER_REMOVED`，则是账号在后台被删除。

- 被踢下线，被封禁等错误发生后，SDK不会尝试重新连接，之后需要调用`logout`退出登录，之后才能进行重新登录。

```
//注册一个监听连接状态的listener
EMClient.getInstance().addConnectionListener(new MyConnectionListener());

//实现ConnectionListener接口
private class MyConnectionListener implements EMConnectionListener {
    @Override
	public void onConnected() {
	}
	@Override
        public void onDisconnected(int error) {
            EMLog.d("global listener", "onDisconnect" + error);
            if (error == EMError.USER_REMOVED) {
                onUserException(Constant.ACCOUNT_REMOVED);
            } else if (error == EMError.USER_LOGIN_ANOTHER_DEVICE) {
                onUserException(Constant.ACCOUNT_CONFLICT);
            } else if (error == EMError.SERVER_SERVICE_RESTRICTED) {
                onUserException(Constant.ACCOUNT_FORBIDDEN);
            } else if (error == EMError.USER_KICKED_BY_CHANGE_PASSWORD) {
                onUserException(Constant.ACCOUNT_KICKED_BY_CHANGE_PASSWORD);
            } else if (error == EMError.USER_KICKED_BY_OTHER_DEVICE) {
                onUserException(Constant.ACCOUNT_KICKED_BY_OTHER_DEVICE);
            }
        }
}


 /**
     * user met some exception: conflict, removed or forbidden， goto login activity
     */
    protected void onUserException(String exception){
        EMLog.e(TAG, "onUserException: " + exception);
        Intent intent = new Intent(appContext, MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.addFlags(Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
        intent.putExtra(exception, true);
        appContext.startActivity(intent);

        showToast(exception);
    }
```
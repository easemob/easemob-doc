# Push Android SDK 集成

Push Android SDK 支持使用 mavenCentral 自动集成和手动集成。

## 使用 mavenCentral 自动集成

1. 首先在你的项目根目录 `build.gradle` 文件里配置 `mavenCentral`。

```gradle
buildscript {
    repositories {
        jcenter()
        mavenCentral()
    }
    ......
}

allprojects {
    repositories {
        jcenter()
        mavenCentral()
    }
}
```

1. 在你的 module 的 `build.gradle` 中添加依赖。

```gradle
dependencies {
......

implementation 'io.hyphenate:hyphenate-push:1.0.0'
}
```

## 手动集成

1. [下载 push sdk 压缩包](https://download-sdk.oss-cn-beijing.aliyuncs.com/downloads/android-push-sdk-1.0.0.zip)。
2. 解压之后将，将 jar 包和 so 文件放入项目里。

### 配置APPKEY

需在AndroidManifest.xml里配置AppKey

```
<!-- 设置环信应用的AppKey -->
<meta-data android:name="EASEMOB_APPKEY"  android:value="org#app" /> //org#app替换为申请的AppKey
```

### 初始化

```java
EMPushClientOptions options = new EMPushClientOptions();
//启用厂商推送，参考 IM 文档集成厂商推送。启用推送 API 如下：
EMPushConfig.Builder builder = new EMPushConfig.Builder(context);
builder.enableFCM(senderId);
builder.enableHWPush();
builder.enableMiPush(appId, appKey);
builder.enableMeiZuPush(appId, appKey);
builder.enableOppoPush(appKey, appSecret);
builder.enableVivoPush();
options.setEMPushConfig(builder.build());

EMPushClient.getInstance().init(this, options);
```

### 注册、登录和注销用户

注册模式分两种，开放注册和授权注册。只有开放注册时，才可以客户端注册。

强烈建议开发者通过后台调用 REST 接口注册环信用户 ID，不建议使用客户端注册。

1. 注册用户。

```java
//注册失败会抛出 HyphenateException。
EMPushClient.getInstance().registerWithUsername(username, pwd);//同步方法，需在子线程里执行
```

1. 注册连接状态监听。

```java
EMPushClient.getInstance().addConnectionListener{
    @Override
    public void onConnected() {

    }

    @Override
    public void onDisconnected(int error) {

    }
}
```

1. 登录连接服务器

```java
EMPushClient.getInstance().connectWithUsername(username, password, new EMCallBack(){});
```

1. 注销登录

```java
EMPushClient.getInstance().disconnect(true, new EMCallBack(){});
```

## 点击事件上报

厂商推送的点击事件上报，需要在 App 端调用 API 上报实现统计。

```java
//taskId 与 provider 需从推送数据里获取，如果获取 taskId 失败则传空字符串
EMPushClient.getInstance().reportPushAction(taskId, provider, action, new EMCallBack(){});
```

以小米推送为例，在厂商的点击回调里去解析上报点击事件。

```java
public void onNotificationMessageClicked(Context context, MiPushMessage message) {

    String content = message.getContent();
    try {
    	// JSON 结构为 {"EPush":{"provider":{"xxx"},"report":{"task_id":"xxx"}}}
        JSONObject json = new JSONObject(content);
        JSONObject pushJson = json.optJSONObject("EPush");
        String taskId = "";
        if(pushJson != null){
            String provider = pushJson.optString("provider");
            JSONObject reportJson = pushJson.optJSONObject("report");
            if(reportJson != null){
                taskId = reportJson.optString("task_id");
            }

            EMPushClient.getInstance().reportPushAction(taskId, provider, EMPushManager.EMPushAction.CLICK, new EMCallBack() {});
        }
    } catch (JSONException e) {
        e.printStackTrace();
    }
}
```
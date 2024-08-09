# 在即时通讯 IM 中集成小米推送

环信即时通讯 IM SDK 中已集成小米推送相关逻辑，你还需要完成以下步骤。

## 小米推送集成

环信即时通讯 IM SDK 中已经集成了小米推送（基于 ` MiPush_SDK_Client_6_0_1-C_3rd.aar`）相关逻辑，你还需要完成以下步骤：

### **步骤一 在小米开放平台创建应用**

在 [小米开放平台](https://dev.mi.com/platform) 创建应用，开启推送服务。详见小米官方网站的 [推送服务接入指南](https://dev.mi.com/console/doc/detail?pId=68)。

### **步骤二 上传推送证书**

在[环信即时通讯云控制台](https://console.easemob.com/user/login)上传推送证书：

1. 在[环信即时通讯云控制台](https://console.easemob.com/user/login)首页的**应用列表**中，点击目标应用的**操作**栏中的**管理**。
   
2. 在左侧导航栏中，选择**即时通讯** > **功能配置** > **消息推送** > **证书管理**，点击**添加推送证书**。
   
3. 在**添加推送证书**对话框中选择**小米**页签，配置小米推送参数。参数相关信息，详见你在 [小米开放平台](https://dev.mi.com/platform) 创建的应用信息中的 App ID 和 Secret Key 以及程序的包名。
   
![image](/images/android/push/add_xiaomi_push_certificate.png) 

| 参数       | 类型   | 是否必需 | 描述         |
| :--------- | :----- | :------- | :---------------- |
| `证书名称`     | String | 是     | 填写小米 App ID。  |
| `推送密钥`     | String | 是     | 填写小米 App Secret。|
| `应用包名`     | String | 是     | 填写小米 App package name。   |
| `Channel ID`  | String | 是     | 填写 Channel ID。             |
| `Action`      | String | 否     | 选择点击通知后的动作。            |

### **步骤三 集成小米推送 SDK**

1. 下载 [小米推送 SDK](https://admin.xmpush.xiaomi.com/zh_CN/mipush/downpage) ，将 `aar` 包添加到项目中。

2. 配置 `AndroidManifest.xml`，详见 [官方文档](https://dev.mi.com/console/doc/detail?pId=41#_0_0)。

   - 推送服务需要的权限列表：

   ```xml
   <!--注：若使用小米推送 SDK 3.6.12 版本，需要添加以下权限-->
   <!-- <uses-permission android:name="android.permission.GET_TASKS"/>-->  
   
   <!--注：以下三个权限在小米推送 SDK 4.8.0 及以上版本不再依赖-->
   <!-- <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />-->
   <!-- <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />-->
   <!-- <uses-permission android:name="android.permission.READ_PHONE_STATE" />-->

   <uses-permission android:name="android.permission.INTERNET" />
   <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
   <uses-permission android:name="android.permission.VIBRATE"/>
   <permission android:name="com.xiaomi.mipushdemo.permission.MIPUSH_RECEIVE"
   android:protectionLevel="signature" /> <!--这里 `com.xiaomi.mipushdemo` 改成 app 的包名-->
   <uses-permission android:name="com.xiaomi.mipushdemo.permission.MIPUSH_RECEIVE" /><!--这里 `com.xiaomi.mipushdemo` 改成 app 的包名-->
   ```

   - 推送服务需要配置的 service 和 receiver：

   ```xml
   <service
       android:name="com.xiaomi.push.service.XMPushService"
       android:enabled="true"
       android:process=":pushservice" />

   <!--注：此 service 必须在小米推送 SDK 3.0.1 版本以后（包括小米推送 SDK 3.0.1 版本）加入-->
   <service
       android:name="com.xiaomi.push.service.XMJobService"
       android:enabled="true"
       android:exported="false"
       android:permission="android.permission.BIND_JOB_SERVICE"
       android:process=":pushservice" />

   <!--注：com.xiaomi.xmsf.permission.MIPUSH_RECEIVE 这里的包名不能改为 app 的包名-->
   <service
       android:name="com.xiaomi.mipush.sdk.PushMessageHandler"
       android:enabled="true"
       android:exported="true"
       android:permission="com.xiaomi.xmsf.permission.MIPUSH_RECEIVE" />

   <!--注：此 service 必须在小米推送 SDK 2.2.5 版本以后（包括小米推送 SDK 2.2.5 版本）加入-->
   <service
       android:name="com.xiaomi.mipush.sdk.MessageHandleService"
       android:enabled="true" />

   <receiver
       android:name="com.xiaomi.push.service.receivers.NetworkStatusReceiver"
       android:exported="true">
       <intent-filter>
           <action android:name="android.net.conn.CONNECTIVITY_CHANGE" />
           <category android:name="android.intent.category.DEFAULT" />
       </intent-filter>
   </receiver>

   <receiver
       android:name="com.xiaomi.push.service.receivers.PingReceiver"
       android:exported="false"
       android:process=":pushservice">
       <intent-filter>
           <action android:name="com.xiaomi.push.PING_TIMER" />
       </intent-filter>
   </receiver>
   ```

3. 自定义一个继承自环信即时通讯 IM SDK 中 `EMMiMsgReceiver` 类的 `BroadcastReceiver`，并进行注册：

   ```xml
   <receiver android:name=".common.receiver.MiMsgReceiver">
       <intent-filter>
           <action android:name="com.xiaomi.mipush.RECEIVE_MESSAGE" />
       </intent-filter>
       <intent-filter>
           <action android:name="com.xiaomi.mipush.MESSAGE_ARRIVED" />
       </intent-filter>
       <intent-filter>
           <action android:name="com.xiaomi.mipush.ERROR" />
       </intent-filter>
   </receiver>
   ```

4. 在即时通讯 IM SDK 初始化的时候，配置启用小米推送。

   ```java
   EMOptions options = new EMOptions();
   ...
   EMPushConfig.Builder builder = new EMPushConfig.Builder(this);
   builder.enableMiPush(String appId, String appKey);
   // 将 pushconfig 设置为 ChatOptions
   options.setPushConfig(builder.build());
   // 初始化 IM SDK
   EMClient.getInstance().init(this, options);
   ```
# 在即时通讯 IM 中集成魅族推送

环信即时通讯 IM SDK 中已集成魅族推送相关逻辑，你还需要完成以下步骤。

## **步骤一 在魅族开发者后台创建应用**

在魅族开发者后台创建应用，开启推送服务，并上传对应的证书指纹。详见魅族官方介绍：[Flyme 推送服务集成](https://open.flyme.cn/docs?id=129)。

## **步骤二 上传推送证书**

在[环信控制台](https://console.easemob.com/user/login)上传魅族推送证书。

1. 登录 [环信控制台](https://console.easemob.com/user/login)，选择你的应用 > **功能配置** > **增值功能** > **即时推送**。
   
2. 在 **证书管理** 页面，点击 **添加推送证书**。在 **添加推送证书** 对话框中选择 **魅族** 页签，配置魅族推送参数。参数相关信息，详见你在 [flyme 推送平台](https://login.flyme.cn/sso?appuri=https%3A%2F%2Fapiopen.flyme.cn%2Flogin&useruri=https%3A%2F%2Fopen.flyme.cn%3Ft%3D1722914343470&sid=node0mpa52w0llp341dncyz6wr7yi56208487&service=open&autodirct=true)创建的应用的 `APP ID` 和 `APP SECRET` 以及程序的 `包名`。

![img](/images/console/push_certificate_meizu.png)

| 参数       | 类型   | 是否必需 | 描述         |
| :--------- | :----- | :------- | :---------------- |
| 证书名称     | String | 是     | 魅族 App ID。  |
| 推送密钥    | String | 是     | 魅族 App Secret。|
| 应用包名     | String | 是     | 魅族 App package name。   |
| Activity| String | 否     | 点击通知后的动作。该参数仅对离线推送有效。  |
| 推送送达回执     | String |  否    | 是否开启推送送达回执。<br/> - 开发者需要在 Flyme 推送平台新建回执后，才能开启推送送达回执，获取到魅族推送通道送达到设备的推送数据。<br/> - 该参数仅对离线推送有效。 |

## **步骤三 集成魅族推送 SDK** 

1. 配置魅族推送远程依赖包。
   
   在 `app level/build.gradle` 中添加依赖。

   ```gradle
   dependencies{
       // 从 PushSDK4.1.0 开始 其已发布⾄ mavenCentral
       implementation 'com.meizu.flyme.internet:push-internal:4.3.0'
   }
   ```

2. 配置 `AndroidManifest.xml`。

   - 推送服务需要的权限列表：

   ```xml
   <!-- 魅族推送配置 start-->
   <!-- 兼容 flyme5.0 以下版本，魅族内部集成 pushSDK 必填，不然无法收到消息-->
   <uses-permission android:name="com.meizu.flyme.push.permission.RECEIVE" />
   <permission
       android:name="${applicationId}.push.permission.MESSAGE"
       android:protectionLevel="signature" />
   <uses-permission android:name="${applicationId}.push.permission.MESSAGE" />
   <!-- 兼容 flyme3.0 配置权限-->
   <uses-permission android:name="com.meizu.c2dm.permission.RECEIVE" />
   <permission
       android:name="${applicationId}.permission.C2D_MESSAGE"
       android:protectionLevel="signature" />
   <uses-permission android:name="${applicationId}.permission.C2D_MESSAGE" />
   <!-- 魅族推送配置 end-->
   ```

   - 推送服务需要的 `receiver`：

   ```xml
   <!-- MEIZU 推送配置 start -->
   <receiver android:name="com.hyphenate.push.platform.meizu.EMMzMsgReceiver">
       <intent-filter>
           <!-- 接收 push 消息 -->
           <action android:name="com.meizu.flyme.push.intent.MESSAGE"
               />
           <!-- 接收 register 消息 -->
           <action
               android:name="com.meizu.flyme.push.intent.REGISTER.FEEDBACK" />
           <!-- 接收 unregister 消息-->
           <action
               android:name="com.meizu.flyme.push.intent.UNREGISTER.FEEDBACK"/>
           <!-- 兼容低版本 Flyme3 推送服务配置 -->
           <action android:name="com.meizu.c2dm.intent.REGISTRATION"
               />
           <action android:name="com.meizu.c2dm.intent.RECEIVE" />
           <category android:name="${applicationId}"></category>
       </intent-filter>
   </receiver>
   <!-- MEIZU 推送配置 end -->
   ```

3. 在即时通讯 IM SDK 初始化时，配置启用魅族推送。

   ```java
   EMOptions options = new EMOptions();
   ...
   EMPushConfig.Builder builder = new EMPushConfig.Builder(this);
   builder.enableMeiZuPush(String appId,String appKey);
   // 将 pushconfig 设置为 ChatOptions
   options.setPushConfig(builder.build());
   // 初始化 IM SDK
   EMClient.getInstance().init(this, options);
   ```




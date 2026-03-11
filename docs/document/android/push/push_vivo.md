# 在即时通讯 IM 中集成 VIVO 推送

环信即时通讯 IM SDK 中已经集成了 VIVO 推送（基于 `vivo_push_v4.0.4.0_504.aar`）相关逻辑，你还需要完成以下步骤。

## **步骤一 在 VIVO 开发者后台创建应用**

在 [VIVO 开发者后台](https://id.vivo.com.cn/?callback=https://dev.vivo.com.cn#/user/login)创建应用，开启推送服务，并上传对应的证书指纹。

详见 VIVO 官方介绍：[VIVO 推送服务集成](https://dev.vivo.com.cn/documentCenter/doc/281)。

## **步骤二 上传推送证书**

在 [环信控制台](https://console.easemob.com/user/login) 上传推送证书：

1. 登录 [环信控制台](https://console.easemob.com/user/login)，选择你的应用 > **功能配置** > **增值功能** > **即时推送**。
   
2. 在 **证书管理** 页面，点击 **添加推送证书**。在 **添加推送证书** 对话框中选择 **VIVO** 页签，配置 VIVO 推送参数。参数相关信息，详见你在 [VIVO 开发者后台](https://vpush.vivo.com.cn/#/appdetail) 创建的应用的 `APP ID`，`APP KEY` 和 `APP SECRET` 以及程序的 `包名`。

![img](/images/console/push_certificate_vivo.png)

| 参数       | 类型   | 是否必需 | 描述         |
| :--------- | :----- | :------- | :---------------- |
| 证书名称     | String | 是     | VIVO App ID。  |
| 证书标识     | String | 是     | VIVO App Key。|
| 推送密钥     | String | 是     | VIVO App Secret。|
| Category     | String |  否    | Category 类型。关于该参数，详见 [VIVO 推送文档](https://dev.vivo.com.cn/documentCenter/doc/359#w2-67805227)。该参数仅对离线推送有效。                      |
| 应用包名     | String | 是     | VIVO App package name。该参数仅对离线推送有效。   |
| Activity| String | 否     | 点击通知后的动作。 该参数仅对离线推送有效。 |
| 推送类型     | String |  否    |可选择 **运营消息** 或 **系统消息**。该参数仅对离线推送有效。 |

## **步骤三 集成 VIVO 推送 SDK**

1. 配置 VIVO 推送 `jar` 包：
 
在 VIVO 推送官网下载推送 SDK 包，将 `jar` 包放到 libs 目录下并 sync 。

此外，也可以直接使用环信 Android IM Demo 中集成的 VIVO 推送的 `jar` 包。

2. 配置 `AndroidManifest.xml` 。

   推送服务需要的 `service` 和 `receiver`，并且需要配置 VIVO 的 `app_id` 和 `app_key`：

   ```xml
   <!-- VIVO 推送配置 start -->
   <service
       android:name="com.vivo.push.sdk.service.CommandClientService"
       android:permission="com.push.permission.UPSTAGESERVICE"
       android:exported="true" />
   <receiver android:name="com.hyphenate.push.platform.vivo.EMVivoMsgReceiver" >
       <intent-filter>
           <!-- 接收推送消息 -->
           <action android:name="com.vivo.pushclient.action.RECEIVE" />
       </intent-filter>
   </receiver>
   <meta-data
       android:name="com.vivo.push.api_key"
       android:value="开发者自己申请的 appKey" />
   <meta-data
       android:name="com.vivo.push.app_id"
       android:value="开发者自己申请的 appId" />

   
   <!-- VIVO 推送配置 end -->
   ```

3. 在即时通讯 IM SDK 初始化的时，配置启用 VIVO 推送。

   ```java
   EMOptions options = new EMOptions();
   ...
   EMPushConfig.Builder builder = new EMPushConfig.Builder(this);
   // 需设置 agreePrivacyStatement boolean类型参数，明确是否同意隐私声明：
   // true：若用户未同意隐私声明，而这里设为 `true`，可能存在合规风险，需业务自己承担合规风险。
   // false：不同意隐私声明, 会影响推送功能
   // 如使用环信自动登录功能 agreePrivacyStatement 需由客户自行本地记录用户授权行为
   builder.enableVivoPush(agreePrivacyStatement);
   // 将 pushconfig 设置为 ChatOptions
   options.setPushConfig(builder.build());
   // 初始化 IM SDK
   EMClient.getInstance().init(this, options);
   ```

4. VIVO 设备安装应用后默认没有打开允许通知权限，测试前请先在设置中打开该应用的允许通知权限。

# 在即时通讯 IM 中集成华为 HMS 推送

环信即时通讯 IM SDK 中已集成华为 HMS 推送相关逻辑，你还需要完成以下步骤。

## 步骤一 在华为开发者后台创建应用

在[华为开发者后台](https://id1.cloud.huawei.com/CAS/portal/loginAuth.html)创建应用，开启推送服务，并上传对应的证书指纹。

详见华为官方介绍：[华为 HMS 消息推送服务集成](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/android-config-agc-0000001050170137#section19884105518498)。

## 步骤二 上传推送证书

1. 登录 [环信控制台](https://console.easemob.com/user/login)，在 **应用管理** 页面点击测试版或正式版的应用的 App Key。
   
2. 选择 **增值功能** > **消息推送**。
   
3. 在 **证书管理** 页面，点击 **添加推送证书**。在 **添加推送证书** 对话框中选择 **华为** 页签，配置华为推送参数。参数相关信息，详见你在华为开发者后台创建的 [应用信息中的 App ID 和 SecretKey 以及程序的包名](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/android-config-agc-0000001050170137#section125831926193110)。

![image](/images/android/push/add_huawei_push_certificate.png)

| 参数       | 类型   | 是否必需 | 描述         |
| :--------- | :----- | :------- | :---------------- |
| 证书名称     | String | 是     | 华为 Client ID。  |
| 推送密钥    | String | 是     | 华为 Client Secret。|
| 应用包名     | String | 是     | 华为 App package name。   |
| 项目 ID      | String | 否     | 项目 ID。                     |
| Category    | String |  否    | 自动分类权益申请 Category。该参数仅对离线推送有效。       |
| Action       | String |  否    | 点击通知后的动作。组件定义的 intent-filter action name。该参数仅对离线推送有效。   |
| ActivityClass | String | 否     | 角标显示，应用入口类路径。示例：com.easemob.MainActivity。该参数仅对离线推送有效。 |

## 步骤三 集成华为推送 SDK

1. 集成 HMS Core SDK，参见 [华为官网集成文档](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/android-integrating-sdk-0000001050040084)。

2. 注册继承自 `HmsMessageService` 的服务到 `AndroidManifest.xml` 中。

   ```xml
   <!--华为 HMS Config-->
   <service android:name=".service.HMSPushService"
       android:exported="false">
       <intent-filter>
           <action android:name="com.huawei.push.action.MESSAGING_EVENT" />
       </intent-filter>
   </service>
   <!-- huawei push end -->
   ```

3. [获取华为推送 Token 并上传](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/android-client-dev-0000001050042041)。

完成环信 IM SDK 的初始化与登录后，你需要获取华为推送的 token，并将其上传至环信服务器，从而与当前 IM 登录账号进行绑定。

**获取 Token 的注意事项**

在调用华为 `getToken` 接口前，请了解以下行为特征：

1. **服务开通前提**：`getToken` 接口仅在 AppGallery Connect 平台已开通推送服务后才能成功返回 token。
2. **EMUI 10.0 及以上版本**：`getToken` 接口会直接返回 token。若本次调用失败，Push 服务会缓存申请并自动重试，成功后通过 `onNewToken` 接口返回。
3. **低于 EMUI 10.0 版本**：若 `getToken` 接口返回为空，在确保 Push 服务已开通的情况下，结果会后续通过 `onNewToken` 接口返回。
4. **Token 刷新**：当服务端识别到 token 过期并刷新后，新 token 会通过 `onNewToken` 接口返回。

**示例代码**

以下示例代码演示了如何判断华为推送的可用性，并在子线程中获取 token 后上传至环信服务器。

```java
    public void getHMSToken(Activity activity){
        // 判断是否启用 FCM 推送
        if (EMClient.getInstance().isFCMAvailable()) {
            return;
        }
        try {
            if(Class.forName("com.huawei.hms.api.HuaweiApiClient") != null){
                Class<?> classType = Class.forName("android.os.SystemProperties");
                Method getMethod = classType.getDeclaredMethod("get", new Class<?>[] {String.class});
                String buildVersion = (String)getMethod.invoke(classType, new Object[]{"ro.build.version.emui"});
                //在某些手机上，invoke 方法不报错
                if(!TextUtils.isEmpty(buildVersion)){
                    EMLog.d("HWHMSPush", "huawei hms push is available!");
                    new Thread() {
                        @Override
                        public void run() {
                            try {
                                // read from agconnect-services.json
                               // String appId = AGConnectServicesConfig.fromContext(activity).getString("client/app_id");
                                String appId = new AGConnectOptionsBuilder().build(activity).getString("client/app_id");
                                EMLog.e("AGConnectOptionsBuilder","appId:"+appId);
                                // 申请华为推送 token
                                String token = HmsInstanceId.getInstance(activity).getToken(appId, "HCM");
                                EMLog.d("HWHMSPush", "get huawei hms push token:" + token);
                                if(token != null && !token.equals("")){
                                    //没有失败回调，假定 token 失败时 token 为 null
                                    EMLog.d("HWHMSPush", "register huawei hms push token success token:" + token);
                                    // 上传华为推送 token
                                    EMClient.getInstance().sendHMSPushTokenToServer(token);
                                }else{
                                    EMLog.e("HWHMSPush", "register huawei hms push token fail!");
                                }
                            } catch (ApiException e) {
                                EMLog.e("HWHMSPush","get huawei hms push token failed, " + e);
                            }
                        }
                    }.start();
                }else{
                    EMLog.d("HWHMSPush", "huawei hms push is unavailable!");
                }
            }else{
                EMLog.d("HWHMSPush", "no huawei hms push sdk or mobile is not a huawei phone");
            }
        } catch (Exception e) {
            EMLog.d("HWHMSPush", "no huawei hms push sdk or mobile is not a huawei phone");
        }
    }
```

4. 在即时通讯 IM SDK 初始化时，配置启用华为推送。

   ```java
   EMOptions options = new EMOptions();
   ...
   EMPushConfig.Builder builder = new EMPushConfig.Builder(this);
   builder.enableHWPush();
   // 将 pushconfig 设置为 ChatOptions
   options.setPushConfig(builder.build());
   // 初始化 IM SDK
   EMClient.getInstance().init(this, options);
   ```
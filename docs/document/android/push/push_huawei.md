# 在即时通讯 IM 中集成华为 HMS 推送

环信即时通讯 IM SDK 中已集成华为 HMS 推送相关逻辑，你还需要完成以下步骤。

## **步骤一 在华为开发者后台创建应用**

在[华为开发者后台](https://id1.cloud.huawei.com/CAS/portal/loginAuth.html)创建应用，开启推送服务，并上传对应的证书指纹。

详见华为官方介绍：[华为 HMS 消息推送服务集成](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/android-config-agc-0000001050170137#section19884105518498)。

## **步骤二 在环信即时通讯云控制台上传推送证书**

在[环信即时通讯云控制台](https://console.easemob.com/user/login)上传华为推送证书。

1. 在[环信即时通讯云控制台](https://console.easemob.com/user/login)首页的**应用列表**中，点击目标应用的**操作**栏中的**管理**。
   
2. 在左侧导航栏中，选择**即时通讯** > **功能配置** > **消息推送** > **证书管理**，点击**添加推送证书**。
   
3. 在**添加推送证书**对话框中选择**华为**页签，配置华为推送参数。参数相关信息，详见你在华为开发者后台创建的[应用信息中的 App ID 和 SecretKey 以及程序的包名](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/android-config-agc-0000001050170137#section125831926193110)。

![image](/images/android/push/add_huawei_push_certificate.png)

| 参数       | 类型   | 是否必需 | 描述         |
| :--------- | :----- | :------- | :---------------- |
| `证书名称`     | String | 是     | 填写华为 Client ID。  |
| `推送密钥`     | String | 是     | 填写华为 Client Secret。|
| `应用包名`     | String | 是     | 填写华为 App package name。   |
| `项目 ID`      | String | 是     | 填写项目 ID。                     |
| `Category`     | String |  否    | 选择 category 类型。                       |
| `Action`       | String |  否    | 选择点击通知后的动作。                     |
| `ActivityClass`| String | 否     | 填写 ActivityClass。                      |

### **步骤三 集成华为推送 SDK**

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

3. [获取 Token 及自动初始化](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/android-client-dev-0000001050042041)。

打开应用，初始化环信 IM SDK 成功且成功登录后，获取一次华为推送 token，将 token 上传至环信服务器，与 IM 的登录账号绑定。

```java
/**
     * 申请华为 Push Token：
     * 1. getToken 接口只有在 AppGallery Connect 平台开通服务后申请 token 才会返回成功。
     *
     * 2. EMUI 10.0 及以上版本的华为设备上，getToken 接口直接返回 token。如果当次调用失败 Push 会缓存申请，之后会自动重试申请，成功后则以onNewToken 接口返回。
     *
     * 3. 低于 EMUI 10.0 的华为设备上，getToken 接口如果返回为空，确保 Push 服务开通的情况下，结果后续以 onNewToken 接口返回。
     *
     * 4. 服务端识别 token 过期后刷新 token，以 onNewToken 接口返回。
     */
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
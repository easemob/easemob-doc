# 离线推送问题排查

## 说明

开发者集成环信的 Android 离线推送时，可能会遇到离线推送收不到的问题。此文档旨在帮助开发者排查收不到离线推送的问题。环信目前提供了小米、华为、oppo、vivo、魅族，以及给海外用户使用的 FCM，下面我们来分析下集成离线推送可能出现的问题和排查的思路。

:::tip
集成推送前需要先在 *环信开发者后台* 上传推送证书。
:::
## 华为推送

排查时先确认接入过程，华为推送首先需要开发者自己先集成好，测试调通之后再去接入环信。

接入环信的时候需要注意：

1、在初始化环信之前去设置启用华为推送：

```
EMPushConfig.Builder builder = new EMPushConfig.Builder(context);
builder.enableHWPush();
options.setPushConfig(builder.build());
```

2、在登录环信成功进入主界面之后再去连接华为移动服务，并获取华为推送 token。

3、在华为 PushReceiver 的 onToken 方法里去判断返回的推送 token 是否为空，不为空再去调用 EMClient.getInstance().sendHMSPushTokenToServer(token) 把推送 token 上传给环信。

:::tip
连接华为移动服务，并获取华为推送 token 这块的逻辑是必须放在环信登录成功之后再去执行，不然在登录之前就回调了 onToken 的话，后面环信账号登录成功就没法绑定推送 token 的。
:::

接入完成之后在 logcat 里看下登录之后的日志，通过检索 EMPushHelper 查看下华为推送 token 是否上传成功。

```
//1、SDK 判断当前设备对应推送是否可用，false 代表对应推送不可用，true 代表对应推送可用。
2019-09-02 10:50:35.972 5446-5475/? D/ONE SDK: [2019/09/02 10:50:35:971]: [EMPushHelper] isSupportPush: FCM - false
2019-09-02 10:50:35.981 5446-5475/? D/ONE SDK: [2019/09/02 10:50:35:977]: [EMPushHelper] isSupportPush: MIPUSH - false
2019-09-02 10:50:35.988 5446-5475/? D/ONE SDK: [2019/09/02 10:50:35:988]: [EMPushHelper] isSupportPush: HMSPUSH - true
2019-09-02 10:50:35.988 5446-5475/? D/ONE SDK: [2019/09/02 10:50:35:988]: [EMPushHelper] EMPushHelper register, prefer push type: HMSPUSH

//2、获取到了华为返回的推送 token，这里的推送 token 可以在华为的推送后台去指定用户测试推送。
2019-09-02 10:50:38.298 5446-5475/? D/ONE SDK: [2019/09/02 10:50:38:298]: [EMPushHelper] onReceiveToken: HMSPUSH - 0869379034831543200000121400CN01

2019-09-02 10:50:38.298 5446-5475/? D/ONE SDK: [2019/09/02 10:50:38:298]: [EMPushHelper] Retry upload after 5s if failed.
2019-09-02 10:50:38.298 5446-5475/? D/ONE SDK: [2019/09/02 10:50:38:298]: [EMPushHelper] Retry upload after 50s if failed.
2019-09-02 10:50:38.298 5446-5475/? D/ONE SDK: [2019/09/02 10:50:38:298]: [EMPushHelper] Retry upload after 262s if failed.

//3、去上传推送 token，后面有对应的证书名称。
2019-09-02 10:50:38.299 5446-5475/? D/ONE SDK: [2019/09/02 10:50:38:298]: [EMPushHelper] uploadTokenInternal, token=0869379034831543200000121400CN01, url=https://a4.easemob.com:443/easemob-demo/chatdemoui/users/omg4, notifier name=10492024

//4、推送 token 上传成功。
2019-09-02 10:50:38.451 5446-5475/? D/ONE SDK: [2019/09/02 10:50:38:450]: [EMPushHelper] uploadTokenInternal success.
```

上面的是上传推送 token 成功的日志，可以对比你本地 logcat 里的日志，看下是否完整。（`需在初始化环信 SDK 的时候设置 EMClient.getInstance().setDebugMode(true) 才会有详细的日志输出`）

1、如果在第一步判断当前设备推送，看到 HMSPUSH 是 false，那就是华为推送相关的没有配置好，需要检查下华为推送 jar 包是否依赖上，清单里是否配置好了华为相关的配置，尤其是 com.huawei.hms.client.appid，检查看看配置的格式、字段是否正确。并且要在初始化之前去设置好 EMPushConfig.Builder。

2、看 logcat 里的日志，如果 HMSPUSH 是 true，但是没有了之后的日志输出，那就是注册华为推送的时候出问题了，需要看下连接华为移动服务和注册华为推送 token 这块 API 返回的错误码，然后根据错误码排查。

这两步调试正常后，后面的上传推送 token 一般不会有问题（如果出现失败的情况，请提供手机本地的 log 文件反馈环信），之后可以去测试华为推送。测试推送的时候需要先把进程杀掉，首先在华为后台去单推消息，看 App 端是否可以收到(这里一般都是可以收到的，如果没有收到耐心等待几分钟，可能是华为那边推送有延迟，这个可以在华为的开发者群里核实下)，然后再使用其他账号给当前的账号发消息测试。

**如果出现测试我们的离线推送没有收到，需检查以下两步：**

1、是否有调用 EMClient.getInstance().pushManager().disableOfflinePush 设置离线推送免打扰时间。

2、如果是群组消息是否有调用 EMClient.getInstance().pushManager().updatePushServiceForGroup 去屏蔽群组离线推送。

如果以上两步都没有设置，需要提供消息内容、消息时间和接收方 ID 反馈给环信来查。

## 小米推送

首先可以检查小米的集成是否正确。小米推送的集成比较简单，导入小米推送的 jar 包，在清单 AndroidManifest.xml 里加上小米相关的权限和配置，如下为权限：

```
<!-- Mi 推送配置 start -->
    <permission
        android:name="${applicationId}.permission.MIPUSH_RECEIVE"
        android:protectionLevel="signature" />

    <uses-permission android:name="${applicationId}.permission.MIPUSH_RECEIVE" />
    <!-- Mi 推送配置 end -->
```

配置：

```
<!-- Mi 推送配置 start -->
        <service
            android:name="com.xiaomi.push.service.XMPushService"
            android:enabled="true"
            android:process=":pushservice" />

        <service
            android:name="com.xiaomi.push.service.XMJobService"
            android:enabled="true"
            android:exported="false"
            android:permission="android.permission.BIND_JOB_SERVICE"
            android:process=":pushservice" /> <!--注：此 service 必须在 3.0.1 版本以后（包括 3.0.1 版本）加入-->

        <service
            android:name="com.xiaomi.mipush.sdk.PushMessageHandler"
            android:enabled="true"
            android:exported="true" />

        <service
            android:name="com.xiaomi.mipush.sdk.MessageHandleService"
            android:enabled="true" /> <!--注：此 service 必须在 2.2.5 版本以后（包括 2.2.5 版本）加入-->
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

        <receiver android:name="com.hyphenate.push.platform.mi.EMMiMsgReceiver">
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
        <!-- Mi 推送配置 end-->
```

在初始化环信之前去设置上小米推送的 Appid 和 App Key：

```
EMPushConfig.Builder builder = new EMPushConfig.Builder(context);
builder.enableMiPush(appid, appkey);
options.setPushConfig(builder.build());
```

然后运行 App 去登录，查看 logcat 里的日志检索 EMPushHelper 确认下小米推送是否集成成功。

```
//1、SDK 判断当前设备小米推送可用。
2019-09-03 15:52:57.275 2984-3173/com.hyphenate.chatuidemo D/ONE SDK: [2019/09/03 15:52:57:275]: [EMPushHelper] isSupportPush: MIPUSH - true
2019-09-03 15:52:57.275 2984-3173/com.hyphenate.chatuidemo D/ONE SDK: [2019/09/03 15:52:57:275]: [EMPushHelper] EMPushHelper register, prefer push type: MIPUSH

//2、获取到了小米返回的推送 token，这里的推送 token 就是小米推送的 regid。
2019-09-03 15:52:57.725 2984-3173/com.hyphenate.chatuidemo D/ONE SDK: [2019/09/03 15:52:57:725]: [EMPushHelper] onReceiveToken: MIPUSH - Tn0uw0uGRoadNgW6TElcKCGiEwrMCo39nWomRxQU0+K+WlqvFmaHSn45vr9fLG3k

2019-09-03 15:52:57.725 2984-3173/com.hyphenate.chatuidemo D/ONE SDK: [2019/09/03 15:52:57:725]: [EMPushHelper] Retry upload after 2s if failed.
2019-09-03 15:52:57.725 2984-3173/com.hyphenate.chatuidemo D/ONE SDK: [2019/09/03 15:52:57:725]: [EMPushHelper] Retry upload after 48s if failed.
2019-09-03 15:52:57.725 2984-3173/com.hyphenate.chatuidemo D/ONE SDK: [2019/09/03 15:52:57:725]: [EMPushHelper] Retry upload after 287s if failed.

//3、去上传推送 token，后面有对应的证书名称。
2019-09-03 15:52:57.726 2984-3173/com.hyphenate.chatuidemo D/ONE SDK: [2019/09/03 15:52:57:726]: [EMPushHelper] uploadTokenInternal, token=Tn0uw0uGRoadNgW6TElcKCGiEwrMCo39nWomRxQU0+K+WlqvFmaHSn45vr9fLG3k, url=https://a5-v2.easemob.com:443/easemob-demo/chatdemoui/users/omg4, notifier name=2882303761517426801

//4、推送 token 上传成功。
2019-09-03 15:52:58.930 2984-3173/com.hyphenate.chatuidemo D/ONE SDK: [2019/09/03 15:52:58:930]: [EMPushHelper] uploadTokenInternal success.
```

上面的是上传推送 token 成功的日志，可以对比你本地 logcat 里的日志，看是否完整。（`需在初始化环信 SDK 的时候设置 EMClient.getInstance().setDebugMode(true) 才会有详细的日志输出`）

1、如果在这一步看到 MIPUSH 是 false，那就是小米推送没有配置好，比如没有导入小米推送的 jar，清单里的权限和配置没有加上，或者就是没有在初始化之前去设置上小米推送的 Appid 和 App Key。

2、如果没有看到小米返回的推送 token 的日志，那应该会有输出 onErrorResponse: 后面会有小米那边返回的错误码，需根据错误码去排查；

只要保证这两步是正常的，后面上传推送 token 的一般不会有问题，如果发现上传失败的情况，请反馈环信。然后在小米推送后台去使用 regid(regid 在第二步中获取)给设备推送消息，收到之后就可以杀掉进程去测试离线推送了。

**如果出现没有收到离线推送，需检查以下两步：**

1、是否有调用 `EMClient.getInstance().pushManager().disableOfflinePush` 设置离线推送免打扰时间；

2、如果是群组消息是否有调用 `EMClient.getInstance().pushManager().updatePushServiceForGroup` 屏蔽群组离线推送；

如果以上两步都有设置，需要提供消息内容、消息时间和接收方 ID 反馈给环信来查。

## OPPO 推送

集成 OPPO 推送具体文件参考[OPPO推送集成](http://docs-im.easemob.com/im/android/push/thirdpartypush#oppo_推送集成)

**集成 OPPO 推送时需要注意以下几点：**

1、在环信开发者后台上传 OPPO 的推送证书时，需要填 OPPO 推送的 App Key 和 MasterSecret 以及程序的包名，MasterSecret 需要到[OPPO 推送平台](https://push.oppo.com/)-配置管理-应用配置 页面查看。

2、需要在手机通知管理里打开该应用的允许通知权限

3、在初始化环信之前去设置上 OPPO 推送的 App Key 和 AppSecret

```
EMPushConfig.Builder builder = new EMPushConfig.Builder(context);
builder.enableOppoPush(appKey,appSecret);
options.setPushConfig(builder.build()); 
```

4、OPPO 给 8.0 系统之后的手机发推送需要设置通道 ID，环信这边推送给 OPPO 的时候会加上默认的通道 ID：“hyphenate_chatuidemo_notification”，如果需要指定准确的通道 ID 就需要在消息扩展里去设置项目本地使用的channelID

```
// 设置推送通道 ID
JSONObject extObject = new JSONObject();
try {
    extObject.put("em_push_channel_id", ”channelID“);
} catch (JSONException e) {
    e.printStackTrace();
}
// 将推送扩展设置到消息中
message.setAttribute("em_apns_ext", extObject);
```

集成完成之后运行 App 去登录，在 logcat 里检索 EMPushHelper 查看日志确定是否集成成功

```
//1、SDK判断当前设备OPPO推送可用
2019-09-06 14:21:27.532 7852-7912/com.hyphenate.chatuidemo.push D/ONE SDK: [2019/09/06 14:21:27:531]: [EMPushHelper] isSupportPush: FCM - false
2019-09-06 14:21:27.556 7852-7912/com.hyphenate.chatuidemo.push D/ONE SDK: [2019/09/06 14:21:27:555]: [EMPushHelper] isSupportPush: MIPUSH - false
2019-09-06 14:21:27.575 7852-7912/com.hyphenate.chatuidemo.push D/ONE SDK: [2019/09/06 14:21:27:575]: [EMPushHelper] isSupportPush: HMSPUSH - false
2019-09-06 14:21:27.592 7852-7912/com.hyphenate.chatuidemo.push D/ONE SDK: [2019/09/06 14:21:27:592]: [EMPushHelper] isSupportPush: MEIZUPUSH - false
2019-09-06 14:21:27.610 7852-7912/com.hyphenate.chatuidemo.push D/ONE SDK: [2019/09/06 14:21:27:610]: [EMPushHelper] isSupportPush: OPPOPUSH - true
2019-09-06 14:21:27.610 7852-7912/com.hyphenate.chatuidemo.push D/ONE SDK: [2019/09/06 14:21:27:610]: [EMPushHelper] EMPushHelper register, prefer push type: OPPOPUSH

//2、获取到了 OPPO 返回的推送 token
2019-09-06 14:21:27.805 7852-7912/com.hyphenate.chatuidemo.push D/ONE SDK: [2019/09/06 14:21:27:805]: [EMPushHelper] onReceiveToken: OPPOPUSH - CN_724a57d2233d2363fbdeff46af095155

2019-09-06 14:21:27.805 7852-7912/com.hyphenate.chatuidemo.push D/ONE SDK: [2019/09/06 14:21:27:805]: [EMPushHelper] Retry upload after 1s if failed.
2019-09-06 14:21:27.805 7852-7912/com.hyphenate.chatuidemo.push D/ONE SDK: [2019/09/06 14:21:27:805]: [EMPushHelper] Retry upload after 14s if failed.
2019-09-06 14:21:27.806 7852-7912/com.hyphenate.chatuidemo.push D/ONE SDK: [2019/09/06 14:21:27:806]: [EMPushHelper] Retry upload after 469s if failed.

//3、去上传推送 token，后面有对应的证书名称
2019-09-06 14:21:27.807 7852-7912/com.hyphenate.chatuidemo.push D/ONE SDK: [2019/09/06 14:21:27:807]: [EMPushHelper] uploadTokenInternal, token=CN_724a57d2233d2363fbdeff46af095155, url=https://a1.easemob.com:443/easemob-demo/chatdemoui/users/omg4, notifier name=65872dc4c26a446a8f29014f758c8272

//4、推送 token 上传成功
2019-09-06 14:21:27.934 7852-7912/com.hyphenate.chatuidemo.push D/ONE SDK: [2019/09/06 14:21:27:933]: [EMPushHelper] uploadTokenInternal success.
```

上面的是上传推送 token 成功的日志，可以对比你本地 logcat 里的日志，看下是否完整。（`需在初始化环信 SDK 的时候设置 EMClient.getInstance().setDebugMode(true) 才会有详细的日志输出`）

1、如果在这一步看到 OPPOPUSH 是 false，那就是 OPPO 推送没有配置好，比如没有导入 OPPO 推送的 jar，清单里的配置没有加上，或者就是没有在初始化之前去设置上 OPPO 推送的 App Key 和 AppSecret。

2、如果没有看到 OPPO 返回的推送 token 的日志，那应该会有输出 onErrorResponse: 后面会有 OPPO 那边返回的错误码，需根据错误码去排查。

只要保证这两步是正常的，后面上传推送 token 的一般不会有问题，如果发现上传失败的情况，请反馈环信。然后在 OPPO 后台去使用推送 token (在第二步中获取)给设备推送消息，收到后可以杀掉进程去测试离线推送。

**如果出现没有收到离线推送，需检查以下两步：**

1、是否有调用 `EMClient.getInstance().pushManager().disableOfflinePush` 设置离线推送免打扰时间。

2、如果是群组消息是否有调用 `EMClient.getInstance().pushManager().updatePushServiceForGroup` 屏蔽群组离线推送。

如果以上两步都有设置，需要提供消息内容、消息时间和接收方 ID 反馈给环信来查。

## VIVO 推送

集成 VIVO 推送具体文件参考[VIVO推送集成](http://docs-im.easemob.com/im/android/push/thirdpartypush#vivo_推送集成)

**集成 VIVO 推送时需要注意以下几点：**

1、测试的 VIVO 机型是否是支持 VIVO 推送的，详情可见[ VIVO 官网文档_支持机型和系统](https://dev.vivo.com.cn/documentCenter/doc/156)

2、需要在手机通知管理里打开该应用的允许通知权限

集成完成之后运行 App 去登录，在 `logcat` 里检索 `EMPushHelper` 查看日志确定下是否集成成功。

```
//1、SDK 判断当前设备 VIVO 推送可用
2019-10-14 14:57:33.231 24337-24437/com.hyphenate.chatuidemo D/ONE SDK: [2019/10/14 14:57:33:231]: [EMPushHelper] isSupportPush: FCM - false
2019-10-14 14:57:33.245 24337-24437/com.hyphenate.chatuidemo D/ONE SDK: [2019/10/14 14:57:33:245]: [EMPushHelper] isSupportPush: MIPUSH - false
2019-10-14 14:57:33.258 24337-24437/com.hyphenate.chatuidemo D/ONE SDK: [2019/10/14 14:57:33:258]: [EMPushHelper] isSupportPush: HMSPUSH - false
2019-10-14 14:57:33.272 24337-24437/com.hyphenate.chatuidemo D/ONE SDK: [2019/10/14 14:57:33:272]: [EMPushHelper] isSupportPush: MEIZUPUSH - false
2019-10-14 14:57:33.288 24337-24437/com.hyphenate.chatuidemo D/ONE SDK: [2019/10/14 14:57:33:288]: [EMPushHelper] isSupportPush: OPPOPUSH - false
2019-10-14 14:57:33.302 24337-24437/com.hyphenate.chatuidemo D/ONE SDK: [2019/10/14 14:57:33:302]: [EMPushHelper] isSupportPush: VIVOPUSH - true
2019-10-14 14:57:33.303 24337-24437/com.hyphenate.chatuidemo D/ONE SDK: [2019/10/14 14:57:33:303]: [EMPushHelper] EMPushHelper register, prefer push type: VIVOPUSH

//2、获取到的 VIVO 返回的推送 token
2019-10-14 14:57:33.623 24337-24437/com.hyphenate.chatuidemo D/ONE SDK: [2019/10/14 14:57:33:623]: [EMPushHelper] onReceiveToken: VIVOPUSH - 15665456497861102581637
2019-10-14 14:57:33.623 24337-24437/com.hyphenate.chatuidemo D/ONE SDK: [2019/10/14 14:57:33:623]: [EMPushHelper] Retry upload after 4s if failed.
2019-10-14 14:57:33.624 24337-24437/com.hyphenate.chatuidemo D/ONE SDK: [2019/10/14 14:57:33:623]: [EMPushHelper] Retry upload after 9s if failed.
2019-10-14 14:57:33.624 24337-24437/com.hyphenate.chatuidemo D/ONE SDK: [2019/10/14 14:57:33:624]: [EMPushHelper] Retry upload after 301s if failed.

//3、去上传推送 token，后面有对应的证书名称
2019-10-14 14:57:33.624 24337-24437/com.hyphenate.chatuidemo D/ONE SDK: [2019/10/14 14:57:33:624]: [EMPushHelper] uploadTokenInternal, token=15665456497861102581637, url=https://a4.easemob.com:443/easemob-demo/chatdemoui/users/omg4, notifier name=11025#9b74dbfc-55c4-4441-9d0a-561ff21addc7

//4、推送 token 上传成功
2019-10-14 14:57:33.760 24337-24437/com.hyphenate.chatuidemo D/ONE SDK: [2019/10/14 14:57:33:759]: [EMPushHelper] uploadTokenInternal success.
```

上面的是上传推送 token 成功的日志，可以对比你本地 logcat 里的日志，看下是否完整。（`需在初始化环信 SDK 的时候设置 EMClient.getInstance().setDebugMode(true) 才会有详细的日志输出`）

1、如果在这一步看到 VIVOPUSH 是 false，那就是 VIVO 推送没有配置好，比如没有导入 VIVO 推送的 jar，清单里没有去配置 VIVO 的 Appid 和 App Key；

2、如果没有看到 VIVO 返回的推送 token 的日志，那应该会有输出 `onErrorResponse`: 后面会有 VIVO 那边返回的错误码，需根据错误码去排查；

只要保证这两步是正常的，后面上传推送 token 的一般不会有问题，如果发现上传失败的情况，请反馈环信。然后在 OPPO 后台去使用推送 token (在第二步中获取)给设备推送消息，收到后可以杀掉进程去测试离线推送。

如果出现没有收到离线推送，需检查以下两步：

1、是否有调用 `EMClient.getInstance().pushManager().disableOfflinePush` 设置离线推送免打扰时间；

2、如果是群组消息是否有调用 `EMClient.getInstance().pushManager().updatePushServiceForGroup` 屏蔽群组离线推送。

如果以上两步都有设置，需要提供消息内容、消息时间和接收方 ID 反馈给环信技术支持来查。
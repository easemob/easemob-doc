# Android 厂商统计

环信推送提供谷歌、小米、魅族、OPPO、vivo、华为厂商通道的送达、点击数据统计功能。

## 送达设置

### 1、魅族需要设置回调白名单才能实现相关功能。方法如下：

#### 1.1、登陆魅族官方平台

登陆 [魅族开放平台](https://open.flyme.cn/)，点击【Flyme 推送】。

![img](/images/instantpush/push_meizu_flymeconsole.png)

#### 1.2、选择配置应用

选择您要设置的应用名称，点击【打开应用】。

![img](/images/instantpush/push_flyme_openapp.png)

#### 1.3、设置回调地址

根据所在集群设置回调地址（配置 http）
格式为：`http://域名/orgname/appname/push/report/meizu`。

![img](/images/instantpush/push_flyme_callbackaddr.png)

您可以在环信后台，**即时通讯** → **服务概览** 中查看当前 Appkey 的 Rest API 域名地址，仅支持填写 `easemob.com` 类型。

![img](/images/instantpush/push_domain_name.png)

#### 1.4、开启送达回执

魅族平台设置完回执地址后，需要在环信开发者后台，**即时推送** → **配置证书** → **魅族** 配置中开启推送送达回执，才能获取到魅族通道送达数据。 

### 2、华为需要进行推送回执配置才能实现相关功能。方法如下：

#### 2.1、登陆华为官方平台

登陆 [华为消息推送平台](https://developer.huawei.com/consumer/cn/service/josp/agc/index.html#/)，点击【我的项目】。

![img](/images/instantpush/push_huawei_console.png)

#### 2.2、选择配置应用

选择您要设置的应用名称，点击【推送服务】，点击【配置】。

![img](/images/instantpush/push_huawei_config.png)

#### 2.3、开通应用回执状态

开通回执状态

![img](/images/instantpush/push_huawei_callback.png)

#### 2.4、测试并添加回执

填写回执配置，测试回执通过后进行提交。 

![img](/images/instantpush/huawei_report_v1.png)

如果您有多个回执地址，且环信回执地址并非默认选项，则需要指定回执配置ID，详情见 [华为配置推送通知receiptId ](push_notification_config.html#华为推送说明)

![img](/images/instantpush/huawei_receipt_id.png)

示例：

```json
{
    "pushMessage":{
        "huawei":{
            "message":{
                "android":{
                    "receiptId":"RCP78C959D4"
                }
            }
        }
    }
}
```

##### 2.4.1、回调地址

根据所在集群设置回调地址（配置 https，注意：华为只支持https地址配置）
格式为：`https://域名/orgname/appname/push/report/huawei`
您可以在环信后台，**即时通讯** > **服务概览** 中查看当前 Appkey 的 Rest API 域名地址，仅支持填写 `easemob.com` 类型。 

![img](/images/instantpush/push_domain_name.png)

### 3、FCM 客户端处理上报

继承`FirebaseMessagingService`的`Service`里去实现`handleIntent`方法，添加上报送达事件的代码

```java
public class EMFCMMSGService extends FirebaseMessagingService {

    @Override
    public void handleIntent(@NonNull Intent intent) {
        super.handleIntent(intent);
        Bundle bundle = intent.getExtras();
        if(bundle != null){
            String push = bundle.getString("EPush");
            if(push != null){
                try {
                    String taskId = "";
                    JSONObject pushJson = new JSONObject(push);
                    String provider = pushJson.optString("provider");
                    JSONObject report = pushJson.optJSONObject("report");
                    if(report != null){
                        taskId = report.optString("task_id");
                    }

                    EMClient.getInstance().pushManager().asyncReportPushAction(taskId, provider, EMPushManager.EMPushAction.ARRIVE, new EMCallBack() {});
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }

        }
    }
}
```

启动页的`onCreate`里添加上报点击事件的代码。

```java
Bundle bundle = getIntent().getExtras();
    if(bundle !=null){
        String push = bundle.getString("EPush");
        if(push != null){
            try {
                String taskId = "";
                JSONObject pushJson = new JSONObject(push);
                String provider = pushJson.optString("provider");
                JSONObject report = pushJson.optJSONObject("report");
                if(report != null){
                    taskId = report.optString("task_id");
                }
                EMClient.getInstance().pushManager().asyncReportPushAction(taskId, provider, EMPushManager.EMPushAction.CLICK, new EMCallBack() {});
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }
```

## 点击事件上报

厂商推送的点击事件上报，需要在 App 端调用 API 上报实现统计。

```
//taskId 与 provider 需从推送数据里获取，如果获取 taskId 失败则传空字符串
EMClient.getInstance().pushManager().asyncReportPushAction(taskId, provider, action, new EMCallBack(){});
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

            EMClient.getInstance().pushManager().asyncReportPushAction(taskId, provider, EMPushManager.EMPushAction.CLICK, new EMCallBack() {});
        }
    } catch (JSONException e) {
        e.printStackTrace();
    }
}
```
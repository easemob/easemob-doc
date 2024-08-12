# 解析收到的推送字段

收到推送通知后，你需要解析数据。

## 收到的推送字段的含义

| 参数    | 描述           |
| ------- | -------------- |
| `f` | 推送通知的发送方的用户 ID。     |
| `t` | 推送通知的接收方的用户 ID。     |
| `m` | 消息 ID。消息唯一标识符。     |
| `g` | 群组 ID，仅当消息为群组消息时，该字段存在。     |
| `e` | 用户自定义扩展字段。 |

其中 `e` 为完全用户自定义扩展，数据来源为消息扩展的 `em_push_ext.custom`，数据结构如下：

```json
{
    "em_push_ext": {
        "custom": {
            "key1": "value1",
            "key2": "value2"
        }
    }
}
```

## 解析 FCM 推送字段

重写 `FirebaseMessagingService.onMessageReceived` 方法可以在 `RemoteMessage` 对象中获取自定义扩展：

```java
public class EMFCMMSGService extends FirebaseMessagingService {
    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);
        if (remoteMessage.getData().size() > 0) {
            String f = remoteMessage.getData().get("f");
            String t = remoteMessage.getData().get("t");
            String m = remoteMessage.getData().get("m");
            String g = remoteMessage.getData().get("g");
            Object e = remoteMessage.getData().get("e");
        }
    }
}
```

`f`、`t`、`m`、`g` 和 `e` 参数的解释，详见[收到的推送字段的含义](#收到的推送字段的含义)。

`RemoteMessage` 对象中的扩展信息的数据结构如下：

```java
{
    "t":"receiver",
    "f":"fromUsername",
    "m":"msg_id",
    "g":"group_id",
    "e":{}
}
```

## 解析华为推送字段

华为推送字段默认在应用启动页的 `onCreate` 方法中可以获取到，如下所示：

```java
public class SplashActivity extends BaseActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            String t = extras.getString("t");
            String f = extras.getString("f");
            String m = extras.getString("m");
            String g = extras.getString("g");
            Object e = extras.get("e");
            //handle
        }
    }
}
```
`f`、`t`、`m`、`g` 和 `e` 参数的解释，详见[收到的推送字段的含义](#收到的推送字段的含义)。

## 解析小米推送字段

重写 `EMMiMsgReceiver.onNotificationMessageClicked` 方法可以在 `MiPushMessage` 对象中获取自定义扩展：

```java
public class MiMsgReceiver extends EMMiMsgReceiver {

    @Override
    public void onNotificationMessageClicked(Context context, MiPushMessage miPushMessage) {
        String extStr = miPushMessage.getContent();
        JSONObject extras = new JSONObject(extStr);
        if (extras !=null ){
          String t = extras.getString("t");
          String f = extras.getString("f");
          String m = extras.getString("m");
          String g = extras.getString("g");
          Object e = extras.get("e");
          //handle
        }
    }

}
```

`f`、`t`、`m`、`g` 和 `e` 参数的解释，详见[收到的推送字段的含义](#收到的推送字段的含义)。

## 解析 VIVO 推送字段

对于版本号为 480、版本名为 3.0.0.0 及之后的推送 SDK，在启动的 `activty` 的 `intent` 中获取自定义扩展。

对于版本号为 480，版本名为 3.0.0.0 之前的推送 SDK，重写 `EMVivoMsgReceiver.onNotificationMessageClicked` 方法可以在 `UPSNotificationMessage` 对象中获取自定义扩展。

```java
public class MyVivoMsgReceiver extends EMVivoMsgReceiver {
    @Override
    public void onNotificationMessageClicked(Context context, UPSNotificationMessage upsNotificationMessage) {
        Map<String, String> map = upsNotificationMessage.getParams();
        if(!map.isEmpty()) {
            String t = map.get("t");
            String f = map.get("f");
            String m = map.get("m");
            String g = map.get("g");
            Object e = map.get("e");
        }
    }
}
```

`f`、`t`、`m`、`g` 和 `e` 参数的解释，详见[收到的推送字段的含义](#收到的推送字段的含义)。

## 解析荣耀/OPPO/魅族推送字段

解析方式同华为，详见[解析华为推送字段](#解析华为推送字段)。
# Parse Received Push Fields

After receiving a push notification, you need to parse the data.

## Meaning of received push fields

| Parameter | Description |
| ------- | -------------- |
| `f` | The user ID of the sender of the push notification. |
| `t` | The user ID of the receiver of the push notification. |
| `m` | The message ID. The unique identifier of the message. |
| `g` | The group ID. This field exists only when the message is a group message. |
| `e` | User-defined extension field. |

`e` is a completely user-defined extension. The data comes from `em_push_ext.custom` in the message extension. The data structure is as follows:

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

## Parse FCM push fields

Override the `FirebaseMessagingService.onMessageReceived` method to get custom extensions from the `RemoteMessage` object:

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

For the descriptions of the `f`, `t`, `m`, `g`, and `e` parameters, see [Meaning of received push fields](#meaning-of-received-push-fields).

The data structure of the extension information in the `RemoteMessage` object is as follows:

```java
{
    "t":"receiver",
    "f":"fromUsername",
    "m":"msg_id",
    "g":"group_id",
    "e":{}
}
```

## Parse Huawei push fields

Huawei push fields can be obtained in the `onCreate` method of the app launch page by default, as shown below:

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
For the descriptions of the `f`, `t`, `m`, `g`, and `e` parameters, see [Meaning of received push fields](#meaning-of-received-push-fields).

## Parse Xiaomi push fields

In the app's `LAUNCHER Activity`, such as `SplashActivity`, get push data through `Intent`:

```java
public class SplashActivity {
  final static String TAG = "SplashActivity";

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    getIntentData(getIntent());
  }

  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    setIntent(intent);
    getIntentData(intent);
  }

  private void getIntentData(Intent intent) {
    if (null != intent) {
        MiPushMessage pushMessage = null;
        if (intent.getExtras() != null) {
            Object raw = intent.getExtras().get("key_message");
            if (raw instanceof MiPushMessage) {
                pushMessage = (MiPushMessage) raw;
            }
        }
        if (pushMessage != null) {
            JSONObject extras = new JSONObject(pushMessage.getContent());
            String t = extras.optString("t");
            String f = extras.optString("f");
            String m = extras.optString("m");
            String g = extras.optString("g");
            Object e = extras.opt("e");
            EMLog.d(TAG, "t = " + t + ", f = " + f + ", m = " + m + ", g = " + g + ", e = " + e);
        }
    } else {
      Log.i(TAG, "intent is null");
    }
  }
}
```

For the descriptions of the `f`, `t`, `m`, `g`, and `e` parameters, see [Meaning of received push fields](#meaning-of-received-push-fields).

## Parse VIVO push fields

For push SDKs with version code 480, version name 3.0.0.0, or later, get custom extensions from the `intent` of the launched `activty`.

For push SDKs earlier than version code 480 and version name 3.0.0.0, override the `EMVivoMsgReceiver.onNotificationMessageClicked` method to get custom extensions from the `UPSNotificationMessage` object.

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

For the descriptions of the `f`, `t`, `m`, `g`, and `e` parameters, see [Meaning of received push fields](#meaning-of-received-push-fields).

## Parse Honor/OPPO/Meizu push fields

The parsing method is the same as Huawei. For details, see [Parse Huawei push fields](#parse-huawei-push-fields).

## Unified solution for obtaining messages

As shown above, different vendors use different methods to obtain messages after users tap the notification bar. If you want to use a unified solution to obtain messages from different vendors, see [Unified solution for obtaining messages](push_parsing_unified.html).

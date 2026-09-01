# Parse Received Push Fields

After receiving a push notification, you need to parse the data.

## Meaning of received push fields

| Parameter | Description |
| ------- | -------------- |
| `f` | The user ID of the sender of the push notification. |
| `t` | The user ID of the recipient of the push notification. |
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
    "t":"recipient",
    "f":"fromUsername",
    "m":"msg_id",
    "g":"group_id",
    "e":{}
}
```
# User Status Change Webhook Events

## Feature overview

When a user's online or offline status changes, the EasyIM server synchronizes the user's latest status and the reason for the change with your app server.

The following table describes the reasons for user status changes:

| Reason for change | Description |
| :--- | :--- |
| Login (`login`) | The user gets online. |
| Logout (`logout`) | The user goes offline. |
| Forced logout (`replaced`) | The user is forced offline by another device or by the server. |

For the webhook response rules and retry mechanism, see [Post-delivery webhook](callback_postsending.html).

## Real-time status change awareness

#### Android/iOS/HarmonyOS/Flutter/React Native

User status changes can be detected in real time:

- After the user logs in successfully, the status changes to online;
- After the user logs out successfully, the status changes to offline. If the push token (device token) is unbound when the logout API is called, the user cannot receive offline push notifications. If it is not unbound, the user can receive offline push notifications.
- If the user terminates the client process, or the device operating system terminates it after the app is moved to the background, the status changes to offline.
- When the network is unavailable, for example, when the user enables airplane mode on a mobile device or enters a tunnel without network coverage, the EasyIM server detects a heartbeat timeout after waiting 5 minutes, and the user's status changes to offline.

#### Web

When a user successfully logs in on the web client, the EasyIM server detects the status change to online in real time:

- If the page is closed directly, the change is detected in real time and the status changes to offline.
- If the page remains open but the network is disconnected, the change takes about 5 minutes to be detected, after which the status changes to offline.
- If the `close` API is called, the change is detected in real time and the status changes to offline.
- When the network is unavailable, for example, when the user enables airplane mode on a mobile device or enters a tunnel without network coverage, the EasyIM server detects a heartbeat timeout after waiting 5 minutes, and the user's status changes to offline.

#### Mini Program

When a user successfully logs in to the Mini Program, the EasyIM server detects the status change to online in real time:

- If the user taps the upper-right corner to exit, the status change to offline is detected within 5s.
- If the network is disconnected, for example, when airplane mode is enabled on the phone, the status change to offline takes about 5 minutes to be detected.
- If WeChat is moved to the background, the status changes to offline after about 30s.
- If the WeChat process is terminated, the change is detected in real time and the status changes to offline.
- If the `close` API is called, the change is detected in real time and the status changes to offline.
- When the network is unavailable, for example, when the user enables airplane mode on a mobile device or enters a tunnel without network coverage, the EasyIM server detects a heartbeat timeout after waiting 5 minutes, and the user's status changes to offline.

#### Unity/Windows

User status changes can be detected in real time:

- After the user logs in successfully, the status changes to online;
- After the user logs out successfully, the status changes to offline.
- If the user terminates the client process, or the device operating system terminates it after the app is moved to the background, the status changes to offline.
- When the network is unavailable, for example, when the user enables airplane mode on a mobile device or enters a tunnel without network coverage, the EasyIM server detects a heartbeat timeout after waiting 5 minutes, and the user's status changes to offline.

## Trigger conditions

1. The client successfully establishes a network connection with the EasyIM server.
2. The user successfully logs out of EasyIM from the client.
3. The user actively disconnects the client from the network.
4. The client network becomes completely unavailable, for example, when the user enters a tunnel without network coverage or enables airplane mode on a mobile device. The EasyIM server detects a heartbeat timeout after waiting 5 minutes, and the status changes to offline.
5. The user terminates the app process, the device operating system terminates the process after the app is moved to the background, or the process exits unexpectedly because of a crash.
6. The user is forced offline from a [single device](/document/server-side/account_offline_device_single.html) or [all logged-in devices](/document/server-side/account_offline_forced.html). This operation can be initiated from the [client](/document/android/multi_device.html#force-an-account-offline-from-a-single-device), [server](/document/server-side/account_offline_device_single.html), or [Easemob Console](/product/console/operation_user.html#force-offline).
7. In a single-device login scenario, a device that logs in later forces the previously logged-in device offline.
8. When the maximum number of devices for [multi-device login](/document/android/multi_device.html) is reached, a newly logged-in device forces a previously logged-in device offline. For multi-device login, EasyIM supports up to 4 simultaneously online devices per platform by default.

## Prerequisite

- The post-delivery webhook service is activated. For details, see [Activate the message webhook service](/product/console/basic_webhook.html#activate-the-service) and [Webhook overview](/document/server-side/callback_postsending.html).
- Post-delivery webhook rules are configured in the [Easemob Console](https://console.easemob.com/user/login). For details, see [Configure webhook rules](/product/console/basic_webhook.html#configure-message-callback-rules).

## Webhook request

### Request example

When a user logs in, logs out, or is forced offline, the EasyIM server sends a status change webhook to your app server. The three webhooks have the same request field structure and differ only in the values of `reason` and `status`.

**User login (`reason` = `login`, `status` = `online`)**

```json
{
    "callId":"XXXX#XXXX_25b64a81-1376-4669-bb3d-178449a8f11b",
    "reason":"login",
    "security":"2c6dd77e61b8f26801627fdaadca893e",
    "os":"ios",
    "ip":"XXXX",
    "host":"XXXX",
    "appkey":"XXXX#XXXX",
    "user":"XXXX#XXXX_XXXX@easemob.com/ios_6d580737-db3a-d2b5-da18-b6045ffd195b",
    "name":"XXXX",
    "version":"3.8.9.1",
    "timestamp":1642585154644,
    "status":"online"
}
```

**User logout (`reason` = `logout`, `status` = `offline`)**

```json
{
    "callId":"XXXX#XXXX_25b54a81-1376-4669-bb3d-178339a8f11b",
    "reason":"logout",
    "security":"2c7dd77e61b8f26801627fdaadca987e",
    "os":"ios",
    "ip":"XXXX",
    "host":"XXXX",
    "appkey":"XXXX#XXXX",
    "user":"XXXX#XXXX_XXXX@easemob.com/ios_6d580737-db3a-d2b5-da18-b6045ffd195b",
    "name":"XXXX",
    "version":"3.8.9.1",
    "timestamp":1642648914742,
    "status":"offline"
}
```

**User forced offline (`reason` = `replaced`, `status` = `offline`)**

```json
{
    "callId":"XXXX#XXXX_260ae3eb-ba31-4f01-9a62-8b3b05f3a16c",
    "reason":"replaced",
    "security":"0ac500b1a1e44fe76dbfdc664cbaa76b",
    "os":"ios",
    "ip":"223.71.97.198:52709",
    "host":"msync@ebs-ali-beijing-msync40",
    "appkey":"XXXX#XXXX",
    "user":"XXXX#XXXX_XXXX@easemob.com/ios_a5fa01fd-b5a4-84d5-ebeb-bf10e8950442",
    "name":"XXXX",
    "version":"3.8.9.1",
    "timestamp":1642648955563,
    "status":"offline"
}
```

### Request fields

| Field        | Type | Description                                                         |
| :---------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | Unique identifier of the webhook request, in the format `App Key_UUID`.              |
| `reason`    | String   | Reason for the status change: `login` (login), `logout` (logout), or `replaced` (forced offline). |
| `security`  | String   | Signature in the format `MD5(callId + secret + timestamp)`. For the `secret`, see [Configure webhook rules in the Easemob Console](/product/console/basic_webhook.html#configure-message-callback-rules). |
| `os`        | String   | Device operating system type.                                           |
| `ip`        | String   | IP address from which the user logs in.                                         |
| `host`      | String   | Server name.                                                 |
| `appkey`    | String   | Unique identifier of the app registered in the Easemob Console.                               |
| `user`      | String   | Unique identifier of the user whose status changes, in the format `{appkey}_{username}@easemob.com/{os}_{deviceId}`, where `@easemob.com` is a fixed suffix and `deviceId` is randomly generated by the SDK. |
| `name`      | String   | Username of the user whose status changes, corresponding to the `user` field's `{username}` portion.                                   |
| `version`   | String   | SDK version.                                                 |
| `timestamp` | Long     | UNIX timestamp when the request reaches the EasyIM server, in milliseconds.               |
| `status`    | String   | Status after the change: `online` or `offline`.   |

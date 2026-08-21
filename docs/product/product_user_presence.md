# User Presence Management

User presence includes online, offline, and custom states.

## Presence types

### Online

After a user starts the app, the client successfully establishes a network connection to the EasyIM server. The client can send messages to the EasyIM server and receive messages pushed by it. The EasyIM server stores the client's online information, such as network connection information and client platform version. While the app is running, **the EasyIM SDK sends a heartbeat packet to the server every 5 minutes to confirm the user's online status.**

### Offline

Offline is the state after a user successfully logs out of or disconnects from EasyIM. After logging out of EasyIM, the user cannot send or receive messages but can receive offline messages after the next login.

A user is offline in the following scenarios:

- **The app process is killed**: The device operating system kills the app process after the user moves the app to the background, or the user actively kills the app process.
- **The network connection is lost**: The user actively disables the client's network connection, or the network becomes completely unavailable, such as when the user enters a tunnel without network coverage or enables airplane mode on a mobile device. After waiting 5 minutes, the EasyIM server detects a heartbeat timeout and changes the user's status to offline.

### Custom states

A user can set a custom state, such as busy, be right back, away, on a call, or out to lunch.

## Query user presence

EasyIM supports querying the presence of multiple users by calling a [REST API](/document/server-side/presence_get.html) or [client API](/document/android/presence.html#query-subscribed-users).

## User status changes

### User presence change notifications

1. If the client connection changes from online to offline, the client receives a disconnection notification, such as `EMConnectionListener#onDisconnected(int errorCode)` on Android. If it changes from offline to online, the client receives a connection notification, such as `EMConnectionListener#onConnected()` on Android. Subscribers receive a callback when a subscribed user's presence changes, such as `EMPresenceListener#onPresenceUpdated(List<EMPresence>)` on Android.

2. When the SDK detects that the current account changes from a custom state to offline, the result of publishing the offline presence can be returned through the status publishing API callback, such as the `EMPresenceManager#publishPresence` `EMCallBack` on Android. Users subscribed to the account receive a presence change notification, such as `EMPresenceListener#onPresenceUpdated(List<EMPresence>)` on Android.

### User status callback events

After a user logs in successfully, their status is online. After the user logs out successfully or is forced offline, their status is offline.

When a user logs in, logs out, or is forced offline, the EasyIM server includes the user's status in the corresponding event sent to your configured post-delivery callback URL. For details, see [User login and logout events](/document/server-side/callback_login_logout.html).

### Real-time awareness of status changes

#### Android/iOS

Users can detect status changes in real time:

- After a user logs in successfully, their status changes to online;
- After a user logs out successfully, their status changes to offline. If the push token (device token) is unbound when the logout API is called, the user cannot receive offline push notifications. If the token is not unbound, the user can receive offline push notifications.
- If the user actively kills the client process or the device operating system kills the process after the user moves the app to the background, the user's status changes to offline.
- When the network is unavailable, such as when the user enables airplane mode on a mobile device or enters a tunnel without network coverage, the EasyIM server detects a heartbeat timeout after waiting 5 minutes, and the user's status changes to offline.

#### Web

When a user logs in successfully on the Web client, the EasyIM server detects in real time that the status has changed to online:

- If the user closes the page directly, the server detects this in real time and changes the status to offline.
- If the page remains open but the network disconnects, the server takes approximately 5 minutes to detect the change and set the status to offline.
- If the user actively calls the `close` API, the server detects this in real time and changes the status to offline.
- When the network is unavailable, such as when the user enables airplane mode on a mobile device or enters a tunnel without network coverage, the EasyIM server detects a heartbeat timeout after waiting 5 minutes, and the user's status changes to offline.

## Multi-device login

- **Multiple devices online simultaneously**: During multi-device login, EasyIM supports up to 4 devices online simultaneously on each client platform by default. To increase the number of supported devices, contact your EasyIM business manager.

In a single-device login scenario, a device that logs in later forces the previously logged-in device offline. The device that is forced offline is logged out and does not receive offline push notifications.

- **Force a device offline**: During multi-device login, if the maximum number of logged-in devices is reached, a newly logged-in device forces a previously logged-in device offline. The device that is forced offline is logged out and does not receive offline push notifications.

For more information about multi-device login, see the [related documentation](/document/android/multi_device.html).

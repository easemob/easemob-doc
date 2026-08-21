# Multi-Device Login

## Feature overview

EasyIM allows the same account to log in on multiple devices. Before using this feature, enable the service in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see the [EasyIM Console documentation](/product/console/basic_user.html#多端多设备).

When logging in, the EasyIM SDK generates a login identifier for the current device based on the initialization parameters and sends the device information to the server. The server maintains the online device status of the current account according to the multi-device login policy. When the same account performs operations related to friends, chat groups, message threads, conversations, or roaming-message deletion on another device, the SDK normalizes these operations into multi-device events and notifies the current device through the corresponding callback registered with `client.addEventHandler`.

Multi-device login supports the following features:

- Receive notifications on the current device about multi-device events triggered on other devices;
- Synchronize multi-device operation events related to friends, chat groups, message threads, conversations, and roaming-message deletion;
- Query the login identifiers of the current account on other devices;
- Customize the device identifier, platform, and device name through initialization parameters.

With multi-device login, EasyIM supports up to 4 devices online simultaneously on each platform by default. To increase the supported number of devices, contact the EasyIM business manager. On the **EasyIM > Basic Features > Users** page in the EasyIM Console, you can set the number of devices for each platform in the dialog box that appears:

![img](/images/common/multidevice_device_count.png)

## Device eviction policy

- Single-device login

A newly logged-in device kicks the currently online device offline.

- Multi-device login

If the number of logged-in devices on a platform reaches the limit, the latest device to log in kicks the earliest device on that platform offline. EasyIM supports device eviction only within the same platform, not across platforms.<br/>For multi-device login, whether a fixed device ID is used affects the device eviction policy.<br/>For multi-device login, `useFixedDeviceId`, `deviceId`, `customOSPlatform`, and `customDeviceName` collectively determine how the device identifier is generated:<br/>- (Default) `useFixedDeviceId: true`: The SDK reuses a fixed device identifier. If the default `deviceId` is used, the same browser environment reuses the cached device identifier.<br/>- `useFixedDeviceId: false`: The SDK does not reuse a fixed device identifier cached locally. If the default `deviceId` is used, a new random device identifier is generated.<br/>- If a custom `deviceId` is passed without setting `customOSPlatform`, the SDK constructs a device identifier from that value and does not necessarily generate a random device ID each time.<br/>- `customDeviceName` takes effect only when `customOSPlatform` is set.

The EasyIM server provides RESTful APIs to [retrieve the list of devices on which an account is logged in](/document/server-side/account_online_device_obtain.html), [force an account offline on all logged-in devices](/document/server-side/account_offline_forced.html), and force a specified account [offline on a single device](/document/server-side/account_offline_device_single.html).

## Prerequisite

- Before you start, initialize the SDK and connect it to the server. For details, see [Quick Start](quickstart.html).
- Multi-device login has been enabled in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see the [EasyIM Console documentation](/product/console/basic_user.html#多端多设备).
- To set a custom name, custom platform, or login extension information for a login device, configure it during SDK initialization.

## Retrieve the list of login IDs for the current user on other devices

Call `getSelfIdsOnOtherPlatform` to retrieve the list of login IDs for the current user on other devices and perform subsequent business operations on a target login device as needed.

This API applies to multi-device login and queries the login status of the current account on other devices. The current device is automatically excluded from the result. You can typically use the API to display a list of logged-in devices, identify suspicious logins, send multi-device login reminders, or use it with a server-side API to force a specified device offline.

```typescript
const otherDeviceIds = await client.getSelfIdsOnOtherPlatform();
console.log('其他设备登录 ID:', otherDeviceIds);
```

Each login ID in the result uses the `userId/resource` format, where `userId` is the current user ID and `resource` is the resource identifier of a logged-in device. This `resource` is semantically equivalent to the `resourceId` parameter in the [server-side API for forcing a single device offline](/document/server-side/account_offline_device_single.html) and the `res` parameter in the [server-side API for retrieving the online login devices of a specified account](/document/server-side/account_online_device_obtain.html). Each uniquely identifies one of a user's login devices. The difference is that the client API returns the complete login ID, whereas the server-side API requires only the portion after `/`, namely `resource`. Therefore, to call the server-side API for forcing a single device offline, first extract `resource` from the login ID and then pass it as `resourceId`.

## Set the login device platform

The SDK allows you to customize the platform of a login device. For example, you can define a mini program and a Web browser as separate platforms to control the number of login devices on each platform more precisely.

Set the platform of a login device as follows:

1. On the **EasyIM > Basic Features > Users** page in the EasyIM Console, click **Settings** in the **Multi-Device Login** area. In the dialog box that appears, click **Add Custom Platform**. In the **Add Custom Platform** dialog box, set **Device Platform** and **Number of Devices**.

The value range of **Device Platform** is [1,100], and that of **Number of Devices** is [0,4].

![img](/images/common/multidevice_device_platform.png)

2. Set the `customOSPlatform` parameter when initializing the SDK. To set a custom device name for the platform, also set `customDeviceName`. Ensure that the value of `customOSPlatform` is the same as the device-platform value configured in the console.

```typescript
const client = ChatClient.init({
  appKey: 'your appKey',
  // Whether to reuse a fixed device identifier. The default is `true`.
  useFixedDeviceId: true,
  // Custom base value for the device identifier. The default is `webim` if this parameter is omitted.
  deviceId: 'webim',
  // Custom platform number. The value range is [1,100].
  customOSPlatform: 1,
  // Custom device name. Takes effect only when `customOSPlatform` is set.
  customDeviceName: '自定义平台1',
  managers: [],
});
```

## Set login device extension information

EasyIM allows you to set custom extension information for a login device. In multi-device login scenarios, this capability passes additional identification information about the current login device to help your app identify and manage devices. For example, if a device is kicked offline, it can obtain the custom extension information of the device that caused it to be kicked offline.

When initializing the SDK, set custom extension information for the current login device through the `loginExtensionInfo` parameter. The maximum length of this parameter is 1024 characters.

When the multi-device login policy forces a device offline, for example, when the current device is kicked offline because another device logs in, the SDK triggers a connection-disconnection event (`onDisconnected`). Your app can use the disconnection reason to determine whether the current device was forced offline by the multi-device login policy. In this scenario, `loginExtensionInfo` can pass device-identification information to help your app distinguish the device that triggered the change in the current login state.

:::tip
`loginExtensionInfo` takes effect together with the login state of the current device after a successful login.
:::

```typescript
const client = ChatClient.init({
  appKey: 'your appKey',
  // Custom extension information for the login device.
  loginExtensionInfo: JSON.stringify({
    source: 'web',
    deviceName: 'Chrome-1',
  }),
  managers: [],
});
```

## Listen for multi-device events

Call `addEventHandler` to register event listeners for operations on other devices. After the server synchronizes the information, the SDK invokes the multi-device event callbacks. The SDK currently supports the following five types of multi-device events:

- `onMultiDeviceContact`: Friend-related multi-device events;
- `onMultiDeviceGroup`: Chat-group-related multi-device events;
- `onMultiDeviceThread`: Message-thread-related multi-device events;
- `onMultiDeviceConversation`: Conversation-related multi-device events;
- `onMultiDeviceMessageRemoved`: Multi-device events related to roaming-message deletion.

:::tip
Multi-device login does not provide events for chat room operations. It supports only the synchronization of messages sent and received in chat rooms.
:::

```typescript
client.addEventHandler('multiDevice', {
  // Friend-related multi-device events
  onMultiDeviceContact: event => {
    console.log('Multi-device operation on friend:', event.operation);
    console.log('Target user ID:', event.targetUserId);
    console.log('Source device ID:', event.deviceId);
  },
  // Chat-group-related multi-device events
  onMultiDeviceGroup: event => {
    console.log('Multi-device operation on group:', event.operation);
    console.log('Group ID:', event.groupId);
    console.log('Related user ID list:', event.userIds);
    console.log('Source device ID:', event.deviceId);
  },
  // Message-thread-related multi-device events
  onMultiDeviceThread: event => {
    console.log('Multi-device operation on thread:', event.operation);
    console.log('Thread ID:', event.threadId);
    console.log('Parent message ID:', event.parentId);
    console.log('Source device ID:', event.deviceId);
  },
  // Conversation-related multi-device events
  onMultiDeviceConversation: event => {
    console.log('Multi-device operation on conversation:', event.operation);
    console.log('Conversation ID:', event.conversationId);
    console.log('Conversation type:', event.conversationType);
    console.log('Source device ID:', event.deviceId);
  },
  // Multi-device events related to roaming-message deletion
  onMultiDeviceMessageRemoved: event => {
    console.log('Multi-device operation on message removal:', event.operation);
    console.log('Conversation ID:', event.conversationId);
    console.log('Message ID list:', event.messageIds);
    console.log('Deletion timestamp upper limit:', event.beforeTimestamp);
    console.log('Source device ID:', event.deviceId);
  },
});
```

## API list

| API name                                                     | Module/Class  | Description                                                         |
| ------------------------------------------------------------ | ------------ | ------------------------------------------------------------ |
| [`ChatClient.init`](#set-the-login-device-platform)                     | `ChatClient` | Initializes the SDK and configures multi-device login parameters, such as `useFixedDeviceId`, `deviceId`, `customOSPlatform`, `customDeviceName`, and `loginExtensionInfo`. |
| [`getSelfIdsOnOtherPlatform`](#retrieve-the-list-of-login-ids-for-the-current-user-on-other-devices) | `ChatClient` | Retrieves the `userId/resource` list for the current user on other logged-in devices. The current device is automatically excluded. |

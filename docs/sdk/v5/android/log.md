# SDK Logs

## Feature overview

EasyIM logs record SDK-related information and events. The EasyIM technical support team might ask you to provide SDK logs when helping you troubleshoot issues.

## Write information to log files

By default, the SDK can generate and retain up to three files: `easemob.log` and two `easemob_YYYY-MM-DD_HH-MM-SS.log` files. These files use UTF-8 encoding and do not exceed 5 MB each. The SDK writes the latest logs to `easemob.log`. When this file is full, the SDK renames it to an `easemob_YYYY-MM-DD_HH-MM-SS.log` file corresponding to that time. If there are more than three log files, the earliest file is deleted.

For example, when the SDK records a log at 8:00:00 AM on January 1, 2024, it generates `easemob.log`. If the file becomes full at 8:30:00, it is renamed `easemob_2024-01-01_08-30-00.log`. If `easemob_2024-01-01_09-30-30.log` and `easemob_2024-01-01_10-30-30.log` are subsequently generated at 9:30:30 and 10:30:30, respectively, `easemob_2024-01-01_08-30-00.log` is removed.

Debug output is disabled by default. To output debugging information for troubleshooting, enable debug mode after SDK initialization is complete. We recommend disabling debug mode in production. After debug mode is disabled, the SDK no longer outputs debug-, info-, or warning-level logs, but it continues to output error logs.

```java
// Call this method after SDK initialization is complete. true enables debug output.
EMClient.getInstance().setDebugMode(true);
```

## Retrieve local logs

When the app-specific external storage directory is available and writable, retrieve local logs with the following command. Make these replacements in the code below:

- Replace `{app package name}` with the app's package name, such as `com.hyphenate.chatuidemo`.
- Replace `{App Key}` with the app's EasyIM App Key.

```shell
adb pull /sdcard/Android/data/{app package name}/{App Key}/core_log
```

If the app-specific external storage directory is unavailable, the SDK writes logs to the app's internal `files` directory. This directory usually cannot be read directly with the `adb pull` command above. Export the logs from within the app, or use an appropriate debugging method in a debuggable app.

## API list

| API | Module/Class | Description |
| :--- | :--- | :--- |
| [`setDebugMode`](#write-information-to-log-files) | `EMClient` | Sets whether to output SDK debugging information. Call this method after SDK initialization is complete. |

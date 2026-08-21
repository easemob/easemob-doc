# SDK Logs

The EasyIM SDK records related information and events during operation. When troubleshooting an issue, the Easemob technical support team might ask you to provide SDK logs.

## Write information to log files

By default, the SDK generates and retains up to three log files: the current log file `easemob.log` and two historical log files named by timestamp, `easemob_YYYY-MM-DD_HH-MM-SS.log`. Log files use UTF-8 encoding, and each file can be up to 5 MB.

The SDK writes the latest logs to `easemob.log`. When this file is full, it is renamed to the historical log file for that point in time, and `easemob.log` is recreated. When the number of log files exceeds three, the SDK deletes the earliest historical log file.

For example, when the SDK starts recording logs at 08:00:00 on January 1, 2024, it generates `easemob.log`. If the file becomes full at 08:30:00, it is renamed `easemob_2024-01-01_08-30-00.log`. When subsequent historical log files are generated, the earliest historical log file is removed if the total number of log files exceeds three.

`EMOptions#logLevel` sets the log output level and defaults to `EMLogLevelDebug`:

- `EMLogLevelDebug`: Outputs logs at all levels.
- `EMLogLevelWarning`: Outputs warning and error logs.
- `EMLogLevelError`: Outputs only error logs.

To output SDK logs to the Xcode Console during development, set `enableConsoleLog` before initializing the SDK:

```objectivec
EMOptions *options = [EMOptions optionsWithAppkey:@"<#appkey#>"];

// Output SDK logs to the Xcode Console.
options.enableConsoleLog = YES;

// Set the log level. The default value is EMLogLevelDebug.
options.logLevel = EMLogLevelDebug;

[[EMClient sharedClient] initializeSDKWithOptions:options];
```

## Monitor log output

iOS SDK V5 supports monitoring logs output by the SDK through `EMLogDelegate`. When registering a log delegate, you can specify the callback queue. If `nil` is passed, the SDK runs the callback on the main queue by default.

```objectivec
@interface LogListener : NSObject <EMLogDelegate>
@end

@implementation LogListener

- (void)logDidOutput:(NSString *)log {
    // Process a log output by the SDK.
    NSLog(@"SDK log: %@", log);
}

@end

LogListener *listener = [[LogListener alloc] init];

// Keep a strong reference to listener to prevent it from being released prematurely.
[[EMClient sharedClient] addLogDelegate:listener delegateQueue:nil];

// Remove the delegate when monitoring is no longer required.
[[EMClient sharedClient] removeLogDelegate:listener];
```

## Retrieve local logs

The SDK writes data to the `Library/Application Support/HyphenateSDK` directory in the app sandbox. Log files are located in its `easemobLog` subdirectory:

```text
Library/Application Support/HyphenateSDK/easemobLog
```

For example, to retrieve local logs from a physical device, follow these steps:

1. Open Xcode, connect the device, and select **Xcode > Window > Devices and Simulators**.
2. On the **Devices** tab, select the target device and app.
3. Click the settings icon and select **Download Container** to download the app sandbox.
4. Retrieve `easemob.log` and the historical log files from the `AppData/Library/Application Support/HyphenateSDK/easemobLog` directory in the downloaded package.

![img](/images/ios/overview_fetchlogfile.png)

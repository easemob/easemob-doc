# Apple Privacy Manifest PrivacyInfo.xcprivacy

According to Apple's [Privacy updates for App Store submissions](https://developer.apple.com/news/?id=r1henawx), starting in spring 2024, apps submitted to the App Store must also provide an app privacy manifest that specifies approved reasons for using **Required Reason APIs** in the app and third-party SDKs. Therefore, all third-party SDKs must include **PrivacyInfo.xcprivacy**.

## EasyIM adaptation

### iOS SDK V5

iOS SDK V5 includes `PrivacyInfo.xcprivacy` in the SDK package. After the SDK is correctly integrated into the app project, the SDK's privacy manifest is included in privacy manifest aggregation with the build output. You do not need to copy the SDK declarations into the app's `PrivacyInfo.xcprivacy` again.

App developers must still maintain privacy manifest declarations for the app itself and other third-party SDKs. The SDK privacy manifest describes only access and declarations by iOS SDK V5 and does not represent all privacy disclosures that the app must complete in App Store Connect.

### Required Reason APIs declared by SDK V5

| API category | Reason code | SDK declaration |
| :--- | :--- | :--- |
| `NSPrivacyAccessedAPICategoryUserDefaults` | `CA92.1` | The SDK uses `NSUserDefaults` to save local state and other information required for operation. |
| `NSPrivacyAccessedAPICategoryFileTimestamp` | `C617.1` | The SDK declares its reason for accessing file timestamps in `PrivacyInfo.xcprivacy`. |

The privacy manifest for iOS SDK V5 also declares the following:

 - `NSPrivacyCollectedDataTypes` is `<array/>`.
 - `NSPrivacyTrackingDomains` is `<array/>`.
 - `NSPrivacyTracking` is `false`.

### Manually merge the privacy manifest

You generally do not need to manually merge the SDK V5 privacy manifest. Only if you use an older SDK without a privacy manifest, or distribute a binary copy of the SDK from which you removed the privacy manifest, refer to the following content and add the corresponding entries to the app's `PrivacyInfo.xcprivacy`.

1. Add a privacy manifest file to the app project:

   Open **File > New > File...**, select **App Privacy** under **Resource**, and click **Next** to add the file to the project.

2. Merge the following SDK V5 declarations into the app's `PrivacyInfo.xcprivacy`. You can edit it as source code or a Property List. When merging, retain the app's existing declarations and do not overwrite entries from other SDKs or the app itself.

 - Add the declarations as source code:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>NSPrivacyAccessedAPITypes</key>
	<array>
		<dict>
			<key>NSPrivacyAccessedAPITypeReasons</key>
			<array>
				<string>CA92.1</string>
			</array>
			<key>NSPrivacyAccessedAPIType</key>
			<string>NSPrivacyAccessedAPICategoryUserDefaults</string>
		</dict>
		<dict>
			<key>NSPrivacyAccessedAPITypeReasons</key>
			<array>
				<string>C617.1</string>
			</array>
			<key>NSPrivacyAccessedAPIType</key>
			<string>NSPrivacyAccessedAPICategoryFileTimestamp</string>
		</dict>
	</array>
	<key>NSPrivacyCollectedDataTypes</key>
	<array/>
	<key>NSPrivacyTrackingDomains</key>
	<array/>
	<key>NSPrivacyTracking</key>
	<false/>
</dict>
</plist>
```

 - Add the declarations using a Property List:

![img](/images/ios/apple_privacy_policy.png)

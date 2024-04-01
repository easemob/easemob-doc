# 苹果隐私策略 PrivacyInfo.xcprivacy

根据苹果公司发布的 [App Store 提交的隐私更新](https://developer.apple.com/news/?id=r1henawx)，自 2024 年春季开始，上架 App Store 的应用需要同时提供一份 App 的隐私清单文件，就 App 及第三方 SDK 中使用的 **Required Reason APIs** 提供批准原因。因此，所有第三方 SDK 均需包含 **PrivacyInfo.xcprivacy**。

## 环信即时通讯 IM 的适配

### IM SDK 4.4.1 及以上版本

IM SDK 4.4.1 及以上版本默认包含 **PrivacyInfo.xcprivacy** 隐私协议，无需任何额外操作。

### IM SDK 4.4.1 之前版本

对于 IM SDK 4.4.1 之前版本，你需要将 SDK 对 **Required Reason APIs** 的使用，手动添加到 App 已有的 **PrivacyInfo.xcprivacy** 中。

1. 在 App 工程中添加文件：

   打开 **File > New > File...**，选择 **Resource** 下的 **App Privacy**，点击 **Next** 添加到工程。 

2. 将 **PrivacyInfo.xcprivacy** 中的条目补充到 App 自身的 **PrivacyInfo.xcprivacy** 中，可以通过源码或 Property List 方式添加：

- 通过源码方式添加：

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

-  通过 Property List 方式添加：

![img](@static/images/ios/apple_privacy_policy.png) 



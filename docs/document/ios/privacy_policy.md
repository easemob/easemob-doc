# 苹果隐私策略 PrivacyInfo.xcprivacy

根据苹果公司发布的 [App Store 提交的隐私更新](https://developer.apple.com/news/?id=r1henawx)，自 2024 年春季开始，上架 App Store 的应用需要同时提供一份 App 的隐私清单文件，就 App 及第三方 SDK 中使用的 **Required Reason APIs** 提供批准原因。因此，所有第三方 SDK 均需包含 **PrivacyInfo.xcprivacy**。

## 环信即时通讯 IM 的适配

### iOS SDK V5

iOS SDK V5 已在 SDK 包中提供 `PrivacyInfo.xcprivacy`。将 SDK 正确集成到 App 工程后，SDK 自身的隐私清单会随构建产物参与隐私清单汇总，接入方无需将 SDK 的声明重复复制到 App 的 `PrivacyInfo.xcprivacy` 中。

App 开发者仍需维护 App 自身及其他第三方 SDK 的隐私清单声明。SDK 的隐私清单仅描述 iOS SDK V5 自身的访问和声明，不等同于 App 在 App Store Connect 中应完成的全部隐私申报。

### SDK V5 声明的 Required Reason APIs

| API 类别 | 原因代码 | SDK 中的声明 |
| :--- | :--- | :--- |
| `NSPrivacyAccessedAPICategoryUserDefaults` | `CA92.1` | SDK 使用 `NSUserDefaults` 保存运行所需的本地状态等信息。 |
| `NSPrivacyAccessedAPICategoryFileTimestamp` | `C617.1` | SDK 按其 `PrivacyInfo.xcprivacy` 声明文件时间戳访问原因。 |

iOS SDK V5 的隐私清单还声明：

 - `NSPrivacyCollectedDataTypes` 为 `<array/>`。
 - `NSPrivacyTrackingDomains` 为 `<array/>`。
 - `NSPrivacyTracking` 为 `false`。

### 手动合并隐私清单

通常无需手动合并 SDK V5 的隐私清单。仅当你使用未携带隐私清单的旧 SDK，或自行分发并移除了 SDK 隐私清单的二进制副本时，可参考以下内容，将对应条目补充到 App 的 `PrivacyInfo.xcprivacy` 中。

1. 在 App 工程中添加隐私清单文件：

   打开 **File > New > File...**，选择 **Resource** 下的 **App Privacy**，然后点击 **Next** 将文件添加到工程。

2. 将以下 SDK V5 声明合并到 App 的 `PrivacyInfo.xcprivacy` 中。可通过源代码或 Property List 方式编辑；合并时请保留 App 已有的声明，不要覆盖其他 SDK 或 App 自身的条目。

 - 通过源代码方式添加：

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

 - 通过 Property List 方式添加：

![img](/images/ios/apple_privacy_policy.png)

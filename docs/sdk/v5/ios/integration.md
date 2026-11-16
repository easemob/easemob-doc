# Import the SDK

This page describes how to integrate the EasyIM iOS SDK into an iOS project.

## Development environment requirements

- Xcode: The latest version is recommended.
- An iOS simulator or Apple device running iOS 10.0 or later.
- CocoaPods 1.10.1 or later (required when integrating with CocoaPods).

## Import the SDK

Choose one of the following methods to import the EasyIM SDK into the project.

:::tip

1. Choose only one of Swift Package Manager (SPM), CocoaPods, or manual integration to avoid importing the SDK more than once.
2. For the latest SDK version number, see the [Release Notes](releasenote.html).

:::

### (Recommended) Method 1: Integrate using Swift Package Manager

Choose an SDK 5.x release that supports SPM.

1. Open your project in Xcode and select **File > Add Package Dependencies…**.
2. Enter the repository URL in the search field: [https://github.com/easemob/HyphenateChat_iOS](https://github.com/easemob/HyphenateChat_iOS).
3. Under **Dependency Rule**, select **Exact Version**, enter a release version that supports SPM, such as `5.2.0`, and click **Add Package**. To use another version, first confirm that its version tag contains `Package.swift`.
4. On the package product selection page, add **HyphenateChat** to your App Target and click **Add Package**. Wait for Xcode to finish resolving and downloading dependencies.

The SPM package for SDK `5.2.0` requires iOS 10.0 or later. For other versions, follow the system requirements in the selected version's `Package.swift` and set your App Target's minimum deployment version accordingly.

### Method 2: Integrate using CocoaPods (to be deprecated)

CocoaPods integration will be deprecated. We recommend using SPM instead.

1. In Terminal, go to the project root directory and run `pod init`. This command generates a `Podfile` in the project root directory.
2. Open the `Podfile` and configure the iOS deployment target, app target, and SDK dependency:

```ruby
platform :ios, '10.0'

target 'EMChatQuickstart' do
  pod 'HyphenateChat'
end
```

3. Run `pod install` to install the SDK. After installation succeeds, Terminal displays `Pod installation complete!`, and a `.xcworkspace` file is generated in the project root directory.
4. For subsequent development, open the project using the generated `.xcworkspace` file instead of the `.xcodeproj` file.

To update the installed SDK version, run `pod update HyphenateChat`, and then reopen the project using `.xcworkspace`.

### Method 3: Manually import the SDK

1. Open the [SDK download page](http://easyim.ai/sdk#iOS), download the latest EasyIM iOS SDK, and decompress it.
2. Drag `HyphenateChat.xcframework` and `aosl.xcframework` from the SDK package into the Xcode project.
3. Under **TARGETS > Project Name > General > Frameworks, Libraries, and Embedded Content**, ensure that both xcframeworks have been added and set **Embed** to **Embed & Sign** for each one.

After they are added, Xcode automatically links the system libraries on which the SDK depends.

:::tip
If the project also integrates a specific version of the Agora RTC SDK and `pod install` reports a naming conflict involving `aosl.xcframework`, see [Integration issues in Quickstart](quickstart.html#conflict-involving-the-crash-reporting-library-used-by-the-sdk).
:::

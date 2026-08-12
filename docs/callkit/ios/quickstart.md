# 快速开始

利用环信 CallKit（基于环信即时通讯 IM SDK V4.16.0 或以上版本），你可以轻松实现一对一通话和群组通话功能。本文介绍如何快速实现发起音视频通话。

## 开发环境要求

- Xcode 16.0 或以上版本 
- 最低支持系统版本：iOS 15.0
- 已为你的项目设置有效的开发者签名
- CocoaPods v1.14.3 或以上版本

## 前提条件 

在 [环信控制台](https://console.easemob.com/user/login) 进行如下操作：
1. [注册环信账号](/product/console/account_register.html#注册账号)。
2. [创建应用](/product/console/app_create.html)，[获取应用的 App Key](/product/console/app_manage.html#获取应用凭证)，格式为 `orgname#appname`。
3. [创建用户](/product/console/operation_user.html#创建用户)，获取用户 ID 和 [用户 Token](/product/console/operation_user.html#查看用户-token)。
4. [开通音视频服务](product_activation.html)。为了保障流畅的用户体验，开通服务后，你需等待 15 分钟才能实现发起音视频通话。
   
## 快速开始

### 步骤 1： 创建项目

参考以下步骤在 Xcode 中创建一个 iOS 平台下的 App，项目设置如下：

- **Product Name** 设置为 **EaseCallUIKitQuickStart**。
- **Organization Identifier** 设置为你的 **identifier**。
- **User Interface** 选择 **Storyboard**。
- **Language** 选择你的常用开发语言，推荐 `Swift` 和 `Main.storyboard`。
- 添加权限：在项目 `info.plist` 中添加权限：

``` 
Privacy - Microphone Usage Description //麦克风权限
Privacy - Camera Usage Description //相机权限
```

### 步骤 2 安装 CallKit

你可以使用 CocoaPods 安装环信 CallKit 作为 Xcode 项目的依赖项。

1. 在 `podfile` 中添加如下依赖：

```ruby
target 'EaseCallUIKitQuickStart' do
  use_frameworks!

  pod 'EaseCallUIKit'
end

post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '15.0'
    end
  end
end
```

2. 在终端使用 cd 命令到 `EaseCallUIKitQuickStart` 目录，执行以下命令：

```
pod install
```

### 步骤 3 初始化 CallKit

你可以在应用程序加载时或使用前初始化 CallKit：
1. 初始化 IM SDK。CallKit 基于即时通讯 IM 作为信令通道，因此需先初始化 IM SDK。
   - 填入你的应用的 App Key。
   - 设置即时通讯 IM SDK 中的一些选项（`ChatSDKOptions` 类），例如，开启 Console 日志和是否自动登录。建议在正式环境中开启自动登录，可参考 [GitHub](https://github.com/easemob/easemob-demo-ios) 或 [Gitee](https://gitee.com/easemob-code/easemob-demo-ios) 上的 IM Demo 源码。  
2. 初始化 CallKit。

在整个应用生命周期中，初始化一次即可。

```swift
import UIKit
import EaseCallUIKit
@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        let option = ChatSDKOptions(appkey: "XXXX#XXX")//首先需要初始化 IM SDK，替换你的 app key
        option.enableConsoleLog = true//开启日志
        option.isAutoLogin = false//此处只是示例项目，真实使用时参考环信Demo源码，自动登录更方便
        ChatClient.shared().initializeSDK(with: option)//初始化SDK
        CallKitManager.shared.setup()//初始化EaseCallUIKit
        return true
    }
}
```

### 步骤 4 登录 IM SDK

调用即时通讯 IM SDK 的 `login` 方法传入用户 ID 和 Token 登录 IM。

``` Swift
        ChatClient.shared().login(withUsername: userId, token: token) { [weak self] userId,error  in
            if let error = error {
                self?.showCallToast(toast: "Login failed: \(error.errorDescription ?? "")")
            } else {
                self?.showCallToast(toast: "Login successful")
                self?.userIdField.isHidden = true
                self?.tokenField.isHidden = true
                self?.loginButton.isHidden = true 
            }
        }        
```

### 步骤 5 创建快速开始页面

在项目的 `Main.storyboard` 和 `ViewController.swift` 中替换代码，然后运行。

1. 右键点击项目中的 `Main.storyboard`，选择 **Open As** > **Source Code**，替换为如下代码：

::: details `Main.storyboard` 中的替换代码

``` XML
<?xml version="1.0" encoding="UTF-8"?>
<document type="com.apple.InterfaceBuilder3.CocoaTouch.Storyboard.XIB" version="3.0" toolsVersion="22181" targetRuntime="iOS.CocoaTouch" propertyAccessControl="none" useAutolayout="YES" useTraitCollections="YES" colorMatched="YES" initialViewController="vXZ-lx-hvc">
    <device id="retina6_1" orientation="portrait" appearance="light"/>
    <dependencies>
        <deployment identifier="iOS"/>
        <plugIn identifier="com.apple.InterfaceBuilder.IBCocoaTouchPlugin" version="22182"/>
        <capability name="System colors in document resources" minToolsVersion="11.0"/>
        <capability name="documents saved in the Xcode 8 format" minToolsVersion="8.0"/>
    </dependencies>
    <scenes>
        <!--View Controller-->
        <scene sceneID="ufC-wZ-h7g">
            <objects>
                <viewController id="vXZ-lx-hvc" customClass="ViewController" customModule="EaseCallUIKitQuickStart" customModuleProvider="target" sceneMemberID="viewController">
                    <layoutGuides>
                        <viewControllerLayoutGuide type="top" id="jyV-Pf-zRb"/>
                        <viewControllerLayoutGuide type="bottom" id="2fi-mo-0CV"/>
                    </layoutGuides>
                    <view key="view" contentMode="scaleToFill" id="kh9-bI-dsS">
                        <rect key="frame" x="0.0" y="0.0" width="414" height="896"/>
                        <autoresizingMask key="autoresizingMask" widthSizable="YES" heightSizable="YES"/>
                        <subviews>
                            <textField opaque="NO" contentMode="scaleToFill" horizontalHuggingPriority="248" contentHorizontalAlignment="left" contentVerticalAlignment="center" borderStyle="roundedRect" placeholder="call user or group with id" textAlignment="center" minimumFontSize="17" translatesAutoresizingMaskIntoConstraints="NO" id="laE-OW-CWK">
                                <rect key="frame" x="94.5" y="171" width="225" height="40"/>
                                <color key="backgroundColor" systemColor="systemGray5Color"/>
                                <constraints>
                                    <constraint firstAttribute="height" constant="40" id="kOp-K7-HeC"/>
                                    <constraint firstAttribute="width" constant="225" id="width-laE-OW-CWK"/>
                                </constraints>
                                <color key="textColor" systemColor="labelColor"/>
                                <fontDescription key="fontDescription" type="system" pointSize="18"/>
                                <textInputTraits key="textInputTraits"/>
                            </textField>
                            <button opaque="NO" contentMode="scaleToFill" contentHorizontalAlignment="center" contentVerticalAlignment="center" buttonType="system" lineBreakMode="middleTruncation" translatesAutoresizingMaskIntoConstraints="NO" id="zid-qi-Z7H">
                                <rect key="frame" x="180.5" y="234" width="53" height="35"/>
                                <constraints>
                                    <constraint firstAttribute="height" constant="35" id="Qdf-ZL-nrv"/>
                                    <constraint firstAttribute="width" constant="53" id="width-zid-qi-Z7H"/>
                                </constraints>
                                <buttonConfiguration key="configuration" style="filled" title="Call"/>
                                <connections>
                                    <action selector="callAction:" destination="vXZ-lx-hvc" eventType="touchUpInside" id="21A-e9-7bB"/>
                                </connections>
                            </button>
                            <button opaque="NO" contentMode="scaleToFill" contentHorizontalAlignment="center" contentVerticalAlignment="center" buttonType="system" lineBreakMode="middleTruncation" translatesAutoresizingMaskIntoConstraints="NO" id="1TW-7c-QOv">
                                <rect key="frame" x="174" y="284" width="66" height="35"/>
                                <constraints>
                                    <constraint firstAttribute="height" constant="35" id="X5z-2c-9KQ"/>
                                    <constraint firstAttribute="width" constant="66" id="width-1TW-7c-QOv"/>
                                </constraints>
                                <buttonConfiguration key="configuration" style="filled" title="Login"/>
                                <connections>
                                    <action selector="loginAction:" destination="vXZ-lx-hvc" eventType="touchUpInside" id="D5E-pO-2Jw"/>
                                </connections>
                            </button>
                            <segmentedControl opaque="NO" contentMode="scaleToFill" contentHorizontalAlignment="center" contentVerticalAlignment="top" segmentControlStyle="plain" selectedSegmentIndex="0" translatesAutoresizingMaskIntoConstraints="NO" id="KgU-kb-zgq">
                                <rect key="frame" x="108.5" y="109" width="197" height="32"/>
                                <constraints>
                                    <constraint firstAttribute="height" constant="32" id="49T-gN-YNX"/>
                                    <constraint firstAttribute="width" constant="197" id="64h-61-hN9"/>
                                </constraints>
                                <segments>
                                    <segment title="audio"/>
                                    <segment title="video"/>
                                </segments>
                                <color key="tintColor" systemColor="systemBlueColor"/>
                                <connections>
                                    <action selector="chooseCallType:" destination="vXZ-lx-hvc" eventType="valueChanged" id="faD-YP-JKc"/>
                                </connections>
                            </segmentedControl>
                            <button opaque="NO" contentMode="scaleToFill" contentHorizontalAlignment="center" contentVerticalAlignment="center" buttonType="system" lineBreakMode="middleTruncation" translatesAutoresizingMaskIntoConstraints="NO" id="0Qd-2k-2aV">
                                <rect key="frame" x="180.5" y="334" width="53" height="35"/>
                                <constraints>
                                    <constraint firstAttribute="height" constant="35" id="fuc-9c-KcU"/>
                                    <constraint firstAttribute="width" constant="53" id="u4m-wu-cwy"/>
                                </constraints>
                                <buttonConfiguration key="configuration" style="filled" title="Log"/>
                                <connections>
                                    <action selector="logAction:" destination="vXZ-lx-hvc" eventType="touchUpInside" id="QkB-ye-mNH"/>
                                </connections>
                            </button>
                        </subviews>
                        <color key="backgroundColor" systemColor="systemBackgroundColor"/>
                        <constraints>
                            <constraint firstItem="zid-qi-Z7H" firstAttribute="centerX" secondItem="kh9-bI-dsS" secondAttribute="centerX" id="3PV-gJ-xUs"/>
                            <constraint firstItem="zid-qi-Z7H" firstAttribute="top" secondItem="laE-OW-CWK" secondAttribute="bottom" constant="23" id="3d9-xN-rVV"/>
                            <constraint firstItem="KgU-kb-zgq" firstAttribute="top" secondItem="jyV-Pf-zRb" secondAttribute="bottom" constant="109" id="3iR-bE-dsH"/>
                            <constraint firstItem="1TW-7c-QOv" firstAttribute="centerX" secondItem="kh9-bI-dsS" secondAttribute="centerX" id="7qi-nX-Ep7"/>
                            <constraint firstItem="KgU-kb-zgq" firstAttribute="centerX" secondItem="kh9-bI-dsS" secondAttribute="centerX" id="PaT-sj-EOF"/>
                            <constraint firstItem="0Qd-2k-2aV" firstAttribute="centerX" secondItem="kh9-bI-dsS" secondAttribute="centerX" id="Ptx-cV-DpW"/>
                            <constraint firstItem="laE-OW-CWK" firstAttribute="centerX" secondItem="kh9-bI-dsS" secondAttribute="centerX" id="ZDm-c5-ZIK"/>
                            <constraint firstItem="1TW-7c-QOv" firstAttribute="centerY" secondItem="kh9-bI-dsS" secondAttribute="centerY" id="a05-e3-vQV"/>
                            <constraint firstItem="0Qd-2k-2aV" firstAttribute="top" secondItem="1TW-7c-QOv" secondAttribute="bottom" constant="15" id="r8t-en-w10"/>
                            <constraint firstItem="laE-OW-CWK" firstAttribute="top" secondItem="jyV-Pf-zRb" secondAttribute="bottom" constant="171" id="vBn-aQ-3Q3"/>
                        </constraints>
                    </view>
                    <connections>
                        <outlet property="callButton" destination="zid-qi-Z7H" id="Awl-9Z-oQR"/>
                        <outlet property="callTypeSegment" destination="KgU-kb-zgq" id="wvg-RC-nDZ"/>
                        <outlet property="inputField" destination="laE-OW-CWK" id="jPc-mR-gs4"/>
                        <outlet property="logButton" destination="0Qd-2k-2aV" id="7P1-p7-nd8"/>
                        <outlet property="loginButton" destination="1TW-7c-QOv" id="xVW-DO-dD2"/>
                    </connections>
                </viewController>
                <placeholder placeholderIdentifier="IBFirstResponder" id="x5A-6p-PRh" sceneMemberID="firstResponder"/>
            </objects>
            <point key="canvasLocation" x="13.6" y="-69.715142428785612"/>
        </scene>
    </scenes>
    <resources>
        <systemColor name="systemBackgroundColor">
            <color white="1" alpha="1" colorSpace="custom" customColorSpace="genericGamma22GrayColorSpace"/>
        </systemColor>
        <systemColor name="systemBlueColor">
            <color red="0.0" green="0.47843137254901963" blue="1" alpha="1" colorSpace="custom" customColorSpace="sRGB"/>
        </systemColor>
        <systemColor name="systemGray5Color">
            <color red="0.89803921568627454" green="0.89803921568627454" blue="0.91764705882352937" alpha="1" colorSpace="custom" customColorSpace="sRGB"/>
        </systemColor>
        <systemColor name="labelColor">
            <color white="0" alpha="1" colorSpace="custom" customColorSpace="genericGamma22GrayColorSpace"/>
        </systemColor>
    </resources>
</document>

```

:::

2. 在项目中的 `ViewController.swift`，替换为如下代码：

::: details ViewController.swift 文件中的替换代码：

``` Swift
import UIKit
import EaseCallUIKit
import QuickLook

class ViewController: UIViewController {
    
    var callType: CallType = .singleAudio

    @IBOutlet var inputField: UITextField!
        
    @IBOutlet var callButton: UIButton!
    @IBOutlet weak var loginButton: UIButton!
    @IBOutlet weak var callTypeSegment: UISegmentedControl!
    @IBOutlet weak var logButton: UIButton!

    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        self.callTypeSegment.selectedSegmentIndex = 0
        self.callTypeSegment.selectedSegmentTintColor = .systemBlue
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
    }


    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        self.view.endEditing(true)
    }

    @IBAction func chooseCallType(_ sender: Any) {
        self.callType = CallType(rawValue: UInt(self.callTypeSegment.selectedSegmentIndex)) ?? .singleAudio
    }
    
    @IBAction func loginAction(_ sender: Any) {
        self.view.endEditing(true)
        
        ChatClient.shared().login(withUsername: "userId", token: "token") { [weak self] userId,error  in
            if let error = error {
                self?.showCallToast(toast: "Login failed: \(error.errorDescription ?? "")")
            } else {
                self?.showCallToast(toast: "Login successful")
                if !userId.isEmpty {
                    let profile = CallUserProfile()
                    profile.id = userId
                    profile.avatarURL = "https://xxxxx"
                    profile.nickname = "\(userId)昵称"
                    CallKitManager.shared.currentUserInfo = profile
                }
                self?.loginButton.isHidden = true 
            }
        }
    }
    
    @IBAction func logAction(_ sender: Any) {
        let previewController = QLPreviewController()
        previewController.dataSource = self
        self.present(previewController, animated: true)
    }
    
    @IBAction func callAction(_ sender: Any) {
        self.view.endEditing(true)
        guard let input = inputField.text?.trimmingCharacters(in: .whitespacesAndNewlines), !input.isEmpty else {
            self.showCallToast(toast: "Please enter a valid username or group id")
            return
        }
        CallKitManager.shared.call(with: input, type: self.callType)
    }
}

extension ViewController: QLPreviewControllerDataSource {
    public func numberOfPreviewItems(in controller: QLPreviewController) -> Int {
        1
    }
    
    public func previewController(_ controller: QLPreviewController, previewItemAt index: Int) -> QLPreviewItem {
        let fileURL = URL(fileURLWithPath: NSHomeDirectory() + "/Library/Application Support/HyphenateSDK/easemobLog/easemob.log")
        return fileURL as QLPreviewItem
    }
    
    
}
```

:::

### 步骤 6 发起首次通话

1. 登录：在登录界面输入用户 ID，然后点击 **Login**。  
2. 发起通话：选择 **audio** 或 选择 **video**，输入呼叫用户的用户 ID，点击 **Call**，发起一对一音频或视频通话。

你可以点击 **log** 查看 CallKit 相关日志，搜索 `EaseCallUIKit` 过滤 CallKit 日志。

<img src="/images/callkit/ios/quickstart_run.png" width="400">



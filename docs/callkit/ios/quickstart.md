# 快速开始

利用环信 CallKit（基于环信即时通讯 IM SDK V4.16.0 及其以上），你可以轻松实现一对一通话和群组通话功能。本文介绍如何快速实现发起音视频通话。

## 开发环境要求

- Xcode 16.0 及以上版本 
- 最低支持系统版本：iOS 15.0
- 已为你的项目设置有效的开发者签名
- CocoaPods v1.14.3 及以上版本

## 前提条件 

在 [环信控制台](https://console.easemob.com/user/login) 进行如下操作：
1. [注册环信账号](/product/console/account_register.html#注册账号)。
2. [创建应用](/product/console/app_create.html)，[获取应用的 App Key](/product/console/app_manage.html#获取应用凭证)，格式为 `orgname#appname`。
3. [创建用户](/product/console/operation_user.html#创建用户)，获取用户 ID 和 [用户 Token](/product/console/operation_user.html#查看用户-token)。
4. [创建群组](/product/console/operation_group.html#创建群组)，获取群组 ID，将用户加入群组。
5. [开通音视频服务](product_activation.html)。
   
## 快速开始

### 步骤 1 创建项目

参考以下步骤在 Xcode 中创建一个 iOS 平台下的 App，项目设置如下：

- **Product Name** 设置为 **EaseCallUIKitQuickStart**。
- **Organization Identifier** 设置为你的 **identifier**。
- **User Interface** 选择 **Storyboard**。
- **Language** 选择你的常用开发语言，推荐 `Swift&Main.storyboard`。 // TODO：是这样吗？
- 添加权限：在项目 `info.plist` 中添加权限：

```
Privacy - Photo Library Usage Description //相册权限  
Privacy - Microphone Usage Description //麦克风权限
Privacy - Camera Usage Description //相机权限
```

### 步骤 2 初始化 CallKit

你可以在应用程序加载时或使用前初始化 CallKit：
1. 初始化 IM SDK。CallKit 基于即时通讯 IM 作为信令通道，因此需先初始化 IM SDK。
   - 填入你的应用的 App Key。
   - 设置即时通讯 IM SDK 中的一些选项（`EMOptions` 类），例如，开启 Console 日志和是否自动登录。建议在正式环境中开启自动登录，可参考 [IM Demo 源码](https://github.com/easemob/easemob-demo-ios)。  // TODO：路径是否是这个？
2. 初始化 CallKit。你可以自定义铃声和通话超时时间。 // TODO：是这样吗？

在整个应用生命周期中，初始化一次即可。

```Swift
import EaseCallUIKit

@UIApplicationMain
class AppDelegate：UIResponder，UIApplicationDelegate {

     var window: UIWindow？

     func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
        let option = ChatSDKOptions(appkey: "your app key")//首先需要初始化 IM SDK
        option.enableConsoleLog = true//开启日志
        option.isAutoLogin = false//此处只是示例项目，真实使用时参考环信Demo源码，自动登录更方便
        ChatClient.shared().initializeSDK(with: option)//初始化SDK
        CallKitManager.shared.setup()//初始化EaseCallUIKit
     }
}
```

### 步骤 3 登录 IM SDK

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

### 步骤 4 粘贴代码后运行   // TODO：创建快速开始页面，还是实现代码逻辑？

在项目的 `Main.storyboard` 中 `ViewController.swift` 中替换代码，然后点击 **运行** 。// TODO：运行是个按钮？

1. 右键点击项目中的 `Main.storyboard`，选择 **Open As** > **Source Code**，替换为如下代码：
   
```xml
<?xml version="1.0" encoding="UTF-8"?>
<document type="com.apple.InterfaceBuilder3.CocoaTouch.Storyboard.XIB" version="3.0" toolsVersion="23504" targetRuntime="iOS.CocoaTouch" propertyAccessControl="none" useAutolayout="YES" useTraitCollections="YES" colorMatched="YES" initialViewController="vXZ-lx-hvc">
    <device id="retina4_7" orientation="portrait" appearance="light"/>
    <dependencies>
        <deployment identifier="iOS"/>
        <plugIn identifier="com.apple.InterfaceBuilder.IBCocoaTouchPlugin" version="23506"/>
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
                        <rect key="frame" x="0.0" y="0.0" width="375" height="667"/>
                        <autoresizingMask key="autoresizingMask" flexibleMaxX="YES" flexibleMaxY="YES"/>
                        <subviews>
                            <textField opaque="NO" contentMode="scaleToFill" horizontalHuggingPriority="248" contentHorizontalAlignment="left" contentVerticalAlignment="center" borderStyle="roundedRect" placeholder="call user or group with id" textAlignment="center" minimumFontSize="17" translatesAutoresizingMaskIntoConstraints="NO" id="laE-OW-CWK">
                                <rect key="frame" x="75" y="191" width="225" height="40"/>
                                <color key="backgroundColor" systemColor="systemGray5Color"/>
                                <constraints>
                                    <constraint firstAttribute="height" constant="40" id="kOp-K7-HeC"/>
                                </constraints>
                                <color key="textColor" white="0.0" alpha="1" colorSpace="custom" customColorSpace="genericGamma22GrayColorSpace"/>
                                <fontDescription key="fontDescription" type="system" pointSize="18"/>
                                <textInputTraits key="textInputTraits"/>
                            </textField>
                            <button opaque="NO" contentMode="scaleToFill" contentHorizontalAlignment="center" contentVerticalAlignment="center" buttonType="system" lineBreakMode="middleTruncation" translatesAutoresizingMaskIntoConstraints="NO" id="zid-qi-Z7H">
                                <rect key="frame" x="161.5" y="254" width="52.5" height="35"/>
                                <constraints>
                                    <constraint firstAttribute="height" constant="35" id="Qdf-ZL-nrv"/>
                                </constraints>
                                <state key="normal" title="Button"/>
                                <buttonConfiguration key="configuration" style="filled" title="Call"/>
                                <connections>
                                    <action selector="callAction:" destination="vXZ-lx-hvc" eventType="touchUpInside" id="21A-e9-7bB"/>
                                </connections>
                            </button>
                            <textField opaque="NO" contentMode="scaleToFill" horizontalHuggingPriority="248" contentHorizontalAlignment="left" contentVerticalAlignment="center" borderStyle="roundedRect" placeholder="login user id" textAlignment="center" minimumFontSize="17" translatesAutoresizingMaskIntoConstraints="NO" id="hM6-uK-yyP">
                                <rect key="frame" x="139" y="316" width="97" height="34"/>
                                <color key="backgroundColor" systemColor="systemGray5Color"/>
                                <constraints>
                                    <constraint firstAttribute="height" constant="34" id="L6Z-yu-oNG"/>
                                    <constraint firstAttribute="width" constant="97" id="mfC-xf-iFf"/>
                                </constraints>
                                <fontDescription key="fontDescription" type="system" pointSize="14"/>
                                <textInputTraits key="textInputTraits"/>
                            </textField>
                            <textField opaque="NO" contentMode="scaleToFill" horizontalHuggingPriority="248" contentHorizontalAlignment="left" contentVerticalAlignment="center" borderStyle="roundedRect" placeholder="token" textAlignment="center" minimumFontSize="17" translatesAutoresizingMaskIntoConstraints="NO" id="9QV-P8-MOd">
                                <rect key="frame" x="155.5" y="377" width="64" height="34"/>
                                <color key="backgroundColor" systemColor="systemGray5Color"/>
                                <constraints>
                                    <constraint firstAttribute="height" constant="34" id="bLn-UW-UNZ"/>
                                </constraints>
                                <fontDescription key="fontDescription" type="system" pointSize="14"/>
                                <textInputTraits key="textInputTraits"/>
                            </textField>
                            <button opaque="NO" contentMode="scaleToFill" contentHorizontalAlignment="center" contentVerticalAlignment="center" buttonType="system" lineBreakMode="middleTruncation" translatesAutoresizingMaskIntoConstraints="NO" id="1TW-7c-QOv">
                                <rect key="frame" x="154.5" y="438" width="66" height="35"/>
                                <constraints>
                                    <constraint firstAttribute="height" constant="35" id="X5z-2c-9KQ"/>
                                </constraints>
                                <state key="normal" title="Button"/>
                                <buttonConfiguration key="configuration" style="filled" title="Login"/>
                                <connections>
                                    <action selector="loginAction:" destination="vXZ-lx-hvc" eventType="touchUpInside" id="D5E-pO-2Jw"/>
                                </connections>
                            </button>
                            <button opaque="NO" contentMode="scaleToFill" contentHorizontalAlignment="center" contentVerticalAlignment="center" buttonType="system" lineBreakMode="middleTruncation" translatesAutoresizingMaskIntoConstraints="NO" id="0Qd-2k-2aV">
                                <rect key="frame" x="161" y="497" width="53" height="35"/>
                                <constraints>
                                    <constraint firstAttribute="height" constant="35" id="fuc-9c-KcU"/>
                                    <constraint firstAttribute="width" constant="53" id="u4m-wu-cwy"/>
                                </constraints>
                                <state key="normal" title="Button"/>
                                <buttonConfiguration key="configuration" style="filled" title="Log"/>
                                <connections>
                                    <action selector="logAction:" destination="vXZ-lx-hvc" eventType="touchUpInside" id="QkB-ye-mNH"/>
                                </connections>
                            </button>
                            <segmentedControl opaque="NO" contentMode="scaleToFill" contentHorizontalAlignment="center" contentVerticalAlignment="top" segmentControlStyle="plain" selectedSegmentIndex="0" translatesAutoresizingMaskIntoConstraints="NO" id="KgU-kb-zgq">
                                <rect key="frame" x="89" y="129" width="197" height="32"/>
                                <constraints>
                                    <constraint firstAttribute="height" constant="31" id="49T-gN-YNX"/>
                                    <constraint firstAttribute="width" constant="197" id="64h-61-hN9"/>
                                </constraints>
                                <segments>
                                    <segment title="audio"/>
                                    <segment title="video"/>
                                    <segment title="group"/>
                                </segments>
                                <color key="tintColor" systemColor="systemBlueColor"/>
                                <connections>
                                    <action selector="chooseCallType:" destination="vXZ-lx-hvc" eventType="valueChanged" id="faD-YP-JKc"/>
                                </connections>
                            </segmentedControl>
                        </subviews>
                        <color key="backgroundColor" red="1" green="1" blue="1" alpha="1" colorSpace="custom" customColorSpace="sRGB"/>
                        <constraints>
                            <constraint firstItem="zid-qi-Z7H" firstAttribute="centerX" secondItem="kh9-bI-dsS" secondAttribute="centerX" id="3PV-gJ-xUs"/>
                            <constraint firstItem="zid-qi-Z7H" firstAttribute="top" secondItem="laE-OW-CWK" secondAttribute="bottom" constant="23" id="3d9-xN-rVV"/>
                            <constraint firstItem="KgU-kb-zgq" firstAttribute="top" secondItem="jyV-Pf-zRb" secondAttribute="bottom" constant="109" id="3iR-bE-dsH"/>
                            <constraint firstItem="1TW-7c-QOv" firstAttribute="centerX" secondItem="kh9-bI-dsS" secondAttribute="centerX" id="7qi-nX-Ep7"/>
                            <constraint firstItem="hM6-uK-yyP" firstAttribute="top" secondItem="zid-qi-Z7H" secondAttribute="bottom" constant="27" id="Fbk-dr-XJy"/>
                            <constraint firstItem="9QV-P8-MOd" firstAttribute="centerX" secondItem="kh9-bI-dsS" secondAttribute="centerX" id="NLK-X7-nmU"/>
                            <constraint firstItem="KgU-kb-zgq" firstAttribute="centerX" secondItem="kh9-bI-dsS" secondAttribute="centerX" id="PaT-sj-EOF"/>
                            <constraint firstItem="0Qd-2k-2aV" firstAttribute="centerX" secondItem="kh9-bI-dsS" secondAttribute="centerX" id="Ptx-cV-DpW"/>
                            <constraint firstItem="1TW-7c-QOv" firstAttribute="top" secondItem="9QV-P8-MOd" secondAttribute="bottom" constant="27" id="Vde-Gf-T6Q"/>
                            <constraint firstItem="laE-OW-CWK" firstAttribute="centerX" secondItem="kh9-bI-dsS" secondAttribute="centerX" id="ZDm-c5-ZIK"/>
                            <constraint firstItem="9QV-P8-MOd" firstAttribute="top" secondItem="hM6-uK-yyP" secondAttribute="bottom" constant="27" id="hag-4S-Gef"/>
                            <constraint firstItem="0Qd-2k-2aV" firstAttribute="top" secondItem="1TW-7c-QOv" secondAttribute="bottom" constant="24" id="r8t-en-w10"/>
                            <constraint firstItem="laE-OW-CWK" firstAttribute="top" secondItem="jyV-Pf-zRb" secondAttribute="bottom" constant="171" id="vBn-aQ-3Q3"/>
                            <constraint firstItem="hM6-uK-yyP" firstAttribute="centerX" secondItem="kh9-bI-dsS" secondAttribute="centerX" id="ztk-Cf-e76"/>
                        </constraints>
                    </view>
                    <connections>
                        <outlet property="callButton" destination="zid-qi-Z7H" id="Awl-9Z-oQR"/>
                        <outlet property="callTypeSegment" destination="KgU-kb-zgq" id="wvg-RC-nDZ"/>
                        <outlet property="inputField" destination="laE-OW-CWK" id="jPc-mR-gs4"/>
                        <outlet property="logButton" destination="0Qd-2k-2aV" id="7P1-p7-nd8"/>
                        <outlet property="loginButton" destination="1TW-7c-QOv" id="xVW-DO-dD2"/>
                        <outlet property="tokenField" destination="9QV-P8-MOd" id="rAN-5C-qu0"/>
                        <outlet property="userIdField" destination="hM6-uK-yyP" id="zV0-uW-JWD"/>
                    </connections>
                </viewController>
                <placeholder placeholderIdentifier="IBFirstResponder" id="x5A-6p-PRh" sceneMemberID="firstResponder"/>
            </objects>
            <point key="canvasLocation" x="13.6" y="-69.715142428785612"/>
        </scene>
    </scenes>
    <resources>
        <systemColor name="systemBlueColor">
            <color red="0.0" green="0.47843137250000001" blue="1" alpha="1" colorSpace="custom" customColorSpace="sRGB"/>
        </systemColor>
        <systemColor name="systemGray5Color">
            <color red="0.8980392157" green="0.8980392157" blue="0.91764705879999997" alpha="1" colorSpace="custom" customColorSpace="sRGB"/>
        </systemColor>
    </resources>
</document>
```

2. 在项目中的 `ViewController.swift`，替换为如下代码：

```xml
import UIKit
import EaseCallUIKit
import QuickLook

class ViewController: UIViewController {
    
    var callType: CallType = .singleAudio

    @IBOutlet var inputField: UITextField!
        
    @IBOutlet var callButton: UIButton!
    
    @IBOutlet weak var userIdField: UITextField!
    @IBOutlet weak var tokenField: UITextField!
    @IBOutlet weak var loginButton: UIButton!
    @IBOutlet weak var callTypeSegment: UISegmentedControl!
    @IBOutlet weak var logButton: UIButton!

    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
//        CallKitManager.shared.currentUserInfo = CallUserProfile()
        self.callTypeSegment.selectedSegmentIndex = 0
        self.callTypeSegment.selectedSegmentTintColor = .systemBlue
        CallKitManager.shared.profileProvider = self
        CallKitManager.shared.addListener(self)
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
        guard let userId = userIdField.text, !userId.isEmpty,
              let token = tokenField.text, !token.isEmpty else {
            self.showCallToast(toast: "Please enter a valid username and token")
            return
        }
        
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
        if self.callType != .groupCall {
            CallKitManager.shared.call(with: input, type: self.callType)
        } else {
            CallKitManager.shared.groupCall(groupId: input)
        }
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

### 步骤 5 发起首次通话  // TODO：没有这一步？

在呼叫页面添加呼叫按钮和输入框：
- 一对一音视频通话：输入对方用户 ID，点击呼叫按钮。
- 群组通话：输入群组 ID，点击呼叫按钮。

// TODO：截图



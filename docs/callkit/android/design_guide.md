# 通话套件人机交互界面工具包设计指南

<img src="/images/callkit/design/Cover.png" width="100%" >

环信通话套件人机交互界面工具包基于环信移动端单/群聊人机交互界面工具包进行设计，设计原则、全局样式、小控件样式均复用自环信单/群聊人机交互界面工具包，详见 [单/群聊人机交互界面工具包](/uikit/chatuikit/android/chatuikit_design_guide.html)。

## 总设计原则

- 功能与行为上确保通用、普遍、一般。
- 风格上易于自定义。

## 全局样式

### UIKit 色彩规范

#### 颜色配置说明

##### 颜色类

一般颜色类（Color Class）分为八类：
- 主题色（Theme Color）：Primary、 Secondary、Error 三类；
- 渐变主题色（Primary Gradient）一类（含 8 种）；
- 透明色（Alpha Color）：On Light、On Dark 两类；
- 中性色（Neutral Colors）：Neutral、Neutral Special 两类；

##### 颜色模式

颜色模式（Hsla Model）为比较直观的 hsla 模式:
- 整个模型是一个圆柱体，圆柱体底面周长划分为 360°，对应不同的色相（Hue）;
- 圆柱体的半径为饱和度（Saturation），圆心为 0（最灰），半径值为 100（最艳）；
- 圆柱体的高为亮度（Lightness），起始点为 0（纯黑色），中心点是 50(标准色,)，结束点为 100(纯白色)。

##### 模型概览

<img src="/images/callkit/design/1XfpZuKaNBD26GW.png" width="400" >

#### 三种主题色的色彩规范

##### 用户可配项

用户可设定颜色类的可配项 Hue(0-360)为任意数值，修改后每类颜色的色相会发生变化，以贴合用户场景所需要的主题颜色（Theme Color）。
Hue 值(0-360)与色相的对应关系大致如以下图示所例：

<img src="/images/callkit/design/cruk11211.png" width="400" >

用户可依据自身产品的品牌色指定色相数值（Hue），从而确认主题色 Primary（主要用于 UI 组件中关键操作与重要文本展示，如推荐的 action、高亮显示的文本等），以及用于积极提示的 Secondary，和表示警示提示的 Error。

<img src="/images/callkit/design/cruk11212.png" width="400" >

##### 饱和度

饱和度(Saturation)不开放给用户设置，三种主题色 Primary、 Secondary、Error 默认饱和度为 100%，Neutral 默认为 8%，Neutral Special 默认为 36%

<img src="/images/callkit/design/cruk1122.png" width="400" >

##### 亮度级别

亮度(Lightness)百分比用户不可随意设置，每个颜色类提供：0(0%) / 1(10%) / 2(20%) / 3(30%) / 4(40%) / 5(50%) / 6(60%) / 7(70%) / 8(80%) / 9(90%) / 95(95%) / 98(98%) / 100(100%)十三个级别供用户可选；

<img src="/images/callkit/design/cruk1123.png" width="400" >

##### 示例

如指定主题色 Primary 色相（Hue）为 203，成功色 Secondary 色相（Hue）为 155，警示色 Error 色相（Hue）为 350，则会生成如下 39 种主题色可供用户在指定 UI 件块（View）颜色时使用：

<img src="/images/callkit/design/cruk1124.png" width="400" >

其中，主题色 Primary 的 L5 为亮色模式下的基色（Key Color），L6 为暗色模式下的基色（Key Color）。所有的颜色体系都是依照基色生成。

#### 渐变主题色规范

渐变主题色(Primary Gradient)是由 Primary 色派生出的渐变色，为线性渐变(Linear Gradient)，渐变方向依图示坐标系分为 8 类：

<img src="/images/callkit/design/cruk113.png" width="500" >

##### 渐变色的起始色

渐变色中 Start Color 规则和 Primary 类的色值保持一致;

<img src="/images/callkit/design/cruk1131.png" width="500" >

##### 渐变色的结束色

End Color 用户可配置色相（Hue），亮度以 0(20%) / 1(30%) / 2(40%) / 3(50%) / 4(60%) / 5(70%) / 6(75%) / 7(80%) / 8(85%) / 9(90%) / 95(95%) / 98(98%) / 100(100%)（对应 Primary 的 13 级亮度梯度值）为固定梯度值

以下以 Hue：233 为例，按照 End Color 颜色公式依旧得到 13 级颜色：

<img src="/images/callkit/design/cruk11321.png" width="500" >

起始色和结束色结合，得到相应的渐变结果

<img src="/images/callkit/design/cruk11322.png" width="500" >

##### 渐变主题色可配项

用户仅可配置渐变色中 End Color 的色相（Hue）以达成与用户业务场景符合的渐变颜色效果；

##### 示例

用户设置 End Color Hue = 233，选择渐变方向为“↓”，则可得到如下效果：

<img src="/images/callkit/design/cruk11341.png" width="500" >

如使用渐变主题色，那么它将替代掉所有应用于背景色的 Primary 色

<img src="/images/callkit/design/cruk11342.png" width="400" >

但一般不替代 UI 件块的前景色，因为没有什么意义，且有干扰文字阅读的可能性

<img src="/images/callkit/design/cruk11343.png" width="400" >

#### 透明色(Alpha)的规范

在本案内带有透明度的组件仅有模态背景色、轻提示背景色，应用范围有限，单独定义两个特殊的颜色类用于以上四种组件：Alpha onlight(hsl0, 0%, 0%) 和 Alpha ondark(hsl0, 0%, 100%)，Alpha 值被指定为 0(0.0) / 1(0.1) / 2(0.2) / 3(0.3) / 4(0.4) / 5(0.5) / 6(0.6) / 7(0.7) / 8(0.8) / 9(0.9) / 95(0.95) / 98(0.98) / 100(1.0) 十三个梯度值，共 26 种颜色用例，以调整组件的背景色透明度。

<img src="/images/callkit/design/cruk1141.png" width="500" >

Alpha onlight 和 Alpha ondark 均为默认值，无任何可配置项。

### 中性色

#### 中性色

中性色(Neutral)仅有一个可配项：色相（Hue），饱和度(Saturation)固定值为 8，亮度级别（Lightness level）也和主题色相同，分为 0(0%) / 1(10%) / 2(20%) / 3(30%) / 4(40%) / 5(50%) / 6(60%) / 7(70%) / 8(80%) / 9(90%) / 95(95%) / 98(98%) / 100(100%)十三个级别供用户可选；

<img src="/images/callkit/design/cruk1151.png" width="500" >

Neutral 和 Primary 的默认 Hue 值(色相)相同，也建议用户设置和主题色相同的 Hue 值已达成主题颜色和无彩色系的配套。但这仅仅是建议；

#### 示例

如指定主题色 Primary 色相（Hue）为 203，饱和度(Saturation)固定值为 100%，中性色（Neutral）则也指定色相（Hue）为 203，饱和度(Saturation)固定值为 8%，则得到以下色列可供用户选择使用：

<img src="/images/callkit/design/cruk11521.png" width="500" >

其中，L98 为亮色模式下背景色的主色，L1 为亮色模式下前景色的主色；L1 为暗色模式下背景色的主色，L98 为暗色模式下前景色的主色。

<img src="/images/callkit/design/cruk11522.png" width="400" >

### 特殊中性色

特殊中性色 Neutral Special 主要用于级别低于 Primary 和 Secondary 的强调信息，如当前页面状态、消息发送者的昵称等。
Neutral Special 和 Primary 的默认 Hue 值(色相)类似，为近似色，也建议用户设置和主题色近似的 Hue 值已达成主题色和无彩色系的配套。但这仅仅是建议；

<img src="/images/callkit/design/cruk116a.png" width="400" >

<img src="/images/callkit/design/cruk116b.png" width="400" >

#### 示例

如指定主题色 Primary 色相（Hue）为 203，特殊中性色（Neutral）通过相似色原理（正负 30 度内）指定色相（Hue）为 220，饱和度(Saturation)固定值为 36%，则得到以下色列可供用户选择使用：

<img src="/images/callkit/design/cruk1161.png" width="500" >

## 主题

本期主题分为 1 种，依据场景仅保留黑暗（Dark）色彩模式。

(主题样式图片展示)

## 图标

### 图标模板

图标（Icon）参照 Material Icon Font 的模板 ，以 24 为基本栅格，须在安全区域(20x20 的中心区域)内绘制，基本描边控制为 1.5 栅格。

<img src="/images/callkit/design/cruk131.png" width="600">

### 图标命名

为防止将图标语意固定，icon 命名需要尽力避免定义操作行为，而是以“看见什么就是什么“进行命名，方便相同图标在不同操作行为下的复用，例如：

<img src="/images/callkit/design/cruk132.png" width="600">

## 字体

### 字族（Font Family）

#### iOS 字族

默认 SF Pro 为基本西文（拉丁字母、希腊字母、西里尔字母等）字体（Typography）；
默认 SF Arabic、SF Hebrew 等为基本右向左（Dextral-sinistral）文字字体；
默认苹方（PingFang SC、TC、HK）为中文（简体中文、繁体中文、香港繁体中文）字体；

#### Android 字族

默认 Roboto 为基本西文（拉丁字母、希腊字母、西里尔字母等）字体；
默认 Noto Sans Arabic、Noto Sans Hebrew 等为基本右向左（Dextral-sinistral）文字字体；
默认思源黑体（Noto Sans SC、TC、HK）为中文（简体中文、繁体中文、香港繁体中文）字体；

#### Web 字族

默认 Roboto 为基本西文（拉丁字母、希腊字母、西里尔字母等）字体；
默认 Noto Sans Arabic、Noto Sans Hebrew 等为基本右向左（Dextral-sinistral）文字字体；
默认思源黑体（Noto Sans SC、TC、HK）为中文（简体中文、繁体中文、香港繁体中文）字体；

### 字号

#### 最小字号

移动端最小字号（Font Size）为：11；web 端最小字号为：12

#### 字号规则

除移动端最小字号外，字号以 2 为梯度递增：
11，12，14，16，18，20

### 字重

字重（Font Weight）分为标准（Regular, 400）、中等（Medium,510）、加粗（semibold,590）三种；
在一些跨平台框架中，如遇不支持设置非百位整数字重，则取近似值百位整数；
如字族没有 semibold，则以 bold 替换。

### 行高

行高（Line height）依照以下固定值（字号/行高）：
11/14，12/16，14/20，16/22，18/26，20/28。

### 字体角色

字体角色（Font Role）分为 3 类：
大标题 Headline、标题 Title、标签 Label、正文 Body
需要注意的是，这些角色只是推荐的角色指示，并不具有完全的指定性，具体使用什么角色的字体需依照所使用的组件的实际情况（组件内信息的层级重要性，越重要的越大越重）而使用。

### 字体 Token

依照依照 4.1-4.5 规则，设定以下西文字体排版 token：

<img src="/images/callkit/design/cruk146a.png" width="500">

简体中文字体 token 示意：

<img src="/images/callkit/design/cruk146b.png" width="400">

## 效果

所应用的效果（Effects）主要分为两种：背景模糊（Background Blur）和阴影（Shadow）。

### 背景模糊

背景模糊（Background Blur）主要应用于组件背景色使用 Alpha color 时，如组件背景色的透明度会造成组件前后层级干扰的话，则推荐使用背景模糊解决，
也应用于模态显示的弹出层的背景虚化；

背景模糊的模糊半径值默认为 20

```
/* bg_blur_modal */ backdrop-filter: blur(20);
```

### 阴影

阴影（Shadow）应用于弹窗（Alert）、浮层（pop）、抽屉（Drawer）等，为区分层级，凸显聚焦的组件。

#### 阴影型号

阴影分为小（small）、中(medium)、大(Large)三种型号（Size），应用于不同尺寸的组件中，总体原则为：越小的组件越推荐使用小的阴影、反之越大的组件推荐使用大的阴影；圆角越小的组件越推荐使用小的阴影、反之亦然。

#### 阴影 token

为保证阴影效果自然柔和，每个阴影都有两层不同偏移、不同模糊度、不同透明度的值。同时针对亮色/暗色模式有两套不同颜色的阴影。

**Shadow on Light:**

```
/* shadow/onlight/large */
box-shadow: x0 y24 blur36 color(Neutral3) Alpha0.15, x8 y0 blur24 color(Neutral1) Alpha0.1

/* shadow/onlight/medium */
box-shadow: x0 y4 blur4 color(Neutral3) Alpha0.15, x2 y0 blur8  color(Neutral1) Alpha0.1

/* shadow/onlight/small */
box-shadow: x0 y1 blur3 color(Neutral3) Alpha0.15, x1 y0 blur2  color(Neutral1) Alpha0.1
```

<img src="/images/callkit/design/cruk1522a.png" width="600">

**Shadow on Dark:**

```
/* shadow/onlight/large */
box-shadow: x0 y24 blur36 color(Neutral4) Alpha0.15, x8 y0 blur24 color(Neutral1) Alpha0.1

/* shadow/onlight/medium */
box-shadow: x0 y4 blur4 color(Neutral4) Alpha0.15, x2 y0 blur8  color(Neutral1) Alpha0.1

/* shadow/onlight/small */
box-shadow: x0 y1 blur3 color(Neutral4) Alpha0.15, x1 y0 blur2  color(Neutral1) Alpha0.1
```

<img src="/images/callkit/design/cruk1522b.png" width="600">

## 圆角

### 一般圆角

一般圆角（Radius）分为 None（r=0）、Extra Small（r=4）、Small（r=8）、Medium（r=12）、Large（r=16）、Extra Large（r=½ Height）六个枚举值，
一般情况下组件的四个圆角为同一值

<img src="/images/callkit/design/cruk161.png" width="600">

#### Extra Small（r=4）

通常适用于如下组件：
- Button(Small Radius)
- Input(Small Radius)
- Float(Small Radius)
- Message Bubble(Small Radius)
- Avatar(Small Radius)
- Popover
- Global Broadcast(Small Radius)

#### Small（r=8）

通常适用于如下组件：
- Alert(Small Radius)
- Drawer(Small Radius)

#### Medium（r=12）

通常适用于如下组件
本案暂不涉及

#### Large（r=16）

通常适用于如下组件：
- Input Area(Large Radius)
- Alert(Large Radius)
- Drawer(Large Radius)
- Float(Large Radius)

#### Extra Large（r=½ Height）

通常适用于如下组件：
Input Area(Large Radius)
Alert(Large Radius)
Drawer(Large Radius)
Message Bubble(Large Radius)

### 特殊圆角

特殊圆角应用于有背景色的 IM 聊天消息组件：
Message Bubble(Large Radius)

<img src="/images/callkit/design/cruk162.png" width="400">

## 小控件

小控件（Widgets）为最基础的视觉交互模块。

### 按钮

按钮组件(Button)在通话界面开发工具包中仅包含图标按钮一种，分为大、中、小三种尺寸、支持前景色、背景色配置。支持点击操作。

<img src="/images/callkit/design/botton.png" width="500">

### 头像

本项目中的头像(Avatar)组件，复用环信单/群聊人机交互界面工具包的相关组件。依据当前视图需要，显示对应的头像值。

<img src="/images/callkit/design/avatar.png" width="600">

### 文本

本项目中的文本(Text)，分为三种样式：标题(Title)、小标题(Subtitle)、标签(Label)三类。

#### 标题

标题(Title)用于显示当前控件或视图中，最重要的文本信息，对应的字体排版 token 为：Title/Large

<img src="/images/callkit/design/title.png" width="600">

#### 小标题

小标题(Subtitle)用于显示当前控件或视图中，次重要的文本信息，对应的字体排版 token 为：Title/Small

<img src="/images/callkit/design/Subtitle.png" width="600">

#### 标签

标签(Label)用于显示当前控件或视图中，需解释说明的文本，对应的字体排版 token 为：Label/Small(web端)、Label/Extra Small(mobile端)。

<img src="/images/callkit/design/Label.png" width="600">

### 操作项

操作项(Action Item)为控制当前视图功能的主要操作项，如：接听、挂断、麦克风和摄像头的开关等等。支持点击操作
大小（Size）上分为大(Large)、标准(Standard)、小(Small)三种尺寸，状态(Status)上分为普通(Normal)、点按(Pressed)、禁用(Disabled)三种状态，样式上分为开、关两种样式。底部说明文字支持显示/隐藏。

<img src="/images/callkit/design/Action2.png" width="600">

### 流信息

流信息(stream info)用以展示当前视频流的相关信息和状态，支持显示一个名称字段和至多两个icon状态显示。

<img src="/images/callkit/design/info.png" width="400">

### 信号展示

信号展示(Signal)用以展示当前视频流的信号强度，分为未知、信号弱、信号中等、信号强四种状态。

<img src="/images/callkit/design/signal.png" width="400">

### 背景图

背景图(Background Picture)用于界面的背景图展示，支持用户自定义图片。

<img src="/images/callkit/design/bg.png" width="600">

## 控件（Components）

### 顶部条

顶部条（TopBar）用于展示当前视图标题，并可对当前页面进行整体的控制。
支持左侧一个操作(最小化)，右侧一个操作(一般为群组通话添加成员)，并支持两个操作的显示/隐藏。
中间展示三个字段：头像、当前视图名称(title)、附加消息(Subtitle)，并支持显示信息的显示/隐藏。

<img src="/images/callkit/design/header.png" width="600">

### 通话操作

通话操作（Actions）为针对当前会话的相关操作项集合。
操作数量上依照当前视图场景的业务需求可做增减。

<img src="/images/callkit/design/actionslist.png" width="600">

### 视频流

视频流（Video Stream）展示会话中拉到或者本地获取的视频流，左下角展示流信息，右上角展示当前流信号强度。

<img src="/images/callkit/design/stream.png" width="600">

### 视频流列表

在多人会话中，多个视频流组成的列表（Video Stream list），拥有一般列表展示状态和聚焦列表展示状态。

<img src="/images/callkit/design/streamslist.png" width="600">

### 通话浮窗

通话浮窗（PiP）用以在通话最小化时显示会话状态/一对一视频通话中次要视频流的展示，分为群通话、一对一视频通话样式，且悬浮窗可被收起。

<img src="/images/callkit/design/PiP.png" width="400">

### 来电通知

来电通知(Incoming Call Notification)用以在App内与当前通话不相关页面展示时的来电提示。
以条幅通知的形式展示在界面顶部，显示字段有：头像、主标题、次标题、通话成员头像列表；支持接听、挂断、点击展示通话详情三个点击操作。
并依照当前Chat UIKit主题，显示不同的模式(onlight/ondark)。

<img src="/images/callkit/design/callnoti2.png" width="900">

## 视图（View）

## 一对一音频通话视图

一对一音频通话视图(One-on-One Audio Call View) 包括主叫视图(receive)、被叫视图(answer)和通话中视图(calling)。

### 主叫视图

主叫视图(receive)用于一对一音频通话接通前的展示和操作，分为顶部信息、底部操作、背景图三部分。

<img src="/images/callkit/design/audio_receive.png" width="300">

### 被叫视图

被叫视图(answer)用于接到一对一音频通话邀请时的展示和操作，分为顶部信息、底部操作、背景图三部分。

<img src="/images/callkit/design/audio_answer.png" width="300">

### 通话中视图

通话中视图(calling)用于一对一音频通话中的展示和操作，分为顶部信息、底部操作、背景图三部分。

<img src="/images/callkit/design/audio_calling.png" width="300">

## 一对一视频通话视图

一对一视频通话视图(One-on-One Video Call View)包括主叫视图(receive)、被叫视图(answer)和通话中视图(calling)。

### 主叫视图

主叫视图(receive)用于一对一视频通话接通前的展示和操作，分为顶部信息、底部操作、本地视频流展示三部分。

<img src="/images/callkit/design/video_receive.png" width="300">

### 被叫视图

被叫视图(answer)用于接到一对一视频通话邀请的展示和操作，分为顶部信息、底部操作、本地视频流展示三部分。

<img src="/images/callkit/design/video_answer.png" width="300">

### 通话中视图

通话中视图(calling)用于一对一视频通话中的展示和操作，分为顶部信息、底部操作、双方视频流展示三部分。

<img src="/images/callkit/design/video_calling.png" width="300">

## 多人通话视图(Multi Call View)

### 被叫视图

被叫视图(answer)用于接到多人通话接邀请的展示和操作，分为顶部信息、底部操作、本地视频流展示三部分。

<img src="/images/callkit/design/multi_answer.png" width="300">

### 通话中视图

通话中视图(calling)用于多人通话进行中的展示和操作，分为顶部信息、底部操作、多人视频流展示三部分。

<img src="/images/callkit/design/multi_calling.png" width="300">

## 通话相关消息样式

<img src="/images/callkit/design/call_msg.png" width="500">

关于通话相关消息样式（Call Msg），详见 [单/群聊人机交互界面工具包](/uikit/chatuikit/android/chatuikit_design_guide.html)。


## 设计资源

设计资源（Design Resources）详见 [Figma 链接](https://www.figma.com/community/file/1540653110561556906/easemob-callkit)。

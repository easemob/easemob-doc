# Web 端单/群聊人机交互界面工具包设计指南

![img](@static/images/uikit/chatuikit/design/CUIcover2.png)

## 0.总的设计原则

### 0.1.功能与行为上确保通用、普遍、一般

### 0.2.风格上易于自定义

### 0.3.在业务形态上尽量不替用户做决定

## 1.全局样式（Style）

### 1.1.UIkit 色彩规范

#### 1.1.1.颜色配置说明：

##### 1.1.1.1.颜色类（Color Class）

一般颜色类分为八类：
主题色（Theme Color）：Primary、 Secondary、Error 三类；
渐变主题色（Primary Gradient）一类（含 8 种）；
透明色（Alpha Color）：On Light、On Dark 两类；
中性色（Neutral Colors）：Neutral、Neutral Special 两类；

##### 1.1.1.2.颜色模式（Hsla Model）

颜色模式为比较直观的 hsla 模式:
整个模型是一个圆柱体，圆柱体底面周长划分为 360°，对应不同的色相（Hue）;
圆柱体的半径为饱和度（Saturation），圆心为 0（最灰），半径值为 100（最艳）；
圆柱体的高为亮度（Lightness），起始点为 0（纯黑色），中心点是 50(标准色,)，结束点为 100(纯白色)。

##### 1.1.1.3.模型概览：

[img](@static/images/uikit/chatroomdesign/cruk1113.png)

#### 1.1.2.三种主题色（Theme Color）的色彩规范：

##### 1.1.2.1.关于用户可配项（Hue value）：

用户可设定颜色类的可配项 Hue(0-360)为任意数值，修改后每类颜色的色相会发生变化，以贴合用户场景所需要的主题颜色。
Hue 值(0-360)与色相的对应关系大致如以下图示所例：

![img](@static/images/uikit/chatroomdesign/cruk11211.png)

用户可依据自身产品的品牌色指定色相数值（Hue），从而确认主题色 Primary（主要用于 UI 组件中关键操作与重要文本展示，如推荐的 action、高亮显示的文本等），以及用于积极提示的 Secondary，和表示警示提示的 Error。

![img](@static/images/uikit/chatroomdesign/cruk11212.png)

##### 1.1.2.2.关于饱和度（Saturation value）:

饱和度(Saturation)不开放给用户设置，三种主题色 Primary、 Secondary、Error 默认饱和度为 100%，Neutral 默认为 8%，Neutral Special 默认为 36%

![img](@static/images/uikit/chatroomdesign/cruk1122.png)

##### 1.1.2.3.关于亮度级别（Lightness level）:

亮度(Lightness)百分比用户不可随意设置，每个颜色类提供：0(0%) / 1(10%) / 2(20%) / 3(30%) / 4(40%) / 5(50%) / 6(60%) / 7(70%) / 8(80%) / 9(90%) / 95(95%) / 98(98%) / 100(100%)十三个级别供用户可选；

![img](@static/images/uikit/chatroomdesign/cruk1123.png)

##### 1.1.2.4.举个例子吧：

如指定主题色 Primary 色相（Hue）为 203，成功色 Secondary 色相（Hue）为 155，警示色 Error 色相（Hue）为 350，则会生成如下 39 种主题色可供用户在指定 UI 件块（View）颜色时使用：

![img](@static/images/uikit/chatroomdesign/cruk1124.png)

其中，主题色 Primary 的 L5 为亮色模式下的基色（Key Color），L6 为暗色模式下的基色（Key Color）。所有的颜色体系都是依照基色生成。

#### 1.1.3.关于渐变主题色(Primary Gradient)的规范：

渐变主题色是由 Primary 色派生出的渐变色，为线性渐变(Linear Gradient)，渐变方向依图示坐标系分为 8 类：

![img](@static/images/uikit/chatroomdesign/cruk113.png)

##### 1.1.3.1.关于渐变色的起始色(Start Color)：

渐变色中 Start Color 规则和 Primary 类的色值保持一致;

![img](@static/images/uikit/chatroomdesign/cruk1131.png)

##### 1.1.3.2.关于渐变色的结束色(End Color)：

End Color 用户可配置色相（Hue），亮度以 0(20%) / 1(30%) / 2(40%) / 3(50%) / 4(60%) / 5(70%) / 6(75%) / 7(80%) / 8(85%) / 9(90%) / 95(95%) / 98(98%) / 100(100%)（对应 Primary 的 13 级亮度梯度值）为固定梯度值

以下以 Hue：233 为例，按照 End Color 颜色公式依旧得到 13 级颜色：

![img](@static/images/uikit/chatroomdesign/cruk11321.png)

起始色和结束色结合，得到相应的渐变结果

![img](@static/images/uikit/chatroomdesign/cruk11322.png)

##### 1.1.3.3.关于渐变主题色可配项(End Color Hue Value)：

用户仅可配置渐变色中 End Color 的色相（Hue）以达成与用户业务场景符合的渐变颜色效果；

##### 1.1.3.4.举个例子吧:

用户设置 End Color Hue = 233，选择渐变方向为“↓”，则可得到如下效果：

![img](@static/images/uikit/chatroomdesign/cruk11341.png)

如使用渐变主题色，那么它将替代掉所有应用于背景色的 Primary 色

![img](@static/images/uikit/chatroomdesign/cruk11342.png)

但一般不替代 UI 件块的前景色，因为没有什么意义，且有干扰文字阅读的可能性

![img](@static/images/uikit/chatroomdesign/cruk11343.png)

#### 1.1.4.关于透明色(Alpha)的规范：

##### 1.1.4.1.透明色（Alpha Color）:

在本案内带有透明度的组件仅有模态背景色、轻提示背景色，应用范围有限，单独定义两个特殊的颜色类用于以上四种组件：Alpha onlight(hsl0, 0%, 0%) 和 Alpha ondark(hsl0, 0%, 100%)，Alpha 值被指定为 0(0.0) / 1(0.1) / 2(0.2) / 3(0.3) / 4(0.4) / 5(0.5) / 6(0.6) / 7(0.7) / 8(0.8) / 9(0.9) / 95(0.95) / 98(0.98) / 100(1.0) 十三个梯度值，共 26 种颜色用例，以调整组件的背景色透明度。

![img](@static/images/uikit/chatroomdesign/cruk1141.png)

Alpha onlight 和 Alpha ondark 均为默认值，无任何可配置项。

### 1.1.5.关于中性色（Neutral Colors）：

#### 1.1.5.1.中性色（Neutral）

中性色(Neutral)仅有一个可配项：色相（Hue），饱和度(Saturation)固定值为 8，亮度级别（Lightness level）也和主题色相同，分为 0(0%) / 1(10%) / 2(20%) / 3(30%) / 4(40%) / 5(50%) / 6(60%) / 7(70%) / 8(80%) / 9(90%) / 95(95%) / 98(98%) / 100(100%)十三个级别供用户可选；

![img](@static/images/uikit/chatroomdesign/cruk1151.png)

Neutral 和 Primary 的默认 Hue 值(色相)相同，也建议用户设置和主题色相同的 Hue 值已达成主题颜色和无彩色系的配套。但这仅仅是建议；

#### 1.1.5.2.举个例子吧：

如指定主题色 Primary 色相（Hue）为 203，饱和度(Saturation)固定值为 100%，中性色（Neutral）则也指定色相（Hue）为 203，饱和度(Saturation)固定值为 8%，则得到以下色列可供用户选择使用：

![img](@static/images/uikit/chatroomdesign/cruk11521.png)

其中，L98 为亮色模式下背景色的主色，L1 为亮色模式下前景色的主色；L1 为暗色模式下背景色的主色，L98 为暗色模式下前景色的主色。

![img](@static/images/uikit/chatroomdesign/cruk11522.png)

### 1.1.6.关于特殊中性色（Neutral Special）：

特殊中性色 Neutral Special 主要用于级别低于 Primary 和 Secondary 的强调信息，如当前页面状态、消息发送者的昵称等。
Neutral Special 和 Primary 的默认 Hue 值(色相)类似，为近似色，也建议用户设置和主题色近似的 Hue 值已达成主题色和无彩色系的配套。但这仅仅是建议；

![img](@static/images/uikit/chatroomdesign/cruk116a.png)

![img](@static/images/uikit/chatroomdesign/cruk116b.png)

#### 1.1.6.1.举个例子吧：

如指定主题色 Primary 色相（Hue）为 203，特殊中性色（Neutral）通过相似色原理（正负 30 度内）指定色相（Hue）为 220，饱和度(Saturation)固定值为 36%，则得到以下色列可供用户选择使用：

![img](@static/images/uikit/chatroomdesign/cruk1161.png)

## 1.2.主题

本期主题分为 2 种，每种分明亮（Light mode）和黑暗（Dark）两类。

### 1.2.1.圆润主题

组件一般采用较大的圆角，柔和轻盈

![image text](@static/images/uikit/chatuikit/design/1.2.1.png)

### 1.2.2.硬朗主题

组件一般避免比较大的圆角，硬朗实在

![image text](@static/images/uikit/chatuikit/design/1.2.2.png)

以上两种主题可通过应用渐变主题色（Primary Gradient）得到两外两种渐变色主题。
至于业务相关的主题，如“社交”、“游戏”、“教育”、“商务”等主题分类，因违反本案的最基本设计原则“在业务形态上尽量不替用户做决定”，所以不在本期考虑范围内。

## 1.3.图标（Icon）

### 1.3.1.图标模板（Template）

图标参照 Material Icon Font 的模板 ，以 24 为基本栅格，须在安全区域(20x20 的中心区域)内绘制，基本描边控制为 1.5 栅格。

![img](@static/images/uikit/chatroomdesign/cruk131.png)

### 1.3.2 图标命名（Name）

为防止将图标语意固定，icon 命名需要尽力避免定义操作行为，而是以“看见什么就是什么“进行命名，方便相同图标在不同操作行为下的复用。
如

![img](@static/images/uikit/chatroomdesign/cruk132.png)

## 1.4.字体（Typography）

### 1.4.1.字族（Font Family）

#### 1.4.1.1.iOS 字族

默认 SF Pro 为基本西文（拉丁字母、希腊字母、西里尔字母等）字体；
默认 SF Arabic、SF Hebrew 等为基本右向左（Dextral-sinistral）文字字体；
默认苹方（PingFang SC、TC、HK）为中文（简体中文、繁体中文、香港繁体中文）字体；

#### 1.4.1.2.Android 字族

默认 Roboto 为基本西文（拉丁字母、希腊字母、西里尔字母等）字体；
默认 Noto Sans Arabic、Noto Sans Hebrew 等为基本右向左（Dextral-sinistral）文字字体；
默认思源黑体（Noto Sans SC、TC、HK）为中文（简体中文、繁体中文、香港繁体中文）字体；

#### 1.4.1.3.Web 字族

默认 Roboto 为基本西文（拉丁字母、希腊字母、西里尔字母等）字体；
默认 Noto Sans Arabic、Noto Sans Hebrew 等为基本右向左（Dextral-sinistral）文字字体；
默认思源黑体（Noto Sans SC、TC、HK）为中文（简体中文、繁体中文、香港繁体中文）字体；

### 1.4.2.字号（Font Size）

#### 1.4.2.1.最小字号

移动端最小字号为：11；web 端最小字号为：12

#### 1.4.2.2.字号规则

除移动端最小字号外，字号以 2 为梯度递增：
11，12，14，16，18，20

### 1.4.3.字重（Font Weight）

字重分为标准（Regular, 400）、中等（Medium,510）、加粗（semibold,590）三种；
在一些跨平台框架中，如遇不支持设置非百位整数字重，则取近似值百位整数；
如字族没有 semibold，则以 bold 替换。

### 1.4.4.行高（Line height）

行高依照以下固定值（字号/行高）：
11/14，12/16，14/20，16/22，18/26，20/28。

### 1.4.5.字体角色（Font Role）

字体角色分为 3 类：
大标题 Headline、标题 Title、标签 Label、正文 Body
需要注意的是，这些角色只是推荐的角色指示，并不具有完全的指定性，具体使用什么角色的字体需依照所使用的组件的实际情况（组件内信息的层级重要性，越重要的越大越重）而使用。

### 1.4.6.字体 Token

依照依照 4.1-4.5 规则，设定以下西文字体排版 token，

<img src="@static/images/uikit/chatroomdesign/cruk146a.png" width="600" >

简体中文字体 token 示意

<img src="@static/images/uikit/chatroomdesign/cruk146b.png" width="600" >

## 1.5.效果（Effects）

所应用的效果主要分为两种：背景模糊（Background Blur）和阴影（Shadow）

### 1.5.1.背景模糊（Background Blur）

背景模糊主要应用于组件背景色使用 Alpha color 时，如组件背景色的透明度会造成组件前后层级干扰的话，则推荐使用背景模糊解决，
也应用于模态显示的弹出层的背景虚化；

背景模糊的模糊半径值默认为 20

```
/* bg_blur_modal */ backdrop-filter: blur(20);
```

### 1.5.2.阴影（Shadow）

阴影应用于弹窗（Alert）、浮层（pop）、抽屉（Drawer）等，为区分层级，凸显聚焦的组件。

#### 1.5.2.1.阴影型号（Size）

阴影分为小（small）、中(medium)、大(Large)三种型号，应用于不同尺寸的组件中，总体原则为：越小的组件越推荐使用小的阴影、反之越大的组件推荐使用大的阴影；圆角越小的组件越推荐使用小的阴影、反之亦然。

#### 1.5.2.2.阴影 token

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

![img](@static/images/uikit/chatroomdesign/cruk1522a.png)

**Shadow on Dark:**

```
/* shadow/onlight/large */
box-shadow: x0 y24 blur36 color(Neutral4) Alpha0.15, x8 y0 blur24 color(Neutral1) Alpha0.1

/* shadow/onlight/medium */
box-shadow: x0 y4 blur4 color(Neutral4) Alpha0.15, x2 y0 blur8  color(Neutral1) Alpha0.1

/* shadow/onlight/small */
box-shadow: x0 y1 blur3 color(Neutral4) Alpha0.15, x1 y0 blur2  color(Neutral1) Alpha0.1
```

![img](@static/images/uikit/chatroomdesign/cruk1522b.png)

## 1.6.圆角（Radius）

### 1.6.1.一般圆角

一般圆角分为 None（r=0）、Extra Small（r=4）、Small（r=8）、Medium（r=12）、Large（r=16）、Extra Large（r=½ Height）六个枚举值，
一般情况下组件的四个圆角为同一值

![img](@static/images/uikit/chatroomdesign/cruk161.png)

#### 1.6.1.1.Extra Small（r=4）

通常适用于如下组件
Button(Small Radius)
Input(Small Radius)
Float(Small Radius)
Message Bubble(Small Radius)
Avatar(Small Radius)
Popover
Global Broadcast(Small Radius)

#### 1.6.1.2.Small（r=8）

通常适用于如下组件
Alert(Small Radius)
Drawer(Small Radius)

#### 1.6.1.3.Medium（r=12）

通常适用于如下组件
本案暂不涉及

#### 1.6.1.4.Large（r=16）

通常适用于如下组件
Input Area(Large Radius)
Alert(Large Radius)
Drawer(Large Radius)
Float(Large Radius)

#### 1.6.1.5. Extra Large（r=½ Height）

通常适用于如下组件
Input Area(Large Radius)
Alert(Large Radius)
Drawer(Large Radius)
Message Bubble(Large Radius)

### 1.6.2.特殊圆角

特殊圆角应用于有背景色的 IM 聊天消息组件：
Message Bubble(Large Radius)

<img src="@static/images/uikit/chatroomdesign/cruk162.png" width="390" >

## 2.小控件（Widgets）
小控件为最基础的视觉交互模块。

### 2.1.按钮(Bottom)
按钮组件分为普通按钮、文本按钮、图标按钮三种，每种包含的状态有 Enabled、Hovered(限 web 端) 、Pressed、Loading、Pressed 五种状态，同时分为大、中、小三种按钮尺寸以贴合不同容器的使用。

### 2.1.1.普通按钮（Normal）

普通按钮分主要操作（Primary）和次要操作（Secondary）两种类型。

#### 2.1.1.1.主要操作（Primary）

主要操作用于推荐行为，一般背景色为主题色(Primary5\Primary6)或者渐变主题色，被禁用时置灰显示，圆角可配，依据需要可增加左侧或右侧 icon

![img](@static/images/uikit/chatroomdesign/cruk2111.png)

#### 2.1.1.2.次要操作（Secondary）

次要操作用于辅助主要操作，一般不单独出现，一般背景色为亮色(Neutral98)或者暗色(Neutral1)，同时有描边，被禁用时置灰显示，圆角可配
依据需要可增加左侧或右侧 icon

![img](@static/images/uikit/chatroomdesign/cruk2112.png)

### 2.1.2.文字按钮(Text)

文字按钮仅有前景色，也分为主要操作和次要操作，一般用于更频繁的常规操作（如表单填写的下一步、取消，消息的显示、隐藏等）或者在页面有普通按钮（主要操作）时作为更次一级操作出现

![img](@static/images/uikit/chatroomdesign/cruk212.png)

### 2.1.3.图标按钮（Icon）

图标按钮为组件位置局促又必须出现按钮时的补充形式，如输入条的键盘切换、顶部条的更多操作、表单填写时的推荐操作、输入框的清空和下拉操作等。

![img](@static/images/uikit/chatroomdesign/cruk213.png)

需要注意的是，在 web 端，如非特殊说明，图标按钮必须搭配 Popover 使用，以交代清楚按钮的具体操作行为。如：

![img](@static/images/uikit/chatroomdesign/cruk213b.png)

### 2.2.输入框(Input)

输入框为需要输入较少文字时使用的组件。
也按照所放组件的大小分为大中小三种尺寸可配项，样式上，背景色和描边颜色可开关，圆角可配，状态上分为失焦未填写、失焦填写、聚焦未填写、聚焦填写、禁用填写、禁用未填写六种。

<img src="@static/images/uikit/chatroomdesign/cruk22.png" width="390" >

### 2.3.输入区域(InputArea)

输入框为需要输入较多文字时使用的组件。
在用于输入器的文本输入，和表单中、发布内容时需要填写较多文本时使用，样式上，背景色和描边颜色可开关，圆角可配，可显示最大输入字符数分数。状态上分为失焦未填写、失焦填写、聚焦未填写、聚焦填写、禁用填写、禁用未填写六种。

<img src="@static/images/uikit/chatroomdesign/cruk23.png" width="390" >

### 2.4.单选器和多选器(Checkboxes n' Radios)
单选器和多选器允许终端用户在列表中选择一项或者多项。分为选中、未选中、选中禁用、未选中禁用四种状态。


### 2.5.开关(Switch)
开关为终端用户对列表项打开和关闭的直观操作。
分为关闭、打开、关闭禁用、打开禁用四中状态。
此操作一般需要避免自动化开启和关闭，必须终端用户主动操作。

样式采用iOS或Material 默认样式，开启颜色对应Primary5/Primary6的KeyColor色值。


### 2.6.滑块(Slider)
滑块用于终端用户精确设置数值。
可配项有：两侧图标或单侧数值，状态上分为禁用和可用。

### 2.7.浮层菜单(PopMenu)
浮层菜单为非常住的的选项或列表的展示。支持配置操作项有无左侧icon

### 2.8.头像(Avatar)
头像是一类信息数据展示的控件，如用户、某个操作项的头像展示，常放置于个人信息页、与用户相关的列表项中
头像圆角有两个枚举值：Extra Small（r=4）、Extra Large（r=½ Height）以配合不同主题的使用
头像的尺寸可以依据所属组件的大小自由配置，但需要注意的是，头像的比例永远是 1:1

### 2.8.1.图片头像

能读取用户头像信息时展示图片头像。

![img](@static/images/uikit/chatroomdesign/cruk241.png)

### 2.8.2.字符头像

用户未上传头像时显示字符头像，字符头像分为单字符和双字符两种

![img](@static/images/uikit/chatroomdesign/cruk242.png)

### 2.8.3.组合头像

组合头像用于用户未上传数据时的群组聊天自动生成头像
本案不涉及

![img](@static/images/uikit/chatroomdesign/cruk243.png)

### 2.8.4.图标头像

图标头像用于获取不到用户头像信息的空状态以及表单单项有 icon 时的头像。

![img](@static/images/uikit/chatroomdesign/cruk244.png)

### 2.8.5.头像徽章

头像可配置徽章（Badge）以体现用户的在离线等状态，徽章位置分两种：右下和右上

<img src="@static/images/uikit/chatroomdesign/cruk245.png" width="440" >

### 2.9.徽章(Badge)
徽章用于导航项、列表项、头像处，用于显示状态、通知和计数。
配置项有：计数的有无、标准和小、icon的有无。
(配图)

### 2.10.表情符号(Emojis)

### 2.10.1.Twemoji [↗](https://github.com/twitter/twemoji)

表情使用开源可免费商用的 Twemoji 作为基本表情，默认提供 52 个表情作为内置的表情，用户可根据自己的产品规划从 twemoji 提供的 3,245 个表情中进行替换增减；

![img](@static/images/uikit/chatroomdesign/cruk291.png)
### 2.10.2.表情模版(Emoji Template)

如用户需替换 Twemoji，或者需要自己创作表情，需依照以下模板进行替换或绘制；

![img](@static/images/uikit/chatroomdesign/cruk292.png)

### 2.10.3.表情组件状态（State）

表情组件的状态分为以下 4 种：
启用 Enabled、悬停 Hovered（仅限 web 端）、按下 Pressed、聚焦 Focused（本案不涉及）
悬停时，背景色递增一级；按下时，背景色递减一级；聚焦时，背景色转换为 Key Color。

![img](@static/images/uikit/chatroomdesign/cruk293.png)

### 2.11.轻提示(Toast)
请提示为针对终端用户当前操作的简单反馈。
分为有图标、无图标两类。

### 2.12.模态背景(Model)
模态为临时的弹出的关键信息，需要用户主动操作来退出。
模态背需配合弹窗(Alert)使用。颜色可配置为任意AlphaColor，也可设置背景模糊效果。
(配图)

### 2.13.索引(Index)
索引应用于联系人页面通过分类迅速查找联系人。

#### 2.13.1.目录索引(SectionIndex)
目录索引位于联系人或成员列表最右侧，为快速通过字母定位到相关联系人的滚动条。

#### 2.13.2.列表索引(IndexInList)
列表内的索引用于不同字母分类的联系人的分割。可以配置是否有底部分割线。

### 2.14.底部标签栏(BottomTabs)
底部导航栏应用于移动设备上不同视图(View)的切换，最少两个切换项，超过5个项时分页展示。

### 2.15.顶部标签栏(TopTabs)
顶部部导航栏应用于移动设备上不同视图(View)的切换，最少一个项，超过5个项时分页展示。

## 3.控件（Components）

### 3.1.顶部条（TopBar）
顶部条用于展示当前视图标题，并可对当前页面进行整体的控制。
左侧支持配置返回操作、支持有/无头像、支持有/无小标题，右侧支持 1 至 3 个action。

### 3.2.搜索条（SearchBar）
搜索条用于搜索当前页面的项。
可配项有左侧返回icon、是否显示取消按钮。

### 3.3.底部条（BottomBars）

#### 3.3.1.底部操作条(navigation_bar)
底部操作条用于针对当前视图的操作，最少支持一项，最多支持三项，操作按钮支持配置为文本按钮或图标按钮。

#### 3.3.2.输入条(InputBar)

输入条为会话详情页文本等消息的发布器。
可配置左侧actionbtn、右侧Action1、Action2、Action3、sendbtn
样式上支持配置顶部分割线、输入框圆角样式、sendbtn可配置为文本按钮或者图标按钮。

#### 3.3.3.录音浮层(RecordingModel)
录音浮层为录制和发送语音消息的控件。

### 3.4.表情盘(EmojisPick)

表情键盘是发送 app 内自建表情的键盘，内容上支持表情个数的增减，底部发送和退格按钮支持修改圆角。同时应满足接入第三方表情/贴纸库。

![img](@static/images/uikit/chatroomdesign/cruk34.png)

本键盘不同于系统自带的 emoji 输入键盘，通过此组件输入的 emoji 不会同步为系统的 emoji，而是在任何平台同一 app 内均显示 app 内自建的表情符号。为满足版权方面的法律要求，请勿使用非申明开源可免费商用的表情符号（不限资源图或者源码）在 App 中（如：集成苹果表情符号在自己的 app 内，这样或许会导致 App 无法上架苹果应用商店）

### 3.5.列表项(ListItem)

#### 3.5.1.表单列表项(FromItem)
表单列表项应用再联系人/群组详情页面/App设置页面的表单中，
支持点击事件、右侧可配置按钮、数据展示、开关、滑动条、单/多选器等功能，左侧可配置单/多选器。
信息展示上可配置左侧头像、subtitle、列表项的分类标题（Headline）和注解（postil）

#### 3.5.2.会话列表项(ConversationItem)
会话列表项为会话详情的入口，可展示的信息有:联系人头像(Avatar)、联系人昵称(Title)、最新消息（Subtitle）、新消息通知（Badge）、新消息时间戳（Time）。
样式上支持头像配置大/小圆角、是否配置列表项的分割线。

#### 3.5.3.联系人列表项(ContactsItem)
联系人列表项为联系人详情的入口，可展示的信息有:联系人头像(Avatar)、联系人昵称(Title)、联系人状态（Subtitle）。
样式上支持头像配置大/小圆角、是否配置列表项的分割线。

### 3.6.弹窗(Alert)
弹窗通知是一类模态提示，会提示用户正在进行的操作所需的关键信息，如警告等，或需要用户填写关键信息（通过输入框），需用户做出主要操作或次要操作。
内容上，description 可配、输入框可配、操作项支持最多三个。
样式上，弹窗的圆角可配，需要注意的是，组件内部的输入框和操作按钮圆角需要同弹窗按钮的圆角适配，以达成风格的一致性。

![img](@static/images/uikit/chatroomdesign/cruk27.png)

### 3.7.操作面板(ActionSheet)
操作表单是以模态形式展示的多操作项表单，单个操作项分为 Enabled、Pressed、Disabled、Destructived 四种状态，以及 Cancel 特殊类型。同时可配置是否显示 icon、是否有分割线(stroke)
此组件仅限移动端

<img src="@static/images/uikit/chatroomdesign/cruk25.png" width="390" >


## 4.消息气泡(MessageBubble)

### 4.1.文本消息(TextsMsg)
文本消息为发送字符和emoji表情时使用的气泡样式。

### 4.2.语音消息(AudioMsg)
文本消息为发送语音时使用的气泡样式。
气泡宽度会随着语音消息的时长而改变宽度。支持点击后播放。播放中有动画显示。

### 4.3.文件消息(FileMsg)
文件消息为发送文件时候展示的气泡样式。
支持显示的字段有：文件图标、文件名（Title）、文件大小（Subtitle）

### 4.4.联系人消息(ContactMsg)
联系人消息为一种展示联系人的气泡样式，支持点击事件，
支持显示的字段有：联系人头像、联系人昵称（Title）

### 4.5.缩略图消息(ImgMsg)
缩略图消息为发送图片和视频消息时的消息气泡。
展示规则:


### 4.6.顶部附加消息(DescantMsg)
顶部附加消息为本消息的附属信息的展示，如：消息的回复（Reply）
支持点击事件

### 4.7.底部附加消息(OrganumMsg)
*本期不涉及*

### 4.8.消息的长按操作列表(MsgActionSheet)
支持对当前消息进行复制、编辑、撤回、回复等的操作。

## 5.模块视图（Module View）

### 5.1.会话视图(ConversationView)

#### 5.1.1.会话列表(ConversationList)
会话视图为会话搜索、会话列表项组合而成的页面。

#### 5.1.2.新会话(NewMsg)
通过会话右上角action调取的操作列表，可以此发起会话、创建群、添加联系人。
##### 5.1.2.1. 发起会话(StartConversation)
点击此项将调取联系人列表，终端用户可点选或者搜索联系人，点击后将进入会话详情页面，用户可以通过发送消息发起会话。
##### 5.1.2.2. 创建群组(CreateGroup)
点击此项将调取多选状态的联系人列表，终端用户在此页面点选群组成员，当群成员≥2(包含群主和群成员)时，用户可以点击创建进入群组会话详情页面，以创建一个群组。
##### 5.1.2.3. 添加联系人(Addcontact)
点击此项将大家添加联系人弹窗，终端用户输入要添加的联系人ID后发送添加信息。

### 5.2.联系人视图(ContactsView)
联系人视图是联系人搜索、联系人列表项组合而成的页面。

#### 5.2.2.新申请列表(NewRequest)
如用户收到添加联系人的申请，将在此展示相关信息。用户可以通过添加操作处理联系人添加请求。

#### 5.2.3.群组列表(GroupList)
将在此展示用户加入的所有群。用户可以通过添加操作处理联系人添加请求。

### 5.3.会话详情视图(ConversationDetailView)
会话详情为群聊或者群组聊天的详情页面
页面分为header(展示会话title信息)，body（消息气泡列表），footer（消息发送三部分）

#### 5.3.1.会话的顶部导航栏(header)
顶部导航栏承接两项主要功能：

1)会话关键信息的展示：联系人/群的头像、联系人昵称/群名称、联系人的在/离线状态等

2)关于相关会话的操作：退出会话、查看联系人/群详情、针对当前会话的 1-3 个操作

#### 5.3.2.消息气泡列表(body)
会话内成员所发送的消息将以时间的先后顺序在此视图内进行由上到下的排列。

#### 5.3.3.消息的发送(footer)
用于发送文本、语音、附件、自定义消息。

### 5.4.联系人详情视图（ContactDetailView）
联系人详情为联系人详情展示的页面，主要展示联系人头像、昵称、ID等联系人信息；
支持在本页面操作联系人免打扰、联系人删除操作；
支持在本页面进入消息详情等入口；

### 5.5.群组详情视图(GroupDetailView)
群组详情为群组详情展示的页面，主要展示群组头像、群组名称、群ID等群组信息；
支持在本页面操作群组免打扰、退出群组等操作；
管理员（Owner和Admins）支持修改群信息（群名称、群详情等），支持群主（Owner）转让群主身份和解散群组；
支持在本页面进入消息详情等入口；

## 6.设计资源（Design Resources）
设计资源详见 [figma 链接](https://www.figma.com/community/file/1327193019424263350/chat-uikit-for-mobile)。

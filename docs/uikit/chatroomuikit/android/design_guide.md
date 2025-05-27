# 直播聊天室人机交互界面工具包设计指南 (V1.0.0)

<Toc />

![img](/images/uikit/chatroomdesign/crukcover_ease.png)

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

![img](/images/uikit/chatroomdesign/cruk1113.png)

#### 1.1.2.三种主题色（Theme Color）的色彩规范：

##### 1.1.2.1.关于用户可配项（Hue value）：

用户可设定颜色类的可配项 Hue(0-360)为任意数值，修改后每类颜色的色相会发生变化，以贴合用户场景所需要的主题颜色。
Hue 值(0-360)与色相的对应关系大致如以下图示所例：

![img](/images/uikit/chatroomdesign/cruk11211.png)

用户可依据自身产品的品牌色指定色相数值（Hue），从而确认主题色 Primary（主要用于 UI 组件中关键操作与重要文本展示，如推荐的 action、高亮显示的文本等），以及用于积极提示的 Secondary，和表示警示提示的 Error。

![img](/images/uikit/chatroomdesign/cruk11212.png)

##### 1.1.2.2.关于饱和度（Saturation value）:

饱和度(Saturation)不开放给用户设置，三种主题色 Primary、 Secondary、Error 默认饱和度为 100%，Neutral 默认为 8%，Neutral Special 默认为 36%

![img](/images/uikit/chatroomdesign/cruk1122.png)

##### 1.1.2.3.关于亮度级别（Lightness level）:

亮度(Lightness)百分比用户不可随意设置，每个颜色类提供：0(0%) / 1(10%) / 2(20%) / 3(30%) / 4(40%) / 5(50%) / 6(60%) / 7(70%) / 8(80%) / 9(90%) / 95(95%) / 98(98%) / 100(100%)十三个级别供用户可选；

![img](/images/uikit/chatroomdesign/cruk1123.png)

##### 1.1.2.4.示例：

如指定主题色 Primary 色相（Hue）为 203，成功色 Secondary 色相（Hue）为 155，警示色 Error 色相（Hue）为 350，则会生成如下 39 种主题色可供用户在指定 UI 件块（View）颜色时使用：

![img](/images/uikit/chatroomdesign/cruk1124.png)

其中，主题色 Primary 的 L5 为亮色模式下的基色（Key Color），L6 为暗色模式下的基色（Key Color）。所有的颜色体系都是依照基色生成。

#### 1.1.3.关于渐变主题色(Primary Gradient)的规范：

渐变主题色是由 Primary 色派生出的渐变色，为线性渐变(Linear Gradient)，渐变方向依图示坐标系分为 8 类：

![img](/images/uikit/chatroomdesign/cruk113.png)

##### 1.1.3.1.关于渐变色的起始色(Start Color)：

渐变色中 Start Color 规则和 Primary 类的色值保持一致;

![img](/images/uikit/chatroomdesign/cruk1131.png)

##### 1.1.3.2.关于渐变色的结束色(End Color)：

End Color 用户可配置色相（Hue），亮度以 0(20%) / 1(30%) / 2(40%) / 3(50%) / 4(60%) / 5(70%) / 6(75%) / 7(80%) / 8(85%) / 9(90%) / 95(95%) / 98(98%) / 100(100%)（对应 Primary 的 13 级亮度梯度值）为固定梯度值

以下以 Hue：233 为例，按照 End Color 颜色公式依旧得到 13 级颜色：

![img](/images/uikit/chatroomdesign/cruk11321.png)

起始色和结束色结合，得到相应的渐变结果

![img](/images/uikit/chatroomdesign/cruk11322.png)

##### 1.1.3.3.关于渐变主题色可配项(End Color Hue Value)：

用户仅可配置渐变色中 End Color 的色相（Hue）以达成与用户业务场景符合的渐变颜色效果；

##### 1.1.3.4.举个例子吧:

用户设置 End Color Hue = 233，选择渐变方向为“↓”，则可得到如下效果：

![img](/images/uikit/chatroomdesign/cruk11341.png)

如使用渐变主题色，那么它将替代掉所有应用于背景色的 Primary 色

![img](/images/uikit/chatroomdesign/cruk11342.png)

但一般不替代 UI 件块的前景色，因为没有什么意义，且有干扰文字阅读的可能性

![img](/images/uikit/chatroomdesign/cruk11343.png)

#### 1.1.4.关于透明色(Alpha)的规范：

##### 1.1.4.1.透明色（Alpha Color）:

在本案内带有透明度的组件仅有弹幕消息背景色、礼物消息背景色、模态背景色、轻提示背景色四种，应用范围有限，所以单独定义两个特殊的颜色类用于以上四种组件：Alpha onlight(hsl0, 0%, 0%) 和 Alpha ondark(hsl0, 0%, 100%)，Alpha 值被指定为 0(0.0) / 1(0.1) / 2(0.2) / 3(0.3) / 4(0.4) / 5(0.5) / 6(0.6) / 7(0.7) / 8(0.8) / 9(0.9) / 95(0.95) / 98(0.98) / 100(1.0) 十三个梯度值，共 26 种颜色用例，以调整组件的背景色透明度。

![img](/images/uikit/chatroomdesign/cruk1141.png)

Alpha onlight 和 Alpha ondark 均为默认值，无任何可配置项。

### 1.1.5.关于中性色（Neutral Colors）：

#### 1.1.5.1.中性色（Neutral）

中性色(Neutral)仅有一个可配项：色相（Hue），饱和度(Saturation)固定值为 8，亮度级别（Lightness level）也和主题色相同，分为 0(0%) / 1(10%) / 2(20%) / 3(30%) / 4(40%) / 5(50%) / 6(60%) / 7(70%) / 8(80%) / 9(90%) / 95(95%) / 98(98%) / 100(100%)十三个级别供用户可选；

![img](/images/uikit/chatroomdesign/cruk1151.png)

Neutral 和 Primary 的默认 Hue 值(色相)相同，也建议用户设置和主题色相同的 Hue 值已达成主题颜色和无彩色系的配套。但这仅仅是建议；

#### 1.1.5.2.示例：

如指定主题色 Primary 色相（Hue）为 203，饱和度(Saturation)固定值为 100%，中性色（Neutral）则也指定色相（Hue）为 203，饱和度(Saturation)固定值为 8%，则得到以下色列可供用户选择使用：

![img](/images/uikit/chatroomdesign/cruk11521.png)

其中，L98 为亮色模式下背景色的主色，L1 为亮色模式下前景色的主色；L1 为暗色模式下背景色的主色，L98 为暗色模式下前景色的主色。

![img](/images/uikit/chatroomdesign/cruk11522.png)

### 1.1.6.关于特殊中性色（Neutral Special）：

特殊中性色 Neutral Special 主要用于级别低于 Primary 和 Secondary 的强调信息，如当前页面状态、消息发送者的昵称等。
Neutral Special 和 Primary 的默认 Hue 值(色相)类似，为近似色，也建议用户设置和主题色近似的 Hue 值已达成主题色和无彩色系的配套。但这仅仅是建议；

![img](/images/uikit/chatroomdesign/cruk116a.png)

![img](/images/uikit/chatroomdesign/cruk116b.png)

#### 1.1.6.1.示例：

如指定主题色 Primary 色相（Hue）为 203，特殊中性色（Neutral）通过相似色原理（正负 30 度内）指定色相（Hue）为 220，饱和度(Saturation)固定值为 36%，则得到以下色列可供用户选择使用：

![img](/images/uikit/chatroomdesign/cruk1161.png)

## 1.2.主题

本期主题分为 2 种，每种分明亮（Light mode）和黑暗（Dark）两类。

### 1.2.1.圆润主题

组件一般采用较大的圆角，柔和轻盈

![img](/images/uikit/chatroomdesign/cruk121.png)

### 1.2.2.硬朗主题

组件一般避免比较大的圆，硬朗实在

![img](/images/uikit/chatroomdesign/cruk122.png)

以上两种主题可通过应用渐变主题色（Primary Gradient）得到两外两种渐变色主题。
至于业务相关的主题，如“社交”、“游戏”、“教育”、“商务”等主题分类，因违反本案的最基本设计原则“在业务形态上尽量不替用户做决定”，所以不在本期考虑范围内。

## 1.3.图标（Icon）

### 1.3.1.图标模板（Template）

图标参照 Material Icon Font 的模板 ，以 24 为基本栅格，须在安全区域(20x20 的中心区域)内绘制，基本描边控制为 1.5 栅格。

![img](/images/uikit/chatroomdesign/cruk131.png)

### 1.3.2 图标命名（Name）

为防止将图标语意固定，icon 命名需要尽力避免定义操作行为，而是以“看见什么就是什么“进行命名，方便相同图标在不同操作行为下的复用。
如

![img](/images/uikit/chatroomdesign/cruk132.png)

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

<img src="/images/uikit/chatroomdesign/cruk146a.png" width="600" >

简体中文字体 token 示意

<img src="/images/uikit/chatroomdesign/cruk146b.png" width="600" >

## 1.5.效果（Effects）

所应用的效果主要分为两种：背景模糊（Background Blur）和阴影（Shadow）

### 1.5.1.背景模糊（Background Blur）

背景模糊主要应用于组件背景色使用 Alpha color 时，如组件背景色的透明度会造成组件前后层级干扰的话，则推荐使用背景模糊解决，比如：

![img](/images/uikit/chatroomdesign/cruk151.png)

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

![img](/images/uikit/chatroomdesign/cruk1522a.png)

**Shadow on Dark:**

```
/* shadow/onlight/large */
box-shadow: x0 y24 blur36 color(Neutral4) Alpha0.15, x8 y0 blur24 color(Neutral1) Alpha0.1

/* shadow/onlight/medium */
box-shadow: x0 y4 blur4 color(Neutral4) Alpha0.15, x2 y0 blur8  color(Neutral1) Alpha0.1

/* shadow/onlight/small */
box-shadow: x0 y1 blur3 color(Neutral4) Alpha0.15, x1 y0 blur2  color(Neutral1) Alpha0.1
```

![img](/images/uikit/chatroomdesign/cruk1522b.png)

## 1.6.圆角（Radius）

### 1.6.1.一般圆角

一般圆角分为 None（r=0）、Extra Small（r=4）、Small（r=8）、Medium（r=12）、Large（r=16）、Extra Large（r=½ Height）六个枚举值，
一般情况下组件的四个圆角为同一值

![img](/images/uikit/chatroomdesign/cruk161.png)

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

<img src="/images/uikit/chatroomdesign/cruk162.png" width="390" >

本案不涉及。

# 2.基础组件（Widgets）

## 2.1.按钮组件(Button)

按钮组件分为普通按钮、文本按钮、图标按钮三种，每种包含的状态有 Enabled、Hovered(限 web 端) 、Pressed、Loading、Pressed 五种状态，同时分为大、中、小三种按钮尺寸以贴合不同容器的使用。

### 2.1.1.普通按钮（Normal）

普通按钮分主要操作（Primary）和次要操作（Secondary）两种类型。

#### 2.1.1.1.主要操作（Primary）

主要操作用于推荐行为，一般背景色为主题色(Primary5\Primary6)或者渐变主题色，被禁用时置灰显示，圆角可配，依据需要可增加左侧或右侧 icon

![img](/images/uikit/chatroomdesign/cruk2111.png)

#### 2.1.1.2.次要操作（Secondary）

次要操作用于辅助主要操作，一般不单独出现，一般背景色为亮色(Neutral98)或者暗色(Neutral1)，同时有描边，被禁用时置灰显示，圆角可配
依据需要可增加左侧或右侧 icon

![img](/images/uikit/chatroomdesign/cruk2112.png)

### 2.1.2.文字按钮(Text)

文字按钮仅有前景色，也分为主要操作和次要操作，一般用于更频繁的常规操作（如表单填写的下一步、取消，消息的显示、隐藏等）或者在页面有普通按钮（主要操作）时作为更次一级操作出现

![img](/images/uikit/chatroomdesign/cruk212.png)

### 2.1.3.图标按钮（Icon）

图标按钮为组件位置局促又必须出现按钮时的补充形式，如输入条的键盘切换、顶部条的更多操作、表单填写时的推荐操作、输入框的清空和下拉操作等。

![img](/images/uikit/chatroomdesign/cruk213.png)

需要注意的是，在 web 端，如非特殊说明，图标按钮必须搭配 Popover 使用，以交代清楚按钮的具体操作行为。如：

![img](/images/uikit/chatroomdesign/cruk213b.png)

## 2.2.输入框组件(Input)

输入框为需要输入较少文字时使用的组件。
也按照所放组件的大小分为大中小三种尺寸可配项，样式上，背景色和描边颜色可开关，圆角可配，状态上分为失焦未填写、失焦填写、聚焦未填写、聚焦填写、禁用填写、禁用未填写六种。

<img src="/images/uikit/chatroomdesign/cruk22.png" width="390" >

## 2.3.输入域组件(Input Area)

输入框为需要输入较多文字时使用的组件。
在用于输入器的文本输入，和表单中、发布内容时需要填写较多文本时使用，样式上，背景色和描边颜色可开关，圆角可配，可显示最大输入字符数分数。状态上分为失焦未填写、失焦填写、聚焦未填写、聚焦填写、禁用填写、禁用未填写六种。

<img src="/images/uikit/chatroomdesign/cruk23.png" width="390" >

## 2.4.头像组件(Avatar)

头像组件是一类信息数据展示的组件，如用户、某个操作项的头像展示，常放置于个人信息页、与用户相关的列表项中
头像圆角有两个枚举值：Extra Small（r=4）、Extra Large（r=½ Height）以配合不同主题的使用
头像的尺寸可以依据所属组件的大小自由配置，但需要注意的是，头像的比例永远是 1:1

### 2.4.1.图片头像

能读取用户头像信息时展示图片头像。

![img](/images/uikit/chatroomdesign/cruk241.png)

### 2.4.2.字符头像

用户未上传头像时显示字符头像，字符头像分为单字符和双字符两种

![img](/images/uikit/chatroomdesign/cruk242.png)

### 2.4.3.组合头像

组合头像用于用户未上传数据时的群组聊天自动生成头像
本案不涉及

![img](/images/uikit/chatroomdesign/cruk243.png)

### 2.4.4.图标头像

图标头像用于获取不到用户头像信息的空状态以及表单单项有 icon 时的头像。

![img](/images/uikit/chatroomdesign/cruk244.png)

### 2.4.5.头像徽章

头像可配置徽章（Badge）以体现用户的在离线等状态，徽章位置分两种：右下和右上
本案不涉及


<img src="/images/uikit/chatroomdesign/cruk245.png" width="440" >

## 2.5.操作表单(Action Sheet)

操作表单是以模态形式展示的多操作项表单，单个操作项分为 Enabled、Pressed、Disabled、Destructive 四种状态，以及 Cancel 特殊类型。同时可配置是否显示 icon、是否有分割线(stroke)
此组件仅限移动端

<img src="/images/uikit/chatroomdesign/cruk25.png" width="390" >

## 2.6.浮层菜单(PopMenu)

浮层菜单是以浮层形式展示的多操作项菜单，单个操作项分为 Enabled、Hovered、Pressed、Focused、Disabled、Destructive 六种状态，同时可配置是否显示 icon、是否有字段 2（Body），样式上可配置单项圆角、是否有分割线(Stroke)。
此组件仅限 web 端

![img](/images/uikit/chatroomdesign/cruk26.png)

## 2.7.弹窗通知(Alert)

弹窗通知是一类模态提示，会提示用户正在进行的操作所需的关键信息，如警告等，或需要用户填写关键信息（通过输入框），需用户做出主要操作或次要操作。
内容上，description 可配、输入框可配、操作项支持最多三个。
样式上，弹窗的圆角可配，需要注意的是，组件内部的输入框和操作按钮圆角需要同弹窗按钮的圆角适配，以达成风格的一致性。

![img](/images/uikit/chatroomdesign/cruk27.png)

## 2.8.浮层提示(Popover)

浮层提示为 web 端的非常驻提示信息。仅在鼠标 Hoverd 相关组件时展示，最多支持两个字段(Title 和 Subtitle)，因为是浮层提示，背景色需和底色有极大反差，具体表现为：亮色模式上用深色（Neutral1）、暗色模式上用亮色（Neutral98）
且依据需提示内容在页面上的实际位置，分为 10 个方向(上左、上、上右、右上、右、右下、下右、下、下左、左下、左、左上)。

![img](/images/uikit/chatroomdesign/cruk28.png)

## 2.9.表情符号(Emoji)

### 2.9.1.Twemoji [↗](https://github.com/twitter/twemoji)

表情使用开源可免费商用的 Twemoji 作为基本表情，默认提供 52 个表情作为内置的表情，用户可根据自己的产品规划从 twemoji 提供的 3,245 个表情中进行替换增减；

![img](/images/uikit/chatroomdesign/cruk291.png)

### 2.9.2.表情模版(Emoji Template)

如用户需替换 Twemoji，或者需要自己创作表情，需依照以下模板进行替换或绘制；

![img](/images/uikit/chatroomdesign/cruk292.png)

### 2.9.3.表情组件状态（State）

表情组件的状态分为以下 4 种：
启用 Enabled、悬停 Hovered（仅限 web 端）、按下 Pressed、聚焦 Focused（本案不涉及）
悬停时，背景色递增一级；按下时，背景色递减一级；聚焦时，背景色转换为 Key Color。

![img](/images/uikit/chatroomdesign/cruk293.png)

# 3.业务组件（Components）

## 3.1.消息组件（Message）

本案支持发送文本(含 Emoji)、语音(本期不涉及)、礼物消息、全局广播等消息类型
样式上所有的配置项都是为要保障消息文本的可阅读性。

### 3.1.1.文本消息（Text Message）

文本消息为用户发送的文字消息展示样式
样式可配项有：背景色（Alpha0-100）、前景色（Neutral0-100）、圆角、字体的大小（Body Large、Body Medium、Body small）、消息气泡的 Pedding
可增减的显示内容项有：Label、Badge、Avatar，Title 和 Description 为必要内容，显示内容的顺序是不可修改的。

<img src="/images/uikit/chatroomdesign/cruk311.png" width="390" >

### 3.1.2.语音消息（Audio Message）

本期不涉及

### 3.1.3.礼物消息（Gift Message）

礼物消息依据国内国外使用场景的不同，分为两种样式

#### 3.1.3.1.非常驻礼物消息样式

为国内直播场景常见的样式，可设为 Large、Small 两个尺寸，
默认驻留时间为 3 秒（可配置），事件并发时排队展示，可同时最多展示 2 条礼物消息

<img src="/images/uikit/chatroomdesign/cruk3131.png" width="390" >

消息气泡的样式可配项有：背景色、前景色、头像圆角（需要注意的是，消息背景圆角和头像圆角配套以达成风格的一致）、背景模糊（防止在语聊房场景下组件重叠带来的阅读困难）。

#### 3.1.3.2.常驻礼物消息样式

<img src="/images/uikit/chatroomdesign/cruk3132.png" width="390" >

样式可配项和信息可配项与文本消息相同，只是增加了消息末尾的贴纸展示。

### 3.1.4.消息列（Massage List）

为消息按照时间顺序组合后浮动在直播流上的组件样式，依据国内外用户习惯不同，分为两类样式

#### 3.1.4.1.礼物消息和文本消息分开展示的样式

<img src="/images/uikit/chatroomdesign/cruk3141.png" width="390" >

此组件默认消息之间的间距为 4(用户可自行配置)，文本消息区域整体高度占屏幕比例用户可自行配置。礼物非常驻消息一直显示在区域顶侧。消息列右侧需留出给用户放置自定义消息组件的区域，所以此处消息的左右间距不可配置，固定左侧 16，右侧 78。

#### 3.1.4.2.礼物消息和文本消息合并展示的样式

<img src="/images/uikit/chatroomdesign/cruk3142.png" width="390" >

此组件默认消息之间的间距为 4(用户可自行配置)，文本消息区域整体高度占屏幕比例用户可自行配置。消息列右侧需留出给用户放置自定义消息组件的区域，所以此处消息的左右间距不可配置，固定左侧 16，右侧 78。

### 3.1.5.消息操作（Message Action）

<img src="/images/uikit/chatroomdesign/cruk315.png" width="390" >

长按消息弹起 action sheet 显示消息相关操作项，操作列表顶部标题栏显示所操作消息的详情。

#### 3.1.5.1.消息的举报表单（Report From）

举报表单为消息操作的次级别页面，提供选择举报原因的单选项，选项数目可增减，选择后可提交举报。

<img src="/images/uikit/chatroomdesign/cruk3151.png" width="390" >

### 3.1.6.全局广播（Global Message）

全局广播为超级管理员发送的所有直播间同时可见的非常驻消息，分为三种类型（具体类型需开发者自行定义）通过左侧图标和背景色示以区分。样式的可配项有：圆角、背景色、前景色，信息展示的可配项有左侧 icon(有或无)，以及用户可以在自定义广播类型时修改 icon 资源图。消息仅支持单排显示，广播内容超过一屏显示范围为字幕滚动展示，滚动速率可配。

<img src="/images/uikit/chatroomdesign/cruk316.png" width="500" >

此消息在移动端一般出现在视频流的顶部；在 web 端出现在聊天窗的顶部，为浮层展示。

<img src="/images/uikit/chatroomdesign/cruk316b.png" width="780" >

## 3.2.底部条（Footer Bar）

底部条为移动端的底部操作项展示区域
样式上的可配项支持背景色、前景色、圆角、图标可替换，是否添加背景模糊效果
发送消息 action 为必要项，礼物消息 action 为可选项，另最多支持 4 个用户可定义的 action。

<img src="/images/uikit/chatroomdesign/cruk32.png" width="390" >

## 3.3.输入条（Input Bar）和语音发送器（Audio Input）

输入条为键入文本、发送语音和扩展消息的组件。在移动端点击底部条的发送消息操作触发，和键盘搭配使用；在 web 端为在消息窗内底部常驻显示。
样式上，输入条支持配置分割线、内部的输入框和按钮支持圆角配置

### 3.3.1.文本输入条（Input Bar）

#### 3.3.1.1.移动端文本输入条（Input Bar）

移动端文本输入条包含文字输入和至多 4 个的键盘切换操作（包括表情键盘、发送语音两个可配项以及另外两个用户可自定义项），可选配文本或者图标形式的发送按钮。

<img src="/images/uikit/chatroomdesign/cruk3311.png" width="390" >

文本输入条内的文本输入区域为输入区域组件，当单行文本放不下时，文字可在输入区域内折行，对应的输入区域会累积行高，至多支持 4 行文本区域，输入文本超过 4 行后，文本分页展示，用户可滚动查看所键入的文本。

<img src="/images/uikit/chatroomdesign/cruk3311b.png" width="390" >

样式上支持配置分割线（Stroke）、内部输入区域和发送按钮的圆角、描边（Stroke）、前/背景色。

<img src="/images/uikit/chatroomdesign/cruk3311c.png" width="390" >

#### 3.3.1.2.网页端文本输入条（Input Bar）

网页端文本输入条包含文字输入和至多 4 个的键盘切换操作（包括表情键盘、发送语音、发送礼物三个可配项以及另外一个用户可自定义项），可选配图标形式的发送按钮。

<img src="/images/uikit/chatroomdesign/cruk3312.png" width="360" >

文本输入条内的文本输入区域为输入区域组件，当单行文本放不下时，文字可在输入区域内折行，对应的输入区域会累积行高，至多支持 4 行文本区域，输入文本超过 4 行后，文本分页展示，用户可滚动查看所键入的文本。

<img src="/images/uikit/chatroomdesign/cruk3312b.png" width="360" >

### 3.3.2.语音发送器（Audio Input）

本期不涉及

## 3.4.表情键盘（Emoji Pick）

表情键盘是发送 app 内自建表情的键盘，内容上支持表情个数的增减，底部发送和退格按钮支持修改圆角。同时应满足接入第三方表情/贴纸库。

![img](/images/uikit/chatroomdesign/cruk34.png)

本键盘不同于系统自带的 emoji 输入键盘，通过此组件输入的 emoji 不会同步为系统的 emoji，而是在任何平台同一 app 内均显示 app 内自建的表情符号。为满足版权方面的法律要求，请勿使用非申明开源可免费商用的表情符号（不限资源图或者源码）在 App 中（如：集成苹果表情符号在自己的 app 内，这样或许会导致 App 无法上架苹果应用商店）

## 3.5.贴纸键盘（Stickers Pick）

### 3.5.1.单个贴纸（Sticker）

单个贴纸用以展示单个礼物消息样式，展示的信息有：礼物图片、礼物名称（Title）、礼物价值（Subtitle）。
礼物图片未读到时显示默认图，礼物价值可配置价值图标。
单个贴纸状态有 Enabled、Disabled(主要用于慢速发送，需要用户自行实现)、Focused 三种，Focused 时显示发送按钮。

<img src="/images/uikit/chatroomdesign/cruk351.png" width="390" >

### 3.5.2.贴纸键盘（Stickers Pick）

贴纸键盘在本案内主要应用于发送礼物消息。内容上支持礼物类别（横向滑动切换礼物类别）/类别内礼物个数（上下滑动查看更多礼物）的增减。

<img src="/images/uikit/chatroomdesign/cruk352.png" width="390" >

## 3.6.成员列表（Member List）

### 3.6.1.列表筛选（Tab）

成员列表顶部支持成员类别筛选，可通过点击 tab 或者左右滑动整个列表切换，至少支持一个 tab, tab 超过四个时支持左右滑动

<img src="/images/uikit/chatroomdesign/cruk361.png" width="440" >

### 3.6.2.搜索条（Search Bar）

搜索条一般位于列表顶端，分为 Enabled n‘ unfilled、Enabled n‘ filled、Focused n‘ unfilled、Focused n‘ filled 四种状态，依据所在列表组件性质的不同可配置左侧返回按钮和右侧 action 按钮，样式上可配置分割线、输入框圆角大小、输入框背景色和描边的增减。

![img](/images/uikit/chatroomdesign/cruk362.png)

### 3.6.3.成员列表项（Member Item）

列表项展示当前成员信息，可展示的信息有徽章(Badge)、头像（Avatar）、用户名（Title）、用户详情（Subtitle），用户名为必要项，其他信息可配置。列表项目右侧支持 action btn，同时列表项支持点击/长按等事件

<img src="/images/uikit/chatroomdesign/cruk363.png" width="390" >

样式上，列表项可配置分割线（Stroke），头像支持圆角可配。

<img src="/images/uikit/chatroomdesign/cruk363b.png" width="390" >

### 3.6.4.列表（Member List）

将 3.6.1.-3.6.3.组合起来即为整个列表项

#### 3.6.4.1.列表整体加载

<img src="/images/uikit/chatroomdesign/cruk3641.png" width="390" >

#### 3.6.4.2.空列表

<img src="/images/uikit/chatroomdesign/cruk3642.png" width="390" >

#### 3.6.4.3.列表拉取失败

<img src="/images/uikit/chatroomdesign/cruk3643.png" width="390" >

#### 3.6.4.4.列表上滑加载

<img src="/images/uikit/chatroomdesign/cruk3644.png" width="390" >

#### 3.6.4.5.列表展开全屏

<img src="/images/uikit/chatroomdesign/cruk3645.png" width="390" >

# 4.UI 设计资源

设计资源详见 [figma 链接](https://www.figma.com/community/file/1322495388317476706/chatroom-uikit)。

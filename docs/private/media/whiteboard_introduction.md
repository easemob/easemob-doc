# 互动白板简介

### 产品介绍

白板（Easemob-WhiteBoard）服务端基于socket.io，页面基于svg.js开发，所以兼容性参考上述两项即可。

SDK提供了创建白板、加入白板、销毁白板三个API。白板角色默认分为创建者/成员，都可以在实时共享的画布上运用提供工具进行元素的绘制、拖动等操作。创建者会增加白板页面的相关操作如：增加/删除白板页面、查看页面缩略图、上传文档（上传文档会根据文档页数在当前页面后面作为白板页插入）；同时创建者有撤销/恢复、清空当前画布并更改房间成员的互动权限的操作。一个白板中支持多个白板页面，支持通过上传文档增加白板页面并作为白板页的背景。文档类型包括：PDF文档、Word、PPT文档进行实时展示和讲解。

创建白板后会返回一个白板地址链接，用户通过直接使用页面、ifram 或者 webview等方式集成。白板功能是实时音视频通话场景的互动补充，可以满足广泛的业务场景，例如：教育板书、会议内容展示、笔记记录。

白板功能特性：

- 多客户端支持： 桌面端（基于electron）、Web端；
- 多人实时互动：可支持多人同时在线互动；
- 超低时延同步：白板操作低时延同步展示；
- 上传文件支持类型：图片、PDF文档、Word、PPT；

### SDK API

#### 1.创建白板房间

```
a. whiteBoard.create()
b.whiteBoard.join()
```

注：.create()只是单独的创建并加入房间； .join()存在当前的房间名称就加入房间，不存在当前房间名就创建房间并加入；

#### 2.加入白板房间

```
a.whiteBoard.join()
当前房间名已存在，则加入该房间
b.whiteBoard.joinByRoomName()
通过房间名加入
c.whiteBoard.joinByRoomId()
通过房间id加入
```

#### 3.房间权限更改

```
whiteBoard.oprateAuthority()
控制房间内成员是否可以进行白板操作
```

#### 4.删除白板

```
whiteBoard.destroy()
```

## Demo
<!--
### Demo体验

请扫码体验DEMO

Android:

[![img](https://docs-im.easemob.com/_media/im/other/integrationcases/%E4%BA%92%E5%8A%A8%E7%99%BD%E6%9D%BFdemo_android.png?w=200&tok=928a3d)](https://docs-im.easemob.com/_detail/im/other/integrationcases/互动白板demo_android.png?id=rtc%3Awhiteboard%3Aintroduction)

iOS:

[![img](https://docs-im.easemob.com/_media/im/other/integrationcases/%E4%BA%92%E5%8A%A8%E7%99%BD%E6%9D%BFdemo_ios.png?w=200&tok=96426b)](https://docs-im.easemob.com/_detail/im/other/integrationcases/互动白板demo_ios.png?id=rtc%3Awhiteboard%3Aintroduction)

-->
### Demo源码

我们在 Github 已经提供了一套完整的 Demo，大家可以在 Github 地上获取。

- [Android](https://github.com/easemob/whiteboard_demo_android)

- [iOS](https://github.com/easemob/whiteboard_demo_ios)

- [web](https://github.com/easemob/whiteboard_demo_web)

在 Demo 的基础上，开发者只需要不到1周的时间，对 UI 和功能做简单修改即可准备测试上线。

### 产品功能

白板操作有3类，分别为：页面类操作、元素类操作、文档类操作；
<center>表1.白板支持功能</center>

![img](/images/privitization/whiteboard_function.png)

<center>图2.白板操作界面</center>

![img](/images/privitization/whiteboard_view.png)


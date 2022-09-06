# 如何配置服务器域名

[[toc]]

微信小程序在生产环境下如果没有配置合法域名，是不能正常访问的，那就需要把服务器域名添加到微信小程序后台管理系统的服务器域名白名单里面。 那么接下来本文就来介绍一下配置小程序添加合法域名的步骤方法，具体步骤如下所示。

1、打开 [微信公众平台官网](https://mp.weixin.qq.com/)，登录微信小程序账号，然后进入微信小程序管理主界面；

2、在微信小程序主界面的左侧菜单栏里面找到 “</>开发” 模块。[![img](https://docs-im.easemob.com/_media/im/applet/screencapture-mp-weixin-qq-wxamp-wxaalarm-get-jserr-2021-06-11-18_24_17.png)](https://docs-im.easemob.com/_detail/im/applet/screencapture-mp-weixin-qq-wxamp-wxaalarm-get-jserr-2021-06-11-18_24_17.png?id=im%3Aapplet%3Aserverconfig)

3、在 “</>开发” 模块，点击 “开发管理”，找到 “开发设置” 选项，下拉找到 “服务器域名” 模块[![img](https://docs-im.easemob.com/_media/im/applet/screencapture-mp-weixin-qq-wxamp-devprofile-get-profile-2021-06-11-18_57_20_1_.png)](https://docs-im.easemob.com/_detail/im/applet/screencapture-mp-weixin-qq-wxamp-devprofile-get-profile-2021-06-11-18_57_20_1_.png?id=im%3Aapplet%3Aserverconfig)

4、首次设置服务器域名的话，会有一个 “开始配置” 按钮，点击进入[![img](https://docs-im.easemob.com/_media/im/applet/%E6%88%AA%E5%B1%8F2021-06-11_%E4%B8%8B%E5%8D%886.57.51.png)](https://docs-im.easemob.com/_detail/im/applet/截屏2021-06-11_下午6.57.51.png?id=im%3Aapplet%3Aserverconfig)

5、进入配置服务器信息之前需要先进行身份确认，需要管理员扫码进行身份认证。[![img](https://docs-im.easemob.com/_media/im/applet/screencapture-mp-weixin-qq-wxamp-devprofile-get-profile-2021-06-11-18_58_34_2_.png)](https://docs-im.easemob.com/_detail/im/applet/screencapture-mp-weixin-qq-wxamp-devprofile-get-profile-2021-06-11-18_58_34_2_.png?id=im%3Aapplet%3Aserverconfig)

6、管理员身份认证之后，就进入到 “配置服务器信息” 模块，设置第二个选项 “socket合法域名” 里面的域名即可。[![img](https://docs-im.easemob.com/_media/im/applet/screencapture-mp-weixin-qq-wxamp-devprofile-get-profile-2021-06-11-20_42_32.png)](https://docs-im.easemob.com/_detail/im/applet/screencapture-mp-weixin-qq-wxamp-devprofile-get-profile-2021-06-11-20_42_32.png?id=im%3Aapplet%3Aserverconfig)

7、登陆环信后台获取 socket 域名，进入即时通讯-服务概览页，即可看到如图的域名展示

**注意：字节跳动小程序、QQ 小程序、百度小程序、uniapp 全平台等同微信小程序的域名一致，使用微信小程序栏的域名即可**

[![img](https://docs-im.easemob.com/_media/im/applet/screencapture-console-easemob-app-im-service-detail-2021-06-11-19_13_23.png)](https://docs-im.easemob.com/_detail/im/applet/screencapture-console-easemob-app-im-service-detail-2021-06-11-19_13_23.png?id=im%3Aapplet%3Aserverconfig)

8、填写完域名信息之后，点击下面 “保存并提及” 按钮即可设置完成。[![img](https://docs-im.easemob.com/_media/im/applet/screencapture-mp-weixin-qq-wxamp-devprofile-get-profile-2021-06-11-20_42_32.png)](https://docs-im.easemob.com/_detail/im/applet/screencapture-mp-weixin-qq-wxamp-devprofile-get-profile-2021-06-11-20_42_32.png?id=im%3Aapplet%3Aserverconfig)

9、设置完成小程序服务器域名之后，如果想修改服务器域名或者删除服务器域名，依然在 “</>开发” 模块进入，然后进入服务器域名设置部分进行操作设置即可。

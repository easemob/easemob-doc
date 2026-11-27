# 聊天页面

<Toc />

## 页面功能

`ChatUIKit/modules/Chat/index` 是聊天页面，该页面提供以下功能：

| 类别         | 功能                                     |
| :----------- | :--------------------------------------- |
| 消息收发 | 收发文本、表情、图片、语音、视频、文件消息 |
| 消息操作 | 复制、引用、撤回、删除、编辑操作 |
| 漫游消息 | 从服务器拉取历史消息         |

关于消息相关功能，详见 [功能介绍文档](chatfeature_message.html)。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/uniapp/message_operation.png" title="聊天页面" />
</ImageGallery>

## 创建聊天页面

单群聊 UIKit 提供 `ChatUIKit/modules/Chat/index` 页面，添加路由到 `pages.json` 即可使用。

```json
{
  "pages": [
    {
      "path": "ChatUIKit/modules/Chat/index",
      "style": {
        "navigationStyle": "custom",
        // #ifdef MP-WEIXIN
        "disableScroll": true,
        // #endif
        "app-plus": {
          "bounce": "none",
          "softinputNavBar": "none"
        }
      }
    }
  ]
}
```
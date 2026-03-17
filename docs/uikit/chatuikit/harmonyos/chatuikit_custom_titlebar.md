# 页面标题栏

`ComposeTitleBar` 是一个可组合的标题栏组件，适用于 `ComponentV2` 场景，常用于自定义页面顶部区域。聊天页面 `ChatPage` 和会话列表页面 `ConversationListPage` 均使用该组件进行标题栏渲染。

## 概述

标题栏由以下区域组成：

- **左侧导航按钮**：返回按钮，可通过 `onBackPress` 处理返回逻辑。
- **标题区域**：主标题 `primaryTitle` 与副标题 `secondaryTitle`，支持点击回调。
- **右侧菜单**：通过 `operationItem` 传入菜单项，自动处理溢出与更多菜单。 

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/titlebar_chat_single_group.png" title="标题栏 ComposeTitleBar" />
</ImageGallery>

## 基本设置

标题栏的基本设置包括设置标题、返回事件与右侧菜单项。以下示例使用 `Navigation` 和 `ComponentV2` 组件：

```typescript
import { ComposeTitleBar, MenuItem, ShowAsAction } from '@easemob/chatuikit';

@Entry
@ComponentV2
struct TitleBarBasicDemo {
  private navPathStack: NavPathStack = new NavPathStack();
  // 设置右侧菜单项
  private pageMenus: MenuItem[] = [
    {
      id: 'search',
      icon: $r('app.media.icon_search'),
      value: '搜索',
      action: () => {
        console.log('点击搜索');
      }
    },
    {
      id: 'more',
      value: '更多',
      showAsAction: ShowAsAction.never,
      action: () => {
        console.log('点击更多');
      }
    }
  ];

  build() {
    NavDestination() {
      Column() {
        ComposeTitleBar({
          primaryTitle: '会话列表',
          titlePosition: HorizontalAlign.Center,
          onBackPress: () => {
            this.navPathStack.pop();
          },
          operationItem: this.pageMenus
        });
        // 页面内容...
      }
    }
    .hideTitleBar(true)
    .onReady((context) => {
      this.navPathStack = context.pathStack;
    });
  }
}
```

右侧菜单项 `MenuItem `参数说明 

| 参数 | 类型 | 必填 | 描述 |
| :-------------- | :----- | :------- | :------------- |
| `id` | String \| Number | 是 | 菜单项唯一标识。 |
| `icon` | Resource | 否 | 菜单项图标。 |
| `value` | String | 是 | 菜单项文本。 |
| `action` | (id: string \| number) => void | 否 | 菜单项点击回调。 |

## 设置头像和副标题

标题栏组件支持自定义头像和副标题，并可配置点击跳转等交互行为。以下示例展示了如何在 `Navigation` 容器中使用 `ComponentV2` 组件构建带操作菜单的标题栏：

```typescript
import { ComposeTitleBar, MenuItem } from '@easemob/chatuikit';

@Entry
@ComponentV2
struct TitleBarProfileDemo {
  private navPathStack: NavPathStack = new NavPathStack();
  build() {
    NavDestination() {
      Column() {
        ComposeTitleBar({
          avatar: $r('app.media.avatar_default'),
          avatarAlt: $r('app.media.avatar_group_default'),
          primaryTitle: '技术讨论群',
          secondaryTitle: '128 人在线',
          onAvatarClick: () => {
            console.log('点击头像');
          },
          onTitleClick: () => {
            console.log('点击标题');
          }
        });
        // 页面内容...
      }
    }
    .hideTitleBar(true)
    .onReady((context) => {
      this.navPathStack = context.pathStack;
    });
  }
}
```



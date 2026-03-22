# 自定义界面图标

UIKit 支持图标的自定义与扩展，你可以通过替换内置图标或添加全新图标来满足业务需求。本文介绍各页面的图标列表及自定义方法。

## 页面图标列表

### 会话列表页面

- **标题栏扩展菜单图标**

| 菜单项     | 图标名称           | 描述               |
| ---------- | ------------------ | ------------------ |
| 标题栏右侧按钮 | `plus_in_circle`   | 标题栏右侧的 “+” 按钮。点击该按钮打开创建菜单。    |
| 创建新会话 | `bubble_fill`      | 创建新的单聊会话。   |
| 添加好友   | `person_add_fill`  | 添加新联系人。     |
| 创建群组   | `person_double_fill` | 创建新群组。     |

- **搜索栏图标**

| 功能           | 图标名称           | 描述                       |
| -------------- | ------------------ | -------------------------- |
| 搜索框图标     | `magnifier`        | 搜索会话                   |

### 聊天页面

- **消息长按菜单图标**

| 功能     | 图标名称                     | 描述         |
| :--------- | :---------------------- | :--------------------- |
| 复制消息 | `doc_on_doc`                 | 复制消息内容 |
| 转发消息 | `arrowshape_right`           | 转发消息     |
| 创建话题 | `hashtag_in_bubble_fill`     | 创建话题     |
| 回复消息 | `arrowshape_left`            | 回复消息     |
| 撤回消息 | `arrow_Uturn_anti_clockwise` | 撤回消息     |
| 编辑消息 | `slash_in_rectangle`         | 编辑消息     |
| 多选消息 | `check_n_3lines`             | 多选消息     |
| 置顶消息 | `pin_2`                      | 置顶消息     |
| 翻译消息 | `a_in_arrows_round`          | 翻译消息     |
| 举报消息 | `envelope`                   | 举报消息     |
| 删除消息 | `trash`                      | 删除消息     |

- **消息状态图标**

| 状态             | 图标名称                      | 描述               |
| :--------- | :---------------------- | :--------------------- |
| 发送中           | `loading`                     | 消息正在发送       |
| 已送达           | `check`                       | 消息已送达服务器   |
| 发送失败         | `exclamation_mark_in_circle`  | 消息发送失败       |
| 已读回执         | `check_2`                     | 消息已被对方阅读   |
| 语音未播放状态   | `dot_1`                       | 语音消息未播放标识 |

- **消息输入区图标**

| 功能     | 图标名称                | 描述                   |
| :--------- | :---------------------- | :--------------------- |
| 选择图片 | `img`                   | 从相册选择图片         |
| 选择视频 | `triangle_in_rectangle` | 从相册选择视频         |
| 拍照     | `camera_fill`           | 打开相机拍照           |
| 选择文件 | `folder`                | 选择文件发送           |
| 选择名片 | `person_single_fill`    | 选择联系人名片发送     |
| 自定义   | `star_fill`             | 默认的自定义菜单项图标 |

- 其他功能图标：

| 功能         | 图标名称           | 描述                     |
| :----------- | :----------------- | :----------------------- |
| 发送语音     | `wave_in_circle`   | 切换到语音输入模式       |
| 表情面板         | `face`             | 打开表情选择面板         |
| 键盘切换         | `keyboard2`        | 关闭表情面板，显示键盘   |
| 打开扩展菜单 | `plus_in_circle`   | 打开扩展菜单             |
| 关闭扩展菜单 | `xmark_in_circle`  | 关闭扩展菜单             |
| 发送消息     | `airplane`         | 发送消息                 |
| 多选删除 | `trash`            | 多选模式下的删除按钮     |
| 多选分享 | `arrowshape_right` | 多选模式下的分享转发按钮 |

## 图标自定义

## 替换内置图标

通过同名覆盖的方式替换已有图标。图标资源需提供三种尺寸：1x（默认）、2x、3x。

以下示例为替换聊天页面消息输入区的扩展菜单图标：

```typescript
import { ICON_ASSETS } from "react-native-chat-uikit";

// 替换内置图标之后，UIKit 组件将使用新的图标
ICON_ASSETS["camera_fill"] = (size: string) => {
  if (size === "3x") {
    return require("./icons/camera_fill_3x.png");
  } else if (size === "2x") {
    return require("./icons/camera_fill_2x.png");
  } else {
    return require("./icons/camera_fill.png");  // 1x 或默认尺寸
  }
};
```

### 添加自定义图标

你可以注册全新的图标，并在业务代码中使用。

自定义图标时，需遵循以下规范：

| 要求     | 说明                                        |
| :------- | :------------------------------------------ |
| **格式** | 推荐使用 PNG 格式（支持透明背景）           |
| **尺寸** | 提供 1x、2x、3x 三种图标尺寸  |
| **命名** | 使用小写字母和下划线，如 `custom_icon_name` |
| **缓存** | 图标注册后全局生效，建议在应用启动时完成    |

例如，添加的自定义图标，在长按消息菜单中使用：

```typescript
import {
  ICON_ASSETS,
  ConversationDetail,
} from 'react-native-chat-uikit';

// 1. 注册自定义图标
ICON_ASSETS['custom_star'] = (size: string) => {
  if (size === '3x') {
    return require('./your_path/custom_star_3x.png');
  } else if (size === '2x') {
    return require('./your_path/custom_star_2x.png');
  } else {
    return require('./your_path/custom_star.png');  // 1x 或默认尺寸
  }
};

// 2. 使用自定义图标
<ConversationDetail
  type="chat"
  convId={convId}
  convType={convType}
  input={{
    props: {
      onInitMenu: (initItems) => {
        // initItems 是默认的菜单项列表
        console.log('默认菜单项:', initItems);

        // 添加自定义菜单项
        const customItem = {
          name: 'custom',        // 菜单项名称
          isHigh: false,         // 是否高亮显示（通常用于警告操作）
          icon: 'custom_star',   // 使用前面注册的自定义图标
          onClicked: () => {
            console.log('点击自定义菜单项');
            // 实现自定义功能
          },
        };

        // 返回新的菜单项列表（包含默认项和自定义项）
        return [...initItems, customItem];
      },
    },
  }}
  onBack={() => navigation.goBack()}
/>
```

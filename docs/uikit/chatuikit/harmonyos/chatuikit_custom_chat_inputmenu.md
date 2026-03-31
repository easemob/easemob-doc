# 设置消息输入

<Toc />

聊天页面的消息输入区 `ChatInputMenuView` 实现各类消息的输入和发送，包括以下部分：

- **消息输入栏 (ChatPrimaryMenu)**：负责文本与语音消息的输入和发送，支持表情添加及常用功能扩展。
- **消息扩展菜单 (ChatExtendMenu)**：提供附件类型消息的发送入口，支持图片、视频、文件等，并可扩展自定义消息类型（如名片、位置、红包等）。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/harmonyos/message_input_frame.png" title="消息输入区 ChatInputMenuView" />
</ImageGallery>

## 设置消息输入栏

### 显示或隐藏输入栏

通过 `ChatPrimaryMenuModel` 控制消息输入栏中各个按钮的启用状态，实现显示或隐藏。

<ImageGallery :columns="3">
  <ImageItem src="/images/uikit/chatuikit/harmonyos/custom_chat_input_bar.png" title="设置消息输入栏" />
</ImageGallery>

```typescript
import { ChatPrimaryMenuModel, ChatView, ChatType } from '@easemob/chatuikit';

@ComponentV2
struct CustomChatPage {
  @Local menuModel: ChatPrimaryMenuModel = new ChatPrimaryMenuModel();

  aboutToAppear() {
    // 禁用录音按钮
    this.menuModel.isRecorderEnable = false;
  
    // 禁用表情按钮
    this.menuModel.isEmojiEnable = false;
  
    // 禁用扩展菜单按钮
    this.menuModel.isExtendEnable = false;
  }

  build() {
    Column() {
      ChatView({
        conversationId: 'user123',
        chatType: ChatType.Chat,
        privateMenuModel: this.menuModel  // 传入配置模型
      })
    }
  }
}
```

### 设置显示或隐藏组件

| 属性              | 类型    | 描述               | 默认值 |
| ----------------- | ------- | ------------------ | ------ |
| `isRecorderEnable`  | Boolean | 录音按钮是否可用   | `true`   |
| `isInputTextEnable` | Boolean | 文本输入框是否可用 | `true`   |
| `isEmojiEnable`     | Boolean | 表情按钮是否可用   | `true`   |
| `isExtendEnable`    | Boolean | 扩展按钮是否可用   | `true`   |

### 设置文本输入框默认文本

暂不支持通过参数直接配置输入框默认文本，可通过资源覆盖实现：

在 App 模块的 `resources/base/element/string.json` 中添加：

```json
{
  "string": [
    {
      "name": "chat_primary_input_placeholder",
      "value": "请输入消息..."
    }
  ]
}
```

### 监听录音权限请求

录音按钮点击时需请求麦克风权限，可自定义权限申请逻辑：

```typescript
import { PermissionManager } from '@easemob/chatuikit';

ChatView({
  conversationId: 'user123',
  chatType: ChatType.Chat,
  onRecordClick: (callback: (isPermissionGranted: boolean) => void) => {
    // 请求麦克风权限
    PermissionManager.requestPermissions(
      getContext(), 
      ['ohos.permission.MICROPHONE']
    ).then((result) => {
      const granted = result.authResults[0] === 0;
      if (!granted) {
        // 权限被拒绝，提示用户
        showToast({ message: '需要麦克风权限才能录音' });
      }
      callback(granted);
    });
  }
})
```

## 设置消息扩展菜单

点击消息输入栏中的扩展图标（默认为加号）会弹出消息扩展菜单。消息扩展菜单提供发送附件类型消息（如图片、视频、文件）、位置消息以及自定义消息的快捷入口。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/message_input_extension.png" title="消息扩展菜单 ChatExtendMenu" />
</ImageGallery>

### 管理菜单项

消息扩展菜单默认包含拍照、相册、文件、名片。你可以通过 `extendMenus` 自定义菜单项：

```typescript
import { MenuItem, KitConstants, ChatView, ChatType } from '@easemob/chatuikit';

@ComponentV2
struct CustomChatPage {
    @Local extendMenus: MenuItem[] = [
    // 保留默认菜单项
    {
      id: KitConstants.EXTEND_ACTION_CAMERA,
      icon: $r('app.media.chat_icon_extend_more_camera'),
      value: '拍照',
      order: 0,
      action: (id: string | number) => {
        // 处理点击相机的逻辑
        console.log('拍照')
      }
    },
    {
      id: KitConstants.EXTEND_ACTION_IMAGE,
      icon: $r('app.media.chat_icon_extend_more_image'),
      value: '相册',
      order: 1,
      action: (id: string | number) => {
        // 处理点击相册的逻辑
        console.log('相册')
      }
    },
    {
      id: KitConstants.EXTEND_ACTION_FILE,
      icon: $r('app.media.chat_icon_extend_more_file'),
      value: '文件',
      order: 2,
      action: (id: string | number) => {
        // 处理点击文件的逻辑
        console.log('文件')
      }
    },
    {
      id: KitConstants.EXTEND_ACTION_USER,
      icon: $r('app.media.chat_icon_extend_more_user'),
      value: '名片',
      order: 3,
      action: (id: string | number) => {
        // 处理点击名片的逻辑
        console.log('名片')
      }
    },
    // 添加自定义菜单项
    {
      id: 'location',
      icon: $r('app.media.chat_icon_extend_more_user'),
      value: '位置',
      order: 4,
      action: (id: string | number) => {
        // 处理点击位置的逻辑
        console.log('位置')
      }
    },
    {
      id: 'red_packet',
      icon: $r('app.media.chat_icon_extend_more_camera'),
      value: '红包',
      order: 5,
      action: (id: string | number) => {
        // 处理点击红包的逻辑
        console.log('红包')
      }
    }
  ];

  build() {
    Column() {
      ChatView({
        conversationId: 'user123',
        chatType: ChatType.Chat,
        extendMenus: this.extendMenus  // 传入自定义菜单
      })
    }
  }
}
```

**预定义菜单项 ID**

| ID 常量                           | 值       | 描述              |
| :---------------------------------- | :------- | :--- |
| `KitConstants.EXTEND_ACTION_CAMERA` | `camera` | 拍照/录像         |
| `KitConstants.EXTEND_ACTION_IMAGE`  | `image`  | 相册（图片/视频） |
| `KitConstants.EXTEND_ACTION_FILE`   | `file`   | 文件              |
| `KitConstants.EXTEND_ACTION_USER`   | `user`   | 名片              |

### 监听消息扩展菜单点击事件

若未设置 `extendMenus` 属性，可通过 `onExtendMenuClick` 自定义处理点击事件。

```typescript
ChatView({
  conversationId: 'user123',
  chatType: ChatType.Chat,
  onExtendMenuClick: (id: string | number) => {
    console.log('点击了扩展菜单:', id);
  
    // 处理默认菜单项
    if (id === KitConstants.EXTEND_ACTION_CAMERA) {
      // 自定义点击相机逻辑
      console.log('相机');
    } else if (id === KitConstants.EXTEND_ACTION_IMAGE) {
      // 自定义点击相册逻辑
      console.log('相册');
    } else if (id === KitConstants.EXTEND_ACTION_FILE) {
      // 自定义点击文件逻辑
      console.log('文件');
    } else if (id === KitConstants.EXTEND_ACTION_USER) {
      // 自定义点击名片逻辑
      console.log('名片');
    }
  }
})
```

**默认点击行为**

| 菜单项            | 默认点击行为   |
| :-------------- | :----- |
| 拍照 (CAMERA) | 弹出对话框选择拍照或录像。   |
| 相册 (IMAGE) | 打开系统图片/视频选择器。   |
| 文件 (FILE) | 打开系统文件选择器。   |
| 名片 (USER)  | 跳转到联系人选择页面（需要提供 pathStack）。   |

## 自定义样式与资源

你可以通过在 App 模块中覆盖同名资源文件来修改输入栏的图标、文字等样式。

### 常用图标资源

以下图标资源位于 `chatuikit/src/main/resources/base/media/` 目录下，可在 App 模块的 `resources/base/media/` 目录下创建同名 SVG 文件进行覆盖。

**消息输入栏 (PrimaryMenu)**

| 资源名称 | 描述 |
| :----------- | :------- |
| `chat_primary_record_icon` | 录音按钮图标 |
| `chat_primary_softkeyboard_icon` | 键盘切换图标 |
| `chat_primary_emoji_icon` | 表情按钮图标 |
| `chat_primary_more_icon` | 扩展菜单按钮图标（加号） |
| `chat_primary_more_close_icon` | 扩展菜单收起图标 |
| `chat_primary_send_icon` | 发送按钮图标 |

**消息扩展菜单 (ExtendMenu)**

| 资源名称 | 描述 |
| :----------- | :------- |
| `chat_icon_extend_more_camera` | 拍照/相机图标 |
| `chat_icon_extend_more_image` | 相册图标 |
| `chat_icon_extend_more_file` | 文件图标 |
| `chat_icon_extend_more_user` | 名片图标 |

### 常用文本资源

以下文本资源位于 `chatuikit/src/main/resources/base/element/string.json` 中，可在 App 模块的 `resources/base/element/string.json` 中覆盖同名条目。

**消息输入栏**

| 资源名称 | 默认值 | 描述 |
| :------------------------ | :----- | :------------- |
| `chat_primary_input_placeholder` | Aa | 输入框默认文本 |
| `chat_record_start_hint` | 点击录音 | 录音提示 |
| `chat_record_recording` | 正在录音 | 录音中提示 |

**消息扩展菜单**

| 资源名称 | 默认值 | 描述 |
| :------------------------ | :----- | :------------- |
| `chat_extend_more_camera` | 相机 | 相机菜单项文本 |
| `chat_extend_more_image` | 相册 | 相册菜单项文本 |
| `chat_extend_more_file` | 文件 | 文件菜单项文本 |
| `chat_extend_more_user` | 名片 | 名片菜单项文本 |
| `chat_media_type_phone` | 拍照 | 媒体类型选择-拍照 |
| `chat_media_type_video` | 摄像 | 媒体类型选择-摄像 |

### 资源覆盖示例

在 App 模块的 `resources/base/element/string.json` 中覆盖多个文本资源：

```json
{
  "string": [
    {
      "name": "chat_primary_input_placeholder",
      "value": "请输入消息..."
    },
    {
      "name": "chat_extend_more_camera",
      "value": "拍照"
    },
    {
      "name": "chat_extend_more_image",
      "value": "图库"
    }
  ]
}
```

### 注意事项

详见 [会话列表的高级设置](chatuikit_custom_conversation_list_advanced.html#资源覆盖示例)
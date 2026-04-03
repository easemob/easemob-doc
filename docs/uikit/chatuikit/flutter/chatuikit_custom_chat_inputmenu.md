# 设置消息输入

底部消息输入实现各类消息的输入和发送以及消息表情等功能，包括两部分：

- 底部输入栏 `ChatUIKitInputBar`：负责文本与语音消息的输入、发送，支持表情添加及常用功能扩展。
- 消息扩展菜单 `ChatUIKitMessageViewBottomMenu`：提供附件类型消息的发送入口，支持发送图片、视频、文件，并可扩展至自定义消息类型（如名片消息等）。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/flutter/message_input_frame.png" title="消息输入区" />
</ImageGallery>


## 设置底部输入栏背景

`ChatUIKitInputBar` 的背景样式可通过 `ChatUIKitInputBarTheme` 主题扩展进行自定义配置。提供以下两种设置方式：

**方式一：通过全局主题配置**

在应用入口处 `MaterialApp` 或 `Theme` Widget 中统一配置：

```dart
MaterialApp(
  theme: ThemeData(
    extensions: [
      ChatUIKitInputBarTheme(
        backgroundColor: Colors.white,  // 输入框整体背景色
        inputBackgroundColor: Colors.grey[100],  // 文本输入框内部背景色 
        inputTextColor: Colors.black,  // 输入文字颜色
        inputHintTextColor: Colors.grey,  // 占位文字的颜色
      ),
    ],
  ),
  // ...
)
```

**方式二：在局部 Widget 树中配置**

针对特定页面或组件，可使用 `Theme` Widget 包裹以应用局部主题：

```dart
Theme(
  data: Theme.of(context).copyWith(
    extensions: [
      ChatUIKitInputBarTheme(
        backgroundColor: Colors.blue[50],
        inputBackgroundColor: Colors.white,
      ),
    ],
  ),
  child: MessagesView(
    profile: profile,
    inputBar: ChatUIKitInputBar(
      keyboardPanelController: inputController,
    ),
  ),
)
```

:::tip
- `ChatUIKitInputBarTheme` 继承自 Flutter 的 `ThemeExtension`，必须通过 `Theme` 的 `extensions` 参数进行配置。
- 如不配置此主题 `ChatUIKitInputBarTheme`，`ChatUIKitInputBar` 将自动使用 `ChatUIKitTheme` 中定义的颜色作为默认值。
- `ChatUIKitInputBar` 内部通过 `Theme.of(context).extension<ChatUIKitInputBarTheme>()` 获取主题配置。
:::

## 设置消息输入区布局

### 设置相关属性

你可以获取 `ChatUIKitInputBar` 对象，对输入菜单进行如下操作：

| 自定义配置 | 描述 |
| :--------- | :--- |
| 自定义菜单布局 | 支持替换或扩展输入菜单中的功能模块。 |
| 管理表情与扩展功能 | 可动态设置、显示或隐藏自定义表情菜单及扩展功能菜单。 |
| 定制顶部扩展区域 | 支持设置自定义的菜单顶部布局，包括引用回复条与多选消息工具条。 |
| 界面区域控制 | 可选择仅显示菜单顶部扩展区域，隐藏底部输入与扩展面板部分。 |

<ImageGallery :columns="3">
  <ImageItem src="/images/uikit/chatuikit/android/custom_chat_input_bar.png" title="设置底部输入栏" />
  <ImageItem src="/images/uikit/chatuikit/android/message_input_extension_top.png" title="顶部扩展区域" />
  <ImageItem src="/images/uikit/chatuikit/android/message_input_top_excluded.png" title="除顶部扩展区域外的区域" />
</ImageGallery>

使用示例如下：

```dart
final inputController = ChatUIKitKeyboardPanelController();

MessagesView(
  profile: profile,
  inputController: inputController,
  inputBar: ChatUIKitInputBar(
    keyboardPanelController: inputController,
    leftItems: [
      // 左侧按钮（如语音按钮）
      VoiceButton(),
    ],
    rightItems: [
      // 右侧按钮（如表情、更多按钮）
      EmojiButton(),
      MoreButton(),
    ],
    bottomPanels: [
      // 底部面板（表情面板、更多面板等）
      ChatUIKitBottomPanelData(
        type: ChatUIKitKeyboardPanelType.emoji,
        builder: (context) => EmojiPanel(),
      ),
      ChatUIKitBottomPanelData(
        type: ChatUIKitKeyboardPanelType.more,
        builder: (context) => MorePanel(),
      ),
    ],
    onPanelChanged: (panelType) {
      // 面板切换回调
    },
    onInputTextChanged: (text) {
      // 输入文本变化回调
    },
  ),
)
```

`ChatUIKitInputBar` 提供了如下参数：

| 参数 | 类型 | 描述 |
| :--- | :--- | :--- |
| `keyboardPanelController` | `ChatUIKitKeyboardPanelController` | 键盘面板控制器（必填） |
| `leftItems` | `List<Widget>?` | 左侧按钮列表 |
| `rightItems` | `List<Widget>?` | 右侧按钮列表 |
| `bottomPanels` | `List<ChatUIKitBottomPanelData>` | 底部面板列表 |
| `onPanelChanged` | `void Function(ChatUIKitKeyboardPanelType)?` | 面板切换回调 |
| `onInputTextChanged` | `void Function(String)?` | 输入文本变化回调 |
| `readOnly` | `bool` | 是否只读 |
| `bottomDistance` | `double` | 底部距离 |

### 设置相关操作

#### 获取并操作底部输入栏

你可以通过 `ChatUIKitKeyboardPanelController` 对象，对底部输入菜单进行自定义操作：

```dart
// 访问输入框控制器 
final inputController = ChatUIKitKeyboardPanelController();

// 切换面板
inputController.switchPanel(ChatUIKitKeyboardPanelType.emoji);

// 获取输入框文本
String text = inputController.inputTextEditingController.text;

// 插入文本
inputController.inputTextEditingController.text = 'Hello';
```

#### 设置输入框默认文本

可通过 `ChatUIKitInputBar` 的 `hintText` 设置输入框占位文本：

```dart
ChatUIKitInputBar(
  keyboardPanelController: inputController,
  // 占位文本通过主题配置或 InputDecoration 设置
)
```

#### 监听输入内容变化

```dart
ChatUIKitInputBar(
  keyboardPanelController: inputController,
  onInputTextChanged: (text) {
    // 输入内容变化回调
    print('Input changed: $text');
  },
)
```

#### 管理表情菜单

`MessagesView` 通过 `emojiWidget` 参数支持表情面板的自定义。你可以自定义默认面板参数，也可实现全新的表情面板。

- **方式一：自定义默认面板参数**

若仅需调整默认面板的样式或交互，可直接使用 `ChatUIKitEmojiPanel` 并传入自定义参数：

```dart
MessagesView(
  profile: profile,
  emojiWidget: ChatUIKitEmojiPanel(
    maxCrossAxisExtent: 40,  // 表情大小
    mainAxisSpacing: 20,     // 自定义间距
    emojiClicked: (emoji) {
      // 表情点击处理（需自行管理输入框状态）
    },
    deleteOnTap: () {
      // 自定义删除处理
    },
  ),
)
```

- **方式二：完全自定义面板**

`MessagesView` 支持通过 `emojiWidget` 参数完全替换默认的表情面板。设置该参数后，系统将不再显示默认的 `ChatUIKitEmojiPanel`，而是渲染你自定义的表情面板组件。

```dart
MessagesView(
  profile: profile,
  emojiWidget: CustomEmojiPanel(
    onEmojiSelected: (emoji) {
      // 表情选择处理（需自行管理输入框状态）
    },
    onDelete: () {
      // 处理删除
    },
  ),
)
```

默认的 `ChatUIKitEmojiPanel` 基于 `ChatUIKitEmojiData` 实现表情数据的管理与解析，自定义面板时可参考其实现方式。自定义面板示例如下：

```dart
class CustomEmojiPanel extends StatelessWidget {
  final void Function(String emoji)? onEmojiSelected;
  final VoidCallback? onDelete;

  const CustomEmojiPanel({
    super.key,
    this.onEmojiSelected,
    this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      // 表情面板高度建议设置为 230，与默认值相同，确保 UI 一致性。
      height: 230,
      padding: EdgeInsets.all(8),
      child: GridView.custom(
        shrinkWrap: true,
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 8,
          mainAxisSpacing: 10,
          crossAxisSpacing: 10,
        ),
        childrenDelegate: SliverChildBuilderDelegate(
          (context, index) {
            return GestureDetector(
              onTap: () {
                // 处理表情点击
                final emoji = 'emoji_$index';
                onEmojiSelected?.call(emoji);
              },
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.grey[200],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Center(
                  child: Text('😀'), // 表情文本（可根据index显示不同表情）
                ),
              ),
            );
          },
          childCount: 20, // 表情数量
        ),
      ),
    );
  }
}
```

## 设置消息扩展菜单

消息扩展菜单提供发送附件类型消息（如图片、视频、文件）、位置消息以及自定义消息的快捷入口。点击底部输入菜单中的扩展图标（默认为加号）会弹出消息扩展菜单。

### 设置菜单样式风格

消息扩展菜单支持以下两种样式风格：

- 微信风格样式

```dart
ChatUIKitSettings.messageAttachmentMenuStyle = ChatUIKitMessageAttachmentMenuStyle.menu;
```

- 仿系统 bottomSheet 样式

```dart
ChatUIKitSettings.messageAttachmentMenuStyle = ChatUIKitMessageAttachmentMenuStyle.bottomSheet;
```

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/ios/message_types_2.png" title="类似微信样式" />
  <ImageItem src="/images/uikit/chatuikit/ios/message_types_1.png" title="仿系统 `bottomSheet` 样式" />
</ImageGallery>

### 管理菜单项

你可以通过以下两种方式灵活配置消息扩展菜单：

- **基于默认菜单项调整**：在 `onMoreActionsItemsHandler` 回调中接收默认菜单项列表，并对其进行动态调整，支持添加、移除或修改菜单项。
- **完全自定义菜单项列表**：通过 `MessagesView` 的 `morePressActions` 参数直接传入完整的自定义菜单项列表，将完全替换默认菜单项。

`ChatUIKitEventAction` 提供两种菜单项类型：

- **普通菜单项**：使用 `ChatUIKitEventAction.normal()` 构造函数创建，用于一般功能操作。
- **危险操作菜单项**：使用 `ChatUIKitEventAction.destructive()` 构造函数创建，用于需要警示的操作。

**方式一：基于默认菜单项调整**

使用 `onMoreActionsItemsHandler` 回调可在默认菜单项列表基础上进行动态调整，包括添加、移除或修改菜单项：

```dart
MessagesView(
  profile: profile,
  onMoreActionsItemsHandler: (context, defaultActions) {
    // 添加自定义菜单项
    defaultActions.add(
      ChatUIKitEventAction.normal(
        actionType: ChatUIKitActionType.custom,
        label: '自定义',
        icon: Icon(Icons.star),
        onTap: () {
          // 处理自定义操作
        },
      ),
    );
    
    // 移除某个菜单项（例如移除文件菜单）
    defaultActions.removeWhere(
      (action) => action.actionType == ChatUIKitActionType.file,
    );
    
    // 返回修改后的菜单项列表
    return defaultActions;
  },
)
```

**方式二：完全自定义菜单项列表**

通过 `morePressActions` 参数直接提供完整的菜单项列表，原默认菜单将被完全替换：

```dart
MessagesView(
  profile: profile,
  morePressActions: [
    ChatUIKitEventAction.normal(
      actionType: ChatUIKitActionType.camera,
      label: '拍照',
      icon: ChatUIKitImageLoader.messageViewMoreCamera(
        color: Colors.blue,
      ),
      onTap: () {
        // 处理拍照
      },
    ),
    ChatUIKitEventAction.normal(
      actionType: ChatUIKitActionType.photos,
      label: '相册',
      icon: ChatUIKitImageLoader.messageViewMoreAlbum(
        color: Colors.blue,
      ),
      onTap: () {
        // 处理相册
      },
    ),
    ChatUIKitEventAction.normal(
      actionType: ChatUIKitActionType.video,
      label: '视频',
      icon: ChatUIKitImageLoader.messageViewMoreVideo(
        color: Colors.blue,
      ),
      onTap: () {
        // 处理视频
      },
    ),
    ChatUIKitEventAction.normal(
      actionType: ChatUIKitActionType.file,
      label: '文件',
      icon: ChatUIKitImageLoader.messageViewMoreFile(
        color: Colors.blue,
      ),
      onTap: () {
        // 处理文件
      },
    ),
    // 添加自定义菜单项
    ChatUIKitEventAction.normal(
      actionType: ChatUIKitActionType.custom,
      label: '自定义',
      icon: Icon(Icons.star),
      onTap: () {
        // 处理自定义操作
      },
    ),
  ],
)
```

### 监听消息扩展菜单点击事件

消息扩展菜单项的点击事件通过在创建 `ChatUIKitEventAction` 时，为其 `onTap` 参数设置回调函数来实现。

- 通过 `morePressActions` 设置点击事件：

`morePressActions` 是点击输入框右侧的 “+” 后显示的菜单项列表。你可以在创建时直接为每个菜单项设置 `onTap` 回调：

```dart
MessagesView(
  profile: profile,
  morePressActions: [
    ChatUIKitEventAction.normal(
      actionType: ChatUIKitActionType.camera,
      label: '拍照',
      icon: ChatUIKitImageLoader.messageViewMoreCamera(),
      onTap: () {
        // 处理拍照点击事件
        print('拍照菜单项被点击');
        // 执行拍照逻辑
      },
    ),
    ChatUIKitEventAction.normal(
      actionType: ChatUIKitActionType.photos,
      label: '相册',
      icon: ChatUIKitImageLoader.messageViewMoreAlbum(),
      onTap: () {
        // 处理相册点击事件
        print('相册菜单项被点击');
        // 执行相册选择逻辑
      },
    ),
  ],
)
```

- 通过 `onMoreActionsItemsHandler` 动态修改菜单并设置点击事件：

`onMoreActionsItemsHandler` 是点击 “+” 时触发的回调，你可以在其中对默认菜单项进行过滤、修改或新增，同时为菜单项设置点击事件。

```dart
MessagesView(
  profile: profile,
  onMoreActionsItemsHandler: (context, defaultActions) {
     // 示例：为默认菜单项重新设置点击事件（需创建新实例）
    for (var action in defaultActions) {
      final originalOnTap = action.onTap;
      // 注意：ChatUIKitEventAction 为不可变对象，修改点击事件需重新创建
      // 这里只是示例，实际应使用 copyWith 或重新创建
    }
    
    // 示例：新增自定义菜单项并设置点击事件
    defaultActions.add(
      ChatUIKitEventAction.normal(
        actionType: ChatUIKitActionType.custom,
        label: '自定义',
        icon: Icon(Icons.star),
        onTap: () {
          print('自定义菜单项被点击');
          // 处理自定义操作
        },
      ),
    );
    
    return defaultActions;
  },
)
```

:::tip
- `ChatUIKitEventAction` 为不可变对象，如需修改现有菜单项的属性（如 `onTap`），需重新创建实例。
- 你可以根据业务需求，在 `onMoreActionsItemsHandler` 中动态调整菜单项的内容和行为。
:::

## 事件监听

消息输入区支持多种事件监听，可通过 `ChatUIKitInputBar` 进行配置：

```dart
ChatUIKitInputBar(
  keyboardPanelController: inputController,
  onInputTextChanged: (text) {
    // 输入文本变化时触发
  },
  onPanelChanged: (panelType) {
    // 面板切换时触发（键盘/表情/更多面板等）
  },
)
```

## 自定义样式与资源

对于消息输入区，你可以通过主题配置或自定义 Widget 来修改消息输入区的图标、文字、颜色等样式。

### 常用图标替换

对于底部输入菜单中的常用功能图标，可通过自定义 Widget 替换：

```dart
ChatUIKitInputBar(
  keyboardPanelController: inputController,
  leftItems: [
    // 自定义语音按钮
    IconButton(
      icon: Icon(Icons.mic),
      onPressed: () {
        // 处理语音
      },
    ),
  ],
  rightItems: [
    // 自定义表情按钮
    IconButton(
      icon: Icon(Icons.emoji_emotions),
      onPressed: () {
        inputController.switchPanel(ChatUIKitKeyboardPanelType.emoji);
      },
    ),
    // 自定义更多按钮
    IconButton(
      icon: Icon(Icons.add_circle),
      onPressed: () {
        inputController.switchPanel(ChatUIKitKeyboardPanelType.more);
      },
    ),
  ],
)
```

### 可自定义的主题配置

可自定义的主题配置，按子模块可划分为以下类别：

| 类别 | 配置 |
| :--- | :--- |
| `InputMenu 容器` | `ChatUIKitInputBarTheme.backgroundColor` |
| `PrimaryMenu`（输入栏） | `ChatUIKitInputBarTheme.inputBackgroundColor` |
| `ExtendMenu`（更多菜单） | 通过 `ChatUIKitMorePanel` 自定义 |
| `EmojiMenu`（表情菜单） | 通过自定义 `EmojiPanel` 实现 |
| `TopExtendMenu`（菜单顶部扩展区域） | 通过 `replyBarBuilder` 自定义 |

# 会话列表的高级设置

本文介绍如何通过 `ConversationListViewController` 和自定义构建器实现会话列表的高级设置，包括会话条目的样式、头像、长按菜单以及图标等。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/main_conversation_list.png" title="完整的会话列表页面 ConversationsView" />
</ImageGallery>

## 概述

通过 `ConversationsView` 的 `itemBuilder` 参数，可自定义会话列表中每个条目的展示内容。该构建器在每个会话条目渲染时调用，并通过 `model` 参数传入当前会话的数据模型，供你构建自定义 UI。

```dart
ConversationsView(
  controller: controller,
  itemBuilder: (context, model) {
    // 自定义会话项
    return CustomConversationItem(model: model);
  },
  // 其他配置...
)
```

## 设置会话条目背景

会话条目的背景可以通过主题配置或自定义 `itemBuilder` 设置：

```dart
// 通过主题配置
ChatUIKitTheme.instance.color.neutralColor98; // 会话项背景色

// 或通过自定义 itemBuilder
ConversationsView(
  itemBuilder: (context, model) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
      ),
      child: ChatUIKitConversationListViewItem(model),
    );
  },
)
```

## 设置会话条目高度

会话条目的高度可以通过自定义 `itemBuilder` 设置：

```dart
ConversationsView(
  itemBuilder: (context, model) {
    return SizedBox(
      height: 80, // 设置高度
      child: ChatUIKitConversationListViewItem(model),
    );
  },
)
```

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/ios/configurationitem/conversation/Appearance_conversation_rowHeight.png" title="会话条目的高度" />
</ImageGallery>

## 设置会话条目标题

会话条目的标题通常显示会话名称，规则如下：

- 单聊会话：优先显示 `ChatUIKitProvider` 提供的好友备注/昵称（`remark/name`），否则显示对端 `userId`。
- 群聊会话：优先显示 `ChatUIKitProvider` 提供的群名称（`name`），其次查找本地群组信息，若存在则显示群名称，否则显示群组 ID。

你可通过自定义 `itemBuilder` 调整标题样式，例如，文字大小和颜色。使用 `titleWidget` 参数传入自定义的标题 Widget：

使用示例如下：

```dart
ConversationsView(
  itemBuilder: (context, model) {
    return ChatUIKitConversationListViewItem(
      model,  // info 是位置参数，类型为 ConversationItemModel
      titleWidget: Text(
        model.showName,  // 使用 model.showName 获取显示名称
        style: TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.bold,
          color: Colors.black87,
        ),
        overflow: TextOverflow.ellipsis,
        maxLines: 1,
      ),
    );
  },
)
```

:::tip
- `ChatUIKitConversationListViewItem` 的第一个参数 `info` 是位置参数（类型为 `ConversationItemModel`），不是命名参数 `model`。
- 如果要自定义标题样式，使用 `titleWidget` 参数传入自定义的 `Widget`。
- 如果不提供 `titleWidget`，将使用默认的标题样式。
:::

## 设置会话条目内容

默认情况下，会话条目的内容区域显示 **最新一条消息摘要**，例如，文字、图片、语音等会转换为对应的摘要文本。

你可以通过自定义 `itemBuilder` 调整内容样式。使用 `subTitleLabel` 参数可以自定义子标题文本：

```dart
ConversationsView(
  itemBuilder: (context, model) {
    return ChatUIKitConversationListViewItem(
      model,  // info 是位置参数
      subTitleLabel: '自定义子标题',  // 自定义子标题文本
    );
  },
)
```

:::tip
`ChatUIKitConversationListViewItem` 没有 `contentStyle` 参数。子标题的样式是固定的，由主题决定。如果需要完全自定义子标题样式，可以使用 `beforeSubtitle` 和 `afterSubtitle` 参数，或者完全自定义 `itemBuilder`。
:::

## 设置会话条目时间

默认情况下，会话列表中的每条会话会显示 **最新一条消息的时间**（以格式化后的时间字符串呈现）。

`ChatUIKitConversationListViewItem` 组件不提供 `timeStyle` 参数，其时间显示样式由当前应用主题固定控制。

如需自定义时间格式或样式，你有以下两种选择：

- **完全自定义会话条目**：通过自定义 `itemBuilder` 实现整个会话条目的 UI 和逻辑。
- **隐藏默认时间并自行实现**：设置 `showNewMessageTime: false` 隐藏默认时间显示，然后通过其他方式（如自定义布局）展示你所需的时间格式。

## 设置会话条目头像

你可以设置默认头像以及头像的样式，如下图所示：

<ImageGallery :columns="3">
  <ImageItem src="/images/uikit/chatuikit/ios/avatar_square.png" title="方形头像" />
  <ImageItem src="/images/uikit/chatuikit/ios/avatar_circle.png" title="圆形头像" />
  <ImageItem src="/images/uikit/chatuikit/ios/avatar_no.png" title="无头像" />
</ImageGallery>

#### 设置默认头像

会话条目的默认头像设置位于 `ChatUIKitConversationListViewItem`，会根据会话类型指向特定资源。你可以通过 `ChatUIKitProvider` 设置默认头像：

```dart
ChatUIKitProvider.instance.addProfiles([
  ChatUIKitProfile(
    id: 'user_id',
    avatarUrl: 'https://example.com/avatar.png',
  ),
]);
```

#### 设置头像样式

**`ChatUIKitConversationListViewItem` 没有 `avatarSize` 和 `avatarShape` 参数。** 头像大小固定为 50。

头像的圆角半径由全局设置 `ChatUIKitSettings.avatarRadius` 决定（默认值为 `CornerRadius.medium`），**不区分单聊和群聊**。所有会话的头像都使用相同的圆角半径设置。

:::tip
- `ChatUIKitAvatar` 的 `isGroup` 参数只用于显示不同的默认头像图片（单聊和群聊的默认头像图片不同），**不影响头像的圆角半径**。
- 如果需要自定义头像大小和样式，需要完全自定义 `itemBuilder`，或者通过 `ChatUIKitSettings.avatarRadius` 全局设置所有头像的圆角半径。
:::

#### 隐藏会话条目头像

你可以通过 `showAvatar` 参数隐藏会话条目头像：

```dart
ConversationsView(
  itemBuilder: (context, model) {
    return ChatUIKitConversationListViewItem(
      model,  // info 是位置参数
      showAvatar: false,  // 隐藏头像
    );
  },
)
```

## 设置会话条目长按菜单

长按会话条目会显示会话操作菜单。会话列表页面使用 `ConversationListViewController` 中提供的方法默认实现会话免打扰、会话置顶、会话标记已读和会话删除操作，详见 [基本设置说明](chatuikit_custom_conversation_list_basic.html#默认会话操作)。

#### 设置会话操作

你可以通过 `onItemLongPressHandler` 回调管理长按菜单项：

```dart
ConversationsView(
  onItemLongPressHandler: (context, info, menuItems) {
    // 添加自定义菜单项
    menuItems.add(
      ChatUIKitEventAction.normal(
        label: '自定义操作',
        onTap: () {
          // 处理自定义操作
        },
      ),
    );
    return menuItems;
  },
)
```

#### 设置菜单样式

会话长按菜单通过 `showChatUIKitBottomSheet` 函数显示，内部使用 `ChatUIKitBottomSheet` Widget 渲染。菜单项样式通过 `ChatUIKitTheme` 主题配置。

| 菜单项样式            | 说明  | 
| :-------------- | :----- | 
| 普通菜单项样式   | 使用 `theme.font.bodyLarge` 的字体大小和粗细，文字颜色使用 `theme.color.primaryColor5`（浅色模式）或 `theme.color.primaryColor6`（深色模式）。   |
| 危险操作菜单项样式  | 使用 `theme.font.bodyLarge` 的字体大小和粗细，文字颜色使用 `theme.color.errorColor5`（浅色模式）或 `theme.color.errorColor6`（深色模式）。   |
| 菜单背景色    | 由 `showModalBottomSheet` 的 `backgroundColor` 参数控制（默认为系统主题背景色）。   |
| 分隔线颜色    | 使用 `theme.color.neutralColor9`（浅色模式）或 `theme.color.neutralColor2`（深色模式）。   |

如果需要在创建 `ChatUIKitEventAction` 时自定义样式，可传入 `style` 参数：

```dart
ConversationsView(
  onItemLongPressHandler: (context, info, menuItems) {
    menuItems.add(
      ChatUIKitEventAction.normal(
        label: '自定义操作',
        style: TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.bold,
          color: Colors.blue,
        ),
        onTap: () {
          // 处理自定义操作
        },
      ),
    );
    return menuItems;
  },
)
```

## 设置会话免打扰图标

会话免打扰图标对应会话条目中的图标，当 `conversation.isSilent()` 返回 `true` 时显示。

- **默认图标**：通过主题配置。
- **替换图标**：通过自定义 `itemBuilder` 实现。
- **隐藏图标**：通过自定义 `itemBuilder` 隐藏。

## 设置消息未读计数图标

会话列表的未读提示支持 **数字** 与 **小蓝点** 两种样式：

- **数字样式**：当会话未开启免打扰模式时，显示数字徽章（`ChatUIKitBadge`）。
- **小蓝点样式**：当会话开启免打扰模式（`noDisturb == true`）时，显示一个小圆点。

默认以数字形式显示在会话条目右侧。

会话列表的未读提示支持 **数字** 与 **小蓝点** 两种样式，其显示与会话免打扰（`info.noDisturb`）的开启和关闭相关： 

| 消息未读计数样式 | 未开启会话免打扰   | 开启会话免打扰 | 
| :-------------- | :----- | :------- |
| 数字  | 显示数字徽章（`ChatUIKitBadge`）。    | `ChatUIKitBadge` Widget 显示具体的未读消息数量。| 
| 小蓝点           | 显示一个固定尺寸为 8×8 像素的圆形视觉标识，其填充颜色采用主题中的主色调（`primaryColor5` 或 `primaryColor6`），圆角半径设置为 4 像素以形成完整的圆形外观。 |  显示一个小圆点。   |

#### 设置未读计数样式

你可以通过 `ChatUIKitTheme` 主题配置未读提示的视觉样式，例如，颜色和字体。具体样式可通过 `ConversationListView` 的相关参数进行设置。

- **小蓝点样式：**

小蓝点使用主题的主色调 `primaryColor5` 或 `primaryColor6`：

```dart
// 修改主题的主色调
ChatUIKitTheme.instance.setColor(
  ChatUIKitColor.light().copyWith(
    primaryColor5: Colors.blue,  // 浅色模式下的主色调
    primaryColor6: Colors.blueAccent,  // 深色模式下的主色调
  ),
);
```

- **数字样式：**

数字样式（`ChatUIKitBadge`）使用以下主题属性：
- 背景色：`primaryColor5`（浅色模式）或 `primaryColor6`（深色模式）
- 文字颜色：`neutralColor98`（浅色模式）或 `neutralColor1`（深色模式）
- 字体：`labelSmall`

```dart
// 方式一：通过修改主题颜色
ChatUIKitTheme.instance.setColor(
  ChatUIKitColor.light().copyWith(
    primaryColor5: Colors.red,  // 修改数字徽章背景色
    neutralColor98: Colors.white,  // 修改数字徽章文字颜色
  ),
);

// 方式二：通过修改主题字体
ChatUIKitTheme.instance.setFont(
  ChatUIKitFont.defaultFont().copyWith(
    labelSmall: TextStyle(
      fontSize: 12,
      fontWeight: FontWeight.bold,
    ),
  ),
);
```

- **自定义未读提示 Widget：**

目前，小蓝点样式不支持直接配置图标。如需添加图标，需通过 `itemBuilder` 提供完整自定义实现。

```dart
ConversationsView(
  itemBuilder: (context, model) {
    return ChatUIKitConversationListViewItem(
      model,
      // 自定义未读提示：使用自定义 Widget 替换默认的未读计数
      afterSubtitle: model.unreadCount > 0
          ? Container(
              padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: Colors.orange,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                model.unreadCount > 99 ? '99+' : model.unreadCount.toString(),
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 10,
                ),
              ),
            )
          : SizedBox(),
    );
  },
)
```

#### 自定义未读提示背景与图标

未读提示的背景和图标可通过以下方式自定义：

**方式一：通过 `ChatUIKitBadge` 的参数自定义**

`ChatUIKitBadge` 支持 `backgroundColor` 和 `textColor` 参数自定义背景和文字颜色。

参数设置的优先级高于主题配置。若不设置这些参数，将使用主题中的默认颜色。

```dart
ConversationsView(
  itemBuilder: (context, model) {
    Widget unreadBadge;
    if (!model.noDisturb && model.unreadCount > 0) {
      unreadBadge = ChatUIKitBadge(
        model.unreadCount,
        backgroundColor: Colors.orange,  // 自定义背景色
        textColor: Colors.white,  // 自定义文字颜色
      );
    } else {
      unreadBadge = SizedBox();
    }
    
    return ChatUIKitConversationListViewItem(
      model,
      afterSubtitle: unreadBadge,
    );
  },
)
```

**方式二：通过主题配置修改背景和颜色**

通过修改 `ChatUIKitTheme` 的主题颜色来修改未读提示的背景和文字颜色：

```dart
// 修改数字徽章的背景色（通过 primaryColor5/6）
ChatUIKitTheme.instance.setColor(
  ChatUIKitColor.light().copyWith(
    primaryColor5: Colors.green,  // 数字徽章背景色
    neutralColor98: Colors.white,  // 数字徽章文字颜色
  ),
);

// 修改小蓝点的颜色（通过 primaryColor5/6）
ChatUIKitTheme.instance.setColor(
  ChatUIKitColor.light().copyWith(
    primaryColor5: Colors.purple,  // 小蓝点颜色（浅色模式）
    primaryColor6: Colors.purpleAccent,  // 小蓝点颜色（深色模式）
  ),
);
```

**方式三：完全自定义未读提示 Widget（包括图标）**

通过 `itemBuilder` 和 `afterSubtitle` 参数完全自定义未读提示的 Widget，可以添加图标、自定义样式等：

```dart
ConversationsView(
  itemBuilder: (context, model) {
    Widget customUnreadWidget;
    
    if (model.unreadCount > 0) {
      if (model.noDisturb) {
        // 自定义小蓝点样式（可以添加图标）
        customUnreadWidget = Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.notifications, size: 12, color: Colors.blue),
            SizedBox(width: 4),
            Container(
              width: 8,
              height: 8,
              decoration: BoxDecoration(
                color: Colors.blue,
                borderRadius: BorderRadius.circular(4),
              ),
            ),
          ],
        );
      } else {
        // 自定义数字徽章样式（可以添加图标）
        customUnreadWidget = Container(
          padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
          decoration: BoxDecoration(
            color: Colors.red,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.mail, size: 12, color: Colors.white),
              SizedBox(width: 2),
              Text(
                model.unreadCount > 99 ? '99+' : model.unreadCount.toString(),
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        );
      }
    } else {
      customUnreadWidget = SizedBox();
    }
    
    return ChatUIKitConversationListViewItem(
      model,
      afterSubtitle: customUnreadWidget,
    );
  },
)
```

## 设置事件监听

`ConversationsView` 支持对会话条目及其长按菜单的事件监听，推荐通过参数统一配置：

```dart
ConversationsView(
  onItemTap: (context, info) {
    // 处理会话条目点击事件
  },
  onItemLongPressHandler: (context, info, menuItems) {
    // 处理会话条目长按事件，可自定义菜单项
    return menuItems;
  },
  onSearchTap: (data) {
    // 处理搜索按钮点击事件
  },
)
```

若你已有 `ConversationListViewController` 示例，还可通过 `controller` 监听会话列表的数据变更。

该监听器适用于需要实时感知会话列表更新的场景，如数据刷新、状态同步等。

```dart
final controller = ConversationListViewController();

controller.addListener(() {
  // 监听会话列表数据变化
  // 例如：刷新 UI 或更新状态
});
```

## 自定义资源

除页面配置外，本节完整列举了会话列表相关的可定制资源，包括图标、文案和颜色等。你可以通过以下方式替换 UIKit 的默认实现：

- 主题配置：在应用主题中统一覆盖样式变量
- 自定义 Widget：重写会话列表的局部 UI 组件

这两种方式均可灵活实现资源替换，满足个性化设计需求。

#### 可自定义的主题配置

| 分类 | 配置 | 用途说明 |
| :--- | :--- | :------- |
| 通用/默认头像 | `ChatUIKitTheme.instance.color` | 默认颜色配置 |
| 会话条目的背景/状态 | `ChatUIKitTheme.instance.color` | 会话项背景色 |
| 免打扰（Mute/DND） | 通过 `itemBuilder` 自定义 | 会话免打扰图标 |
| 未读数/未读点 | 通过 `itemBuilder` 自定义 | 未读提示样式 |

#### 可自定义的文案

| 分类 | 配置 | 用途说明 |
| :--- | :--- | :------- |
| 会话条目的长按菜单 | 通过 `onItemLongPressHandler` 自定义 | 菜单项文案 |
| 会话页面“更多”弹窗 | 通过 `moreActionsBuilder` 自定义 | 操作文案 |

#### 可自定义的颜色

| 分类 | 配置 | 用途说明 |
| :--- | :--- | :------- |
| 会话条目的文字/分割线/状态 | `ChatUIKitTheme.instance.color` | 文字颜色配置 |
| 会话长按菜单（`BottomSheet`） | `ChatUIKitTheme.instance.color` | 菜单背景色 |

#### 可自定义的布局

如果需要移除控件、重排布局、插入新控件等结构调整，可根据需求通过自定义 `itemBuilder` 实现：

```dart
ConversationsView(
  itemBuilder: (context, model) {
    // 自定义布局
    return CustomConversationItemLayout(model: model);
  },
)
```

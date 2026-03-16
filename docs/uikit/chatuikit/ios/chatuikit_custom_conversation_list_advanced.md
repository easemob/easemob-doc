# 会话列表的高级设置

本文介绍如何通过 `Appearance.conversation` 和 `ComponentsRegister` 实现会话列表的高级设置，包括条目样式、侧滑菜单、更多操作菜单等功能的配置。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/conversation_list.png" title="会话列表组件 ConversationList.swift" />
</ImageGallery>

## 概述

会话列表的自定义主要通过以下两个模块实现：

- **Appearance.conversation**: 配置视觉样式，包括行高、侧滑菜单、占位图、日期格式等。建议在 `AppDelegate` 或 `SceneDelegate` 中统一配置 `Appearance.conversation`，确保应用内样式一致。
- **ComponentsRegister**: 替换核心组件，包括会话列表条目、ViewModel 或 Controller。

配置使用示例如下：

```swift
// 设置会话条目行高
Appearance.conversation.rowHeight = 80

// 设置默认头像
Appearance.conversation.singlePlaceHolder = UIImage(named: "my_default_avatar")
Appearance.conversation.groupPlaceHolder = UIImage(named: "my_group_avatar")

// 设置会话时间格式
Appearance.conversation.dateFormatToday = "HH:mm"
Appearance.conversation.dateFormatOtherDay = "yyyy/MM/dd"

// 自定义侧滑菜单
Appearance.conversation.swipeLeftActions = [.pin, .delete]
Appearance.conversation.swipeRightActions = [.read]

// 添加自定义"更多"菜单项
let translateAction = ActionSheetItem(
    title: "翻译", 
    type: .normal, 
    tag: "Translate",
    image: UIImage(systemName: "character.bubble")
)
translateAction.action = { [weak self] item in
    // 实现翻译功能
    print("执行翻译操作")
}
Appearance.conversation.moreActions.append(translateAction)

// 自定义导航栏更多菜单
let scanAction = ActionSheetItem(
    title: "扫一扫", 
    type: .normal, 
    tag: "Scan",
    image: UIImage(systemName: "qrcode.viewfinder")
)
Appearance.conversation.listMoreActions.append(scanAction)

// 完全替换列表菜单
Appearance.conversation.listMoreActions = [
    ActionSheetItem(
        title: "新建单聊", 
        type: .normal, 
        tag: "NewChat",
        image: UIImage(systemName: "message")
    ),
    ActionSheetItem(
        title: "新建群聊", 
        type: .normal, 
        tag: "NewGroup",
        image: UIImage(systemName: "person.3")
    ),
    ActionSheetItem(
        title: "扫一扫", 
        type: .normal, 
        tag: "Scan",
        image: UIImage(systemName: "qrcode")
    )
]
```

## 设置会话条目高度

通过 `Appearance.conversation` 调整会话条目高度，即 `ConversationListCell` 的高度：

```swift
Appearance.conversation.rowHeight = 76
```

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/ios/configurationitem/conversation/Appearance_conversation_rowHeight.png" title="会话条目的高度" />
</ImageGallery>

## 设置会话条目头像

1. 通过 `Appearance.conversation` 调整单聊和群聊的默认头像：

```swift
// 设置单聊默认头像
Appearance.conversation.singlePlaceHolder = UIImage(named: "my_single_avatar")

// 设置群聊默认头像
Appearance.conversation.groupPlaceHolder = UIImage(named: "my_group_avatar")
```

2. 设置会话头像圆角：

头像圆角，分为极小、小、中、大等四个等级。你可以利用 `Appearance.avatarRadius = value` 设置头像圆角。

<ImageGallery :columns="3">
  <ImageItem src="/images/uikit/chatuikit/ios/avatar_square.png" title="方形头像" />
  <ImageItem src="/images/uikit/chatuikit/ios/avatar_circle.png" title="圆形头像" />
  <ImageItem src="/images/uikit/chatuikit/ios/avatar_no.png" title="无头像" />
</ImageGallery>

## 设置会话侧滑菜单

配置侧滑菜单中的按钮：

```swift
// 配置左滑菜单按钮
Appearance.conversation.swipeLeftActions = [.mute, .pin, .delete]

// 配置右滑菜单按钮
Appearance.conversation.swipeRightActions = [.more, .read]
```

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/ios/configurationitem/conversation/Appearance_conversation_swipeLeftActions.png" title="会话左滑和右滑菜单" />
</ImageGallery>

## 设置会话条目时间

#### 设置时间格式

通过 `Appearance.conversation` 可调整当天和非当天的显示格式：

```swift
// 设置日期格式
Appearance.conversation.dateFormatToday = "HH:mm" // 当天显示格式
Appearance.conversation.dateFormatOtherDay = "MM/dd"// 非当天显示格式
```

#### 设置时间样式

会话时间支持设置文字大小和颜色：

1. 继承 `ConversationListCell` 创建子类。
2. 重写 `createDate()` 方法，自定义日期标签样式。
3. 注册自定义类到 `EaseChatUIKit`，确保聊天列表使用自定义的日期样式。

```Swift
    override func createDate() -> UILabel {
        
    }
```

## 设置会话条目侧滑菜单

会话列表支持左右滑动手势操作，可通过 `Appearance.conversation` 自定义菜单项。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/ios/configurationitem/conversation/Appearance_conversation_swipeLeftActions.png" title="会话左滑和右滑" />
</ImageGallery>

#### 设置菜单项

- 菜单项数组顺序决定按钮显示顺序：

```swift
// 配置左滑菜单项（置顶、免打扰、删除等）
Appearance.conversation.swipeLeftActions = [.mute, .pin, .delete]

// 配置右滑菜单项（更多操作、标记已读等）
Appearance.conversation.swipeRightActions = [.more, .read]
```

- 侧滑菜单项会根据会话状态自动切换：

```swift
// 免打扰状态切换
if info.doNotDisturb {
    // 显示 .unmute（取消免打扰）
} else {
    // 显示 .mute（开启免打扰）
}

// 置顶状态切换
if info.pinned {
    // 显示 .unpin（取消置顶）
} else {
    // 显示 .pin（置顶会话）
}

// 未读状态判断
if info.unreadCount > 0 {
    // 显示 .read（标记已读）
} else {
    // 不显示 .read
}
```

#### 设置菜单样式

通过 `UIContextualActionType` 替换菜单项的图标和背景色。侧滑菜单按钮颜色会自动适配深色/浅色主题。

- 左滑菜单 (`swipeLeftActions`)

| 值        | 图标 | 国际化 Key                             | 背景色(深/浅)                                   | 说明       |
| :-------- | :------- | :------------------------------------- | :---------------------------------------------- | :--------- |
| `.mute`   | mute     | `conversation_right_slide_menu_mute`   | `neutralSpecialColor6` / `neutralSpecialColor5` | 开启免打扰 |
| `.unmute` | unmute   | `conversation_left_slide_menu_unmute`  | `neutralSpecialColor6` / `neutralSpecialColor5` | 关闭免打扰 |
| `.pin`    | pin      | `conversation_left_slide_menu_pin`     | `primaryDarkColor` / `primaryLightColor`        | 置顶会话   |
| `.unpin`  | unpin    | `conversation_left_slide_menu_unpin`   | `primaryDarkColor` / `primaryLightColor`        | 取消置顶   |
| `.delete` | trash    | `conversation_right_slide_menu_delete` | `errorColor6` / `errorColor5`                   | 删除会话   |

- 右滑菜单 (`swipeRightActions`)

| 值      | 图标 | 国际化 Key                           | 背景色(深/浅)                                   | 说明     |
| :------ | :------- | :----------------------------------- | :---------------------------------------------- | :------- |
| `.more` | more     | `conversation_right_slide_menu_more` | `neutralColor6` / `neutralColor5`               | 更多操作 |
| `.read` | read     | `conversation_right_slide_menu_read` | `neutralSpecialColor6` / `neutralSpecialColor5` | 标记已读 |

## 自定义导航栏更多菜单

点击导航栏右侧 “+” 按钮显示功能菜单，包括发起新会话、添加联系人、创建群组等菜单项。

默认 `listMoreActions` 包含以下菜单项：

| Tag              | 标题国际化 Key                              | 图标资源          | 说明               |
| :--------------- | :------------------------------------------ | :---------------- | :----------------- |
| `SelectContacts` | `new_chat_button_click_menu_selectcontacts` | `chatWith`        | 选择联系人发起聊天 |
| `AddContact`     | `new_chat_button_click_menu_addcontacts`    | `person_add_fill` | 添加新联系人       |
| `CreateGroup`    | `new_chat_button_click_menu_creategroup`    | `create_group`    | 创建群组           |

自定义菜单项：

```swift
// 获取当前菜单项
var actions = Appearance.conversation.listMoreActions

// 添加自定义菜单项
let scanAction = ActionSheetItem(
    title: "扫一扫",
    type: .normal,
    tag: "Scan",
    image: UIImage(named: "scan_icon")
)
scanAction.action = { item, _ in
    print("点击了扫一扫")
}
actions.append(scanAction)

// 更新配置
Appearance.conversation.listMoreActions = actions
```

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/ios/conversation_operation.png" title="导航栏更多菜单" />
</ImageGallery>

## 设置消息未读计数

1. 继承 `ConversationListCell` 创建子类。
2. 重写 `createBadge()` 方法，自定义未读计数标签样式 `UILabel`。
3. 注册自定义类到 `EaseChatUIKit`，确保聊天列表中的未读计数使用自定义样式。

```Swift
    override func createBadge() -> UILabel {
        
    }
```

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/conversation_unread.png" title="消息未读计数图标" />
</ImageGallery>

## 添加自定义会话条目

如需完全自定义会话条目的 UI（如调整布局、增加未读数显示样式），可继承 `ConversationListCell` 并进行注册：

#### 创建自定义会话条目

```swift
class MyConversationCell: ConversationListCell {
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        // 自定义 UI 布局
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    // 可重载的方法详见下方 'ConversationListCell 可重载方法' 章节
}
```

#### 注册自定义会话条目

```swift
// 注册自定义 Cell
ComponentsRegister.shared.ConversationCell = MyConversationCell.self

// 若配合改动数据，也需替换 ConversationInfo
ComponentsRegister.shared.ConversationInfo = MyConversationInfo.self
```

注册后，`ConversationListController` 在创建列表时会自动使用自定义的 `MyConversationCell`。

## 替换核心组件

你可以替换会话列表的 ViewModel 或 Controller，以实现更复杂的定制需求：

```swift
// 替换会话列表 ViewModel
ComponentsRegister.shared.ConversationViewService = MyConversationViewModel.self

// 替换会话列表 Controller
ComponentsRegister.shared.ConversationsController = MyConversationListController.self
```

## 全局主题色设置

会话列表的配色取决于全局主题色：

```swift
// 修改主色调（影响所有 UI 组件）
Appearance.primaryHue = 203/360.0
Appearance.secondaryHue = 155/360.0
```

## 自定义资源

#### 图片资源

在 `Bundle.main` 中添加同名文件覆盖：

| 资源名称          | 用途           | 默认位置                |
| :---------------- | :------------- | :------------------ |
| `single`          | 单聊默认头像   | `singlePlaceHolder` |
| `group`           | 群聊默认头像   | `groupPlaceHolder`  |
| `mute`            | 免打扰图标     | 左滑菜单            |
| `unmute`          | 取消免打扰图标 | 左滑菜单            |
| `pin`             | 置顶图标       | 左滑菜单            |
| `unpin`           | 取消置顶图标   | 左滑菜单            |
| `trash`           | 删除图标       | 左滑菜单            |
| `more`            | 更多图标       | 右滑菜单            |
| `read`            | 已读图标       | 右滑菜单            |
| `chatWith`        | 选择联系人图标 | 列表菜单            |
| `person_add_fill` | 添加联系人图标 | 列表菜单            |
| `create_group`    | 创建群组图标   | 列表菜单            |
| `empty`           | 空列表占位图   | 空状态视图          |
| `bell_slash`      | 免打扰标识     | 会话条目的昵称旁   |

#### 国际化资源

在 `Bundle.main` 的 `Localizable.strings` 中添加同名 key：

| Key      | 默认值(英文)    | 用途           |
| :-------------- | :-------------- | :------------- |
| `conversation_right_slide_menu_more`        | More            | 更多按钮       |
| `conversation_right_slide_menu_read`        | Read            | 标记已读按钮   |
| `conversation_right_slide_menu_delete`      | Delete          | 删除按钮       |
| `conversation_right_slide_menu_mute`        | Mute            | 免打扰按钮     |
| `conversation_left_slide_menu_pin`          | Pin             | 置顶按钮       |
| `conversation_left_slide_menu_unpin`        | Unpin           | 取消置顶按钮   |
| `conversation_left_slide_menu_unmute`       | Unmute          | 取消免打扰按钮 |
| `new_chat_button_click_menu_selectcontacts` | Select Contacts | 选择联系人     |
| `new_chat_button_click_menu_addcontacts`    | Add Contact     | 添加联系人     |
| `new_chat_button_click_menu_creategroup`    | Create Group    | 创建群组       |
| `Mentioned`                                 | Mentioned       | @提醒标识      |
| `Search`                                    | Search          | 搜索按钮文字   |
| `Chats`                                     | Chats           | 导航栏标题     |
| `Refreshing...`                             | Refreshing...   | 下拉刷新提示   |

## 可重载方法

以下组件均实现了 `ThemeSwitchProtocol`，支持深色/浅色模式切换，重载时需考虑主题兼容性。

#### ConversationListController

会话列表控制器 `ConversationListController` 的扩展点如下：

- **导航栏定制**：重载 `createNavigationBar()` 方法，可自定义导航栏的样式、按钮及标题。
- **搜索栏定制**：重载 `createSearchBar()` 方法，可自定义搜索框。
- **交互行为定制**：重载 `toChat()`、`rightActions()` 等方法，可覆盖默认的页面跳转、菜单点击等交互逻辑。
- **业务逻辑扩展**：重载 `create()`、`addContact()` 等方法，可集成业务验证、埋点统计等自定义逻辑。

`ConversationListController` 可重载方法如下所示：

- **UI 组件创建方法**

| 方法名 | 方法签名 | 返回类型 | 描述 |
| :---------- | :---- | :----- | :----- |
| `createNavigationBar()` | `@objc open func createNavigationBar() -> ChatNavigationBar` | ChatNavigationBar | 创建导航栏<br/>默认：无左侧按钮，右侧显示 “+” 按钮 |
| `createSearchBar()` | `@objc open func createSearchBar() -> UIButton` | UIButton | 创建搜索按钮<br/>显示 “Search” 文字和搜索图标 |
| `createList()` | `@objc open func createList() -> ConversationList` | ConversationList | 创建会话列表视图<br/>自动适配 tabBar 高度 |

- **生命周期方法**

| 方法名 | 方法签名 | 返回类型 | 描述 |
| :---------- | :---- | :----- | :----- |
| `viewWillAppear(_:)` | `open override func viewWillAppear(_ animated: Bool)` | Void | 视图即将显示<br/>更新头像、隐藏导航栏、设置窗口背景色 |
| `viewWillDisappear(_:)` | `open override func viewWillDisappear(_ animated: Bool)` | Void | 视图即将消失<br/>可添加自定义清理逻辑 |
| `viewDidLoad()` | `open override func viewDidLoad()` | Void | 视图加载完成<br/>绑定 ViewModel、设置事件回调、注册主题切换 |

- **导航和交互方法**
  
| 方法名 | 方法签名 | 返回类型 | 作用描述 |
| :---------- | :---- | :----- | :----- |
| `navigationClick(type:indexPath:)` | `@objc open func navigationClick(type: ChatNavigationBarClickEvent, indexPath: IndexPath?)` | Void | 处理导航栏点击事件<br/>包含返回按钮和右侧按钮点击 |
| `pop()` | `@objc open func pop()` | Void | 返回上一页<br/>如果有导航控制器则 `pop`，否则 `dismiss` |
| `toChat(indexPath:info:)` | `@objc open func toChat(indexPath: IndexPath, info: ConversationInfo)` | Void | 进入聊天页面<br/>创建 `MessageViewController` 并跳转 |
| `searchAction()` | `@objc open func searchAction()` | Void | 执行搜索操作<br/>显示 `SearchConversationsController` |
| `rightActions(indexPath:)` | `@objc open func rightActions(indexPath: IndexPath)` | Void | 处理右侧 “+” 按钮点击<br/>显示 **选择联系人**、**添加联系人**、**创建群组** 菜单 |

- **联系人和群组操作方法**

| 方法名 | 方法签名 | 返回类型 | 描述 |
| :---------- | :---- | :----- | :----- |
| `selectContact()` | `@objc open func selectContact()` | Void | 选择联系人<br/>显示联系人列表，选中后跳转聊天页面 |
| `chatToContact(profile:)` | `@objc open func chatToContact(profile: ChatUserProfileProtocol)` | Void | 与指定联系人聊天<br/>如果会话存在则跳转，否则创建新会话 |
| `createChat(profile:type:info:)` | `@objc open func createChat(profile: ChatUserProfileProtocol, type: ChatConversationType, info: String)` | Void | 创建会话并跳转<br/>支持单聊和群聊，缓存用户/群组信息 |
| `addContact()` | `@objc open func addContact()` | Void | 添加联系人<br/>显示对话框输入好友的用户 ID（`contactID`），调用 SDK 添加好友 |
| `createGroup()` | `@objc open func createGroup()` | Void | 创建群组<br/>显示联系人选择器，选择成员后创建群聊 |
| `create(profiles:)` | `@objc open func create(profiles: [ChatUserProfileProtocol])` | Void | 创建群组会话<br/>拼接群名称（前 3 个成员昵称），调用 SDK 创建群组 |

- **主题切换**

| 方法名 | 方法签名 | 返回类型 | 描述 |
| :---------- | :---- | :----- | :----- |
| `switchTheme(style:)` | `open func switchTheme(style: ThemeStyle)` | Void | 切换主题样式<br/>更新视图、搜索框、导航栏、列表背景色 |

- **头像更新**
  
| 方法名 | 方法签名 | 返回类型 | 描述 |
| :---------- | :---- | :----- | :----- |
| `updateAvatarURL(_:)` | `@MainActor @objc(updateWithAvatarURL:) public func updateAvatarURL(_ url: String)` | Void | 更新导航栏头像<br/>用于刷新当前用户头像显示 |

#### ConversationList

`ConversationList` 作为 `UITableView` 的子类，主要功能如下：

- **列表显示与交互**：处理会话条目的展示和用户操作。
- **UI 驱动层**：遵循 `IConversationListDriver` 协议，作为 ViewModel 的视图驱动。
- **UI 操作管理**：管理侧滑菜单、下拉刷新、数据刷新等交互行为。

`ConversationList` 的可重载方法如下：

- **数据请求方法**

| 方法名 | 方法签名 | 返回类型 | 描述 |
| :---------- | :---- | :----- | :----- |
| `requestDisplayInfo()` | `@objc open func requestDisplayInfo()` | Void | 请求显示信息<br/>滚动结束时，获取可见会话的昵称和头像数据 |

- **主题切换**

| 方法名 | 方法签名 | 返回类型 | 描述 |
| :---------- | :---- | :----- | :----- |
| `switchTheme(style:)` | `public func switchTheme(style: ThemeStyle)` | Void | 切换主题样式<br/>更新背景色并刷新列表 |

#### IConversationListDriver

IConversationListDriver 为 ViewModel 驱动接口，协议方法继承自 `UITableView`：

| 方法名 | 方法签名 | 返回类型 | 描述 |
| :---------- | :---- | :----- | :----- |
| `occurError()` | `public func occurError()` | Void | 发生错误时调用<br/>显示错误状态空视图 |
| `refreshList(infos:)` | `public func refreshList(infos: [ConversationInfo])` | Void | 刷新会话列表<br/>清空现有数据，加载新数据，更新索引映射 |
| `refreshProfiles(infos:)` | `public func refreshProfiles(infos: [ChatUserProfileProtocol])` | Void | 刷新用户信息<br/>更新会话列表中的昵称、备注、头像 |
| `swipeMenuOperation(info:type:)` | `public func swipeMenuOperation(info: ConversationInfo, type: UIContextualActionType)` | Void | 侧滑菜单操作<br/>处理已读、免打扰、取消免打扰、删除操作 |
| `appendThenRefresh(infos:)` | `public func appendThenRefresh(infos: [ConversationInfo])` | Void | 追加数据并刷新<br/>用于加载更多会话 |
| `showNew(info:)` | `public func showNew(info: ConversationInfo)` | Void | 显示新会话<br/>插入到列表顶部并滚动到顶部 |

#### ConversationListCell

会话列表条目 `ConversationListCell` 的功能如下：

- **UI 组件创建**：所有 `create*()` 方法均可重载，以替换或调整默认的视图元素。
- **数据刷新逻辑**：重载 `refresh(info:)` 方法，可在基础数据绑定之外添加自定义显示逻辑。
- **布局调整**：重载 `layoutSubviews()` 方法，调整元素位置。

`ConversationListCell` 的可重载方法如下：

- **UI 组件创建方法**

| 方法名 | 方法签名 | 返回类型 | 描述 |
| :---------- | :---- | :----- | :----- |
| `createAvatar()` | `@objc open func createAvatar() -> ImageView` | ImageView | 创建头像视图<br/>尺寸：50x50，圆角可配置 |
| `createNickName()` | `@objc open func createNickName() -> UIButton` | UIButton | 创建昵称按钮<br/>用 `UIButton` 支持富文本显示免打扰图标 |
| `createDate()` | `@objc open func createDate() -> UILabel` | UILabel | 创建日期标签<br/>显示最后一条消息的时间 |
| `createContent()` | `@objc open func createContent() -> UILabel` | UILabel | 创建消息内容标签<br/>显示最后一条消息的预览 |
| `createBadge()` | `@objc open func createBadge() -> UILabel` | UILabel | 创建未读徽章<br/>显示未读消息数量（最多 99+） |
| `createDot()` | `@objc open func createDot() -> UIView` | UIView | 创建免打扰红点<br/>免打扰模式下显示小红点代替数字徽章 |
| `createSeparatorLine()` | `@objc open func createSeparatorLine() -> UIView` | UIView | 创建分隔线<br/>位于会话条目的底部 |

- **数据刷新方法**

| 方法名 | 方法签名 | 返回类型 | 描述 |
| :---------- | :---- | :----- | :----- |
| `refresh(info:)` | `@objc(refreshWithInfo:) open func refresh(info: ConversationInfo)` | Void | 刷新会话条目显示<br/>更新头像、昵称、内容、时间、未读数、置顶状态、免打扰状态 |

- **布局方法**
 
| 方法名 | 方法签名 | 返回类型 | 描述 |
| :---------- | :---- | :----- | :----- |
| `layoutSubviews()` | `open override func layoutSubviews()` | Void | 布局子视图<br/>动态计算徽章宽度（1 位数/2 位数/3 位数以上） |

- **主题切换**

| 方法名 | 方法签名 | 返回类型 | 描述 |
| :---------- | :---- | :----- | :----- |
| `switchTheme(style:)` | `public func switchTheme(style: ThemeStyle)` | Void | 切换主题样式<br/>更新昵称、内容、日期、徽章、红点、分隔线颜色 |

#### ConversationInfo

会话信息模型 `ConversationInfo` 的可重载方法（内容转换方法）如下：

| 方法名 | 方法签名 | 返回类型 | 描述 |
| :---------- | :---- | :----- | :----- |
| `contentAttribute()` | `@objc open func contentAttribute() -> NSAttributedString` | NSAttributedString | 转换消息内容为富文本<br/>处理：文本/emoji/提及(@)标记/群聊昵称前缀/免打扰状态 |
| `convertMessage(message:)` | `open func convertMessage(message: ChatMessage) -> MessageEntity` | MessageEntity | 转换 `ChatMessage` 为 `MessageEntity` <br/>用于消息显示渲染 |
| `convertStatus(message:)` | `open func convertStatus(message: ChatMessage) -> ChatMessageStatus` | ChatMessageStatus | 转换消息状态<br/>将 SDK 状态映射为 UI 状态（发送中/成功/失败/送达/已读） |
| `toJsonObject()` | `open func toJsonObject() -> Dictionary<String, Any>?` | Dictionary<String, Any>? | 转换为 JSON 对象<br/>用于数据序列化（默认返回空字典） |

## 使用示例

#### 示例 1：自定义会话列表控制器

```swift
class MyConversationListController: ConversationListController {
    
    // 自定义导航栏
    override func createNavigationBar() -> ChatNavigationBar {
        let nav = super.createNavigationBar()
        nav.title = "我的聊天"
        return nav
    }
    
    // 自定义搜索栏
    override func createSearchBar() -> UIButton {
        let search = super.createSearchBar()
        search.backgroundColor = .systemGray6
        return search
    }
    
    // 自定义进入聊天逻辑
    override func toChat(indexPath: IndexPath, info: ConversationInfo) {
        // 添加埋点统计
        print("进入会话：\(info.id)")
        super.toChat(indexPath: indexPath, info: info)
    }
    
    // 自定义右侧菜单
    override func rightActions(indexPath: IndexPath) {
        // 显示自定义菜单
        let alert = UIAlertController(title: "操作", message: nil, preferredStyle: .actionSheet)
        alert.addAction(UIAlertAction(title: "扫一扫", style: .default, handler: { _ in
            // 实现扫码功能
        }))
        alert.addAction(UIAlertAction(title: "取消", style: .cancel))
        self.present(alert, animated: true)
    }
    
    // 自定义创建群组逻辑
    override func create(profiles: [ChatUserProfileProtocol]) {
        // 先验证群成员数量
        guard profiles.count >= 2 else {
            print("至少需要2个成员")
            return
        }
        super.create(profiles: profiles)
    }
}
```

#### 示例 2：自定义会话条目

```swift
class MyConversationListCell: ConversationListCell {
    
    // 自定义头像样式
    override func createAvatar() -> ImageView {
        let avatar = super.createAvatar()
        avatar.layer.borderWidth = 2
        avatar.layer.borderColor = UIColor.systemBlue.cgColor
        return avatar
    }
    
    // 自定义未读徽章样式
    override func createBadge() -> UILabel {
        let badge = super.createBadge()
        badge.backgroundColor = .systemRed
        badge.font = .boldSystemFont(ofSize: 12)
        return badge
    }
    
    // 自定义刷新逻辑
    override func refresh(info: ConversationInfo) {
        super.refresh(info: info)
        
        // 添加VIP标识
        if info.id.hasPrefix("vip_") {
            let vipIcon = UIImageView(image: UIImage(systemName: "crown.fill"))
            vipIcon.tintColor = .systemYellow
            vipIcon.frame = CGRect(x: 50, y: 10, width: 20, height: 20)
            self.contentView.addSubview(vipIcon)
        }
    }
}

```

#### 示例 3：自定义会话信息内容

```swift
class MyConversationInfo: ConversationInfo {
    
    // 自定义内容属性转换
    override func contentAttribute() -> NSAttributedString {
        guard let message = self.lastMessage else {
            return NSAttributedString(string: "暂无消息")
        }
        
        // 自定义草稿显示
        if let draft = getDraft(conversationId: self.id), !draft.isEmpty {
            return NSMutableAttributedString {
                AttributedText("[草稿] ").foregroundColor(.systemRed).font(.systemFont(ofSize: 14, weight: .bold))
                AttributedText(draft).foregroundColor(.systemGray).font(.systemFont(ofSize: 14))
            }
        }
        
        return super.contentAttribute()
    }
    
    // 自定义消息状态转换
    override func convertStatus(message: ChatMessage) -> ChatMessageStatus {
        let status = super.convertStatus(message: message)
        
        // 添加自定义逻辑：标记重要消息
        if message.ext?["important"] as? Bool == true {
            print("这是一条重要消息")
        }
        
        return status
    }
    
    private func getDraft(conversationId: String) -> String? {
        // 从本地缓存获取草稿
        return UserDefaults.standard.string(forKey: "draft_\(conversationId)")
    }
}
```

#### 示例 4：扩展 ConversationList 功能

```swift
extension ConversationList {
    
    // 添加自定义刷新逻辑
    func customRefresh() {
        // 显示加载动画
        let activityIndicator = UIActivityIndicatorView(style: .medium)
        activityIndicator.center = self.center
        self.addSubview(activityIndicator)
        activityIndicator.startAnimating()
        
        // 请求数据
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            activityIndicator.stopAnimating()
            activityIndicator.removeFromSuperview()
        }
    }
}
```

#### 示例 5：自定义 ConversationListController 处理菜单事件

```swift
class MyConversationListController: ConversationListController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // 处理自定义菜单项的点击事件
        // 在 rightActions(indexPath:) 中处理 listMoreActions 的 tag
    }
    
    override func rightActions(indexPath: IndexPath) {
        switch indexPath.row {
        case 0:
            DialogManager.shared.showActions(actions: Appearance.conversation.listMoreActions) { item in
                switch item.tag {
                case "SelectContacts": 
                    self.selectContact()
                case "AddContact": 
                    self.addContact()
                case "CreateGroup": 
                    self.createGroup()
                case "Scan":
                    // 处理自定义的扫一扫功能
                    self.showScanner()
                default:
                    break
                }
            }
        default:
            break
        }
    }
    
    func showScanner() {
        // 实现扫码功能
    }
}
```

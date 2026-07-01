# 自定义界面文案

UIKit 支持灵活定制界面文案，可修改现有文案或添加完整语言包。

## 概述

UIKit 所有界面文案均存储在 **字符串集（StringSet）** 中，以 **键值对** 形式集中管理。内置中文（`zh-Hans`）和英文（`en`）两种语言，支持以下自定义方式：

- **修改特定文案**：替换单个或多个文案条目。
- **覆盖完整语言包**：提供自定义的全量文案。
- **新增语言版本**：添加日语、韩语等多语言支持。

## 属性配置

通过 `UIKitContainer` 的以下属性配置文案：

| 属性     | 类型   | 说明          |
| :---- | :------ | :---------- |
| `language`          | `LanguageCode` | 界面显示语言，默认为系统语言。支持：`en`、`zh-Hans`、`zh-Hant`、`ru`、`de`、`fr`、`ja`、`ko` 等。 |
| `translateLanguage` | `LanguageCode` | 翻译目标语言，默认为系统语言。                                 |
| `onInitLanguageSet` | `Function`     | **语言包初始化回调**，用于自定义或扩展语言包。                   |

### 语言包初始化回调

`onInitLanguageSet` 返回一个函数或直接返回 `StringSet` 对象：

```typescript
onInitLanguageSet?: () => (
  language: LanguageCode,
  defaultSet: StringSet
) => CreateStringSet | StringSet;
```

| 返回形式     | 说明               |
| :------- | :----------------------- |
| `(language, defaultSet) => StringSet` | 函数形式，接收当前语言和默认语言包，返回自定义语言包。 |
| `StringSet`                           | 对象形式，直接返回自定义语言包。     |

### 字符串集结构

字符串集是一个键值对对象，值可为字符串或函数：

```typescript
export interface StringSet {
  [key: string]: string | ((...args: any[]) => string);
}
```

示例如下：

```typescript
{
  '_uikit_search': '搜索',
  '_uikit_create_group_button': (count) => `创建(${count})`,
  '_uikit_msg_tip_recall': (isSelf: boolean, name) =>
    isSelf === true ? `你撤回了一条消息` : `${name}撤回了一条消息`,
}
```

## 使用场景

### 修改部分文案

通过 `onInitLanguageSet` 覆盖特定文案：

```tsx
import {
  UIKitContainer,
  createStringSetCn,
  createStringSetEn,
} from "react-native-chat-uikit";

function App() {
  const onInitLanguageSet = React.useCallback(() => {
    return (language, defaultSet) => {
      // 在默认语言包基础上修改
      if (language === "zh-Hans") {
        return {
          ...createStringSetCn(),
          // 修改特定文案
          _uikit_search: "查找",
          _uikit_contact_title: "通讯录",
          _uikit_create_group_button: (count) => `确认创建(${count}人)`,
        };
      } else if (language === "en") {
        return {
          ...createStringSetEn(),
          // 修改特定文案
          _uikit_search: "Find",
          _uikit_contact_title: "Address Book",
        };
      }
      return defaultSet;
    };
  }, []);

  return (
    <UIKitContainer
      options={chatOptions}
      language="zh-Hans"
      onInitLanguageSet={onInitLanguageSet}
    >
      {/* Your app content */}
    </UIKitContainer>
  );
}
```

### 添加完整语言包

为 UIKit 添加新的语言支持，例如，日语。

自定义语言包必须使用与内置语言包 **完全相同的键名**，否则无法生效。

**步骤 1：创建语言包文件 StringSet.ja.tsx**。

```typescript
// StringSet.ja.tsx
import type { StringSet } from "react-native-chat-uikit";

export function createStringSetJa(): StringSet {
  return {
    // 基础功能
    _uikit_search: "検索",
    _uikit_search_placeholder: "キーワードを検索",
    _uikit_contact_title: "連絡先",
    _uikit_new_conv_title: "新しい会話",
    _uikit_create_group_title: "グループを作成",
    _uikit_create_group_button: (count) => `作成(${count})`,

    // 好友相关
    _uikit_contact_new_request: "新しいリクエスト",
    _uikit_contact_group_list: "グループ",
    _uikit_contact_black_list: "ブロックリスト",
    _uikit_contact_menu_add_contact: "連絡先を追加",

    // 消息相关
    _uikit_msg_tip_recall: (isSelf: boolean, name) =>
      isSelf
        ? "メッセージを取り消しました"
        : `${name}がメッセージを取り消しました`,
    _uikit_msg_tip_not_support: "サポートされていないメッセージタイプ",

    // 聊天输入
    _uikit_chat_input_long_press_menu_picture: "ギャラリー",
    _uikit_chat_input_long_press_menu_video: "ビデオ",
    _uikit_chat_input_long_press_menu_camera: "カメラ",
    _uikit_chat_input_long_press_menu_file: "ファイル",
    _uikit_chat_input_long_press_menu_card: "名刺",

    // 长按菜单
    _uikit_chat_list_long_press_menu_copy: "コピー",
    _uikit_chat_list_long_press_menu_replay: "返信",
    _uikit_chat_list_long_press_menu_delete: "削除",
    _uikit_chat_list_long_press_menu_recall: "取り消し",

    // 通用文案
    search: "検索",
    cancel: "キャンセル",
    confirm: "確認",
    save: "保存",
    add: "追加",
    remove: "削除",

    // ... 添加所有需要的文案
  };
}
```

**步骤 2：注册并在应用中使用**。

```tsx
import {
  UIKitContainer,
  createStringSetCn,
  createStringSetEn,
} from "react-native-chat-uikit";
import { createStringSetJa } from "./i18n/StringSet.ja";

function App() {
  const onInitLanguageSet = React.useCallback(() => {
    return (language, defaultSet) => {
      switch (language) {
        case "zh-Hans":
          return createStringSetCn();
        case "en":
          return createStringSetEn();
        case "ja":
          return createStringSetJa();
        default:
          return defaultSet;
      }
    };
  }, []);

  return (
    <UIKitContainer
      options={chatOptions}
      language="ja" // 使用日语
      onInitLanguageSet={onInitLanguageSet}
    >
      {/* Your app content */}
    </UIKitContainer>
  );
}
```

### 动态切换语言

```tsx
import { UIKitContainer } from "react-native-chat-uikit";

function App() {
  const [currentLanguage, setCurrentLanguage] =
    React.useState<LanguageCode>("zh-Hans");

  const onInitLanguageSet = React.useCallback(() => {
    return (language, defaultSet) => {
      if (language === "zh-Hans") {
        return {
          ...createStringSetCn(),
          // 可以添加自定义修改
        };
      } else if (language === "en") {
        return {
          ...createStringSetEn(),
          // 可以添加自定义修改
        };
      }
      return defaultSet;
    };
  }, []);

  // 切换语言
  const switchLanguage = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
  };

  return (
    <UIKitContainer
      options={chatOptions}
      language={currentLanguage}
      onInitLanguageSet={onInitLanguageSet}
    >
      {/* Your app content */}
      <Button title="切换到英文" onPress={() => switchLanguage("en")} />
      <Button title="切换到中文" onPress={() => switchLanguage("zh-Hans")} />
    </UIKitContainer>
  );
}
```

## 常用文案键值表

### 基础功能

| 键名                        | 中文     | 英文         | 说明         |
| :--------------------------- | :---------- | :------------ | :------------ |
| `_uikit_search`             | 搜索     | Search       | 搜索按钮     |
| `_uikit_contact_title`      | 好友   | Contacts     | 好友标题   |
| `_uikit_new_conv_title`     | 新会话   | New Chat     | 新会话标题   |
| `_uikit_create_group_title` | 创建群组 | Create Group | 创建群组标题 |

### 好友相关

| 键名                              | 中文       | 英文         | 说明           |
| :--------------------------- | :---------- | :------------ | :------------ |
| `_uikit_contact_new_request`      | 新请求     | New Requests | 新的好友请求   |
| `_uikit_contact_group_list`       | 群组       | Groups       | 群组列表       |
| `_uikit_contact_black_list`       | 黑名单     | Blocklist    | 黑名单         |
| `_uikit_contact_menu_add_contact` | 添加好友 | Add Contact  | 添加好友菜单 |

### 消息相关

| 键名      | 类型                   | 说明        |
| :-------------- | :----- | :------------ |
| `_uikit_msg_tip_recall`      | `(isSelf: boolean, name: string) => string` | 撤回消息提示     |
| `_uikit_msg_tip_not_support` | `string`                                    | 不支持的消息类型 |
| `_uikit_msg_edit`            | `string`                                    | 已编辑标记       |
| `_uikit_msg_translate`       | `string`                                    | 已翻译标记       |

### 聊天输入

| 键名        | 中文 | 英文    | 说明     |
| :------- | :---------- | :------------ | :------------ |
| `_uikit_chat_input_long_press_menu_picture` | 相册 | Gallery | 选择图片 |
| `_uikit_chat_input_long_press_menu_video`   | 视频 | Video   | 选择视频 |
| `_uikit_chat_input_long_press_menu_camera`  | 相机 | Camera  | 打开相机 |
| `_uikit_chat_input_long_press_menu_file`    | 文件 | File    | 选择文件 |
| `_uikit_chat_input_long_press_menu_card`    | 名片 | Card    | 分享名片 |

### 长按菜单

| 键名             | 中文 | 英文    | 说明     |
| :------ | :---------- | :-------- | :------- |
| `_uikit_chat_list_long_press_menu_copy`            | 复制 | Copy    | 复制消息 |
| `_uikit_chat_list_long_press_menu_replay`          | 回复 | Reply   | 回复消息 |
| `_uikit_chat_list_long_press_menu_delete`          | 删除 | Delete  | 删除消息 |
| `_uikit_chat_list_long_press_menu_recall`          | 撤回 | Recall  | 撤回消息 |
| `_uikit_chat_list_long_press_menu_forward_message` | 转发 | Forward | 转发消息 |

### 通用文案

| 键名      | 中文 | 英文    | 说明 |
| :------ | :---- | :--------- | :--------- |
| `search`  | 搜索 | Search  | 搜索 |
| `cancel`  | 取消 | Cancel  | 取消 |
| `confirm` | 确认 | Confirm | 确认 |
| `save`    | 保存 | Save    | 保存 |
| `add`     | 添加 | Add     | 添加 |
| `remove`  | 删除 | Remove  | 删除 |

## 完整字符串集参考

要查看所有可用的文案键值，需参考 UIKit 源码中的字符串集文件：

- **中文字符串集**：`StringSet.cn.tsx` 包含所有中文文案。
- **英文字符串集**：`StringSet.en.tsx` 包含所有英文文案。

建议复制这些文件作为模板，创建自己的语言版本。

## 常见问题

### 如何查看所有可用的文案键名？

查看源码中的 `StringSet.cn.tsx`（中文）或 `StringSet.en.tsx`（英文）文件，包含完整的键值定义。

### 修改文案后没有生效？

排查以下问题：

1. **回调未设置**：确认 `onInitLanguageSet` 已正确传入。
2. **键名错误**：检查键名拼写（**区分大小写**）。
3. **返回结构错误**：确认返回的是 `StringSet` 对象。
4. **未重启**：修改语言包后需重启应用。

### 如何处理动态文案？

某些文案包含动态内容（如用户名、数量等），需要使用函数形式：

```typescript
{
  // ❌ 错误：使用字符串无法动态插入内容
  '_uikit_create_group_button': '创建(count)',

  // ✅ 正确：使用函数返回动态内容
  '_uikit_create_group_button': (count) => `创建(${count})`,
}
```
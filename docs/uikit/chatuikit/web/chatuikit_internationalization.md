 # 国际化

目前，单群聊 UIKit 默认支持中文和英文，作为界面展示语言。你可以使用默认语言包，也可以增加其他语言包，传入对应的 `resources` 和 `lng`，即语言的 ISO 代码，例如，`en` 表示英语，`zh` 表示中文。

## 设置界面语言

```javascript
// 初始化 UIKit 时设置 local 参数
<UIKitProvider
 local={{
  lng: 'zh', // 设置要使用的语言
 }}
></UIKitProvider>
```

## 新增语言包

UIKit 中使用 `i18next` 做的国际化，可以按转 `i18next` 的设置增加新的语言包，设置 `resources` 增加新的语言包资源，设置 `lng` 为要使用的语言。

```javascript
// 引入语言包
import en from './en.json';

<UIKitProvider
 local={{
  lng: 'en',
  resources: {
   en: {
    translation: en, // 设置语言包
   },
  },
 }}
></UIKitProvider>;
```

在 `en.json` 文件中设置要修改的文本， 可以在[这里](https://github.com/easemob/Easemob-UIKit-web/tree/dev/local) 查看全部文案， 例如：

```json
{
  "conversationTitle": "Conversation List", 
  "deleteCvs": "Delete"
   ...
}
```
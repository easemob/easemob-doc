# Android 单群聊 UIKit 更新日志

## 版本 V4.11.1

### 新增特性

- [消息长按菜单样式新增微信风格样式](chatuikit_chat.html#设置消息长按后的菜单项)。
- [发送附件消息菜单新增微信风格样式](chatuikit_chat.html#设置发送附件消息弹窗样式)。

### 优化

权限申请时顶部增加权限申请说明。

### 修复

修复消息置顶特性在部分场景下未更新的一些问题。

### 重大变更

为规范 UIKit 各平台的命名，UIKit 内部将工程下所有以 `ease` 开头的类文件、layout 布局文件、资源文件及内部使用的部分字符串修改为以 `chatuikit` 开头，老用户升级时应注意变更相关引用。具体变更规则，请点击[这里](https://github.com/easemob/easemob-uikit-android/blob/main/script/rename_file_and_update_content.py)参考提供的脚本内部实现。脚本可以协助用户将应用层代码实现同步更名。

调用方式如下：

python3 rename_file_and_update_content.py target_folder --rename-files --replace-content
- target_folder：目标文件夹路径。
- --rename-files：如果指定此参数，则会执行文件重命名操作。
-  --replace-content：如果指定此参数，则会执行文件内容替换操作。

例如：`python3 rename_file_and_update_content.py ../quickstart/src  --replace-content --rename-files`

注意：如果存在应用层目标名称（比如类名）与原 UIkit 修改规则中重名的情况，脚本扫描时可能会造成误更改用户应用层重名文件的情况，所以用户在调用脚本前应该做好代码 git 管理及备份，出现部分异常情况需要用户根据实际情况手动更改。

## 版本 V4.8.2

### 新增特性

- 新增聊天中正在输入状态功能。
- 新增好友黑名单功能。
- Callkit 增加私有配置设置。

### 修复

- 修复发送图片/HEIF类型图片缩略图错乱问题。
- 修复单群聊 UIKit 内存泄漏问题。
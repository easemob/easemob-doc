# 自定义 

// TODO：在每个二级或三级标题下添加描述。

## 铃声

CallKit 支持发起呼叫时的声音、接收呼叫时的声音以及被挂断时的声音。铃声文件支持 MP3、WAV 等格式，建议铃声时长为 1-20 秒，文件大小不超过 1 MB。

默认铃声策略（未设置时）如下：
  - 外呼/来电：若未设置铃声或播放失败，回退到系统默认铃声（`RingtoneManager.TYPE_RINGTONE`）。
  - 结束提示音（DING）：如未设置，则不播放提示音（保持静音）。
  - 异常降级：自定义铃声解码/播放异常时，非 DING 铃声会自动降级为系统铃声；DING 不降级。
  - 循环规则：非 DING 铃声循环播放，DING 只播放一次。
  
你可以自定义铃声：

```kotlin
val config = CallKitConfig().apply {
    // 支持三种来源：assets、res/raw、绝对路径
    // 方式 1：使用 assets 文件夹中的文件
    incomingRingFile = "assets://incoming_ring.mp3"
    outgoingRingFile = "assets://outgoing_ring.mp3"
    dingRingFile     = "assets://ding.mp3"

    // 方式 2 ：使用 res/raw 文件夹中的文件
    // incomingRingFile = "raw://incoming_ring"
    
    // 方式 3 ：使用绝对路径
    // incomingRingFile = "/storage/emulated/0/Download/ringtone.mp3"
}
CallKitClient.init(context, config)
```



//todo Android 工程师插入截图

## 布局/样式

开发者可以通过修改布局文件源码(`ease-cal1-kit/src/main/res/layout/`) 的方式或者在应用层添加一个同名的文件来实现自定义布局。注意修改后或者新的布局文件需要包含原有布局文件里的所有资源，否则运行时会报空指针异常。允许开发者添加新的资源控件、调整控件位置、背景等。

| 资源 | 描述 |
|------|------|
| `activity_single_call.xml` | 一对一通话根布局容器，承载不同状态子视图（incoming/outgoing/connected）。 |
| `activity_multi_video_call.xml` | 多人通话根布局容器，含成员网格/工具栏等。 |
| `activity_invite_group_members.xml` | 群成员邀请页面。 |
| `callkit_titlebar_view.xml` | 通话页通用标题栏组件（返回、标题、右侧操作）。 |
| `view_incoming_video_single.xml` / `view_incoming_voice_single.xml` | 来电界面（视频/语音）。 |
| `view_outgoing_video_single.xml` / `view_outgoing_voice_single.xml` | 外呼界面（等待对方接听）。 |
| `view_connected_video_single.xml` / `view_connected_voice_single.xml` | 通话中界面（视频/语音）。 |
| `view_incoming_multiple.xml` / `view_connected_multiple.xml` | 多人通话来电/通话中视图。 |
| `view_call_member.xml` / `view_multi_video_call_member.xml` | 成员头像、昵称、音量/状态指示项。 |
| `callkit_float_window_video.xml` / `callkit_float_window_voice.xml` | 后台悬浮窗视图（视频小窗/语音小窗）。 |
| `callkit_incomimg_call_top_window.xml` | 顶部来电条（可滑动收起/接听/挂断）。 |
| `callkit_fragment_base_list.xml` | 通用列表容器（内含RecyclerView/刷新容器）。 |
| `callkit_layout_default_no_data.xml` / `callkit_layout_no_data_show_nothing.xml` | 无数据/空占位视图。 |
| `callkit_layout_group_member_select_item.xml` | 群成员选择单元项（头像/昵称/选中态）。 |

## 通话超时设置

| 资源                | 描述   | 
| :------------------- | :----- | 
| `callTimeout` | 通话超时时间，单位为秒，默认为 30 秒。  | 

## 图标与图形资源

- 开发者可直接在源码中使用同名文件替换，或者在应用层对应的 `res/drawable*` 添加一个同名文件,即可实现资源文件的替换。
  
### 功能图标

#### 通话控制

| 资源                | 描述   | 
| :------------------- | :----- | 
| `callkit_end.png` | 挂断按钮。  | 
| `callkit_accept_tel.png` / `callkit_accept_video_camera.png` | 接听按钮（语音/视频）。 | 
| `callkit_decline.png`             | 拒绝按钮。   | 
| `callkit_phone_pick.png`             | 电话接听图标。  | 

#### 音视频控制

| 资源                | 描述   | 
| :------------------- | :----- | 
| `callkit_mic_on.png` / `callkit_mic_off.png` | 麦克风开启/关闭。  | 
| `callkit_mic_off_small.png`              | 小尺寸麦克风关闭图标。   | 
| `callkit_speaker_on.png` / `callkit_speaker_off.png` | 扬声器开启/关闭。   | 
| `callkit_speaker_wave.png`              | 扬声器音波图标。   | 
| `callkit_video_camera_on.png` / `callkit_video_camera_off.png`              | 摄像头开启/关闭。   | 
| `callkit_camera_front.png` / `callkit_camera_back.png`              | 前置/后置摄像头切换。   | 

#### 网络质量指示

| 资源                | 描述   | 
| :------------------- | :----- | 
| `callkit_network_good.png` / `callkit_network_poor.png` / `callkit_network_worse.png` / `callkit_network_none.png`    | 网络质量指示器（优秀/一般/差/无网络）。  | 

#### 界面元素

| 资源                | 描述   | 
| :------------------- | :----- | 
| `callkit_default_avatar.png`   | 默认用户头像。   | 
| `callkit_default_group_avatar.png`     | 默认群组头像。   | 
| `callkit_invite.png`              | 邀请成员图标。   | 
| `callkit_float.png`             | 悬浮窗图标。   | 
| `callkit_connecting.png`             | 连接中图标。   | 
| `callkit_array_left.png`              | 左箭头。    | 

#### 复选框状态

| 资源                | 描述   | 
| :------------------- | :----- | 
| `callkit_checkbox_select.png` / `callkit_checkbox_unselect.png` / `callkit_checkbox_available.png`  | 选中/未选中/可选择状态   | 

### 背景资源（drawable-xxxhdpi/）

| 资源                | 描述   | 
| :------------------- | :----- | 
| `callkit_view_background.webp` | 通话界面背景。  | 
| `callkit_empty_layout.png` | 空状态占位图。  | 

## 文案资源（`res/values/callkit_strings.xml`）
- 开发者可直接修改`callkit_strings.xml`内资源的定义源码，或者在应用层的`res/values/strings.xml`文件中添加相同资源ID的文案资源实现文案的替换
### 基础状态

| 资源                | 描述   | 
| :------------------- | :----- | 
| `callkit_loading`  | 加载中...  | 
| `callkit_connecting` | 连接中/等待对方接受邀请...  | 
| `callkit_waiting` / `callkit_calling` | 待接听/呼叫中。  | 
  
### 通话邀请提示
  
| 资源                | 描述   | 
| :------------------- | :----- | 
|`alert_request_video` / `alert_request_voice` / `alert_request_multiple_video`  | 视频/语音/群组视频通话邀请提示（支持用户名参数 %1$s）。 // TODO：前两个是一对一？ | 

### 通话操作

| 资源                | 描述   | 
| :------------------- | :----- | 
| `callkit_accept` / `callkit_decline` | 接听/挂断。  | 
| `callkit_end` | 结束通话。  | 
  
### 功能控制（支持换行显示）

| 资源                | 描述   | 
| :------------------- | :----- | 
| `callkit_flip` | 摄像头翻转。  | 
| `callkit_mike_on` / `callkit_mike_off` | 麦克风已开/已关。  | 
| `callkit_speaker_on` / `callkit_speaker_off`  | 扬声器已开/已关。   | 
| `callkit_camera_on` / `callkit_camera_off` | 摄像头已开/已关。   | 
  
### 通话类型与群组

| 资源                | 描述   | 
| :------------------- | :----- | 
| `callkit_inviting_you_to_a_group_call` / `callkit_inviting_you_to_a_video_call` / `callkit_inviting_you_to_a_voice_call` | 群通话/视频/语音邀请文案。  | 
| `callkit_group_call`  | 群组通话。  | 
| `callkit_add` | 添加成员（支持数量参数 %1$d）。  | 
| `callkit_over_max_members` | 超过最大人数限制提示（支持数量参数 %1$d）。  | 
  
### 通话状态与结果

| 资源                | 描述   | 
| :------------------- | :----- | 
| `callkit_call_duration`  | 通话时长显示（支持时间参数 %1$s）。 | 
| `callkit_self_cancel` / `callkit_remote_cancel`  | 自己取消/对方取消。  | 
| `callkit_self_refused` / `callkit_remote_refused`  | 自己拒绝/对方拒绝。 | 
| `callkit_self_no_response` / `callkit_remote_no_response`  | 自己未接听/对方无响应。  | 
| `callkit_remote_busy`  | 对方忙线中。 | 
| `callkit_remote_drop`  | 通话中断。 | 
  
 ### 多设备处理

| 资源                | 描述   | 
| :------------------- | :----- | 
| `The_other_is_recived` / `callkit_handle_on_other_device` | 其他设备已接听。    | 
| `The_other_is_refused` / `callkit_refused_on_other_device`             | 其他设备已拒绝/结束通话。   | 
| `The_other_is_busy`             | 对方忙线中。   | 
  
### 多语言支持（`res/values-zh/callkit_strings.xml`）

    - 完整的中文本地化支持，所有英文文案均有对应的中文翻译
    - 主要差异：
      - 英文：`Mike\non` → 中文：`麦克风\n已开`
      - 英文：`Speaker\noff` → 中文：`扬声器\n已关`
      - 英文：`Remote Refused` → 中文：`对方拒绝接听`
      - 英文：`Call Duration %1$s` → 中文：`通话时长 %1$s`
  - 支持参数化文案，保持与英文版本相同的 `%1$s`、`%1$d` 占位符格式 
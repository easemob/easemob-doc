# Android 推送集成

本文档为IM SDK中关于推送功能的集成说明。

## 1、Android SDK 集成

环信推送与环信 IM 使用相同的 SDK，你可以参考 IM 文档导入和集成 SDK， 然后注册登录。

SDK 导入：[Android SDK 导入](/document/android/quickstart.html#_2-集成-sdk)

注册登录：[注册登录](/document/android/overview.html#注册用户)

**手机权限**

需在手机设置允许弹出推送消息通知栏。

## 2、在线推送集成

### 通知消息

通知消息的通知栏提示由 SDK 封装，只需调用对应的 REST API 推送，SDK 收到会弹出对应的通知栏提示。 点击通知栏会根据跳转事件执行对应的操作，如需自己实现点击跳转，可在项目里继承 `EMNotificationIntentReceiver`，重写 `onNotificationClick` 获取 `EMNotificationMessage`，实现自己的跳转逻辑。

### 透传消息

SDK 收到透传消息时不做处理，需在项目中继承 `EMNotificationIntentReceiver`，重写 `onNotifyMessageArrived` 获取 `EMNotificationMessage`，判断属性 `needNotification` 是 `false`，获取 `extra` 再做处理（`needNotification` 是 `false`，表示是透传消息）。

`EMNotificationIntentReceiver` 继承 `EMNotificationIntentReceiver` 实现的 `receiver` 参考：

```
public class EasemobReceiver extends EMNotificationIntentReceiver {
@Override
public void onNotifyMessageArrived(Context context, EMNotificationMessage notificationMessage) {
   if(!notificationMessage.isNeedNotification())
   { 
     String params = notificationMessage.getExtras(); // 判断是透传消息，获取附加字段去处理。 
   }
}

@Override
public void onNotificationClick(Context context, EMNotificationMessage notificationMessage)
{ 
// 实现自己的通知点击跳转逻辑。 
}
}
```

项目清单里配置继承 `EMNotificationIntentReceiver` 实现的 `receiver`：

```
<receiver android:name=".EasemobReceiver">
<intent-filter>
<action android:name="com.hyphenate.notification.intent.RECEIVE_MESSAGE"/>
<category android:name="${applicationId}"/>
</intent-filter>
</receiver>
```

## 3、离线推送集成

离线推送需参考环信 IM 的[第三方推送集成](/document/android/push.html)，集成各个厂商的推送（如不需要离线推送，可忽略）。
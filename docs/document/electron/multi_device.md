# 多设备管理监听

当同一账号同时使用桌面端，移动端登录时，需要使用多设备管理监听事件，使用回调实现

```
// 实例化监听，并添加到客户端
var listener = new easemob.EMMultiDevicesListener();
emclient.addMultiDevicesListener(listener);

// 设置回调
// 收到其他设备的会话操作
listener.onContactMultiDevicesEvent((operation, target, ext) => {
  console.log('operation = ' + operation);
  console.log('target = ' + target);
  console.log('ext = ' + ext);
});
// 收到其他设备的组操作
listener.onGroupMultiDevicesEvent((operation, target, usernames) => {
  console.log('operation = ' + operation);
  console.log('target = ' + target);
  console.log('usernames = ' + usernames);
});
```


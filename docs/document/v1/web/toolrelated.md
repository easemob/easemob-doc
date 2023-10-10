# 工具类说明

## 文件上传下载判断

```
//是否能上传file
WebIM.utils.isCanUploadFile;
//是否能下载file
WebIM.utils.isCanDownLoadFile ;
//是否设置header
WebIM.utils. isCanSetRequestHeader;
//是否设置mimetype
WebIM.utils.hasOverrideMimeType;
```

## 表情解析工具类

```
WebIM.utils.parseEmoji(message);
```

## 格式化字符串类

目前只能解析字符串`%s`

```
WebIM.utils.sprintf(string[, args...])
```

## 文件上传下载工具类

```
var fileInfo = WebIM.utils.getFileUrl(fileInputId);


//上传
var options = {
  apiUrl:'//a1.easemob.com',
  appName: 'chatdemoui',
  orgName: 'easemob-demo',
  appKey:'easemob-demo#chatdemoui',
  file:fileInfo,
  accessToken: 'YWMtjPPoovCqEeOQs7myPqqaOwAAAUaqNH0a8rRj4PwJLQju6-S47ZO6wYs3Lwo',
  onFileUploadComplete: function ( data ) { //upload file success },
  onFileUploadError: function ( e ) { //upload file error }
};

WebIM.utils.uploadFile(options);



//下载
var options = {
  responseType: 'blob',//default blob
  mimeType: 'text/plain; charset=x-user-defined',//default
  url:'http://s1.easemob.com/weiquan2/a2/chatfiles/0c0f5f3a-e66b-11e3-8863-f1c202c2b3ae',
  secret: 'NSgGYPCxEeOou00jZasg9e-GqKUZGdph96EFxJ4WxW-qkxV4',
  accessToken: 'YWMtjPPoovCqEeOQs7myPqqaOwAAAUaqNH0a8rRj4PwJLQju6-S47ZO6wYs3Lwo',
  onFileDownloadComplete: function ( data ) { //download file success },
  onFileDownloadError: function ( e ) { //download file error }
};

WebIM.utils.download(options);
```

## 发送Ajax请求

```
var options = {
  dataType: 'text',//default
  success: function () { //handle request success },
  error: function () { //handle request error },
  type: 'post',//default 'post'
  url: 'http://s1.easemob.com/weiquan2/a2/chatfiles/0c0f5f3a-e66b-11e3-8863-f1c202c2b3ae',
  headers: '',//default {}
  data: '';//default null
};

WebIM.utils.ajax(options);
```
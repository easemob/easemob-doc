# Web集成互动白板

## 下载

```
npm install easemob-whiteboards
```

## 引入sdk

```
import whiteboards from 'easemob-whiteboards'
```

## 初始化

```
var WDSdk = new whiteboards({
  appKey: "yourAppKey"
});
```

## APIs

有两种方式创建白板：

### 1. 通过房间名加入，没有房间创建房间，有房间加入房间

```
/**
 * @param {string} roomName 房间名
 * @param {string} password 房间密码
 * @param {string} userName im用户名
 * @param {number} level 权限等级 ，1-3禁止互动,4-8允许互动。默认允许互动
 * @param {number} layout 工具栏位置 ，默认0；0-底部，1-右侧，2-顶部
 * @param {string} ratio 白板画布宽高比。建议"4:3"、"2:1"
 * @param {string} token im登录token
 * @param {function} suc 成功的回调
 * @param {function} error 失败的回调
 */
WDSdk.join({
  roomName: 'roomName',
  password: 'password',
  userName: 'userName',
  level: 4,
  layout:0,
  ratio:"2:1",
  token: 'token',
  suc: (res) => {
    res.whiteBoardUrl; 为白板房间地址
  },
  error: () => {},
})
```

### 2. 通过单独api去创建、加入

a. 创建白板 (WDSdk.create)

```
/**
 * @param {string} roomName 房间名
 * @param {string} password 房间密码
 * @param {string} userName im用户名
 * @param {number} level 权限等级 ，1-3禁止互动,4-8允许互动。默认允许互动
 * @param {number} layout 工具栏位置 ，默认0；0-底部，1-右侧，2-顶部
 * @param {string} ratio 白板画布宽高比。建议"4:3"、"2:1"
 * @param {string} token im登录token
 * @param {function} suc 成功的回调
 * @param {function} error 失败的回调
 */
WDSdk.create({
  userName: 'userName',
  roomName: 'roomName',
  level: 4,
  layout:0,
  ratio:"2:1",
  password: 'password',
  token: 'token',
  suc: (res) => {
    window.location = res.whiteBoardUrl;
  },
  error: () => {}
});
```

b. 加入白板，可支持两种方式加入白板：
- joinByRoomId ：通过已经创建的房间ID加入； 
- joinByRoomName ：通过已经创建的房间名称加入；

```
/**
 * 1 通过房间ID加入
 * @param {string} roomId 房间Id
 * @param {string} password 房间密码
 * @param {string} userName im用户名
 * @param {string} token im登录token
 * @param {function} suc 成功的回调
 * @param {function} error 失败的回调
 */
WDSdk.joinByRoomId({
  userName: userName,
  roomId: roomId,
  token: "token", 
  suc: function(res){
    window.location = res.whiteBoardUrl;
  },
  error: function(err){
    console.log("err", err);
  }
});
  
/**
 * 2 通过房间名加入
 * @param {string} roomName 房间名
 * @param {string} password 房间密码
 * @param {string} userName im用户名
 * @param {string} token im登录token
 * @param {function} suc 成功的回调
 * @param {function} error 失败的回调
 */
WDSdk.joinByRoomName({
  userName: userName,
  roomName: roomName,
  token: "token",
  suc: function(res){
    window.location = res.whiteBoardUrl;  //同joinByRoomId返回
  },
  error: function(err){
    console.log("err", err);
  }
});
```

### 3. 白板互动权限

```
/**
 * @param {string} userName im用户名
 * @param {string} roomId 房间id
 * @param {number} leval 4-8允许互动/1-3禁止互动
 * @param {arr} members 操作的权限用户名数组，当isAll为true，此参数不生效，所以设置此参数时需设置isAll=false
 * @param {bloon} isAll ture时操作对象为房间所有成员，默认为true
 * @param {string} token im登录token
 * @param {function} suc 成功的回调
 * @param {function} error 失败的回调
 */
WDSdk.oprateAuthority({
   userName: "username",
   roomId: "roomId",
   leval: 4, 
   members:[],
   isAll: true,
   token: "token",
   suc: function(res){},
   err: function(err){}
})
```

### 4. 销毁白板

```
/**
 * @param {string} roomId 房间id
 * @param {string} token im登录token
 * @param {function} suc 成功的回调
 * @param {function} error 失败的回调
 */
WDSdk.destroy({
  roomId: roomId,
  token: "token",
  suc: function(res){
    console.log(res);
  },
  error: function(err){
    console.log("err", err);
  }
});
```
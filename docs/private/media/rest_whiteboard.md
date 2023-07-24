# 互动白板REST简介

| 名称             | 请求                                                       | method |
| ---------------- | ---------------------------------------------------------- | ------ |
| 创建或者加入白板 | /{orgName}/{appName}/whiteboards/joinorcreate/byname       | POST   |
| 上传文件         | /{orgName}/{appName}/whiteboards/upload/{whiteboardUserId} | POST   |

## 创建或者加入白板

HTTP Request

| ![img](@static/images/privitization/post.png) | /{orgName}/{appName}/whiteboards/joinorcreate/byname |
| ---- | ---------------------------------------------------- |

| 参数          | 说明             |
| :------------ | :--------------- |
| Content-Type  | application/json |
| Authorization | Bearer ${token}  |

#### Request Body

| 名称           | 类型   | 描述                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| userId         | String | im用户的userId                                               |
| whiteBoardName | String | 将要创建或者加入的白板名称                                   |
| password       | String | 白板密码                                                     |
| level          | int    | 共1-8级，创建白板时可以指定白板成员的默认等级，4级及以上可以操作白板，以下不能操作 |
| layout         | int    | 页面布局，共三种分别取0/1/2                                  |
| ratio          | String | 页面比例比如2:1,比例范围为1:5至5:1                           |

#### Response Body

| 名称          | 类型    | 描述                                  |
| :------------ | :------ | :------------------------------------ |
| whiteBoardUrl | string  | 将要打开的白板地址                    |
| domainName    | String  | 白板的域名                            |
| socketIOUrl   | String  | SocketIO链接地址                      |
| socketIOPath  | String  | SocketIO链接路径                      |
| roomId        | String  | 白板系统的userId,注意这不是IM的userId |
| token         | String  | 白板的token                           |
| status        | boolean | 请求状态                              |

#### 请求示例

```
curl --location --request POST 'http://127.0.0.1:8031/easemob-demo/chatdemoui/whiteboards/joinorcreate/byname' \
--header 'Authorization: Bearer YWMtmSQukKrsEeqv9QV7AzcHWwAAAAAAAAAAAAAAAAAAAAFDtjwasNNKD6W3CET2O3RNAQMAAAFynSVq-wBPGgBKfz02AUoGLesKFexM4_1uAAW25lj33z0siltXBgRoWQ' \
--header 'Content-Type: application/json' \
--data-raw '{
    "userId": "zd2",
    "whiteBoardName": "128",
    "password": "1",
    "level":5
}'
```

根据请求返回的status字段判断请求是否成功

```
{
    "whiteBoardUrl": "http://whiteboards-hsb.easemob.com/index.html?roomId=ZBXZH0001TGJ5AAYK400&userId=ZBXZH0001TGJ5AAYK400-0&socketIOUrl=http://127.0.0.1:8900/message&socketIOPath=/socket.io/&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ3aGl0ZWJvYXJkIiwiaXNzIjoiZWFzZW1vYiIsInVzZXJOYW1lIjoiemQyIiwiZXhwIjoxNTk3NDg1NTExLCJ1c2VySWQiOiJaQlhaSDAwMDFUR0o1QUFZSzQwMC0wIn0.izUKAFrQBKRnDEg1d_yt-Xe9DGwZobb7Oa9-03yLO0Q&domainName=http://127.0.0.1:8031&appKey=easemob-demo#chatdemoui&isCreater=true",
    "domainName": "http://127.0.0.1:8031",
    "socketIOUrl": "http://127.0.0.1:8900/message",
    "socketIOPath": "/socket.io/",
    "userId": "ZBXZH0001TGJ5AAYK400-0",
    "roomId": "ZBXZH0001TGJ5AAYK400",
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ3aGl0ZWJvYXJkIiwiaXNzIjoiZWFzZW1vYiIsInVzZXJOYW1lIjoiemQyIiwiZXhwIjoxNTk3NDg1NTExLCJ1c2VySWQiOiJaQlhaSDAwMDFUR0o1QUFZSzQwMC0wIn0.izUKAFrQBKRnDEg1d_yt-Xe9DGwZobb7Oa9-03yLO0Q",
    "status": true
}
```

## 白板上传文件

HTTP Request 注意这里的whiteboardUserId不是IM的useId,是上一个创建或者加入白板里返回的userId

| ![img](@static/images/privitization/POST.png) | /{orgName}/{appName}/whiteboards/upload/{whiteboardUserId} |
| ---- | ---------------------------------------------------------- |

#### 请求示例

```
curl --location --request POST 'http://127.0.0.1:8031/easemob-demo/chatdemoui/whiteboards/upload/ZBW51UX8XTGFYJX8LL0-0' \
--header 'Content-Type: multipart/form-data' \
--form 'file=@/D:/easemob/文档/中文名字1.jpg'
```

#### 返回值

- 返回200表示成功
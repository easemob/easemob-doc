# 即时推送 RESTful API 调用频率限制

本文介绍即时推送 RESTful API 的调用频率限制，包括推送标签管理和发送推送通知相关的 API 的调用频率限制。

<Toc />

## 推送标签管理

| RESTful API 接口 |方法  | 接口 URL| 接口最高调用频率（默认值） |
| :----------- | :----- | :------------------- | :------------- |
| [创建推送标签](push_by_tag.html#创建推送标签)  | POST   | /{org_name}/{app_name}/push/label   | 10 次/秒/App Key   |
| [查询指定的推送标签](push_by_tag.html#查询指定的推送标签)  | GET | /{org_name}/{app_name}/push/label/{labelname}   | 10 次/秒/App Key         |
| [分页查询推送标签](push_by_tag.html#分页查询推送标签)   | GET   | /{org_name}/{app_name}/push/label  | 10 次/秒/App Key   |
| [删除指定的推送标签](push_by_tag.html#删除指定的推送标签)   | DELETE   | /{org_name}/{app_name}/push/label/{labelname}    | 10 次/秒/App Key    |
| [在推送标签下添加用户](push_by_tag.html#在推送标签下添加用户)   | POST   | /{org_name}/{app_name}/push/label/{labelname}/user    | 30 次/秒/App Key    |
| [查询指定标签下的指定用户](push_by_tag.html#查询指定标签下的指定用户)   | GET   | /{org_name}/{app_name}/push/label/{labelname}/user/{username}    | 30 次/秒/App Key    |
| [分页查询指定标签下的用户](push_by_tag.html#分页查询指定标签下的用户)  | GET   | /{org_name}/{app_name}/push/label/{labelname}/user    | 30 次/秒/App Key    |
| [批量移出指定推送标签下的用户](push_by_tag.html#批量移出指定推送标签下的用户)   | DELETE   | /{org_name}/{app_name}/push/label/{labelname}/user    | 30 次/秒/App Key    |

## 发送推送通知

| RESTful API 接口 |方法  | 接口 URL| 接口最高调用频率（默认值） |
| :----------- | :----- | :------------------- | :------------- |
| [以同步方式发送推送通知](push_send_notification.html#以同步方式发送推送通知) | POST  | /{org_name}/{app_name}/push/sync/{target} | 1 次/秒/App Key  |
| [以异步方式批量发送推送通知](push_send_notification.html#以异步方式批量发送推送通知) | POST | /{org_name}/{app_name}/push/single | 10 次/秒/App Key |
| [使用标签推送接口发送推送通知](push_send_notification.html#使用标签推送接口发送推送通知) | POST | /{org_name}/{app_name}/push/list/label | 10 次/秒/App Key |
| [创建全量推送任务](push_send_notification.html#创建全量推送任务) | POST | /{org_name}/{app_name}/push/task | 1 次/秒/App Key |
| [创建推送通知](push_send_notification.html#创建推送通知) | POST | /{org_name}/{app_name}/push/message  | 1 次/秒/App Key |
| [查询推送通知](push_send_notification.html#查询推送通知) | POST| /{org_name}/{app_name}/push/message/{messageId} | 1 次/秒/App Key|
| [创建全量推送任务](push_send_notification.html#创建全量推送任务-1)| POST | /{org_name}/{app_name}/push/task/broadcast |1 次/秒/App Key |
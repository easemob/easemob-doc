---
permalink: /document/Android/moderation_report.html
---

# 消息审核

[[toc]]

## 功能描述

新增消息举报接口，SDK 可以调用该接口举报对应消息。当服务器端审核服务收到举报消息后，会将举报消息存储到数据库，并提供接口供 Console 后台搜索展示。审核员可以对举报记录进行相应处理。

## 技术原理

环信即时通讯 IM Android SDK 提供 `reportMessage` 方法实现举报违规消息功能。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](https://docs-im.easemob.com/ccim/android/quickstart)。
- 开通消息审核服务，详见管理后台。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](https://docs-im.easemob.com/ccim/limitation)。

## 实现方法

举报违规消息的示例代码如下：

```java
EMClient.getInstance().chatManager().asyncReportMessage(msgid, label, reason, new EMCallBack() {
        @Override
        public void onSuccess() {
            
        }
        @Override
        public void onError(int code, String error) {
                    
        }
        @Override
        public void onProgress(int progress, String status) {

        }
    });
```
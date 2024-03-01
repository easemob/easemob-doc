# 会话标记

<Toc />

某些情况下，你可能需要对会话添加标记，例如会话标星或将会话标为已读或未读。即时通讯云 IM 支持对单聊和群聊会话添加标记，最大支持 20 个标记，所以一个会话最多可添加 20 个标记。

**如果要使用会话标记功能，你需要确保开通了[会话列表服务](conversation_list.html#从服务器分页获取会话列表)并将 SDK 版本升级至 4.3.0 或以上版本。**

你需要自行维护会话标记与具体业务含义（比如 `MARK_0` 为重要会话）之间的映射关系。例如：

```java
Map<EMConversation.EMMarkType,String> mapping=new HashMap<>();
mapping.put(EMConversation.EMMarkType.MARK_0,"important");
mapping.put(EMConversation.EMMarkType.MARK_1,"normal");
mapping.put(EMConversation.EMMarkType.MARK_2,"unimportant");
mapping.put(EMConversation.EMMarkType.MARK_3,"boys");
mapping.put(EMConversation.EMMarkType.MARK_4,"girls");
……
```

## 技术原理

环信即时通讯 IM 支持会话标记功能，主要方法如下：

- `EMChatManager#asyncAddConversationMark`：标记会话。
- `EMChatManager#asyncRemoveConversationMark`：取消标记会话。
- `EMChatManager#asyncGetConversationsFromServerWithCursor`：根据会话标记从服务器分页查询会话列表。
- 根据会话标记从本地查询会话列表：调用 `getAllConversations` 方法获取本地所有会话后自己进行会话过滤。
- `EMConversation#marks`：获取本地单个会话的所有标记。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。
- **[开通服务端会话列表功能](conversation_list#从服务器分页获取会话列表)**。

## 实现方法

### 标记会话

你可以调用 `asyncAddConversationMark` 方法标记会话。每次最多可为 20 个会话添加标记。调用该方法会同时为本地和服务器端的会话添加标记。

添加会话标记后，若调用 `asyncFetchConversationsFromServer` 接口从服务器分页获取会话列表，返回的会话对象中包含会话标记，你需要通过 `EMConversation#marks` 方法获取。若你已经达到了服务端会话列表长度限制（默认 100 个会话），服务端会根据会话的活跃度删除不活跃会话，这些会话的会话标记也随之删除。

:::tip
对会话添加标记，例如会话标星，并不影响会话的其他逻辑，例如会话的未读消息数。
:::

```java
String conversationId = "huanhuan";
List<String> ids=new ArrayList<>();
ids.add(conversationId);
EMClient.getInstance().chatManager().asyncAddConversationMark(ids, EMConversation.EMMarkType.MARK_0, new EMCallBack() {
    @Override
    public void onSuccess() {

    }

    @Override
    public void onError(int code, String error) {

    }
});
```

### 取消标记会话

你可以调用 `asyncRemoveConversationMark` 方法删除会话标记。每次最多可移除 20 个会话的标记。

调用该方法会同时移除本地和服务器端会话的标记。

```java
String conversationId = "huanhuan";
List<String> ids=new ArrayList<>();
ids.add(conversationId);
EMClient.getInstance().chatManager().asyncRemoveConversationMark(ids, EMConversation.EMMarkType.MARK_0,new EMCallBack() {
    @Override
    public void onSuccess() {

    }

    @Override
    public void onError(int code, String error) {

    }
});
```

### 根据会话标记从服务器分页查询会话列表

你可以调用 `asyncGetConversationsFromServerWithCursor` 方法根据会话标记从服务器分页获取会话列表。SDK 会按会话标记的时间的倒序返回会话列表，每个会话对象中包含会话 ID、会话类型、是否为置顶状态、置顶时间（对于未置顶的会话，值为 0）、会话标记以及最新一条消息。从服务端拉取会话列表后会更新本地会话列表。

```java
// 最终的查询结果全部放入 result 中。
List<EMConversation> result=new ArrayList<>();
// cursor：查询的开始位置。若传入空字符串，SDK 从最新标记操作的会话开始获取。
String cursor="";
// filter：会话查询选项，包括会话标记和每页获取的会话条数（最多可获取 10 条）。下面的代码以查询服务端所有标记了 `EMConversation.EMMarkType.MARK_0` 的会话为例。
EMConversationFilter filter=new EMConversationFilter(EMConversation.EMMarkType.MARK_0,10);
doAsyncGetConversationsFromServerWithCursor(result,cursor,filter);

private void doAsyncGetConversationsFromServerWithCursor(List<EMConversation> result, @NonNull String cursor, @NonNull EMConversationFilter filter) {
        EMClient.getInstance().chatManager().asyncGetConversationsFromServerWithCursor(cursor, filter, new EMValueCallBack<EMCursorResult<EMConversation>>() {
            @Override
            public void onSuccess(EMCursorResult<EMConversation> value) {
                List<EMConversation> datas=value.getData();
                if(!CollectionUtils.isEmpty(datas)){
                    result.addAll(datas);
                }
                String cursor_ = value.getCursor();
                if(!TextUtils.isEmpty(cursor_)){
                    doAsyncGetConversationsFromServerWithCursor(result,cursor_,filter);
                }
            }

            @Override
            public void onError(int error, String errorMsg) {

            }
        });
    }
```

### 根据会话标记从本地查询会话列表

对于本地会话，你可以调用 `getAllConversations` 方法获取本地所有会话后自己进行会话过滤。下面以查询标记了 `EMConversation.EMMarkType.MARK_0` 的所有本地会话为例。

```java
//最终的查询结果全部放入 result 中。
List<EMConversation> result=new ArrayList<>();
Map<String, EMConversation> localConversations = EMClient.getInstance().chatManager().getAllConversations();
if(localConversations!=null&&!localConversations.isEmpty()){
    for(EMConversation conversation:localConversations.values()){
        Set<EMConversation.EMMarkType> marks = conversation.marks();
        if(marks!=null&&!marks.isEmpty()){
            for(EMConversation.EMMarkType mark:marks){
                if(mark==EMConversation.EMMarkType.MARK_0){
                    result.add(conversation);
                }
            }
        }
    }
}
```

### 获取本地单个会话的所有标记

你可以调用 `EMConversation#marks` 方法获取本地单个会话的所有标记，示例代码如下：

```java
EMConversation conversation = EMClient.getInstance().chatManager().getConversation("conversationId");
Set<EMMarkType> marks = conversation.marks();
```









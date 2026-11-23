# 音视频通话

<Toc />

单群聊 UIKit 内部集成了声网音视频 SDK，可以实现在单聊或群组会话中使用音视频通话。

## 使用示例

使用时需要配置如下参数，可参考 [Callkit 集成文档](https://www.npmjs.com/package/chat-callkit)。

```javascript
import { Chat } from "easemob-chat-uikit";

const ChatApp = () => {
  return (
    <Chat
      rtcConfig={{
        onInvite: handleInviteToCall,
        agoraUid: agoraUid,
        onAddPerson: handleAddPerson,
        getIdMap: handleGetIdMap,
        onStateChange: handleRtcStateChange,
        appId: appId,
        getRTCToken: getRtcToken,
      }}
    />
  );
};
```

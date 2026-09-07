# 自定义 RTC 凭证接入

## 概述

CallKit 默认通过传入的 IM SDK 客户端获取 RTC 进房信息和 RTC UID 映射：

- `chatClient.getRTCTokenInfo({ channelName })`：获取声网 App ID、RTC Token 和本端 RTC UID；
- `chatClient.getUserIdsWithRTCUids(rtcUids)`：将远端 RTC UID 映射为 IM `userId`，用于显示用户昵称和头像等业务信息。

如果应用使用自有的声网项目，或希望由业务服务端签发 RTC Token、维护 RTC UID 与 IM 用户 ID 的关系，可以为 `CallKit` 传入 `rtcProvider`。`rtcProvider` 的类型为公开导出的 `CallKitRTCProvider`。源码详见 [CallKitRTCProvider Interface](https://github.com/easemob/easemob-uikit-react/blob/4525a34007e19d181b72eaecd809025135e7c484/module/callkit/types/index.ts#L190)。

```tsx
import type { CallKitRTCProvider, RTCTokenInfo, RTCUidUserIdMap } from 'easemob-chat-uikit';
```

CallKit 以传入的 `chatClient` 为基础工作。未配置 `rtcProvider` 时，UIKit 会通过该 IM SDK 客户端自动获取 RTC 数据；需要使用自有声网项目或业务服务端 Token 时，再按需覆写相应方法。

| 配置项 | 默认 UIKit / IM SDK 模式 | 自定义 `CallKitRTCProvider` 模式 |
| --- | --- | --- |
| 适用场景 | 使用 IM SDK 提供的 RTC 凭证与 UID 映射。 | 使用自有声网项目，或由业务服务端签发 RTC Token、维护 UID 映射。 |
| 组件配置 | `<CallKit chatClient={client} />` | `<CallKit chatClient={client} rtcProvider={rtcProvider} />` |
| 入会凭证 | UIKit 调用 `chatClient.getRTCTokenInfo({ channelName })`。 | `rtcProvider.getRTCTokenInfo({ channelName })` 返回 `{ appId, rtcToken, rtcUid }`。 |
| UID 与 IM 用户 ID 映射 | UIKit 调用 `chatClient.getUserIdsWithRTCUids(rtcUids)`。 | `rtcProvider.getUserIdsWithRTCUids(rtcUids)` 返回 `{ [rtcUid]: userId }`。 |
| 需要自行维护的数据 | 无。 | 声网 App ID、RTC Token、RTC UID，以及 RTC UID 与 IM `userId` 的映射。 |

`CallKitRTCProvider` 的两个方法可独立配置。例如，只提供 `getRTCTokenInfo` 时，Token 由业务服务端获取，而 UID 映射仍由 IM SDK 获取；未提供的方法始终按默认模式回退到 `chatClient`。

## API

`CallKitRTCProvider` 用于接管 CallKit 从 IM SDK 获取的两类 RTC 数据：加入频道凭证和 RTC UID 映射。CallKit 会在发起通话、接听通话以及远端用户加入频道等实际时机按需调用这些方法。业务侧可以只实现需要自定义的部分，未实现的方法会继续使用 `chatClient` 的对应接口。下面是该 provider 及其返回值的公开类型定义：

```ts
interface RTCTokenInfo {
  appId: string;
  rtcToken: string;
  rtcUid: number;
}

type RTCUidUserIdMap = Record<string, string>;

interface CallKitRTCProvider {
  getRTCTokenInfo?: (params: { channelName: string }) => Promise<RTCTokenInfo>;
  getUserIdsWithRTCUids?: (rtcUids: number[]) => Promise<RTCUidUserIdMap>;
}
```

两个方法均为可选，可以只替换其中一个数据来源：

| 方法 | 用途 | 未提供时的行为 |
| --- | --- | --- |
| `getRTCTokenInfo` | 为当前通话频道返回 RTC 入会凭证。 | 调用 `chatClient.getRTCTokenInfo({ channelName })`。 |
| `getUserIdsWithRTCUids` | 将远端 RTC UID 批量映射为 IM `userId`。 | 调用 `chatClient.getUserIdsWithRTCUids(rtcUids)`。 |

当某个 provider 方法已提供时，CallKit 会优先使用它，而不会再调用该方法对应的 IM SDK 接口。`getRTCTokenInfo` 抛出异常、返回空值或返回不合法数据时，通话无法发起或加入频道；`getUserIdsWithRTCUids` 失败时，远端 UID 无法通过 IM SDK 再次查询（仅一对一通话会尝试使用邀请中的对端用户 ID 兜底）。因此请在服务端响应和前端转换处完成必要的校验与错误处理。

**getRTCTokenInfo**

- **说明：** 异步返回当前参与者加入指定 `channelName` 所需的声网 `appId`、`rtcToken` 和 `rtcUid`。业务服务端应根据当前 IM 用户和频道签发这些数据。
- **调用时机：**
  - 主叫发起通话、发送邀请前调用。
  - 被叫接受邀请、加入频道前调用；RTC 进房数据无效时会重新获取。
- **回退逻辑（返回 `null` 时）：** `rtcProvider` 未提供 `getRTCTokenInfo` 方法时，CallKit 才会调用 `chatClient.getRTCTokenInfo({ channelName })`。如果已提供该方法，但运行时返回 `null`、`undefined`、不合法对象或抛出异常，CallKit 会将 加入 RTC 频道所需的数据 视为不可用，不会再回退到 IM SDK；主叫无法发起通话，被叫无法加入频道，并触发通话错误处理。虽然 TypeScript 返回类型是 `Promise<RTCTokenInfo>`，业务实现仍应避免返回空值。
- **返回值约束：**
  - 必须返回 `RTCTokenInfo` 对象。`appId` 必须是非空字符串，并且必须与签发 `rtcToken` 的声网项目一致。
  - `rtcUid` 必须是有限数字，并且必须与 `rtcToken` 中的 UID 一致；同一 IM 用户建议保持稳定的 UID 映射。`channelName` 和 Token 中的频道也必须一致。
  - `useRTCToken`（默认 `true`）开启时，`rtcToken` 必须是非空字符串；设置 `useRTCToken={false}` 时可以返回空字符串，CallKit 会以 `null` Token 加入频道。仅在声网项目允许不校验 Token 时使用此配置。
  - 返回值不包含 `expiration` 字段，CallKit 也不会依据该字段自动续期。请保证服务端 Token 在预期通话时长内有效；如需续期，应结合 RTC SDK 的过期回调和业务侧 Token 接口自行实现。

**getUserIdsWithRTCUids**

- **说明：** 异步批量返回 RTC UID 与 IM `userId` 的映射，用于获取远端用户的昵称、头像等资料。返回值的键是 RTC UID 的字符串形式，值是对应的 IM `userId`：

```ts
{
  '10001': 'alice',
  '10002': 'bob',
}
```

- **调用时机：** 远端用户进入频道后，CallKit 在需要将远端 UID 转换为 IM 用户资料时按需调用。CallService 会先查询本地缓存，未命中且 UID 有效时才请求 provider。
- **回退逻辑（返回 `null` 时）：** `rtcProvider` 未提供 `getUserIdsWithRTCUids` 方法时，CallKit 才会调用 `chatClient.getUserIdsWithRTCUids(rtcUids)`。如果已提供该方法，但运行时返回 `null`、`undefined`、非对象、缺少请求 UID 的映射或抛出异常，CallKit 不会再调用 IM SDK 查询；一对一通话会尽力使用邀请中的对端 IM `userId` 兜底，多人通话没有该兜底，对应远端用户可能只能显示 RTC UID 或无法关联用户资料。
- **返回值约束：** 必须返回 `RTCUidUserIdMap` 对象。每个请求的 RTC UID 都应使用其规范的字符串形式作为键（例如 `10001` 对应 `'10001'`），值必须是非空的 IM `userId`。多人通话应返回所有请求 UID 的映射；不要返回无法确认归属的用户 ID，也不要把 UID 映射到 Token 中的其他用户。

## 接入流程

### 步骤 1：在服务端提供 RTC 数据接口

不要在浏览器中生成声网 Token，也不要将声网 App Certificate 暴露给前端。建议让前端只请求业务服务端：

```text
POST /api/rtc/token
{ "userId": "alice", "channelName": "call_channel" }

=> { "appId": "your-agora-app-id", "rtcToken": "...", "rtcUid": 10001 }

POST /api/rtc/user-ids
{ "rtcUids": [10001, 10002] }

=> { "10001": "alice", "10002": "bob" }
```

服务端需要验证当前请求者的身份和通话权限，并确保 Token 中的频道、UID 与返回的 `channelName`、`rtcUid` 一致；UID 映射只返回调用方有权获知的用户数据。

### 步骤 2：创建 CallKitRTCProvider

下面示例假定应用已拥有可信的业务登录态，`currentUserId` 是当前已登录的 IM 用户 ID。接口字段名可按服务端实际响应调整，但最终必须转换为 `RTCTokenInfo` 和 `RTCUidUserIdMap`。

```tsx
import React from 'react';
import type { CallKitRTCProvider, RTCTokenInfo, RTCUidUserIdMap } from 'easemob-chat-uikit';

function useCallKitRTCProvider(
  currentUserId: string,
  useRTCToken = true,
): CallKitRTCProvider {
  return React.useMemo(
    () => ({
      async getRTCTokenInfo({ channelName }): Promise<RTCTokenInfo> {
        const response = await fetch('/api/rtc/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ userId: currentUserId, channelName }),
        });

        if (!response.ok) {
          throw new Error(`获取 RTC Token 失败：${response.status}`);
        }

        const data = (await response.json()) as RTCTokenInfo;
        if (
          !data.appId ||
          !Number.isFinite(data.rtcUid) ||
          (useRTCToken && !data.rtcToken)
        ) {
          throw new Error('RTC Token 接口返回的数据不完整');
        }

        return {
          appId: data.appId,
          rtcToken: data.rtcToken || '',
          rtcUid: data.rtcUid,
        };
      },

      async getUserIdsWithRTCUids(rtcUids): Promise<RTCUidUserIdMap> {
        const response = await fetch('/api/rtc/user-ids', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ rtcUids }),
        });

        if (!response.ok) {
          throw new Error(`查询 RTC UID 映射失败：${response.status}`);
        }

        return (await response.json()) as RTCUidUserIdMap;
      },
    }),
    [currentUserId, useRTCToken],
  );
}
```

如果你的 IM 服务仍负责 UID 映射，只需提供 `getRTCTokenInfo`；省略 `getUserIdsWithRTCUids` 后，CallKit 会继续使用 IM SDK 的映射接口。

### 步骤 3：将 provider 传给 CallKit

CallKit 必须使用 `Provider` 创建的 IM 客户端。下面通过公开导出的 `RootContext` 获取该客户端，避免依赖仓库内部模块路径。

```tsx
import React from 'react';
import { CallKit, Provider, RootContext } from 'easemob-chat-uikit';
import type { CallKitRef } from 'easemob-chat-uikit';
import 'easemob-chat-uikit/style.css';

function CallKitLayer({ currentUserId }: { currentUserId: string }) {
  const { client } = React.useContext(RootContext);
  const callKitRef = React.useRef<CallKitRef>(null);
  const rtcProvider = useCallKitRTCProvider(currentUserId);

  return (
    <CallKit
      ref={callKitRef}
      chatClient={client}
      rtcProvider={rtcProvider}
      onCallError={error => {
        console.error('CallKit 通话失败', error);
      }}
    />
  );
}

export default function App() {
  const currentUserId = 'alice';

  return (
    <Provider
      initConfig={{
        appKey: 'your-org#your-app',
        userId: currentUserId,
        token: 'your-im-token',
      }}
    >
      <CallKitLayer currentUserId={currentUserId} />
    </Provider>
  );
}
```

`Provider` 会使用 `initConfig.userId` 和 `initConfig.token` 登录 IM；这份 IM Token 与 RTC Token 是两套独立凭证。CallKit 在需要加入 RTC 频道时才会调用 `rtcProvider`，无需在登录成功后手动预取或初始化 RTC 服务。

### 步骤 4：发起通话

自定义 RTC provider 不改变 CallKit 的通话 API。通过组件 ref 发起一对一通话即可：

```tsx
await callKitRef.current?.startSingleCall({
  to: 'bob',
  callType: 'video',
  msg: '邀请你进行视频通话',
});
```

发起方会使用新建的频道名调用 `getRTCTokenInfo`；被叫方接受邀请并加入同一频道前也会调用该方法。因此，服务端必须能够针对任意有效频道为每位参与者返回相匹配的 App ID、Token 和 UID。

## 完整示例代码

下面的 `App.tsx` 将服务端 RTC 接口、`CallKitRTCProvider`、UIKit `Provider` 和一对一通话按钮组合在一起。将接口地址、App Key、IM Token 和用户 ID 替换为实际值即可使用；IM Token 与 RTC Token 仍由各自的服务端流程签发。

```tsx
import React from 'react';
import {
  CallKit,
  Provider,
  RootContext,
} from 'easemob-chat-uikit';
import type {
  CallKitRef,
  CallKitRTCProvider,
  RTCTokenInfo,
  RTCUidUserIdMap,
} from 'easemob-chat-uikit';
import 'easemob-chat-uikit/style.css';

const appKey = 'your-org#your-app';
const currentUserId = 'alice';
const imToken = 'your-im-token';

type TokenResponse = {
  appId?: unknown;
  rtcToken?: unknown;
  rtcUid?: unknown;
};

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`${url} 请求失败：${response.status}`);
  }
  return (await response.json()) as T;
}

function useCallKitRTCProvider(
  userId: string,
  useRTCToken = true,
): CallKitRTCProvider {
  return React.useMemo(
    () => ({
      async getRTCTokenInfo({ channelName }): Promise<RTCTokenInfo> {
        const data = await postJson<TokenResponse>('/api/rtc/token', {
          userId,
          channelName,
        });

        if (
          typeof data.appId !== 'string' ||
          data.appId.trim() === '' ||
          typeof data.rtcUid !== 'number' ||
          !Number.isFinite(data.rtcUid) ||
          (useRTCToken &&
            (typeof data.rtcToken !== 'string' || data.rtcToken.trim() === ''))
        ) {
          throw new Error('RTC Token 接口返回的数据不完整或格式错误');
        }

        return {
          appId: data.appId,
          rtcToken: typeof data.rtcToken === 'string' ? data.rtcToken : '',
          rtcUid: data.rtcUid,
        };
      },

      async getUserIdsWithRTCUids(rtcUids: number[]): Promise<RTCUidUserIdMap> {
        const data = await postJson<unknown>('/api/rtc/user-ids', { rtcUids });
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
          throw new Error('RTC UID 映射接口返回的数据格式错误');
        }

        const result: RTCUidUserIdMap = {};
        for (const [rtcUid, mappedUserId] of Object.entries(data)) {
          if (
            rtcUids.includes(Number(rtcUid)) &&
            typeof mappedUserId === 'string' &&
            mappedUserId.trim() !== ''
          ) {
            result[rtcUid] = mappedUserId;
          }
        }
        return result;
      },
    }),
    [userId, useRTCToken],
  );
}

function CallKitLayer({ userId }: { userId: string }) {
  const { client } = React.useContext(RootContext);
  const callKitRef = React.useRef<CallKitRef>(null);
  const useRTCToken = true;
  const rtcProvider = useCallKitRTCProvider(userId, useRTCToken);
  const [peerUserId, setPeerUserId] = React.useState('bob');

  const startCall = async (callType: 'video' | 'audio') => {
    const to = peerUserId.trim();
    if (!to) {
      window.alert('请输入对方用户 ID');
      return;
    }

    try {
      await callKitRef.current?.startSingleCall({
        to,
        callType,
        msg: callType === 'video' ? '邀请你进行视频通话' : '邀请你进行语音通话',
      });
    } catch (error) {
      console.error('发起通话失败', error);
    }
  };

  const userInfoProvider = React.useCallback(async (userIds: string[]) => {
    // 生产环境中请从业务服务端或本地缓存返回真实昵称和头像。
    return userIds.map(id => ({
      userId: id,
      nickname: id,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(id)}`,
    }));
  }, []);

  return (
    <>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          value={peerUserId}
          onChange={event => setPeerUserId(event.target.value)}
          placeholder="对方用户 ID"
        />
        <button onClick={() => void startCall('video')}>视频通话</button>
        <button onClick={() => void startCall('audio')}>语音通话</button>
      </div>

      <CallKit
        ref={callKitRef}
        chatClient={client}
        rtcProvider={rtcProvider}
        useRTCToken={useRTCToken}
        userInfoProvider={userInfoProvider}
        enableRingtone
        onCallError={error => console.error('CallKit 通话失败', error)}
        onEndCallWithReason={(reason, callInfo) => {
          console.log('通话结束', { reason, callInfo });
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <Provider
      initConfig={{
        appKey,
        userId: currentUserId,
        token: imToken,
      }}
    >
      <CallKitLayer userId={currentUserId} />
    </Provider>
  );
}
```

示例中的服务端接口应按以下约定返回数据：

```text
POST /api/rtc/token
{ "userId": "alice", "channelName": "由 CallKit 传入的频道名" }
=> { "appId": "your-agora-app-id", "rtcToken": "...", "rtcUid": 10001 }

POST /api/rtc/user-ids
{ "rtcUids": [10001, 10002] }
=> { "10001": "alice", "10002": "bob" }
```

如果只需要自定义 Token 获取而继续使用 IM SDK 的 UID 映射，可以从 provider 中删除 `getUserIdsWithRTCUids`；如果声网项目允许不校验 Token，请将示例中的 `useRTCToken` 常量改为 `false`（该常量同时传给 `useCallKitRTCProvider` 和 `CallKit`），此时仍需返回正确的 `appId` 和 `rtcUid`，`rtcToken` 可以为空。

运行页面后，请先等待 `Provider` 使用 `initConfig` 完成 IM 登录，再点击通话按钮。示例中的 App Key、IM Token 和服务端接口地址均为占位值，生产环境不要将真实凭证硬编码在前端代码中。

## 常见问题

| 现象 | 排查方向 |
| --- | --- |
| 收到 `Valid RTC token info is unavailable` 错误 | 检查 `getRTCTokenInfo` 是否成功返回非空 `appId`、有限数字 `rtcUid`，以及在 `useRTCToken` 为 `true` 时返回非空 `rtcToken`。 |
| 能发送通话邀请但无法进入频道 | 确认 Token 的 App ID、频道名和 UID 与返回数据一致，并检查 Token 是否已过期。 |
| 多人通话中远端用户只有 UID，昵称或头像没有正确显示 | 实现 `getUserIdsWithRTCUids`，并确保返回对象以 UID 的字符串作为键、IM `userId` 作为值。 |
| 配置了 provider 后仍然请求 IM SDK 的 RTC 接口 | 确认传给 `CallKit` 的 `rtcProvider` 中包含对应方法；只配置一个方法时，另一个方法仍会按设计回退到 IM SDK。 |

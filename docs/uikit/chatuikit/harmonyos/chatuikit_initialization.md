# 初始化

在使用 UIKit 的控件前，必须要先初始化。例如在 `EntryAbility` 中：

```typescript
export default class EntryAbility extends UIAbility {
  private appKey: string = [项目的AppKey]; // 将[项目的AppKey]替换为项目的AppKey字符串

  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    let options = new ChatOptions({
      appKey: this.appKey
    });
    options.setAutoLogin(false);
    let client = ChatClient.getInstance();
    client.init(getContext(), options);
    ChatUIKitClient.init(client);
  }

}
```
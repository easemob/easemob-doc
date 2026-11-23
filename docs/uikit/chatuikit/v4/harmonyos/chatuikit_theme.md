# 主题

<Toc />

ChatUIKit 内置浅色和深色主题，默认为浅色主题。

- 浅色主题

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/light_mode.png" title="浅色主题" />
</ImageGallery>

- 深色主题

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/dark_mode.png" title="深色主题" />
</ImageGallery>

## 实现方式

HarmonyOS 平台可以在 `resources` 目录下创建 `dark` 资源文件。HarmonyOS 系统会跟随系统明暗色的切换使用对应的资源包。

单群聊 UIKit 定义了一组基础颜色，满足 UIKit 自身主题颜色的需求。客户如想要自定义 UIKit 主题色，可以在自己的项目中新建 `dark` 文件夹，并复制 `uikit_colors.json` 到文件夹中，然后对其中的基础颜色修改。

## 切换为内置主题 

应用默认配置为跟随系统切换深浅色模式，如不希望应用跟随系统深浅色模式变化，可主动设置应用的深浅色风格。设置后，应用的深浅色模式固定，不会随系统改变。

```typescript
onCreate(): void {
  hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onCreate');
  this.context.getApplicationContext().setColorMode(ConfigurationConstant.ColorMode.COLOR_MODE_DARK);
}
```

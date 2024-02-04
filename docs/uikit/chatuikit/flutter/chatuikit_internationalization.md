# 国际化

<Toc />

`ChatUIKit` 提供国际化功能，默认支持中文和英文。

## 添加国际化文件

```dart
class MyApp extends StatelessWidget {
  MyApp({super.key});

  final ChatUIKitLocalizations _localization = ChatUIKitLocalizations();

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      localizationsDelegates: _localization.localizationsDelegates,
      supportedLocales: _localization.supportedLocales,
    );
  }
}
```

当 app 使用的语言超过我们提供的语言范围时，可以设置默认语言，即中文或英文：

```dart
_localization.displayLanguageWhenNotSupported = const Locale('en');
```

## 添加新语言

可以通过 `ChatUIKitLocalizations.addLocales` 方法扩展国际化支持的语言，对应文字的常量定义在 `ChatUIKitLocal` 文件中。你可以添加自己的 `MapLocale` 对象传入到 `ChatUIKitLocalizations` 中实现国际化。

例如，你可以通过以下方式添加法语支持：

```dart

class _MyAppState extends State<MyApp> {
  final ChatUIKitLocalizations _chatUIKitLocalizations =
      ChatUIKitLocalizations();

  @override
  void initState() {
    super.initState();
    _chatUIKitLocalizations.addLocales(locales: const [
      MapLocale('fr', {
        ChatUIKitLocal.conversationsViewSearchHint: 'Recherche',
        // 需要根据ChatUIKitLocal中的定义将文字补充完整。
        ...
      }),
    ]);
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      localizationsDelegates: _chatUIKitLocalizations.localizationsDelegates,
      supportedLocales: _chatUIKitLocalizations.supportedLocales,
      localeResolutionCallback:
          _chatUIKitLocalizations.localeResolutionCallback,
      ...
    );
  }
}
```
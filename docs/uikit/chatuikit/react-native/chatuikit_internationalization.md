# 国际化

<Toc />

`Chat UIKit SDK` UI 组件库提供国际化服务，默认提供中文和英文两种语言包。

例如：

```tsx
export function App() {
  // 如果没有指定语言，则通过系统获取默认语言。
  const [language] = React.useState<LanguageCode>("zh-Hans");

  return (
    <Container options={{ appKey: "appKey" }} translateLanguage={'zh-Hans'}>
      {/* 添加子组件。 */}
    </Container>
  );
}
```

## 设置语言包

如果设置中文、英文以外的语言，需要提供指定语言的语言包，该语言包通过 `onInitLanguageSet` 的回调注册。

例如：

```tsx
// 创建法语语言包
export function createStringSetFr(): StringSet {
  return {
    "this is test.": "c'est un test.",
    "This is test with ${0} and ${1}": (a: string, b: number) => {
      return `Ceci est un test avec ${a} et ${b}`;
    },
  };
}

export function App() {
  // 设置法语
  const [language] = React.useState<LanguageCode>("fr");
  const onInitLanguageSet = React.useCallback(() => {
    const ret = (language: LanguageCode): StringSet => {
      const d = createDefaultStringSet(language);
      if (language === "fr") {
        return createStringSetFr();
      }
      return d;
    };
    return ret;
  }, []);

  return (
    <Container
      options={{ appKey: "appKey" }}
      language={language}
      onInitLanguageSet={onInitLanguageSet}
    >
      {/* 添加子组件。 */}
    </Container>
  );
}
```

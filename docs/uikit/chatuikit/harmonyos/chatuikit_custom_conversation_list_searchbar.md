# 设置会话搜索栏

会话列表页面支持按会话名称搜索会话。你可以控制搜索栏的显示、自定义搜索栏的样式、跳转逻辑以及自定义搜索功能。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/searchbar.png" title="搜索栏 SearchView" />
</ImageGallery>

## 使用默认搜索栏

`ConversationListView` 默认显示搜索栏，点击后触发 `onSearchClick` 事件：

```typescript
import { ConversationListView, ConvListViewModel } from '@easemob/chatuikit';

@Entry
@ComponentV2
struct ConvListWithSearch {
  @Local viewModel: ConvListViewModel = new ConvListViewModel();
  pathStack: NavPathStack = new NavPathStack();

  build() {
    Column() {
      ConversationListView({
        viewModel: this.viewModel,
        showSearchView: true,  // 显示搜索栏（默认值）
        onSearchClick: () => {
          // 点击搜索栏，跳转到搜索页面
          this.pathStack?.pushPath({ name: "SearchConversationPage" });
        }
      })
    }
  }
}
```

## 隐藏搜索栏

如果不需要搜索功能，可隐藏搜索栏：

```typescript
ConversationListView({
  viewModel: new ConvListViewModel(),
  showSearchView: false  // 隐藏搜索栏
})
```

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/harmonyos/custom_conversation_search_hide.png" title="隐藏搜索框" />
</ImageGallery>

## 自定义搜索栏样式

通过 `searchBuilder` 参数自定义搜索栏 UI：

```typescript
import { ConversationListView, ConvListViewModel, KitCallback } from '@easemob/chatuikit';

@Entry
@ComponentV2
struct CustomSearchBarDemo {
  @Local viewModel: ConvListViewModel = new ConvListViewModel();
  pathStack: NavPathStack = new NavPathStack();

  // 自定义搜索栏组件
  @Builder
  customSearchBar(onClick: KitCallback) {
    Row() {
      Image($r('app.media.chat_icon_search'))
        .width(20)
        .height(20)
        .margin({ right: 8 })
      
      Text('搜索会话或消息')
        .fontSize(14)
        .fontColor('#999999')
        .layoutWeight(1)
      
      Image($r('app.media.chat_icon_filter'))
        .width(20)
        .height(20)
        .margin({ left: 8 })
    }
    .width('90%')
    .height(40)
    .padding({ left: 12, right: 12 })
    .backgroundColor('#F5F5F5')
    .borderRadius(20)
    .onClick(() => {
      onClick?.();  // 触发搜索点击事件
    })
  }

  build() {
    Column() {
      // 自定义搜索栏
      Row() {
        this.customSearchBar((onClick) => {
          console.log('点击搜索栏');
          this.pathStack?.pushPath({ name: "SearchConversationPage" });
        })
      }
      .width('100%')
      .padding(12)
      
      ConversationListView({
        viewModel: this.viewModel,
        showSearchView: false,  // 隐藏默认搜索栏
        searchBuilder: this.customSearchBar,  // 使用自定义搜索栏
        onSearchClick: () => {
          this.pathStack?.pushPath({ name: "SearchConversationPage" });
        }
      })
        .layoutWeight(1)
    }
  }
}
```

:::tip
`searchBuilder` 接收一个带有 `KitCallback` 参数的 `@Builder` 函数，用于自定义搜索栏的 UI 和点击行为。
:::

## 使用内置搜索页面

环信单群聊 UIKit 提供 `SearchConversationPage` 组件，支持完整的会话搜索功能：

```typescript
import { ConversationListPage, SearchConversationPage } from '@easemob/chatuikit';

@Entry
@ComponentV2
struct MainPage {
  pathStack: NavPathStack = new NavPathStack();

  @Builder
  pageMap(name: string) {
    if (name === 'ConversationListPage') {
      ConversationListPage({
        pathStack: this.pathStack,
        onSearchClick: () => {
          // 点击搜索栏，跳转到搜索页面
          this.pathStack.pushPath({ name: 'SearchConversationPage' });
        }
      })
    } else if (name === 'SearchConversationPage') {
      SearchConversationPage()
    }
  }

  build() {
    Navigation(this.pathStack) {
      // 主页内容
    }
    .navDestination(this.pageMap)
  }
}
```

`SearchConversationPage` 提供以下功能：
- 实时搜索会话（按会话名称或 ID）
- 显示搜索结果列表
- 点击搜索结果进入聊天页面
- 支持返回按钮

## 自定义搜索跳转路由

通过 `onSearchClick` 实现自定义搜索栏点击后的跳转逻辑：

```typescript
import { ConversationListView, ConvListViewModel } from '@easemob/chatuikit';

@Entry
@ComponentV2
struct ConvListWithCustomSearch {
  @Local viewModel: ConvListViewModel = new ConvListViewModel();
  pathStack: NavPathStack = new NavPathStack();

  build() {
    Column() {
      ConversationListView({
        viewModel: this.viewModel,
        showSearchView: true,
        onSearchClick: () => {
          // 自定义跳转逻辑
          console.log('点击搜索');
          
          // 可以跳转到自定义搜索页面
          this.pathStack?.pushPath({
            name: "MyCustomSearchPage",
            param: {
              // 传递参数
              searchType: 'conversation'
            }
          });
        }
      })
    }
  }
}
```

## 实现自定义搜索逻辑

通过继承 `ConvListViewModel` 实现完整的搜索功能：

```typescript
import { ConvListViewModel, ChatKitConversation, ConversationListView } from '@easemob/chatuikit';

@ObservedV2
class SearchableConvListViewModel extends ConvListViewModel {
  @Trace isSearching: boolean = false;
  @Trace searchKeyword: string = '';
  private allConversations: ChatKitConversation[] = [];

  aboutToAppear(): void {
    super.aboutToAppear();
    // 保存所有会话
    this.allConversations = [...this.dataList];
  }

  // 重写搜索方法
  searchConversations(keyword: string) {
    this.searchKeyword = keyword;
    this.isSearching = keyword.trim() !== '';
    
    if (!keyword || keyword.trim() === '') {
      // 清空搜索，恢复所有会话
      this.dataList = [...this.allConversations];
      return;
    }
    
    // 根据关键词过滤
    const key = keyword.toLowerCase();
    this.dataList = this.allConversations.filter(conv => {
      const name = conv.getName().toLowerCase();
      const id = conv.conversationId.toLowerCase();
      return name.includes(key) || id.includes(key);
    });
  }

  // 清空搜索
  clearSearch(): void {
    this.searchConversations('');
  }
}

// 使用自定义搜索 ViewModel
@Entry
@ComponentV2
struct CustomSearchDemo {
  @Local viewModel: SearchableConvListViewModel = new SearchableConvListViewModel();
  @Local searchText: string = '';

  build() {
    Column() {
      // 自定义搜索输入框
      Row() {
        TextInput({ placeholder: '搜索会话', text: this.searchText })
          .layoutWeight(1)
          .onChange((value: string) => {
            this.searchText = value;
            this.viewModel.searchConversations(value);
          })
        
        if (this.searchText) {
          Button('取消')
            .fontSize(14)
            .onClick(() => {
              this.searchText = '';
              this.viewModel.clearSearch();
            })
        }
      }
      .width('100%')
      .padding(12)
      .backgroundColor('#F5F5F5')
      
      // 会话列表
      ConversationListView({
        viewModel: this.viewModel,
        showSearchView: false  // 隐藏默认搜索栏
      })
        .layoutWeight(1)
    }
  }
}
```

## 完整示例

集成自定义搜索栏样式与搜索逻辑：

```typescript
import {
  ConversationListView,
  ConvListViewModel,
  ChatKitConversation,
  KitCallback
} from '@easemob/chatuikit';

@Entry
@ComponentV2
struct ConversationSearchDemo {
  @Local viewModel: ConvListViewModel = new ConvListViewModel();
  @Local searchText: string = '';
  @Local isSearching: boolean = false;
  pathStack: NavPathStack = new NavPathStack();

  // 自定义搜索栏
  @Builder
  searchBar() {
    Row() {
      if (!this.isSearching) {
        // 未搜索状态：显示搜索入口
        Row() {
          Image($r('app.media.chat_icon_search'))
            .width(20)
            .height(20)
            .margin({ right: 8 })
          Text('搜索会话')
            .fontSize(14)
            .fontColor('#999999')
            .layoutWeight(1)
        }
        .width('100%')
        .height(40)
        .padding({ left: 12, right: 12 })
        .backgroundColor('#F5F5F5')
        .borderRadius(20)
        .onClick(() => {
          // 跳转到搜索页面
          this.pathStack?.pushPath({ name: "SearchConversationPage" });
        })
      } else {
        // 搜索状态：显示搜索输入框
        TextInput({ placeholder: '搜索会话', text: this.searchText })
          .layoutWeight(1)
          .height(40)
          .onChange((value: string) => {
            this.searchText = value;
            this.performSearch(value);
          })
        
        Button('取消')
          .fontSize(14)
          .margin({ left: 8 })
          .onClick(() => {
            this.isSearching = false;
            this.searchText = '';
            this.viewModel.searchConversations('');
          })
      }
    }
    .width('100%')
    .padding(12)
  }

  build() {
    Column() {
      this.searchBar()
      
      ConversationListView({
        viewModel: this.viewModel,
        showSearchView: false
      })
        .layoutWeight(1)
    }
  }

  // 执行搜索
  performSearch(keyword: string) {
    this.viewModel.searchConversations(keyword);
  }
}
```

## 相关参数

### ConversationListView 搜索参数

| 参数 | 类型 | 必填 | 描述 | 默认值 |
| :--- | :----- | :--- | :------- | :----- |
| `showSearchView` | Boolean | 否 | 是否显示搜索栏 | `true`：显示 |
| `searchBuilder` | BuilderParam | 否 | 自定义搜索栏组件 | 默认搜索栏 |
| `onSearchClick` | KitCallback | 否 | 搜索栏点击事件 | - |

### BaseConvListViewModel 搜索方法

| 方法 | 参数 | 描述 |
|------|------|------|
| `searchConversations` | key: string | 搜索会话（抽象方法，需子类实现） |


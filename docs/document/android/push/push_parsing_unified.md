# 统一获取消息方案

Android 设备品牌丰富，各厂商对于点击通知栏后获取消息的方式不尽相同，华为、荣耀等厂商官方推荐使用 Activity 获取消息，而小米、vivo 等厂商支持通过监听器解析获取消息，详见[解析推送消息](push_parsing.html)。

开发者可能需针对不同厂商编写多套点击处理代码，能否有一种统一方案适用于各厂商呢？

## 方案详情

如果 MainActivity 是启动页，环信建议采用 Activity 这种通用方式在点击通知栏后统一获取消息。如果 MainActivity 不是启动页，需要指定跳转到MainActivity 在点击通知栏后统一获取消息。

客户端应用通过 `MainActivity` 中的 `onCreate` 方法接收数据。

::: tabs#code

@tab Java

```java
public class MainActivity {
  final static String TAG = "MainActivity";

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    getIntentData(getIntent());
  }

  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    setIntent(intent);
    getIntentData(intent);
  }

  private void getIntentData(Intent intent) {
    if (null != intent) {
      Bundle bundle = intent.getExtras();
      Log.d(TAG, "Bundle bundle: " + (bundle != null));
      if (bundle != null) {
        Log.d(TAG, "from" + bundle.getString("f"))
        Log.d(TAG, "to" + bundle.getString("t"))
        Log.d(TAG, "message id" + bundle.getString("m"))
        Log.d(TAG, "group id" + bundle.getString("g"))
        Log.d(TAG, "extra" + bundle.getString("e"))
      }
    } else {
      Log.i(TAG, "intent is null");
    }
  }
}
```

@tab Kotlin

```kotlin
class MainActivity {
  companion object {
    const val TAG = "MainActivity"
  }

  override fun onNewIntent(intent: Intent?) {
    super.onNewIntent(intent)
    setIntent(intent) // 更新 Intent
    getIntentData(intent)
  }

  override fun onCreate(savedInstanceState: Bundle?, persistentState: PersistableBundle?) {
    super.onCreate(savedInstanceState, persistentState)
    getIntentData(intent)
  }
  private fun getIntentData(intent: Intent?) {
    if (null != intent) {
      val bundle = intent.extras
      bundle?.keySet()?.forEach { key ->
        val value = bundle.get(key)
        when (value) {
          is String -> Log.i(TAG, "receive data from push, key = $key, content = ${bundle.getString(key)}")
          is Int -> Log.i(TAG, "receive data from push, key = $key, content = ${bundle.getInt(key)}")
          is Boolean -> Log.i(TAG, "receive data from push, key = $key, content = ${bundle.getBoolean(key)}")
          is Float -> Log.i(TAG, "receive data from push, key = $key, content = ${bundle.getFloat(key)}")
          is Double -> Log.i(TAG, "receive data from push, key = $key, content = ${bundle.getDouble(key)}")
          else -> Log.i(TAG, "receive data from push, key = $key, content = $value")
        }
      }
    } else {
      Log.i(TAG, "intent = null")
    }
  }
}

```
:::

## 参考

- [环信服务端推送扩展字段说明](/document/server-side/push_extension.html#离线推送相关的扩展字段)
- [Android 解析消息示例](/document/android/push/push_parsing.html)
- [华为官方说明](https://developer.huawei.com/consumer/cn/doc/HMSCore-Guides/andorid-basic-clickaction-0000001087554076)
- [小米官方说明](https://dev.mi.com/console/doc/detail?pId=68)

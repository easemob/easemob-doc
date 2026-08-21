# Unified Solution for Obtaining Messages

Android devices come from many brands, and different vendors use different methods to obtain messages after users tap the notification bar. Huawei, Honor, and other vendors officially recommend using an Activity to obtain messages, while Xiaomi, vivo, and other vendors support parsing and obtaining messages through listeners. For details, see [Parse push messages](push_parsing.html).

Developers may need to write multiple sets of click-handling code for different vendors. For convenience, we provide a unified solution for obtaining messages that applies to all vendors.

## Solution details

If MainActivity is the launch page, EasyIM recommends using the common Activity method to obtain messages uniformly after users tap the notification bar. If MainActivity is not the launch page, you need to specify that the app jumps to MainActivity to obtain messages uniformly after users tap the notification bar.

The client app receives data through the `onCreate` method in `MainActivity`.

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
    setIntent(intent) // Update Intent
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

## References

- [Easemob server-side push extension fields](/document/server-side/push_extension.html#offline-push-related-extension-fields)
- [Android message parsing example](/document/android/push/push_parsing.html)
- [Huawei official documentation](https://developer.huawei.com/consumer/cn/doc/HMSCore-Guides/andorid-basic-clickaction-0000001087554076)
- [Xiaomi official documentation](https://dev.mi.com/console/doc/detail?pId=68)

## 导入第三方表情包

- 在项目下面新建一个文件夹，用于存放表情图片文件。

- 在引用了 SDK 之后执行如下代码：

```
WebIM.Emoji = {
    path: 'demo/src/themes/faces/'  /*表情包路径*/
    , map: {
        '[):]': 'ee_1.png',
        '[:D]': 'ee_2.png',
        '[;)]': 'ee_3.png',
        '[:-o]': 'ee_4.png',
        '[:p]': 'ee_5.png'
    }
};
```

**注意：**

- 全局变量 WebIM 添加一个 Emoji 属性

- path 表示表情图片存放的路径

- map 里面的 key 表示代表表情图片的字符

- value 表示表情图片的文件名。

发送和接收表情消息与文本消息类似，如果发送的文本消息中带有表情的 key 字符，SDK 会将此消息转换成表情图片的实际路径。

如：文本消息中包含 “[):]” 字符串，则解析为`WebIM.Emoji.path+WebIM.Emoji.map['[):]']= “demo/src/themes/faces/ee_1.png”`。
# 体验 Demo

环信提供 Android、iOS、Web、Flutter 和 React Native 平台的 Demo。

## 各端原生开发 Demo

<el-row gutter="12" :style="{ rowGap: '12px' }">
    <el-col
      :span="12"
      :md="8"
      :xl="6"
      :lg="6"
    >
     <DemoCard icon="https://main.qcloudimg.com/raw/b0211b0870806899009a17a4216ea65c.svg" title="Android" qrcode="/images/demo/android_ios.png" actionText="跑通 Android Demo" actionLink="https://github.com/easemob/easemob-demo-android" />
    </el-col><el-col
      :span="12"
      :md="8"
      :xl="6"
      :lg="6"
    >
     <DemoCard icon="/sdk/iOS.svg" title="iOS" qrcode="/images/demo/android_ios.png" actionText="跑通 iOS Demo" actionLink="https://github.com/easemob/easemob-demo-ios" />
    </el-col> <el-col
      :span="12"
      :md="8"
      :xl="6"
      :lg="6"
    >
   <DemoCard title="React" icon="/sdk/react.svg"  actionText="跑通 Demo" actionLink="https://github.com/easemob/easemob-demo-react/tree/dev_4.0">
  <template #action>
    <button class="custom-button">
    <a href="https://webim-h5.easemob.com/login">在线体验</a>
    </button>
  </template>
  </DemoCard>
  </el-col><el-col
      :span="12"
      :md="8"
      :xl="6"
      :lg="6"
    >
   <DemoCard title="Web (Vue 3)" icon="/sdk/vue.svg"  actionText="跑通 Demo"   actionLink="https://github.com/easemob/webim-vue-demo/tree/demo-vue3" >
  <template #action>
    <button class="custom-button">
    <a href="https://webim-vue3.easemob.com/login">在线体验</a>
    </button>
  </template>
</DemoCard>
</el-col></el-row>


| 客户端           | 新 Demo   | 旧 Demo   | 
| :------------- | :----- | :----- | 
| Android | <br/> - Kotlin Demo，v4.6.0 及以上 <br/> - 查看 [Demo 源码地址](https://github.com/easemob/easemob-demo-android) | <br/> - Java Demo，v4.5.0 及以下<br/> - 查看 [Demo 源码地址](https://github.com/easemob/chat-android)，环信不再维护该 Demo 源码 | 
| iOS   | <br/> - Swift Demo，v4.6.0 及以上 <br/> - 查看 [Demo 源码地址](https://github.com/easemob/easemob-demo-ios)  | <br/> - Objective-C Demo，4.5.0 及以下。<br/> - 查看 [Demo 源码地址](https://github.com/easemob/easemob-demo-ios/tree/OCDemo)，环信不再维护该 Demo 源码   | 
| Web | <br/> - React Demo <br/> - 可查看 [Demo 源码地址](https://github.com/easemob/easemob-demo-react/tree/dev_4.0) | |
| Web | <br/> - Vue 3 Demo <br/> - 可查看 [Demo 源码地址](https://github.com/easemob/webim-vue-demo/tree/demo-vue3) | Vue 2 Demo<br/> -可查看 [Demo 源码地址](https://github.com/easemob/webim-vue-demo/tree/dev-4.0)，环信不再维护该 Demo 源码|

## Uni-app Demo

<el-row gutter="12" :style="{ rowGap: '12px' }">
    <el-col
      :span="12"
      :md="8"
      :xl="6"
      :lg="6"
    >
     <DemoCard icon="/sdk/android.svg" title="Android" qrcode="/images/demo/uniapp_android.png" actionText="跑通 Demo" actionLink="https://github.com/easemob/easemob-uikit-uniapp" />
    </el-col>
  <el-col
      :span="12"
      :md="8"
      :xl="6"
      :lg="6"
    >
     <DemoCard icon="/sdk/iOS.svg" title="iOS" qrcode="/images/demo/uniapp_ios.png" actionText="跑通 Demo"  actionLink="https://github.com/easemob/easemob-uikit-uniapp" />
    </el-col>
  <el-col
      :span="12"
      :md="8"
      :xl="6"
      :lg="6"
    >
     <DemoCard icon="/sdk/applet.svg" title="H5" qrcode="/images/demo/uniapp_h5.png" actionText="跑通 Demo"  actionLink="https://github.com/easemob/easemob-uikit-uniapp" />
    </el-col>
</el-row>

## 微信小程序

<el-row gutter="12" :style="{ rowGap: '12px' }">
    <el-col
      :span="12"
      :md="8"
      :xl="6"
      :lg="6"
    >
     <DemoCard icon="/sdk/applet.svg" title="微信小程序" qrcode="/images/applet/applet-demo.png" actionText="跑通 Demo" actionLink="https://github.com/easemob/webim-weixin-xcx" />
    </el-col>
</el-row>

## Flutter Demo

<el-row gutter="12" :style="{ rowGap: '12px' }">
    <el-col
      :span="12"
      :md="8"
      :xl="6"
      :lg="6"
    >
     <DemoCard icon="/sdk/android.svg" title="Android" qrcode="/images/demo/flutter_android.png" actionText="跑通 Demo" actionLink="https://github.com/easemob/easemob-demo-flutter" />
    </el-col>
  <el-col
      :span="12"
      :md="8"
      :xl="6"
      :lg="6"
    >
     <DemoCard icon="/sdk/iOS.svg" title="iOS" qrcode="/images/demo/flutter_ios.png" actionText="跑通 Demo" actionLink="https://github.com/easemob/easemob-demo-flutter" />
    </el-col> 
</el-row>

## React Native Demo

<el-row gutter="12" :style="{ rowGap: '12px' }">
    <el-col
      :span="12"
      :md="8"
      :xl="6"
      :lg="6"
    >
     <DemoCard icon="/sdk/android.svg" title="Android" qrcode="/images/demo/rn_android.png" actionText="跑通 Demo" actionLink="https://github.com/easemob/easemob-uikit-reactnative" />
    </el-col><el-col
      :span="12"
      :md="8"
      :xl="6"
      :lg="6"
    >
     <DemoCard icon="/sdk/iOS.svg" title="iOS" qrcode="/images/demo/rn_ios.png" actionText="跑通 Demo" actionLink="https://github.com/easemob/easemob-uikit-reactnative" />
    </el-col>
</el-row>    

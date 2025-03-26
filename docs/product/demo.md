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
     <DemoCard icon="https://main.qcloudimg.com/raw/b0211b0870806899009a17a4216ea65c.svg" title="Android" qrcode="/images/demo/android_ios.png" actionText="跑通 Android Demo"  actionLink="https://github.com/easemob/easemob-demo-android" />
    </el-col></el-col> 
    <el-col
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
   <DemoCard title="Web(Vue 3)" icon="/sdk/web.svg"  actionText="跑通 Demo"   actionLink="https://github.com/easemob/webim-vue-demo/tree/demo-vue3" >
  <template #action>
    <button class="custom-button">
    <a href="https://webim-vue3.easemob.com/login">体验 Demo</a>
    </button>
  </template>
</DemoCard>
    </el-col><el-col
      :span="12"
      :md="8"
      :xl="6"
      :lg="6"
    >
     <DemoCard icon="/sdk/applet.svg" title="微信小程序" qrcode="/images/applet/applet-demo.png" actionText="跑通 Demo" actionLink="https://github.com/easemob/webim-weixin-xcx" />
    </el-col>
  </el-row>

  :::tip
  1. 对于 Android，4.6.0 及之后版本的 Demo 为上面展示的新 Demo，为 Kotlin 语言。4.5.0 及之前版本的 Demo，为 Java 语言，你可以查看 [Demo 源码地址](https://github.com/easemob/chat-android)，环信已不再维护该地址的 Demo 源码。
  2. 对于 iOS，4.6.0 及之后版本的 Demo 为上面展示的新 Demo，为 Swift 语言。4.5.0 及之前版本的 Demo，为 Objective-C 语言，你可以查看 [Demo 源码地址](https://github.com/easemob/easemob-demo-ios/tree/OCDemo)，环信已不再维护该地址的 Demo 源码。
  3. 对于 Web Vue 2 Demo，你可以查看 [Demo 源码地址](https://github.com/easemob/webim-vue-demo/tree/dev-4.0)，环信已不再维护该地址的 Demo 源码。
    :::

## Uni-app Demo

<el-row gutter="12" :style="{ rowGap: '12px' }">
    <el-col
      :span="12"
      :md="8"
      :xl="6"
      :lg="6"
    >
     <DemoCard icon="https://main.qcloudimg.com/raw/b0211b0870806899009a17a4216ea65c.svg" title="Uni-app (Android)" qrcode="/images/demo/uniapp_android.png" actionText="跑通 Demo" actionLink="https://github.com/easemob/webim-uniapp-demo" />
    </el-col>
  <el-col
      :span="12"
      :md="8"
      :xl="6"
      :lg="6"
    >
     <DemoCard icon="https://main.qcloudimg.com/raw/b0211b0870806899009a17a4216ea65c.svg" title="Uni-app (iOS)" qrcode="/images/demo/uniapp_ios.png" actionText="跑通 Demo"  actionLink="https://github.com/easemob/webim-uniapp-demo" />
    </el-col>
  <el-col
      :span="12"
      :md="8"
      :xl="6"
      :lg="6"
    >
     <DemoCard icon="https://main.qcloudimg.com/raw/b0211b0870806899009a17a4216ea65c.svg" title="Uni-app (H5)" qrcode="/images/demo/uniapp_h5.png" actionText="跑通 Demo"  actionLink="https://github.com/easemob/webim-uniapp-demo" />
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
     <DemoCard icon="https://main.qcloudimg.com/raw/b0211b0870806899009a17a4216ea65c.svg" title="Flutter (Android)" qrcode="/images/demo/flutter_android.png" actionText="跑通 Demo" actionLink="https://github.com/easemob/easemob-demo-flutter" />
    </el-col>
  <el-col
      :span="12"
      :md="8"
      :xl="6"
      :lg="6"
    >
     <DemoCard icon="https://main.qcloudimg.com/raw/b0211b0870806899009a17a4216ea65c.svg" title="Flutter (iOS)" qrcode="/images/demo/flutter_ios.png" actionText="跑通 Demo" actionLink="https://github.com/easemob/easemob-demo-flutter" />
    </el-col> 
</el-row>

## React Native/React Demo

<el-row gutter="12" :style="{ rowGap: '12px' }">
    <el-col
      :span="12"
      :md="8"
      :xl="6"
      :lg="6"
    >
     <DemoCard icon="https://main.qcloudimg.com/raw/b0211b0870806899009a17a4216ea65c.svg" title="React Native (Android)" qrcode="/images/demo/rn_android.png" actionText="跑通 Demo" actionLink="https://github.com/easemob/easemob-uikit-reactnative" />
    </el-col><el-col
      :span="12"
      :md="8"
      :xl="6"
      :lg="6"
    >
     <DemoCard icon="https://main.qcloudimg.com/raw/b0211b0870806899009a17a4216ea65c.svg" title="React Native (iOS)" qrcode="/images/demo/rn_ios.png" actionText="跑通 Demo" actionLink="https://github.com/easemob/easemob-uikit-reactnative" />
    </el-col><el-col
      :span="12"
      :md="8"
      :xl="6"
      :lg="6"
    >
   <DemoCard title="Web (React)" icon="https://main.qcloudimg.com/raw/b0211b0870806899009a17a4216ea65c.svg"  actionText="跑通 Demo" actionLink="https://webim-h5.easemob.com/login">
  <template #action>
    <button class="custom-button">
    <a href="https://www.easemob.com/download/demo">体验 Demo</a>
    </button>
  </template>
</DemoCard>
    </el-col>
</el-row>    

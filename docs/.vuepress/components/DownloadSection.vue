<template>
  <section class="download-section">
    <h2>资源下载</h2>
    <p class="description">从下面选项中选择合适的 SDK 下载并集成到你的应用中，以快速接入即时通讯服务。</p>

    <div class="compliance-card">
      <div class="compliance-title">SDK 合规信息公示</div>
      <p><strong>功能介绍：</strong>为开发者提供低延时、高并发、可扩展、高可靠的实时消息及状态同步网络服务。</p>
      <p><strong>基本信息：</strong></p>
      <p>【SDK 名称】即时通讯 SDK；【开发者】北京亿思摩博网络科技有限公司。</p>
      <p>【使用说明】<a href="https://www.easemob.com/news/privacy" target="_blank" rel="noopener noreferrer">《即时通讯 SDK 合规使用说明》</a>；【个人信息处理规则】<a href="https://www.easemob.com/protocol" target="_blank" rel="noopener noreferrer">《SDK个人信息处理规则》</a></p>
    </div>

    <DownloadTable title="SDK 最新版本" :items="latestSDKDownloadInfo" :show-remark="true" />
    <DownloadTable title="SDK 稳定版本" :items="stableSDKDownloadInfo" />
  </section>
</template>

<script setup lang="ts">
import DownloadTable from "./DownloadTable.vue";

const latestSDKDownloadInfo = [
  ["Android", "Java", "v5.0.0", "com.hyphenate.chat", "a97c03af8b2040dea043b3c401fb361a", "2026-08-12", "/docs/document/android/releasenote.html#v5-0-0-dev-2026-8-12", "https://download-sdk.oss-cn-beijing.aliyuncs.com/downloads/easemob-sdk-5.0.0.zip", "-"],
  ["iOS", "Objective-C/swift", "v5.0.0", "-", "738f559047c0fea40a7cbe82598bcf36", "2026-08-12", "/docs/document/ios/releasenote.html#v5-0-0-dev-2026-8-12", "https://downloadsdk.easesdk.com/downloads/iOS_IM_SDK_V5.0.0.zip", "-"],
  ["Web/小程序/uni-app", "TypeScript", "v5.0.0", "-", "6ea53b149250f44693f061d6731f87fe", "2025-08-12", "/docs/document/web/releasenote.html#v5-0-0-dev-2026-8-12", "https://downloads.easemob.com/downloads/WEB_SDK/5.0.0/websdk.zip", "-"],
  ["HarmonyOS", "TypeScript", "v1.13.0", "@easemob/chatsdk", "2ec37112f5a080d437821e35943285e2", "2026-06-25", "/docs/document/harmonyos/releasenote.html#v1-13-0-dev-2026-6-24-%E5%BC%80%E5%8F%91%E7%89%88", "https://downloadsdk.easesdk.com/downloads/HarmonySDK/chatsdk-1.13.0.har", "-"],
  ["Flutter", "Dart", "v4.19.3", "-", "-", "2026-06-12", "/docs/document/flutter/releasenote.html#_4-19-3-2026-6-12", "https://pub.dev/packages/im_flutter_sdk", "等同于\n稳定版"],
  ["React Native", "TypeScript", "v1.15.2", "-", "-", "2026-06-02", "/docs/document/react-native/releasenote.html#v1-15-2-2026-06-02", "https://www.npmjs.com/package/react-native-chat-sdk", "等同于\n稳定版"],
  ["Unity", "C-Sharp", "1.4.1", "-", "40b109c90294f288a22e382519bf3696", "2026-04-14", "/docs/document/unity/releasenote.html#v1-4-1-2026-4-14", "https://downloadsdk.easemob.com/downloads/SDK/Unity/Easemob/chat_unity_sdk1.4.1.unitypackage", "等同于\n稳定版"]
].map(([platform, language, version, packageName, md5, updateTime, releaseNote, downloadLink, remark]) => ({ platform, language, version, package: packageName, md5, updateTime, releaseNote, downloadLink, remark }));

const stableSDKDownloadInfo = [
  ["Android", "Java", "v4.16.1", "com.hyphenate.chat", "ac4acfa2647322352dba480373620ce7", "2025-11-12", "/docs/document/android/releasenote.html#v4-16-1-2025-11-12", "https://downloadsdk.easesdk.com/downloads/easemob-sdk-4.16.1.zip"],
  ["iOS", "Objective-C", "v4.16.2", "-", "f1d938dc7400237503c1e3cafaae6230", "2025-11-12", "/docs/document/ios/releasenote.html#v4-16-2-2025-11-12", "https://downloadsdk.easesdk.com/downloads/iOS_IM_SDK_V4.16.2.zip"],
  ["Web", "JavaScript", "v4.17.1", "-", "d049cb596fc4bf26b18023598276bcc8", "2025-12-12", "/docs/v4/web/releasenote.html#_4-17-1-2025-12-12", "https://downloads.easemob.com/downloads/WEB_SDK/4.17.1/websdk.zip"],
  ["HarmonyOS", "TypeScript", "v1.9.1", "@easemob/chatsdk", "7040be1d93257cd42979e38e20b0441c", "2026-07-08", "/docs/document/harmonyos/releasenote.html#v1-9-1", "https://downloadsdk.easesdk.com/downloads/HarmonySDK/chatsdk-1.9.1.har"],
  ["小程序", "TypeScript", "v4.17.1", "-", "5bcecdb40e3b2b2c8aab8c9983bf21a3", "2025-12-12", "/docs/v4/applet/releasenote.html#_4-17-1-2025-12-12", "https://downloads.easemob.com/downloads/WEB_SDK/4.１７．１/miniProgram.zip"],
  ["uni-app", "TypeScript", "v4.15.1", "-", "01bdccf3f9c2197c4822206f8f9b027c", "2025-06-09", "/docs/v4/applet/releasenote.html#_4-17-1-2025-12-12", "https://downloads.easemob.com/downloads/WEB_SDK/4.17.1/uniApp.zip"],
  ["Flutter", "Dart", "v4.19.3", "-", "-", "2026-06-12", "/docs/document/flutter/releasenote.html#_4-19-3-2026-6-12", "https://pub.dev/packages/im_flutter_sdk"],
  ["React Native", "TypeScript", "v1.15.2", "-", "-", "2026-06-02", "/docs/document/react-native/releasenote.html#v1-15-2-2026-06-02", "https://www.npmjs.com/package/react-native-chat-sdk"],
  ["Unity", "C-Sharp", "1.4.1", "-", "40b109c90294f288a22e382519bf3696", "2026-04-14", "/docs/document/unity/releasenote.html#v1-4-1-2026-4-14", "https://downloadsdk.easemob.com/downloads/SDK/Unity/Easemob/chat_unity_sdk1.4.1.unitypackage"]
].map(([platform, language, version, packageName, md5, updateTime, releaseNote, downloadLink]) => ({ platform, language, version, package: packageName, md5, updateTime, releaseNote, downloadLink }));
</script>

<style scoped>
.download-section { margin-top: 3rem; }
.download-section h2 { margin: 0 0 1rem; color: #242f3d; font-size: 2rem; }
.description { color: #505e72; line-height: 1.5; }
.compliance-card { width: 100%; box-sizing: border-box; margin: 1.5rem 0; padding: 1.25rem 1.5rem; border: 1px solid #dcecf7; border-radius: 0.5rem; background: #f5fbff; color: #303a48; line-height: 1.6; }
.compliance-title { margin-bottom: 0.75rem; font-size: 1.1rem; font-weight: 600; }
.compliance-card p { margin: 0.45rem 0; }
a { color: #2d85e9; }
</style>

# 内容审核计费说明

## 免费试用

**账户首次开通内容审核服务，可免费体验 7 天；体验期到期后，即开始正式计费。如账户欠费，将关停服务。**

- 默认的并发值：文本 160 QPS、图片 100 QPS、音频文件 40 QPS、视频文件 20 QPS 、音频流检测 300 路、视频流检测 200 路；
- 如需提升并发量上限，需联系商务，费用从提升当天开始计算。

## 计费方式

内容审核目前采取如下计费方式：

月结后付费：按自然月结算，每月 5 日扣除上一个自然月所产生的费用。

:::tip
当前页面仅支持数据存储在中国的数据中心，如果您是需要海外数据中心，如新加坡、美东、德国等，请参见 [海外内容审核价格说明文档](moderation_billing_overseas.html)。
:::

## 计费规则

**基础服务费用：288 元/月**

- 月底按模型使用量计算用量费用：
- 当用量费用低于基础服务费用，则当月按基础服务费用收取；
- 当用量费用高于基础服务费用，则当月按用量费用收取，不收基础服务费用。

以下为举例说明：

如月结算时，图片审核 50 万张，调用时均使用了涉政、色情、OCR 文字通用违规 3 个模型，则总消耗量为：涉政 50 万张，色情 50 万张，OCR 文字通用违规 50 万张： 
1、消耗用量费用 =50*15（涉政单价）+50*15（色情单价）+50*22.5（OCR 单价）= 2625 元 
2、用量费用 2625 元高于基础服务费用 288 元/月，则当月应付费用为 2625 元；

:::tip
假设用量费用为 100 元低于基础服务费用 288 元/月，则当月应付费用为 288 元。
:::

**审核模型单价如下：**

<table width="825" border="1">
  <tbody>
    <tr>
      <td width="91"><strong>数据类型</strong></td>
      <td width="547"><strong>审核模型</strong></td>
      <td width="71"><strong>单价</strong></td>
      <td width="88"><strong>单位</strong></td>
    </tr>
    <tr>
      <td>文本</td>
      <td>文本-通用违规（涉政&amp;违禁&amp;暴恐&amp;色情&amp;辱骂&amp;广告&amp;灌水&amp;无意义）</td>
      <td rowspan="7">15</td>
      <td>元/万条</td>
    </tr>
    <tr>
      <td rowspan="7">图片</td>
      <td>图片-涉政</td>
      <td rowspan="7">元/万张</td>
    </tr>
    <tr>
      <td>图片-暴恐</td>
    </tr>
    <tr>
      <td>图片-色情</td>
    </tr>
    <tr>
      <td>图片-广告</td>
    </tr>
    <tr>
      <td>图片-版权 LOGO</td>
    </tr>
    <tr>
      <td>图片-违禁</td>
    </tr>
    <tr>
      <td>图片-OCR 文字通用违规（涉政&amp;违禁&amp;暴恐&amp;色情&amp;辱骂&amp;广告）</td>
      <td>22.5</td>
    </tr>
    <tr>
      <td rowspan="2">音频文件</td>
      <td>音频-转译文本通用违规（涉政&amp;违禁&amp;暴恐&amp;色情&amp;辱骂&amp;广告）</td>
      <td>1.5</td>
      <td rowspan="2">元/小时</td>
    </tr>
    <tr>
      <td>音频-声音特征（娇喘）</td>
      <td>0.5</td>
    </tr>
    <tr>
      <td rowspan="9">视频文件</td>
      <td>视频-截帧图片涉政</td>
      <td rowspan="7">22.5</td>
      <td rowspan="7">元/万张</td>
    </tr>
    <tr>
      <td>视频-截帧图片暴恐</td>
    </tr>
    <tr>
      <td>视频-截帧图片色情</td>
    </tr>
    <tr>
      <td>视频-截帧图片广告</td>
    </tr>
    <tr>
      <td>视频-截帧图片版权 LOGO</td>
    </tr>
    <tr>
      <td>视频-截帧图片违禁</td>
    </tr>
    <tr>
      <td>视频-截帧图片 OCR 文字通用违规（涉政&amp;违禁&amp;暴恐&amp;色情&amp;辱骂&amp;广告）</td>
    </tr>
    <tr>
      <td>视频-音频转译文本通用违规（涉政&amp;违禁&amp;暴恐&amp;色情&amp;辱骂&amp;广告）</td>
      <td>1.5</td>
      <td rowspan="2">元/小时</td>
    </tr>
    <tr>
      <td>视频-音频声音特征（娇喘）</td>
      <td>0.5</td>
    </tr>
    <tr>
      <td rowspan="10">视频流</td>
      <td>视频流-截帧图片涉政</td>
      <td rowspan="8">22.5</td>
      <td rowspan="8">元/万张</td>
    </tr>
    <tr>
      <td>视频流-截帧图片暴恐</td>
    </tr>
    <tr>
      <td>视频流-截帧图片色情</td>
    </tr>
    <tr>
      <td>视频流-截帧图片广告</td>
    </tr>
    <tr>
      <td>视频流-截帧图片版权 LOGO</td>
    </tr>
    <tr>
      <td>视频流-截帧图片违禁</td>
    </tr>
    <tr>
      <td>视频流-截帧图片不良场景</td>
    </tr>
    <tr>
      <td>视频流-截帧图片 OCR 文字通用违规（涉政&amp;违禁&amp;暴恐&amp;色情&amp;辱骂&amp;广告）</td>
    </tr>
    <tr>
      <td>视频流-音频转译文本通用违规（涉政&amp;违禁&amp;暴恐&amp;色情&amp;辱骂&amp;广告）</td>
      <td>1.5</td>
      <td rowspan="2">元/小时</td>
    </tr>
    <tr>
      <td>视频流-音频声音特征（娇喘）</td>
      <td>0.5</td>
    </tr>
    <tr>
      <td rowspan="2">音频流</td>
      <td>音频流-转译文本通用违规（涉政&amp;违禁&amp;暴恐&amp;色情&amp;辱骂&amp;广告）</td>
      <td>1.5</td>
      <td rowspan="2">元/小时</td>
    </tr>
    <tr>
      <td>音频流-声音特征（娇喘）</td>
      <td>0.5</td>            
    </tr>
  </tbody>
</table>

相关文档：

[内容审核产品功能介绍官方文档](moderation_overview.html)。

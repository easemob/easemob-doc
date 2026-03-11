# 计费说明

环信推送服务提供免费版和专业版两个版本。其中，专业版区分为中国大陆境内和中国大陆境外两种服务区域。不同版本的计费模式与功能详情如下。

系统每月 1 日出推送服务账单，统计上月峰值 DAU（日活跃用户数）使用情况，并根据实际用量从账户余额中扣除相应费用。你可登录 [环信控制台](https://console.easemob.com/user/login)[查看费用详情](/product/console/account_center.html#查看消费账单)。

| 项目    | 免费版    | 专业版（中国大陆境内）     | 专业版（中国大陆境外）                                       |
| -------- | ---------- | ---------- | ----------------------- |
| 适用场景 | 适用于开发阶段或轻量级推送应用的测试与体验   | 适用于生产环境的规模化推送服务，按月峰值 DAU 阶梯计价 | 适用于生产环境的规模化推送服务，按月峰值 DAU 阶梯计价 |
| 计费模式 | 免费版支持 100 个注册用户，超出后自动按专业版计费 | 按月峰值 DAU 计费，750 元/1万 DAU（开通即包含 1万 DAU）           | 按月峰值 DAU 计费，388 元 / 1万 DAU（开通即包含 1万 DAU）  |

## 免费试用

| 价格 | 计费项     | 说明 |
| :----- | :------- | :------- |
| 免费  | - 推送日活：≤ 100 设备 <br/> - 推送速度：5 条/秒   | 适合开发测试或初期试运营阶段。|

## 套餐内订阅费用

| 价格 | 计费项     | 说明 |
| :--- | :----- | :------- |
| 750 元/月  | - 推送日活：≤ 10,000 设备（免费峰值） <br/> - 推送速度：10,000 条/秒   | 支持高并发业务场景，保障大规模用户实时触达。|

## 超出套餐费用

超出套餐部分按以下标准计费：

| 计费项   | 价格             | 说明                             |
| :------- | :--------------- | :------------------------------- |
| 推送日活 | 750 元/万/月 | 按超出套餐的推送日活用户数计费。 |

## 扩展功能

| 功能项       | 价格        | 说明                                                       |
| :----------- | :---------- | :--------------------------------------------------------- |
| 推送速度提升 | 150 元/月 | 每提升 1000 条/秒推送速度，收取 150 元/月，支持叠加购买。 |

## 欠费说明

余额不足时，环信PUSH将停服并发送通知邮件到注册邮箱，若您在停服后7天内未完成续费，环信PUSH将主动释放您在云上创建的应用，被释放的应用以及资源均不可恢复。

当账户余额不足时，环信推送服务将自动停止，并向你的注册邮箱发送欠费通知邮件。

若停服后 **7 天** 内仍未完成续费，系统将主动释放您在云端创建的应用。**请注意，应用及相关资源一旦被释放，将无法恢复。**

## 功能详情

<table width="936" border="1">
  <tbody>
    <tr>
      <td width="121" style="text-align: center">功 能</td>
      <td width="231" style="text-align: center">功能描述</td>
      <td width="149" style="text-align: center">免费版</td>
      <td width="206" style="text-align: center">专业版（中国大陆境内）</td>
      <td width="195" style="text-align: center">专业版（中国大陆境外）</td>
    </tr>
    <tr>
      <td rowspan="12" style="text-align: center">基础功能</td>
      <td style="text-align: left">应用管理</td>
      <td style="text-align: center">无限制</td>
      <td style="text-align: center">无限制</td>
      <td style="text-align: center">无限制</td>
    </tr>
    <tr>
      <td style="text-align: left">用户数限制</td>
      <td style="text-align: center">100</td>
      <td style="text-align: center">根据用户规模阶梯收费</td>
      <td style="text-align: center">根据用户规模阶梯收费</td>
    </tr>
    <tr>
      <td style="text-align: left">基础推送（通知&amp;透传）</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
    </tr>
    <tr>
      <td style="text-align: left">大文本/大图片</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
    </tr>
    <tr>
      <td style="text-align: left">启动应用/打开链接/打开特定页面</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
    </tr>
    <tr>
      <td style="text-align: left">全量用户推送</td>
      <td style="text-align: center">5次/分钟<br>
      发送量：100次/天</td>
      <td style="text-align: center">5次/分钟<br>
      发送量：100次/天</td>
      <td style="text-align: center">5次/分钟<br>
      发送量：100次/天</td>
    </tr>
    <tr>
      <td style="text-align: left">指定用户推送</td>
      <td style="text-align: center">600次/分钟，可扩展配置<br>
      发送量：不限</td>
      <td style="text-align: center">1200次/分钟，可扩展配置<br>
      发送量：不限</td>
      <td style="text-align: center">1200次/分钟，可扩展配置<br>
      发送量：不限</td>
    </tr>
    <tr>
      <td style="text-align: left">标签推送</td>
      <td style="text-align: center">600次/分钟，可扩展配置<br>
      发送量：不限</td>
      <td style="text-align: center">1200次/分钟，可扩展配置<br>
      发送量：不限</td>
      <td style="text-align: center">1200次/分钟，可扩展配置<br>
      发送量：不限</td>
    </tr>
    <tr>
      <td style="text-align: left">– –自定义标签</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
    </tr>
    <tr>
      <td style="text-align: left">– –用户当日设置标签次数</td>
      <td style="text-align: center">无限制</td>
      <td style="text-align: center">无限制</td>
      <td style="text-align: center">无限制</td>
    </tr>
    <tr>
      <td style="text-align: left">– –标签运算</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
    </tr>
    <tr>
      <td style="text-align: left">厂商通道（华为、小米、vivo、OPPO、魅族、APNs、FCM）</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
    </tr>
    <tr>
      <td rowspan="9" style="text-align: center">高级功能</td>
      <td style="text-align: left">角标</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
    </tr>
    <tr>
      <td style="text-align: left">自定义铃声</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
    </tr>
    <tr>
      <td style="text-align: left">推送策略选择</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
    </tr>
    <tr>
      <td style="text-align: left">– –环信通道优先，在线走环信，离线走厂商</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
    </tr>
    <tr>
      <td style="text-align: left">– –只通过第三方厂商推送</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
    </tr>
    <tr>
      <td style="text-align: left">– –在线或者离线都通过环信通道推送</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
    </tr>
    <tr>
      <td style="text-align: left">– –厂商通道优先，失败时走环信通道</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
    </tr>
    <tr>
      <td style="text-align: left">离线消息保存时长设置</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
    </tr>
    <tr>
      <td style="text-align: left">定时推送</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
    </tr>
    <tr>
      <td rowspan="4" style="text-align: center">应用数据报表</td>
      <td style="text-align: left">本月峰值DAU</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
    </tr>
    <tr>
      <td style="text-align: left">注册用户总数</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
    </tr>
    <tr>
      <td style="text-align: left">今日活跃用户数</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
    </tr>
    <tr>
      <td style="text-align: left">今日新增用户数</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
    </tr>
    <tr>
      <td rowspan="6" style="text-align: center">数据与统计</td>
      <td style="text-align: left">推送目标数</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
    </tr>
    <tr>
      <td style="text-align: left">推送成功数</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
    </tr>
    <tr>
      <td style="text-align: left">推送状态</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
    </tr>
    <tr>
      <td style="text-align: left">厂商通道占比</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
    </tr>
    <tr>
      <td style="text-align: left">送达率（环信、华为、小米、vivo、OPPO、魅族、APNs、FCM）</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
    </tr>
    <tr>
      <td style="text-align: left">点击率（环信、华为、小米、vivo、OPPO、魅族、APNs、FCM）</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
    </tr>
    <tr>
      <td style="text-align: center">demo</td>
      <td style="text-align: left">Android、iOS端demo</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
    </tr>
    <tr>
      <td rowspan="7" style="text-align: center">技术支持</td>
      <td style="text-align: left">产品咨询企业微信群</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
    </tr>
    <tr>
      <td style="text-align: left">工单通道</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
    </tr>
    <tr>
      <td style="text-align: left">系统上线与大促护航服务</td>
      <td style="text-align: center">❌</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
    </tr>
    <tr>
      <td style="text-align: left">专属支持微信群</td>
      <td style="text-align: center">❌</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
    </tr>
    <tr>
      <td style="text-align: left">专属服务经理支持</td>
      <td style="text-align: center">❌</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
    </tr>
    <tr>
      <td style="text-align: left">专属技术专家支持</td>
      <td style="text-align: center">❌</td>
      <td style="text-align: center">✅</td>
      <td style="text-align: center">✅</td>
    </tr>
    <tr>
      <td style="text-align: left">客户支持</td>
      <td style="text-align: center">5*8 小时</td>
      <td style="text-align: center">7*12 小时</td>
      <td style="text-align: center">7*12 小时</td>
    </tr>
  </tbody>
</table>
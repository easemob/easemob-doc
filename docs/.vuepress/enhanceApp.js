import { Message, Loading } from 'element-ui';
import 'element-ui/lib/theme-chalk/loading.css';
import 'element-ui/lib/theme-chalk/icon.css';
import 'element-ui/lib/theme-chalk/message.css';
import './public/prism.js';
import './public/prism.css';

export default ({
  Vue, // VuePress 正在使用的 Vue 构造函数
}) => {
  // ...做一些其他的应用级别的优化
  Vue.prototype.$message = Message;
  Vue.prototype.$loading = Loading.service;
}
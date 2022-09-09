import CodeCopy from './CodeCopy';
import Vue from 'vue';
import './style.css';

export default {
  updated() {
    this.update();
  },
  methods: {
    update() {
      // 防止阻塞
      setTimeout(() => {
        document.querySelectorAll(selector).forEach(el => {
          if (el.classList.contains('code-copy-added')) return;

          let ComponentClass = Vue.extend(CodeCopy);
          let instance = new ComponentClass();

          let options = {};
          instance.options = {...options};
          instance.code = el.innerText
          instance.parent = el
          instance.$mount()
          el.classList.add('code-copy-added')
          el.appendChild(instance.$el)
        })
      }, 100);
    }
  }
}
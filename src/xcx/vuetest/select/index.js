import Vue from 'vue'
import App from './app'
import i18n from 'lang'
import 'assets/css/sticky-footer.css'
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(Element);
new Vue({ // eslint-disable-line
  el: '#app',
  i18n,
  render: h => h(App)
})

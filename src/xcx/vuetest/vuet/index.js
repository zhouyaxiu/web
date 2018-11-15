import Vue from 'vue'
import App from './app'
import Router from 'vueRouter'
import vuet from 'vuet'
Vue.use(Router)
new Vue({ // eslint-disable-line
  el: '#app',
  router,
  vuet,
  render: h => h(App)
})

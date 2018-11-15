import Vue from 'vue'
import VueRouter from 'vueRouter'
import routes from './routes'
import App from './app'
import 'assets/css/sticky-footer.css'
import i18n from 'lang'

const router = new VueRouter({routes})

new Vue({ // eslint-disable-line
  el: '#app',
  i18n,
  router,
  render: h => h(App)
})

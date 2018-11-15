import Vue from 'vue'
import VueRouter from 'vueRouter'
import App from './app'
import routes from './routes'
import 'assets/css/sticky-footer.css'
import i18n from 'lang'

const router = new VueRouter({routes})

new Vue({ // eslint-disable-line
  el: '#app',
  router,
  i18n,
  render: h => h(App)
})

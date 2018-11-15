import Vue from 'vue'
import App from './app'
import i18n from 'lang'

new Vue({ // eslint-disable-line
  el: '#app',
  i18n,
  render: h => h(App)
})

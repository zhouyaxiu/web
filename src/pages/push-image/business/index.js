import Vue from 'vue'
import 'assets/css/waveform-playlist.css'
import i18n from 'lang'
import App from './app'

new Vue({ // eslint-disable-line
  el: '#app',
  i18n,
  render: h => h(App)
})

import Vue from 'vue'
import App from './app'
import i18n from 'lang'
import 'assets/css/waveform-playlist.css'

new Vue({ // eslint-disable-line
  el: '#app',
  i18n,
  render: h => h(App)
})

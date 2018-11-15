import Vue from 'vue'
import App from './app'
import 'assets/css/sticky-footer.css'
import 'assets/css/waveform-playlist.css'
import i18n from 'lang'

new Vue({ // eslint-disable-line
  el: '#app',
  i18n,
  render: h => h(App)
})

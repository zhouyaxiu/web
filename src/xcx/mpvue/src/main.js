import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

export default {
  config: {
    pages: [
      "pages/login/main",
      "^pages/index/main",
      "pages/logs/main",
      "pages/counter/main"
    ],
    window: {
      backgroundTextStyle: 'light',
      backgroundColor: '#f9f9f9',
      navigationBarBackgroundColor: '#FAFAFA',
      navigationBarTitleText: 'iView Weapp',
      navigationBarTextStyle: 'black'
    }
  }
}
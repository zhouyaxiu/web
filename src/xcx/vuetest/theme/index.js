import Vue from 'vue'
import App from './app'
import Router from 'vueRouter'
import Element from 'element-ui';
import enLocale from 'element-ui/lib/locale/lang/en';
import zhLocale from 'element-ui/lib/locale/lang/zh-CN';
import VueI18n from 'vue-i18n';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(Router);
Vue.use(VueI18n);
Vue.use(Element);
if (!window.VueRouter) Vue.use(VueRouter);

const router = new Router({
  routes: [
    {
      path: '/zh-CN',
      component(resolve) {
        require.ensure(['./App.vue'], () => {
          resolve(require('./App.vue'));
        })
      },
      children: [
        {
          path: '/zh-CN',
          name: 'cn',
          component(resolve) {
            require.ensure(['./App.vue'], () => {
              resolve(require('./App.vue'));
            })
          },
        },
        {
          path: '/en-US',
          name: 'en',
          component(resolve) {
            require.ensure(['./App.vue'], () => {
              resolve(require('./App.vue'));
            })
          },
        },
        { path: '*', redirect: '/' }
      ],
    }
  ]
})
Vue.config.lang = 'zh-cn';
// Vue.locale('zh-cn', zhLocale);
// Vue.locale('en', enLocale);
new Vue({ // eslint-disable-line
  el: '#app',
  Router,
  router,
  render: h => h(App)
})

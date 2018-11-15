import Vue from 'vue'
import App from './app'
import i18n from 'lang'
import infiniteScroll from 'vue-infinite-scroll'
import Router from 'vueRouter'
import store from './vuex/store'
import VueLazyload from 'vue-lazyload'
// import welcome from './components/welcome'
// import welfare from './components/welfare'
// import android from './components/android'
// import ios from './components/ios'


Vue.use(Router)
Vue.use(infiniteScroll)
Vue.use(VueLazyload)
const routes = [
  {
    path: '/welcome',
    component: './components/welcome'
  },
  {
    path: '/welfare',
    component: './components/welfare'
  },
]
// require.ensure 是 Webpack 的特殊语法，用来设置 组件到底路径
/**
 * 1.定义路由，每个路由应该映射一个组件
 * path : 浏览器的显示的路径
 * name ： 路由的名字
 * component : 路由的组件路径
 */
// const router= new Router({
//   // mode:'history',
//   routes:[
//     {
//       path:'/',
//       component:welcome
//     },
//     {
//       path:'/welcome',
//       name:'welcome',
//       component:welcome
//     },
//     {
//       path:'/welfare',
//       name:'welfare',
//       component:welfare
//     },
//     {
//       path:'/android',
//       name:'android',
//       component:android
//     },
//     {
//       path:'/ios',
//       name:'ios',
//       component:ios
//     }
//   ]
// })
//按需加載
const router = new Router({
  routes: [
    {
      path: '/',
      component(resolve) {
        require.ensure(['./App.vue'], () => {
          resolve(require('./App.vue'));
        })
      },
      children: [
        {
          path: '/welcome',
          name: 'welcome',
          component(resolve) {
            require.ensure(['./components/welcome'], () => {
              resolve(require('./components/welcome'));
            })
          },
        },
        {
          path: '/welfare',
          name: 'welfare',
          component(resolve) {
            require.ensure(['./components/welfare'], () => {
              resolve(require('./components/welfare'));
            })
          },
        },
        {
          path: '/android',
          name: 'android',
          component(resolve) {
            require.ensure(['./components/android'], () => {
              resolve(require('./components/android'));
            })
          },
        },
        {
          path: '/ios',
          name: 'ios',
          component(resolve) {
            require.ensure(['./components/ios'], () => {
              resolve(require('./components/ios'));
            })
          },
        },
      ]
    },
  ]
})
new Vue({ // eslint-disable-line
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(App)
})

import Vue from 'vue';
import Vuex from 'vuex';
// import * as actions from './actions';
// import * as getters from './getters';
import * as uz from './../common/uz';
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    'loadingShow': false,
    "menus": uz.NAME_TITLE,
    // "menus": ['welfare', 'day', 'android', 'ios', 'web'],
    'headerTitle': '福利',
    'menuShow': true
  },
  mutations: {
    UPDATE_LOADING(state, data) {
      state.loadingShow = data;
    },
    UPDATE_MENUSHOW(state) {
      state.menuShow = !state.menuShow;
    },
    UPDATE_TITLE(state, title) {
      state.headerTitle = title
    }
  }
})
export default store
// const state = {
//     'loadingShow': false,
//     "menus": uz.NAME_TITLE,
//     'headerTitle': '福利'
// }
// const mutations = {
//     UPDATE_LOADING(state, data) {
//         state.loadingShow = data;
//     },
//     UPDATE_MENUSHOW(state) {
//         state.menuShow = !state.menuShow;
//     }
// };
// export default new Vuex.Store({
//     state,
//     mutations,
//     actions,
//     getters
// })
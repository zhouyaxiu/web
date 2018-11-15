<template>
  <ul class="list-group">
    <li class="list-group-item" v-for="navH1 in navCon" :key="navH1" v-if="result(navH1.titleH1)">
      <h5>{{navH1.titleH1}}</h5>
      <ul class="list-group">
        <li class="list-group-item list-group-item-action" style="border:none" v-for="navH2 in navH1.titleH2" :key="navH2">
          <router-link style="text-decoration:none;" :to="navH2.router">{{navH2.title}}</router-link>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
import bus from './eventBus.js'
export default {
  name: 'app',
  props: {
    navCon: Array
  },
  data () {
    return {
      userName: ''
    }
  },
  computed: {
    result () {
      const vm = this
      return (name) => {
        let status = false
        // 判断权限
        if (name === '审核') {
          // 与header通信获取username
          bus.$on('user', (user) => {
            vm.userName = user.username
          })
          if (vm.userName === 'QyCq7ltUMJZF7wIC') {
            status = true
          }
        } else {
          status = true
        }
        console.log(status)
        return status
      }
    }
  }
}
</script>

<style>
</style>

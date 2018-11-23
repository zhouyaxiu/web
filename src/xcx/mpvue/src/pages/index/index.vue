<template>
  <div>
    <i-cell-group  v-for="(item,index) in projects" :key="index">
      <i-cell :title="item.abstract" :label="item.id" is-link :url="'/pages/task_detail/main?taskid='+item.id">
      </i-cell>
    </i-cell-group>
  </div>
</template>

<script>
import app from '../../App.vue'
export default {
  data () {
    return {
      projects: []
    }
  },

  methods: {
    handleReachBottom () {
      return new Promise(resolve => {
        setTimeout(() => {
          const last = this.list1[this.list1.length - 1]
          for (let i = 1; i < 11; i++) {
            this.list1.push(last + i)
          }
          resolve()
        }, 2000)
      })
    },
    filterSopType: (tasklist) => {
      var tmp = []
      for (var k in tasklist) {
        if (tasklist[k].sopType.indexOf('COLLECT') !== -1 ||
          tasklist[k].sopType.indexOf('TEXTTRANS') !== -1) {
          tmp.push(tasklist[k])
        }
      }
      return tmp
    },
    getProject () {
      // 调用登录接口
      wx.request({
        url: 'https://www.fanhantech.com/api/projects',
        method: 'get',
        header: app.globalData.header,
        success: (response) => {
          this.projects = this.filterSopType(response.data.projects)
        },
        fail: (response) => {
          wx.showToast({
            title: '获取任务失败',
            duration: 1500
          })
        }
      })
    }
  },

  onLoad () {
    // 调用应用实例的方法获取全局数据
    this.getProject()
  }
}
</script>

<style scoped>

</style>

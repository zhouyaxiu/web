<template>
  <div>
    <i-cell-group>
      <i-cell :title="project.abstract" :label="project.id"></i-cell>
    </i-cell-group>
    <i-panel title="标题">
      <view style="padding: 15px;">{{project.abstract}}</view>
    </i-panel>
    <i-panel title="规则">
      <!-- <a style="padding: 15px;" :href="project.taskProfile.ruleSrc"></a> -->
      <!-- <a style="padding: 15px;" :href="https://s301.fanhantech.com/descrpition/JFOFhX6Vhi2v6lWIvUqnAkSgt8xCeh0r.pdf"></a> -->
    </i-panel>
     <rich-text :nodes="nodes" bindtap="tap"></rich-text>
     <embed src="https://s301.fanhantech.com/descrpition/JFOFhX6Vhi2v6lWIvUqnAkSgt8xCeh0r.pdf" type="application/pdf" width="100%" height="100%">  
  </div>
</template>

<script>
import app from '../../App.vue'
const PDF =require('./pdfobject.min.js')
export default {
  data () {
    return {
      project: {},
      taskid:'',
      active:true,
      nodes:"<a href='https://s301.fanhantech.com/descrpition/JFOFhX6Vhi2v6lWIvUqnAkSgt8xCeh0r.pdf'>465</a>"
    }
  },

  methods: {
    binddivTap () {
      const url = '../logs/main'
      wx.navigateTo({ url })
    },
    getProjectInfo () {
      // 调用登录接口
      var that = this
      wx.request({
      url: "https://www.fanhantech.com/api/projects/" + that.taskid,
      method: "GET",
      header: app.globalData.header,
      success: function(response) {
        console.log(response)
        if (response.data === false) {
          wx.showToast({
            title: '获取任务失败',
            icon: 'none',
            duration: 1000
          });
        } else {
          that.project=response.data.project
        }
      },
      fail: function(response) {
        wx.showToast({
          title: 'error',
          icon: 'none',
          duration: 1000
        })
      }
    })
    }
  },

  onLoad (options) {
    new PDF({ url: "https://s301.fanhantech.com/descrpition/JFOFhX6Vhi2v6lWIvUqnAkSgt8xCeh0r.pdf" }).embed()
    this.taskid = options.taskid
    console.log(PDF,'pdf')
    // let url='https://s301.fanhantech.com/descrpition/JFOFhX6Vhi2v6lWIvUqnAkSgt8xCeh0r.pdf'
    // PDF.getDocument(url).then(function (pdf) {
    //   console.log(pad,'pfdf')
    //   // this.pdfDoc = pdf
    //   // this.renderPage(1)
    // })
    // 调用应用实例的方法获取全局数据
    this.getProjectInfo()
  }
}
</script>

<style scoped>

</style>

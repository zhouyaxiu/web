<template>
<div class="main">
  <Header/>
  <div class="card" style="max-width:1000px">
    <!-- <div class="card-header">
      <div class="d-flex">
        <div class="d-inline-block" style="font-size:1.2rem;">组图任务</div>
      </div>
    </div> -->
    <div class="card-body">
      <Group001 ref="Template"
        :wholeQues="wholeQues"
        :itemQues="itemQues"
        @postTask="postTask"
        CommentVisible=true
        CommentReadOnly=false
        PostButtonVisible=false
      >
        <el-button type="primary" @click="acceptTask">通过</el-button>
        <el-button type="primary" @click="rejectTask">拒绝</el-button>
        <el-button type="primary" @click="reviseAndacceptTask">提交并通过</el-button>
      </Group001>
    </div>
  </div>
  <Footer/>
</div>
</template>

<script>
import Header from 'components/header'
import Footer from 'components/footer'
import axios from 'axios'
// import $ from 'jquery'
import Group001 from 'template/group/Group001'

let http = axios.create()
export default {
  name: 'app',
  data () {
    return {
      wholeQues: [],
      itemQues: [],
      datas: [],
      projectId: '',
      uuid: ''
    }
  },
  components: {
    Header,
    Footer,
    Group001
  },
  mounted: function () {
    let vm = this
    this.$nextTick(function () {
      // get current page project id
      let projectId = document.location.pathname.split('/')[2]
      // projectId = 'p4rFljel001'
      if (projectId !== '') {
        vm.projectId = projectId
      }
      let url = '/api/projects/' + projectId + '/pageCfg'
      http.get(url).then(function (response) {
        let rsp = response.data
        if (rsp.code === 0) {
          if (rsp.SopType) {
            vm.SopType = rsp.SopType
          }
          if (rsp.wholeQues) {
            vm.wholeQues = rsp.wholeQues
          }
          if (rsp.itemQues) {
            vm.itemQues = rsp.itemQues
          }
          vm.$nextTick(function () {
            vm.getTask()
          })
        } else {
          console.log('code not 0??')
          vm.$notify.error({
            title: '失败',
            message: rsp.message,
            duration: 2000
          })
        }
      })
        .catch(function (error) {
          console.log(error)
        })
    })
  },
  methods: {
    // 错误提示
    notify (type, message, duration) {
      let vm = this
      if (type === 'success') {
        vm.$notify.success({
          title: '成功',
          message: message,
          duration: duration
        })
      } else if (type === 'error') {
        vm.$notify.error({
          title: '失败',
          message: message,
          duration: duration
        })
      }
    },
    // 获取图片数据
    getTask () {
      const vm = this
      let url = '/api/projects/' + vm.projectId + '/task/review' + window.location.search
      // url = '/api/projects/' + vm.projectId + '/task/review' + '?taskid=p4rFljel001&uuid=I5W0zNtUrSsbJaIJkAWuyNBA0ri5Ce5m&status=1001999'
      http.get(url)
        .then(function (response) {
          const rsp = response.data
          if (rsp.code === 0) {
            let question = rsp.questions[0]
            // vm.datas = question.datas
            vm.uuid = question.uuid
            console.log(question)
            let submitdata = JSON.parse(question.res)
            vm.$refs.Template.load(question.datas, submitdata, question.comment)
          } else {
            vm.notify('error', rsp.message, 2000)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    acceptTask () {
      let vm = this
      let url = '/api/projects/' + vm.projectId + '/task/review' + window.location.search
      // url = '/api/projects/' + vm.projectId + '/task/review' + '?taskid=p4rFljel001&uuid=I5W0zNtUrSsbJaIJkAWuyNBA0ri5Ce5m&status=1001999'
      if (!vm.$refs.Template.valid()) {
        vm.$notify.error({
          title: '失败',
          message: '请检查所有标注是否都已完成',
          duration: 2000
        })
        return
      }
      http.post(url, {
        accept: true,
        comment: '通过'
      })
        .then(function (response) {
          let rsp = response.data
          if (rsp.code === 0) {
            vm.$notify.success({
              title: '成功',
              message: rsp.message,
              duration: 2000
            })
            // 通过refresh页面获取下一个任务
            setTimeout(() => {
              // window.location.href="/projects/"+projectId+"/task/reviews"
              // window.close()
            }, 2000)
          } else {
            vm.$notify.error({
              title: '失败',
              message: rsp.message,
              duration: 2000
            })
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    rejectTask () {
      let vm = this
      let url = '/api/projects/' + vm.projectId + '/task/review' + window.location.search
      // url = '/api/projects/' + vm.projectId + '/task/review' + '?taskid=p4rFljel001&uuid=I5W0zNtUrSsbJaIJkAWuyNBA0ri5Ce5m&status=1001999'
      http.post(url, {
        accept: false,
        comment: vm.$refs.Template.getComment()
      })
        .then(function (response) {
          let rsp = response.data
          console.log(rsp)
          if (rsp.code === 0) {
            vm.$notify.success({
              title: '成功',
              message: rsp.message,
              duration: 2000
            })
            // 通过refresh页面获取下一个任务
            setTimeout(() => {
              // window.location.href="/projects/"+projectId+"/task/reviews"
              // window.close()
            }, 2000)
          } else {
            vm.$notify.error({
              title: '失败',
              message: rsp.message,
              duration: 2000
            })
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    reviseAndacceptTask () {
      let vm = this
      let url = '/api/projects/' + vm.projectId + '/task/revise' + window.location.search
      // url = '/api/projects/' + vm.projectId + '/task/revise' + '?taskid=p4rFljel001&uuid=I5W0zNtUrSsbJaIJkAWuyNBA0ri5Ce5m&status=1001999'
      // vm.save()
      if (!vm.$refs.Template.valid()) {
        vm.$notify.error({
          title: '失败',
          message: '请检查所有标注是否都已完成',
          duration: 2000
        })
        return
      }
      let result = vm.$refs.Template.getResult()
      http.post(url, {
        id: vm.projectId,
        uuid: vm.uuid,
        // result: this.submit
        result: JSON.stringify(result)
      })
        .then(function (response) {
          let rsp = response.data
          // console.log(rsp)
          if (rsp.code === 0) {
            vm.acceptTask()
          } else {
            vm.$notify.error({
              title: '失败',
              message: rsp.message,
              duration: 2000
            })
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
}
</script>

<style scoped>
  .card{
    width: 75%;
    margin: 0 auto 50px;
    display: inline-block;
  }
  .card-body{
    background: #f8f8f8;
  }
</style>

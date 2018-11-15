<template>
<div id="main" ref="container">
  <Header/>
    <div style="flex: 1 0 auto;display: flex;">
      <Text001 v-if="templet==1" ref="Template"
        :SopType="SopType"
        :wholeRadios="wholeRadios"
        :wholeCheckBoxs="wholeCheckBoxs"
        :wholeInputs="wholeInputs"
        :itemRadios="itemRadios"
        :itemCheckBoxs="itemCheckBoxs"
        :itemInputs="itemInputs"
        CommentVisible=true
        CommentReadOnly=false
        PostButtonVisible=false
      >
        <el-button type="success" @click="acceptTask">通过</el-button>
        <el-button type="danger" @click="rejectTask">拒绝</el-button>
        <el-button type="primary" @click="reviseAndacceptTask">提交并通过</el-button>
        <!-- <el-button id="test" type="primary" @click="test">测试</el-button> -->
      </Text001>
      <!-- 目前有个bug, text002模板必须在container显示的状态下初始化，否则canvas会出现定位错误 -->
      <Text002 v-if="templet==2" ref="Template"
        :SopType="SopType"
        :wholeRadios="wholeRadios"
        :wholeCheckBoxs="wholeCheckBoxs"
        :wholeInputs="wholeInputs"
        :itemRadios="itemRadios"
        :itemCheckBoxs="itemCheckBoxs"
        :itemInputs="itemInputs"
        CommentVisible=true
        CommentReadOnly=false
        PostButtonVisible=false
      >
        <el-button type="success" @click="acceptTask">通过</el-button>
        <el-button type="danger" @click="rejectTask">拒绝</el-button>
        <el-button type="primary" @click="reviseAndacceptTask">提交并通过</el-button>
        <!-- <el-button id="test" type="primary" @click="test">测试</el-button> -->
      </Text002>
    </div>
    <div class="message load-icon-box" v-show="progStatus === true">
       <i class="el-icon-loading"></i>
    </div>
  <Footer/>
</div>
</template>

<script >
import axios from 'axios'
import Header from 'components/header'
import Footer from 'components/footer'
import Text001 from 'template/text/Text001'
import Text002 from 'template/text/Text002'
import $ from 'jquery'

var http = axios.create({
  headers: {'X-Xsrftoken': $('meta[name=_xsrf]').attr('content')}
})
export default {
  name: 'app',
  components: {
    Header,
    Footer,
    Text001,
    Text002
  },
  data () {
    return {
      projectId: '',
      templet: 1,
      wholeRadios: [], // 整图单选题
      wholeCheckBoxs: [], // 整图多选题
      wholeInputs: [], // 整图填空题
      itemRadios: [], // 标注项单选题
      itemCheckBoxs: [], // 标注项多选题
      itemInputs: [], // 标注项填空题
      SopType: 1001,
      question: {},
      progStatus: false
    }
  },
  mounted: function () {
    let vm = this
    this.$nextTick(function () {
      // get current page project id
      let projectId = document.location.pathname.split('/')[2]
      // let projectId = 'qHVDEPTm001'
      if (projectId !== '') {
        vm.projectId = projectId
      }
      let url = '/api/projects/' + vm.projectId + '/pageCfg'
      http.get(url).then(function (response) {
        let rsp = response.data
        if (rsp.code === 0) {
          if (rsp.SopType) {
            vm.SopType = rsp.SopType
          }

          if (rsp.wholeCfg) {
            let wholeCfg = rsp.wholeCfg
            if (wholeCfg.tagMutexLabels) {
              vm.wholeRadios = wholeCfg.tagMutexLabels
            }
            if (wholeCfg.tagNormalLabels) {
              vm.wholeCheckBoxs = wholeCfg.tagNormalLabels
            }
            if (wholeCfg.TextInputs) {
              vm.wholeInputs = wholeCfg.TextInputs
            }
          }
          if (rsp.itemCfg) {
            let itemCfg = rsp.itemCfg
            if (itemCfg.tagMutexLabels) {
              vm.itemRadios = itemCfg.tagMutexLabels
            }
            if (itemCfg.tagNormalLabels) {
              vm.itemCheckBoxs = itemCfg.tagNormalLabels
            }
            if (itemCfg.TextInputs) {
              vm.itemInputs = itemCfg.TextInputs
            }
          }
          if (rsp.templet) {
            vm.templet = rsp.templet
          }
          vm.$nextTick(function () {
            vm.gettask()
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
    gettask: function () {
      let vm = this
      let url = '/api/projects/' + vm.projectId + '/task/review' + window.location.search
      // let url = '/api/projects/' + vm.projectId + '/task/review' + window.location.search + '?taskid=qHVDEPTm001&uuid=6uOECjkL77QG7YE86SAQtio50ZQP69e9&status=1001999'
      vm.progStatus = true
      $.ajax({
        url: url,
        type: 'GET', // GET
        async: false, // 或false,是否异步
        timeout: 5000, // 超时时间
        dataType: 'json', // 返回的数据格式：
        beforeSend: function (xhr) {},
        success: function (data, textStatus, jqXHR) {
          let rsp = data
          if (rsp.code === 0) {
            vm.question = rsp.questions[0]
            // console.log(vm.question)
            let submitdata = JSON.parse(vm.question.prev)
            // img.src = vm.question.raw
            vm.$refs.Template.load(vm.question.raw, submitdata, vm.question.comment)
          } else {
            vm.$notify.error({
              title: '失败',
              message: rsp.message,
              duration: 2000
            })
          }
          vm.progStatus = false
        },
        error: function (xhr, textStatus) {
          vm.progStatus = false
        },
        complete: function () {},
        headers: {
          'X-Xsrftoken': $('meta[name=_xsrf]').attr('content')
        }
      })
      console.log(vm.question)
    },
    acceptTask () {
      let vm = this
      let url = '/api/projects/' + vm.projectId + '/task/review' + window.location.search
      // let url = '/api/projects/' + vm.projectId + '/task/review' + '?taskid=image001&uuid=J250BiZvpifVr4K7e6lmDmfVV7JdArAS&status=1001999'
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
      // let url = '/api/projects/' + vm.projectId + '/task/review' + '?taskid=image001&uuid=J250BiZvpifVr4K7e6lmDmfVV7JdArAS&status=1001999'
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
      // let url = '/api/projects/' + vm.projectId + '/task/revise' + '?taskid=image001&uuid=J250BiZvpifVr4K7e6lmDmfVV7JdArAS&status=1001999'
      // vm.save()
      let result = vm.$refs.Template.getResult()
      http.post(url, {
        id: vm.question.id,
        uuid: vm.question.uuid,
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

<style>
html, body, #main {
    height: 100%;
}
body, #main {
  display: flex;
  flex-direction: column;
}
body {
  padding-top: 80px;
  background-color: #f0f2f5;
}

.message {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1050;
}
.load-icon-box {
  display: flex;
  justify-content: center;
  align-items: center;
}

.load-icon-box > i {
  font-size: 2rem;
  color: #fff;
}
</style>

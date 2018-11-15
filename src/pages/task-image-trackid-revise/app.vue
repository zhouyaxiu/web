<template>
<div id="main" ref="container">
  <Header/>
    <Image006 v-if="templet==1" ref="Template"
      :SopType="SopType"
      :rectMinH="rectMinH"
      :rectMinW="rectMinW"
      :rectMinArea="rectMinArea"
      :PostButtonVisible="false"
      :CommentVisible="true"
      :CommentReadOnly="true"
    >
      <el-button type="primary" id="revise" @click="reviseTask">修改并提交</el-button>
      <el-button v-if="reportBtnStatus === true" type="primary" @click="openReportDiv">申诉</el-button>
      <!-- <el-button id="test" type="primary" @click="test">测试</el-button> -->
    </Image006>

    <div class="message load-icon-box" v-show="progStatus === true">
       <i class="el-icon-loading"></i>
    </div>

    <Complain ref="Complain" v-if="reportBtnStatus === true"
      :helpinfo="helpinfo"
      :dialogTableVisible="reportDivStatus"
      @report="report"
    ></Complain>

  <Footer/>
</div>
</template>

<script >
import axios from 'axios'
import Header from 'components/header'
import Footer from 'components/footer'
import Image006 from 'template/image/Image006'
import Complain from 'lib/complain/Complain'
import helpinfo from './help-info'
import $ from 'jquery'

var http = axios.create({
  headers: {'X-Xsrftoken': $('meta[name=_xsrf]').attr('content')}
})
export default {
  name: 'app',
  components: {
    Header,
    Footer,
    Image006,
    Complain
  },
  data () {
    return {
      projectId: '',
      templet: 1,
      rectMinH: 20, // 矩形最小高
      rectMinW: 20, // 矩形最小宽
      rectMinArea: 400, // 矩形最小面积
      SopType: 1001,
      question: {},
      progStatus: false,
      helpinfo: helpinfo,
      reportDivStatus: false,
      reportBtnStatus: false,
      request: '',
      vQuesDo: [], // 标注项填空题
      vQuesCheck: [], // 标注项填空题
      vflag: 1,
      TagDisabled: false,
      // 不会修改这里面的内容，直接传递
      vQuesCheckContents: []
    }
  },
  mounted: function () {
    let vm = this
    this.$nextTick(function () {
      // get current page project id
      let projectId = document.location.pathname.split('/')[2]
      // projectId = 'RLeKdZeJ001'
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
          if (rsp.templet) {
            vm.templet = rsp.templet
          } else {
            // 兼容代码，之前发布的项目中无templet
            if (vm.SopType === 1005) {
              vm.templet = 2
            }
          }

          if (rsp.Restrictions) {
            if (rsp.Restrictions.ImgRest) {
              let rest = rsp.Restrictions.ImgRest
              vm.rectMinH = rest.rectMinH
              vm.rectMinW = rest.rectMinW
              vm.rectMinArea = rest.rectMinArea
            }
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
    openReportDiv: function () {
      this.$refs.Complain.show()
    },
    // 申诉
    report: function (reason) {
      let vm = this
      console.log(reason)
      let url = '/api/projects/' + vm.projectId + '/task/report' + window.location.search
      // url = '/api/projects/' + vm.projectId + '/task/report' + '?taskid=RLeKdZeJ001&uuid=z5nJg6DH63u9cPhffR4YnuuW8MbXhs00&status=1001999'
      http.post(url, {
        checkres: vm.question.checkres,
        checkuser: vm.question.checkuser,
        reportmsg: reason
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
            vm.$refs.Complain.close()
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
    gettask: function () {
      let vm = this
      let url = '/api/projects/' + vm.projectId + '/task/review' + window.location.search
      // url = '/api/projects/' + vm.projectId + '/task/review' + '?taskid=RLeKdZeJ001&uuid=z5nJg6DH63u9cPhffR4YnuuW8MbXhs00&status=1001999'
      vm.progStatus = true
      // 同步请求，	获取上传的token
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
            if (vm.question.checkres && vm.question.checkres < 0) {
              vm.reportBtnStatus = true
            }
            let imgdatas = vm.question.imgdatas
            vm.$refs.Template.imageload(imgdatas, vm.question.comment)
            console.log(imgdatas)
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
    reviseTask () {
      let vm = this
      let url = '/api/projects/' + vm.projectId + '/task/revise' + window.location.search
      // url = '/api/projects/' + vm.projectId + '/task/revise' + '?taskid=RLeKdZeJ001&uuid=z5nJg6DH63u9cPhffR4YnuuW8MbXhs00&status=1001999'
      let result = vm.$refs.Template.getResult()
      http.post(url, {
        id: vm.question.id,
        uuid: vm.question.uuid,
        // result: this.submit
        result: '{}',
        imgdatas: result
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
    close () {
      this.templet = 1
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

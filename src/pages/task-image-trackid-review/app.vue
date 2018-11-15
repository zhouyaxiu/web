<template>
<div id="main" ref="container">
  <Header/>
    <Image006 ref="Template"
      :SopType="SopType"
      :rectMinH="rectMinH"
      :rectMinW="rectMinW"
      :rectMinArea="rectMinArea"
      :PostButtonVisible="false"
      :CommentVisible="true"
    >
      <el-button type="primary" @click="acceptTask">通过</el-button>
      <el-button type="primary" @click="rejectTask">拒绝</el-button>
      <el-button type="primary" @click="reviseAndacceptTask">提交并通过</el-button>
    </Image006>
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
import Image006 from 'template/image/Image006'
import $ from 'jquery'

var http = axios.create({
  headers: {'X-Xsrftoken': $('meta[name=_xsrf]').attr('content')}
})
export default {
  name: 'app',
  components: {
    Header,
    Footer,
    Image006
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
      progStatus: false
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
    gettask: function () {
      let vm = this
      let url = '/api/projects/' + vm.projectId + '/task/review' + window.location.search
      // let url = '/api/projects/' + vm.projectId + '/task/review' + '?taskid=RLeKdZeJ001&uuid=z5nJg6DH63u9cPhffR4YnuuW8MbXhs00&status=1001999'
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
    },
    acceptTask () {
      let vm = this
      let url = '/api/projects/' + vm.projectId + '/task/review' + window.location.search
      // let url = '/api/projects/' + vm.projectId + '/task/review' + '?taskid=RLeKdZeJ001&uuid=z5nJg6DH63u9cPhffR4YnuuW8MbXhs00&status=1001999'
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
      // let url = '/api/projects/' + vm.projectId + '/task/review' + '?taskid=RLeKdZeJ001&uuid=z5nJg6DH63u9cPhffR4YnuuW8MbXhs00&status=1001999'
      let comment = vm.$refs.Template.getComment().trim()
      // 鬼知道哪来的回车符。
      if (!comment || comment === '\n' || comment === '') {
        vm.$notify.error({
          title: '失败',
          message: '请填写拒绝理由到备注',
          duration: 2000
        })
        return
      }
      http.post(url, {
        accept: false,
        comment: comment
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
      // let url = '/api/projects/' + vm.projectId + '/task/revise' + '?taskid=RLeKdZeJ001&uuid=z5nJg6DH63u9cPhffR4YnuuW8MbXhs00&status=1001999'
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

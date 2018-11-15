<template>
<div id="main" ref="container">
  <Header/>
    <Video001 ref="Video001"
      :SopType="SopType"
      @postTask="postTask"
      :wholeRadios="wholeRadios"
      :wholeCheckBoxs="wholeCheckBoxs"
      :wholeInputs="wholeInputs"
      :itemRadios="itemRadios"
      :itemCheckBoxs="itemCheckBoxs"
      :itemInputs="itemInputs"
    />
    <!-- <div class="message load-icon-box" v-show="progStatus === true">
       <i class="el-icon-loading"></i>
    </div> -->
</div>
</template>

<script >
import axios from 'axios'
import Header from 'components/header'
import Footer from 'components/footer'
import Video001 from 'template/video/Video001'
import $ from 'jquery'

var http = axios.create({
  headers: {'X-Xsrftoken': $('meta[name=_xsrf]').attr('content')}
})
export default {
  name: 'app',
  components: {
    Header,
    Footer,
    Video001
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
      SopType: 1002,
      question: {},
      progStatus: false
    }
  },
  mounted: function () {
    let vm = this
    this.$nextTick(function () {
      // get current page project id
      let projectId = document.location.pathname.split('/')[2]
      // let projectId = 'dg5mNP0t001'
      if (projectId !== '') {
        vm.projectId = projectId
      }
      // vm.gettask()
      let url = '/api/projects/' + projectId + '/pageCfg'
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
          vm.gettask()
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
      // console.log('gettask')
      // vm.$refs.Video001.load(src)
      // vm.$refs.Video001.load('../../../static/textTalk.png')
      let url = '/api/projects/' + vm.projectId + '/task'
      // var src = 'https://s301.fanhantech.com/lXHrao41001/AKkUAf5NPH0GWg7OWD4T43jPR5PFR9lv.mp4'
      // vm.$refs.Video001.load(src)
      vm.progStatus = true
      vm.$refs.Video001.cleanbotcanvas()
      $.ajax({
        url: url,
        type: 'GET', // GET
        async: false, // 或false,是否异步
        timeout: 5000, // 超时时间
        dataType: 'json', // 返回的数据格式：
        beforeSend: function (xhr) {},
        success: function (data, textStatus, jqXHR) {
          let rsp = data
          // console.log(data)
          if (rsp.code === 0) {
            vm.question = rsp.questions[0]
            vm.$refs.Video001.load(vm.question.raw)
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
      // console.log(vm.question)
    },
    postTask (form) {
      // console.log(form)
      let vm = this
      let url = '/api/projects/' + vm.projectId + '/task'
      // console.log(vm.question)
      http.post(url, {
        id: vm.projectId,
        uuid: vm.question.uuid,
        result: JSON.stringify(form.result)
      })
        .then(function (response) {
          let rsp = response.data
          // console.log(rsp.Code)
          if (rsp.code === 0) {
            vm.$notify.success({
              title: '成功',
              message: rsp.message,
              duration: 2000
            })
            setTimeout(() => {
              window.location.reload()
            }, 1000)
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
/* body, #main {
  display: flex;
  flex-direction: column;
} */
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

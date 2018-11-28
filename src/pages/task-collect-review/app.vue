<template>
  <div class="selecttype">
    <Header/>
    <div class="container content">
      <collect ref="Template"
        :wholeRadios="wholeRadios"
        :wholeCheckBoxs="wholeCheckBoxs"
        :wholeInputs="wholeInputs"
        :itemRadios="itemRadios"
        :itemCheckBoxs="itemCheckBoxs"
        :itemInputs="itemInputs"
        :data="data"
        :projectId="projectId"
        CommentVisible=true
        CommentReadOnly=false
        PostButtonVisible=false
        CheckRadioVisible=true
        UploadButtonVisible=false
      >
        <el-button type="primary" @click="acceptTask">{{$t('taskPublic.acceptTask')}}</el-button>
        <el-button type="primary" @click="rejectTask">{{$t('taskPublic.rejectTask')}}</el-button>
      </collect>
    </div>
    <div class="theBottom">
      <Footer/>
    </div>
  </div>
</template>

<script>
import Header from 'components/header'
import Footer from 'components/footer'
import Collect from 'template/collect/collect'
import axios from 'axios'
import $ from 'jquery'
import {language} from 'lang'

var http = axios.create({
  headers: {'X-Xsrftoken': $('meta[name=_xsrf]').attr('content')}
})

export default {
  name: 'selecttype',
  components: {
    Footer: Footer,
    Header: Header,
    Collect
  },
  data () {
    return {
      projectId: '',
      question: {},
      templet: 1,
      SopType: 5004,
      wholeRadios: [],
      wholeCheckBoxs: [],
      wholeInputs: [],
      itemRadios: [],
      itemCheckBoxs: [],
      itemInputs: [],
      data: []
    }
  },
  computed: {
  },
  mounted: function () {
    let vm = this
    this.$nextTick(function () {
      // get current page project id
      let projectId = document.location.pathname.split('/')[2]
      // projectId = 'wbvFBAmv001'
      if (projectId !== '') {
        vm.projectId = projectId
      }
      console.log(vm.projectId)
      let url = '/api/projects/' + vm.projectId + '/pageCfg'
      http.get(url).then(function (response) {
        let rsp = response.data
        if (rsp.code === 0) {
          if (rsp.SopType) {
            vm.SopType = rsp.SopType
          }
          if (rsp.templet) {
            vm.templet = rsp.templet
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
          if (rsp.data) {
            vm.data = rsp.data
          }

          vm.$nextTick(function () {
            vm.gettask()
          })
        } else {
          console.log('code not 0??')
          vm.$notify.error({
            title: language('taskPublic.error'),
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
      // var url = '/api/projects/' + vm.projectId + '/task/review' + '?taskid=wbvFBAmv001&uuid=drTRz0jcm918FZq6JlSQzz2i4aSg403C&status=1001999'
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
            let result = JSON.parse(vm.question.res)
            // let prev = JSON.parse(vm.question.prev)
            // img.src = vm.question.raw
            vm.$refs.Template.load(result, vm.question.comment)
          } else {
            vm.$notify.error({
              title: language('taskPublic.error'),
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
      // let url = '/api/projects/' + vm.projectId + '/task/review' + '?taskid=wbvFBAmv001&uuid=drTRz0jcm918FZq6JlSQzz2i4aSg403C&status=1001999'
      if (!vm.$refs.Template.valid()) {
        vm.$notify.error({
          title: language('taskPublic.error'),
          message: language('taskPublic.errorMessage'),
          duration: 2000
        })
        return
      }
      let commentRes = {
        comment: language('taskPublic.acceptTask'),
        radioContents: vm.$refs.Template.getCheckRadio()
      }
      http.post(url, {
        accept: true,
        comment: JSON.stringify(commentRes)
      })
        .then(function (response) {
          let rsp = response.data
          if (rsp.code === 0) {
            vm.$notify.success({
              title: language('taskPublic.success'),
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
              title: language('taskPublic.error'),
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
      // let url = '/api/projects/' + vm.projectId + '/task/review' + '?taskid=wbvFBAmv001&uuid=drTRz0jcm918FZq6JlSQzz2i4aSg403C&status=1001999'
      let commentRes = {
        comment: vm.$refs.Template.getComment(),
        radioContents: vm.$refs.Template.getCheckRadio()
      }
      http.post(url, {
        accept: false,
        comment: JSON.stringify(commentRes)
      })
        .then(function (response) {
          let rsp = response.data
          console.log(rsp)
          if (rsp.code === 0) {
            vm.$notify.success({
              title: language('taskPublic.success'),
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
              title: language('taskPublic.error'),
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
body {
    background-color: #f0f2f5;
}
.content{
    background-color: #fff;
    padding: 2rem;
    margin-bottom: 6rem;
}
.theBottom {
  position: fixed;
  width: 100%;
  bottom: 0;
}
</style>

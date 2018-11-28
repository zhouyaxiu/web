<template>
  <div class="selecttype">
    <Header/>
    <div class="container content">
      <collect
        :wholeRadios="wholeRadios"
        :wholeCheckBoxs="wholeCheckBoxs"
        :wholeInputs="wholeInputs"
        :itemRadios="itemRadios"
        :itemCheckBoxs="itemCheckBoxs"
        :itemInputs="itemInputs"
        :data="data"
        :projectId="projectId"
        @postTask="postTask"
        >
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
      // projectId = 'gNFJdlWN001'
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
    getUploadToken (file) {
      let vm = this
      let xsrftoken = $('meta[name=_xsrf]').attr('content')
      let token = ''
      let key = ''
      let url = ''
      // 同步请求，	获取上传的token

      $.ajax({
        url: '/api/projects/' + vm.projectId + '/token',
        type: 'POST', // GET
        async: false, // 或false,是否异步
        data: {
          filename: file.name,
          // filesize: file.size,
          taskid: vm.projectId
        },
        transformRequest: [function (data) {
          // Do whatever you want to transform the data
          let ret = ''
          for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
          return ret
        }],
        timeout: 2000, // 超时时间
        dataType: 'json', // 返回的数据格式：
        beforeSend: function (xhr) {},
        success: function (data, textStatus, jqXHR) {
          let rsp = data
          if (rsp.code === 0) {
            token = rsp.token
            key = rsp.key
            url = 'https://s301.fanhantech.com/' + rsp.key
          } else {
            vm.$notify.error({
              title: language('pushimage.sample.js.error.type1'),
              message: rsp.message,
              duration: 2000
            })
          }
        },
        error: function (xhr, textStatus) {
          console.log('error')
          vm.$notify.error({
            title: language('collectWav.js.error.type1'),
            message: '',
            duration: 2000
          })
        },
        complete: function () {
          console.log('complete')
        },
        headers: {
          'X-Xsrftoken': xsrftoken
        }
      })
      return [token, key, url]
    },
    gettask: function () {
      let vm = this
      let url = '/api/projects/' + vm.projectId + '/task'
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
            // if (vm.question.prev && vm.question.prev !== '') {
            //   let submitdata = JSON.parse(vm.question.prev)
            // }
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
      console.log(vm.question)
    },
    postTask (form) {
      console.log(form)
      let vm = this
      let url = '/api/projects/' + vm.projectId + '/task'
      console.log(vm.question)
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
              title: language('taskPublic.success'),
              message: rsp.message,
              duration: 2000
            })
            setTimeout(() => {
              window.location.reload()
            }, 1000)
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

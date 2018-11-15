<template>
<div id="main" ref="container">
  <Header/>
    <Image009 v-if="templet==1" ref="Template"
      :SopType="SopType"
      @postTask="postTask"
      :wholeRadios="wholeRadios"
      :wholeCheckBoxs="wholeCheckBoxs"
      :wholeInputs="wholeInputs"
      :itemRadios="itemRadios"
      :itemCheckBoxs="itemCheckBoxs"
      :itemInputs="itemInputs"
      :rectMinH="rectMinH"
      :rectMinW="rectMinW"
      :rectMinArea="rectMinArea"
      :request="request"
      :pointSetRest="pointSetRest"
      :TagDisabled="TagDisabled"
      :vQuesCheck="vQuesCheck"
      :vQuesDo="vQuesDo"
      :vQuesCheckContents="vQuesCheckContents"
    />
    <Image002 v-if="templet==2" ref="Template"
      :SopType="SopType"
      @postTask="postTask"
      :wholeRadios="wholeRadios"
      :wholeCheckBoxs="wholeCheckBoxs"
      :wholeInputs="wholeInputs"
      :itemRadios="itemRadios"
      :rectMinH="rectMinH"
      :rectMinW="rectMinW"
      :rectMinArea="rectMinArea"
    />
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
import Image009 from 'template/image/Image009'
import Image002 from 'template/image/Image002'
import $ from 'jquery'
import * as stringformat from 'lib/stringformat/format.js'

var http = axios.create({
  headers: {'X-Xsrftoken': $('meta[name=_xsrf]').attr('content')}
})
export default {
  name: 'app',
  components: {
    Header,
    Footer,
    Image009,
    Image002
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
      // helptools: ['左上', '左下', '右上', '右下'],
      rectMinH: 20, // 矩形最小高
      rectMinW: 20, // 矩形最小宽
      rectMinArea: 400, // 矩形最小面积
      pointSetRest: {},
      SopType: 1003,
      question: {},
      progStatus: false,
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
    // let ques = '%%1%% is %%2%%, and %%1%%'
    // let args = ['aaa', 'bbb', 'ccc']
    // let formatq = stringformat.format(ques, args)
    // console.log(formatq)
    this.$nextTick(function () {
      // get current page project id
      let projectId = document.location.pathname.split('/')[2]
      // projectId = 'Tkl4rgV1001'
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
          if (rsp.templet) {
            vm.templet = rsp.templet
          } else {
            // 兼容代码，之前发布的项目中无templet
            if (vm.SopType === 1005) {
              vm.templet = 2
            }
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
          if (rsp.Restrictions) {
            if (rsp.Restrictions.ImgRest) {
              let rest = rsp.Restrictions.ImgRest
              vm.rectMinH = rest.rectMinH
              vm.rectMinW = rest.rectMinW
              vm.rectMinArea = rest.rectMinArea
              if (rest.pointSetRest) {
                vm.pointSetRest = rest.pointSetRest
              }
            }
          }
          if (rsp.request) {
            vm.request = rsp.request
            console.log(rsp.request)
          }
          vm.vflag = rsp.vflag
          if (vm.vflag > 1) {
            vm.TagDisabled = true
            // console.log(vm.TagDisabled)
          }
          if (rsp.vQues) {
            let vQues = rsp.vQues
            vm.vQuesCheck = []
            vm.vQuesDo = []
            for (let i = 0; i < vQues.length; i++) {
              if (i < vm.vflag - 1) {
                vm.vQuesCheck.push(vQues[i])
                // console.log('Check', vm.vQuesCheck)
              } else {
                vm.vQuesDo.push(vQues[i])
                // console.log('Do', vm.vQuesDo)
              }
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
    transfer: function (quesArr, args) {
      for (let i = 0; i < quesArr.length; i++) {
        quesArr[i].title = stringformat.format(quesArr[i].title, args)
      }
    },
    gettask: function () {
      let vm = this
      let url = '/api/projects/' + vm.projectId + '/task'
      vm.progStatus = true
      // vm.$refs.Template.cleanbotcanvas()
      // 同步请求，	获取task
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
            if (vm.question.qargs) {
              if (vm.wholeRadios.length > 0) {
                vm.transfer(vm.wholeRadios, vm.question.qargs)
              }
              if (vm.wholeCheckBoxs.length > 0) {
                vm.transfer(vm.wholeCheckBoxs, vm.question.qargs)
              }
              if (vm.itemRadios.length > 0) {
                vm.transfer(vm.itemRadios, vm.question.qargs)
              }
              if (vm.itemCheckBoxs.length > 0) {
                vm.transfer(vm.itemCheckBoxs, vm.question.qargs)
              }
              if (vm.wholeInputs.length > 0) {
                for (let i = 0; i < vm.wholeInputs.length; i++) {
                  vm.wholeInputs[i] = stringformat.format(vm.wholeInputs[i], vm.question.qargs)
                }
              }
              if (vm.itemInputs.length > 0) {
                for (let i = 0; i < vm.itemInputs.length; i++) {
                  vm.itemInputs[i] = stringformat.format(vm.itemInputs[i], vm.question.qargs)
                }
              }
              vm.request = stringformat.format(vm.request, vm.question.qargs)
            }
            // 兼容性保留代码，后续将不再使用prev字段
            if (vm.question.prev && vm.question.prev !== '') {
              let submitdata = JSON.parse(vm.question.prev)
              vm.$refs.Template.imageload(vm.question.raw, submitdata)
            } else {
              if (vm.question.res && vm.question.res !== '') {
                let submitdata = JSON.parse(vm.question.res)
                vm.$refs.Template.imageload(vm.question.raw, submitdata)
              } else {
                vm.$refs.Template.imageload(vm.question.raw)
              }
            }
            if (vm.question.vReses && Array.isArray(vm.question.vReses)) {
              vm.question.vReses.forEach((ele, index) => {
                vm.$set(vm.vQuesCheckContents, index, ele)
              })
            } else {
              vm.vQuesCheck.forEach((ele, index) => {
                vm.$set(vm.vQuesCheckContents, index, {label: 0, text: ''})
              })
            }
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
    postTask (form, vReses) {
      console.log(form)
      let vm = this
      let url = '/api/projects/' + vm.projectId + '/task'
      console.log(vm.question)
      http.post(url, {
        id: vm.projectId,
        uuid: vm.question.uuid,
        result: JSON.stringify(form.result),
        vReses: vm.vQuesCheckContents.concat(vReses)
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
body, #main {
  display: flex;
  flex-direction: column;
}
body {
  padding-top: 56px;
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

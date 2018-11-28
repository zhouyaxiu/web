<template>
<div id="main" ref="container">
  <Header/>
    <Image007 v-if="templet==1" ref="Template"
      :SopType="SopType"
      :wholeRadios="wholeRadios"
      :wholeCheckBoxs="wholeCheckBoxs"
      :wholeInputs="wholeInputs"
      :itemRadios="itemRadios"
      :itemCheckBoxs="itemCheckBoxs"
      :itemInputs="itemInputs"
      :rectMinH="rectMinH"
      :rectMinW="rectMinW"
      :rectMinArea="rectMinArea"
      :pointSetRest="pointSetRest"
      :CommentVisible="true"
      :CommentReadOnly="false"
      :PostButtonVisible="false"
      :request="request"
      :TagDisabled="TagDisabled"
      :vQuesCheck="vQuesCheck"
      :vQuesDo="vQuesDo"
      :vQuesCheckContents="vQuesCheckContents"
    >
      <!-- <el-tooltip content="ctrl + S" placement="top">
        <button id="postTask" type="button" class="btn btn-danger btn-sm mb-2" @click="postTask">提交</button>
      </el-tooltip> -->
      <button type="button" class="btn btn-danger btn-sm mb-2" style="width:5rem" @click="acceptTask">通过</button>
      <button type="button" class="btn btn-danger btn-sm mb-2" style="width:5rem" @click="rejectTask">拒绝</button>
      <button v-if="((tuflag & (1 << 10)) !== 0)" type="button" class="btn btn-danger btn-sm mb-2" style="width:5rem" @click="refuseReviseAndAcceptTask">提交并通过</button>
    </Image007>
    <Image002 v-if="templet==2" ref="Template"
      :SopType="SopType"
      :wholeRadios="wholeRadios"
      :wholeCheckBoxs="wholeCheckBoxs"
      :wholeInputs="wholeInputs"
      :itemRadios="itemRadios"
      :rectMinH="rectMinH"
      :rectMinW="rectMinW"
      :rectMinArea="rectMinArea"
      CommentVisible=true
      CommentReadOnly=false
      PostButtonVisible=false
    >
      <el-button type="primary" @click="acceptTask">通过</el-button>
      <el-button type="primary" @click="rejectTask">拒绝</el-button>
      <el-button type="primary" @click="refuseReviseAndAcceptTask">提交并通过</el-button>
      <!-- <el-button id="test" type="primary" @click="test">测试</el-button> -->
    </Image002>
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
import Image007 from 'template/image/Image007'
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
    Image007,
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
      rectMinH: 20, // 矩形最小高
      rectMinW: 20, // 矩形最小宽
      rectMinArea: 400, // 矩形最小面积
      pointSetRest: {},
      SopType: 1001,
      tuflag: 14,
      question: {},
      progStatus: false,
      request: '',
      vQuesDo: [], // 标注项填空题
      vQuesCheck: [], // 标注项填空题
      vflag: 1,
      TagDisabled: false,
      vQuesCheckContents: []
    }
  },
  mounted: function () {
    let vm = this
    tapp = this
    this.$nextTick(function () {
      // get current page project id
      let projectId = document.location.pathname.split('/')[2]
      // projectId = '167SDSZX001'
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
          }
          vm.vflag = rsp.vflag
          if (vm.vflag > 1) {
            vm.TagDisabled = true
            // console.log(vm.TagDisabled)
          }
          if (rsp.vQues) {
            let vQues = rsp.vQues
            vm.vQuesCheck = vm.vQuesCheck.splice(0, vm.vQuesCheck.length)
            vm.vQuesDo = vm.vQuesDo.splice(0, vm.vQuesDo.length)
            for (let i = 0; i < vQues.length; i++) {
              if (i < vm.vflag - 1) {
                vm.vQuesCheck.push(vQues[i])
              } else {
                vm.vQuesDo.push(vQues[i])
              }
            }
          }
          if (rsp.tuflag !== undefined) {
            vm.tuflag = rsp.tuflag
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
      let url = '/api/projects/' + vm.projectId + '/task/review' + window.location.search
      // let url = '/api/projects/' + vm.projectId + '/task/review' + '?taskid=167SDSZX001&uuid=02rraSa74TIzcqqNY7nI4rfmbT99Lj00&status=1001999'
      vm.progStatus = true
      // vm.$refs.Template.cleanbotcanvas()
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
            // console.log(vm.question)
            let submitdata = JSON.parse(vm.question.prev)
            if (vm.question.vReses && Array.isArray(vm.question.vReses)) {
              for (let i = 0; i < vm.question.vReses.length && i < vm.vQuesCheck.length; i++) {
                vm.$set(vm.vQuesCheckContents, i, vm.question.vReses[i])
              }
              if (vm.question.vReses.length >= vm.vflag) {
                let vQuesDoContents = []
                for (let i = 0; i < vm.vQuesDo.length; i++) {
                  if (i + vm.vflag - 1 < vm.question.vReses.length) {
                    vQuesDoContents[i] = vm.question.vReses[i + vm.vflag - 1]
                  } else {
                    vQuesDoContents[i] = {label: '', text: ''}
                  }
                }
                vm.$refs.Template.setVQuesDoRes(vQuesDoContents)
              }
            } else {
              // 保护性代码，如果question中无vReses字段，保证vQuesCheckContents和vQuesCheck长度一致
              vm.vQuesCheck.forEach((ele, index) => {
                vm.$set(vm.vQuesCheckContents, index, {label: '', text: ''})
              })
            }
            vm.$refs.Template.imageload(vm.question.raw, submitdata, vm.question.comment)
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
      // let url = '/api/projects/' + vm.projectId + '/task/review' + '?taskid=167SDSZX001&uuid=02rraSa74TIzcqqNY7nI4rfmbT99Lj00&status=1001999'
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
      // let url = '/api/projects/' + vm.projectId + '/task/review' + '?taskid=167SDSZX001&uuid=02rraSa74TIzcqqNY7nI4rfmbT99Lj00&status=1001999'
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
    refuseReviseAndAcceptTask () {
      let vm = this
      this.$confirm('确认要修改并通过任务吗？', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let url = '/api/projects/' + vm.projectId + '/task/review' + window.location.search
        // let url = '/api/projects/' + vm.projectId + '/task/review' + '?taskid=167SDSZX001&uuid=02rraSa74TIzcqqNY7nI4rfmbT99Lj00&status=1001999'
        let comment = 'before checkuser revise'
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
              vm.reviseAndacceptTask()
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
      }).catch(() => {
        // console.log('取消')
      })
    },
    reviseAndacceptTask () {
      let vm = this
      let url = '/api/projects/' + vm.projectId + '/task/revise' + window.location.search
      // let url = '/api/projects/' + vm.projectId + '/task/revise' + '?taskid=167SDSZX001&uuid=02rraSa74TIzcqqNY7nI4rfmbT99Lj00&status=1001999'
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
      let vReses = vm.$refs.Template.getVQuesDoRes()
      http.post(url, {
        id: vm.question.id,
        uuid: vm.question.uuid,
        // result: this.submit
        result: JSON.stringify(result),
        vReses: vm.vQuesCheckContents.concat(vReses)
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

var tapp
document.onkeydown = function (event) {
  if (event.keyCode === 70 && event.ctrlKey) {
    // ctrl + x 删除
    event.returnValue = false
    tapp.reviseAndacceptTask()
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

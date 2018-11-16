<template>
  <div id="main" class="push-task main">
    <Header/>
    <Layout :selStep="2" :active="2" :type="'group'" :projectId="projectId" style="flex:1">
      <div class="taskTit">
        <h3>{{$t("pushimage.business.wholemap")}}</h3>
      </div>
      <div class="taskInfos">
        <Group002 :queArr="wholeQues"></Group002>
      </div>
      <div class="taskTit mt-5">
        <h3>{{$t("pushimage.business.labelproblem")}}</h3>
      </div>
      <div class="taskInfos">
        <Group002 :queArr="itemQues"></Group002>
      </div>
      <div class="d-flex justify-content-center mt-5">
        <el-button @click="goBack()">{{$t("pushTask.goback")}}</el-button>
        <el-button plain @click="submitForm(false)">{{$t("pushTask.submit")}}</el-button>
        <el-button type="primary" @click="submitForm(true)">{{$t("pushTask.next")}}</el-button>
      </div>
    </Layout>
    <Footer/>
    <transition name="el-fade-in">
      <div class="message2 push-task" v-show="messageStatus === 2" style="overflow: auto;">
        <div class="position-fixed w-100 bg-white d-flex align-items-center justify-content-between p-3" style="height:56px;z-index: 2">
          <div></div>
          <span class="d-flex align-items-center text-dark"><i class="fa fa-desktop fa-2x pr-2"></i>PC端预览</span>
          <el-button round @click="close()" size="medium">关闭预览</el-button>
        </div>
        <div class="d-flex justify-content-center pb-5" style="padding-top: 80px">
          <Group001 ref="Template"
            @postTask="templetPostTask"
            :imgUrl="datas"
            :wholeQues="wholeQues"
            :itemQues="itemQues"
          >
          </Group001>
        </div>
      </div>
    </transition>
    <div class="speake-box">
      <el-button type="primary" @click="showTemplate()">{{$t("pushimage.business.preview")}}</el-button>
    </div>
  </div>
</template>

<script>
import Header from 'components/header'
import Footer from 'components/footer'
import Layout from '../../components/layoutPage'
import Group002 from '../../components/question002'
import $ from 'jquery'
import axios from 'axios'
import * as util from 'assets/js/util.js'
import {language} from 'lang'
import Group001 from 'template/group/Group001'

export default {
  name: 'app',
  components: {
    Header,
    Footer,
    Layout,
    Group001,
    Group002
  },
  data () {
    return {
      projectId: '',
      templet: 2,
      messageStatus: 1,
      speakeStatus: false,
      wholeQues: [], // 整图
      itemQues: [], // 标注项
      SopType: 6001,
      datas: [
        {type: 1, raw: 'https://s301.fanhantech.com/cartoon/0hIr4xkgInoz2q2LYhSE47bjKvdMzCla.jpg'},
        {type: 1, raw: 'https://s301.fanhantech.com/cartoon/0hIr4xkgInoz2q2LYhSE47bjKvdMzCla.jpg'},
        {type: 1, raw: 'https://s301.fanhantech.com/cartoon/0hIr4xkgInoz2q2LYhSE47bjKvdMzCla.jpg'},
        {type: 1, raw: 'https://s301.fanhantech.com/cartoon/0hIr4xkgInoz2q2LYhSE47bjKvdMzCla.jpg'},
        {type: 1, raw: 'https://s301.fanhantech.com/cartoon/0hIr4xkgInoz2q2LYhSE47bjKvdMzCla.jpg'},
        {type: 1, raw: 'https://s301.fanhantech.com/cartoon/0hIr4xkgInoz2q2LYhSE47bjKvdMzCla.jpg'},
        {type: 1, raw: 'https://s301.fanhantech.com/cartoon/0hIr4xkgInoz2q2LYhSE47bjKvdMzCla.jpg'}
      ]
    }
  },
  computed: {
  },
  mounted: function () {
    let vm = this
    let projectId = document.location.pathname.split('/')[3]
    // projectId = 'subwUVrB77R001'
    console.log('projectId:', projectId)
    if (projectId !== '') {
      vm.projectId = projectId
    }
    this.$nextTick(function () {
      // 获取基本信息（可能是新建任务后，自动跳转过来，也可能是从控制台跳转过来）
      let xsrftoken = $('meta[name=_xsrf]').attr('content')
      axios.post('/api/get-business-info/group',
        {
          taskid: vm.projectId
        },
        {
          headers: {
            'X-Xsrftoken': xsrftoken
          }
        }
      ).then(function (response) {
        let rsp = response.data
        if (rsp.code === 0) {
          if (rsp.SopType) {
            vm.SopType = rsp.SopType
          }

          if (rsp.pageCfg) {
            if (rsp.pageCfg.wholeQues) {
              vm.wholeQues = rsp.pageCfg.wholeQues
            }
            if (rsp.pageCfg.itemQues) {
              vm.itemQues = rsp.pageCfg.itemQues
            }
          }
        } else {
          vm.notify('error', rsp.message, 2000)
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
          title: language('login.js.success'),
          message: message,
          duration: duration
        })
      } else if (type === 'error') {
        vm.$notify.error({
          title: language('login.js.error'),
          message: message,
          duration: duration
        })
      }
    },
    templetPostTask (param) {
      console.log(JSON.stringify(param))
    },
    showTemplate () {
      let vm = this
      this.messageStatus = 2
      vm.$refs.Template.load(vm.datas)
    },
    // 返回后台的数据
    submitRes () {
      const vm = this
      let res = {
        taskid: vm.projectId,
        templet: vm.templet,
        wholeQues: vm.wholeQues,
        itemQues: vm.itemQues
      }
      return res
    },
    // 提交
    submitForm (forward) {
      let vm = this
      console.log(vm.wholeQues)
      console.log(vm.itemQues)
      let xsrftoken = $('meta[name=_xsrf]').attr('content')
      axios
        .post(
          '/api/push-project-business/group',
          vm.submitRes(),
          {
            headers: {
              'X-Xsrftoken': xsrftoken
            }
          }
        )
        .then(function (response) {
          let rsp = response.data
          if (rsp.code === 0) {
            vm.notify('success', language('pushTask.js.successNote'), 2000)
            // 延时500ms跳转
            if (forward) {
              util.Redirect(
                '/push-project-qcprice/group/' + vm.projectId,
                1000
              )
            }
          } else {
            vm.notify('error', rsp.message, 2000)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    // 控制浮层关闭
    close () {
      this.messageStatus = 1
    },
    goBack () {
      util.Redirect('/push-project-profile/group/' + this.projectId, 1000)
    }
  }
}
</script>

<style>
.push-task {
  background-color: #f0f2f5;
}
body {
  padding-top: 56px;
}
.message2 {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1999;
}
/*滚动条样式*/
.message2::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
.message2::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.message2::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
.speake-box {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  z-index: 1051;
}
</style>

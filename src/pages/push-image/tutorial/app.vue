<template>
  <div id="main">
    <Header/>
    <div class="time-axis">
      <el-steps align-center :active="5" >
        <el-step :title="$t('pushTask.creat')" ></el-step>
        <el-step :title="$t('pushTask.business')" ></el-step>
        <el-step :title="$t('pushTask.baseinfo')" ></el-step>
        <el-step :title="$t('pushTask.qcprice')" ></el-step>
        <el-step :title="$t('pushTask.sample')" ></el-step>
        <el-step :title="$t('pushTask.tutorial')" ></el-step>
      </el-steps>
    </div>
    <div class="container content">
      <el-form label-width="110px" class="demo-paramForm">
        <div class="project">
          <div class="taskTit">
            <h3>{{$t("pushimage.course")}}</h3>
          </div>
          <div id="editor"></div>
        </div>
        <el-form-item class="task-submit">
          <el-button @click="goBack()">{{$t("pushTask.goback")}}</el-button>
          <el-button type="primary" @click="post(false)">{{$t("pushTask.submit")}}</el-button>
          <el-button type="primary" @click="post(true)" >{{$t("pushTask.next")}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <Footer/>
  </div>
</template>

<script>
import axios from 'axios'
import Header from 'components/header'
import Footer from 'components/footer'
import $ from 'jquery'
import * as util from 'assets/js/util.js'
import Quill from 'quill'
import {language} from 'lang'

export default {
  name: 'app',
  components: {
    Header,
    Footer
  },
  data () {
    return {
      quill: {},
      projectid: ''
    }
  },
  mounted: function () {
    var vm = this
    vm.projectid = document.location.pathname.split('/')[3]
    this.$nextTick(function () {
      // 初始化编辑器
      var toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['blockquote', 'code-block'],
        ['link', 'image'],
        [{'list': 'ordered'}, { 'list': 'bullet' }],
        [{'script': 'sub'}, { 'script': 'super' }], // superscript/subscript
        [{'indent': '-1'}, { 'indent': '+1' }], // outdent/indent
        [{ 'direction': 'rtl' }], // text direction
        [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }]
      ]

      vm.quill = new Quill('#editor', {
        placeholder: '请输入...',
        modules: {
          toolbar: toolbarOptions
        },
        theme: 'snow'
      })

      let toolbar = vm.quill.getModule('toolbar')
      toolbar.addHandler('image', () => {
        // document.getElementById('checkImg').click()
        console.log('image click')
      })
      // vm.handleSuc()
      let xsrftoken = $('meta[name=_xsrf]').attr('content')
      axios
        .post(
          '/api/get-project-tutorial',
          {
            taskid: vm.projectid
          },
          {
            headers: {
              'X-Xsrftoken': xsrftoken
            }
          }
        )
        .then(function (response) {
          let rsp = response.data
          if (rsp.code === 0) {
            // vm.$notify.success({
            //   title: '成功',
            //   message: '提交成功',
            //   duration: 2000
            // })
            vm.quill.setText(rsp.tutorial)
          } else {
            vm.$notify.error({
              title: language('pushTask.js.error'),
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
    goBack () {
      util.Redirect('/push-project-sample/image/' + this.projectid, 1000)
    },
    post (forword) {
      let vm = this
      let xsrftoken = $('meta[name=_xsrf]').attr('content')
      axios
        .post(
          '/api/set-project-tutorial',
          {
            taskid: vm.projectid,
            tutorial: vm.quill.getText()
          },
          {
            headers: {
              'X-Xsrftoken': xsrftoken
            }
          }
        )
        .then(function (response) {
          let rsp = response.data
          if (rsp.code === 0) {
            vm.$notify.success({
              title: language('pushTask.js.success'),
              message: language('pushTask.js.successNote'),
              duration: 2000
            })
            // 延时500ms跳转
            if (forword) {
              util.Redirect('/workbench#/publish', 1000)
            }
          } else {
            vm.$notify.error({
              title: language('pushTask.js.error'),
              message: rsp.message,
              duration: 2000
            })
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    handleSuc (file) {
      // this.quill.insertEmbed(5, 'image', 'https://s301.fanhantech.com/image1806/fphsrUnA4baFdv1PBd0hvbvNRPUm3gvX.JPG')
    }
  }
}
</script>

<style>
html,
body,
#main {
  height: 100%;
}
body,
#main {
  display: flex;
  flex-direction: column;
}
body {
  background-color: #f0f2f5;
  padding-top: 4.5rem;
}
.container {
  flex: 1 0 auto;
}
.navbar{
  flex-direction: row;
}
.project {
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 1px 2px hsla(165, 9%, 74%, 0.95);
  margin-bottom: 20px;
  padding: 30px 50px;
  position: relative;
  min-height: 400px;
}
.time-axis {
  margin-top: 50px;
  margin-bottom: 50px;
}
@media screen and (min-width: 1360px) {
  .time-axis {
    margin-left: 135px;
    margin-right: 135px;
  }
}
.ql-editor.ql-blank {
    min-height: 200px;
}
.task-submit {
  position: relative;
  margin-top: 50px;
}
.task-submit .el-form-item__content {
  position: absolute;
  left: 70%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin-left: 0 !important;
}
.taskTit h3 {
  border-left: 4px solid #5788cd;
  font-size: 1rem;
  text-indent: 0.5rem;
  line-height: .825rem;
  margin-bottom: 1rem;
  margin-top: 1rem;
}
</style>

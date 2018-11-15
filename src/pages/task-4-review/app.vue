<template>
<div id="main">
  <Header/>
  <div class="container mb-5">
    <div class="userinfo clearfix">
      <p class="text-muted float-right">今日完成：--</p>
      <p class="font-italic">请按要求标注下面的数据。</p>
    </div>
    <div class="text-form row">
      <div class="col-md">
        <span>中文</span>
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" placeholder="请输入内容" v-model="question.raw" readonly></el-input>
      </div>
      <div class="col-md">
        <span>英文</span>
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" placeholder="请输入内容" v-model="question.prev" readonly></el-input>
      </div>
    </div>
    <div class="answer-form my-3">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="文本翻译：" prop="result">
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" placeholder="请输入内容" v-model="form.result"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="d-flex justify-content-end" v-if="action == 'review'">
            <el-button type="danger" @click="dialogVisible = true">拒绝</el-button>
            <el-button type="success" @click="acceptTask">通过</el-button>
            <el-dialog title="请输入拒绝原因" :visible.sync="dialogVisible">
              <el-input type="textarea" v-model="reason"></el-input>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="rejectTask">确 定</el-button>
              </span>
            </el-dialog>
          </div>
          <div class="d-flex justify-content-end" v-else-if="action == 'revise'">
            <el-button type="success" @click="reviseTask('form')" :disabled="submitDisabled">提交</el-button>
          </div>
          <div class="d-flex justify-content-end" v-else>
            <el-button type="info">上一个</el-button>
            <el-button type="success" @click="postTask('form')" :disabled="submitDisabled">提交</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
  <Footer/>
</div>
</template>

<script>
import Header from 'components/header'
import Footer from 'components/footer'
import axios from 'axios'
import $ from 'jquery'

var projectId = document.location.pathname.split('/')[2]
var http = axios.create({
  headers: {'X-Xsrftoken': $('meta[name=_xsrf]').attr('content')}
})

export default {
  name: 'app',
  components: {
    Header,
    Footer
  },
  data () {
    return {
      action: '',
      dialogVisible: false,
      reason: '',
      question: {
        raw: '你是谁',
        prev: 'who are you'
      },
      // 表单
      form: {
        result: ''
      },
      // 表单验证规则
      rules: {
        result: [
          {required: true, type: 'string', message: '请按照要求完成标注'}
        ]
      }
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      let vm = this
      // get current page action flag
      vm.action = $('meta[name=_action]').attr('content')
      // 请求数据
      vm.getTask()
    })
  },
  methods: {
    getTask () {
      let vm = this
      let url = '/api/projects/' + projectId + '/task'
      if (vm.action === 'review' || vm.action === 'revise') {
        url = '/api/projects/' + projectId + '/task/review' + window.location.search
      }
      http.get(url)
        .then(function (response) {
          let rsp = response.data
          // console.log(rsp)
          if (rsp.code === 0) {
            // 成功
            vm.question = rsp.questions[0]
          } else {
            // 失败
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
    postTask (form) {
      let vm = this
      let url = '/api/projects/' + projectId + '/task'
      vm.$refs[form].validate((valid) => {
        if (!valid) {
          vm.$notify.error({
            title: '失败',
            message: '请按照要求完成标注',
            duration: 2000
          })
          return false
        }
        http.post(url, {
          id: vm.question.id,
          uuid: vm.question.uuid,
          result: vm.form.result
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
              // 通过refresh页面获取下一个任务
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
      })
    },
    acceptTask () {
      let vm = this
      let url = '/api/projects/' + projectId + '/task/review' + window.location.search
      http.post(url, {
        accept: true,
        comment: '通过'
      })
        .then(function (response) {
          let rsp = response.data
          // console.log(rsp)
          if (rsp.code === 0) {
            vm.$notify.success({
              title: '成功',
              message: rsp.message,
              duration: 2000
            })
            // 通过refresh页面获取下一个任务
            setTimeout(() => {
              window.location.href = '/projects/' + projectId + '/task/reviews'
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
    },
    rejectTask () {
      let vm = this
      vm.dialogVisible = false
      let url = '/api/projects/' + projectId + '/task/review' + window.location.search
      http.post(url, {
        accept: false,
        comment: vm.reason
      })
        .then(function (response) {
          let rsp = response.data
          // console.log(rsp)
          if (rsp.code === 0) {
            vm.$notify.success({
              title: '成功',
              message: rsp.message,
              duration: 2000
            })
            // 通过refresh页面获取下一个任务
            setTimeout(() => {
              window.location.href = '/projects/' + projectId + '/task/reviews'
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
    },
    reviseTask (form) {
      let vm = this
      let url = '/api/projects/' + projectId + '/task/revise' + window.location.search
      vm.$refs[form].validate((valid) => {
        if (!valid) {
          vm.$notify.error({
            title: '失败',
            message: '请按照要求完成标注',
            duration: 2000
          })
          return false
        }
        http.post(url, {
          id: vm.question.id,
          result: vm.form.result
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
              // 通过refresh页面获取下一个任务
              setTimeout(() => {
                window.location.href = '/projects/' + projectId + '/task/revises'
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
      })
    }
  }
}
</script>

<style scoped>
.el-radio-button__inner {
  margin-left: 15px;
  border: 1px solid #d8dce6;
}
</style>

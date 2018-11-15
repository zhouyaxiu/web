<template>
  <div id="main" class="main push-task">
    <Header/>
    <Layout :selStep="4" :active="4" :type="'collect'" :projectId="projectId" style="flex:1">
      <el-form :model="paramForm" :rules="rules" ref="paramForm" label-position="top" class="demo-paramForm">
        <div class="taskTit">
          <h3>{{$t("pushimage.qcprice.quote")}}</h3>
        </div>
        <div class="taskInfos">
          <el-row :gutter="20">
            <el-col :span="14">
              <el-form-item :label="$t('pushimage.qcprice.unitprice')" prop="offer">
                <el-input v-model.number="paramForm.offer" style="max-width:200px"></el-input>
                <span class="ml-2">{{$t("pushimage.qcprice.integral")}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <div class="alert alert-success" role="alert" style="font-size: .875rem">
                <p class="mb-0">
                  {{$t("pushimage.qcprice.sumprice")}}
                  【{{paramForm.offer}}{{$t("pushimage.qcprice.inter")}}】
                </p>
              </div>
            </el-col>
          </el-row>
        </div>
        <el-form-item class="d-flex justify-content-center mt-5">
          <el-button @click="goBack()">{{$t("pushTask.goback")}}</el-button>
          <el-button type="primary" @click="submitForm('paramForm',false)">{{$t("pushTask.submit")}}</el-button>
          <el-button type="primary" @click="submitForm('paramForm',true)" >{{$t("pushTask.next")}}</el-button>
        </el-form-item>
      </el-form>
    </Layout>
    <Footer/>
  </div>

</template>

<script>
import Header from 'components/header'
import Footer from 'components/footer'
import $ from 'jquery'
import axios from 'axios'
import * as util from 'assets/js/util.js'
import helpinfo from './help-info'
import {language} from 'lang'
import Layout from '../../components/layoutPage'

export default {
  name: 'app',
  components: {
    Header,
    Layout,
    Footer
  },
  data () {
    return {
      projectId: '',
      checkNumner: '',
      helpinfo: helpinfo,
      // 表单验证
      paramForm: {
        offer: ''
      },
      rules: {
        offer: [
          {required: true, message: language('pushimage.qcprice.js.rules.offer1')},
          {type: 'number', message: language('pushimage.qcprice.js.rules.offer2')}
        ]
      }
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      let vm = this
      // get current page project id
      let projectId = document.location.pathname.split('/')[3]
      // projectId = 'subsdRGf1KQ001'
      if (projectId !== '') {
        vm.projectId = projectId
      }
      // 获取基本信息（可能是新建任务后，自动跳转过来，也可能是从控制台跳转过来）
      let xsrftoken = $('meta[name=_xsrf]').attr('content')
      axios
        .post(
          '/api/get-project-qcprice/collect',
          {
            taskid: vm.projectId
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
            if (rsp.price) {
              vm.paramForm.offer = rsp.price
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
      // 获取simplist
    })
  },
  methods: {
    submitForm (formName, forword) {
      let vm = this
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false
        }
        let xsrftoken = $('meta[name=_xsrf]').attr('content')

        axios
          .post(
            '/api/push-project-qcprice/collect',
            {
              taskid: vm.projectId,
              price: vm.paramForm.offer
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
                // util.Redirect('/push-project-tutorial/image/' + vm.projectId, 1000)
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
      })
    },
    goBack () {
      util.Redirect('/push-project-business/collect/' + this.projectId, 1000)
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
.forHelp{
  color: #909399;
  font-size: 22px;
}
</style>

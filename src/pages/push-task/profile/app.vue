<template>
  <div class="main push-task">
    <Header/>
    <Layout :selStep="1" :active="1" :type="dataType" :projectId="projectId">
      <el-form :model="paramForm" :rules="rules" ref="paramForm" class="demo-paramForm" label-position="top">
        <div class="taskTit">
          <h3>任务描述</h3>
        </div>
        <div>
          <el-form-item required label="任务名称" prop="taskname">
            <el-input v-model="paramForm.taskname"></el-input>
          </el-form-item>
          <el-form-item label="任务简介" prop="abstract">
            <el-input type="textarea" :rows="5" v-model="paramForm.abstract"></el-input>
          </el-form-item>
          <el-form-item label="任务背景描述" prop="desc">
            <el-input type="textarea" :rows="5" v-model="paramForm.desc"></el-input>
          </el-form-item>
        </div>
          <div class="taskTit">
          <h3 class="mt-5">{{$t("pushimage.business.tasktime")}}</h3>
        </div>
        <div>
          <el-form-item :label="$t('pushimage.business.starttime')" prop="date">
            <el-date-picker
              v-model="paramForm.date"
              type="daterange"
              :range-separator="$t('pushimage.business.to')"
              :start-placeholder="$t('pushimage.business.startdate')"
              :end-placeholder="$t('pushimage.business.stopdate')"
              size="medium">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="taskTit">
          <h3 class="mt-5">任务细节</h3>
        </div>
        <div>
          <el-form-item label="标注规则">
            <a v-if="paramForm.ruleSrc !== ''" :href="paramForm.ruleSrc">{{paramForm.ruleFile}}</a><p>
            <span class="btn btn-primary btn-sm fileinput-button">
              <span>标注规则文件上传</span>
              <input type="file"
                accept="application/pdf"
                @change="(value) => addFile(value)">
            </span>
            <p class="m-0">文件格式需要为PDF格式</p>
          </el-form-item>
          <el-form-item label="有效性判断" prop="checkValid">
            <el-radio-group v-model="paramForm.checkValid">
              <el-radio :label=true border>需要</el-radio>
              <el-radio :label=false border>不需要</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="paramForm.checkValid" :label="$t('pushimage.baseinfo.criterion')" prop="criterion">
            <el-input type="textarea" :rows="5" v-model="paramForm.criterion"></el-input>
          </el-form-item>
          <el-form-item label="是否开放申请" prop="checkValid">
            <el-radio-group v-model="paramForm.tasktype">
              <el-radio :label=0 border>不开放</el-radio>
              <el-radio :label=1 border>开放</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('pushimage.baseinfo.qualified')" prop="qualified">
            <el-input type="textarea" :rows="5" v-model="paramForm.qualified"></el-input>
          </el-form-item>
        </div>
        <el-form-item class="d-flex justify-content-center">
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
import Layout from '../components/layoutPage'
import Footer from 'components/footer'
import $ from 'jquery'
import axios from 'axios'
import * as qiniu from 'qiniu-js'
import * as util from 'assets/js/util.js'
import {language} from 'lang'

export default {
  name: 'app',
  components: {
    Header,
    Footer,
    Layout
  },
  data () {
    return {
      projectId: '',
      dataType: '',
      // 表单验证
      paramForm: {
        taskname: '',
        abstract: '',
        desc: '',
        date: [],
        ruleFile: '',
        ruleSrc: '',
        checkValid: false,
        criterion: '',
        tasktype: 0,
        qualified: ''
      },
      rules: {
        taskname: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
          { required: true, type: 'string', pattern: /^[\u4E00-\u9FA5A-Za-z0-9_]+$/, message: language('selectProjectType.js.validator'), trigger: 'blur' }
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
      let tmp = document.location.pathname.split('/')
      let projectId = tmp[3]
      vm.dataType = tmp[2]
      // projectId = 'subwUVrB77R001'
      if (projectId !== '') {
        vm.projectId = projectId
      }
      // 获取基本信息（可能是新建任务后，自动跳转过来，也可能是从控制台跳转过来）
      let xsrftoken = $('meta[name=_xsrf]').attr('content')
      axios
        .post(
          '/api/get-project-profile',
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
            console.log(rsp)
            vm.paramForm.taskname = rsp.taskname ? rsp.taskname : ''
            vm.paramForm.abstract = rsp.abstract ? rsp.abstract : ''
            vm.paramForm.desc = rsp.desc ? rsp.desc : ''
            vm.paramForm.date = rsp.startTime && rsp.endTime ? [rsp.startTime, rsp.endTime] : []
            vm.paramForm.ruleFile = rsp.ruleFile ? rsp.ruleFile : ''
            vm.paramForm.ruleSrc = rsp.ruleSrc ? rsp.ruleSrc : ''
            vm.paramForm.checkValid = rsp.checkValid ? rsp.checkValid : false
            vm.paramForm.criterion = rsp.criterion ? rsp.criterion : ''
            vm.paramForm.qualified = rsp.qualified ? rsp.qualified : ''
            vm.paramForm.tasktype = rsp.tasktype ? rsp.tasktype : 0
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
    // 上传函数
    getUploadToken (file) {
      let vm = this
      let xsrftoken = $('meta[name=_xsrf]').attr('content')
      let token = ''
      let key = ''
      let url = ''
      // 同步请求，	获取上传的token
      const URL = '/api/get-ruleFile-token'
      $.ajax({
        url: URL,
        type: 'POST', // GET
        async: false, // 或false,是否异步
        data: {
          filename: file.name,
          filesize: file.size,
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
        timeout: 5000, // 超时时间
        dataType: 'json', // 返回的数据格式：
        beforeSend: function (xhr) {},
        success: function (data, textStatus, jqXHR) {
          let rsp = data
          if (rsp.code === 0) {
            token = rsp.token
            key = rsp.key
            url = rsp.url
            vm.$notify.success({
              title: '成功',
              message: '上传成功',
              duration: 2000
            })
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
    // 添加文件
    addFile (e) {
      let vm = this
      let file = e.target.files[0]
      if (!file) {
        return
      }
      let tokenKey = vm.getUploadToken(file)
      let token = tokenKey[0]
      let key = tokenKey[1]
      let url = tokenKey[2]
      console.log(token)
      console.log(key)
      if (token === '' || key === '') {
        return
      }
      let config = {
        useCdnDomain: true,
        region: qiniu.region.z0,
        checkByMD5: true
      }
      let putExtra = {
        fname: file.name,
        params: {},
        mimeType: null
      }
      let observable = qiniu.upload(file, key, token, putExtra, config)
      console.log(observable)
      let observer = {
        next (res) {
          console.log('doing' + res)
        },
        error (err) {
          console.log('error', err)
        },
        complete (res) {
          console.log('complete', res)
          vm.paramForm.ruleSrc = url
          vm.paramForm.ruleFile = file.name
          console.log(vm.paramForm.ruleFile)
        }
      }
      vm.subscription = observable.subscribe(observer)
    },
    // 提交函数
    submitForm (formName, forword) {
      let vm = this
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false
        }
        let xsrftoken = $('meta[name=_xsrf]').attr('content')

        axios
          .post(
            '/api/push-project-profile',
            {
              taskid: vm.projectId,
              taskname: vm.paramForm.taskname,
              abstract: vm.paramForm.abstract,
              desc: vm.paramForm.desc,
              startTime: vm.paramForm.date[0] || '',
              endTime: vm.paramForm.date[1] || '',
              ruleFile: vm.paramForm.ruleFile,
              ruleSrc: vm.paramForm.ruleSrc,
              checkValid: vm.paramForm.checkValid,
              criterion: vm.paramForm.criterion, // 有效数据判断准则
              tasktype: vm.paramForm.tasktype,
              qualified: vm.paramForm.qualified // 合格标准
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
                util.Redirect('/push-project-business/' + vm.dataType + '/' + vm.projectId, 1000)
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
/* 上传控件 */
.fileinput-button {
  position: relative;
  display: inline-block;
  overflow: hidden;
  font-size: 0.8rem;
  padding: 9px 15px;
}
.fileinput-button input {
  position: absolute;
  left: 0px;
  top: 0px;
  opacity: 0;
  height: 100%;
  width: 100%;
}
</style>

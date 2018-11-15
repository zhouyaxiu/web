<template>
  <div id="main">
    <Header/>
    <div class="time-axis">
      <el-steps align-center :active="2" >
        <el-step :title="$t('pushTask.creat')" ></el-step>
        <el-step :title="$t('pushTask.business')" ></el-step>
        <el-step :title="$t('pushTask.baseinfo')" ></el-step>
        <el-step :title="$t('pushTask.qcprice')" ></el-step>
        <el-step :title="$t('pushTask.sample')" ></el-step>
        <el-step :title="$t('pushTask.tutorial')" ></el-step>
      </el-steps>
    </div>
    <div class="container content">
      <el-form :model="paramForm" :rules="rules" ref="paramForm" label-width="110px" class="demo-paramForm">
        <el-row :gutter="20" >
          <el-col  class="task">
            <div class="taskInfo">
              <div class="taskTit">
                <h3>{{$t("pushtext.baseinfo.datasource")}}</h3>
              </div>
              <div class="taskInfos">
                <el-form-item :label="$t('pushtext.baseinfo.fileformat')" prop="format">
                  <el-checkbox-group v-model="paramForm.format" @change="formatClick">
                    <el-checkbox :label=1 name="format">txt</el-checkbox>
                    <el-checkbox :label=2 name="format">doc</el-checkbox>
                    <el-checkbox :label=3 name="format">docx</el-checkbox>
                    <el-checkbox :label=4 name="format">{{$t("pushtext.baseinfo.other")}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="" prop="formatOther" v-if="formatStatus === 4">
                  <el-input type="text" v-model="paramForm.formatOther" :placeholder="$t('pushtext.baseinfo.otherformat')" ></el-input>
                </el-form-item>
              </div>
              <div class="taskTit">
                <h3>{{$t("pushtext.baseinfo.note")}}</h3>
              </div>
              <div class="taskInfos">
                <el-form-item :label="$t('pushtext.baseinfo.note')">
                  <el-input type="textarea" :rows="5" v-model="paramForm.remarks"></el-input>
                </el-form-item>
              </div>
              <div class="taskTit">
                <h3>{{$t("pushtext.baseinfo.skill")}}</h3>
              </div>
              <div class="taskInfos">
                <el-form-item :label="$t('pushtext.baseinfo.ski')" prop="skill">
                  <el-input type="text" v-model="paramForm.skill"></el-input>
                </el-form-item>
              </div>
              <div class="taskTit">
                <h3>{{$t("pushtext.baseinfo.dataqualified")}}</h3>
              </div>
              <div class="taskInfos">
                <el-form-item :label="$t('pushtext.baseinfo.qualified')" prop="qualified">
                  <el-input type="textarea" :rows="5" v-model="paramForm.qualified"></el-input>
                </el-form-item>
              </div>
              <div class="taskTit">
                <h3>{{$t("pushtext.baseinfo.valcriterion")}}</h3>
              </div>
              <div class="taskInfos">
                <el-form-item :label="$t('pushtext.baseinfo.criterion')" prop="criterion">
                  <el-input type="textarea" :rows="5" v-model="paramForm.criterion"></el-input>
                </el-form-item>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-form-item class="task-submit">
          <el-button @click="goBack()">{{$t("pushTask.goback")}}</el-button>
          <el-button type="primary" @click="submitForm('paramForm',false)">{{$t("pushTask.submit")}}</el-button>
          <el-button type="primary" @click="submitForm('paramForm',true)" >{{$t("pushTask.next")}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <Footer/>
  </div>

</template>

<script>
import Header from 'components/header'
import Footer from 'components/footer'
import $ from 'jquery'
import axios from 'axios'
import * as util from 'assets/js/util.js'
import {language} from 'lang'

export default {
  name: 'app',
  components: {
    Header,
    Footer
  },
  data () {
    return {
      projectid: '',
      // 显示与隐藏的相关状态
      formatStatus: 1,
      // 表单验证
      paramForm: {
        format: [], // 文件格式
        formatOther: '',
        scale: '',
        qualified: '',
        remarks: '',
        skill: '', // 技能
        criterion: ''
      },
      rules: {
        format: [
          {
            type: 'array',
            required: true,
            message: language('pushtext.baseinfo.js.rules.format'),
            trigger: 'change'
          }
        ],
        formatOther: [{ required: true, message: language('pushtext.baseinfo.js.rules.formatOther'), trigger: 'blur' }],
        qualified: [{ required: true, message: language('pushtext.baseinfo.js.rules.qualified'), trigger: 'blur' }],
        skill: [{ required: true, message: language('pushtext.baseinfo.js.rules.skill'), trigger: 'blur' }],
        criterion: [{ required: true, message: language('pushtext.baseinfo.js.rules.criterion'), trigger: 'blur' }]
      }
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      let vm = this
      // get current page project id
      let projectid = document.location.pathname.split('/')[3]
      // let projectid = 'subAKHqlLfB001'
      if (projectid !== '') {
        vm.projectid = projectid
      }
      // 获取基本信息（可能是新建任务后，自动跳转过来，也可能是从控制台跳转过来）
      let xsrftoken = $('meta[name=_xsrf]').attr('content')
      axios
        .post(
          '/api/get-project-baseinfo/text',
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
            if (rsp.dataFormat) {
              let dataFormat = rsp.dataFormat
              if (rsp.dataFormat.normals) {
                let normals = rsp.dataFormat.normals
                vm.paramForm.format = normals
                var x
                for (x in normals) {
                  if (normals[x] === 4) {
                    vm.formatStatus = 4
                    if (dataFormat.others) {
                      vm.paramForm.formatOther = dataFormat.others
                    }
                    break
                  }
                }
              }
            }

            if (rsp.otherInfo) {
              vm.paramForm.remarks = rsp.otherInfo
            }

            if (rsp.skill) {
              vm.paramForm.skill = rsp.skill
            }

            if (rsp.criterion) {
              vm.paramForm.criterion = rsp.criterion
            }

            if (rsp.avalibility) {
              vm.paramForm.qualified = rsp.avalibility
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
            '/api/push-project-baseinfo/text',
            {
              taskid: vm.projectid,
              dataFormat: {
                normals: vm.paramForm.format, // 文件格式
                others: vm.paramForm.formatOther
              },
              qualified: vm.paramForm.qualified, // 合格标准
              remarks: vm.paramForm.remarks, // 备注
              skill: vm.paramForm.skill, // 技能
              criterion: vm.paramForm.criterion // 有效数据判断准则
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
                util.Redirect('/push-project-qcprice/text/' + vm.projectid, 1000)
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
      util.Redirect('/push-project-business/text/' + this.projectid, 1000)
    },
    formatClick (value) {
      let x
      for (x in value) {
        if (value[x] === 4) {
          this.formatStatus = 4
          return
        }
      }
      this.formatStatus = 1
    }
  }
}
</script>

<style>
/* footer 固定在页面底部 */
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
label {
  color: #606266;
  font-size: 14px;
}
.container {
  flex: 1 0 auto;
  margin-bottom: 50px;
}
.navbar {
  flex-direction: row;
}
.task {
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 1px 2px hsla(165, 9%, 74%, 0.95);
  margin-bottom: 20px;
  padding: 30px 10px 60px 10px;
}
.infoTit {
  margin: 48px -65px;
}
.infoTit h2 {
  font-size: 1.5rem;
  line-height: 2.25rem;
  padding-bottom: 20px;
  padding-top: 20px;
  color: #555;
}
.taskInfo {
  padding-left: 50px;
  padding-right: 50px;
}
.taskInfo .taskTit {
  border-bottom: 1px dashed #ccc;
  margin-bottom: 2rem;
}
.taskInfo h3 {
  border-left: 5px solid #5788cd;
  font-size: 1.25rem;
  text-indent: 0.5rem;
  line-height: 1.1rem;
  margin-bottom: 1rem;
  margin-top: 1rem;
}
.taskInfos {
  padding-right: 10px;
}
.task-submit {
  position: relative;
  margin-top: 50px;
}
.task-submit .el-form-item__content {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin-left: 0 !important;
}
span.annotation-lines {
  width: 100%;
  border: 1px solid #ccc;
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
</style>

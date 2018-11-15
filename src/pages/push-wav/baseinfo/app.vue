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
                <h3>{{$t("pushWav.baseinfo.dataSource")}}</h3>
              </div>
              <div class="taskInfos">
                <!-- <p>请选择数据源的来源</p> -->
                <!-- <el-tabs v-model="dataActive"  @tab-click="handleClick">
                  <el-tab-pane label="我有数据源" name="first">
                    <div> -->
                      <el-form-item :label="$t('pushWav.baseinfo.language')" prop="language">
                        <el-select v-model="paramForm.language" :placeholder="$t('pushWav.baseinfo.languageNote')">
                          <el-option :label="$t('pushWav.baseinfo.english')" value="English"></el-option>
                          <el-option :label="$t('pushWav.baseinfo.chinese')" value="Chinese"></el-option>
                          <el-option :label="$t('pushWav.baseinfo.others')" value="Others"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="" prop="languageOther" v-if="paramForm.language === 'Others'">
                        <el-input type="text" v-model="paramForm.languageOther" :placeholder="$t('pushWav.baseinfo.othersLang')" ></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('pushWav.baseinfo.standard')" prop="standard" >
                        <el-radio-group v-model="paramForm.standard" @change="standardClick" >
                          <el-radio :label=1>{{$t("pushWav.baseinfo.yes")}}</el-radio>
                          <el-radio :label=2>{{$t("pushWav.baseinfo.no")}}</el-radio>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item label="" prop="nonStandardType" v-if="standardStatus === 2">
                        <el-input type="text" v-model="paramForm.nonStandardType" :placeholder="$t('pushWav.baseinfo.othersStandard')" ></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('pushWav.baseinfo.content')" prop="contentType">
                        <el-checkbox-group v-model="paramForm.contentType" @change="conTypeClick">
                          <el-checkbox :label=1 name="contentType">{{$t("pushWav.baseinfo.history")}}</el-checkbox>
                          <el-checkbox :label=2 name="contentType">{{$t("pushWav.baseinfo.education")}}</el-checkbox>
                          <el-checkbox :label=3 name="contentType">{{$t("pushWav.baseinfo.technology")}}</el-checkbox>
                          <el-checkbox :label=4 name="contentType">{{$t("pushWav.baseinfo.others")}}</el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                      <el-form-item label="" prop="contentTypeOther" v-if="conTypeStatus === 4">
                        <el-input type="text" v-model="paramForm.contentTypeOther" :placeholder="$t('pushWav.baseinfo.otherContent')" ></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('pushWav.baseinfo.scene')" prop="scene">
                        <el-checkbox-group v-model="paramForm.scene" @change="sceneClick">
                          <el-checkbox :label=1 name="scene">{{$t("pushWav.baseinfo.sceneType1")}}</el-checkbox>
                          <el-checkbox :label=2 name="scene">{{$t("pushWav.baseinfo.sceneType2")}}</el-checkbox>
                          <el-checkbox :label=3 name="scene">{{$t("pushWav.baseinfo.sceneType3")}}</el-checkbox>
                          <el-checkbox :label=4 name="scene">{{$t("pushWav.baseinfo.others")}}</el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                      <el-form-item label="" prop="sceneOther" v-if="sceneStatus === 4">
                        <el-input type="text" v-model="paramForm.sceneOther" :placeholder="$t('pushWav.baseinfo.oherScene')" ></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('pushWav.baseinfo.frequency')" prop="frequency">
                        <el-select v-model="paramForm.frequency" :placeholder="$t('pushWav.baseinfo.frequencyNote')">
                          <el-option label="8kHZ" value="8kHZ"></el-option>
                          <el-option label="16kHZ" value="16kHZ"></el-option>
                          <el-option label="44.1kHZ" value="44.1kHZ"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item :label="$t('pushWav.baseinfo.depth')" prop="depth">
                        <el-select v-model="paramForm.depth" :placeholder="$t('pushWav.baseinfo.depthNote')">
                          <el-option label="8bit" value="8bit"></el-option>
                          <el-option label="16bit" value="16bit"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item :label="$t('pushWav.baseinfo.wavRadio')" prop="wavRadio" >
                        <el-radio-group v-model="paramForm.wavRadio">
                          <el-radio :label=1>{{$t("pushWav.baseinfo.wavRadio1")}}</el-radio>
                          <el-radio :label=2>{{$t("pushWav.baseinfo.wavRadio2")}}</el-radio>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item :label="$t('pushWav.baseinfo.format')" prop="format">
                        <el-checkbox-group v-model="paramForm.format" @change="formatClick">
                          <el-checkbox :label=1 name="format">wav</el-checkbox>
                          <el-checkbox :label=2 name="format">mp3</el-checkbox>
                          <el-checkbox :label=3 name="format">{{$t("pushWav.baseinfo.others")}}</el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                      <el-form-item label="" prop="formatOther" v-if="formatStatus === 3">
                        <el-input type="text" v-model="paramForm.formatOther" :placeholder="$t('pushWav.baseinfo.formatOther')" ></el-input>
                      </el-form-item>
                      <!-- <el-form-item label="数据规模" prop="scale">
                        <el-select v-model="paramForm.scale" placeholder="请选择数据规模">
                          <el-option label="<100M" value="100M"></el-option>
                          <el-option label="100M~1G" value="1G"></el-option>
                          <el-option label="1G~10G" value="10G"></el-option>
                          <el-option label="10G~100G" value="100G"></el-option>
                          <el-option label="100G~1T" value="1T"></el-option>
                          <el-option label=">1T" value="10T"></el-option>
                        </el-select>
                      </el-form-item> -->
                    <!-- </div>
                  </el-tab-pane>
                  <el-tab-pane label="我没有,要数据采集" name="second"></el-tab-pane>
                </el-tabs> -->
              </div>

              <div class="taskTit">
                <h3>{{$t("pushWav.baseinfo.remarks")}}</h3>
              </div>
              <div class="taskInfos">
                <el-form-item :label="$t('pushWav.baseinfo.remarks')">
                  <el-input type="textarea" :rows="5" v-model="paramForm.remarks"></el-input>
                </el-form-item>
              </div>
              <div class="taskTit">
                <h3>{{$t("pushWav.baseinfo.skillTitle")}}</h3>
              </div>
              <div class="taskInfos">
                <el-form-item :label="$t('pushWav.baseinfo.skill')" prop="skill">
                  <el-input type="text" v-model="paramForm.skill"></el-input>
                </el-form-item>
              </div>
              <div class="taskTit">
                <h3>{{$t("pushWav.baseinfo.qualifiedTitle")}}</h3>
              </div>
              <div class="taskInfos">
                <el-form-item :label="$t('pushWav.baseinfo.qualified')" prop="qualified">
                  <el-input type="textarea" :rows="5" v-model="paramForm.qualified"></el-input>
                </el-form-item>
              </div>
              <div class="taskTit">
                <h3>{{$t("pushWav.baseinfo.criterionTitle")}}</h3>
              </div>
              <div class="taskInfos">
                <el-form-item :label="$t('pushWav.baseinfo.criterion')" prop="criterion">
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
      dataActive: 'first',
      // 显示与隐藏的相关状态
      standardStatus: 1,
      conTypeStatus: 1,
      sceneStatus: 1,
      formatStatus: 1,
      checkStatus: 2,
      // 表单验证
      paramForm: {
        language: '', // 语言语种
        languageOther: '', // 其他语种
        standard: '',
        nonStandardType: '',
        otherLanguage: '',
        contentType: [], // 内容类型
        contentTypeOther: '',
        scene: [], // 场景类别
        sceneOther: '',
        frequency: '', // 音频采样率
        depth: '', // 采样深度
        wavRadio: 0, // 音频通道
        format: [], // 文件格式
        formatOther: '',
        scale: '',
        qualified: '',
        remarks: '',
        skill: '', // 技能
        criterion: ''
      },
      rules: {
        language: [{ required: true, message: language('pushWav.baseinfo.js.rules.language'), trigger: 'change' }],
        languageOther: [
          { required: true, message: language('pushWav.baseinfo.js.rules.languageOther'), trigger: 'blur' }
        ],
        standard: [{ required: true, message: language('pushWav.baseinfo.js.rules.standard'), trigger: 'change' }],
        contentTypeOther: [
          { required: true, message: language('pushWav.baseinfo.js.rules.contentTypeOther'), trigger: 'blur' }
        ],
        format: [
          {
            type: 'array',
            required: true,
            message: language('pushWav.baseinfo.js.rules.format'),
            trigger: 'change'
          }
        ],
        formatOther: [{ required: true, message: language('pushWav.baseinfo.js.rules.formatOther'), trigger: 'blur' }],
        qualified: [{ required: true, message: language('pushWav.baseinfo.js.rules.qualified'), trigger: 'blur' }],
        skill: [{ required: true, message: language('pushWav.baseinfo.js.rules.skill'), trigger: 'blur' }],
        criterion: [{ required: true, message: language('pushWav.baseinfo.js.rules.criterion'), trigger: 'blur' }]
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
      if (projectid !== '') {
        vm.projectid = projectid
      }
      // 获取基本信息（可能是新建任务后，自动跳转过来，也可能是从控制台跳转过来）
      let xsrftoken = $('meta[name=_xsrf]').attr('content')
      axios
        .post(
          '/api/get-project-baseinfo/wav',
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
            if (rsp.language) {
              let language = rsp.language
              // 这种配置型文件可以考虑写到clweb层，通过后端返回数据来构建前端
              if (language.kind) {
                switch (language.kind) {
                  case 1:
                    vm.paramForm.language = 'Others'
                    if (language.otherLanguage) {
                      vm.paramForm.languageOther = language.otherLanguage
                    }
                    break
                  case 2:
                    vm.paramForm.language = 'Chinese'
                    break
                  case 3:
                    vm.paramForm.language = 'English'
                    break
                  default:
                    console.log('language err')
                }
              }
              if (language.standard) {
                vm.paramForm.standard = language.standard
                if (language.nonStandardType) {
                  vm.paramForm.nonStandardType = language.nonStandardType
                }
              }
            }

            if (rsp.contentType) {
              let contentType = rsp.contentType
              if (contentType.normals) {
                let normals = contentType.normals
                vm.paramForm.contentType = normals
                let x
                for (x in normals) {
                  if (normals[x] === 4) {
                    vm.conTypeStatus = 4
                    if (contentType.others) {
                      vm.paramForm.contentTypeOther = contentType.others
                    }
                    break
                  }
                }
              }
            }

            if (rsp.envType) {
              let envType = rsp.envType
              if (envType.normals) {
                let normals = envType.normals
                vm.paramForm.scene = normals
                let x
                for (x in normals) {
                  if (normals[x] === 4) {
                    vm.sceneStatus = 4
                    if (envType.others) {
                      vm.paramForm.sceneOther = envType.others
                    }
                    break
                  }
                }
              }
            }

            if (rsp.dataParams) {
              if (rsp.dataParams.frequency) {
                switch (rsp.dataParams.frequency) {
                  case 1:
                    vm.paramForm.frequency = '8kHZ'
                    break
                  case 2:
                    vm.paramForm.frequency = '16kHZ'
                    break
                  case 3:
                    vm.paramForm.frequency = '44.1kHZ'
                    break
                  default:
                    console.log('frequency err')
                }
              }

              if (rsp.dataParams.depth) {
                switch (rsp.dataParams.depth) {
                  case 1:
                    vm.paramForm.depth = '8bit'
                    break
                  case 2:
                    vm.paramForm.depth = '16bit'
                    break
                  default:
                    console.log('depth err')
                }
              }

              if (rsp.dataParams.wavRadio) {
                vm.paramForm.wavRadio = rsp.dataParams.wavRadio
              }
            }

            if (rsp.dataFormat) {
              let dataFormat = rsp.dataFormat
              if (rsp.dataFormat.normals) {
                let normals = rsp.dataFormat.normals
                vm.paramForm.format = normals
                var x
                for (x in normals) {
                  if (normals[x] === 3) {
                    vm.formatStatus = 3
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
            '/api/push-project-baseinfo/wav',
            {
              taskid: vm.projectid,
              language: {
                kind: vm.paramForm.language, // 语言语种
                otherLanguage: vm.paramForm.languageOther, // 其他语言
                standard: Number(vm.paramForm.standard), // 是否为标准
                nonStandardType: vm.paramForm.nonStandardType // 非标准类型
              },
              contentType: {
                normals: vm.paramForm.contentType,
                others: vm.paramForm.contentTypeOther
              },
              envType: {
                normals: vm.paramForm.scene, // 场景类别
                others: vm.paramForm.sceneOther
              },
              dataParams: {
                frequency: vm.paramForm.frequency, // 音频采样率
                depth: vm.paramForm.depth, // 采样深度
                wavRadio: vm.paramForm.wavRadio // 音频通道
              },
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
                util.Redirect('/push-project-qcprice/wav/' + vm.projectid, 1000)
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
      util.Redirect('/push-project-business/wav/' + this.projectid, 1000)
    },
    standardClick (value) {
      this.standardStatus = value
    },
    conTypeClick (value) {
      let x
      for (x in value) {
        if (value[x] === 4) {
          this.conTypeStatus = 4
          return
        }
      }
      this.conTypeStatus = 1
    },
    sceneClick (value) {
      let x
      for (x in value) {
        if (value[x] === 4) {
          this.sceneStatus = 4
          return
        }
      }
      this.sceneStatus = 1
    },
    formatClick (value) {
      let x
      for (x in value) {
        if (value[x] === 3) {
          this.formatStatus = 3
          return
        }
      }
      this.formatStatus = 1
    }
    // ,
    // checkClick(value) {
    //   this.checkStatus=value;
    // }
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
  /* text-align: center; */
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
  /*padding-left: 5px;*/
  padding-right: 10px;
}
.taskInfos p {
  color: #ccc;
}
.el-date-editor .el-range-separator {
  width: 8%;
}
.el-tabs__nav-wrap::after {
  background-color: transparent;
}
.el-tabs__content {
  padding-left: 15px;
}
.el-tag + .el-tag {
  margin-top: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.el-tag {
  background-color: transparent;
  display: inline-block;
  height: auto;
}
.el-tabs.el-tabs--top {
  padding-left: 30px;
  padding-bottom: 1rem;
}
.add.el-tabs.el-tabs--card.el-tabs--top {
  padding-bottom: 60px;
}
.add label > i {
  color: red;
  margin-right: 3px;
}
.text {
  font-size: 14px;
}
.item {
  padding: 18px 0;
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
.message {
  background: #fff;
  position: fixed;
  top: 3rem;
  left: 4rem;
  right: 4rem;
  bottom: 3rem;
  z-index: 1050;
  overflow: auto;
  border-radius: 0.5rem 0 0 0.5rem;
  box-shadow: 0 2px 52px 0 rgba(0, 0, 0, 0.5);
  border: 1px solid #ebeef5;
}
.message .mb-5 {
  padding-top: 2rem;
}
.message i {
  position: absolute;
  cursor: pointer;
  font-size: 24px;
  right: 0.8rem;
  top: 0.8rem;
  color: #d1d4dc;
}
.messageInLab {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
.messageInLab > span {
  padding-right: 0.3rem;
  color: #777;
  letter-spacing: 2px;
  font-size: 14px;
}
span.annotation-lines {
  width: 100%;
  border: 1px solid #ccc;
}
/*滚动条样式*/
.message::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
.message::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.message::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
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

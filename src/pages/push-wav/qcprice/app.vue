<template>
  <div id="main">
    <Header/>
    <div class="time-axis">
      <el-steps align-center :active="3" >
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
                <h3>{{$t("pushWav.qcprice.scale")}}</h3>
              </div>
              <div class="taskInfos">
                <el-form-item :label="$t('pushWav.qcprice.voiceNum')">
                  <el-col :span="8">
                    <el-form-item prop="num">
                      <el-row :gutter="20">
                        <el-col :span="19" style="padding-left:0"><el-input v-model.number="paramForm.num"></el-input></el-col>
                        <el-col :span="5" >{{$t("pushWav.qcprice.num")}}</el-col>
                      </el-row>
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item prop="hour">
                      <el-row :gutter="20">
                        <el-col :span="9" style="padding-left:0"><el-input v-model.number="paramForm.hour"></el-input></el-col>
                        <el-col :span="15">{{$t("pushWav.qcprice.hour")}}</el-col>
                      </el-row>
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <!-- <el-form-item label="数据大小" prop="scale">
                  <el-row :gutter="20">
                    <el-col :span="6"><el-input v-model.number="paramForm.scale"></el-input></el-col>
                    <el-col :span="6">GB</el-col>
                  </el-row>
                </el-form-item> -->
                <el-form-item :label="$t('pushWav.qcprice.voiceQuality')" prop="voiceQuality">
                  <el-select v-model="paramForm.voiceQuality" :placeholder="$t('pushWav.qcprice.voiceQuaNote')">
                    <el-option
                      v-for="item in qualityOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-tooltip effect="dark" placement="top-start" class="mar-left-10">
                    <i class="el-icon-question forHelp"></i>
                    <div v-html="helpinfo.checkTypeHelpInfo" slot="content"></div>
                  </el-tooltip>
                </el-form-item>
                <el-form-item :label="$t('pushWav.qcprice.taskTime')" prop="taskTime">
                  <el-row :gutter="20">
                    <el-col :span="6" style="padding-left:0"><el-input v-model.number="paramForm.taskTime"></el-input></el-col>
                    <el-col :span="6">{{$t("pushWav.qcprice.minute")}}</el-col>
                  </el-row>
                </el-form-item>
              </div>
              <div class="taskTit">
                <h3>{{$t("pushWav.qcprice.checkType")}}</h3>
              </div>
              <div class="taskInfos">
                <el-form-item :label="$t('pushWav.qcprice.checkType2')" prop="checkType">
                  <el-select v-model.number="paramForm.checkType" :placeholder="$t('pushWav.qcprice.checkTypeNote')">
                    <el-option
                      v-for="item in checkOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-tooltip effect="dark" placement="top-start" class="mar-left-10">
                    <i class="el-icon-question forHelp"></i>
                    <div v-html="helpinfo.checkTypeHelpInfo" slot="content"></div>
                  </el-tooltip>
                </el-form-item>
                <div class="spot-check" v-if = "paramForm.checkType === 1">
                  <el-form-item :label="$t('pushWav.qcprice.checkProportion1')" prop="checkProportion">
                    <el-row :gutter="20">
                      <el-col :span="6" style="padding-left:0"><el-input v-model.number="paramForm.checkProportion"></el-input></el-col>
                      <el-col :span="16">{{$t("pushWav.qcprice.checkProportion2")}}</el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item :label="$t('pushWav.qcprice.spotCheck1')" prop="spotCheck">
                    <el-row :gutter="20">
                      <el-col :span="6" style="padding-left:0"><el-input v-model.number="paramForm.spotCheck"></el-input></el-col>
                      <el-col :span="16">{{$t("pushWav.qcprice.spotCheck2")}}</el-col>
                    </el-row>
                  </el-form-item>
                  <p class="fh-prompt">{{$t("pushWav.qcprice.spotCheck3")}}{{spotCheckHour}}{{$t("pushWav.qcprice.spotCheck4")}}{{checkMoney}}{{$t("pushWav.qcprice.spotCheck5")}}</p>
                </div>
                <div class="all-check" v-if = "paramForm.checkType === 2">
                  <el-form-item :label="$t('pushWav.qcprice.checkProportion1')" prop="checkProportion">
                    <el-row :gutter="20">
                      <el-col :span="6" style="padding-left:0"><el-input v-model.number="paramForm.checkProportion"></el-input></el-col>
                      <el-col :span="16">{{$t("pushWav.qcprice.checkProportion2")}}</el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item :label="$t('pushWav.qcprice.allCheckNum1')" prop="allCheckNum">
                    <el-row :gutter="20">
                      <el-col :span="6" style="padding-left:0"><el-input v-model.number="paramForm.allCheckNum"></el-input></el-col>
                      <el-col :span="16">{{$t("pushWav.qcprice.allCheckNum2")}}</el-col>
                    </el-row>
                  </el-form-item>
                  <p class="fh-prompt">{{$t("pushWav.qcprice.allCheckNum3")}}{{allCheckHour}}{{$t("pushWav.qcprice.allCheckNum4")}}{{checkMoney}}{{$t("pushWav.qcprice.allCheckNum5")}}</p>
                </div>
                <div class="right-answer" v-if = "paramForm.checkType === 3">
                  <el-form-item :label="$t('pushWav.qcprice.rightAnswer1')" prop="rightAnswer">
                    <el-row :gutter="20">
                      <el-col :span="6" style="padding-left:0"><el-input v-model.number="paramForm.rightAnswer"></el-input></el-col>
                      <el-col :span="16">{{$t("pushWav.qcprice.rightAnswer2")}}</el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item :label="$t('pushWav.qcprice.tagNumber1')" prop="tagNumber">
                    <el-row :gutter="20">
                      <el-col :span="6" style="padding-left:0"><el-input v-model.number="paramForm.tagNumber"></el-input></el-col>
                      <el-col :span="16">{{$t("pushWav.qcprice.tagNumber2")}}</el-col>
                    </el-row>
                  </el-form-item>
                  <p class="fh-prompt">{{$t("pushWav.qcprice.tagNumber3")}}{{accDoMinHour}}{{$t("pushWav.qcprice.tagNumber4")}}</p>
                  <p class="fh-prompt">{{$t("pushWav.qcprice.tagNumber5")}}{{accDoMaxHour}}{{$t("pushWav.qcprice.tagNumber4")}}</p>
                </div>
                <div class="gold-test" v-if = "paramForm.checkType === 4">
                  <el-form-item :label="$t('pushWav.qcprice.goldTest1')" prop="goldTest">
                    <el-row :gutter="20">
                      <el-col :span="6" style="padding-left:0"><el-input v-model.number="paramForm.goldTest"></el-input></el-col>
                      <el-col :span="16">{{$t("pushWav.qcprice.spotCheck2")}}</el-col>
                    </el-row>
                  </el-form-item>
                  <p class="fh-prompt">{{$t("pushWav.qcprice.goldTest2")}}{{goldHitDoHour}}{{$t("pushWav.qcprice.tagNumber4")}}</p>
                </div>
              </div>
              <div class="taskTit">
                <h3>{{$t("pushWav.qcprice.price1")}}</h3>
              </div>
              <div class="taskInfos">
                <!-- <p class="fh-prompt">建议价格【{{Math.ceil(paramForm.taskTime/60 * 40)}}积分/小时】</p> -->
                <p class="fh-prompt">{{$t("pushWav.qcprice.price2")}}{{this.suggestOffer}}{{$t("pushWav.qcprice.allCheckNum5")}}</p>
                <p class="fh-prompt">{{$t("pushWav.qcprice.price3")}}{{this.minOffer}}{{$t("pushWav.qcprice.allCheckNum5")}}</p>
                <el-form-item :label="$t('pushWav.qcprice.offer1')" prop="offer">
                  <el-row :gutter="20">
                    <el-col :span="6" style="padding-left:0"><el-input v-model.number="paramForm.offer"></el-input></el-col>
                    <el-col :span="6">{{$t("pushWav.qcprice.offer2")}}</el-col>
                  </el-row>
                </el-form-item>
                <p class="fh-prompt fh-sum" v-show = "checkSum !== 0">{{$t("pushWav.qcprice.sum1")}}{{checkSum}}{{$t("pushWav.qcprice.sum2")}}</p>
                <p class="fh-prompt fh-sum">{{$t("pushWav.qcprice.sum3")}}{{sum}}{{$t("pushWav.qcprice.sum2")}}</p>
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
import helpinfo from './help-info'
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
      checkNumner: '',
      helpinfo: helpinfo,
      // 表单验证
      paramForm: {
        num: '', // 条数
        hour: '', // 总时长
        scale: '', // 数据大小
        voiceQuality: '', // 音频质量
        taskTime: '', // 任务预估时间
        checkType: '', // 质检方式
        checkProportion: '', // 审核价格比例
        spotCheck: '', // 抽检
        allCheckNum: '', // 全检次数
        rightAnswer: '', // 累计答案
        tagNumber: '', // 标注人数
        goldTest: '', // 黄金检查
        offer: ''
      },
      qualityOptions: [{
        value: 1,
        label: '高'
      }, {
        value: 2,
        label: '中'
      }, {
        value: 3,
        label: '低'
      }],
      checkOptions: [{
        value: 0,
        label: '无'
      }, {
        value: 1,
        label: '抽检'
      }, {
        value: 2,
        label: '全检'
      }, {
        value: 3,
        label: '累计正确答案'
      }, {
        value: 4,
        label: '黄金检验'
      }],
      rules: {
        num: [
          {required: true, message: language('pushWav.qcprice.js.rules.num1')},
          {type: 'number', message: language('pushWav.qcprice.js.rules.num2')}
        ],
        hour: [
          {required: true, message: language('pushWav.qcprice.js.rules.hour1')},
          {type: 'number', message: language('pushWav.qcprice.js.rules.hour2')}
        ],
        scale: [
          {required: true, message: language('pushWav.qcprice.js.rules.scale1')},
          {type: 'number', message: language('pushWav.qcprice.js.rules.scale2')}
        ],
        voiceQuality: [
          {required: true, message: language('pushWav.qcprice.js.rules.voiceQuality'), trigger: 'blur'}
        ],
        taskTime: [
          {required: true, message: language('pushWav.qcprice.js.rules.taskTime1')},
          {type: 'number', message: language('pushWav.qcprice.js.rules.taskTime2')}
        ],
        checkType: [
          {required: true, message: language('pushWav.qcprice.js.rules.checkType'), trigger: 'blur'}
        ],
        checkProportion: [
          {required: true, message: language('pushWav.qcprice.js.rules.checkProportion1')},
          {type: 'number', message: language('pushWav.qcprice.js.rules.checkProportion2')}
        ],
        spotCheck: [
          {required: true, message: language('pushWav.qcprice.js.rules.spotCheck1')},
          {type: 'number', message: language('pushWav.qcprice.js.rules.spotCheck2')}
        ],
        allCheckNum: [
          {required: true, message: language('pushWav.qcprice.js.rules.allCheckNum1')},
          {type: 'number', message: language('pushWav.qcprice.js.rules.allCheckNum2')}
        ],
        rightAnswer: [
          {required: true, message: language('pushWav.qcprice.js.rules.rightAnswer1')},
          {type: 'number', message: language('pushWav.qcprice.js.rules.rightAnswer2')}
        ],
        tagNumber: [
          {required: true, message: language('pushWav.qcprice.js.rules.tagNumber1')},
          {type: 'number', message: language('pushWav.qcprice.js.rules.tagNumber2')}
        ],
        goldTest: [
          {required: true, message: language('pushWav.qcprice.js.rules.goldTest1')},
          {type: 'number', message: language('pushWav.qcprice.js.rules.goldTest2')}
        ],
        offer: [
          {required: true, message: language('pushWav.qcprice.js.rules.offer1')},
          {type: 'number', message: language('pushWav.qcprice.js.rules.offer2')}
        ]
      }
    }
  },
  computed: {
    suggestOffer () {
      return 2000
    },
    minOffer () {
      return 1600
    },
    checkMoney () {
      return Math.ceil(this.paramForm.offer * this.paramForm.checkProportion * 0.01)
    },
    spotCheckHour () {
      return Math.ceil(this.paramForm.hour * this.paramForm.spotCheck * 0.01)
    },
    allCheckHour () {
      return this.paramForm.hour * this.paramForm.allCheckNum
    },
    accDoMinHour () {
      return this.paramForm.rightAnswer * this.paramForm.hour
    },
    accDoMaxHour () {
      return this.paramForm.tagNumber * this.paramForm.hour
    },
    goldHitDoHour () {
      return (1 + this.paramForm.goldTest * 0.01) * this.paramForm.hour
    },
    checkSum () {
      if (this.paramForm.checkType === 1) {
        return this.spotCheckHour * this.checkMoney
      } else if (this.paramForm.checkType === 2) {
        return this.allCheckHour * this.checkMoney
      } else if (this.paramForm.checkType === 3) {
        return 0
      } else if (this.paramForm.checkType === 4) {
        return 0
      } else if (this.paramForm.checkType === 0 || this.paramForm.checkType === '') {
        return 0
      }
    },
    sum () {
      if (this.paramForm.checkType === 1) {
        return Math.ceil(this.checkSum + this.paramForm.offer * this.paramForm.hour)
      } else if (this.paramForm.checkType === 2) {
        return Math.ceil(this.checkSum + this.paramForm.offer * this.paramForm.hour)
      } else if (this.paramForm.checkType === 3) {
        return Math.ceil(this.paramForm.offer * this.accDoMaxHour)
      } else if (this.paramForm.checkType === 4) {
        return Math.ceil(this.paramForm.offer * this.goldHitDoHour)
      } else if (this.paramForm.checkType === 0 || this.paramForm.checkType === '') {
        return Math.ceil(this.paramForm.offer * this.paramForm.hour)
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
      // let projectid = 'sub8bejjPW8001'
      if (projectid !== '') {
        vm.projectid = projectid
      }
      // 获取基本信息（可能是新建任务后，自动跳转过来，也可能是从控制台跳转过来）
      let xsrftoken = $('meta[name=_xsrf]').attr('content')
      axios
        .post(
          '/api/get-project-qcprice/wav',
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
            if (rsp.dataScale) {
              if (rsp.dataScale.count) {
                vm.paramForm.num = rsp.dataScale.count
              }
              if (rsp.dataScale.totalTimeLen) {
                vm.paramForm.hour = rsp.dataScale.totalTimeLen
              }
              if (rsp.dataScale.totalSize) {
                vm.paramForm.scale = rsp.dataScale.totalSize
              }
              if (rsp.dataScale.Quality) {
                vm.paramForm.voiceQuality = rsp.dataScale.Quality
              }
            }
            if (rsp.timeCost) {
              vm.paramForm.taskTime = rsp.timeCost
            }
            if (rsp.qualityCheck) {
              switch (rsp.qualityCheck.checkType) {
                case 0:
                  vm.paramForm.checkType = rsp.qualityCheck.checkType
                  break
                case 1:
                  vm.paramForm.checkType = rsp.qualityCheck.checkType
                  if (rsp.qualityCheck.QCRandSelect.checkPay) {
                    vm.paramForm.checkProportion = rsp.qualityCheck.QCRandSelect.checkPay
                  }
                  if (rsp.qualityCheck.QCRandSelect.percent) {
                    vm.paramForm.spotCheck = rsp.qualityCheck.QCRandSelect.percent
                  }
                  break
                case 2:
                  vm.paramForm.checkType = rsp.qualityCheck.checkType
                  if (rsp.qualityCheck.QCAllCheck.checkPay) {
                    vm.paramForm.checkProportion = rsp.qualityCheck.QCAllCheck.checkPay
                  }
                  if (rsp.qualityCheck.QCAllCheck.checkTime) {
                    vm.paramForm.allCheckNum = rsp.qualityCheck.QCAllCheck.checkTime
                  }
                  break
                case 3:
                  vm.paramForm.checkType = rsp.qualityCheck.checkType
                  if (rsp.qualityCheck.QCAccAnswer.acc) {
                    vm.paramForm.rightAnswer = rsp.qualityCheck.QCAccAnswer.acc
                  }
                  if (rsp.qualityCheck.QCAccAnswer.maxDo) {
                    vm.paramForm.tagNumber = rsp.qualityCheck.QCAccAnswer.maxDo
                  }
                  break
                case 4:
                  vm.paramForm.checkType = rsp.qualityCheck.checkType
                  if (rsp.qualityCheck.QCGoldHit.percent) {
                    vm.paramForm.goldTest = rsp.qualityCheck.QCGoldHit.percent
                  }
                  break
                default:
                  vm.paramForm.checkType = 0
                  break
              }
            }
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

        let QCSetting = {}
        let checkCode = 0
        switch (vm.paramForm.checkType) {
          case 0:
            checkCode = 0
            break
          case 1:
            checkCode = 1
            QCSetting = {
              QCRandSelect: {
                percent: vm.paramForm.spotCheck,
                checkPay: vm.paramForm.checkProportion
              }
            }
            break
          case 2:
            checkCode = 2
            QCSetting = {
              QCAllCheck: {
                checkPay: vm.paramForm.checkProportion,
                checkTime: vm.paramForm.allCheckNum
              }
            }
            break
          case 3:
            checkCode = 3
            QCSetting = {
              QCAccAnswer: {
                Acc: vm.paramForm.rightAnswer,
                maxDo: vm.paramForm.tagNumber
              }
            }
            break
          case 4:
            checkCode = 4
            QCSetting = {
              QCGoldHit: {
                percent: vm.paramForm.goldTest
              }
            }
            break
          default:
            return
        }

        axios
          .post(
            '/api/push-project-qcprice/wav',
            {
              taskid: vm.projectid,
              count: vm.paramForm.num, // 条数
              totalTimeLen: vm.paramForm.hour, // 总时长
              Quality: vm.paramForm.voiceQuality, // 质量
              checkType: checkCode, // 质检类型
              QCSetting: QCSetting,
              price: vm.paramForm.offer,
              timeCost: vm.paramForm.taskTime
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
                util.Redirect('/push-project-sample/wav/' + vm.projectid, 1000)
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
      util.Redirect('/push-project-baseinfo/wav/' + this.projectid, 1000)
    }
  }
}
</script>

<style>
#main {
  height: 100%;
}
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
  margin-bottom: 50px;
}
.navbar {
  flex-direction: row;
}
.mar-left-10{
  margin-left: 10px;
}
.forHelp{
  color: #909399;
  font-size: 22px;
}
.task {
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 1px 2px hsla(165, 9%, 74%, 0.95);
  margin-bottom: 20px;
  padding: 30px 10px 60px 10px;
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
.taskInfos p {
  color: #ccc;
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
.taskInfos p.fh-prompt {
  font-size: 14px;
  margin-bottom: 0.5rem;
  margin-left: 40px;
  color: #909399;
}
.taskInfos p.fh-prompt.fh-sum{
  color: #E6A23C
}
</style>

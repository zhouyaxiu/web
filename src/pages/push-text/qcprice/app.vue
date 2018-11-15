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
                <h3>{{$t("pushtext.qcprice.datascale")}}</h3>
              </div>
              <div class="taskInfos">
                <el-form-item :label="$t('pushtext.qcprice.picturenum')">
                  <el-col :span="8">
                    <el-form-item prop="num">
                      <el-row :gutter="20">
                        <el-col :span="19" style="padding-left:0"><el-input v-model.number="paramForm.num"></el-input></el-col>
                        <el-col :span="5" >{{$t("pushtext.qcprice.zhang")}}</el-col>
                      </el-row>
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-form-item :label="$t('pushtext.qcprice.picturequality')" prop="thisQuality">
                  <el-select v-model="paramForm.thisQuality" :placeholder="$t('pushtext.qcprice.selectpicquality')">
                    <el-option
                      v-for="item in qualityOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-tooltip effect="dark" placement="top-start" class="mar-left-10">
                    <i class="el-icon-question forHelp"></i>
                    <div v-html="helpinfo.qulityHelpInfo" slot="content"></div>
                  </el-tooltip>
                </el-form-item>
                <el-form-item :label="$t('pushtext.qcprice.estimate')" prop="taskTime">
                  <el-row :gutter="20">
                    <el-col :span="6" style="padding-left:0"><el-input v-model.number="paramForm.taskTime"></el-input></el-col>
                    <el-col :span="6">{{$t("pushtext.qcprice.minute")}}</el-col>
                  </el-row>
                </el-form-item>
              </div>
              <div class="taskTit">
                <h3>{{$t("pushtext.qcprice.qualitytest")}}</h3>
              </div>
              <div class="taskInfos">
                <el-form-item :label="$t('pushtext.qcprice.qualitytest')" prop="checkType">
                  <el-select v-model.number="paramForm.checkType" :placeholder="$t('pushtext.qcprice.selectquatest')">
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
                  <el-form-item :label="$t('pushtext.qcprice.priceratio')" prop="checkProportion">
                    <el-row :gutter="20">
                      <el-col :span="6" style="padding-left:0"><el-input v-model.number="paramForm.checkProportion"></el-input></el-col>
                      <el-col :span="16">%{{$t("pushtext.qcprice.scale")}}</el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item :label="$t('pushtext.qcprice.checkrate')" prop="spotCheck">
                    <el-row :gutter="20">
                      <el-col :span="6" style="padding-left:0"><el-input v-model.number="paramForm.spotCheck"></el-input></el-col>
                      <el-col :span="16">%</el-col>
                    </el-row>
                  </el-form-item>
                  <p class="fh-prompt">{{$t("pushtext.qcprice.spotnumber")}}{{$t("pushtext.qcprice.leftpart")}}{{checkNumber}}{{$t("pushtext.qcprice.zhang")}}{{$t("pushtext.qcprice.rightpart")}}{{$t("pushtext.qcprice.taskprice")}}{{$t("pushtext.qcprice.leftpart")}}{{checkMoney}}{{$t("pushtext.qcprice.integral")}}{{$t("pushtext.qcprice.rightpart")}}</p>
                </div>
                <div class="all-check" v-if = "paramForm.checkType === 2">
                  <el-form-item :label="$t('pushtext.qcprice.priceratio')" prop="checkProportion">
                    <el-row :gutter="20">
                      <el-col :span="6" style="padding-left:0"><el-input v-model.number="paramForm.checkProportion"></el-input></el-col>
                      <el-col :span="16">%{{$t("pushtext.qcprice.scale")}}</el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item :label="$t('pushtext.qcprice.checktimes')" prop="allCheckNum">
                    <el-row :gutter="20">
                      <el-col :span="6" style="padding-left:0"><el-input v-model.number="paramForm.allCheckNum"></el-input></el-col>
                      <el-col :span="16">{{$t("pushtext.qcprice.time")}}</el-col>
                    </el-row>
                  </el-form-item>
                  <p class="fh-prompt">{{$t("pushtext.qcprice.checknumber")}}{{$t("pushtext.qcprice.leftpart")}}{{allCheckNum}}{{$t("pushtext.qcprice.zhang")}}{{$t("pushtext.qcprice.rightpart")}}{{$t("pushtext.qcprice.taskprice")}}{{$t("pushtext.qcprice.leftpart")}}{{checkMoney}}{{$t("pushtext.qcprice.integral")}}{{$t("pushtext.qcprice.rightpart")}}</p>
                </div>
                <div class="right-answer" v-if = "paramForm.checkType === 3">
                  <el-form-item :label="$t('pushtext.qcprice.total')" prop="rightAnswer">
                    <el-row :gutter="20">
                      <el-col :span="6" style="padding-left:0"><el-input v-model.number="paramForm.rightAnswer"></el-input></el-col>
                      <el-col :span="16">{{$t("pushtext.qcprice.perzhang")}}</el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item :label="$t('pushtext.qcprice.labelnum')" prop="tagNumber">
                    <el-row :gutter="20">
                      <el-col :span="6" style="padding-left:0"><el-input v-model.number="paramForm.tagNumber"></el-input></el-col>
                      <el-col :span="16">{{$t("pushtext.qcprice.moreamount")}}</el-col>
                    </el-row>
                  </el-form-item>
                  <p class="fh-prompt">{{$t("pushtext.qcprice.leastlabel")}}{{$t("pushtext.qcprice.leftpart")}}{{accDoMinNum}}{{$t("pushtext.qcprice.zhang")}}{{$t("pushtext.qcprice.rightpart")}}</p>
                  <p class="fh-prompt">{{$t("pushtext.qcprice.morelabel")}}{{$t("pushtext.qcprice.leftpart")}}{{accDoMaxNum}}{{$t("pushtext.qcprice.zhang")}}{{$t("pushtext.qcprice.rightpart")}}</p>
                </div>
                <div class="gold-test" v-if = "paramForm.checkType === 4">
                  <el-form-item :label="$t('pushtext.qcprice.rate')" prop="goldTest">
                    <el-row :gutter="20">
                      <el-col :span="6" style="padding-left:0"><el-input v-model.number="paramForm.goldTest"></el-input></el-col>
                      <el-col :span="16">%</el-col>
                    </el-row>
                  </el-form-item>
                  <p class="fh-prompt">{{$t("pushtext.qcprice.expectlabel")}}{{$t("pushtext.qcprice.leftpart")}}{{goldHitDoNum}}{{$t("pushtext.qcprice.zhang")}}{{$t("pushtext.qcprice.rightpart")}}</p>
                </div>
              </div>
              <div class="taskTit">
                <h3>{{$t("pushtext.qcprice.quote")}}</h3>
              </div>
              <div class="taskInfos">
                <!-- <p class="fh-prompt">建议价格【{{Math.ceil(paramForm.taskTime/60 * 40)}}积分/张】</p> -->
                <p class="fh-prompt">{{$t("pushtext.qcprice.suggestprice")}}{{$t("pushtext.qcprice.leftpart")}}{{this.suggestOffer}}{{$t("pushtext.qcprice.integral")}}{{$t("pushtext.qcprice.rightpart")}}</p>
                <p class="fh-prompt">{{$t("pushtext.qcprice.leastprice")}}{{$t("pushtext.qcprice.leftpart")}}{{this.minOffer}}{{$t("pushtext.qcprice.integral")}}{{$t("pushtext.qcprice.rightpart")}}</p>
                <el-form-item :label="$t('pushtext.qcprice.unitprice')" prop="offer">
                  <el-row :gutter="20">
                    <el-col :span="6" style="padding-left:0"><el-input v-model.number="paramForm.offer"></el-input></el-col>
                    <el-col :span="6">{{$t("pushtext.qcprice.integral")}}</el-col>
                  </el-row>
                </el-form-item>
                <p class="fh-prompt fh-sum" v-show = "checkSum !== 0">{{$t("pushtext.qcprice.totalprice")}}{{$t("pushtext.qcprice.leftpart")}}{{checkSum}}{{$t("pushtext.qcprice.inter")}}{{$t("pushtext.qcprice.rightpart")}}</p>
                <p class="fh-prompt fh-sum">{{$t("pushtext.qcprice.sumprice")}}【{{sum}}{{$t("pushtext.qcprice.inter")}}】</p>
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
        scale: '', // 数据大小
        thisQuality: '', // 数据质量
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
      checkOptions: [
        {
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
        }
      ],
      rules: {
        num: [
          {required: true, message: language('pushtext.qcprice.js.rules.num1')},
          {type: 'number', message: language('pushtext.qcprice.js.rules.num2')}
        ],
        scale: [
          {required: true, message: language('pushtext.qcprice.js.rules.scale1')},
          {type: 'number', message: language('pushtext.qcprice.js.rules.scale2')}
        ],
        thisQuality: [
          {required: true, message: language('pushtext.qcprice.js.rules.thisQuality'), trigger: 'blur'}
        ],
        taskTime: [
          {required: true, message: language('pushtext.qcprice.js.rules.taskTime1')},
          {type: 'number', message: language('pushtext.qcprice.js.rules.taskTime2')}
        ],
        checkType: [
          {required: true, message: language('pushtext.qcprice.js.rules.checkType'), trigger: 'blur'}
        ],
        checkProportion: [
          {required: true, message: language('pushtext.qcprice.js.rules.checkProportion1')},
          {type: 'number', message: language('pushtext.qcprice.js.rules.checkProportion2')}
        ],
        spotCheck: [
          {required: true, message: language('pushtext.qcprice.js.rules.spotCheck1')},
          {type: 'number', message: language('pushtext.qcprice.js.rules.spotCheck2')}
        ],
        allCheckNum: [
          {required: true, message: language('pushtext.qcprice.js.rules.allCheckNum1')},
          {type: 'number', message: language('pushtext.qcprice.js.rules.allCheckNum2')}
        ],
        rightAnswer: [
          {required: true, message: language('pushtext.qcprice.js.rules.rightAnswer1')},
          {type: 'number', message: language('pushtext.qcprice.js.rules.rightAnswer2')}
        ],
        tagNumber: [
          {required: true, message: language('pushtext.qcprice.js.rules.tagNumber1')},
          {type: 'number', message: language('pushtext.qcprice.js.rules.tagNumber2')}
        ],
        goldTest: [
          {required: true, message: language('pushtext.qcprice.js.rules.goldTest1')},
          {type: 'number', message: language('pushtext.qcprice.js.rules.goldTest2')}
        ],
        offer: [
          {required: true, message: language('pushtext.qcprice.js.rules.offer1')},
          {type: 'number', message: language('pushtext.qcprice.js.rules.offer2')}
        ]
      }
    }
  },
  computed: {
    suggestOffer () {
      return Math.ceil(this.paramForm.taskTime * 2000 / 60)
    },
    minOffer () {
      return Math.ceil(this.paramForm.taskTime * 1600 / 60)
    },
    checkMoney () {
      return Math.ceil(this.paramForm.offer * this.paramForm.checkProportion * 0.01)
    },
    checkNumber () {
      return Math.ceil(this.paramForm.num * this.paramForm.spotCheck * 0.01)
    },
    allCheckNum () {
      return this.paramForm.num * this.paramForm.allCheckNum
    },
    accDoMinNum () {
      return this.paramForm.rightAnswer * this.paramForm.num
    },
    accDoMaxNum () {
      return this.paramForm.tagNumber * this.paramForm.num
    },
    goldHitDoNum () {
      return Math.ceil(this.paramForm.num / (1 - this.paramForm.goldTest * 0.01))
    },
    checkSum () {
      if (this.paramForm.checkType === 1) {
        return this.checkNumber * this.checkMoney
      } else if (this.paramForm.checkType === 2) {
        return this.allCheckNum * this.checkMoney
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
        return Math.ceil(this.checkSum + this.paramForm.num * this.paramForm.offer)
      } else if (this.paramForm.checkType === 2) {
        return Math.ceil(this.checkSum + this.paramForm.offer * this.paramForm.num)
      } else if (this.paramForm.checkType === 3) {
        return Math.ceil(this.paramForm.offer * this.accDoMaxNum)
      } else if (this.paramForm.checkType === 4) {
        return Math.ceil(this.paramForm.offer * this.goldHitDoNum)
      } else if (this.paramForm.checkType === 0 || this.paramForm.checkType === '') {
        return Math.ceil(this.paramForm.offer * this.paramForm.num)
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
          '/api/get-project-qcprice/text',
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
              if (rsp.dataScale.totalSize) {
                vm.paramForm.scale = rsp.dataScale.totalSize
              }
              if (rsp.dataScale.Quality) {
                vm.paramForm.thisQuality = rsp.dataScale.Quality
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
            '/api/push-project-qcprice/text',
            {
              taskid: vm.projectid,
              count: vm.paramForm.num, // 条数
              Quality: vm.paramForm.thisQuality, // 质量
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
                util.Redirect('/push-project-sample/text/' + vm.projectid, 1000)
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
      util.Redirect('/push-project-baseinfo/image/' + this.projectid, 1000)
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

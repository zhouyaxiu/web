<template>
  <div id="main" class="main push-task">
    <Header/>
    <Layout :selStep="4" :active="4" :type="'image'" :projectId="projectId">
      <el-form :model="paramForm" :rules="rules" ref="paramForm" label-position="top" class="demo-paramForm">
        <div class="taskTit">
          <h3>{{$t("pushimage.qcprice.datascale")}}</h3>
        </div>
        <div class="taskInfos">
          <el-form-item :label="$t('pushimage.qcprice.picturenum')">
            <el-form-item prop="num">
              <el-input v-model.number="paramForm.num" style="max-width:200px"></el-input>
              <span class="ml-2">{{$t("pushimage.qcprice.zhang")}}</span>
            </el-form-item>
          </el-form-item>
          <el-form-item :label="$t('pushimage.qcprice.picturequality')" prop="thisQuality">
            <el-select v-model="paramForm.thisQuality" :placeholder="$t('pushimage.qcprice.selectpicquality')">
              <el-option
                v-for="item in qualityOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-tooltip effect="dark" placement="top-start">
              <i class="el-icon-question forHelp ml-2"></i>
              <div v-html="helpinfo.qulityHelpInfo" slot="content"></div>
            </el-tooltip>
          </el-form-item>
          <el-form-item :label="$t('pushimage.qcprice.estimate')" prop="taskTime">
            <el-input v-model.number="paramForm.taskTime" style="max-width:200px"></el-input>
            <span class="ml-2">{{$t("pushimage.qcprice.minute")}}</span>
          </el-form-item>
        </div>
        <div class="taskTit mt-5">
          <h3>{{$t("pushimage.qcprice.qualitytest")}}</h3>
        </div>
        <div class="taskInfos">
          <el-form-item :label="$t('pushimage.qcprice.qualitytest2')" prop="checkType">
            <el-select v-model.number="paramForm.checkType" :placeholder="$t('pushimage.qcprice.selectquatest')">
              <el-option
                v-for="item in checkOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-tooltip effect="dark" placement="top-start" class="mar-left-10">
              <i class="el-icon-question forHelp ml-2"></i>
              <div v-html="helpinfo.checkTypeHelpInfo" slot="content"></div>
            </el-tooltip>
          </el-form-item>
          <el-row  :gutter="20">
            <el-col :span="14">
              <div class="spot-check" v-if = "paramForm.checkType === 1">
                <el-form-item class="mb-1" :label="$t('pushimage.qcprice.priceratio')" prop="checkProportion">
                  <el-input v-model.number="paramForm.checkProportion" style="max-width:200px"></el-input>
                  <span class="ml-2">%</span>
                  <p class="mb-0">{{$t("pushimage.qcprice.scale")}}</p>
                </el-form-item>
                <el-form-item :label="$t('pushimage.qcprice.checkrate')" prop="spotCheck">
                  <el-input v-model.number="paramForm.spotCheck" style="max-width:200px"></el-input>
                  <span class="ml-2">%</span>
                </el-form-item>
              </div>
              <div class="all-check" v-if = "paramForm.checkType === 2">
                <el-form-item class="mb-1" :label="$t('pushimage.qcprice.priceratio')" prop="checkProportion">
                  <el-input v-model.number="paramForm.checkProportion" style="max-width:200px"></el-input>
                  <span class="ml-2">%</span>
                  <p class="mb-0">{{$t("pushimage.qcprice.scale")}}</p>
                </el-form-item>
                <el-form-item :label="$t('pushimage.qcprice.checktimes')" prop="allCheckNum">
                  <el-input v-model.number="paramForm.allCheckNum" style="max-width:200px"></el-input>
                  <span class="ml-2">{{$t("pushimage.qcprice.time")}}</span>
                </el-form-item>
              </div>
              <div class="right-answer" v-if = "paramForm.checkType === 3">
                <el-form-item :label="$t('pushimage.qcprice.total')" prop="rightAnswer">
                  <el-input v-model.number="paramForm.rightAnswer" style="max-width:200px"></el-input>
                  <span class="ml-2">{{$t("pushimage.qcprice.perzhang")}}</span>
                </el-form-item>
                <el-form-item :label="$t('pushimage.qcprice.labelnum')" prop="tagNumber">
                  <el-input v-model.number="paramForm.tagNumber" style="max-width:200px"></el-input>
                  <span class="ml-2">{{$t("pushimage.qcprice.moreamount")}}</span>
                </el-form-item>
              </div>
              <div class="gold-test" v-if = "paramForm.checkType === 4">
                <el-form-item :label="$t('pushimage.qcprice.rate')" prop="goldTest">
                  <el-input v-model.number="paramForm.goldTest" style="max-width:200px"></el-input>
                  <span class="ml-2">%</span>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="10" v-if = "paramForm.checkType">
              <div class="alert alert-success d-flex align-items-center" role="alert" style="min-height: 100px;font-size: .875rem">
                <div v-if = "paramForm.checkType === 1">
                  <p class="mb-1">
                    {{$t("pushimage.qcprice.spotnumber")}}
                    {{$t("pushimage.qcprice.leftpart")}}{{checkNumber}}
                    {{$t("pushimage.qcprice.zhang")}}
                    {{$t("pushimage.qcprice.rightpart")}}
                  </p>
                  <p class="mb-0">
                    {{$t("pushimage.qcprice.taskprice")}}
                    {{$t("pushimage.qcprice.leftpart")}}{{checkMoney}}
                    {{$t("pushimage.qcprice.integral")}}
                    {{$t("pushimage.qcprice.rightpart")}}
                  </p>
                </div>
                <div v-if = "paramForm.checkType === 2">
                  <p class="mb-1">
                    {{$t("pushimage.qcprice.checknumber")}}
                    {{$t("pushimage.qcprice.leftpart")}}{{allCheckNum}}
                    {{$t("pushimage.qcprice.zhang")}}
                    {{$t("pushimage.qcprice.rightpart")}}
                  </p>
                  <p class="mb-0">
                    {{$t("pushimage.qcprice.taskprice")}}
                    {{$t("pushimage.qcprice.leftpart")}}{{checkMoney}}
                    {{$t("pushimage.qcprice.integral")}}
                    {{$t("pushimage.qcprice.rightpart")}}
                  </p>
                </div>
                <div v-if = "paramForm.checkType === 3">
                  <p class="mb-1">
                    {{$t("pushimage.qcprice.leastlabel")}}
                    {{$t("pushimage.qcprice.leftpart")}}{{accDoMinNum}}
                    {{$t("pushimage.qcprice.zhang")}}
                    {{$t("pushimage.qcprice.rightpart")}}
                  </p>
                  <p class="mb-0">
                    {{$t("pushimage.qcprice.morelabel")}}
                    {{$t("pushimage.qcprice.leftpart")}}{{accDoMaxNum}}
                    {{$t("pushimage.qcprice.zhang")}}
                    {{$t("pushimage.qcprice.rightpart")}}
                  </p>
                </div>
                <div v-if = "paramForm.checkType === 4">
                  <p class="mb-0">{{$t("pushimage.qcprice.expectlabel")}}
                    {{$t("pushimage.qcprice.leftpart")}}{{goldHitDoNum}}
                    {{$t("pushimage.qcprice.zhang")}}
                    {{$t("pushimage.qcprice.rightpart")}}
                  </p>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="taskTit mt-4">
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
                <!-- <p class="mb-1">
                  建议价格【
                  {{Math.ceil(paramForm.taskTime/60 * 40)}}
                  积分/张】
                </p> -->
                <p class="mb-1">
                  {{$t("pushimage.qcprice.suggestprice")}}
                  {{$t("pushimage.qcprice.leftpart")}}{{this.suggestOffer}}
                  {{$t("pushimage.qcprice.integral")}}
                  {{$t("pushimage.qcprice.rightpart")}}
                </p>
                <p class="mb-1">
                  {{$t("pushimage.qcprice.leastprice")}}
                  {{$t("pushimage.qcprice.leftpart")}}{{this.minOffer}}
                  {{$t("pushimage.qcprice.integral")}}
                  {{$t("pushimage.qcprice.rightpart")}}
                </p>
                <p class="mb-1" v-show = "checkSum !== 0">
                  {{$t("pushimage.qcprice.totalprice")}}
                  {{$t("pushimage.qcprice.leftpart")}}{{checkSum}}
                  {{$t("pushimage.qcprice.inter")}}
                  {{$t("pushimage.qcprice.rightpart")}}
                </p>
                <p class="mb-0">
                  {{$t("pushimage.qcprice.sumprice")}}
                  【{{sum}}{{$t("pushimage.qcprice.inter")}}】
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
          {required: true, message: language('pushimage.qcprice.js.rules.num1')},
          {type: 'number', message: language('pushimage.qcprice.js.rules.num2')}
        ],
        scale: [
          {required: true, message: language('pushimage.qcprice.js.rules.scale1')},
          {type: 'number', message: language('pushimage.qcprice.js.rules.scale2')}
        ],
        thisQuality: [
          {required: true, message: language('pushimage.qcprice.js.rules.thisQuality'), trigger: 'blur'}
        ],
        taskTime: [
          {required: true, message: language('pushimage.qcprice.js.rules.taskTime1')},
          {type: 'number', message: language('pushimage.qcprice.js.rules.taskTime2')}
        ],
        checkType: [
          {required: true, message: language('pushimage.qcprice.js.rules.checkType'), trigger: 'blur'}
        ],
        checkProportion: [
          {required: true, message: language('pushimage.qcprice.js.rules.checkProportion1')},
          {type: 'number', message: language('pushimage.qcprice.js.rules.checkProportion2')}
        ],
        spotCheck: [
          {required: true, message: language('pushimage.qcprice.js.rules.spotCheck1')},
          {type: 'number', message: language('pushimage.qcprice.js.rules.spotCheck2')}
        ],
        allCheckNum: [
          {required: true, message: language('pushimage.qcprice.js.rules.allCheckNum1')},
          {type: 'number', message: language('pushimage.qcprice.js.rules.allCheckNum2')}
        ],
        rightAnswer: [
          {required: true, message: language('pushimage.qcprice.js.rules.rightAnswer1')},
          {type: 'number', message: language('pushimage.qcprice.js.rules.rightAnswer2')}
        ],
        tagNumber: [
          {required: true, message: language('pushimage.qcprice.js.rules.tagNumber1')},
          {type: 'number', message: language('pushimage.qcprice.js.rules.tagNumber2')}
        ],
        goldTest: [
          {required: true, message: language('pushimage.qcprice.js.rules.goldTest1')},
          {type: 'number', message: language('pushimage.qcprice.js.rules.goldTest2')}
        ],
        offer: [
          {required: true, message: language('pushimage.qcprice.js.rules.offer1')},
          {type: 'number', message: language('pushimage.qcprice.js.rules.offer2')}
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
      let projectId = document.location.pathname.split('/')[3]
      // projectId = 'subsdRGf1KQ001'
      if (projectId !== '') {
        vm.projectId = projectId
      }
      // 获取基本信息（可能是新建任务后，自动跳转过来，也可能是从控制台跳转过来）
      let xsrftoken = $('meta[name=_xsrf]').attr('content')
      axios
        .post(
          '/api/get-project-qcprice/image',
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
            '/api/push-project-qcprice/image',
            {
              taskid: vm.projectId,
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
      util.Redirect('/push-project-sample/image/' + this.projectId, 1000)
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

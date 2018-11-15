<template>
<div class="card">
  <div class="card-header">
    <div class="d-flex" style="justify-content:space-between">
      <div style="font-size:1.2rem;" >{{$t("workbench.withdraw.exchangecase")}}</div>
    </div>
  </div>
  <div class="card-body" v-show="status === 0">
    <div style="max-width: 450px;">
      <h4 class="card-title">{{$t("workbench.withdraw.availintegral")}}{{remainPoints}}</h4>
      <span class="text-danger" style="font-size: .875rem">({{$t("workbench.withdraw.note")}},100个积分起可提现)</span>
      <el-form :model="form" :rules="rules" ref="form" label-width="110px">
        <div class="mt-5">
          <el-form-item prop="spendPoints" label="兑换积分：">
            <el-input v-model.number="form.spendPoints" :placeholder="$t('workbench.withdraw.pleaseinput')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('workbench.withdraw.putforward')">
            <div class="border p-1" style="max-width:150px">
              <img src="~assets/img/alipay_4030.png" alt="">
              <span>{{$t("workbench.withdraw.alipay")}}</span>
            </div>
          </el-form-item>
          <el-form-item prop="account" :label="$t('workbench.withdraw.alipayaccount')">
            <el-input v-model="form.account" :placeholder="$t('workbench.withdraw.pleaseinput')"></el-input>
          </el-form-item>
          <el-form-item prop="name" :label="$t('workbench.withdraw.alipayname')">
            <el-input v-model="form.name" :placeholder="$t('workbench.withdraw.pleaseinput')"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div class="d-inline-block mt-5" style="margin-left: 15px;">
        <p class="text-muted">本月累积提现：{{hadWithdraw ? (hadWithdraw) : 0.00}}元</p>
        <p class="text-muted">本次提现：{{!isNaN(form.spendPoints) ? form.spendPoints : 0}}{{$t("workbench.withdraw.inter")}}={{!isNaN(form.spendPoints) ? form.spendPoints / 100 : '0.00'}}元</p>
        <p class="text-muted">
          本次代扣税：{{thisTax}}元
          <el-tooltip placement="right">
          <div slot="content">
            {{$t("workbench.withdraw.incomesTit1")}}<br/>
            {{$t("workbench.withdraw.incomesTit2")}}
          </div>
          <el-button type="text">{{$t("workbench.withdraw.incomes")}}</el-button>
        </el-tooltip>
        </p>
        <p class="text-muted">本次实际到账：{{finallyCash}}元</p>
      </div>
    </div>
    <div class="row mt-5">
      <div class="mx-auto">
        <el-button type="primary" @click="checkWithdraw('form')" :disabled="withdrawDisabled">{{$t("workbench.withdraw.redeemnow")}}</el-button>
      </div>
    </div>
  </div>
  <div class="card-body" v-if="status === 1">
    <h4 class="card-title">{{$t("workbench.withdraw.integral")}}{{remainPoints}}</h4>
    <div class="alert alert-warning mt-4 mb-5" role="alert">
      {{$t("workbench.withdraw.confirminfo")}}是否正确，如有错误请返回上一页修改
    </div>
    <p class="text-check">{{$t("workbench.withdraw.amountcash")}}{{form.spendPoints}}{{$t("workbench.withdraw.money")}} = {{form.spendPoints*100}}{{$t("workbench.withdraw.inter")}}</p>
    <p class="text-check">本次代扣税：{{thisTax}}元</p>
    <p class="text-check">本次实际到账：{{finallyCash}}元</p>
    <p class="text-check">{{$t("workbench.withdraw.comealipay")}}</p>
    <p class="text-check">{{$t("workbench.withdraw.alipayaccount")}}{{form.account}}</p>
    <p class="text-check">{{$t("workbench.withdraw.alipayname")}}{{form.name}}</p>
    <div class="row mt-5">
      <div class="mx-auto">
        <el-button @click="status = 0">{{$t("workbench.withdraw.reset")}}</el-button>
        <el-button type="primary" @click="status = 2">{{$t("workbench.withdraw.confirm")}}</el-button>
      </div>
    </div>
  </div>
  <div class="card-body" v-if="status === 2">
    <h5 class="mob-title">{{$t("workbench.withdraw.cellphone")}}</h5>
    <el-form :model="form2" :rules="rules2" ref="form2" style="max-width:350px">
      <el-form-item prop="mobile">
        <el-input v-model="form2.mobile" :placeholder="$t('workbench.withdraw.inputphone')">
          <ButtonPIN ref="sendSms" action="/api/account/smsverificationcode" @click.native="sendSms('form2')" slot="append"/>
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="form2.code" :placeholder="$t('workbench.withdraw.inputcode')"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="mob-footer">
      <el-button @click="status = 1">{{$t("workbench.withdraw.reset")}}</el-button>
      <el-button type="primary" @click="checkSms('form2')">{{$t("workbench.withdraw.confirm")}}</el-button>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import {language} from 'lang'
import ButtonPIN from 'components/private/PIN'

var http = axios.create()
export default {
  name: 'app',
  components: {
    ButtonPIN
  },
  data () {
    let validateMobile = (rule, value, callback) => {
      var vm = this
      var url = '/api/account/mobile?countryCode=86&mobile=' + value
      http.get(url)
        .then(function (response) {
          if (response.data === false) {
            vm.$refs.sendSms.sendCodeDisabled = true
            callback(new Error(language('validator.mobile.rule2')))
          } else {
            vm.$refs.sendSms.sendCodeDisabled = false
            callback()
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    }
    // 验证用户名是否存在
    let validateUsername = (rule, value, callback) => {
      http.get('/api/account/realname?realname=' + value)
        .then(function (response) {
          if (response.data !== true) {
            callback(new Error(language('workbench.withdraw.js.rules.name2')))
          } else {
            callback()
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    }
    // 验证是否少于100和是否输入小数
    let validateWithdraw = (rule, value, callback) => {
      if (value < 100 || value > this.remainPoints) {
        if (value < 100) {
          this.form.spendPoints = 100
        } else {
          this.form.spendPoints = this.remainPoints
        }
        return callback(new Error('提现积分不能少于100,且不可超过可提现积分'))
      } else {
        callback()
      }
    }
    // 控制小数点输入（bug.00时有问题）
    let validateFolat = (rule, value, callback) => {
      this.form.spendPoints = parseInt(this.form.spendPoints)
      callback()
    }
    return {
      hadWithdraw: 900, // 累积提现
      status: 0,
      withdrawDisabled: false,
      remainPoints: 500,
      form: {
        account: '',
        name: '',
        spendPoints: 100
      },
      rules: {
        spendPoints: [
          {required: true, message: '请输入需提现的积分数量', trigger: 'blur'},
          {type: 'number', message: '请输入数字', trigger: 'blur'},
          {validator: validateWithdraw, trigger: 'blur'},
          {validator: validateFolat, trigger: 'change'}
        ],
        account: [
          {required: true, message: language('workbench.withdraw.js.rules.account'), trigger: 'blur'}
        ],
        name: [
          {required: true, message: language('workbench.withdraw.js.rules.name1'), trigger: 'blur'},
          {validator: validateUsername, trigger: 'blur'}
        ]
      },
      form2: {
        countryCode: '86',
        mobile: '',
        code: ''
      },
      rules2: {
        mobile: [
          {required: true, message: language('validator.mobile.rule1'), trigger: 'blur'},
          {type: 'string', pattern: /^0?(13|14|15|17|18|19)[0-9]{9}$/, message: language('validator.mobile.rule3'), trigger: 'blur'},
          {validator: validateMobile, trigger: 'blur'}
        ],
        code: [
          {required: true, message: language('validator.code.rule1'), trigger: 'blur'},
          {type: 'string', pattern: /^[0-9]{6}$/, message: language('validator.code.rule2'), trigger: 'blur'}
        ]
      },
      options: [
        {value: '86', label: '86'}
      ]
    }
  },
  computed: {
    // 本次扣税
    thisTax () {
      const vm = this
      let total = vm.hadWithdraw + vm.form.spendPoints / 100
      return this.form.spendPoints ? (vm.rates(total) - vm.rates(vm.hadWithdraw)).toFixed(2) : '0.00'
    },
    // 实际到账
    finallyCash () {
      return this.form.spendPoints ? (this.form.spendPoints / 100 - this.thisTax).toFixed(2) : '0.00'
    }
  },
  mounted: function () {
    var vm = this
    this.$nextTick(function () {
      vm.getBalance()
    })
  },
  methods: {
    // 扣税函数
    rates (x) {
      let y = 0
      if (x <= 500) {
        y = 0
      }
      if (x > 500 && x <= 800) {
        y = x * 0.0336 / 1.03
      }
      if (x > 800) {
        y = x * 0.0436 / 1.03
      }
      return y
    },
    // 获得当前积分
    getBalance () {
      var vm = this
      var url = '/api/user/balance'
      http.get(url)
        .then(function (response) {
          var rsp = response.data
          if (rsp.code === 0) {
            var data = rsp.data
            vm.remainPoints = data.balance
            vm.getWithdraw()
          } else {
            vm.notify('error', rsp.message, 2000)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    // 获得本月累积提现
    getWithdraw () {
      var vm = this
      var url = '/api/user/balance/withdrawlog'
      http.get(url)
        .then(function (response) {
          var rsp = response.data
          if (rsp.code === 0) {
            vm.hadWithdraw = rsp.monthsum
          } else {
            vm.notify('error', rsp.message, 2000)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    // 第一步验证
    checkWithdraw (form) {
      var vm = this
      console.log({
        account: vm.form.account,
        name: vm.form.name,
        points: vm.form.spendPoints,
        tax: vm.thisTax
      })
      vm.$refs[form].validate((valid) => {
        if (valid) {
          if (vm.form.spendPoints > vm.remainPoints) {
            vm.notify('error', language('workbench.withdraw.js.points'), 2000)
          } else {
            vm.status = 1
          }
        }
      })
    },
    // 提现信息
    withdraw () {
      console.log('withdraw start')
      var vm = this
      var url = '/api/user/balance/withdraw'
      http.post(url, {
        account: vm.form.account,
        name: vm.form.name,
        points: vm.form.spendPoints,
        tax: vm.thisTax
      })
        .then(function (response) {
          var rsp = response.data
          if (rsp.code === 0) {
            vm.notify('success', rsp.message, 2000)
            vm.toWithdraw()
          } else {
            vm.notify('error', rsp.message, 2000)
            vm.withdrawDisabled = true
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    sendSms (form) {
      let vm = this
      let valid = true
      vm.$refs[form].validateField('mobile', () => {
        // 表单验证
        valid = false
      })
      if (valid) {
        vm.$refs.sendSms.postData = {
          countryCode: vm[form].countryCode,
          mobile: vm[form].mobile
        }
        vm.$refs.sendSms.sendSmsPost()
      }
    },
    // 验证手机号 验证码
    checkSms (form2) {
      var vm = this
      this.$refs[form2].validate((valid) => {
        if (valid) {
          var url = '/api/account/mobile'
          http.post(url, {
            countryCode: vm.form2.countryCode,
            mobile: vm.form2.mobile,
            code: vm.form2.code
          })
            .then(function (response) {
              var rsp = response.data
              if (rsp.code === 0) {
                console.log('pass sms check')
                vm.withdraw()
              } else {
                vm.notify('error', rsp.message, 2000)
              }
            })
            .catch(function (error) {
              console.log(error)
            })
        }
      })
    },
    notify (type, message, duration) {
      var vm = this
      if (type === 'success') {
        vm.$notify.success({
          title: language('workbench.js.success'),
          message: message,
          duration: duration
        })
      } else if (type === 'error') {
        vm.$notify.error({
          title: language('workbench.js.error'),
          message: message,
          duration: duration
        })
      }
    },
    toWithdraw () {
      this.$router.push({ path: '/withdraw' })
    }
  }
}
</script>

<style>
.text-check {
  text-indent: 15px;
  font-size: 14px;
  color: #606266;
}
.mob-title {
  margin-bottom: 2rem;
}
.mob-footer {
  margin-top: 2.5rem;
  margin-bottom: 2rem;
}
</style>

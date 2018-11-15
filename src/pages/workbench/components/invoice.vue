<template>
<div class="card">
  <div class="card-header">
    <div class="d-flex" style="justify-content:space-between">
      <div style="font-size:1.2rem;" >申请开票</div>
    </div>
  </div>
  <div class="card-body">
    <el-form :model="form" :rules="rules" ref="form" label-width="140px" style="max-width: 500px">
      <p class="h6 mt-3 text-dark font-weight-bold" style="text-indent: 1rem;">开票金额</p>
      <div class="mt-4">
        <el-form-item prop="amount" label="开票金额（元）：">
          <el-input v-model.number="form.amount" :placeholder="$t('workbench.withdraw.pleaseinput')"></el-input>
        </el-form-item>
      </div>
      <p class="h6 mt-5 text-dark font-weight-bold" style="text-indent: 1rem;">开票信息</p>
      <div class="mt-4">
        <el-form-item label="发票抬头类型" prop="invoicetype">
          <el-radio-group v-model="form.invoicetype">
            <el-radio :label=1 name="invoicetype">个人</el-radio>
            <el-radio :label=2 name="invoicetype">企业单位</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="form.invoicetype===1">
          <el-form-item label="发票抬头" prop="title">
            <el-input v-model="form.title" placeholder="个人名称"></el-input>
          </el-form-item>
          <el-form-item label="发票类型" class="invoice-info">
            <span>普通发票</span>
          </el-form-item>
        </div>
        <div v-if="form.invoicetype===2">
          <el-form-item label="发票类型" prop="type">
            <el-radio-group v-model="form.type">
              <el-radio :label=1 name="type">普通发票</el-radio>
              <el-radio :label=2 name="type">专用发票</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="发票抬头" prop="title">
            <el-input v-model="form.title" placeholder="企业名称"></el-input>
          </el-form-item>
          <el-form-item label="纳税人识别号" prop="govcode">
            <el-input v-model="form.govcode" placeholder="纳税人识别号"></el-input>
          </el-form-item>
          <el-form-item label="开户行和账号">
            <el-input v-model="form.bank" placeholder="开户行" style="margin-bottom: 10px;"></el-input>
            <el-input v-model="form.bankaccount" placeholder="账号"></el-input>
          </el-form-item>
          <el-form-item label="地址和电话">
            <el-input v-model="form.corpaddress" placeholder="公司地址" style="margin-bottom: 10px;"></el-input>
            <el-input v-model="form.corpphone" placeholder="公司电话"></el-input>
          </el-form-item>
        </div>
        <div v-if="form.invoicetype!==''">
          <el-form-item label="发票内容" class="invoice-info">
            <span>技术服务</span>
          </el-form-item>
          <el-form-item label="税率" class="invoice-info">
            <span>3%</span>
          </el-form-item>
        </div>
      </div>
      <p class="h6 mt-5 text-dark font-weight-bold" style="text-indent: 1rem;">收件信息</p>
      <div class="mt-4">
        <el-form-item prop="sendname" label="收件姓名：">
          <el-input v-model.number="form.sendname" :placeholder="$t('workbench.withdraw.pleaseinput')"></el-input>
        </el-form-item>
        <el-form-item prop="sendphone" label="联系方式：">
          <el-input v-model="form.sendphone" :placeholder="$t('workbench.withdraw.pleaseinput')"></el-input>
        </el-form-item>
        <el-form-item prop="sendaddress" label="收件地址：">
          <el-input v-model="form.sendaddress" :placeholder="$t('workbench.withdraw.pleaseinput')"></el-input>
        </el-form-item>
      </div>
      <div class="mt-5">
        <el-form-item>
          <el-button type="primary" @click="checkInvoice('form')">确认申请</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import {language} from 'lang'

var http = axios.create()
export default {
  name: 'app',
  components: {
  },
  data () {
    return {
      form: {
        amount: '',
        // 开票信息
        invoicetype: '',
        type: 1,
        title: '',
        govcode: '',
        bank: '',
        bankaccount: '',
        corpaddress: '',
        corpphone: '',
        // 收货地址
        sendname: '',
        sendphone: '',
        sendaddress: ''
      },
      rules: {
        amount: [
          {required: true, message: '请输入开票金额', trigger: 'blur'},
          {type: 'number', message: '提现金额必须为数值', trigger: 'blur'}
        ],
        invoicetype: [
          {required: true, message: '请选择发票抬头类型', trigger: 'change'}
        ],
        type: [
          {required: true, message: '请选择发票类型', trigger: 'change'}
        ],
        title: [
          {required: true, message: '请填写发票抬头', trigger: 'trigger'}
        ],
        govcode: [
          {required: true, message: '纳税人识别号', trigger: 'trigger'}
        ],
        sendname: [
          {required: true, message: '请输入收货姓名', trigger: 'blur'}
        ],
        sendphone: [
          {required: true, message: '请输入联系方式', trigger: 'blur'}
        ],
        sendaddress: [
          {required: true, message: '请输入收货地址', trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
  },
  watch: {
    // 当form发生改变时，清除检验提示
    form: {
      handler () {
        this.$refs.form.clearValidate()
      },
      deep: true
    }
  },
  methods: {
    submitJson () {
      let submit = {
        amount: this.form.amount,
        // 开票信息
        title: this.form.title,
        govcode: this.form.govcode,
        bank: this.form.bank,
        bankaccount: this.form.bankaccount,
        corpaddress: this.form.corpaddress,
        corpphone: this.form.corpphone,
        // 收货地址
        sendname: this.form.sendname,
        sendphone: this.form.sendphone,
        sendaddress: this.form.sendaddress
      }
      if (this.form.invoicetype === 1) {
        submit.type = 3
      }
      if (this.form.invoicetype === 2) {
        submit.type = this.form.type
      }
      return submit
    },
    // 提交form
    postInvoice () {
      var vm = this
      var url = '/api/user/balance/receiptapply'
      console.log(vm.submitJson())
      http.post(url, vm.submitJson())
        .then(function (response) {
          var rsp = response.data
          vm.notify('success', rsp.message, 2000)
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    // 验证
    checkInvoice (form) {
      var vm = this
      console.log({
        result: vm.form
      })
      vm.$refs[form].validate((valid) => {
        if (valid) {
          vm.postInvoice()
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
    }
  }
}
</script>

<style>
.invoice-info label.el-form-item__label,
.invoice-info .el-form-item__content{
  line-height: 1rem;
}
</style>

<template>
<div class="card">
  <div class="card-header">
    <div class="d-flex" style="justify-content:space-between">
      <div style="font-size:1.2rem;" >发票管理</div>
    </div>
  </div>
  <div class="card-body">
    <div class="alert mt-3" role="alert" style="background-color: #ecf5ff">
      <span class="text-muted">1. 申请发票金额超过500元免收快递费</span>
    </div>
    <div class="mt-4">
      <el-button type="primary" @click="toInvoice">申请开票</el-button>
      <el-table :data="records" class="mt-3">
        <el-table-column prop="amount" :label="$t('workbench.records.money')" sortable>
          <template slot-scope="scope">
            <span>&yen;&nbsp;{{ (scope.row.amount.toFixed(2)) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="created" label="申请时间" sortable>
          <template slot-scope="scope">
            <span>{{ timeFormat(scope.row.created * 1000) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="发票抬头" width="220"></el-table-column>
        <el-table-column prop="type" label="发票类型">
          <template slot-scope="scope">
            <span>{{scope.row.step === 1 ? '普通发票' : '专用发票'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="step" label="发票状态" width="120">
          <template slot-scope="scope">
            <span>{{scope.row.step === 999 ? '已完成' : '已申请'}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'

var http = axios.create()
export default {
  name: 'app',
  data () {
    return {
      records: [
        {
          title: '小王',
          amount: 102,
          type: 1,
          created: 1538202421,
          step: 999
        },
        {
          title: '小王',
          amount: 802,
          type: 2,
          created: 1517414400,
          step: 1
        },
        {
          title: '苏州泛函信息科技有限公司',
          amount: 1066,
          type: 1,
          created: 1359648000,
          step: 999
        },
        {
          title: '小王',
          amount: 302,
          type: 1,
          created: 1538203291,
          step: 999
        }
      ]
    }
  },
  computed: {
    // 时间戳转换日期格式  e为毫秒
    timeFormat () {
      return (e) => {
        let time = new Date(e)
        let year = time.getFullYear()
        let month = time.getMonth() + 1
        let date = time.getDate()
        return `${year}-${month > 9 ? month : '0' + month}-${date > 9 ? date : '0' + date}`
      }
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.getRecords()
    })
  },
  methods: {
    formatRecords (records) {
      records.forEach((val) => {
        if (!val.title) {
          val.title = '-'
        }
        if (!val.amount) {
          val.amount = 0
        }
        if (!val.type) {
          val.type = 0
        }
        if (!val.created) {
          val.created = 0
        }
        if (!val.step) {
          val.step = 0
        }
      })
    },
    getRecords () {
      const vm = this
      let url = '/api/user/balance/receiptlog'
      http.get(url)
        .then(function (response) {
          let rsp = response.data
          if (rsp.code === 0) {
            vm.records = rsp.data
            vm.formatRecords(vm.records)
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
    toInvoice () {
      this.$router.push({ path: '/invoice' })
    }
  }
}
</script>

<style>
</style>

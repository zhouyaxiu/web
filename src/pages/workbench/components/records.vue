<template>
<div class="card">
  <div class="card-header">
    <div class="d-flex" style="justify-content:space-between">
      <div style="font-size:1.2rem;" >{{$t("workbench.records.transrecord")}}</div>
    </div>
  </div>
  <div class="card-body">
    <el-table :data="records">
      <el-table-column prop="created" width="130" :label="$t('workbench.records.time')" sortable>
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ timeFormat(scope.row.created * 1000) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="uuid" label="id" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.uuid.substring(0, 10)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="积分" sortable>
        <template slot-scope="scope">
          <span>{{scope.row.amount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" :label="$t('workbench.records.money')" sortable>
        <template slot-scope="scope">
          <span>&yen;&nbsp;{{ (scope.row.amount / 100).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tax" label="税" sortable>
        <template slot-scope="scope">
          <span>&yen;&nbsp;{{ scope.row.tax.toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际提现" sortable>
        <template slot-scope="scope">
          <span>&yen;&nbsp;{{ (scope.row.amount / 100 - scope.row.tax).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="step" label="提现状态">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.step === 99 ? 'success' : (scope.row.step === 98 ? 'danger' : 'primary')"
            disable-transitions>{{scope.row.step === 99 ? '已完成' : (scope.row.step === 98 ? '提现失败' : '审核中')}}</el-tag>
        </template>
      </el-table-column>
    </el-table>
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
          uuid: 'e009899fsdklfjs',
          amount: 102000,
          tax: 7,
          created: 1538202421,
          step: 99
        },
        {
          uuid: 'ewjdhsf3563lfjs',
          amount: 80200000,
          tax: 50,
          created: 1517414400,
          step: 1
        },
        {
          uuid: 'rgdsfsdkl56s',
          amount: 10666815,
          tax: 76,
          created: 1359648000,
          step: 98
        },
        {
          uuid: 'b1297trshsfsdklf4t',
          amount: 3025646,
          tax: 17,
          created: 1538203291,
          step: 5
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
        if (!val.uuid) {
          val.uuid = '-'
        }
        if (!val.amount) {
          val.amount = 0
        }
        if (!val.tax) {
          val.tax = 0
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
      let url = 'api/user/balance/withdrawlog'
      http.get(url)
        .then(function (response) {
          // console.log(response)
          var rsp = response.data
          if (response.status === 200 && rsp.code === 0) {
            vm.records = rsp.records
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
    }
  }
}
</script>

<style>
</style>

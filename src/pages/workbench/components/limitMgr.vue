<template>
<div class="card">
  <div class="card-header">
    <div class="d-flex" style="justify-content:space-between">
      <div style="font-size:1.2rem;" >{{$t("workbench.limitMgr.limitMgr")}}</div>
    </div>
  </div>
  <div class="card-body limit-card">
    <el-form ref="limitForm" :model="limitForm" :rules="rules" label-width="90px">
      <el-form-item label="TaskID" prop="taskid">
        <el-input v-model="limitForm.taskid" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="TeamID" prop="teamid">
        <el-input v-model="limitForm.teamid" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="Username" prop="username">
        <el-input v-model="limitForm.username" :placeholder="$t('workbench.limitMgr.usernameNote')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('workbench.limitMgr.limit')" prop="tuflag">
        <el-select
          v-model="limitForm.tuflag"
          multiple
          filterable
          allow-create
          default-first-option
          :placeholder="$t('workbench.limitMgr.please')">
          <el-option
            v-for="(item, index) in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :class="showStr[11-index] === '1' ? '' : 'd-none'">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="changetu">{{$t("workbench.limitMgr.update")}}</el-button>
        <router-link :to="{ name: 'join'}">
          <el-button >{{$t("workbench.limitMgr.return")}}</el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import $ from 'jquery'
import {language} from 'lang'

var http = axios.create({
  headers: { 'X-Xsrftoken': $('meta[name=_xsrf]').attr('content') }
})
export default {
  name: 'app',
  data () {
    return {
      show: 126,
      // 下拉框选项
      options: [{
        value: 1 << 0,
        label: '拒绝'
      }, {
        value: 1 << 1,
        label: '做任务'
      }, {
        value: 1 << 2,
        label: '查看自己的任务'
      }, {
        value: 1 << 3,
        label: '修改自己的任务'
      }, {
        value: 1 << 4,
        label: '查看组内的任务'
      }, {
        value: 1 << 5,
        label: '修改组内的任务'
      }, {
        value: 1 << 6,
        label: '质检组内的任务'
      }, {
        value: 1 << 7,
        label: '组内角色管理'
      }, {
        value: 1 << 8,
        label: '查看所有的任务'
      }, {
        value: 1 << 9,
        label: '修改所有的任务'
      }, {
        value: 1 << 10,
        label: '质检所有的任务'
      }, {
        value: 1 << 11,
        label: '角色管理'
      }],
      limitForm: {
        username: '',
        teamid: '0',
        taskid: '',
        tuflag: []
      },
      rules: {
        username: [{ required: true, message: language('workbench.limitMgr.js.rule.username'), trigger: 'blur' }],
        tuflag: [{ required: true, message: language('workbench.limitMgr.js.rule.tuflag'), trigger: 'change' }]
      }
    }
  },
  computed: {
    // 返回二进制字符串，长度不满12位在前补齐
    showStr () {
      const vm = this
      const BINARY = vm.show.toString(2)
      let num = 12 - BINARY.length
      let result = ''
      if (num === 0) {
        result = BINARY
      } else {
        let zero = ''
        for (let i = 0; i < num; i++) {
          zero = zero + '0'
        }
        result = zero + BINARY
      }
      return result
    },
    // 计算this.limitForm.tuflag
    tuflageResult () {
      let sum = 0
      this.limitForm.tuflag.forEach((value) => {
        sum = sum | value
      })
      return sum
    },
    getTaskID () {
      return this.$route.params.id
    }
  },
  mounted: function () {
    var vm = this
    vm.limitForm.taskid = vm.getTaskID
    this.$nextTick(function () {
      http
        .get('/api/projects/' + vm.getTaskID)
        .then(function (response) {
          let rsp = response.data
          console.log(rsp)
          if (rsp.code === 0) {
            vm.show = rsp.project.tuflag
            vm.limitForm.teamid = rsp.project.teamid
          } else {
            vm.$message({
              message: 'Error 获取失败,请重新登录',
              type: 'error'
            })
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    })
  },
  methods: {
    changetu () {
      let vm = this
      this.$refs['limitForm'].validate(valid => {
        if (valid) {
          let xsrftoken = $('meta[name=_xsrf]').attr('content')
          let data = {
            taskid: vm.getTaskID,
            teamid: vm.limitForm.teamid,
            username: vm.limitForm.username,
            tuflag: vm.tuflageResult
          }
          let url = '/api/project/tuflag'
          console.log(data)
          axios.post(url, data, {
            headers: {
              'X-Xsrftoken': xsrftoken
            }
          })
            .then(function (response) {
              let rsp = response.data
              if (rsp.code === 0) {
                vm.changetuloading = false
                vm.$message({
                  message: language('workbench.limitMgr.js.success'),
                  type: 'success'
                })
                vm.limitForm.username = ''
                vm.limitForm.tuflag = ''
              } else {
                vm.changetuloading = false
                vm.$message({
                  message: rsp.message,
                  type: 'error'
                })
              }
            })
            .catch(function (error) {
              console.log(error)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style>
.limit-card {
  width: 50%;
  margin: 0 auto;
  padding: 2rem 0;
}
.limit-card .el-select {
  width: 100%;
}
@media (max-width: 1200px) {
	.limit-card {
		width: 60%;
	}
}
@media (max-width: 1024px) {
	.limit-card {
		width: 75%;
	}
}
@media (max-width: 768px) {
	.limit-card {
		width: 90%;
	}
}
</style>

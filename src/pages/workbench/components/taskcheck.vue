<template>
<div class="card">
  <div class="card-header">
    <div class="d-flex" style="justify-content:space-between">
      <div style="font-size:1.2rem;" >发布审核</div>
    </div>
  </div>
  <div class="card-body">
    <el-table :data="projects">
      <el-table-column type="index" label="#" width="30"></el-table-column>
      <el-table-column prop="taskid" :label="'taskid'"></el-table-column>
      <el-table-column prop="taskname" :label="'任务名称'"></el-table-column>
      <el-table-column prop="managername" :label="'用户名'"></el-table-column>
      <el-table-column prop="soptype" :label="'任务类型'"></el-table-column>
      <el-table-column :label="'操作'" width="300">
        <template slot-scope="scope">
          <el-dropdown @command="handleEdit">
            <el-button type="primary" size="mini" @click="handleClick('/push-project-profile/'+scope.row.datatype+'/'+scope.row.taskid)">详情<i class="el-icon-arrow-down el-icon--right"></i></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command='"/push-project-profile/"+scope.row.datatype+"/"+scope.row.taskid'>简历信息</el-dropdown-item>
              <el-dropdown-item :command='"/push-project-business/"+scope.row.datatype+"/"+scope.row.taskid'>{{$t("workbench.publish.businessinfo")}}</el-dropdown-item>
              <el-dropdown-item v-show="scope.row.datatype !== 'collect' && scope.row.datatype !== 'group'" :command='"/push-project-sample/"+scope.row.datatype+"/"+scope.row.taskid'>{{$t("workbench.publish.example")}}</el-dropdown-item>
              <el-dropdown-item :command='"/push-project-qcprice/"+scope.row.datatype+"/"+scope.row.taskid'>{{$t("workbench.publish.offer")}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button class="ml-1" type="success" size="mini" @click="taskPass(scope.$index, scope.row.taskid, projects)">通过</el-button>
          <el-button class="ml-1" type="danger" size="mini" @click="taskFail(scope.$index, scope.row.taskid, projects)">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import $ from 'jquery'
import * as util from 'assets/js/util.js'
export default {
  name: 'app',
  data () {
    return {
      projects: [
        {
          taskid: 'fsdfa',
          taskname: 'adsf',
          managername: 'dfaf',
          soptype: 'wav'
        }
      ]
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      let vm = this
      let url = '/api/get-taskcheck-list'
      axios.get(url)
        .then(function (response) {
          let rsp = response.data
          if (rsp.code === 0) {
            vm.projects = rsp.taskList
            vm.$message({
              message: '获取数据成功',
              type: 'success'
            })
          } else {
            vm.$message({
              message: rsp.Msg,
              type: 'error'
            })
            vm.cashData = []
          }
        })
        .catch(function (error) {
          console.log(error)
          vm.cashData = []
        })
    })
  },
  methods: {
    handleClick (url) {
      util.Redirect(url, 0)
    },
    handleEdit (url) {
      util.Redirect(url, 0)
    },
    dateFormat (row) {
      let dataNew = new Date(parseInt(row.time) * 1000)
      let year = dataNew.getMonth() + 1
      return dataNew.getFullYear() + '-' + year + '-' + dataNew.getDate()
    },
    taskPass (index, taskid, rows) {
      let vm = this
      vm.$confirm('id:' + taskid + '的任务将审核通过?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let xsrftoken = $('meta[name=_xsrf]').attr('content')
        let url = '/api/set-task-checkres'
        axios.post(url, {
          taskid: taskid,
          checkres: true
        }, {
          headers: {
            'X-Xsrftoken': xsrftoken
          }
        })
          .then(function (response) {
            let rsp = response.data
            if (rsp.code === 0) {
              rows.splice(index, 1)
              vm.$message({
                type: 'success',
                message: taskid + '任务已通过审核!'
              })
            } else {
              vm.$message({
                type: 'error',
                message: taskid + '失败!'
              })
            }
          })
      }).catch(() => {
        vm.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    taskFail (index, taskid, rows) {
      let vm = this
      vm.$confirm('请输入拒绝理由', 'id:' + taskid + '的任务将被拒绝', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showInput: true,
        inputType: 'textarea'
      }).then((value) => {
        console.log(value)
        let xsrftoken = $('meta[name=_xsrf]').attr('content')
        let url = '/api/set-task-checkres'
        axios.post(url, {
          taskid: taskid,
          checkres: false,
          reason: value.value
        }, {
          headers: {
            'X-Xsrftoken': xsrftoken
          }
        })
          .then(function (response) {
            let rsp = response.data
            if (rsp.code === 0) {
              rows.splice(index, 1)
              console.log(index, taskid)
              vm.$message({
                type: 'success',
                message: taskid + '任务已被拒绝!'
              })
            } else {
              vm.$message({
                type: 'error',
                message: taskid + '失败!'
              })
            }
          })
      }).catch(() => {
        vm.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    }
  }
}
</script>

<style>
</style>

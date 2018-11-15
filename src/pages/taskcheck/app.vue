<template>
  <div class="fh-money-admin">
    <Header/>
    <div class="container con-box">
      <el-table :data="projects" style="width: 100%" height="500">
        <el-table-column type="index" width="80">
        </el-table-column>
        <el-table-column prop="taskid" label="taskid" width="150">
        </el-table-column>
        <el-table-column prop="taskname" label="任务名称" width="90">
        </el-table-column>
        <el-table-column prop="managername" label="用户名" width="90">
        </el-table-column>
        <el-table-column prop="soptype" label="任务类型" width="90">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <a :href="'./task-check-detail/'+scope.row.datatype+'/'+scope.row.taskid">详情</a>
            <el-button type="danger" size="mini" @click="taskPass(scope.$index, scope.row.taskid, projects)">审核通过</el-button>
            <el-button type="danger" size="mini" @click="taskFail(scope.$index, scope.row.taskid, projects)">审核拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>{{filter}}
    <div class="onBottom">
      <Footer/>
    </div>
  </div>
</template>
<script>
import Header from 'components/header'
import Footer from 'components/footer'
import axios from 'axios'
import $ from 'jquery'

export default {
  name: 'app',
  components: {
    Header,
    Footer
  },
  data () {
    return {
      projects: [{
        taskid: '',
        taskname: '',
        username: '',
        tasktype: ''
      }]
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
      vm.$confirm('id:' + taskid + '的任务将被拒绝?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let xsrftoken = $('meta[name=_xsrf]').attr('content')
        let url = '/api/set-task-checkres'
        axios.post(url, {
          taskid: taskid,
          checkres: false,
          reason: '拒绝理由。。'
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

<style scope>
body {
  background-color: #f0f2f5;
}

.con-box {
  padding: 30px 50px 130px 50px;
  background-color: #fff;
  border-radius: 5px;
  box-sizing: border-box;
  position: relative;
}

.cash-btn {
  position: absolute;
  bottom: 50px;
  right: 50px;
}

.onBottom {
  position: fixed;
  width: 100%;
  bottom: 0;
}
</style>

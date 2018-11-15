<template>
<div id="main">
  <Header/>
  <div class="container mb-5">
    <div class="userinfo clearfix">
      <p class="font-italic">项目ID：{{tasks.length !== 0 ? tasks[0].taskid : "-"}}</p>
    </div>
    <div class="check-list">
      <el-form ref="query" :model="query" :inline="true">
        <el-form-item>
          <el-input v-model="query.uuid" clearable placeholder="数据编号"></el-input>
        </el-form-item>
        <el-form-item v-if="getNotOnlyMe">
          <el-input v-model="query.suser" clearable placeholder="提交人"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="query.cuser" clearable placeholder="审核人"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model.number="query.checkres" clearable placeholder="审核状态">
            <el-option :value=1003 label="全部通过"></el-option>
            <el-option :value=-3 label="全部拒绝"></el-option>
            <el-option :value=2 label="全部待审核"></el-option>
            <el-option :value=1001 label="第一次通过"></el-option>
            <el-option :value=1002 label="第二次通过"></el-option>
            <el-option :value=-1 label="第一次拒绝"></el-option>
            <el-option :value=-2 label="第二次拒绝"></el-option>
            <el-option :value=0 label="第一次待审核"></el-option>
            <el-option :value=1 label="第二次待审核"></el-option>
            <!-- <el-option :value=3 label="第四次待审核"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model.number="query.done" clearable placeholder="导出状态">
            <el-option :value=0 label="未导出"></el-option>
            <el-option :value=999 label="已导出"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="query.time"
            type="datetimerange"
            :picker-options="pickerOptions2"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            value-format="timestamp">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryTasks">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tasks" border="" v-loading="loading" v-if="tasks.length > 0">
        <el-table-column type="index" label="ID" width="50"></el-table-column>
        <el-table-column prop="uuid" label="数据编号"></el-table-column>
        <el-table-column prop="username" label="提交人"></el-table-column>
        <el-table-column prop="checkres" label="审核状态" width="120">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.checkres>=1001">{{getCheckres(scope.row.checkres)}}</el-tag>
            <el-tag type="danger" v-if="scope.row.checkres>=-999 && scope.row.checkres<=-1">{{getCheckres(scope.row.checkres)}}</el-tag>
            <el-tag v-if="scope.row.checkres<=999 && scope.row.checkres>=0">{{getCheckres(scope.row.checkres)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="审核人">
          <template slot-scope="scope">
            <el-button type="text" @click="showCheckComment(scope.row)">{{scope.row.checkuser}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="done" label="导出状态" width="120">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.done===999">{{getExport(scope.row.done)}}</el-tag>
            <el-tag type="danger" v-else>{{getExport(scope.row.done)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="check(scope.row, 'review')" v-if="getReview">审核</el-button>
            <el-button type="danger" size="small" @click="check(scope.row, 'revise')"  v-if="getEditable">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="审核意见" :visible.sync="checkCommentVisible">
        <pre>{{checkcomment}}</pre>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="checkCommentVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <div class="pager mt-1" v-if="tasks.length > 0">
        <el-pagination background layout="total, prev, pager, next, jumper" :page-size="pager.pageSize" :total="pager.totalRow" @current-change="handleCurrentChange"></el-pagination>
      </div>
      <p class="h3 m-auto text-center" v-if="tasks.length === 0">没有数据</p>
    </div>
  </div>
  <Footer/>
</div>
</template>

<script>
import Header from 'components/header'
import Footer from 'components/footer'
import axios from 'axios'
import $ from 'jquery'

var projectId = document.location.pathname.split('/')[2]
// projectId = '167SDSZX001'
// projectId = 'EbzVpw0z001'
var http = axios.create({
  headers: {'X-Xsrftoken': $('meta[name=_xsrf]').attr('content')}
})

export default {
  name: 'app',
  components: {
    Header,
    Footer
  },
  data () {
    return {
      loading: true,
      pager: {},
      tasks: [],
      username: '',
      tuflag: '',
      query: {
        uuid: '',
        suser: '',
        cuser: '',
        checkres: '', // hard coding
        time: '',
        done: '', // hard coding
        page: 1
      },
      checkcomment: '',
      checkCommentVisible: false,
      pickerOptions2: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  computed: {
    // 质检标签内容
    getCheckres () {
      return (checkres) => {
        let result = ''
        if (checkres >= 1001) {
          checkres = checkres % 1000
          result = `第${checkres}次通过`
        } else if (checkres <= 999 && checkres >= 0) {
          result = `第${checkres + 1}次待审核`
        } else if (checkres >= -999 && checkres <= -1) {
          result = `第${checkres * -1}次拒绝`
        }
        return result
      }
    },
    // 导出标签内容
    getExport () {
      return (value) => {
        let result = ''
        if (value === 999) {
          result = '已导出'
        } else if (value === 0) {
          result = '未导出'
        } else {
          result = '未知'
        }
        return result
      }
    },
    // 察验审核权限
    getReview () {
      let vm = this
      if ((vm.tuflag & ((1 << 6) | (1 << 10))) !== 0) {
      // if (((vm.tuflag & (1 << 6)) | (vm.tuflag & (1 << 10))) !== 0) {
        return true
      } else {
        return false
      }
    },
    // 修改权限 显示修改按钮
    getEditable () {
      let vm = this
      if ((vm.tuflag & ((1 << 2) | (1 << 4) | (1 << 8))) !== 0) {
        return true
      } else {
        return false
      }
    },
    // 组修改权限 可以改username
    getNotOnlyMe () {
      let vm = this
      if ((vm.tuflag & ((1 << 4) | (1 << 8))) !== 0) {
        return true
      } else {
        return false
      }
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      let vm = this
      vm.getTuFlag()
    })
  },
  methods: {
    // 获取tuflag和username
    getTuFlag () {
      let vm = this
      http.get('/api/projects/' + projectId)
        .then(function (response) {
          let rsp = response.data
          // vm.username = 'zzfuuu'
          vm.username = rsp.project.username
          vm.tuflag = rsp.project.tuflag
          vm.getTasks()
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    handleCurrentChange (val) {
      let vm = this
      vm.query.page = val
      vm.getTasks(val)
    },
    showCheckComment (row) {
      let vm = this
      vm.checkCommentVisible = true
      vm.checkcomment = row.checkcomment
    },
    queryTasks () {
      this.getTasks()
    },
    getTasks (pageNum = 1) {
      let vm = this
      let page = pageNum
      let [start = 0, end = 0] = vm.query.time
      let thisUName = vm.getNotOnlyMe ? vm.query.suser : vm.username
      let url = '/api/projects/' + projectId + '/task/reviews'
      // console.log({
      //   uuid: vm.query.uuid,
      //   username: thisUName,
      //   checkuser: vm.query.cuser,
      //   checkres: vm.query.checkres || 999999,
      //   page: page,
      //   done: vm.query.done || 999999,
      //   pagesize: 50,
      //   begin: start / 1000,
      //   end: end / 1000
      // })
      vm.loading = true
      http.post(url, {
        uuid: vm.query.uuid,
        username: thisUName,
        checkuser: vm.query.cuser,
        checkres: vm.query.checkres === '' ? 999999 : vm.query.checkres,
        done: vm.query.done === '' ? 999999 : vm.query.done,
        page: page,
        pagesize: 50,
        begin: start / 1000,
        end: end / 1000
      })
        .then(function (response) {
          let rsp = response.data
          // console.log(rsp)
          if (rsp.code === 0) {
            vm.pager = rsp.pager
            vm.tasks = rsp.tasks
            vm.loading = false
          } else {
            vm.loading = false
            vm.$notify.error({
              title: '失败',
              message: rsp.message,
              duration: 2000
            })
          }
        })
        .catch(function (error) {
          console.log(error)
          vm.loading = false
        })
    },
    check (row, page) {
      let url = `/projects/${projectId}/task/${page}?taskid=${row.taskid}&uuid=${row.uuid}&status=${row.status}`
      window.open(url)
    }
  }
}
</script>

<style scoped>
</style>

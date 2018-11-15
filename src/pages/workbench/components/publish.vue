<template>
  <div class="card">
    <div class="card-header">
      <div class="d-flex" style="justify-content:space-between">
        <div style="font-size:1.2rem;" >{{$t("workbench.publish.taskmanage")}}</div>
          <el-button type="primary" size="small" round @click="createTask">{{$t("workbench.publish.createtask")}}</el-button>
      </div>
    </div>
    <div class="card-body">
        <el-tabs v-model="release" class="task-table">
          <el-tab-pane :label="$t('workbench.publish.release')" name="releasing">
            <div class="tableList">
              <el-table
              :data="noReleaseData"
              style="width: 100%">
              <el-table-column
                type="index"
                width="24">
              </el-table-column>
              <el-table-column
                :label="$t('workbench.publish.taskandname')"
                width="172"><template slot-scope="scope">{{$t("workbench.publish.number")}}{{noReleaseData[scope.$index].TaskID}}<br/>{{$t("workbench.publish.name")}}{{noReleaseData[scope.$index].TaskName}}</template>
              </el-table-column>
              <el-table-column
                prop="StartTime"
                :label="$t('workbench.publish.starttime')"
                width="140">
              </el-table-column>
              <el-table-column
                prop="TaskState"
                :label="$t('workbench.publish.taskstate')"
                width="100">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="scope.row.TaskState === '审核失败' ? open(scope.row.CheckReason) : ''">{{scope.row.TaskState}}</el-button>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('workbench.publish.operate')" width="280">
                <template slot-scope="scope">
                <div class="change-btn" style="float:right">
                  <el-dropdown @command="handleEdit">
                      <el-button type="primary" size="small">
                        {{$t("workbench.publish.alterinfo")}}<i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :command='"/push-project-profile/"+noReleaseData[scope.$index].DataType+"/"+noReleaseData[scope.$index].TaskID'>简历信息</el-dropdown-item>
                      <el-dropdown-item :command='"/push-project-business/"+noReleaseData[scope.$index].DataType+"/"+noReleaseData[scope.$index].TaskID'>{{$t("workbench.publish.businessinfo")}}</el-dropdown-item>
                      <el-dropdown-item v-show="scope.row.DataType !== 'collect' && scope.row.DataType !== 'group'" :command='"/push-project-sample/"+noReleaseData[scope.$index].DataType+"/"+noReleaseData[scope.$index].TaskID'>{{$t("workbench.publish.example")}}</el-dropdown-item>
                      <el-dropdown-item :command='"/push-project-qcprice/"+noReleaseData[scope.$index].DataType+"/"+noReleaseData[scope.$index].TaskID'>{{$t("workbench.publish.offer")}}</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <el-button v-if="noReleaseData[scope.$index].TaskFlag == 12 || noReleaseData[scope.$index].TaskFlag == 13" type="success" size="small" @click="pushForCheck(scope.$index)">{{$t("workbench.publish.audit")}}</el-button>
                  <el-button v-else-if="noReleaseData[scope.$index].TaskFlag == 18" type="success" size="small" @click="releaseTask(scope.$index,noReleaseData)">{{$t("workbench.publish.publish")}}</el-button>
                  <el-button type="danger" size="small" @click="handleDelete(scope.$index,noReleaseData)">{{$t("workbench.publish.delete")}}</el-button>
                </div>
                </template>
              </el-table-column>
            </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('workbench.publish.puslished')" name="released">
            <div class="tableList">
              <el-table
              :data="releaseData"
              style="width: 100%">
                <el-table-column
                  type="index"
                  >
                </el-table-column>
                <el-table-column
                  :label="$t('workbench.publish.taskandname')"
                  width="200"><template slot-scope="scope">{{$t("workbench.publish.number")}}<a :href="'/manage/'+releaseData[scope.$index].TaskID">{{releaseData[scope.$index].TaskID}}</a><br/>{{$t("workbench.publish.name")}}{{releaseData[scope.$index].TaskName}}</template>
                </el-table-column>
                <el-table-column
                  prop="StartTime"
                  :label="$t('workbench.publish.releasetime')"
                  >
                </el-table-column>
                <el-table-column
                  prop="Total"
                  :label="$t('workbench.publish.total')">
                </el-table-column>
                <el-table-column
                  prop="Finished"
                  :label="$t('workbench.publish.finished')">
                </el-table-column>
                <el-table-column
                  prop="Undo"
                  :label="$t('workbench.publish.unfinished')">
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import axios from 'axios'
import * as util from 'assets/js/util.js'
import {language} from 'lang'

export default {
  name: 'app',
  data () {
    return {
      release: 'releasing',
      taskList: [
      ]
    }
  },
  mounted: function () {
    let vm = this
    this.$nextTick(function () {
      // 异步加载
      axios.get('/api/pushed-project-list')
        .then(function (response) {
          let rsp = response.data
          if (rsp.code === 0) {
            vm.taskList = rsp.taskList
          } else {
            vm.$notify.error({
              title: language('workbench.js.error'),
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
  computed: {
    // 已发布
    releaseData: function () {
      return this.taskList.filter(function (data) {
        return data.TaskFlag < 10 || data.TaskFlag > 19
      })
    },
    noReleaseData: function () {
      return this.taskList.filter(function (data) {
        return data.TaskFlag >= 10 && data.TaskFlag < 19
      })
    }
  },
  methods: {
    open (val) {
      this.$alert(val, '拒绝理由', {
        confirmButtonText: '确定',
        callback: action => {
          console.log('取消')
        }
      })
    },
    handleEdit (url) {
      util.Redirect(url, 0)
    },
    handleDelete (index, rows) {
      let vm = this
      // 异步确认。。。
      this.$confirm(language('workbench.publish.js.delTask'), language('workbench.publish.js.error.type1'), {
        confirmButtonText: language('workbench.publish.js.success.type1'),
        cancelButtonText: language('workbench.publish.js.error.type2'),
        type: 'warning'
      }).then(() => {
        let xsrftoken = $('meta[name=_xsrf]').attr('content')

        axios.post('/api/del-task',
          {
            taskid: vm.noReleaseData[index].TaskID
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
                title: language('workbench.js.success'),
                message: language('workbench.publish.js.success.type2'),
                duration: 2000
              })

              rows.splice(index, 1)
            } else {
              vm.$notify.error({
                title: language('workbench.js.error'),
                message: rsp.message,
                duration: 2000
              })
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      })
        .catch(() => {
          console.log('取消')
        })
    },
    pushForCheck (index) {
      let vm = this

      // 异步确认。。。
      this.$confirm(language('workbench.publish.js.pushReview'), language('workbench.publish.js.error.type1'), {
        confirmButtonText: language('workbench.publish.js.success.type1'),
        cancelButtonText: language('workbench.publish.js.error.type2'),
        type: 'warning'
      }).then(() => {
        let xsrftoken = $('meta[name=_xsrf]').attr('content')

        axios.post('/api/push-task-forCheck',
          {
            taskid: vm.noReleaseData[index].TaskID
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
                title: language('workbench.js.success'),
                message: language('workbench.publish.js.success.type2'),
                duration: 2000
              })
              vm.noReleaseData[index].TaskFlag = 15
              vm.noReleaseData[index].TaskState = language('workbench.publish.js.reviewing')
            } else {
              vm.$notify.error({
                title: language('workbench.js.error'),
                message: rsp.message,
                duration: 2000
              })
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      })
        .catch(() => {
          // console.log('取消')
        })
    },
    releaseTask (index, rows) {
      let vm = this

      // 异步确认。。。
      this.$confirm('是否确认发布任务' + vm.noReleaseData[index].TaskID, language('workbench.publish.js.error.type1'), {
        confirmButtonText: language('workbench.publish.js.success.type1'),
        cancelButtonText: language('workbench.publish.js.error.type2'),
        type: 'warning'
      }).then(() => {
        let xsrftoken = $('meta[name=_xsrf]').attr('content')

        axios.post('/api/publish-task',
          {
            taskid: vm.noReleaseData[index].TaskID
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
                title: language('workbench.js.success'),
                message: language('workbench.publish.js.success.type3'),
                duration: 2000
              })
              vm.noReleaseData[index].TaskFlag = 19
              vm.noReleaseData[index].TaskState = '已发布'
            } else {
              vm.$notify.error({
                title: language('workbench.js.error'),
                message: rsp.message,
                duration: 2000
              })
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      })
        .catch(() => {
          // console.log('取消')
        })
    },
    createTask () {
      // 创建任务跳转
      window.location.href = '/project-type-selector'
    }
  }
}
</script>
<style>
.el-tabs__nav-wrap::after {
  background-color: transparent;
}
.task-table{
  margin-bottom: 80px;
}
.change-task{
  text-align: right;
}
.change-task a{
  margin-left:10px;
  margin-right: 10px;
}
.change-btn{
  margin-top: 10px;
}
</style>

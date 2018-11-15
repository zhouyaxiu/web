<template>
  <div class="card">
    <div class="card-header">
      <div class="d-flex" style="justify-content:space-between">
        <div style="font-size:1.2rem;">项目管理</div>
        <el-button type="primary" size="small" @click="newTask=true" round>新建</el-button>
      </div>
    </div>
    <div class="card-body">
      <el-table :data="folderList">
        <!-- <el-table-column type="index" width="50"> </el-table-column> -->
        <el-table-column prop="id" label="NO." width="50"></el-table-column>
        <el-table-column prop="name" label="name" width="100"></el-table-column>
        <el-table-column prop="count" label="总数" width="100"></el-table-column>
        <el-table-column prop="success" label="加载成功" width="100"></el-table-column>
        <el-table-column prop="published" label="已发布数" width="100"></el-table-column>
        <el-table-column prop="status" label="状态" width="100"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="success" size="small" @click="release(scope.$index,scope.row)">发布</el-button>
            <el-button type="danger" size="small" @click="delTask(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="新建任务" :visible.sync="newTask" width="30%" center>
        <el-upload ref="ElUpload" class="upload-demo"
          drag
          action="/api/upload/srcfile/"
          :before-upload="handleBeforeUpload"
          :on-change="handleChange"
          :on-progress="handleProgress"
          :on-success="handleSuccess"
          :on-error="handleError"
          :show-file-list="false"
          :file-list="fileList"
          :data="uploadParam"
          accept="image/*"
          style="display: inline-block;"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传txt文件，且不超过50M</div>
        </el-upload>
        <span slot="footer" class="dialog-footer">
          <el-button @click="newTask=false">取 消</el-button>
        </span>
      </el-dialog>
      <div class="message load-icon-box" v-show="progStatus === true">
        <div class="progressPage">
          <el-progress :text-inside="true" :stroke-width="18" :percentage="progress" :status="proStatus"></el-progress>
        </div>
     </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { language } from 'lang'
import $ from 'jquery'

export default {
  name: 'app',
  data () {
    return {
      progStatus: false,
      progress: 0,
      pass: false,
      uploadParam: {
        projectId: ''
      },
      projectId: '',
      folderList: [],
      newTask: false,
      form: {
        name: ''
      },
      formLabelWidth: '80px',
      name: '',
      fileList: []
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      let vm = this
      let projectId = document.location.pathname.split('/')[2]
      console.log(projectId)
      if (projectId !== '') {
        vm.projectId = projectId
      }
      let xsrftoken = $('meta[name=_xsrf]').attr('content')
      axios.post('/api/folder-list',
        {
          taskid: vm.projectId
        },
        {
          headers: {
            'X-Xsrftoken': xsrftoken
          }
        }
      ).then(function (response) {
        let rsp = response.data
        if (rsp.code === 0) {
          console.log(rsp)
          let folders = rsp.folders
          for (let i in folders) {
            let status = ''
            if (!folders[i].status) {
              folders[i].status = 0
            }
            switch (folders[i].status) {
              case 0:
                status = '未发布'
                break
              case 1:
                status = '添加任务中'
                break
              case -2:
                status = '添加任务失败'
                break
              case 10:
                status = '删除中'
                break
              case -11:
                status = '删除src失败'
                break
              case 12:
                status = '删除失败'
                break
              case 20:
                status = '发布中'
                break
              case -21:
                status = '发布失败'
                break
              case 1000:
                status = '已发布'
                break
              default:
                status = '错误'
            }
            let folder = {
              id: Number(i) + 1,
              name: folders[i].foldername,
              count: folders[i].total,
              success: folders[i].success,
              published: folders[i].published,
              status: status
            }
            if (!folder.count) {
              folder.count = 0
            }
            if (!folder.success) {
              folder.success = 0
            }
            if (!folder.published) {
              folder.published = 0
            }
            vm.folderList.push(folder)
          }
        }
      })
    })
  },
  methods: {
    release (index, row) {
      let vm = this
      console.log(row)
      this.$confirm('此操作将发布' + row.name + ',是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let xsrftoken = $('meta[name=_xsrf]').attr('content')
          axios.post('/api/publish-folder',
            {
              taskid: vm.projectId,
              foldername: row.name
            },
            {
              headers: {
                'X-Xsrftoken': xsrftoken
              }
            }
          ).then(function (response) {
            let rsp = response.data
            if (rsp.code === 0) {
              row.status = '发布中'
              vm.$notify.success({
                title: '成功',
                message: '提交成功',
                duration: 2000
              })
            } else {
              vm.$notify.error({
                title: '失败',
                message: rsp.message,
                duration: 2000
              })
              row.status = '发布失败'
            }
          })
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err
          })
        })
    },
    delTask (index, row) {
      let vm = this
      console.log(row)
      this.$confirm('此操作将删除' + row.name + ',是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let xsrftoken = $('meta[name=_xsrf]').attr('content')
          axios.post('/api/del-folder',
            {
              taskid: vm.projectId,
              foldername: row.name
            },
            {
              headers: {
                'X-Xsrftoken': xsrftoken
              }
            }
          ).then(function (response) {
            let rsp = response.data
            if (rsp.code === 0) {
              vm.$notify.success({
                title: '成功',
                message: '提交成功',
                duration: 2000
              })
              row.status = '删除中'
            } else {
              vm.$notify.error({
                title: '失败',
                message: rsp.message,
                duration: 2000
              })
              // row.status = '删除失败'
            }
          })
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err
          })
        })
    },
    // upload methods start  ，
    handleProgress (e, file) {
      this.progStatus = true
      this.progress = Math.floor(e.percent)
    },
    handleChange (file) {
      this.progStatus = false
      if (file.status === 'ready') {
        console.log('ready')
        // 重置progress组件
        this.pass = null
        this.progress = 0
      } else if (file.status === 'fail') {
        this.$message.error(language('pushimage.sample.js.error.type4'))
      }
    },
    handleError (res) {
      // 上传失败
      let vm = this
      this.pass = false
      console.log(res)
      vm.$notify.error({
        title: language('pushimage.sample.js.error.type1'),
        message: res.error,
        duration: 2000
      })
      this.newTask = false
      // setTimeout(() => {
      //   window.location.reload()
      // }, 2000)
    },
    handleSuccess (response, file, fileList) {
      // 上传成功，则先发送状态到服务器，服务器确认状态后，返回，再添加到filelist中
      let vm = this
      // var fSize = (file.size / 1024 / 1024).toFixed(2)
      console.log('upload success')
      vm.$notify.success({
        title: '成功',
        message: '上传文件成功',
        duration: 2000
      })
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    },
    handleBeforeUpload (file) {
      let vm = this
      // 文件最大50M
      if (file.size > 50 * 1024 * 1024) {
        vm.$notify.error({
          title: language('pushimage.sample.js.error.type1'),
          message: language('pushimage.sample.js.error.type6'),
          duration: 2000
        })
        return false
      }
      vm.uploadParam.projectId = vm.projectId
      let access = false

      let xsrftoken = $('meta[name=_xsrf]').attr('content')

      $.ajax({
        url: '/api/get-upload-access/srcfile/' + vm.projectId,
        type: 'POST', // GET
        async: false, // 或false,是否异步
        data: {},
        timeout: 5000, // 超时时间
        dataType: 'json', // 返回的数据格式：
        beforeSend: function (xhr) {},
        success: function (data, textStatus, jqXHR) {
          let rsp = data
          if (rsp.code === 0) {
            access = true
          } else {
            vm.$notify.error({
              title: '失败',
              message: '没有此任务的上传权限',
              duration: 2000
            })
            access = false
          }
        },
        error: function (xhr, textStatus) {
          access = false
        },
        complete: function () {},
        headers: {
          'X-Xsrftoken': xsrftoken
        }
      })
      console.log(access)
      return access
    }
  }
}
</script>
<style scoped>
.el-form-item {
    margin-bottom: -10px;
}

.message {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1050;
}
.load-icon-box {
  display: flex;
  justify-content: center;
  align-items: center;
}
.progressPage {
  /* position: relative; */
  /* font-size: 3rem; */
  /* width: 100%; */
  /* height: 100%; */
  /* color: #fff; */
  width: 200px;
}
</style>

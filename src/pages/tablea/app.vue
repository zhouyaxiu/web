<template>
  <div id="main" class="user-table">
    <Header/>
    <el-container class="mb-5">
      <el-aside width="240px" style="height:88vh">
        <el-menu>
          <li v-for="(item,index) in ltabs" :key="index" :class="{active:index === tableShowName}" @click="ltab(index,item)">{{item}}</li>
        </el-menu>
      </el-aside>
      <el-main class="p-0">
        <div style="padding:20px">
          <div class="d-inline">
            <el-date-picker v-model="selectTime" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy 年 MM 月 dd 日" value-format="timestamp" :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
            <button class="search" @click="search">查询</button>
            <button class="search" @click="exportExcel" v-show="theData.length > 0">导出表格</button>
          </div>
        </div>
        <div class="d-flex align-items-stretch" style="padding: 5px; background: #f0f0f0;">
          <div style="min-width:240px;" v-show="rtabs.length >0">
            <el-aside class="lcon">
              <el-menu>
                <li v-for="(item,index) in rtabs" :key="index" :class="{active:index == tableShowTime}" @click="rtab(index,item)">{{item}}</li>
              </el-menu>
            </el-aside>
          </div>
          <div class="data-table" v-show="theData.length > 0">
            <div class="table-body">
              <el-table
                class="w-100"
                :data="theData"
                height="77vh"
                border>
                <el-table-column
                  prop="A"
                  :label="jsonTitleFirst"
                  width="160"
                  sortable
                  fixed>
                </el-table-column>
                <el-table-column
                  :prop="getCharCnt(index)"
                  :label="title"
                  width="160"
                  sortable
                  v-for="(title,index) in jsonTitle" :key="index">
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="nodata m-auto" v-show="rtabs.length < 1">点击上方查询按钮获取数据</div>
        </div>
      </el-main>
    </el-container>
    <div class="fixed-bottom">
      <Footer/>
    </div>
  </div>
</template>

<script>
import Header from 'components/header'
import Footer from 'components/footer'
import axios from 'axios'
import $ from 'jquery'
import {language} from 'lang'

let taskId = document.location.pathname.split('/')[2]
let http = axios.create({
  headers: { 'X-Xsrftoken': $('meta[name=_xsrf]').attr('content') }
})
export default {
  name: 'app',
  components: {
    Header,
    Footer
  },
  data () {
    return {
      tableShowName: 0, // 左侧列表的序号
      tableName: '', // 点击的表名
      ltabs: [],
      selectTime: [], // 日期选择器
      tableShowTime: 1, // 时间选择的序号
      allTime: '', // 全部时间
      tableTime: '', // 点击的时间
      rtabs: ['表一'],
      jsonTitleFirst: '', // 第一个表头，用于固定第一列
      jsonTitle: [], // 表头，用于固定行
      theData: [] // 表格的内容
    }
  },
  created: function () {
    var vm = this
    // 默认显示时间
    let curTime = Date.parse(new Date())
    let Yesterday = curTime - 60 * 60 * 24 * 1000
    vm.selectTime[0] = Yesterday
    vm.selectTime[1] = curTime
  },
  mounted: function () {
    var vm = this
    this.$nextTick(function () {
      http.get('/api/tabnamelist/' + taskId)
        .then(function (response) {
          let rsp = response.data
          console.log(rsp)
          if (rsp.Code === 0) {
            vm.ltabs = rsp.TabNames
            vm.tableName = rsp.TabNames[0]
          } else {
            vm.notify('error', 'Error 获取列表失败,请重新登录', 2000)
          }
        })
        .catch(function (error) {
          console.log(error)
          vm.notify('error', 'Error 获取列表失败,请重新登录', 2000)
        })
    })
  },
  methods: {
    // 错误提示
    notify (type, message, duration) {
      let vm = this
      if (type === 'success') {
        vm.$notify.success({
          title: language('login.js.success'),
          message: message,
          duration: duration
        })
      } else if (type === 'error') {
        vm.$notify.error({
          title: language('login.js.error'),
          message: message,
          duration: duration
        })
      }
    },
    getCharCnt: function (index) {
      return String.fromCharCode('B'.charCodeAt(0) + index)
    },
    /**
     * jsonTitleFirst 表格绑定的第一个title字段
     * jsonTitle 剩下title字段
     * 将二维数组最后转换为json格式
     */
    dealData (tabInfo) {
      let vm = this
      vm.jsonTitleFirst = tabInfo[0][0] // 用于固定第一列
      vm.jsonTitle = tabInfo[0].slice(1) // 用于固定第一行
      let jsonData = tabInfo.slice(1)
      let json = []
      for (let i = 0; i < jsonData.length; i++) {
        let arr = jsonData[i]
        let obj = {}
        for (let j = 0; j < arr.length; j++) {
          obj[String.fromCharCode('A'.charCodeAt(0) + j)] = arr[j]
        }
        json.push(obj)
      }
      vm['theData'] = json
    },
    // 表名切换
    ltab (index, item) {
      let vm = this
      if (index === this.tableShowName) {
        alert('此表格已显示')
        return
      }
      vm.$confirm('此操作将更新表格, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          vm.tableName = item
          vm.jsonTitleFirst = []
          vm.jsonTitle = []
          vm.theData = []
          vm.rtabs = []
          vm.tableShowName = index
          vm.tableShowTime = 1
          vm.$message({type: 'success', message: '表格已更新!'})
        })
        .catch(() => {
          vm.$message({type: 'info', message: '已取消'})
        })
    },
    // 根据时间查询表格
    search: function () {
      let vm = this
      let sTime = vm.selectTime[0] / 1000
      let eTime = vm.selectTime[1] / 1000
      console.log(sTime, eTime)
      http.post('/api/tablist',
        {
          Tabname: vm.tableName,
          Begin: sTime,
          End: eTime
        }
      )
        .then(function (response) {
          let rsp = response.data
          console.log(rsp)
          if (rsp.Code === 0) {
            vm.notify('success', '成功', 2000)
            if (rsp.Tabinfo === null || rsp.Tabs === null) {
              vm.jsonTitleFirst = []
              vm.jsonTitle = []
              vm.theData = []
              vm.rtabs = []
              vm.allTime = []
            } else {
              // 二级列表
              vm.rtabs = rsp.Tabs
              vm.allTime = vm.rtabs[0]
              if (vm.rtabs.length > 1) {
                vm.rtabs[0] = '全部'
              }
              // 默认表格内容
              vm.dealData(rsp.Tabinfo)
            }
          } else {
            vm.notify('error', 'Please login 请登录', 2000)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    // 不同时间的表格切换
    rtab (index, item) {
      let vm = this
      vm.tableShowTime = index
      if (item === '全部') {
        vm.tableTime = vm.allTime
      } else if (vm.tableTime === item) {
        return
      } else {
        vm.tableTime = item
      }
      http.post('/api/tabinfo',
        {
          Tabname: vm.tableName,
          Time: vm.tableTime
        }
      )
        .then(function (response) {
          let rsp = response.data
          console.log(rsp)
          if (rsp.Code === 0) {
            vm.notify('success', 'Success', 2000)
            vm.dealData(rsp.TabInfo)
          } else {
            vm.notify('error', 'Please login 请登录', 2000)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    // 打印xls
    exportExcel () {
      const html = `<html><head><meta charset='utf-8' /></head><body>
        ${document.getElementsByTagName('table')[0].outerHTML + document.getElementsByTagName('table')[1].outerHTML}
        </body></html>`
      const blob = new Blob([html], { type: 'application/vnd.ms-excel' })
      // 判断浏览器是否支持
      if ('download' in document.createElement('a')) {
        let eleLink = document.createElement('a')
        eleLink.href = URL.createObjectURL(blob)
        eleLink.download = this.tableName && this.tableTime
          ? `${this.tableName + this.tableTime}.xls`
          : '报表.xls'
        eleLink.style.display = 'none'
        // 触发点击
        document.body.appendChild(eleLink)
        eleLink.click()
        document.body.removeChild(eleLink)
      } else {
        alert('浏览器不支持，请更换浏览器')
      }
    }
  }
}
</script>

<style>
body {
  padding-top: 3.6rem;
}
li {
  list-style: none;
}
.lcon .el-menu {
  width: 240px;
}
.user-table .el-menu {
  text-align: center;
}
.user-table .el-menu li {
  list-style: none;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
}
.user-table .el-table th {
  background-color: #40beef;
  color: #fff;
}
</style>
<style scoped>
.lcon .active {
  background: #fff;
  border: 0;
}
.active {
  background: #f0f0f0;
  color: #40beef;
  border-left: 3px solid #40beef;
}
.data-table {
  overflow: auto;
  background-color: #fff;
}
.table-body {
  height: 77vh;
}
.nodata {
  height: 77vh;
  line-height: 77vh;
  color: #40beef;
}
.search {
  border: 0;
  background: #40beef;
  height: 40px;
  width: 100px;
  -webkit-border-radius: 6px;
  -moz-border-radius: 6px;
  -ms-border-radius: 6px;
  -o-border-radius: 6px;
  border-radius: 6px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  vertical-align: baseline;
}
</style>

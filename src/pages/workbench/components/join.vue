<template>
<div class="card">
  <div class="card-header">
    <div class="d-flex" style="justify-content:space-between">
      <div style="font-size:1.2rem;" >{{$t("workbench.join.takepart")}}</div>
    </div>
  </div>
  <div class="card-body">
    <el-table :data="projects">
    <el-table-column prop="id" label="NO." width="120"></el-table-column>
    <el-table-column prop="name" :label="$t('workbench.join.name')" width="180"></el-table-column>
    <el-table-column prop="typeStr" :label="$t('workbench.join.typeStr')"></el-table-column>
    <el-table-column prop="statusStr" :label="$t('workbench.join.statusStr')"></el-table-column>
    <el-table-column :label="$t('workbench.join.operate')" width="260">
      <template slot-scope="scope">
        <el-button type="primary" size="small" @click="viewProject(scope.row)">{{$t("workbench.join.see")}}</el-button>
        <router-link :to="{name:'limitMgr', params:{ id:scope.row.id }}" v-if="scope.row.tuflag >= 254">
          <el-button type="danger" size="small">{{$t("workbench.limitMgr.limitMgr")}}</el-button>
        </router-link>
        <a :href="'/table/' + scope.row.id">
          <el-button type="success" size="small" v-if="scope.row.tuflag >= 254">{{$t("workbench.limitMgr.reports")}}</el-button>
        </a>
      </template>
    </el-table-column>
  </el-table>
  </div>
</div>
</template>

<script>
import axios from 'axios'

var apiURL = '/api/projects'
var http = axios.create()

export default {
  name: 'app',
  data () {
    return {
      projects: [
      ]
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.getProjects()
    })
  },
  methods: {
    getProjects () {
      var vm = this
      var url = apiURL + '?username=true'
      http.get(url)
        .then(function (response) {
          let rsp = response.data
          // console.log(rsp)
          // TODO 异常处理
          vm.projects = rsp.projects
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    viewProject (row) {
      var url = '/projects/' + row.id
      window.location.href = url
    }
  }
}
</script>
<style>

</style>

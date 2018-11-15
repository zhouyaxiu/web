<template>
<div class="main">
  <Header/>
  <div class="container">
    <div class="row">
      <div class="col">
        <div class="card filter d-none d-md-block" v-if="med">
          <div class="card-body">
            <el-form :model="filter" ref="filter">
              <el-form-item :label="$t('projects.projecttype')">
                <el-radio-group size="medium" v-model="filter.type" @change="handleFilterType">
                  <el-radio-button :label=0>{{$t("projects.all")}}</el-radio-button>
                  <el-radio-button :label=1>{{$t("projects.voice")}}</el-radio-button>
                  <el-radio-button :label=2>{{$t("projects.picture")}}</el-radio-button>
                  <el-radio-button :label=3>{{$t("projects.text")}}</el-radio-button>
                  <el-radio-button :label=4>{{$t("projects.video")}}</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-form>
            <!-- <div class="search">
              <div class="col-md-4" style="padding:0rem">
                <el-input placeholder="请输入内容">
                  <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
              </div>
            </div> -->
          </div>
        </div>
        <div class="card project" v-for="project in projects" :key="project.id">
          <div class="card-body">
            <div class="media" :id="'project' + '-' + project.id">
              <div class="d-flex align-self-top">
                <a :href="'/projects/' + project.id">
                  <img class="rounded" slot="aside" :src="project.cover" onerror="src='/static/img/project-cover-default.png'" blank-color="#ccc" width="155" height="85"/>
                </a>
              </div>
              <div class="media-body ml-3">
                <a :href="'/projects/' + project.id" style="text-decoration:none;color:#27253D">
                  <p class="h6 mt-0" style="line-height: 1.5">
                    <span class="mr-2" style="font-weight: bold">{{project.name}}</span>
                    <span class="badge border font-weight-light border-success text-success" style="padding: .4em .75em;border-radius: .2rem;">{{project.statusStr}}</span>
                  </p>
                </a>
                <p class="card-text" style="margin:0rem;color:#3c4858;font-size: 14px;line-height: 2">
                  <span class="mr-5">NO.{{project.id}}</span>
                  <span><span class="text-muted">{{$t("projects.typeStr")}}</span>{{project.typeStr}}</span>
                  <span class="ml-5"><span class="text-muted">{{$t("projects.duration")}}</span>{{project.duration}}{{$t("projects.day")}}</span>
                </p>
                <p class="card-text d-none d-sm-block">
                  <small class="text-muted">{{$t("projects.pubdate")}}</small>
                  <small class="text-muted mr-1 ml-1">|</small>
                  <small class="text-muted">{{$t("projects.label")}}</small>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="card-body d-flex align-items-center" v-if="!med && projects.length === 0" style="min-height:200px">
          <p class="h2 text-dark">暂无数据</p>
        </div>
        <div class="pager mt-1">
          <el-pagination background layout="total, prev, pager, next, jumper" :current-page="pager.page" :page-size="pager.pageSize" :total="pager.totalRow" @current-change="handleCurrentChange"></el-pagination>
        </div>
      </div>
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

var url = '/api/projects'
var http = axios.create({
  headers: {'X-Xsrftoken': $('meta[name=_xsrf]').attr('content')}
})
var medtype = document.location.search.substring(1).split('=')[1]
console.log(medtype !== 'medicine')
export default {
  name: 'app',
  components: {
    Header,
    Footer
  },
  data () {
    return {
      med: medtype ? 0 : 1,
      filter: {
        type: 0,
        status: 'all'
      },
      curpage: 1,
      pager: {},
      allprojects: [],
      allpager: [],
      projects: []
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      this.getProjects()
    })
  },
  methods: {
    handleCurrentChange (val) {
      let vm = this
      vm.pager.page = val
      vm.projects = vm.projects_.slice((val - 1) * vm.pager.pageSize, val * vm.pager.pageSize)
    },
    handleFilterType (val) {
      let vm = this
      this.filter.type = val
      vm.projects_.splice(0, vm.projects_.length)
      vm.projects_ = vm.allprojects.filter(function (data) {
        switch (vm.filter.type) {
          case 0:
            return true
          case 1:
            return data.sopTypeInt >= 0 && data.sopTypeInt < 4
          case 2:
            return data.sopTypeInt > 1000 && data.sopTypeInt < 1999
          case 3:
            return (data.sopTypeInt > 2000 && data.sopTypeInt < 2999) || data.sopTypeInt === 4
          case 4:
            return data.sopTypeInt > 3000 && data.sopTypeInt < 3999
        }
      })
      vm.$nextTick(function () {
        vm.projects = vm.projects_.slice(0, vm.pager.pageSize)
        vm.pager.totalRow = vm.projects_.length
      })
      vm.pager.page = 1
    },
    getProjects () {
      let vm = this
      http.get(url)
        .then(function (response) {
          let rsp = response.data
          // console.log(rsp)
          // TODO 异常处理
          vm.allpager = rsp.pager
          vm.allpager.pageSize = 10
          vm.allpager.totalPage = (vm.allpager.totalRow / vm.allpager.pageSize) + 1
          vm.allprojects = rsp.projects
          vm.filter.type = medtype ? 5 : vm.filter.type // 医疗类型处理
          vm.projects_ = vm.allprojects.filter(function (data) {
            switch (vm.filter.type) {
              case 0:
                return true
              case 1:
                return data.sopTypeInt >= 0 && data.sopTypeInt < 4
              case 2:
                return data.sopTypeInt > 1000 && data.sopTypeInt < 1999
              case 3:
                return (data.sopTypeInt > 2000 && data.sopTypeInt < 2999) || data.sopTypeInt === 4
              case 4:
                return data.sopTypeInt > 3000 && data.sopTypeInt < 3999
              case 5:
                return data.sopType === 'MEDICINE'
            }
          })
          vm.$nextTick(function () {
            vm.projects = vm.projects_.slice(0, vm.pager.pageSize)
            vm.pager.totalRow = vm.projects_.length
          })
          vm.pager.pageSize = 10
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
}
</script>

<style scoped>
/* filter 选项 */
.el-radio-button__inner {
  margin-left: 15px;
  border: 1px solid #d8dce6;
}
</style>

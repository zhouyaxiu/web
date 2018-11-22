<template>
<div class="card">
  <div class="card-header">
    <div class="d-flex">
      <div class="d-inline-block" style="font-size:1.2rem;">{{$t("user.skill.skillshow")}}</div>
      <div class="d-inline-block align-self-center ml-auto">
        <router-link :to="{ name: 'skillForm'}">
          <i class="el-icon-edit-outline">{{$t("user.skill.edit")}}</i>
        </router-link>
      </div>
    </div>
  </div>
  <div class="card-body">
    <div class="d-table">
      <div class="d-table-row">
        <div class="d-table-cell label-cell">{{$t("user.skill.language")}}</div>
        <div class="d-table-cell data-cell">
          <el-tag class="mr-1" type="primary" v-for="item in language" :key="item">{{getLanguage(item)}}</el-tag>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'
// import {language} from 'lang'

var url = '/api/user/skill'
var http = axios.create()
export default {
  name: 'skill',
  data () {
    return {
      language: []
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      this.getSkill()
    })
  },
  methods: {
    getSkill () {
      var vm = this
      http.get(url)
        .then(function (response) {
          var rsp = response.data
          if (rsp.code === 0) {
            var data = rsp.data
            vm.language = data.language
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    getLanguage (language) {
      if (language === 'chinese') {
        return language('user.skill.js.chinese')
      } else if (language === 'english') {
        return language('user.skill.js.english')
      } else if (language === 'spanish') {
        return language('user.skill.js.spanish')
      } else {
        return language
      }
    }
  }
}
</script>

<style scoped>
  .d-table {
    width: 100%;
    color: #48576A;
  }
  .d-table-row {
    line-height: 45px;
    text-align: right;
  }
  .label-cell {
    width: 100px;
    text-align: right;
  }
  .data-cell {
    line-height: 30px;
    text-align: left;
    padding-left: 16px;
  }
</style>

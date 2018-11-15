<template>
<div class="card">
  <div class="card-header">
    <div class="d-flex">
      <div class="d-inline-block" style="font-size:1.2rem;">{{$t("user.skill.editskill")}}</div>
    </div>
  </div>
  <div class="card-body">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item :label="$t('user.skill.language')">
        <el-select v-model="form.language" multiple  allow-create :placeholder="$t('user.skill.select')">
          <el-option style="top:10px;" v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateSkill('form')">{{$t("user.skill.save")}}</el-button>
        <el-button plain @click="toSkill">{{$t("user.skill.reset")}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import {language} from 'lang'

var url = '/api/user/skill'
var http = axios.create()
export default {
  name: 'app',
  data () {
    return {
      form: {
        language: []
      },
      rules: {
      },
      options: [{
        value: 'chinese',
        label: language('user.skill.js.chinese')
      }, {
        value: 'english',
        label: language('user.skill.js.english')
      }, {
        value: 'spanish',
        label: language('user.skill.js.spanish')
      }]
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
      let vm = this
      http.get(url)
        .then(function (response) {
          var rsp = response.data
          if (rsp.code === 0) {
            var data = rsp.data
            vm.form.language = data.language
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    updateSkill (form) {
      let vm = this
      this.$refs[form].validate((valid) => {
        // 表单验证
        if (!valid) {
          return false
        }
        let url = '/api/user/skill'
        axios.post(url, {
          language: vm.form.language
        })
          .then(function (response) {
            let rsp = response.data
            if (rsp.code === 0) {
              vm.$notify.success({
                title: language('user.skill.js.success'),
                message: rsp.message,
                duration: 2000
              })
              setTimeout(() => {
                vm.toSkill()
              }, 1000)
            } else {
              vm.$notify.error({
                title: language('user.skill.js.error'),
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
    toSkill: function () {
      this.$router.push({ path: '/skill' })
    }
  }
}
</script>

<style scoped>
.el-select__tags {
  width: 100%;
  max-width: 100%;
}
.el-select {
  display: inline-block;
  width: 80%;
  margin-right: 0;
  margin-left: 2%;
}
</style>

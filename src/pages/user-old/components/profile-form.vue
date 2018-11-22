<template>
<div class="card">
  <div class="card-header">
    <div class="d-flex">
      <div class="d-inline-block" style="font-size:1.2rem">{{$t("user.profile_form.editinfo")}}</div>
    </div>
  </div>
  <div class="card-body">
    <p class="card-text" style="color:#909399">{{$t("user.profile_form.tips")}}</p>
      <el-form :model="form" :rules="rules" ref="form" label-width="152px">
        <div class="row">
          <div class="col-md-8">
            <el-form-item :label="$t('user.profile_form.username')">
              <el-input v-model="form.username" style="width:53%" disabled></el-input>
            </el-form-item>
            <el-form-item :label="$t('user.profile_form.sex')" prop="gender">
              <el-select v-model="form.gender" :placeholder="$t('user.profile_form.pleaseselect')">
                <el-option :label="$t('user.profile_form.male')" value="1"></el-option>
                <el-option :label="$t('user.profile_form.female')" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('user.profile_form.birthday')" prop="birthday">
              <el-date-picker type="date" v-model="form.birthday" :placeholder="$t('user.profile_form.selectday')"></el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('user.profile_form.location')" prop="location">
              <el-cascader :options="locationList" v-model="form.location" :placeholder="$t('user.profile_form.pleaseselect')"></el-cascader>
            </el-form-item>
          </div>
          <div class="col-md-4">
            <el-upload class="avatar-uploader" action="/api/user/avatar" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <img v-if="form.avatar" :src="form.avatar" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div style="line-height:1.5">{{$t("user.profile_form.uploadavatar")}}</div>
            </el-upload>
          </div>
        </div>
        <el-form-item :label="$t('user.profile_form.nationality')">
          <el-select v-model="form.nationality" :placeholder="$t('user.profile_form.pleaseselect')">
            <el-option v-for="item in nationalityList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      <el-form-item :label="$t('user.profile_form.ethnicity')">
        <el-select v-model="form.ethnicity" :placeholder="$t('user.profile_form.pleaseselect')">
          <el-option :label="$t('user.profile_form.whiteperson')" :value="$t('user.profile_form.whiteperson')"></el-option>
          <el-option :label="$t('user.profile_form.yellowperson')" :value="$t('user.profile_form.yellowperson')"></el-option>
          <el-option :label="$t('user.profile_form.blackperson')" :value="$t('user.profile_form.blackperson')"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('user.profile_form.marriage')">
        <el-select v-model="form.marital" :placeholder="$t('user.profile_form.pleaseselect')">
          <el-option :label="$t('user.profile_form.unmarry')" value="1"></el-option>
          <el-option :label="$t('user.profile_form.married')" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('user.profile_form.monthertonue')">
        <el-select v-model="form.motherLanguage" clearable filterable :placeholder="$t('user.profile_form.pleaseselect')">
          <el-option
            v-for="(language,index) in languages"
            :key="index"
            :label="language"
            :value="language">
          </el-option>
        </el-select>
        <!-- <el-select v-model="form.motherLanguage" :placeholder="$t('user.profile_form.pleaseselect')">
          <el-option :label="$t('user.profile_form.chinese')" :value="$t('user.profile_form.chinese')"></el-option>
          <el-option :label="$t('user.profile_form.english')" :value="$t('user.profile_form.english')"></el-option>
        </el-select> -->
      </el-form-item>
      <el-form-item :label="$t('user.profile_form.education')">
        <el-select v-model="form.education" :placeholder="$t('user.profile_form.pleaseselect')">
          <el-option :label="$t('user.profile_form.juniorschool')" :value="$t('user.profile_form.juniorschool')"></el-option>
          <el-option :label="$t('user.profile_form.highschool')" :value="$t('user.profile_form.highschool')"></el-option>
          <el-option :label="$t('user.profile_form.juniorcollege')" :value="$t('user.profile_form.juniorcollege')"></el-option>
          <el-option :label="$t('user.profile_form.regularcollege')" :value="$t('user.profile_form.regularcollege') "></el-option>
          <el-option :label="$t('user.profile_form.graduatestudent')" :value="$t('user.profile_form.graduatestudent') "></el-option>
          <el-option :label="$t('user.profile_form.doctor')" :value="$t('user.profile_form.doctor') "></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('user.profile_form.industry')">
        <el-select v-model="form.industry" :placeholder="$t('user.profile_form.pleaseselect')">
          <el-option :label="$t('user.profile_form.internet')" :value="$t('user.profile_form.internet')"></el-option>
          <el-option :label="$t('user.profile_form.finance')" :value="$t('user.profile_form.finance')"></el-option>
          <el-option :label="$t('user.profile_form.edu')" :value="$t('user.profile_form.edu') "></el-option>
          <el-option :label="$t('user.profile_form.service')" :value="$t('user.profile_form.service') "></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('user.profile_form.income')">
        <el-select v-model="form.income" :placeholder="$t('user.profile_form.pleaseselect')">
          <el-option :label="$t('user.profile_form.lessthan')" :value="$t('user.profile_form.lessthan')"></el-option>
          <el-option label="1000~3000" value="1000~3000"></el-option>
          <el-option label="3000~5000" value="3000~5000"></el-option>
          <el-option :label="$t('user.profile_form.morethan')" :value="$t('user.profile_form.morethan')"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateProfile('form')">{{$t("user.profile_form.save")}}</el-button>
        <el-button plain @click="toProfile">{{$t("user.profile_form.reset")}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import locations from './locations'
import nationalitys from './nationalitys'
import languages from './language'
import {language} from 'lang'

var url = '/api/user/profile'
var http = axios.create()
export default {
  name: 'profileForm',
  data () {
    return {
      test: '',
      locationList: locations,
      nationalityList: nationalitys,
      languages: languages,
      form: {
        username: '',
        avatar: '',
        gender: '',
        birthday: '',
        country: '',
        province: '',
        city: '',
        location: [],
        nationality: '',
        ethnicity: '',
        marital: '',
        motherLanguage: '',
        education: '',
        industry: '',
        income: ''
      },
      rules: {
        gender: [{type: 'string', required: true, message: language('user.profile_form.js.rules.gender')}],
        birthday: [{type: 'date', required: true, message: language('user.profile_form.js.rules.birthday')}],
        location: [{type: 'array',
          required: true,
          len: 2,
          fields: {
            0: {type: 'string', required: true, message: language('user.profile_form.js.rules.fields')},
            1: {type: 'string', required: true, message: language('user.profile_form.js.rules.fields')}
          }}]
      }
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      this.getProfile()
    })
  },
  methods: {
    handleAvatarSuccess (res, file) {
      let vm = this
      vm.form.avatar = res.path
    },
    beforeAvatarUpload (file) {
      let vm = this
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        vm.$notify.error({
          title: language('user.profile_form.js.error.type1'),
          message: language('user.profile_form.js.error.type2'),
          duration: 2000
        })
      }
      if (!isLt2M) {
        vm.$notify.error({
          title: language('user.profile_form.js.error.type1'),
          message: language('user.profile_form.js.error.type3'),
          duration: 2000
        })
      }
      return isJPG && isLt2M
    },
    getProfile () {
      let vm = this
      http.get(url)
        .then(function (response) {
          var rsp = response.data
          if (rsp.code === 0) {
            var data = rsp.data
            vm.form.username = data.username
            vm.form.avatar = data.avatar
            vm.form.gender = data.gender === 0 ? '' : String(data.gender)
            vm.form.birthday = data.birthday === 0 ? '' : new Date(data.birthday * 1000)
            vm.form.country = data.country
            vm.form.province = data.province
            vm.form.city = data.city
            vm.form.location = [data.country, data.province]
            vm.form.nationality = data.nationality
            vm.form.ethnicity = data.ethnicity
            vm.form.marital = data.marital === 0 ? '' : String(data.marital)
            vm.form.motherLanguage = data.motherLanguage
            vm.form.education = data.education
            vm.form.industry = data.industry
            vm.form.income = data.income
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    updateProfile (form) {
      let vm = this
      this.$refs[form].validate((valid) => {
        // 表单验证
        if (!valid) {
          return false
        }
        http.post(url, {
          username: vm.form.username,
          avatar: vm.form.avatar,
          gender: Number(vm.form.gender),
          birthday: vm.form.birthday.getTime() / 1000,
          country: vm.form.location[0],
          province: vm.form.location[1],
          city: vm.form.city,
          nationality: vm.form.nationality,
          ethnicity: vm.form.ethnicity,
          marital: Number(vm.form.marital),
          motherLanguage: vm.form.motherLanguage,
          education: vm.form.education,
          industry: vm.form.industry,
          income: vm.form.income
        })
          .then(function (response) {
            let rsp = response.data
            if (rsp.code === 0) {
              vm.$notify.success({
                title: language('user.profile_form.js.success'),
                message: rsp.message,
                duration: 2000
              })
              setTimeout(() => {
                vm.toProfile()
              }, 1000)
            } else {
              vm.$notify.error({
                title: language('user.profile_form.js.error.type1'),
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
    toProfile: function () {
      this.$router.push({ path: '/profile' })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 200px;
  height: 200px;
  display: block;
}
</style>

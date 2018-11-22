<template>
<div class="card">
  <div class="card-header">
    <div class="d-flex">
      <div class="d-inline-block" style="font-size:1.2rem;">{{$t("user.profile.info")}}</div>
      <div class="d-inline-block align-self-center ml-auto">
        <router-link :to="{ name: 'profileForm'}">
          <i class="el-icon-edit-outline">{{$t("user.profile.edit")}}</i>
        </router-link>
      </div>
    </div>
  </div>
  <div class="card-body">
    <p class="card-text" style="color:#909399">{{$t("user.profile_form.tips")}}</p>
    <div class="d-table" style="float: left; width: 70%;">
      <div class="d-table-row">
        <div class="d-table-cell label-cell"><span style="color:#F56C6C">*</span>{{$t("user.profile_form.username")}}</div>
        <div class="d-table-cell data-cell">{{profile.username}}</div>
      </div>
      <div class="d-table-row">
        <div class="d-table-cell label-cell"><span style="color:#F56C6C">*</span>{{$t("user.profile_form.sex")}}</div>
        <div class="d-table-cell data-cell">{{getGender}}</div>
      </div>
      <div class="d-table-row">
        <div class="d-table-cell label-cell"><span style="color:#F56C6C">*</span>{{$t("user.profile_form.birthday")}}</div>
        <div class="d-table-cell data-cell">{{getBirthday}}</div>
      </div>
      <div class="d-table-row">
        <div class="d-table-cell label-cell"><span style="color:#F56C6C">*</span>{{$t("user.profile_form.location")}}</div>
        <div class="d-table-cell data-cell">{{getLocation}}</div>
      </div>
      <div class="d-table-row">
        <div class="d-table-cell label-cell">{{$t("user.profile_form.nationality")}}</div>
        <div class="d-table-cell data-cell">{{profile.nationality}}</div>
      </div>
      <div class="d-table-row">
        <div class="d-table-cell label-cell">{{$t("user.profile_form.ethnicity")}}</div>
        <div class="d-table-cell data-cell">{{profile.ethnicity}}</div>
      </div>
      <div class="d-table-row">
        <div class="d-table-cell label-cell">{{$t("user.profile_form.marriage")}}</div>
        <div class="d-table-cell data-cell">{{getMarital}}</div>
      </div>
      <div class="d-table-row">
        <div class="d-table-cell label-cell">{{$t("user.profile_form.monthertonue")}}</div>
        <div class="d-table-cell data-cell">{{profile.motherLanguage}}</div>
      </div>
      <div class="d-table-row">
        <div class="d-table-cell label-cell">{{$t("user.profile_form.education")}}</div>
        <div class="d-table-cell data-cell">{{profile.education}}</div>
      </div>
      <div class="d-table-row">
        <div class="d-table-cell label-cell">{{$t("user.profile_form.industry")}}</div>
        <div class="d-table-cell data-cell">{{profile.industry}}</div>
      </div>
      <div class="d-table-row">
        <div class="d-table-cell label-cell">{{$t("user.profile_form.income")}}</div>
        <div class="d-table-cell data-cell">{{profile.income}}</div>
      </div>
    </div>
    <div style="float: right; width: 28%;">
      <div>
        <img :src="profile.avatar" width="200px" height="200px">
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import {language} from 'lang'

var url = '/api/user/profile'
var http = axios.create()
export default {
  name: 'app',
  data () {
    return {
      profile: {
        username: '-',
        gender: '-',
        birthday: '-',
        country: '-',
        province: '-',
        nationality: '-',
        ethnicity: '-',
        marital: '-',
        motherLanguage: '-',
        education: '-',
        industry: '-',
        income: '-'
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
  computed: {
    getGender () {
      if (this.profile.gender === 1) {
        return language('user.profile.js.man')
      } else if (this.profile.gender === 2) {
        return language('user.profile.js.woman')
      } else {
        return this.profile.gender
      }
    },
    getMarital () {
      if (this.profile.marital === 1) {
        return language('user.profile.js.marital1')
      } else if (this.profile.marital === 2) {
        return language('user.profile.js.marital2')
      } else {
        return this.profile.marital
      }
    },
    getBirthday () {
      if (this.profile.birthday === '-') {
        return this.profile.birthday
      }
      let res = new Date(this.profile.birthday * 1000)
      return res.getFullYear() + '-' + (res.getMonth() + 1) + '-' + res.getDate()
    },
    getLocation () {
      return this.profile.country + '/' + this.profile.province
    }
  },
  methods: {
    getProfile () {
      let vm = this
      http.get(url)
        .then(function (response) {
          var rsp = response.data
          var data = rsp.data
          for (let key in data) {
            if (data[key] === 0 || data[key] === '') {
              data[key] = '-'
            }
          }
          vm.profile = data
        })
        .catch(function (error) {
          console.log(error)
        })
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
    width: 90px;
    text-align: right;
  }
  .data-cell {
    line-height: 30px;
    text-align: left;
    padding-left: 16px;
  }
</style>

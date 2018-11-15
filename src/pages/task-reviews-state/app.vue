<template>
<div id="main">
  <Header/>
  <div class="container mb-5">
    <div class="row">
      <div class="col-lg-3 col-md-4 mb-3" v-for="(item, index) in option" :key="index">
        <a :href="getUrl(item.uuid, item.checkres)">
          <div class="card" :class="getStatus(item.checkres)">
            <div class="card-body p-3">
              <h5 class="card-title font-weight-bold">{{staCheck(item.checkres)}}</h5>
              <p class="card-text mb-1">{{item.username}}</p>
              <p class="card-text"><small>{{item.uuid.slice(0, 8)}}</small></p>
            </div>
          </div>
        </a>
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

let projectId = document.location.pathname.split('/')[2]
let http = axios.create({
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
      option: [
        {
          username: 'QyCq7ltUMJZF7wIC',
          checkres: 1,
          uuid: 'QyCq7ltUMJZF7wIC'
        }, {
          username: 'QyCq7ltUMJZF7wIC',
          checkres: 1001,
          uuid: 'QyCq7ltUMJZF7wIC'
        }, {
          username: 'QyCq7ltUMJZF7wIC',
          checkres: -1,
          uuid: 'QyCq7ltUMJZF7wIC'
        }, {
          username: 'QyCq7ltUMJZF7wIC',
          checkres: -999,
          uuid: 'QyCq7ltUMJZF7wIC'
        }, {
          username: 'QyCq7ltUMJZF7wIC',
          checkres: 0,
          uuid: 'QyCq7ltUMJZF7wIC'
        }, {
          username: 'QyCq7ltUMJZF7wIC',
          checkres: -3,
          uuid: 'QyCq7ltUMJZF7wIC'
        }, {
          username: 'QyCq7ltUMJZF7wIC',
          checkres: 999,
          uuid: 'QyCq7ltUMJZF7wIC'
        }, {
          username: 'QyCq7ltUMJZF7wIC',
          checkres: -2,
          uuid: 'QyCq7ltUMJZF7wIC'
        }, {
          username: 'QyCq7ltUMJZF7wIC',
          checkres: 2,
          uuid: 'QyCq7ltUMJZF7wIC'
        }, {
          username: 'QyCq7ltUMJZF7wIC',
          checkres: 1003,
          uuid: 'QyCq7ltUMJZF7wIC'
        }, {
          username: 'QyCq7ltUMJZF7wIC',
          checkres: 3,
          uuid: 'QyCq7ltUMJZF7wIC'
        }
      ]
    }
  },
  computed: {
    getUrl () {
      let taskUrl = ''
      return (uuid, status) => {
        taskUrl = `/projects/${projectId}/task/review?taskid=${projectId}&uuid=${uuid}&status=${status}`
        return taskUrl
      }
    },
    staCheck () {
      return (checkres) => {
        if (checkres < 0) {
          return '拒绝'
        }
        if (checkres >= 0 && checkres < 1000) {
          return '待审核'
        }
        if (checkres > 1000) {
          return '成功'
        }
      }
    },
    getStatus () {
      return (checkres) => {
        if (checkres > 1000) {
          return 'green-first'
        }
        if (checkres > 2 && checkres <= 999) {
          return 'blue-third'
        }
        if (checkres === 2) {
          return 'blue-second'
        }
        if (checkres === 1) {
          return 'blue-first'
        }
        if (checkres === 0) {
          return 'text-secondary'
        }
        if (checkres === -1) {
          return 'red-first'
        }
        if (checkres === -2) {
          return 'red-second'
        }
        if (checkres < -2 && checkres >= -999) {
          return 'red-third'
        }
      }
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      let vm = this
      vm.getTasks()
    })
  },
  methods: {
    getTasks (pageNum = 1) {
      let vm = this
      let url = '/api/follow'
      http.get(url)
        .then(function (response) {
          let rsp = response.data
          // console.log(rsp)
          if (rsp.code === 0) {
            vm.option = rsp
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
        })
    }
  }
}
</script>

<style>
a:hover {
  text-decoration: none;
}
</style>

<style scoped>
.blue-first {
  background-color: #ecf5ff;
  border-color: #b3d8ff;
  color: #007bff;
}
.blue-second {
  background-color: #409eff;
  border-color: #409eff;
  color: #fff;
}
.blue-third {
  background-color: #007bff;
  border-color: #007bff;
  color: #fff;
}
.green-first {
  background-color: #67c23a;
  border-color: #67c23a;
  color: #fff;
}
.red-first {
  background: #fef0f0;
  border-color: #fbc4c4;
  color: #f83d4e;
}
.red-second {
  background-color: #fd5a5a;
  border-color: #fd5a5a;
  color: #fff;
}
.red-third {
  background-color: #f83d4e;
  border-color: #f83d4e;
  color: #fff;
}

</style>

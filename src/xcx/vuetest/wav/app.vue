<template>
<div class="main">
  <Header location="login"/>
  <!-- <wav @postTask="postTask" ref="wav"></wav>
  <Vmodel></Vmodel> -->
  <file></file>
  <Footer/>
</div>
</template>

<script>
import Header from 'components/header'
import Footer from 'components/footer'
import wav from './components/wav'
import Vmodel from './components/v_model'
import file from './components/file'
import axios from 'axios'
import $ from 'jquery'

var url = '/api/login'
var http = axios.create({
  headers: {'X-Xsrftoken': $('meta[name=_xsrf]').attr('content')}
})
export default {
  name: 'app',
  components: {
    Header,
    Footer,
    wav,
    Vmodel,
    file
  },
  data () {
    return {
      sampleVoice: {
        notes: [
          { id: '000', begin: '0.000', end: '3.680' },
          { id: '001', begin: '3.680', end: '15.000' }
        ],
        src: 'https://s302.fanhantech.com/fanhan.mp3'
      },
      playlist:''
    }
  },
  mounted:function(){
    // let vm=this
    // vm.$refs.wav.voiceLoad(
    //   vm.sampleVoice.src,
    //   vm.sampleVoice.notes
    // )
  },
  methods: {
    postTask:function(params){
      console.log('提交成功')
    },
 
  }
}
</script>

<style>
.login-social {
  margin-top: 16px;
  line-height: 25px;
  color: #8590a6;
  font-size: 14px;
  text-align: center;
}
.login-social p {
  cursor: pointer;
}
.login-socialBun {
  margin-left: 2px;
  transition: opacity 0.3s ease;
}
.login-socialBun a{
  color: #8590a6;
}
.login-socialBun i {
  font-size: 18px;
}
</style>

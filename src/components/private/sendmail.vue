<template>
 <div class="mail-box" v-show="speakeStatus === true">
  <i class="fa fa-close fh-close" @click="hidePanel"></i>
  <p class="fh-contact-way">{{$t("sendmail.title1")}}</p>
  <p>{{$t("sendmail.contactPhone")}}</p>
  <p>{{$t("sendmail.contactMail")}}</p>
  <p class="fh-contact-way">{{$t("sendmail.title2")}}</p>
  <div>
      <label for="n">{{$t("sendmail.name")}}</label>
      <input type="text" name="name" :placeholder="$t('sendmail.name')" id="n">
  </div>
  <div>
      <label for="e">{{$t("sendmail.mail")}}</label>
      <input type="text" name="email" :placeholder="$t('sendmail.mail')" id="e">
  </div>
  <div>
      <label for="p">{{$t("sendmail.phone")}}</label>
      <input type="text" name="number" :placeholder="$t('sendmail.phone')" id="p">
  </div>
  <div>
      <label for="m">{{$t("sendmail.message")}}</label>
      <textarea name="message" :placeholder="$t('sendmail.message')" id="m"></textarea>
  </div>
  <el-button type="primary" @click="sendEmail" class="mail-btn">{{$t("sendmail.send")}}</el-button>
  <a href="mailto" id="send"></a>
</div>
</template>

<script>
import $ from 'jquery'
import {language} from 'lang'
export default {
  name: 'app',
  props: {
    speakeStatus: {
      type: Boolean,
      default: false
    }
  },
  mounted: function () {
    $('.mail-box').on('input propertychange', ['input', 'textarea'], function (e) {
      $(e.target.parentNode).toggleClass('in', !!$(e.target).val())
    })
  },
  methods: {
    hidePanel () {
      this.$emit('hidePanel')
    },
    sendEmail () {
      var name = $("[name='name']").val()
      var email = $("[name='email']").val()
      var number = $("[name='number']").val()
      var message = $("[name='message']").val()
      var body = language('sendmail.js.name') + '%20:%20' + name + '%0a%0d' +
          language('sendmail.js.mail') + '%20:%20' + email + '%0a%0d' +
          language('sendmail.js.phone') + '%20:%20' + number + '%0a%0d' +
          language('sendmail.js.message') + '%20:%20' + '%0a' + message + '%0a%0d'
      if (name === '' || email === '' || number === '' || message === '') { alert(language('sendmail.js.rule')); return }
      $('#send').attr('href', 'mailto:fanhan@fanhantech.com?subject=' + language('sendmail.js.title') + '（' + name + '）&body=' + body)
      document.getElementById('send').click()
    }
  }
}
</script>
<style >
.mail-box {
  position: fixed;
  width: 45%;
  min-width: 400px;
  max-width: 650px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  box-shadow: 0px 4px 20px 3px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding:30px 3% 40px;
  box-sizing: border-box;
  z-index: 1050;
}
.mail-box .fh-close{
  position: absolute;
  right:1.2rem;
  top:1rem;
  color:#999;
  cursor: pointer;
}
.mail-box p{
  margin-bottom: .2rem;
  color: #999;
  font-size: 12px;
}
.mail-box .fh-contact-way {
  font-size:14px;
  color:#333;
  font-weight:bold;
}
.mail-box label{
  position: relative;
  left: 0;
  top: 32px;
  opacity: 0;
  font-size: 14px;
  color: #409eff;
  margin-bottom: 0rem;
  -webkit-transition: top .3s ,opacity .3s;
  line-height: 1;
}
.mail-box input,
.mail-box textarea{
  padding-bottom: 25px;
  width: 100%;
  outline: none;
	border: none;
  border-bottom: 1px solid #e4e7ed;
	background-color: transparent;
  font-size: 14px;
}
.mail-box textarea{
  resize: none;
}
.mail-box .in label {
    top: 5px;
    opacity: 1;
}
.mail-box .in input {
  padding-bottom: 10px;
  padding-top: 5px;
  margin-top: 5px;
}
.mail-btn{
  margin-top:1.5rem;
}
</style>

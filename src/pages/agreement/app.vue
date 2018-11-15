<template>
<div class="main">
  <Header/>
  <div class="container">
    <!-- Content here -->
    <div class="card agreement">
      <div class="card-body">
        <En v-show="lang === 'en' "/>
        <Cn v-show="lang === 'zh' "/>
      </div>
    </div>
  </div>
  <Footer/>
</div>
</template>

<script>
import Header from 'components/header'
import Footer from 'components/footer'
import En from './components/en'
import Cn from './components/cn'
import {lang} from 'lang'

export default {
  name: 'app',
  components: {
    Header,
    Footer,
    En,
    Cn
  },
  data () {
    return {
      lang: lang
    }
  }
}
</script>

<style scoped>
.card-body p {
  text-indent: 2rem;
}
</style>

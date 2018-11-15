<template>
  <div id="footer">
    <nav class="navbar navbar-light py-2">
      <ul class="navbar-nav mx-auto">
        <span class="navbar-text">{{$t("footer.title")}} Copyright &copy; 2018</span>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>
<style>
  /* footer 固定在页面底部 */
  #footer {
    flex: 0 0 auto;
  }
  .navbar {
    background-color:#FFFFFF;
  }
</style>

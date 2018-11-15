<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <meta name="keywords" content="Fanhan,泛函科技，数据标注,数据采集,数据清洗,人工智能,人脸识别,无人驾驶,任务平台，标注平台">
    <meta name="description" content="Fanhan泛函科技，致力于人工智能语音视频、图像文本的数据采集、数据清洗、数据标注等服务。泛函科技拥有30多个国家、50多种语言的稳定数据生产源和全球上万的标注资源，以高效率，高性价比，高品质的数据和服务，推动人工智能生态链的建设。">
    <meta name="_role" content="{<{.role}>}">
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico">
    <title>泛函数据平台</title>
    <% for (var i in htmlWebpackPlugin.options.cdn.css) { %><link href="<%= htmlWebpackPlugin.options.cdn.css[i] %>" rel="stylesheet"><% } %>
    <!-- Baidu Analytics -->
    <script>
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?5ed70e541d0182a782a07352d614ed06";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();
    </script>
  </head>
  <body>
    <div id="app"></div>
    <!-- built files will be auto injected -->
    <% for (var i in htmlWebpackPlugin.options.cdn.js) { %><script src="<%= htmlWebpackPlugin.options.cdn.js[i] %>"></script><% } %>
  </body>
</html>

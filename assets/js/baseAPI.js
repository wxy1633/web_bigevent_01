// 开发环境服务器地址
var baseURL = 'http://ajax.frontend.itheima.net'
// 测试环境
// 生产环境

// 拦截所有ajax请求： get/post/ajax
$.ajaxPrefilter(function (params) {
  // 拼接对应环境的服务器地址
  params.url = baseURL + params.url;

  // 对需要权限的接口配置头信息
  // 必须以my开头才行
  if (params.url.indexOf('/my/') !== -1) {
    params.headers = {
      // 访问后台页面需要  token
      // 重新登录，因为 token过期事件12小时
      Authorization: localStorage.getItem('token') || ''
    }
  }
  // 3 拦截所有响应，判断身份验证
  params.complete = function (res) {
    console.log(res.responseJSON);
    var obj = res.responseJSON
    console.log(obj);
    if (obj.status == 1 && obj.message == '身份认证失败！') {
      // 1.清空本地token
      localStorage.removeItem('token')
      // 2.页面跳转
      location.href = '/login.html'
    }
  }

  
});
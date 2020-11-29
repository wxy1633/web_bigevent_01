$(function () {
    // 1.获取用户信息
    getUserInof()
    // 2.退出按钮
    $('#btnLogout').on('click',function () {
        
        layer.confirm('是否确认退出？', {icon:3,title:'提示'},function (index) {
            // 1.清空本地token 
            localStorage.removeItem('token')
            // 2.页面跳转
            location.href = '/login.html'
            // 3.关闭询问框
            layer.close(index)
        })  
           
    })
})

// 2获取用户信息 函数（封装到入口函数的外面了）
// 原因：后面其他的页面要调用
function getUserInof() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     // 访问后台页面需要  token
        //     // 重新登录，因为 token过期事件12小时
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) return layui.layer.msg(res.message)
            // 请求成功，渲染用户头像信息
            rendedAvatar(res.data)
        }


    })
}

// 3封装用户头像函数
function rendedAvatar(user) {
    // 1.用户名
    var name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 2.用户头像
    if(user.user_pic !== null){
        $('.layui-nav-img').attr('src',user.user_pic).show()
        $('.text-avatar').hide()
    }else{
        $('.layui-nav-img').hide()
        var text = name[0].toUpperCase()
        $('.text-avatar').html(text).show()
    }
}
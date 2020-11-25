$(function () {
    //1 功能和功能之间 空格隔开 结构清晰
    // 2.注释要写好

    // 1点击去注册
    $('#link_reg').on('click',function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 2点击去登录
    $('#link_login').on('click',function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 3自定义表单
    var form = layui.form
    // 4 提示信息
    var layer = layui.layer
    form.verify({
        // 密码规则
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
          ] ,
        //   确认密码规则   简单的用  数组  复杂用函数
        // value  是  确认密码框的值
        repwd:function (value) {
            // 用的属性选 input  写不写都可以 
            var pwd = $('.reg-box input[name=password]').val()
            if(pwd !== value){
                return '两次输入密码不一致'
            }
        }

    })

    // 4  表单提交
    $('#form_reg').on('submit',function (e) {
        // 阻止表单默认提交跳转，让ajax来做
        e.preventDefault()     //写错了单词  导致表单直接跳转 没有执行下面代码
        // 用ajax来做
        $.ajax({
            method:'POST',
            url:'/api/reguser',
            data:{
                username:$('.reg-box [name=username]').val(),
                password:$('.reg-box [name=password]').val()
                // 或者：  $(this).serialize()
            },
            success:function (res) {
                // 返回状态判断
                if(res.status !== 0) return layer.msg(res.message)
                // 提交成功后处理代码
                layer.msg(res.message)
                // 手动切换到登录表单
                $('#link_login').click()
                // 重置form表单
                $('#form_reg')[0].reset()
            }
        })
    })

    // 5 表单登录
    $('#form_login').on('submit',function (e) {
        // 阻止表单默认提交
        e.preventDefault()
        // ajax
        $.ajax({
            method:'POST',
            url:'/api/login',
            data:$(this).serialize(),
            success:function (res) {
                // 判断状态码
                if(res.status !== 0) return layer.msg(res.message)
                // 提示信息 保存token  跳转页面

                layer.msg(res.message)
                // 保存token ,未来的接口要使用token
                localStorage.setItem('token',res.token)
                //跳转
                location.href = '/index.html'
            }
        })

    })
})
$(function () {
    // 1.自定义校验规则
    var form = layui.form
    console.log(form);
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度为1~6之间！'
            }
        }
    })

    // 2.用户渲染
    initUserInfo()
    // 导出layer  用到提示信息
    var layer = layui.layer
    // 封装函数
    function initUserInfo() {
      $.ajax({
          method:'GET',
          url:'/my/userinfo',
          success:function (res) {
              if(res.status !== 0) return layer.msg(res.message)
            //   成功
            form.val('formUserInfo',res.data)
          }
      })
    }

    // 3.表单重置
    $('#btnReset').on('click',function (e) {
        // 阻止表单默认行为
        e.preventDefault()
        // 重新用户渲染
        initUserInfo()
    })

    // 4.修改用户信息
    $('.layui-form').on('submit',function (e) {
        // 阻止表单默认行为
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function (res) {
                console.log(res);
                if(res.status !== 0) return layer.msg('用户信息修改失败！')
                layer.msg('恭喜您，用户修改信息成功！')
                // 调用父亲的函数  重新渲染图片
                window.parent.getUserInfo()
            }
        })
    })
})
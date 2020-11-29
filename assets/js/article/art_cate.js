$(function () {
    //1 获取文章分类的列表
    initArtCateList()
    // 封装
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                console.log(res);
                var htmlStr = template('tpl-list', res)
                $('tbody').html(htmlStr)
            }
        })
    }


    //  2显示添加文章分类列表
    var layer = layui.layer
    var indexAdd = null
    // 添加类别 功能
    $('#btnAdd').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '260px'],
            content: $('#dialog-add').html()
        });

    })

    //3 提交文章分类
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        // ajax发起请求
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 添加成功重新渲染页面
                initArtCateList()
                // 提示
                layer.msg('恭喜您，文章类别添加成功')
                // 关闭提示框
                layer.close(indexAdd)
            }
        })
    })
    // 表单赋值
    var form = layui.form
    var indexEdit = null
    // 4编辑文章分类
    $('tbody').on('click','.btn-edit',function () {
        //4.1 利用框架代码，显示提示添加文章类别区域
        indexEdit = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '260px'],
            content: $('#dialog-edit').html()
        });

        // 4.2
        var Id = $(this).attr('data-id')
        // ajax发送请求
        $.ajax({
            method:'GET',
            url:'/my/article/cates/'+ Id,
            success:function (res) {
                form.val('form-edit',res.data)
            }
        })
    })

    // 4.修改文章分类
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        // ajax发起请求
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 添加成功重新渲染页面
                initArtCateList()
                // 提示
                layer.msg('恭喜您，文章类别更新成功')
                // 关闭提示框
                layer.close(indexEdit)
            }
        })
    })

    // 5删除文章分类
    $('tbody').on('click','.btn-delete',function () {
        var Id = $(this).attr('data-id')
        layer.confirm('是否确认删除?', {icon: 3, title:'提示'},function(index){
            //do something
             $.ajax({
                 method:'GET',
                 url:'/my/article/deletecate/'+ Id,
                 success:function (res) {
                     if(res.status !== 0){
                         return layer.msg(res.message)
                     }
                    //  重新渲染
                    initArtCateList()
                     layer.msg('恭喜您，文章删除成功！')
                    //  关闭询问框
                    layer.close(index);
                 }
             })
           
          })
    })
})
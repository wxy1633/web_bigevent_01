$(function () {
    // 1.初始化分类
    var form = layui.form
    var layer = layui.layer
    initCate() //调用函数
    // 初始化富文本编辑器
    initEditor()
    // 封装
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg('获取成功')
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 
                form.render()
            }
        })
    }


    //2 裁剪
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 4上传图片  
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 5设置图片
    $('#coverFile').change(function (e) {
        // 拿到用户选择的文件
        var file = e.target.files[0]
        // 非空校验！
        if (file.length == undefined) {
            return
        }
        // 根据选择的文件，创建一个对应的URL地址
        var newImgURL = URL.createObjectURL(file[0])
        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 6.设置状态
    var state = '已发布'
    $('btnSave2').on('click', function () {
        state = '草稿'
    })

    // 7添加文章
    $('#form-pub').on('submit', function (e) {
        // 阻止默认提交
        e.preventDefault()
        // 创建FormData对象，搜集数据
        var fd = new FormData(this)
        // 放入状态
        fd.append('state', state)
        // 放入图片
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img',blob)
                // 发送 ，ajax要在 toBlob里面 等图片上传完，添加，上传
                console.log(...fd);
                publishArticle(fd)
            })
    })

    // 封装，添加文章的方法
    function publishArticle(fd) {
        $.ajax({
            method:'POST',
            url:"/my/article/add",
            data:fd,
            contentType:false,
            processData:false,
            success:function (res) {
                if(res.status !== 0) return layer.msg(res.message)
                layer.msg('恭喜您，发布文章成功！')
                location.href = '/article/art_list.html'
            }
        })
    }
})
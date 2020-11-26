$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)



    // 2.选择文件
    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })

    // 3监控图片变化
    var layer = layui.layer
    $('#file').on('change', function (e) {
        //  3.1  拿到用户选择的文件
        var file = e.target.file[0]
        // 前端非空校验
        if (file == undefined){
            layer.msg('出不来')
            return layer.msg('请选择图片！')
        }
        // 3.2  根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)
        // 3.3  先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 4.上传头像
    $('#btnUpload').on('click', function () {
        // 4.1 获取base64 类型的头像（字符串）
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 4.2传输图片
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('恭喜您，更换头像成功！')
                window.parent.getUserInof()
            }
        })
    })
})
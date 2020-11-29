$(function () {

    // 3过滤器  放在最上面  因为下面要用
    template.defaults.imports.dateFormat = function (dtStr) {
        var dt = new Date(dtStr)
        var y = padZero(dt.getFullYear())
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 4 过滤器 优化  补0操作
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //  1定义提交参数
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //文章分类的Id
        state: '' //文章的状态，可选值有：已发布、草稿

    }

    // 2.初始化文章列表
    initTable()
    // 初始化分类
    initCate()

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) return layui.layer.msg(res.status)
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }


    // 5.初始化分类
    var form = layui.form //导入form
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                console.log(res);
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    // 6.筛选功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取
        var state = $('[name=state]').val()
        var cate_id = $('[name=cate_id]').val()
        // 赋值
        q.state = state
        q.cate_id = cate_id
        // 初始化文章列表
        initTable()
    })
    // 分页
    var laypage = layui.laypage;
    // 7分页
    function renderPage(total) {
        // 执行一个laypage实例
        laypage.render({
            elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
                ,
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示多少数据
            curr: q.pagenum, //当前页码
            // 分页模块设置，显示那些子模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10], //每页显示多少条数据的选择器
            jump: function (obj, first) {
                // obj：所有参数所在的对象；first：是否是第一次初始化分页；
                //复制页面
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                // 判断，不是第一次初始化分页，才能重新调用初始化文章列表
                if (!first) {
                    // 初始化文章列表
                    initTable()
                }
            }
        })
    }

    // 8删除
    $('tbody').on('click', '.btn-delete', function () {
        // 根据id来删除文章
        var id = $(this).attr('data-id')
        //  弹出层
        layer.confirm('是否确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            // ajax请求
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) return layer.msg(res.message)
                    //  小问题 页面汇总删除按钮个数等于1，页码大于1
                    // 问题：如果最后一页
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--
                    //  成功重新渲染表格
                    initTable()
                    //  提示信息
                    layer.msg('恭喜您删除文章成功!')
                }
            })
            //  关闭
            layer.close(index);
        });
    })
})
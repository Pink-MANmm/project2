$('#flag').val('login')
$('#enter').on('click', function () {
    let username = $('#userName').val()
    let password = $('#passWord').val()
    let confirm = $('#flag').val()
    $.ajax({
        url: '/main/',
        type: 'POST',
        data: { 'userName': JSON.stringify(username), 'passWord': JSON.stringify(password), 'confirm': JSON.stringify(confirm) },
        success: function (data) {
            if (data['data'] == '密码输入错误') {
                alert(data['data'])
                location.href = '/'
            } else if (data['data'] == '账号不存在,请前往注册') {
                alert(data['data'])
                location.href = '/register'
            } else {
                alert(data['data'])
            }
        }
    })
})
//切换至注册页面
$('#register').on('click', function () {
    $.ajax({
        url: '/register/',
        type: 'GET',
        success: function (data) {

        }
    })
})

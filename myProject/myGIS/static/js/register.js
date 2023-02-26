$('#enter').on('click', function () {
    let username = $('#userName').val()
    let password = $('#passWord').val()
    let confirm = $('#confirm').val()
    if (username.length >= 6) {//判断用户名长度是否大于等于6
        if (password.length >= 6) {//判断密码长度是否大于等于6
            if (confirm === password) {//验证再次输入密码是否正确
                $.ajax({
                    url: '/main/',
                    type: 'POST',
                    data: { 'userName': JSON.stringify(username), 'passWord': JSON.stringify(password), 'confirm': JSON.stringify(confirm) },
                    success: function (data) {
                        if (data['status'] == '账号已注册，请返回登录') {
                            new Promise(function (resolve) {
                                alert(data['status'])
                                resolve()
                            })
                                .then(res => { location.href = '/' })
                        } else {
                            alert(data['status'])
                            $.ajax({
                                url: '/addUser/',
                                type: 'POST',
                                data: { 'username': JSON.stringify(data['username']), 'password': JSON.stringify(data['password']) },
                                success: function (data) {
                                }
                            })
                        }
                    }
                })
            } else if (confirm != password) {
                new Promise(function (resolve) {
                    alert('两次密码输入不一致!')
                    resolve()
                })
                    .then(res => { location.href = '/register' })
            }
        } else {
            new Promise(function (resolve) {
                alert('密码不得少于6位!')
                resolve()
            })
                .then(res => { location.href = '/register' })
        }
    } else {
        new Promise(function (resolve) {
            alert('用户名不得少于6位!')
            resolve()
        })
            .then(res => { location.href = '/register' })
    }
})

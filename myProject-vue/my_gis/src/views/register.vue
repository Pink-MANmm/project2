<template>
  <div id="register">
    <div id="tit">巡天</div>
    <div class="login-box">
      <h4 id="title_1">开源遥感情报系统</h4>
      <h4 id="title_2">Signup</h4>
      <div class="input-box">
        <div class="input-text">
          <span class="login-login"><img src="@/assets/logo/person.svg" style="width: 25px;height: 25px;"></span>
          <input name="userName" id="userName" type="text" placeholder="用户名" v-model="userName">
        </div>
        <div class="input-text">
          <span class="login-passwd"><img src="@/assets/logo/lock.svg" style="width: 25px;height: 25px;"></span>
          <input name="passWord" id="passWord" type="password" placeholder="密码" v-model="passWord">
        </div>
        <div class="input-text">
          <span class="login-passwd"><img src="@/assets/logo/lock-fill.svg" style="width: 25px;height: 25px;"></span>
          <input name="confirm" id="confirm" type="password" placeholder="确认密码" v-model="confirm">
        </div>
        <button class="button" id="enter" type="submit" @click="register">
          注册
        </button>
        <div class="signup">
          已有账户？<router-link to="/">登录</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userName: '',
      passWord: '',
      confirm: ''
    }
  },
  methods: {
    async register() {
      if (this.confirm === this.passWord) {
        const { data: regInfo } = await this.$http.post('/main/', { userName: this.userName, passWord: this.passWord, confirm: 'register' })
        alert(regInfo.status)
        if (regInfo.status === '注册成功!') {
          localStorage.setItem('token', `Bearer ${regInfo.token}`)
          this.$router.push('/home')
        } else if (regInfo.status === '用户名不得低于6位!') {
          this.userName = ''
        } else if (regInfo.status === '密码不得低于6位!') {
          this.passWord = ''
          this.confirm = ''
        } else if (regInfo.status === '账号已注册，请返回登录') {
          this.$router.push('/login')
        }
      } else {
        alert('两次输入密码不一致!')
        this.passWord = ''
        this.confirm = ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

#tit {
  position: absolute;
  top: 0%;
  left: 0%;
  margin: 10px 10px;
  height: 80px;
  font: bold 75px/80px '';
  font-family: cursive;
  color: #a797d6;
  user-select: none;
  text-shadow: 10px 10px 7px rgb(10, 10, 10);
}

#register {
  display: flex;
  justify-content: center;
  /*在容器中央对齐弹性项目*/
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background-image: url(@/assets/pic/1.jpg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  overflow: hidden;
}

.login-box {
  width: 600px;
  height: 420px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 6px;
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.4);
  text-shadow: 0px 1px 15px white;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  font-size: 70px;
  user-select: none;
  padding: 0 20px;

  /*盒子投影*/
  -webkit-box-reflect: below 0px -webkit-gradient(linear, left top, left bottom, from(transparent), color-stop(0%, transparent), to(rgba(250, 250, 250, 0.2)));
}

#title_1 {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  color: aliceblue;
  font-size: 25px;
}

#title_2 {
  width: 100%;
  display: flex;
  justify-content: center;
  color: aliceblue;
  font-size: 30px;
}

.login-box .input-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  transform: translateY(-35px);
}

.login-box .input-box .input-text {
  width: 100%;
  display: flex;
  justify-content: center;
}

.login-box .input-box .input-text span {
  color: aliceblue;
  font-size: 18px;
  margin-top: 20px;
}

.login-box .input-box .input-text input {
  border: 0;
  padding: 6px;
  border-bottom: 1px solid white;
  background-color: #ffffff00;
  color: #fff;
  margin-top: 20px;
}

input {
  border-radius: 5px;
}

.login-box .input-box .button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 25px auto 0px;
  width: 145px;
  height: 25px;
  color: #fff;
  background: linear-gradient(120deg, #a6c0fe 0%, #6115bd 100%);
  border-radius: 25px;
  border: none;
  cursor: pointer;
}

.login-box .input-box .signup {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 40px;
  color: #fff;
  font-size: 15px;
}

.login-box .input-box .signup a {
  color: #a6c0fe;
  text-decoration: none;
}
</style>
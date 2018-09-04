<template>
  <div class="login">
    <div class="container">
      <el-form :model="loginForm" :rules="rules" ref="loginform" class="demo-ruleForm">
        <img src="../assets/502.jpg" alt="" class="avatar">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="用户名"  prefix-icon="myicon myicon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type='password' v-model="loginForm.password" placeholder="密码" prefix-icon="myicon myicon-key"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('loginform')" class="login-btn">立即登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { login } from '@/api/index.js'
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      // console.log(this.$refs[formName])
      this.$refs[formName].validate(valid => {
        if (valid) {
          login(this.loginForm).then(res => {
            console.log(res)
            if (res.meta.status === 200) {
              // 成功提示
              this.$message({
                duration: 1000,
                message: res.meta.msg,
                type: 'success'
              })
              // 将当前的用户名存储到Store中
              // debugger
              // this.$store.dispatch('setusernameAction', res.data.username)
              // 将token值存储起来：使用localStorage
              localStorage.setItem('mytoken', res.data.token)
              // 进行路由跳转
              this.$router.push({name: 'Home'})
            } else {
              // 错误提示
              this.$message({
                showClose: true,
                message: res.meta.msg,
                type: 'error'
              })
            }
          })
        } else {
          // 错误提示
          this.$message({
            showClose: true,
            message: '请输入之后再提交',
            type: 'error'
          })
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
    .login {
    position: fixed;
    width: 100%;
    height: 100%;
    background: url('../assets/0111.png') no-repeat center left;
    // background-color: #2f4050;
    // background-color: #f5f5d5;

    .container {
      position: absolute;
      left: 0;
      right: 0;
      width: 400px;
      padding: 0px 40px 15px 40px;
      margin: 200px auto;
      background: white;
      .avatar {
        position: relative;
        left: 50%;
        width: 120px;
        height: 120px;
        margin-left: -60px;
        margin-top: -60px;
        box-sizing: border-box;
        border-radius: 50%;
        border: 10px solid #fff;
        box-shadow: 0 1px 5px #ccc;
        overflow: hidden;
      }
      .login-btn {
        width: 100%;
      }
    }
}
</style>

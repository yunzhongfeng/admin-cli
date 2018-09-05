<template>
  <div class="home">
    <el-container>
      <el-aside width="auto">
        <h1 class="logo"></h1>
        <el-menu  class="el-menu-admin" @open="handleOpen"
        @close="handleClose" background-color="#545c64" text-color="#fff"
        active-text-color="#ffd04b" :unique-opened='true' :collapse='isCollapse'
        :router='true'
        >
          <!-- 导航 1 -->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <!-- 子导航 1-->
              <el-menu-item index="user">
                    <i class="el-icon-location"></i>
                    <span>用户列表</span>
              </el-menu-item>
          </el-submenu>
          <!-- 导航 2 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>权限管理</span>
            </template>
            <!-- 子导航 1-->
              <el-menu-item index="2-1">
                    <i class="el-icon-location"></i>
                    <span>角色列表</span>
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <span class="toggle-btn myicon myicon-menu" @click='isCollapse = !isCollapse'></span>
          <h2 class="system-title">电商后台管理系统</h2>
          <div class="welcome">
            <span>你好:<i v-text="myname"></i></span>
            <el-button type="text" @click='loginOut'>退出登录</el-button>
          </div>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

  </div>
</template>

<script>
export default {
  data () {
    return {
      myname: '',
      isCollapse: false
    }
  },
  mounted () {
    this.myname = localStorage.getItem('myname')
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    loginOut () {
      this.$confirm('是否退出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          localStorage.removeItem('mytoken')
          this.$router.push({path: '/login'})
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出',
            duration: 1500
          })
        })
    }
  }
}
</script>

<style lang='scss' scoped>
.home {
  height: 100%;
  .el-menu-admin:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #545c64;
  }
  .logo {
    height: 60px;
    background: url(../assets/logo.png);
    background-size: cover;
    background-color: #fff;
    cursor: pointer;
  }
  .toggle-btn {
    padding: 0 15px;
    margin-left: -20px;
    font-size: 36px;
    color: white;
    cursor: pointer;
    line-height: 60px;
    &:hover {
      background-color: #4292cf;
    }
  }
  .system-title {
    font-size: 28px;
    color: white;
  }
  .welcome {
    color: white;
  }
}
</style>

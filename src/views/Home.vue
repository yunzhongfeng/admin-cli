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
          <!-- 导航  -->
          <el-submenu :index="item.id + ''" v-for='item in menuList' :key="item.id">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 子导航-->
              <el-menu-item :index="'/'+ subitem.path" v-for='subitem in item.children' :key="subitem.id">
                    <i class="el-icon-location"></i>
                    <span>{{subitem.authName}}</span>
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <span class="toggle-btn myicon myicon-menu" @click='isCollapse = !isCollapse'></span>
          <h2 class="system-title">电商后台管理系统</h2>
          <div class="welcome">
            <span>你好:<i> {{$store.state.username?$store.state.username:$store.getters.getUserName}}</i></span>
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
import { getMenu } from '@/api/index.js'
export default {
  data () {
    return {
      myname: '',
      isCollapse: false,
      menuList: []
    }
  },
  mounted () {
    getMenu().then(res => {
      this.menuList = res.data
      // console.log(this.menuList)
    })
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
          // localStorage.removeItem('mytoken')
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

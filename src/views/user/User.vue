<template>
    <div class="user">
      <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索框和添加用户按钮 -->
        <div style="margin-top: 15px;">  <!--      =>    =>   =>   =>   =>   =>   =>    =>         native :让组件中可以使用原生的事件,不加事件触发不了!!!           -->
            <el-input placeholder="请输入内容"  v-model='searchvalue' class="input-with-select search-input" @keydown.native.13="searchUserList" @blur="searchUserList">
                <el-button slot="append" icon="el-icon-search" @click='searchUserList'></el-button>
            </el-input>
            <el-button type="success" plain @click='showAddDialog'>添加用户</el-button>
        </div>
        <!-- 表单部分 -->
        <template>
            <el-table :data="userList" border style="width: 100%;margin-top: 15px;">
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column prop="username" label="姓名" width="180"> </el-table-column>
                <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>
                <el-table-column prop="mobile" label="电话"> </el-table-column>
                <el-table-column  label="授权状态">
                   <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="changeUserState(scope.row)"> </el-switch>
                   </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-tooltip content="编辑" placement="top" >
                            <el-button type="success" icon="el-icon-edit" plain @click='showeditDialog(scope.row)'></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top">
                            <el-button type="primary" icon="el-icon-delete" plain @click="deleteUser(scope.row.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip content="授权角色" placement="top">
                            <el-button type="primary" icon="el-icon-success" plain @click="showgrantDoalog(scope.row)"></el-button>
                        </el-tooltip>
                  </template>
               </el-table-column>
            </el-table>
        </template>
        <!-- 分页 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
         :page-sizes="[5, 10, 20]" :page-size="pagesize" background
        layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <!-- 下面是添加用户的对话框,默认是隐藏的,当点击添加按钮时显示 -->
        <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
          <el-form :model="addform" :rules="rules" ref="addform" label-width="100px">
            <el-form-item label="用户名" prop='username'>
              <el-input v-model="addform.username"></el-input>
            </el-form-item>
            <el-form-item label="密码"  prop='password'>
              <el-input type="password" v-model="addform.password" ></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop='email'>
              <el-input type="email" v-model="addform.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop='mobile'>
              <el-input v-model="addform.mobile"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addDialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click='addUserSubmit("addform")'>确 定</el-button>
          </div>
        </el-dialog>
        <!-- 下面是编辑用户的对话框,默认是隐藏的,当点击编辑按钮时显示 -->
        <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible">
          <el-form :model="editform" :rules="rules" ref="editform" label-width="100px">
            <el-form-item label="用户名" prop='username'>
              <el-input v-model="editform.username" disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop='email'>
              <el-input type="email" v-model="editform.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop='mobile'>
              <el-input v-model="editform.mobile"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editDialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUserSubmit('editform')">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 下面是分配角色权限的对话框,默认是隐藏的,当点击角色分配按钮时显示 -->
        <el-dialog title="添加用户" :visible.sync="grantDialogFormVisible">
          <el-form :model="grantform" :rules="rules" ref="grantform" label-width="100px">
              <el-form-item label="用户名" prop='username'>
                <el-input v-model="grantform.username" disabled="disabled" style="width:80px"></el-input>
              </el-form-item>
              <el-form-item label="角色">
                  <el-select v-model="grantform.rid" placeholder="请选择">
                    <el-option v-for="(value) in rolesList" :label="value.roleName" :value="value.id" :key="value.id"></el-option>
                  </el-select>
              </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="grantDialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="grantUserSubmit">确 定</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
import { getListData, addUser, editUser, deleteUser, getRolesList, grantUser, changeuserState } from '@/api/index.js'
export default {
  data () {
    return {
      pagenum: 1,
      pagesize: 5,
      total: 0,
      searchvalue: '',
      addDialogFormVisible: false, // 添加用户的对话框状态
      editDialogFormVisible: false, // 编辑用户的对话框状态
      grantDialogFormVisible: false, // 添加角色的对话框状态
      userList: [],
      rolesList: [], // 添加角色的对话框下拉列表数据
      addform: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editform: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      grantform: {
        username: '',
        id: '', // 用户id
        rid: ''// 当前用户所分配的角色id
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur,change' }
        ],
        mobile: [
          { required: true, message: '电话号码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    // 在页面加载完毕就立即加载数据
    this.handleSizeChange(this.pagesize)
  },
  methods: {
    // 1 点击添加按钮时显示编辑用户的对话框
    showeditDialog (row) {
      console.log(row)
      this.editform.id = row.id
      this.editform.username = row.username
      this.editform.email = row.email
      this.editform.mobile = row.mobile
      this.editDialogFormVisible = true
    },
    // 1.1实现用户数据编辑
    editUserSubmit (editformName) {
      this.$refs[editformName].validate(valid => {
        if (valid) {
          editUser(this.editform)
            .then(res => {
              // console.log(res)
              if (res.meta.status === 200) {
                // 成功提示
                this.$message({
                  duration: 1500,
                  message: res.meta.msg,
                  type: 'success'
                })
                this.initList() // 重新渲染页面数据
                this.editDialogFormVisible = false // 隐藏添加用户的对话框
              } else {
                // 失败提示
                this.$message({
                  message: res.meta.msg,
                  type: 'error'
                })
              }
            })
        } else {
          // 失败提示
          this.$message({
            message: '数据不能为空',
            type: 'error'
          })
        }
      })
    },
    showAddDialog () { // 2点击添加按钮时显示添加用户的对话框
      this.addDialogFormVisible = true
    },
    // 2.1 实现用户数据添加
    addUserSubmit (addformName) {
      this.$refs[addformName].validate(valid => {
        if (valid) {
          // console.log(this.addform)
          // 实现数据的新增
          addUser(this.addform)
            .then(res => {
              console.log(res)
              if (res.meta.status === 201) {
                // 成功提示
                this.$message({
                  duration: 1500,
                  message: res.meta.msg,
                  type: 'success'
                })
                this.initList() // 重新渲染页面数据
                // 清空表单
                this.$refs[addformName].resetFields()
                // this.addform.username = ''
                // this.addform.password = ''
                // this.addform.email = ''
                // this.addform.mobile = ''
                this.addDialogFormVisible = false // 隐藏添加用户的对话框
              } else {
                // 错误提示
                this.$message({
                  showClose: true,
                  message: res.meta.msg,
                  type: 'error'
                })
                return false
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
    // 3 实现搜索功能--- 用户数据的搜索
    searchUserList () {
      this.initList()
    },
    // 4 根据id来删除单个用户信息
    deleteUser (delid) {
      console.log(delid)
      this.$confirm(`是否要删除id为${delid}的数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteUser(delid).then(res => {
            console.log(res)
            if (res.meta.status === 200) {
              // 删除成功
              this.$message({
                duration: 1500,
                type: 'success',
                message: res.meta.msg
              })
              this.initList()
            } else {
              // 删除失败
              this.$message({
                duration: 2000,
                type: 'error',
                message: res.meta.msg
              })
            }
          })
        }).catch(() => {
          this.$message({
            duration: 1000,
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 5 显示授权角色的对话框
    showgrantDoalog (row) {
      // console.log(row)
      this.grantDialogFormVisible = true
      // 用户id
      this.grantform.id = row.id
      this.grantform.username = row.username
      console.log(this.grantform)
      getRolesList().then(res => {
        console.log(res)
        this.rolesList = res.data
      })
    },
    // 5.1 添加授权角色
    grantUserSubmit () {
      // console.log(this.grantform)
      if (!this.grantform.rid) {
        // rid为空的话就进来,给出提示
        this.$message({
          duration: 2500,
          type: 'warning',
          message: '请先选择角色，否则无法提交'
        })
      }
      // 下面就可以进行成功的逻辑了
      // console.log(this.grantform)
      grantUser({id: this.grantform.id, rid: this.grantform.rid})
        .then(res => {
          console.log(res)
          if (res.meta.status === 200) {
            // 授权成功
            this.$message({
              duration: 1500,
              type: 'success',
              message: res.meta.msg
            })
            this.grantDialogFormVisible = false
          } else {
            // 授权失败
            this.$message({
              duration: 2000,
              type: 'error',
              message: res.meta.msg
            })
          }
        })
    },
    // 6. 切换用户状态
    changeUserState (row) {
      console.log(row)
      changeuserState({uId: row.id, type: row.mg_state})
        .then(res => {
          console.log(res)
          if (res.meta.status === 200) {
            // 切换用户状态成功提示
            this.$message({
              duration: 1500,
              message: res.meta.msg,
              type: 'success'
            })
            this.initList() // 重新渲染页面数据
          } else {
            // 切换用户状态失败提示
            this.$message({
              message: res.meta.msg,
              type: 'error'
            })
          }
        })
    },
    // 7.分页事件：当每页显示的记录数设置变化的时候触发
    handleSizeChange (val) {
      this.pagesize = val
      this.initList()
    },
    // 7.1.分页事件：当当前页码发生变化的时候触发
    handleCurrentChange (val) {
      this.pagenum = val
      this.initList()
    //   console.log(`当前页: ${val}`)
    },
    // 0 调用回调函数拿到用户列表数据(api中的getListData(axios))
    initList () {
      getListData({query: this.searchvalue, pagenum: this.pagenum, pagesize: this.pagesize})
        .then(res => {
        //   console.log(res)
          this.userList = res.data.users
          this.total = res.data.total
        })
    }

  }
}
</script>

<style lang='scss' scoped>
.el-breadcrumb {
  background-color: #f5f5f5;
  height: 45px;
  font-size: 15px;
  padding-left: 10px;
  line-height: 45px;
  margin-bottom: 15px;
}
.user {
  .search-input {
    width: 300px;
  }
  .user-page {
    background-color: rgb(214, 210, 210);
    margin-top: 10px;
  }
}
</style>

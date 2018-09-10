<template>
    <div class="role">
        <!-- 面包屑,添加角色 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button type="success" plain @click="addDialogFormVisible=true">添加角色</el-button>
        <!-- 表格部分 -->
        <template>
            <el-table :data="rolesList" style="width: 100%" border>
                <!-- 展开行 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                            <el-row v-for='(item1) in scope.row.children' :key='item1.id'  style='margin-bottom:15px;'>
                                <el-col :span="4">
                                      <el-tag type="success"  closable  @close="deleteroleright(scope.row,item1.id)"> {{item1.authName}} </el-tag>
                                      <span class="el-icon-arrow-right" v-if='item1.children.length !== 0'></span>
                                </el-col>
                                <el-col :span="20">
                                    <el-row v-for='(item2) in item1.children' :key='item2.id'  style='margin-bottom:8px;'>
                                        <el-col :span="4">
                                           <el-tag type="warning"  closable  @close="deleteroleright(scope.row,item2.id)"> {{item2.authName}} </el-tag>
                                           <span class="el-icon-arrow-right" v-if='item2.children.length !== 0'></span>
                                        </el-col>
                                        <el-col :span="20">
                                            <el-tag type="info" v-for='(item3) in item2.children' :key="item3.id" style='margin-right:5px;margin-bottom:5px'  closable  @close="deleteroleright(scope.row,item3.id)"> {{item2.authName}} </el-tag>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                            <span v-if='scope.row.children.length === 0' style="color: red;">该角色还没有分配任何权限</span>
                    </template>
                </el-table-column>
                <el-table-column type="index" width="50"> </el-table-column>
                <el-table-column prop="roleName" label="角色名称"> </el-table-column>
                <el-table-column prop="roleDesc" label="描述" > </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-tooltip content="编辑" placement="top" >
                            <el-button type="success" icon="el-icon-edit" plain ></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top">
                            <el-button type="danger" icon="el-icon-delete" plain ></el-button>
                        </el-tooltip>
                        <el-tooltip content="角色管理" placement="top" effect="light">
                            <el-button type="primary" icon="el-icon-success" plain @click="showGrantDialog(scope.row)"></el-button>
                        </el-tooltip>
                  </template>
               </el-table-column>
            </el-table>
        </template>
        <!-- 下面是添加角色的对话框,默认是隐藏的,当点击添加按钮时显示 -->
        <el-dialog title="添加角色" :visible.sync="addDialogFormVisible">
          <el-form :model="addform" :rules="rules" ref="addRoleForm" label-width="100px">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="addform.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input v-model="addform.roleDesc" ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addDialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click='addRoleSubmit'>确 定</el-button>
          </div>
        </el-dialog>
        <!-- 下面是分配角色权限的对话框,默认是隐藏的,当点击授权角色按钮时显示 -->
        <el-dialog title="分配权限" :visible.sync="grantDialogFormVisible">
          <div slot="footer" class="dialog-footer">
             <div class="treeBox">
                <el-tree
                ref="tree"
                :data="rightList"
                show-checkbox
                :default-expand-all='true'
                node-key="id"
                :default-checked-keys="rolersListId"
                :props="defaultProps">
                </el-tree>
            </div>
            <el-button @click="grantDialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click='grantRoleSubmit'>确 定</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
import { getRolesList, deleteRoles, addRole, getRightsList, grantroleright } from '@/api/index.js'
export default {
  data () {
    return {
      // 角色列表数据
      rolesList: [],
      // 权限树状列表数据
      rightList: [],
      // 当前角色的权限列表id
      rolersListId: [],
      addDialogFormVisible: false, // 添加角色的对话框状态
      grantDialogFormVisible: false, // 授权角色的对话框状态
      currentRoleId: '', //  当前角色的id
      addform: {
        roleName: '',
        roleDesc: ''
      },
      defaultProps: {
        children: 'children', // 指定当前节点的嵌套节点属性--决定子节点的数据的来源
        label: 'authName' // 当前节点所显示的内容的属性名称
      }, // 验证规则
      rules: {
        roleName: [
          { required: true, message: '请输入授权角色名字', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    // 让数据页面一加载就显示
    this.initList()
  },
  methods: {
    // 授权角色的模态对话框
    showGrantDialog (row) {
      //   console.log(row)
      this.grantDialogFormVisible = true
      this.currentRoleId = row.id
      // 获取数据,将数据展示在树形组件中去 请求路径：roles/:roleId/rights
      getRightsList({type: 'tree'}).then(res => {
        // console.log(res)
        this.rightList = res.data
      })
      // 每个角色的权限都可能不一样，所以每次弹框都需要重新获取这个列表id,
      // 清空 setCheckedKeys中的值
      // this.rolersListId.length = 0
      this.$refs.tree.setCheckedKeys([])
      // 开始遍历
      // console.log(row)
      if (row.children.length !== 0) {
        row.children.forEach(value1 => {
          if (value1.children && value1.children.length !== 0) {
            value1.children.forEach(value2 => {
              if (value2.children && value2.children.length !== 0) {
                value2.children.forEach(value3 => {
                  this.rolersListId.push(value3.id)
                })
              }
            })
          }
        })
      }
    //   console.log(this.rolersListId)
    },
    // 分配角色权限
    grantRoleSubmit () {
      // console.log(this.$refs.tree.getCheckedNodes())
      var selectedNodes = this.$refs.tree.getCheckedNodes()
      console.log(selectedNodes)
      var resArr = selectedNodes.map(item => {
        return item.id + ',' + item.pid
      })
      // var resStr = resArr.join(',')
      // var reslut = resStr.split(',')
      // var reslutStr = new Set(reslut)
      // var finalArr = Array.from(reslutStr)
      // console.log(finalArr.join(','))
      var resStr = resArr.join(',')
      var finalArr = Array.from(new Set(resStr.split(',')))
      // console.log(finalArr)
      var currentStr = finalArr.join(',')
      // console.log(this.currentRoleId)
      // console.log(currentStr)
      // 需要的2个参数(roleId,rids)都拿到了,可以进行接口请求了
      grantroleright(this.currentRoleId, {rids: currentStr})
        .then(res => {
          if (res.meta.status === 200) {
          // 分配角色权限成功
            this.$message({
              duration: 1500,
              message: res.meta.msg,
              type: 'success'
            })
            this.grantDialogFormVisible = false
            this.initList()
          } else {
            // 分配角色权限失败
            this.$message({
              duration: 2000,
              message: res.meta.msg,
              type: 'error'
            })
          }
        })
    },
    // 添加角色
    addRoleSubmit () {
      addRole(this.addform).then(res => {
        console.log(res)
        if (res.meta.status === 201) {
          // 添加角色成功
          this.$message({
            duration: 1500,
            message: res.meta.msg,
            type: 'success'
          })
          this.addform.roleName = ''
          this.addform.roleDesc = ''
          this.addDialogFormVisible = false
          this.initList()
        } else {
          // 添加角色失败
          this.$message({
            duration: 2000,
            message: '添加角色失败',
            type: 'warning'
          })
          this.addform.roleName = ''
          this.addform.roleDesc = ''
        }
      })
    },
    // 删除角色权限
    deleteroleright (row, rightid) {
      console.log(row)
      console.log(rightid)
      deleteRoles(row.id, rightid).then(res => {
        console.log(res)
        if (res.meta.status === 200) {
          // 删除角色权限成功
          this.$message({
            duration: 1500,
            message: res.meta.msg,
            type: 'success'
          })
          row.children = res.data
        } else {
          // 删除角色权限失败
          this.$message({
            duration: 2000,
            message: res.meta.msg,
            type: 'warning'
          })
        }
      })
    },
    // 初始化角色列表数据
    initList () {
      getRolesList().then(res => {
        console.log(res)
        this.rolesList = res.data
      })
    }
  }
}
</script>

<style scoped>
    .el-breadcrumb {
    background-color: #f5f5f5;
    height: 45px;
    font-size: 15px;
    padding-left: 10px;
    line-height: 45px;
    margin-bottom: 15px;
    }
    .treeBox{
    height: 300px;
    overflow: auto
}
</style>

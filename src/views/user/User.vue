<template>
    <div class="user">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索框 -->
        <div style="margin-top: 15px;">
            <el-input placeholder="请输入内容" class="input-with-select search-input">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-button type="success" plain>添加用户</el-button>
        </div>
        <!-- 表单部分 -->
        <template>
            <el-table :data="userList" border style="width: 100%;margin-top: 15px;">
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column prop="username" label="姓名" width="180"> </el-table-column>
                <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>
                <el-table-column prop="mobile" label="电话"> </el-table-column>
                <el-table-column  label="状态">
                   <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
                   </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-tooltip content="编辑" placement="top">
                            <el-button type="success" icon="el-icon-edit" plain @click='handleEdit(scope.row)'></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top">
                            <el-button type="primary" icon="el-icon-delete" plain></el-button>
                        </el-tooltip>
                        <el-tooltip content="授权角色" placement="top">
                            <el-button type="primary" icon="el-icon-success" plain></el-button>
                        </el-tooltip>
                  </template>
               </el-table-column>
            </el-table>
        </template>
        <!-- 分页 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="1" :page-sizes="[1, 2, 3]" :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
</template>

<script>
import { getListData } from '@/api/index.js'
export default {
  data () {
    return {
      pagenum: 1,
      pagesize: 1,
      total: 0,
      userList: []
    }
  },
  mounted () {
    // 在页面加载完毕就立即加载数据
    this.handleSizeChange(this.pagesize)
  },
  methods: {
    handleEdit (row) {
      console.log(row)
    },
    // 1.分页事件：当每页显示的记录数设置变化的时候触发
    handleSizeChange (val) {
      this.pagesize = val
      this.initList()
    },
    // 2.分页事件：当当前页码发生变化的时候触发
    handleCurrentChange (val) {
      this.pagenum = val
      this.initList()
      console.log(`当前页: ${val}`)
    },
    initList () {
      getListData({query: '', pagenum: this.pagenum, pagesize: this.pagesize})
        .then(res => {
          console.log(res)
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

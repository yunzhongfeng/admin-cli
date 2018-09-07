<template>
    <div class="right">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 权限列表表格 -->
        <template>
            <el-table ref="singleTable" :data="rightList" border highlight-current-row>
                <el-table-column type="index" width="50">
                </el-table-column>
                <el-table-column property="authName" label="权限" width="130">
                </el-table-column>
                <el-table-column property="path" label="路径" width="130">
                </el-table-column>
                <el-table-column  label="层级" width="130">
                    <template slot-scope="scope">{{scope.row.level | levelFormat}}</template>
                </el-table-column>
            </el-table>
        </template>
    </div>
</template>

<script>
import {getAllRightsList} from '@/api/index.js'
export default {
  data () {
    return {
      rightList: []
    }
  },
  filters: {
    levelFormat (level) {
    //   console.log(typeof level)
      if (level === '0') return '一级'
      else if (level === '1') return '二级'
      else if (level === '2') return '三级'
    }
  },
  mounted () {
    getAllRightsList('list').then(res => {
      console.log(res)
      this.rightList = res.data
    })
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
</style>

<template>
    <div class="categories">
        <!-- categories商品分类 -->
        <!-- 面包屑 -->
        <div style="margin-top: 15px;">
          <el-button type="success" plain @click="showAddDialogForm">添加分类</el-button>
      </div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 自定义组件 -->
        <tree-grid :treeStructure="true" :columns="columns"
        :data-source="dataSource" @deleteCate="deleteCategory"
        @editCate="editCategory" >
        </tree-grid>
         <!-- 分页 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30]" :current-page="pagenum" :page-size="pagesize" background
        layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <!-- 添加分类对话框 -->
        <el-dialog title="添加商品分类" :visible.sync="addDialogFormVisible">
            <el-form :model="addform" ref="addForm" label-width='100px' >
                <el-form-item label="分类名称" prop='cat_name'>
                <el-input v-model="addform.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级名称">
                     <el-cascader expand-trigger="hover" :options="categorieLsit" v-model="selectedOptions" @change="handleChange" :props="cascaderProps"> </el-cascader>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click='addCateSubmit("addForm")'>确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getCategorieAll, addCategory } from '@/api/index.js'
import TreeGrid from '@/components/TreeGrid/TreeGrid.vue'
export default {
  data () {
    return {
      total: 0,
      pagenum: 1,
      pagesize: 10,
      dataSource: [],
      categorieLsit: [],
      selectedOptions: [],
      addDialogFormVisible: false,
      cascaderProps: {
        label: 'cat_name',
        children: 'children',
        value: 'cat_id'
      },
      addform: {
        cat_pid: '',
        cat_name: '',
        cat_level: ''
      },
      columns: [{
        text: '分类名称',
        dataIndex: 'cat_name',
        width: ''
      }, {
        text: '是否有效',
        dataIndex: 'cat_deleted',
        width: ''
      }, {
        text: '排序',
        dataIndex: 'cat_level',
        width: ''
      }],
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    'tree-grid': TreeGrid
  },
  mounted () {
    this.getCategories()
  },
  methods: {
    showAddDialogForm () {
      this.addDialogFormVisible = true
      getCategorieAll(2).then(res => {
        if (res.meta.status === 200) this.categorieLsit = res.data
      })
    },
    // 提交添加商品
    addCateSubmit (addForm) {
    //   console.log(addForm)
    //   this.$refs[addForm].validate(valid => {
    //     if (!valid) {
    //       // 错误提示
    //     //   this.$message({
    //     //     showClose: true,
    //     //     message: '不能为空',
    //     //     type: 'error'
    //     //   })
    //       console.log('不能为空')
    //       return false
    //     }
      //   console.log(this.selectedOptions)
      if (this.selectedOptions.length === 0) {
        this.addform.cat_pid = 0
        this.addform.cat_level = 0
      } else if (this.selectedOptions.length === 1) {
        this.addform.cat_level = 1
        this.addform.cat_pid = this.selectedOptions[0]
      } else if (this.selectedOptions.length === 2) {
        this.addform.cat_level = 2
        this.addform.cat_pid = this.selectedOptions[1]
        //   console.log(this.addform)
      }
      addCategory(this.addform).then(res => {
        console.log(res)
        if (res.meta.status === 201) {
          // 成功提示
          this.$message({
            duration: 1500,
            message: res.meta.msg,
            type: 'success'
          })
          this.addDialogFormVisible = false
          this.getCategories()
          this.addform.cat_name = ''
        } else {
          // 失败提示
          this.$message({
            duration: 2000,
            message: res.meta.msg,
            type: 'error'
          })
        }
      })
    //   })
    },
    handleChange (value) {
    //   console.log(value)
    //   this.addform.cat_name = value
    },
    // 获取商品分类数据
    getCategories () {
      getCategorieAll(3).then(res => {
        console.log(res)
        if (res.meta.status === 200) {
          this.dataSource = res.data
          this.total = res.data.total
        } else {
          this.$message({ type: 'success', message: res.meta.msg })
        }
      })
    },
    deleteCategory () {

    },
    editCategory () {

    },
    // 监听 pageSize 改变的事件
    handleSizeChange (sizeVal) {
      this.pagesize = sizeVal
      this.getCategories() // 刷新页面
      console.log(`每页 ${sizeVal} 条`)
    },
    // 监听 pagenum页码 改变的事件
    handleCurrentChange (numVal) {
      this.pagenum = numVal
      this.getCategories() // 刷新页面
      console.log(`当前页: ${numVal}`)
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
</style>

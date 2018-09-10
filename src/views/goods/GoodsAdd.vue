<template>
  <div class="add">
    <!-- Steps 步骤条 -->
    <el-steps :active="activeName - 0" finish-status="success">
      <el-step title="步骤 1" icon="el-icon-edit"></el-step>
      <el-step title="步骤 2" icon="el-icon-star-on"></el-step>
      <el-step title="步骤 3" icon="el-icon-upload"></el-step>
      <el-step title="步骤 4" icon="el-icon-picture"></el-step>
      <el-step title="步骤 5" icon="el-icon-tickets"></el-step>
    </el-steps>
    <!-- Tabs标签页 + form表单 -->
    <el-form :model="addForm" ref="addForm" label-width="80px" style="height:600px">
      <el-tabs v-model='activeName' tab-position="left" style='margin-top:30px;' @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称">
            <el-input v-model="addForm.goods_name" clearable maxlength='80' autofocus></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addForm.goods_price" clearable></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addForm.goods_weight" clearable min='1'></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addForm.goods_number" type='number' clearable min='0'></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader expand-trigger="click" :options="options" :props="catprops" v-model="selectedOptions" @change="handleChange">
            </el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">商品参数:----------</el-tab-pane>
        <el-tab-pane label="商品配送范围" name="2">
          <div class="amap-wrapper">
            <el-amap class="amap-box" :vid="'amap-vue'"></el-amap>
          </div>
        </el-tab-pane>
        <el-tab-pane label="商品图片详情" name="3">
          <el-upload class="upload-demo" action="http://localhost:8888/api/private/v1/upload"
          :headers='getToken()' :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" :on-success='uploadDone' :before-upload='beforeUpload' list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <!-- 添加富文本编辑框 -->
          <quill-editor v-model="addForm.content" ref="myQuillEditor" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)" style='height:300px'>
          </quill-editor>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <el-button type="success" @click='addGoodsSubmit' style='position:absolute;right:50px;bottom:100px'>提交</el-button>
    <!-- 图片预览 -->
    <el-dialog title="预览" :visible.sync="imgDialogVisible" width="80%">
      <img :src="uploadImgSrc" alt="" height="100%">
</el-dialog>
  </div>
</template>

<script>
import { getCategorieAll, addGoods } from '@/api/index.js'
export default {
  data () {
    return {
      imgDialogVisible: false,
      uploadImgSrc: '',
      activeName: 0,
      addForm: {
        // 商品名称
        goods_name: '',
        // 选中的商品分类
        // goods_cat: '1,3,6',
        goods_cat: '',
        // 商品价格
        goods_price: '',
        // 商品数量
        goods_number: '',
        // 商品重量
        goods_weight: '',
        // 商品描述
        content: '',
        // 商品的图片
        pics: [],
        // 商品的属性，包含了动态参数 和 静态参数
        attrs: []

      },
      options: [],
      catprops: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedOptions: [],
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            ['blockquote', 'code-block']
          ]
        }
      },
      fileList: []
    }
  },
  mounted () {
    getCategorieAll(3).then(res => {
      this.options = res.data
    })
  },
  methods: {
    // 文件上传成功时的钩子
    uploadDone (response, file, fileList) {
      // console.log(response) // console.log(file) // console.log(fileList)
      this.addForm.pics.push({ pic: response.data.tmp_path })
      // console.log(this.addForm)
    },
    // before-upload上传文件之前的钩子  文件上传之前的处理函数
    // 参数为上传的文件
    beforeUpload (file) {
      // console.log(file)
      if (file.size > 500 * 1024) {
        this.$message({
          type: 'warning',
          message: '文件大小不能超过500kb',
          duration: 2000
        })
        return false
      }
    },
    // 设置token值,文件上传
    getToken () {
      let token = localStorage.getItem('mytoken')
      return {'Authorization': token}
    },
    // 实现商品信息的提交
    addGoodsSubmit () {
      // console.log(456)
      addGoods(this.addForm).then(res => {
        console.log(res)
        if (res.meta.status === 201) {
          this.$message({
            type: 'success',
            message: res.meta.msg,
            duration: 2000
          })
          this.$router.push({path: 'list'})
        } else {
          this.$message({
            type: 'error',
            message: res.meta.msg,
            duration: 2000
          })
        }
      })
    },
    //   选择分类时触发函数
    handleChange (value) {
      // console.log(value)
      this.addForm.goods_cat = value.join(',')
      // console.log(this.addForm)
    },
    // 单击Tab标签导航项时触发的事件
    handleClick (tab, eve) {
      //   console.log(tab)
      //   console.log(eve)
    },
    onEditorBlur (quill) {
      // console.log('editor blur!', quill)
    },
    onEditorFocus (quill) {
      // console.log('editor focus!', quill)
    },
    onEditorReady (quill) {
      // console.log('editor ready!', quill)
    },
    handleRemove (file, fileList) {
      // console.log(file)
      // console.log(fileList)
      if (!file.response) return
      // 先获取用户已删除的路径,是相对路径
      let delFlie = file.response.data.tmp_path
      // 查找元素，返回找到的index，找不到返回-1value：每一次迭代查找的数组元素。 index：每一次迭代查找的数组元素索引。 arr：被查找的数组
      let index = this.addForm.pics.findIndex((value, index, arr) => {
        return value.pic === delFlie
      })
      this.addForm.pics.splice(index, 1)
    },
    // 文件预览
    handlePreview (file) {
      // console.log(file)
      this.imgDialogVisible = true
      this.uploadImgSrc = 'http://localhost:8888/' + file.response.data.tmp_path
    }
  }
}
</script>

<style lang='scss' scoped>
.amap-wrapper {
  width: 500px;
  height: 500px;
}
</style>

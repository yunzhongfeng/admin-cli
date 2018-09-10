<template>
    <div class="goodslist">
        <el-row>
            <el-col :span="24">
                <el-input placeholder="请输入内容" v-model="secharValue" class="input-with-select" @keyup.native.13="searchUserList" @blur="searchUserList">
                    <el-button @click='searchUserList' slot="append" icon="el-icon-search"></el-button>
                </el-input>
                <el-button type="success" plain @click="$router.push({path:'add'})">添加商品</el-button>
            </el-col>
        </el-row>
        <!-- 列表区域 -->
        <el-table border :data="goodsLsitData"   style="width: 100%">
            <el-table-column type="index" width="50"> </el-table-column>
            <el-table-column property="goods_name" label="商品名称" width="480"> </el-table-column>
            <el-table-column property="goods_price" label="商品价格(元)" > </el-table-column>
            <el-table-column property="goods_weight" label="商品重量(kg)" width="110"> </el-table-column>
            <el-table-column label="创建时间" width="180">
                <template slot-scope="scope">
                    <span>{{scope.row.add_time | myTime('/',':')}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="130">
                <template slot-scope="scope">
                    <el-tooltip content="编辑" placement="top" >
                            <el-button type="primary" icon="el-icon-edit"  size="small"></el-button>
                    </el-tooltip>
                    <el-tooltip content="删除" placement="top">
                        <el-button type="danger" icon="el-icon-delete"  size="small" @click='deleteGoods(scope.row.goods_id)'></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30]" :current-page="pagenum" :page-size="pagesize" background
        layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
</template>

<script>
import { getGoodsData, deleteGoodById } from '@/api/index.js'
export default {
  data () {
    return {
      secharValue: '', // 搜索的关键字
      total: 0,
      pagenum: 1,
      pagesize: 10,
      goodsLsitData: []
    }
  },
  // 局部过滤器
  filters: {
    myTime (mytime, line, mhao) {
      let time = new Date(mytime * 1000)
      let days = time.getUTCFullYear() // 根据世界时从 Date 对象返回四位数的年份
      let hours = time.getMonth() + 1 // 返回月份 (0 ~ 11)。
      let minutes = time.getDate() // 返回一个月中的某一天 (1 ~ 31)。
      let hour = time.getHours()
      let minute = time.getMinutes()
      let second = time.getSeconds()
      return days + line + hours + line + minutes + ' ' + (hour < 10 ? '0' + hour : hour) +
       mhao + (minute < 10 ? '0' + minute : minute) +
      mhao + (second < 10 ? '0' + second : second) // line为 /, mhao为 :
    }
  },
  created () { // 组件实例创建完成,属性已绑定,DOM未生成,$el还不存在
    this.getLsitData()
  },
  methods: {
    // 根据id删除单个商品
    deleteGoods (goodsid) {
      this.$confirm(`是否要删除id为${goodsid}的商品数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteGoodById(goodsid).then(res => {
            console.log(res)
            if (res.meta.status === 200) {
              // 删除成功
              this.$message({
                duration: 1500,
                type: 'success',
                message: res.meta.msg
              })
              this.getLsitData()
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
    // 设置搜索数据事件
    searchUserList () {
      this.getLsitData()
    },
    getLsitData () {
      getGoodsData({query: this.secharValue, pagenum: this.pagenum, pagesize: this.pagesize}).then(res => {
        // console.log(res)
        if (res.meta.status !== 200) this.$message.error('获取商品列表失败!')
        this.goodsLsitData = res.data.goods
        this.total = res.data.total
      })
    },
    // 监听 pageSize 改变的事件
    handleSizeChange (sizeVal) {
      this.pagesize = sizeVal
      this.getLsitData() // 刷新页面
      console.log(`每页 ${sizeVal} 条`)
    },
    // 监听 pagenum页码 改变的事件
    handleCurrentChange (numVal) {
      this.pagenum = numVal
      this.getLsitData() // 刷新页面
      console.log(`当前页: ${numVal}`)
    }
  }

}
</script>

<style lang='scss' scoped>
.input-with-select {
  width: 300px;
}
</style>

<template>
    <div>
       <chart :options='option'></chart>
    </div>
</template>

<script>
import { getReportsData } from '@/api/index.js'
export default {
  data () {
    return {
      option: {
        title: {
          text: '本站点用户访问来源',
          subtext: '测试数据',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              {value: 535, name: '直接访问'},
              {value: 310, name: '邮件营销'},
              {value: 234, name: '联盟广告'},
              {value: 135, name: '视频广告'},
              {value: 1348, name: '搜索引擎'}
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    }
  },
  mounted () {
    this.initList()
  },
  methods: {
    initList () {
      getReportsData('Bar').then(res => {
        console.log(res)
      })
    }

  }
}
</script>

<style lang='scss' scoped>
   .el-main {
       background:#f5f5d5;
   }
</style>

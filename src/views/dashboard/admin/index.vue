<template>
  <div class="dashboard-editor-container">

    <el-row :gutter="24" style="margin-bottom: 40px;">
      <el-col :span="10">
        <b-map :mapType="2"></b-map>
      </el-col>
      <el-col :span="6">
        <el-table border height="300" max-height="300" :data="patientStatistics" style="width: auto;margin: 0 auto;">
          <el-table-column prop="name" label="病名"></el-table-column>
          <el-table-column prop="value" label="人数"></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="8">
        <todo-list></todo-list>
      </el-col>
    </el-row>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData"></line-chart>
    </el-row>

    <el-row class="quick-select" :gutter="20">
      <el-col :span="4" v-for="(data, index) in quickData" v-if="index < 5" :key="index">
        <div style="display: block; vertical-align: middle;">
        <router-link :to="{ name: 'elderDetail', params: { elderId: data.id }}">
          <img class="avatar" :src="data.avatar">
          <label for="avatar" v-text="data.name" style="width: 100%;"></label>
        </router-link>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import LineChart from './components/LineChart'
import TodoList from './components/TodoList'
import BMap from '@/components/BaiduMap'
import { getIndexElder } from '@/api/older'
import { getIndexChart, getTodayNumber } from '@/api/statistic'

export default {
  name: 'dashboard-admin',
  components: {
    LineChart,
    TodoList,
    BMap
  },
  created() {
    this.getPatientStatistics()
    this.getQuickData()
    this.getLineChartData()
  },
  data() {
    return {
      lineChartData: {},
      patientStatistics: [],
      quickData: []
    }
  },
  methods: {
    getPatientStatistics() {
      getTodayNumber().then(res => {
        if (res.data.code !== 0) {
          this.$message.error('疾病统计初始化失败')
        }
        this.patientStatistics = res.data.data
      }).catch(error => {
        console.log(error)
        this.$message.error('疾病统计初始化失败')
      })
      // this.patientStatistics = [
      //   { name: '感冒', number: 20 },
      //   { name: '发烧', number: 12 },
      //   { name: '心脏病', number: 51 },
      //   { name: '肠胃炎', number: 2 },
      //   { name: '流感', number: 1 }
      // ]
    },
    getQuickData() {
      getIndexElder().then(res => {
        if (res.data.code !== 0) {
          this.$message.error('快速查找初始化失败')
        }
        this.quickData = res.data.data
      }).catch(error => {
        console.log(error)
        this.$message.error('快速查找初始化失败')
      })
      // this.quickData = [
      //   { id: 110, name: '吴XX', avatar: require('../../../assets/images/avatar.jpg') },
      //   { id: 110, name: '吴XX', avatar: require('../../../assets/images/avatar.jpg') },
      //   { id: 110, name: '吴XX', avatar: require('../../../assets/images/avatar.jpg') },
      //   { id: 110, name: '吴XX', avatar: require('../../../assets/images/avatar.jpg') },
      //   { id: 110, name: '吴XX', avatar: require('../../../assets/images/avatar.jpg') }
      // ]
    },
    getLineChartData() {
      getIndexChart().then(res => {
        if (res.data.code !== 0) {
          this.$message.error('折线图初始化失败')
        }
        console.log(res.data.data)
        this.lineChartData = {}
        this.lineChartData = res.data.data
      }).catch(error => {
        console.log(error)
        this.$message.error('折线图初始化失败')
      })
      console.log(this.lineChartData)
    //   this.lineChartData = {
    //     date: ['2018-01-15', '2018-01-31', '2018-02-15', '2018-02-28', '2018-03-15', '2018-03-31', '2018-04-15'],
    //     ganmao: [2, 5, 10, 25, 4, 0, 7],
    //     liugan: [5, 15, 25, 12, 0, 0, 0],
    //     changyan: [2, 2, 20, 3, 0, 1, 0]
    //   }
    //   console.log(this.lineChartData)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  min-height: 100vh;
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }

  .quick-select {
    .el-col {
      height: 200px;
      width: 200px;
      overflow: hidden;
      img {
        height: 150px;
        width: 150px;
        margin: 5px auto;
        width: expression(this.width > 150 ? 150:true);
        height: expression(this.height > 150 ? 150:true);
        display: block;
      }
      label {
        margin-top: 5px;
        display: block;
        text-align: center;
        font: 14px "Microsoft YaHei",微软雅黑;
      }
    }
  }
}
</style>

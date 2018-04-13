<template>
  <div class="dashboard-editor-container">

    <!-- <panel-group @handleSetLineChartData="handleSetLineChartData"></panel-group> -->
    <el-row :gutter="32" style="margin-bottom: 40px;">
      <el-col :span="12">
        <b-map :mapType="2"></b-map>
      </el-col>
      <el-col :span="6">
        <el-table border height="300" max-height="300" :data="patientStatistics" style="width: auto;margin: 0 auto;">
          <el-table-column prop="name" label="病名"></el-table-column>
          <el-table-column prop="number" label="人数"></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="6">
        <todo-list></todo-list>
      </el-col>
    </el-row>

    <el-row class="quick-select" :gutter="20">
      <el-col :span="4" v-for="(data, index) in quickData" v-if="index <= 5" :key="index">
        <div style="display: block; vertical-align: middle;">
          <img class="avatar" :src="data.avatar">
          <label for="avatar" v-text="data.name" style="width: 100%;"></label>
        </div>
      </el-col>
    </el-row>

    <!-- <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData"></line-chart>
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart></raddar-chart>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart></pie-chart>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart></bar-chart>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table></transaction-table>
      </el-col>
      <el-col :xs="{span: 12}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 5}">
        <todo-list></todo-list>
      </el-col>
      <el-col :xs="{span: 12}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 5}">
        <box-card></box-card>
      </el-col>
    </el-row> -->

  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'

import BMap from '@/components/BaiduMap'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'dashboard-admin',
  components: {
    GithubCorner,
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard,

    BMap
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      patientStatistics: [
        { name: '感冒', number: 20 },
        { name: '发烧', number: 12 },
        { name: '心脏病', number: 51 },
        { name: '肠胃炎', number: 2 },
        { name: '流感', number: 1 }
      ],
      quickData: [
        { name: '吴XX', avatar: require('../../../assets/images/avatar.jpg') },
        { name: '吴XX', avatar: require('../../../assets/images/avatar.jpg') }
      ]
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
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

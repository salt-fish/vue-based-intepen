<template>
  <div class="statistic-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" :group-data="lineData"></panel-group>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart :chart-data="pieData.geriatrics"></pie-chart>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart :chart-data="pieData.acute"></pie-chart>
        </div>
      </el-col>
    </el-row>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData"></line-chart>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import PieChart from './components/PieChart'
import { getStatisticLine, getStatisticPie } from '@/api/statistic'

export default {
  name: 'statisticChart',
  components: {
    PanelGroup,
    LineChart,
    PieChart
  },
  data() {
    return {
      lineData: {},
      pieData: {},
      lineChartData: {}
    }
  },
  created() {
    this.getData()
    // this.$set('lineChartData', this.lineData.all)
    // setTimeout(this.handleSetLineChartData('all'), 1000)
  },
  methods: {
    getData() {
      getStatisticLine().then(res => {
        if (res.data.code !== 0) {
          this.$message.error('折线图初始化失败')
        }
        this.lineData = res.data.data
        this.handleSetLineChartData('all')
        // console.log(this.lineData)
      }).catch(error => {
        console.log(error)
        this.$message.error('折线图初始化失败')
      })

      // this.lineData = {
      //   all: {
      //     type: ['感冒', '流感', '肠炎', '咽炎', '肺炎'],
      //     date: ['2018-01-15', '2018-01-31', '2018-02-15', '2018-02-28', '2018-03-15', '2018-03-31', '2018-04-15'],
      //     name: ['ganmao', 'liugan', 'changyan', 'yanyan', 'feiyan'],
      //     ganmao: [2, 5, 10, 25, 4, 0, 7],
      //     liugan: [5, 15, 25, 12, 0, 0, 0],
      //     changyan: [2, 2, 20, 3, 0, 1, 0],
      //     yanyan: [2, 3, 4, 1, 0, 3, 1],
      //     feiyan: [5, 3, 4, 5, 2, 1, 0]
      //   },
      //   ganmao: {
      //     type: ['感冒'],
      //     date: ['2018-01-15', '2018-01-31', '2018-02-15', '2018-02-28', '2018-03-15', '2018-03-31', '2018-04-15'],
      //     number: [2, 5, 10, 25, 4, 0, 7]
      //   },
      //   liugan: {
      //     type: ['流感'],
      //     date: ['2018-01-15', '2018-01-31', '2018-02-15', '2018-02-28', '2018-03-15', '2018-03-31', '2018-04-15'],
      //     name: ['liugan'],
      //     number: [5, 15, 25, 12, 0, 0, 0]
      //   },
      //   changyan: {
      //     type: ['肠炎'],
      //     date: ['2018-01-15', '2018-01-31', '2018-02-15', '2018-02-28', '2018-03-15', '2018-03-31', '2018-04-15'],
      //     name: ['changyan'],
      //     number: [2, 2, 20, 3, 0, 1, 0]
      //   },
      //   yanyan: {
      //     type: ['咽炎'],
      //     date: ['2018-01-15', '2018-01-31', '2018-02-15', '2018-02-28', '2018-03-15', '2018-03-31', '2018-04-15'],
      //     name: ['yanyan'],
      //     number: [2, 3, 4, 1, 0, 3, 1]
      //   },
      //   feiyan: {
      //     type: ['肺炎'],
      //     date: ['2018-01-15', '2018-01-31', '2018-02-15', '2018-02-28', '2018-03-15', '2018-03-31', '2018-04-15'],
      //     name: ['feiyan'],
      //     number: [5, 3, 4, 5, 2, 1, 0]
      //   }
      // }

      getStatisticPie().then(res => {
        if (res.data.code !== 0) {
          this.$message.error('折线图初始化失败')
        }
        this.pieData = res.data.data
      }).catch(error => {
        console.log(error)
        this.$message.error('折线图初始化失败')
      })
      // this.pieData = {
      //   geriatrics: {
      //     type: ['心脏病', '高血压', '糖尿病', '关节炎', '健康'],
      //     name: ['xinzangbing', 'gaoxueya', 'tangniaobing', 'guanjieyan', 'jiankang'],
      //     data: [
      //       { name: '心脏病', value: 15 },
      //       { name: '高血压', value: 40 },
      //       { name: '糖尿病', value: 10 },
      //       { name: '关节炎', value: 10 },
      //       { name: '健康', value: 60 }
      //     ]
      //   },
      //   acute: {
      //     type: ['感冒', '流感', '肠炎', '咽炎', '肺炎', '健康'],
      //     name: ['ganmao', 'liugan', 'changyan', 'yanyan', 'feiyan', 'jiankang'],
      //     data: [
      //       { name: '感冒', value: 10 },
      //       { name: '流感', value: 0 },
      //       { name: '肠炎', value: 2 },
      //       { name: '咽炎', value: 3 },
      //       { name: '肺炎', value: 1 },
      //       { name: '健康', value: 80 }
      //     ]
      //   }
      // }
    },
    handleSetLineChartData(type) {
      this.lineChartData = this.lineData[type]
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.statistic-container {
  min-height: 100vh;
  padding: 20px 32px 0;
  background-color: rgb(240, 242, 245);
}
</style>
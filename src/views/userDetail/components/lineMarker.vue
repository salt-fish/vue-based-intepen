<template>
  <div :class="className" :id="id" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    chartName: {
      type: String
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    realTimeData: {
      required: true
    }
  },
  data() {
    return {
      chart: null,
      date: [],
      step: [],
      heartRate: [],
      bloodGlucose: []
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))

      var len = 0
      while (len < this.realTimeData.length) {
        this.date.push(this.realTimeData[len].date)
        this.step.push(this.realTimeData[len].step)
        this.heartRate.push(this.realTimeData[len].heartRate)
        this.bloodGlucose.push(this.realTimeData[len].bloodGlucose)
        len++
      }

      this.chart.setOption({
        backgroundColor: '#fff',
        color: ['#5793f3', '#d14a61', '#675bba'],
        title: {
          top: 20,
          text: this.chartName,
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16
          },
          left: '1%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          top: 20,
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: ['步数', '心率', '血糖'],
          right: '4%',
          textStyle: {
            fontSize: 12
          }
        },
        dataZoom: [{
          startValue: '2018-01-02 4:00'
        }, {
          type: 'inside'
        }],
        grid: {
          top: 100,
          left: '3%',
          right: '4%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          splitNumber: 5,
          axisTick: {
            alignWithLabel: true
          },
          data: this.date
        }],
        yAxis: [{
          type: 'value',
          name: '步数',
          min: 0,
          max: 20000,
          position: 'left',
          axisLine: {
            lineStyle: {
              color: '#5793f3'
            }
          },
          axisLabel: {
            formatter: '{value} 步'
          }
        },
        {
          type: 'value',
          name: '心率',
          min: 0,
          max: 120,
          position: 'right',
          axisLine: {
            lineStyle: {
              color: '#d14a61'
            }
          },
          axisLabel: {
            formatter: '{value} 次'
          }
        },
        {
          type: 'value',
          name: '血糖',
          min: 0,
          max: 15,
          position: 'right',
          offset: 80,
          axisLine: {
            lineStyle: {
              color: '#675bba'
            }
          },
          axisLabel: {
            formatter: '{value} mmol/L'
          }
        }],
        series: [{
          name: '步数',
          type: 'line',
          data: this.step
        }, {
          name: '心率',
          type: 'line',
          yAxisIndex: 1,
          data: this.heartRate
        }, {
          name: '血糖',
          type: 'line',
          yAxisIndex: 2,
          data: this.bloodGlucose
        }]
      })
    }
  }
}
</script>

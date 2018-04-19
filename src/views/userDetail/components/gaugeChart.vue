<template>
  <div :class="className" :style="{height:height,width:width}"></div>
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
    chartName: {
      type: String
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    min: {
      type: Number
    },
    max: {
      type: Number
    },
    gaugeData: {
      type: Number
    }
  },
  data() {
    return {
      chart: null
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
      this.chart = echarts.init(this.$el)

      this.chart.setOption({
        tooltip: {
          formatter: '{a} <br/>{b} : {c}'
        },
        series: [{
          name: this.chartName,
          type: 'gauge',
          center: ['50%', '65%'],
          radius: '100%',
          startAngle: 200,
          endAngle: -20,
          min: this.min,
          max: this.max,
          axisLine: {
            show: true,
            lineStyle: {
              color: [
                [0.15, '#DA462C'],
                [0.3, '#FF9618'],
                [0.7, '#20AE51'],
                [0.85, '#FF9618'],
                [1, '#DA462C']
              ],
              width: 30
            }
          },
          detail: {
            formatter: '{value}',
            // offsetCenter: [0,'20%'],
            fontsize: 10
          },
          data: [{ value: this.gaugeData, name: this.chartName }]
        }]
      })
    }
  }
}
</script>

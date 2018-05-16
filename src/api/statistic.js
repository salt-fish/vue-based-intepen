import request from '@/utils/request'

// 首页折线
export function getIndexChart() {
  return request({
    url: '/patientstatistics/indexchartdata',
    method: 'get'
  })
}

export function getTodayNumber(date) {
  return request({
    url: '/patientstatistics/today',
    method: 'get'
  })
}

export function getStatisticLine(date) {
  return request({
    url: '/patientstatistics/statisticlinedata',
    method: 'get'
  })
}

export function getStatisticPie(date) {
  return request({
    url: '/patientstatistics/statisticpiedata',
    method: 'get'
  })
}

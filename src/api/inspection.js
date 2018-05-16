import request from '@/utils/request'

export function getInspection(date) {
  return request({
    url: '/inspection/listbydate/' + date,
    method: 'get'
  })
}

export function getHistoryInspection(date) {
  return request({
    url: '/inspection/listbydatezone',
    method: 'get',
    params: {
      'dateA': date[0],
      'dateB': date[1]
    }
  })
}

export function submitOneInspection(inspection) {
  const data = JSON.stringify(inspection)
  return request({
    url: '/inspection/edit',
    method: 'post',
    data
  })
}

export function submitAllInspection(inspection) {
  const data = JSON.stringify(inspection)
  return request({
    url: '/inspection/editall',
    method: 'post',
    data
  })
}

export function illList() {
  return request({
    url: '/illness/list',
    method: 'get'
  })
}

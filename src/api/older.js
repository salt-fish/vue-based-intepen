import request from '@/utils/request'

export function getElder() {
  return request({
    url: '/elder/list',
    method: 'get'
  })
}

// 首页老人
export function getIndexElder() {
  return request({
    url: '/elder/indexelder',
    method: 'get'
  })
}

export function addElder(elder) {
  const data = JSON.stringify(elder)
  return request({
    url: '/elder/add',
    method: 'post',
    data
  })
}

export function editElder(elder) {
  const data = JSON.stringify(elder)
  return request({
    url: '/elder/edit',
    method: 'post',
    data
  })
}

export function deleteElder(id) {
  const data = JSON.stringify({
    id: id
  })
  return request({
    url: '/elder/delete',
    method: 'post',
    data
  })
}

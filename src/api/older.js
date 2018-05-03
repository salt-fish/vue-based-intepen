import request from '@/utils/request'

export function getElder() {
  return request({
    url: '/elder/list',
    method: 'get'
  })
}

export function addElder(elder) {
  const data = JSON.stringify(elder)
  return request({
    url: 'elder/add',
    method: 'post',
    data
  })
}

export function editElder(elder) {
  const data = JSON.stringify(elder)
  return request({
    url: 'elder/edit',
    method: 'post',
    data
  })
}

export function deleteElder(id) {
  const data = JSON.stringify({
    id: id
  })
  return request({
    url: 'elder/edit',
    method: 'post',
    data
  })
}

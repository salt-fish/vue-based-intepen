import request from '@/utils/request'

export function getNurse() {
  return request({
    url: '/nurse/list',
    method: 'get'
  })
}

export function addNurse(nurse) {
  const data = JSON.stringify(nurse)
  return request({
    url: '/nurse/add',
    method: 'post',
    data
  })
}

export function editNurse(nurse) {
  const data = JSON.stringify(nurse)
  return request({
    url: '/nurse/edit',
    method: 'post',
    data
  })
}

export function deleteNurse(id) {
  const data = JSON.stringify({
    id: id
  })
  return request({
    url: '/nurse/delete',
    method: 'post',
    data
  })
}

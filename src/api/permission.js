import request from '@/utils/request'

export function getRolesList() {
  return request({
    url: '/roles/list',
    method: 'get'
  })
}

export function getUserList() {
  return request({
    url: '/user/list',
    method: 'get'
  })
}

export function addUser(user) {
  const data = JSON.stringify(user)
  return request({
    url: '/family/add',
    method: 'post',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: '/user/remove/' + id,
    method: 'post'
  })
}

export function distribute(id, roles) {
  const data = JSON.stringify({
    id: id,
    roles: roles
  })
  console.log('api', data)
  return request({
    url: '/roles/distribute',
    method: 'post',
    data
  })
}

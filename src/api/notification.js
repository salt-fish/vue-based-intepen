import request from '@/utils/request'

export function getNotification() {
  return request({
    url: '/events/listall',
    method: 'get'
  })
}

export function addNotification(notification) {
  // const data = JSON.stringify(notification)
  return request({
    url: '/events/add',
    method: 'post',
    data: notification
  })
}

export function deleteNotification(id) {
  const data = JSON.stringify({
    'ids': [id]
  })
  // const ids = [id]
  return request({
    url: '/events/complete',
    method: 'post',
    data: data
  })
}


import request from '@/utils/request'

export function getNotification() {
  return request({
    url: '/events/listall',
    method: 'get'
  })
}

export function addNotification(notification) {
  const data = JSON.stringify(notification)
  return request({
    url: '/addNotification',
    method: 'post',
    data
  })
}

export function deleteNotification(notification) {
  // const data = JSON.stringify(notification)
  return request({
    url: '/deleteNotification',
    method: 'post',
    data: notification
  })
}


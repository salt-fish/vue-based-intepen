import request from  '@/utils/request'

export function getOlderInfo(token) {
  return request({
    url: '/older/info',
    method: 'get',
    params: { token }
  })
}
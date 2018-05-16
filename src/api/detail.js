import request from '@/utils/request'

export function elderDetail(id) {
  return request({
    url: '/elder/profile/' + id,
    method: 'get'
  })
}

export function medicalrecord(id) {
  return request({
    url: '/medicalrecord/recent',
    method: 'get',
    params: {
      elderId: id,
      limit: 1
    }
  })
}

export function examination(id) {
  return request({
    url: '/physicalexaminationdata/recent/' + id,
    method: 'get'
  })
}

export function activityData(id) {
  return request({
    url: '/behavior/gettoday/' + id,
    method: 'get'
  })
}

export function advice(id) {
  return request({
    url: '/doctoradvice/recent/' + id,
    method: 'get'
  })
}

export function nurseDetail(id) {
  return request({
    url: '/nurse/profile/' + id,
    method: 'get'
  })
}

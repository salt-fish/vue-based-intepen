import request from '@/utils/request'

export function getFamilyList() {
  return request({
    url: '/family/list',
    method: 'get'
  })
}

export function getRelation(elderId, familyId) {
  return request({
    url: '/elder/relatefamily',
    method: 'post',
    params: {
      'elderId': elderId,
      'family': familyId
    }
  })
}

export function getFamilyElders() {
  return request({
    url: '/family/elders',
    method: 'get'
  })
}

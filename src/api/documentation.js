import request from '@/utils/request'

export function getMedicalbydate(date) {
  return request({
    url: '/physicalexaminationdata/getbydate',
    method: 'get',
    params: {
      'date': date
    }
  })
}

export function getMedicalHistory(date) {
  return request({
    url: '/physicalexaminationdata/getbydatezone',
    method: 'get',
    params: {
      'dateA': date[0],
      'dateB': date[1]
    }
  })
}

export function editMedical(examination) {
  const data = JSON.stringify(examination)
  return request({
    url: '/physicalexaminationdata/edit',
    method: 'post',
    data
  })
}

export function addMedical(examination) {
  const data = JSON.stringify(examination)
  return request({
    url: '/physicalexaminationdata/add',
    method: 'post',
    data
  })
}

export function deleteMedical(id) {
  return request({
    url: '/physicalexaminationdata/remove',
    method: 'post',
    params: {
      'id': id
    }
  })
}

export function getRecord(date) {
  return request({
    url: '/medicalrecord/getbydate',
    method: 'get',
    params: {
      'date': date
    }
  })
}

export function getRecordHistory(date) {
  return request({
    url: '/medicalrecord/getbydatezone',
    method: 'get',
    params: {
      'dateA': date[0],
      'dateB': date[1]
    }
  })
}

export function editRecord(record) {
  const data = JSON.stringify(record)
  return request({
    url: '/medicalrecord/edit',
    method: 'post',
    data
  })
}

export function addRecord(record) {
  const data = JSON.stringify(record)
  return request({
    url: '/medicalrecord/add',
    method: 'post',
    data
  })
}

export function deleteRecord(id) {
  return request({
    url: '/medicalrecord/remove',
    method: 'post',
    params: {
      'id': id
    }
  })
}

export function getAdvice() {
  return request({
    url: 'doctoradvice/list',
    method: 'get'
  })
}

export function editAdvice(advice) {
  const data = JSON.stringify(advice)
  return request({
    url: '/doctoradvice/edit',
    method: 'post',
    data
  })
}

export function addAdvice(advice) {
  const data = JSON.stringify(advice)
  return request({
    url: '/doctoradvice/add',
    method: 'post',
    data
  })
}

export function deleteAdvice(id) {
  return request({
    url: '/doctoradvice/remove',
    method: 'post',
    params: {
      'id': id
    }
  })
}

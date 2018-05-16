import { isObjectEqual } from '@/utils'

const olderMap = {
  older1: {
    id: '01',
    name: '小明',
    age: '70',
    medicalCase: '这是病例',
    doctorAdvice: [
      { name: '头孢', time: '下午3点', dose: '2' },
      { name: 'a', time: '13', dose: '3' }
    ]
  },
  older2: {
    id: '012',
    name: 'peter',
    age: '74',
    medicalCase: '这是病例2',
    doctorAdvice: [
      { name: '头孢2', time: '下午3点', dose: '2' },
      { name: 'a2', time: '13', dose: '3' }
    ]
  }
}

const notifications = [
  { id: 1, time: '2018-04-15 10:00', data: '吴xx老人摔倒', flag: 2 }, // flag: 消息状态 1.一般消息 2.紧急消息 0.已完成
  { id: 2, time: '2018-04-15 10:20', data: 'xx老人摔倒', flag: 2 },
  { id: 3, time: '2018-04-15 12:00', data: '午餐时间', flag: 1 },
  { id: 4, time: '2018-04-15 13:00', data: '午休时间', flag: 1 },
  { id: 5, time: '2018-04-15 13:00', data: '午休时间', flag: 0 }
]

export default{
  getOlderInfo: config => {
    return olderMap
  },
  getNotification: config => {
    return notifications
  },
  deleteNotification: config => {
    const index = notifications.findIndex(v => {
      return isObjectEqual(v, JSON.parse(config.body))
    })
    console.log(config.body)
    console.log(index)
    notifications[index].flag = 0
    notifications.splice(index, 1)
    return notifications
  },
  addNotification: config => {
    notifications.push(JSON.parse(config.body))
    return notifications
  }
}

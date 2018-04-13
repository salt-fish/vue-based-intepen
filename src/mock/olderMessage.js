
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

export default{
  getOlderInfo: config => {
    return olderMap
  }
}

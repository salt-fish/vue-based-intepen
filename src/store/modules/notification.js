import { getNotification, addNotification, deleteNotification } from '@/api/notification'

const notification = {
  state: {
    notifications: []
  },

  mutations: {
    INIT_NOTICE: (state, notifications) => {
      state.notifications = []
      state.notifications = notifications
    },
    ADD_NOTICE: (state, notification) => {
      state.notifications.push(notification)
    },
    DELETE_NOTICE: (state, notification) => {
      const index = state.notifications.indexOf(notification)
      state.notifications[index].flag = 0
      state.notifications.splice(index, 1)
    }
  },

  actions: {
    // 初始化通知列表
    GetNotification({ commit }) {
      return new Promise((resolve, reject) => {
        getNotification().then(response => {
          if (response.data.code !== 0) {
            reject('error get notifications')
          }
          commit('INIT_NOTICE', response.data.data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 添加通知
    AddNotification({ commit }, notification) {
      return new Promise((resolve, reject) => {
        addNotification(notification).then(response => {
          if (!response.data) {
            reject('add notification error')
          }
          commit('INIT_NOTICE', response.data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 删除通知
    DeleteNotification({ commit }, notification) {
      return new Promise((resolve, reject) => {
        deleteNotification(notification).then(response => {
          if (!response.data) {
            reject('delete notification error')
          }
          commit('INIT_NOTICE', response.data)
          resolve('成功')
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default notification

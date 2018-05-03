<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <tags-view></tags-view>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from './components'
import { mapGetters } from 'vuex'
// import { deepClone } from '@/utils'

export default {
  name: 'layout',
  data() {
    return {
      interval: '',
      notice: '',
      list: []
    }
  },
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  created() {
    if (this.roles.includes('admin') || this.roles.includes('notification')) {
      if (this.interval === '') {
        // this.interval = setInterval(this.initNotifications, 10000)
        this.initNotifications()
      }

      if (this.notice === '') {
        // this.notice = setInterval(this.showNotifications, 1000)
        this.showNotifications()
      }
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    ...mapGetters([
      'roles',
      'notifications'
    ])
  },
  methods: {
    initNotifications() {
      this.$store.dispatch('GetNotification').then(res => {
        console.log('通知列表已更新')
      }).catch(() => {
        console.log('通知列表获取失败')
      })
    },
    showNotifications() {
      this.notifications.filter(v => {
        if (v.flag === 2 && !JSON.stringify(this.list).includes(JSON.stringify(v))) {
          this.list.push(v)
          setTimeout(() => {
            this.$notify({
              title: v.time,
              message: v.data,
              type: 'error',
              duration: 0,
              onClose: () => {
                console.log(v)
                this.$store.dispatch('DeleteNotification', v).then(res => {
                  console.log(res)
                }).catch(() => {
                  console.log('删除失败')
                })
              }
            })
          }, 1)
          return v
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }
</style>

<template>
  <section class="todoapp">
    <!-- header -->
    <header class="header">
      <input class="new-todo" autocomplete="off" placeholder="Todo List">
    </header>
    <!-- main section -->
    <section class="main" v-show="notifications.length">
      <!-- <input class="toggle-all" id="toggle-all" type="checkbox" :checked="allChecked" @change=" ({ done: !allChecked })">
      <label for="toggle-all"></label> -->
      <ul class="todo-list">
        <todo @toggleTodo='toggleTodo' @deleteTodo='deleteTodo' v-for="(todo, index) in filteredTodos" v-show="index <= 5" :key="index"
          :todo="todo"></todo>
      </ul>
    </section>
    <!-- footer -->
    <!-- <footer class="footer" v-show="notifications.length">
      <span class="todo-count">
        <strong>{{ remaining }}</strong>
        {{ remaining | pluralize('item') }} left
      </span>
      <ul class="filters">
        <li v-for="(val, key) in filters" :key="key">
          <a :class="{ selected: visibility === key }" @click.prevent="visibility = key">{{ key | capitalize }}</a>
        </li>
      </ul>
      <button class="clear-completed" v-show="notifications.length > remaining" @click="clearCompleted">
        Clear completed
      </button>
    </footer> -->
  </section>
</template>

<script>
import Todo from './Todo.vue'
import { mapGetters } from 'vuex'

const STORAGE_KEY = 'todos'
const filters = {
  all: todos => todos
  // active: todos => todos.filter(todo => todo.flag !== 0),
  // completed: todos => todos.filter(todo => todo.flag === 0)
}
export default {
  components: { Todo },
  data() {
    return {
      visibility: 'all',
      filters
      // todos: JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || defalutList
      // todos: defalutList
    }
  },
  computed: {
    ...mapGetters([
      'notifications'
    ]),
    allChecked() {
      return this.notifications.every(todo => todo.flag === 0)
    },
    filteredTodos() {
      return filters[this.visibility](this.notifications)
    },
    remaining() {
      return this.notifications.filter(todo => todo.flag !== 0).length
    }
  },
  methods: {
    setLocalStorgae() {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos))
    },
    addTodo(e) {
      const text = e.target.value
      if (text.trim()) {
        this.todos.push({
          text,
          done: false
        })
        this.setLocalStorgae()
      }
      e.target.value = ''
    },
    toggleTodo(val) {
      this.deleteTodo(val)
    },
    deleteTodo(todo) {
      this.$store.dispatch('DeleteNotification', todo.id).then(res => {
        console.log('a', res)
      }).catch(() => {
        console.log('删除失败')
      })
    },
    editTodo({ todo, value }) {
      todo.text = value
      this.setLocalStorgae()
    },
    clearCompleted() {
      this.notifications = this.notifications.filter(todo => !todo.done)
      this.setLocalStorgae()
    },
    toggleAll({ done }) {
      this.todos.forEach(todo => {
        todo.done = done
        this.setLocalStorgae()
      })
    }
  },
  filters: {
    pluralize: (n, w) => n === 1 ? w : w + 's',
    capitalize: s => s.charAt(0).toUpperCase() + s.slice(1)
  }
}
</script>

<style lang="scss">
  @import './index.scss';
</style>

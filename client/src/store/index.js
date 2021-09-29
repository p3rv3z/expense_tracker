import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import categories from './categories'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    categories
  },

  plugins: [
    createPersistedState()
  ]
})

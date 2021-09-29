import Vue from 'vue';
import HTTP from '../services/http';

export default {
  namespaced: true,

  state: {
    incomeCategories: [],
    expenseCategories: [],
  },

  actions: {
    updateCategory(commit, category) {
      return HTTP().patch(`categories/${category.id}`, category)
    },

    async deleteCategory({ commit }, category) {
      await HTTP().delete(`categories/${category.id}`)
      commit('removeCategory', category);
    },

    async fetchIncomeCategories({ commit }) {
      const data = await HTTP().get('income/categories')
      commit('setIncomeCategories', data.data);
    },

    async fetchExpenseCategories({ commit }) {
      const data = await HTTP().get('expense/categories')
      commit('setExpenseCategories', data.data);
    },

    async createCategory({ commit}, payload) {
      console.log(this.payload)
      const data = await HTTP().post(`categories`, payload)
      commit('appendCategory', data.data);
    },
  },

  getters: {
    incomeCategories: state => state.incomeCategories,
    expenseCategories: state => state.expenseCategories
  },

  mutations: {
    setIncomeCategories(state, categories) {
      state.incomeCategories = categories;
    },
    
    setExpenseCategories(state, categories) {
      state.expenseCategories = categories;
    },

    appendCategory(state, category) {
      state.categories.push(category);
    },

    setCategoryName(state, { category, name }) {
      category.name = name;
    },

    setEditMode(state, category) {
      Vue.set(category, 'isEditMode', true);
    },

    unsetEditMode(state, category) {
      Vue.set(category, 'isEditMode', false);
    },

    removeCategory(state, category) {
      state.categories.splice(state.categories.indexOf(category), 1);
    },

    toggleCompleted(state, category) {
      category.is_completed = !category.is_completed;
    },
  },
};
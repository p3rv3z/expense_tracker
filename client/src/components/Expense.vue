<template>
    <div >
        <div class="card">
            <div class="card-body">
                <div class="row">
                    <div class="col-md-3">
                        <div class="h4 text-danger">Expenses</div>
                    </div>
                    <div class="col-md-7">
                        <select
                            v-model="filter.category_id"
                            @click="fetchExpenses"
                            class="form-control"
                            id="type"
                        >
                            <option value="all">All</option>
                            <option v-for="(category, i) in categories" :value="category.id" :key="i">{{category.name}}</option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <div class="btn btn-warning" v-b-modal.create-expense-model>
                            Add
                        </div>
                    </div>
                </div>

                <div class="mt-4">
                    <table class="table">
                    <thead>
                        <tr>
                            <td>Amount</td>
                            <td class="text-center">Date</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(expense, i) in expenses" :key="i">
                            <td>{{ expense.amount }}TK</td>
                            <td class="text-center">{{ formatDate(expense.created_at) }}</td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>
        </div>

        <div>
            <b-modal
                id="create-expense-model"
                ref="modal"
                title="Add Expense"
                @show="resetModal"
                @hidden="resetModal"
                @ok="handleSave"
            >
                <form ref="form" @submit.stop.prevent="handleSubmit">
                    <div class="form-group mt-2">
                        <label for="amount">Amount</label>
                        <input
                            v-model="payload.amount"
                            type="text"
                            class="form-control"
                            id="amount"
                            placeholder="Enter Amount"
                        />
                    </div>

                    <div class="form-group mt-2">
                        <label for="category_id">Category</label>
                        <select
                            v-model="payload.category_id"
                            class="form-control"
                            id="category_id"
                        >
                            <option value="">Setect one</option>
                            <option v-for="(category, i) in categories" :value="category.id" :key="i">{{category.name}}</option>
                        </select>
                    </div>
                </form>
            </b-modal>
        </div>
    </div>
</template>

<script>
import HTTP from '../services/http';
import moment from 'moment';

export default {
    name: 'Expense',

    data() {
        return {
            expenses: [],

            categories: [],

            payload: {
                amount: "",
                category_id: "",
            },

            filter: {
                category_id: 'all'
            }
        }
    },

    methods: {

        formatDate(date) {
            return moment(date).format("MMM Do Y"); 
        },

        //model
        resetModal() {
            this.payload.amount = '',
                this.payload.category_id = ''
        },

        handleSave(bvModalEvt) {
            bvModalEvt.preventDefault()
            this.createExpense()
        },

        async fetchCategories() {
            const data = await HTTP().get(`categories`, {
                params: {
                    type: 'expense'
                }
            })
            this.categories = data.data
        },
        
        async fetchExpenses() {
            const data = await HTTP().get(`expenses`, {
                params: this.filter
            })
            this.expenses = data.data
        },

        async createExpense() {

            console.log(this.payload)
             const expense = await HTTP().post(`expenses`, this.payload)

            if (this.filter.category_id == 'all' || this.payload.category_id == this.filter.category_id)   
                this.expenses.push(expense.data)
            
            this.$nextTick(() => {
                this.$bvModal.hide('create-expense-model')
            })
        },
    },

    created() {
        this.fetchCategories()
        this.fetchExpenses()
    },
}
</script>

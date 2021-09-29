<template>
    <div >
        <div class="card">
            <div class="card-body">
                <div class="row">
                    <div class="col-md-3">
                        <div class="h4 text-success">Incomes</div>
                    </div>
                    <div class="col-md-7">
                        <select
                            v-model="filter.category_id"
                            @click="fetchIncomes"
                            class="form-control"
                            id="type"
                        >
                            <option value="all">All</option>
                            <option v-for="(category, i) in categories" :value="category.id" :key="i">{{category.name}}</option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <div class="btn btn-warning" v-b-modal.create-income-model>
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
                        <tr v-for="(income, i) in incomes" :key="i">
                            <td>{{ income.amount }}TK</td>
                            <td class="text-center">{{ formatDate(income.created_at) }}</td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>
        </div>

        <div>
            <b-modal
                id="create-income-model"
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
            incomes: [],

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
                    type: 'income'
                }
            })
            this.categories = data.data
        },
        
        async fetchIncomes() {
            const data = await HTTP().get(`incomes`, {
                params: this.filter
            })
            this.incomes = data.data
        },

        async createExpense() {

            console.log(this.payload)
             const income = await HTTP().post(`incomes`, this.payload)

            if (this.filter.category_id == 'all' || this.payload.category_id == this.filter.category_id)   
                this.incomes.push(income.data)
            
            this.$nextTick(() => {
                this.$bvModal.hide('create-income-model')
            })
        },
    },

    created() {
        this.fetchCategories()
        this.fetchIncomes()
    },
}
</script>

<template>
    <div>
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
                            <option
                                v-for="(category, i) in categories"
                                :value="category.id"
                                :key="i"
                            >
                                {{ category.name }}
                            </option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <div
                            class="btn btn-warning"
                            v-b-modal.create-expense-model
                        >
                            Add
                        </div>
                    </div>
                </div>

                <div class="mt-4">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Amount</th>
                                <th class="text-center">Date</th>
                            </tr>
                        </thead>
                        <tbody v-if="expenses.length">
                            <tr v-for="(expense, i) in expenses" :key="i">
                                <td>{{ expense.category.name }}</td>
                                <td>{{ expense.amount }}TK</td>
                                <td class="text-center">
                                    {{ formatDate(expense.created_at) }}
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td colspan="3" class="text-center">
                                    No reocords found!
                                </td>
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
                <div v-if="anyErrors">
                    <ul>
                        <li
                            class="text-danger"
                            v-for="error in errors.messages"
                            :key="error.field"
                        >
                            {{ error.message }}
                        </li>
                    </ul>
                </div>
                <form ref="form" @submit.stop.prevent="handleSubmit">
                    <div class="form-group mt-2">
                        <label for="amount">Amount</label>
                        <input
                            v-model="payload.amount"
                            type="number"
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
                            <option
                                v-for="(category, i) in categories"
                                :value="category.id"
                                :key="i"
                            >
                                {{ category.name }}
                            </option>
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
            },

            errors: {
                status: null,
                messages: []
            },
        }
    },

    computed: {
        anyErrors() {
            return this.errors.status === 422 && this.errors.messages.length > 0
        }
    },

    created() {
        this.$root.$refs.expenses = this;
        this.fetchCategories()
        this.fetchExpenses()
    },

    methods: {

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
            try {
                const expense = await HTTP().post(`expenses`, this.payload)

                if (this.filter.category_id == 'all' || this.payload.category_id == this.filter.category_id)
                    this.expenses.push(expense.data)

                this.$nextTick(() => {
                    this.$bvModal.hide('create-expense-model')
                })

                this.$root.$refs.categories_rank.fetchCategories()

            } catch (error) {
                this.errors.messages = error.response.data.errors
                this.errors.status = error.response.status
            }
        },

        formatDate(date) {
            return moment(date).format("MMM Do Y");
        },

        //model
        resetModal() {
            this.payload.amount = ''
            this.payload.category_id = ''
            this.resetErrors()
        },

        resetErrors() {
            this.errors.status = null,
            this.errors.messages = []
        },

        handleSave(bvModalEvt) {
            bvModalEvt.preventDefault()
            this.createExpense()
        },

    },
}
</script>

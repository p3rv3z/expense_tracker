<template>
    <div>
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
                            v-b-modal.create-income-model
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
                        <tbody v-if="incomes.length">
                            <tr v-for="(income, i) in incomes" :key="i">
                                <td>{{ income.category.name }}</td>
                                <td>{{ income.amount }}TK</td>
                                <td class="text-center">
                                    {{ formatDate(income.created_at) }}
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
                id="create-income-model"
                ref="modal"
                title="Add Income"
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
    name: 'Income',

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
        this.$root.$refs.incomes = this;
        this.fetchCategories()
        this.fetchIncomes()
    },

    methods: {

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

        async createIncome() {
            try {
                const income = await HTTP().post(`incomes`, this.payload)
                
                if (this.filter.category_id == 'all' || this.payload.category_id == this.filter.category_id)
                    this.incomes.push(income.data)
                
                this.$nextTick(() => {
                    this.$bvModal.hide('create-income-model')
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
            this.createIncome()
        }
    },

}
</script>

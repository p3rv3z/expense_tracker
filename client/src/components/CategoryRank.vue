<template>
    <div class="card">
        <div class="card-body">
            <div class="row">
                <div class="col-md-6">
                    <div class="h4 text-primary">Categories Ranking</div>
                </div>
                <div class="col-md-6">
                    <select
                        v-model="filter.type"
                        @click="fetchCategories"
                        class="form-control"
                        id="type"
                    >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>
            </div>

            <div class="mt-4">
                <ul v-if="categories.length" class="list-group">
                    <li
                        v-for="(category, i) in categories"
                        :key="i"
                        class="list-group-item"
                    >
                        {{ category.name }}
                        <span v-if="category.meta.total_amount"
                            >({{ category.meta.total_amount }})</span
                        >
                        <span v-else>(0)</span>
                    </li>
                </ul>

                <ul v-else class="list-group">
                    <li class="list-group-item">No records found!</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import HTTP from '../services/http';

export default {
    name: 'CategoryRank',

    data() {
        return {
            categories: [],

            filter: {
                type: 'expense'
            }
        }
    },

    created() {
        this.$root.$refs.categories_rank = this;
        this.fetchCategories()
    },

    methods: {

        async fetchCategories() {
            const data = await HTTP().get(`categories/rank`, {
                params: this.filter
            })
            this.categories = data.data
        },
    }
}
</script>

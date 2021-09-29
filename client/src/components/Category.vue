<template>
    <div >
        <div class="card">
            <div class="card-body">
                <div class="row">
                    <div class="col-md-3">
                        <div class="h4 text-primary">Categories</div>
                    </div>
                    <div class="col-md-7">
                        <select
                            v-model="filter.type"
                            @click="fetchCategories"
                            class="form-control"
                            id="type"
                        >
                            <option value="all">All</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <div class="btn btn-warning" v-b-modal.create-model>
                            Add
                        </div>
                    </div>
                </div>

                <table class="table mt-4">
                    <tbody>
                        <tr v-for="(category, i) in categories" :key="i">
                            <td>{{ category.name }}</td>
                            <td>
                                <div
                                    class="btn btn-sm btn-outline-primary mr-2"
                                >
                                    <b-icon-pen
                                        @click="editCategory(category)"
                                        v-b-modal.edit-model
                                    ></b-icon-pen>
                                </div>
                                <div class="btn btn-sm btn-outline-danger">
                                    <b-icon-trash
                                        @click="deleteCategory(category)"
                                    ></b-icon-trash>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div>
            <b-modal
                id="create-model"
                ref="modal"
                title="Add Category"
                @show="resetModal"
                @hidden="resetModal"
                @ok="handleSave"
            >
                <form ref="form" @submit.stop.prevent="handleSubmit">
                    <div class="form-group mt-2">
                        <label for="name">Name</label>
                        <input
                            v-model="payload.name"
                            type="text"
                            class="form-control"
                            id="name"
                            placeholder="Enter Name"
                        />
                    </div>

                    <div class="form-group mt-2">
                        <label for="type">Type</label>
                        <select
                            v-model="payload.type"
                            class="form-control"
                            id="type"
                        >
                            <option value="">Setect one</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>
                </form>
            </b-modal>

            <b-modal
                id="edit-model"
                ref="modal"
                title="Edit Category"
                @hidden="resetModal"
                @ok="handleUpdate"
            >
                <form ref="form" @submit.stop.prevent="handleSubmit">
                    <div class="form-group mt-2">
                        <label for="name">Name</label>
                        <input
                            v-model="payload.name"
                            type="text"
                            class="form-control"
                            id="name"
                            placeholder="Enter Name"
                        />
                    </div>

                    <div class="form-group mt-2">
                        <label for="type">Type</label>
                        <select
                            v-model="payload.type"
                            class="form-control"
                            id="type"
                        >
                            <option value="">Setect one</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>
                </form>
            </b-modal>
        </div>
    </div>
</template>

<script>
import HTTP from '../services/http';

export default {
    name: 'Category',

    data() {
        return {
            categories: [],

            oldCategory: [],

            payload: {
                name: "",
                type: "",
            },

            filter: {
                type: 'all'
            }
        }
    },

    methods: {

        //model
        resetModal() {
            this.payload.name = '',
            this.payload.type = ''
        },

        handleSave(bvModalEvt) {
            bvModalEvt.preventDefault()
            this.createCategory()
        },

        handleUpdate(bvModalEvt) {
            bvModalEvt.preventDefault()
            this.updateCategory()
        },

        async fetchCategories() {
            console.log(this.filter)
            const data = await HTTP().get(`categories`, {
                params: this.filter
            })
            this.categories = data.data
        },

        async createCategory() {

            const category = await HTTP().post(`categories`, this.payload)

            if (this.payload.type == this.filter.type)
                this.categories.push(category.data)

            this.$nextTick(() => {
                this.$bvModal.hide('create-model')
            })
        },

        editCategory(category) {
            this.oldCategory = category
            this.$set(this.payload, 'name', category.name)
            this.$set(this.payload, 'type', category.type)
        },

        async updateCategory() {

            const category = await HTTP().put(`categories/${this.oldCategory.id}`, this.payload)

            this.$set(this.oldCategory, 'name', category.data.name)
            this.$set(this.oldCategory, 'type', category.data.type)

            this.$nextTick(() => {
                this.$bvModal.hide('edit-model')
            })
        },

        async deleteCategory(category) {
            await HTTP().delete(`categories/${category.id}`)
            this.categories.splice(this.categories.indexOf(category), 1)

        }
    },

    created() {
        this.fetchCategories()
    },
}
</script>

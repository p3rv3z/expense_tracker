<template>
    <div class="row">
        <div class="mb-4">
            <div class="btn btn-warning" v-b-modal.create-model>
                Add Category
            </div>
        </div>
        <div class="col-md-6">
            <div class="card">
                <div class="card-body">
                    <div class="h4 text-primary">Income Categories</div>
                    <table class="table">
                        <tbody>
                            <tr
                                v-for="(incomeCategory, i) in incomeCategories"
                                :key="i"
                            >
                                <td>{{ incomeCategory.name }}</td>
                                <td>
                                    <div
                                        class="
                                            btn btn-sm btn-outline-primary
                                            mr-2
                                        "
                                    >
                                        <b-icon-pen
                                            @click="
                                                editCategory(incomeCategory)
                                            "
                                            v-b-modal.edit-model
                                        ></b-icon-pen>
                                    </div>
                                    <div class="btn btn-sm btn-outline-danger">
                                        <b-icon-trash
                                            @click="
                                                deleteCategory(incomeCategory)
                                            "
                                        ></b-icon-trash>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="card">
                <div class="card-body">
                    <div class="h4 text-danger">Expense Categories</div>
                    <table class="table">
                        <tbody>
                            <tr
                                v-for="(
                                    expenseCategory, i
                                ) in expenseCategories"
                                :key="i"
                            >
                                <td>{{ expenseCategory.name }}</td>
                                <td>
                                    <div
                                        class="
                                            btn btn-sm btn-outline-primary
                                            mr-2
                                        "
                                    >
                                        <b-icon-pen
                                            @click="
                                                editCategory(expenseCategory)
                                            "
                                            v-b-modal.edit-model
                                        ></b-icon-pen>
                                    </div>
                                    <div class="btn btn-sm btn-outline-danger">
                                        <b-icon-trash
                                            @click="
                                                deleteCategory(expenseCategory)
                                            "
                                        ></b-icon-trash>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
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
            incomeCategories: [],
            expenseCategories: [],

            oldCategory: [],

            categoryTypes: [
                { value: '', text: 'Select one' },
                { value: 'income', text: 'Income' },
                { value: 'expense', text: 'Expense' },
            ],

            payload: {
                name: "",
                type: "",
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

        // category crud
        async fetchIncomeCategories() {
            const data = await HTTP().get(`income/categories`)
            this.incomeCategories = data.data
        },

        async fetchExpenseCategories() {
            const data = await HTTP().get(`expense/categories`)
            this.expenseCategories = data.data
        },

        async createCategory() {

            const category = await HTTP().post(`categories`, this.payload)

            if (this.payload.type == 'income')
                this.incomeCategories.push(category.data)
            else if (this.payload.type == 'expense')
                this.expenseCategories.push(category.data);

            this.$nextTick(() => {
                this.$bvModal.hide('create-model')
            })

            this.resetInput()
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

            if (category.type == 'income')
                this.incomeCategories.splice(this.incomeCategories.indexOf(category), 1)
            else if (category.type == 'expense')
                this.expenseCategories.splice(this.expenseCategories.indexOf(category), 1)
        }
    },

    created() {
        this.fetchIncomeCategories()
        this.fetchExpenseCategories()
    },
}
</script>

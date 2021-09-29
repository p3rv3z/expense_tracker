<template>
    <div id="app">
        <b-navbar variant="primary" type="dark">
            <b-container>
                <b-navbar-brand>Income and Expense Tracker</b-navbar-brand>
            </b-container>
        </b-navbar>
        <b-container class="mt-4">
            <div class="row">
                <div class="col-md-6">
                    <expense></expense>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col-md-6">
                    <category></category>
                </div>
                <div class="col-md-6">
                    <category-rank></category-rank>
                </div>
            </div>
        </b-container>
    </div>
</template>

<script>
import Expense from './components/Expense'
import Category from './components/Category'
import CategoryRank from './components/CategoryRank'

export default {
    name: 'App',

    components: {
        Expense,
        Category,
        CategoryRank,
    }
}
</script>

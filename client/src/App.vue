<template>
    <div id="app">
        <b-navbar variant="primary" type="dark">
            <b-container>
                <b-navbar-brand><h3>Income and Expense Tracker</h3></b-navbar-brand>
            </b-container>
        </b-navbar>
        <b-container class="mt-4">
            <div class="row">
                <div class="col-md-6">
                    <income></income>
                </div>
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
import Income from './components/Income'
import Expense from './components/Expense'
import Category from './components/Category'
import CategoryRank from './components/CategoryRank'

export default {
    name: 'App',

    components: {
        Income,
        Expense,
        Category,
        CategoryRank,
    }
}
</script>

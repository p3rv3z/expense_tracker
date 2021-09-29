<template>
    <div id="app">
        <b-navbar variant="primary" type="dark">
            <b-container fluid>
                <b-navbar-brand>Income and Expense Tracker</b-navbar-brand>
            </b-container>
        </b-navbar>
        <b-container fluid class="mt-4">
            <category></category>
        </b-container>
    </div>
</template>

<script>
import Category from './components/Category'

export default {
    name: 'App',

    components: {
        Category
    }
}
</script>

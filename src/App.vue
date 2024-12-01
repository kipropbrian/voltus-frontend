<script setup>
import HeaderNav from './partials/HeaderNav.vue';
import BottomFooter from './partials/BottomFooter.vue';
import ShowAlertVue from './partials/ShowAlert.vue';
import { RouterView } from 'vue-router';
</script>

<template>
	<HeaderNav />
	<ShowAlertVue />
	<RouterView />
	<BottomFooter />
</template>

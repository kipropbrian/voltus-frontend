<script setup>
import HeaderNav from './partials/HeaderNav.vue';
import BottomFooter from './partials/BottomFooter.vue';
import ShowAlertVue from './partials/ShowAlert.vue';
import { RouterView } from 'vue-router';
import HeaderNav2 from './partials/Helpers/HeaderNav2.vue';
</script>

<template>
	<HeaderNav />
	<HeaderNav2 />
	<ShowAlertVue />
	<RouterView />
	<BottomFooter />
</template>

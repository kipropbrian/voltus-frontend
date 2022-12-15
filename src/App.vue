<script setup>
import HeaderNav from '@/components/HeaderNav.vue';
import BottomFooter from '@/components/BottomFooter.vue';
import ShowAlertVue from '@/components/ShowAlert.vue';
import { RouterView } from 'vue-router';
</script>

<template>
	<HeaderNav />
	<ShowAlertVue/>
	<RouterView />
	<BottomFooter />
</template>

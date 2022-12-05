<script setup>
import HeaderNav from './components/HeaderNav.vue';
import BottomFooter from './components/BottomFooter.vue';
import { RouterView } from 'vue-router';
</script>

<template>
	<HeaderNav />
	<RouterView />
	<BottomFooter />
</template>

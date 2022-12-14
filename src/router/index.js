import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import PoliticianListView from '@/views/Politician/ListView.vue';
import PoliticianShowView from '@/views/Politician/ShowView.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
		},
		{
			path: '/politicians',
			name: 'politicians.lost',
			component: PoliticianListView,
		},
		{
			path: '/politician/:id',
			name: 'politician.show',
			component: PoliticianShowView,
		},
	],
});

export default router;

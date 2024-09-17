import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import PoliticianListView from '@/views/Politician/ListView.vue';
import PoliticianShowView from '@/views/Politician/ShowView.vue';
import PoliticianEditView from '@/views/Politician/EditView.vue';
import PoliticianNewView from '@/views/Politician/NewView.vue';

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
			name: 'politicians.view',
			component: PoliticianListView,
		},
		{
			path: '/politician/show/:id',
			name: 'politician.show',
			component: PoliticianShowView,
		},
		{
			path: '/politician/edit/:id',
			name: 'politician.edit',
			component: PoliticianEditView,
		},
		{
			path: '/politician/new',
			name: 'politician.new',
			component: PoliticianNewView,
		},
	],
});

export default router;

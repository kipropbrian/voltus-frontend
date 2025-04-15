import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import { useAuthStore } from '@/stores/authStore';
import PoliticianListView from '../views/Politician/ListView.vue';
import PoliticianShowView from '../views/Politician/ShowView.vue';
import PoliticianEditView from '../views/Politician/EditView.vue';
import PoliticianNewView from '../views/Politician/NewView.vue';
import FaceSetView from '../views/Facesets/FaceSetView.vue';
import FaceSetShow from '../views/Facesets/FaceSetShow.vue';
import FaceSetEdit from '../views/Facesets/FaceSetEdit.vue';
import CrimeListView from '../views/Crime/CrimeListView.vue';
import CrimeShowView from '@/views/Crime/CrimeShowView.vue';

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
			meta: { requiresAuth: true },
		},
		{
			path: '/politician/show/:id',
			name: 'politician.show',
			component: PoliticianShowView,
			meta: { requiresAuth: true },
		},
		{
			path: '/politician/edit/:id',
			name: 'politician.edit',
			component: PoliticianEditView,
			meta: { requiresAuth: true },
		},
		{
			path: '/politician/new',
			name: 'politician.new',
			component: PoliticianNewView,
			meta: { requiresAuth: true },
		},
		{
			path: '/faceset',
			name: 'faceset.view',
			component: FaceSetView,
			meta: { requiresAuth: true },
		},
		{
			path: '/faceset/show/:outer_id',
			name: 'faceset.show',
			component: FaceSetShow,
			meta: { requiresAuth: true },
		},
		{
			path: '/faceset/edit/:outer_id',
			name: 'faceset.edit',
			component: FaceSetEdit,
			meta: { requiresAuth: true },
		},
		{
			path: '/crimes',
			name: 'crimes.view',
			component: CrimeListView,
			meta: { requiresAuth: true },
		},
		{
			path: '/crimes/:id',
			name: 'crimes.show',
			component: CrimeShowView,
		},
	],
});

router.beforeEach(async (to, from, next) => {
	const authStore = useAuthStore();

	// Initialize auth if not already done
	if (!authStore.isAuthenticated) {
		await authStore.initAuth();
	}

	// Check if route requires auth
	if (to.meta.requiresAuth && !authStore.isAuthenticated) {
		// Redirect to home page with return URL
		next({
			path: '/',
			query: { redirect: to.fullPath },
		});
	} else {
		next();
	}
});

export default router;

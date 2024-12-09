<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { usePeopleStore } from '../../stores/peopleStore';
import { getThumbnailUrl } from '../../helpers/imageHandler.js';
import Delete from '../../partials/Helpers/Delete.vue';

// PrimeVue Imports
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Skeleton from 'primevue/skeleton';
import InputText from 'primevue/inputtext';
import { FilterMatchMode } from '@primevue/core/api';

//ShadCN imports
import Button from '@/components/ui/button/Button.vue';
import { PlusCircle } from 'lucide-vue-next';

// Setup
const router = useRouter();
const peopleStore = usePeopleStore();
const { people, totalPeople } = storeToRefs(peopleStore);

// UI State
const isDeleteDialogOpen = ref(false);
const personToDelete = ref(null);
const loading = ref(true);

// Pagination & Filtering State
const currentPage = ref(1);
const rows = ref(10); // pageSize
const filters = ref({
	global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

// Skeleton Data
// This represents how many skeleton rows we show while loading.
// Adjust length to match rows per page.
const loadingData = Array.from({ length: rows.value });

const openDeleteDialog = (id) => {
	personToDelete.value = id;
	isDeleteDialogOpen.value = true;
};

const deletePerson = async (personId) => {
	await peopleStore.deletePerson(personId);
	isDeleteDialogOpen.value = false;
	// Refresh current page after deletion
	await fetchPeople();
};

const goToShowPerson = (personId) => {
	router.push({ name: 'politician.show', params: { id: personId } });
};

const fetchPeople = async () => {
	loading.value = true;
	await peopleStore.getAll({ page: currentPage.value, pageSize: rows.value, search: filters.value.global.value });
	loading.value = false;
};

// Handle pagination change event from DataTable
const onPageChange = async (event) => {
	// event.first is the first row offset, event.rows is the page size
	// currentPage calculation: If event.first = 0 and rows = 10 => page = 1
	// If event.first = 10 and rows = 10 => page = 2, etc.
	currentPage.value = event.first / event.rows + 1;
	rows.value = event.rows;
	await fetchPeople();
};

// Handle global filter changes
const onGlobalFilterChange = async (e) => {
	filters.value.global.value = e.target.value;
	currentPage.value = 1;
	await fetchPeople();
};

onMounted(async () => {
	await fetchPeople();
});
</script>

<template>
	<main class="container mx-auto px-4 py-8 md:px-6">
		<DataTable
			:value="loading ? loadingData : people"
			:filters="filters"
			v-model:filters="filters"
			paginator
			:rows="rows"
			:total-records="totalPeople"
			:first="(currentPage - 1) * rows"
			:rows-per-page-options="[10, 20, 50]"
			@page="onPageChange"
			class="mt-4 shadow-md rounded w-full bg-white"
			tableStyle="min-width: 50rem"
		>
		<template #header>
			<div class="flex items-center justify-between p-2">
				<div>
					<router-link :to="{ name: 'politician.new' }">
						<Button size="sm" class="h-7 gap-1">
							<PlusCircle class="h-3.5 w-3.5" />
							<span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Add Person </span>
						</Button>
					</router-link>
				</div>
				<div class="flex items-center">
					<span class="p-input-icon-left">
						<i class="pi pi-search"></i>
						<InputText
							:value="filters['global'].value"
							@input="onGlobalFilterChange"
							placeholder="Search"
						/>
					</span>
				</div>
			</div>
		</template>

			<!-- Name Column -->
			<Column header="Name" style="width: 30%">
				<template #body="{ data }">
					<template v-if="loading">
						<Skeleton width="85%" height="1.2rem" />
					</template>
					<template v-else>
						<div class="flex items-center cursor-pointer" @click="goToShowPerson(data.id)">
							<img v-if="data" class="w-6 h-6 rounded-full mr-2" :src="getThumbnailUrl(data)" />
							<span class="font-medium">{{ data?.name }}</span>
						</div>
					</template>
				</template>
			</Column>

			<!-- Gender Column -->
			<Column header="Gender" style="width: 20%">
				<template #body="{ data }">
					<template v-if="loading">
						<Skeleton width="50%" height="1.2rem" />
					</template>
					<template v-else>
						<span
							class="bg-purple-200 text-purple-600 py-1 px-3 rounded-full text-xs cursor-pointer"
							@click="goToShowPerson(data.id)"
						>
							{{ data?.gender }}
						</span>
					</template>
				</template>
			</Column>

			<!-- Actions Column -->
			<Column header="Actions" style="width: 20%">
				<template #body="{ data }">
					<template v-if="loading">
						<div class="flex items-center justify-center">
							<Skeleton shape="circle" width="2rem" height="2rem" class="mx-1" />
							<Skeleton shape="circle" width="2rem" height="2rem" class="mx-1" />
							<Skeleton shape="circle" width="2rem" height="2rem" class="mx-1" />
						</div>
					</template>
					<template v-else>
						<div class="flex item-center justify-center">
							<router-link
								:to="{ name: 'politician.show', params: { id: data.id } }"
								class="w-4 mr-2 transform hover:text-purple-500 hover:scale-110"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
									/>
								</svg>
							</router-link>
							<router-link
								:to="{ name: 'politician.edit', params: { id: data.id } }"
								class="w-4 mr-2 transform hover:text-purple-500 hover:scale-110"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
									/>
								</svg>
							</router-link>
							<div
								@click="openDeleteDialog(data.id)"
								class="w-4 mr-2 transform hover:text-purple-500 hover:scale-110 cursor-pointer"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									/>
								</svg>
							</div>
						</div>
					</template>
				</template>
			</Column>
		</DataTable>

		<div v-if="!loading && people.length === 0" class="p-2 text-center font-bold">No records found</div>

		<!-- Delete Dialog Component -->
		<Delete
			v-if="isDeleteDialogOpen"
			:personId="personToDelete"
			@close="isDeleteDialogOpen = false"
			@confirm-delete="deletePerson"
		/>
	</main>
</template>

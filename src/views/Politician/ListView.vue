<script setup>
import {
	Pagination,
	PaginationEllipsis,
	PaginationFirst,
	PaginationLast,
	PaginationList,
	PaginationListItem,
	PaginationNext,
	PaginationPrev,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';

import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { usePeopleStore } from '../../stores/peopleStore';
import { getThumbnailUrl } from '../../helpers/imageHandler.js';
import Delete from '../../partials/Helpers/Delete.vue';

const router = useRouter();
const peopleStore = usePeopleStore();
const { people, totalPeople } = storeToRefs(peopleStore);

const isDeleteDialogOpen = ref(false);
const personToDelete = ref(null);
const currentPage = ref(1);
const pageSize = ref(10);
const totalPages = ref(10);

const openDeleteDialog = (id) => {
	personToDelete.value = id;
	isDeleteDialogOpen.value = true;
};

const deletePerson = (personId) => {
	peopleStore.deletePerson(personId);
	isDeleteDialogOpen.value = false;
};

const goToShowPerson = (personId) => {
	router.push({ name: 'politician.show', params: { id: personId } });
};

const changePage = (page) => {
	currentPage.value = page;
	peopleStore.getAll({ page, pageSize }); // Fetch people for the selected page
};

onMounted(async () => {
	peopleStore.getAll({ page: currentPage.value, pageSize });
});
</script>
<template>
	<div class="flex bg-gray-100 justify-center">
		<div class="w-full lg:w-2/3">
			<routerLink :to="{ name: 'politician.new' }">
				<button class="mt-2 px-6 py-3 bg-indigo-700 hover:bg-indigo-600 focus:outline-none rounded">
					<p class="text-sm font-medium leading-none text-white">Add Person</p>
				</button>
			</routerLink>

			<div v-if="people.length" class="bg-white shadow-md rounded my-2">
				<table class="min-w-max w-full table-auto">
					<thead>
						<tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
							<th class="py-3 px-6 text-left">Name</th>
							<th class="py-3 px-6 text-center">Gender</th>
							<th class="py-3 px-6 text-center">Actions</th>
						</tr>
					</thead>
					<tbody v-for="person in people" :key="person.id" class="text-gray-600 text-sm font-light">
						<tr class="border-b border-gray-200 hover:bg-gray-100">
							<td class="py-3 px-6 text-left whitespace-nowrap" @click="goToShowPerson(person.id)">
								<div class="flex items-center">
									<div class="mr-2">
										<img class="w-6 h-6 rounded-full" :src="getThumbnailUrl(person)" />
									</div>
									<span class="font-medium">{{ person.name }}</span>
								</div>
							</td>

							<td class="py-3 px-6 text-center" @click="goToShowPerson(person.id)">
								<span class="bg-purple-200 text-purple-600 py-1 px-3 rounded-full text-xs">{{
									person.gender
								}}</span>
							</td>
							<td class="py-3 px-6 text-center">
								<div class="flex item-center justify-center">
									<div class="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
										<router-link :to="{ name: 'politician.show', params: { id: person.id } }">
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
									</div>
									<div class="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
										<router-link :to="{ name: 'politician.edit', params: { id: person.id } }">
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
									</div>
									<div
										@click="openDeleteDialog(person.id)"
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
												d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
											/>
										</svg>
									</div>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div v-else>
				<div class="p-2 text-center text-bold">No records found</div>
			</div>

			<!-- Pagination Component -->
			<Pagination v-slot="{ page }" :total="100" :sibling-count="1" show-edges :default-page="1">
				<PaginationList v-slot="{ items }" class="flex items-center gap-1">
					<PaginationFirst />
					<PaginationPrev />

					<template v-for="(item, index) in items">
						<PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
							<Button class="w-9 h-9 p-0" :variant="item.value === page ? 'default' : 'outline'">
								{{ item.value }}
							</Button>
						</PaginationListItem>
						<PaginationEllipsis v-else :key="item.type" :index="index" />
					</template>

					<PaginationNext />
					<PaginationLast />
				</PaginationList>
			</Pagination>
		</div>

		<!-- Delete Dialog Component -->
		<Delete
			v-if="isDeleteDialogOpen"
			:personId="personToDelete"
			@close="isDeleteDialogOpen = false"
			@confirm-delete="deletePerson"
		/>
	</div>
</template>

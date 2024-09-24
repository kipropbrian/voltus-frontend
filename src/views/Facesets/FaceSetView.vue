<script setup>
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { useFaceSetStore } from '@/stores/faceSetStore';
import Delete from '../../components/Helpers/Delete.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const faceSetStore = useFaceSetStore();
const { facesets } = storeToRefs(faceSetStore);
const isDeleteDialogOpen = ref(false);
const facesetToDelete = ref(null);

// Open delete dialog
const openDeleteDialog = (outer_id) => {
	facesetToDelete.value = outer_id;
	isDeleteDialogOpen.value = true;
};

// Delete faceset when confirmed by child
const deleteFaceset = (outer_id) => {
	faceSetStore.deleteFaceset(outer_id);
	isDeleteDialogOpen.value = false;
};

// Navigate to show route
const goToShowFaceset = (outer_id) => {
	router.push({ name: 'faceset.show', params: { outer_id } });
};

onMounted(async () => {
	await faceSetStore.getAllFacesets();
});
</script>

<template>
	<div class="flex bg-gray-100 justify-center">
		<div class="w-full lg:w-2/3">
			<!-- <routerLink :to="{ name: 'home' }"> -->
			<button class="mt-2 px-6 py-3 bg-indigo-700 hover:bg-indigo-600 focus:outline-none rounded">
				<p class="text-sm font-medium leading-none text-white">Add Faceset</p>
			</button>
			<!-- </routerLink> -->

			<div v-if="faceSetStore.loading" class="text-center py-10">
				<p>Loading faceset details...</p>
			</div>

			<div v-if="facesets.length" class="bg-white shadow-md rounded my-2">
				<table class="min-w-max w-full table-auto">
					<thead>
						<tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
							<th class="py-3 px-6 text-left">Display Name</th>
							<th class="py-3 px-6 text-center">Tags</th>
							<th class="py-3 px-6 text-center">Actions</th>
						</tr>
					</thead>
					<tbody v-for="faceset in facesets" :key="faceset.outer_id" class="text-gray-600 text-sm font-light">
						<tr class="border-b border-gray-200 hover:bg-gray-100">
							<td
								class="py-3 px-6 text-left whitespace-nowrap"
								@click="goToShowFaceset(faceset.outer_id)"
							>
								<div class="flex items-center">
									<div class="w-4 mr-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth="{1.5}"
										stroke="currentColor"
										className="size-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
										/>
									</svg>
									</div>
									<span class="font-medium">{{ faceset.display_name }}</span>
								</div>
							</td>

							<td class="py-3 px-6 text-center" @click="goToShowFaceset(faceset.outer_id)">
								<span class="bg-purple-200 text-purple-600 py-1 px-3 rounded-full text-xs">{{
									faceset.tags
								}}</span>
							</td>

							<td class="py-3 px-6 text-center">
								<div class="flex item-center justify-center">
									<div class="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
										<router-link
											:to="{ name: 'faceset.show', params: { outer_id: faceset.outer_id } }"
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
									</div>
									<div class="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
										<router-link
											:to="{ name: 'faceset.edit', params: { outer_id: faceset.outer_id } }"
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
									</div>
									<div
										@click="openDeleteDialog(faceset.outer_id)"
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
		</div>

		<!-- Delete Dialog Component -->
		<Delete
			v-if="isDeleteDialogOpen"
			:personId="facesetToDelete"
			@close="isDeleteDialogOpen = false"
			@confirm-delete="deleteFaceset"
		/>
	</div>
</template>

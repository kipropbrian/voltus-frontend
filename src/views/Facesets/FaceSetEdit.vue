<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFaceSetStore } from '../../stores/faceSetStore';
import Delete from '../../partials/Helpers/Delete.vue';

const route = useRoute();
const router = useRouter();
const faceSetStore = useFaceSetStore();

const outerId = route.params.outer_id;

const isDeleteDialogOpen = ref(false);
const itemToDelete = ref(null);
const deleteType = ref(''); // Can be 'all' or 'single'

// Open delete dialog (for both all faces and single face token)
const openDeleteDialog = (faceset_token, type) => {
	itemToDelete.value = faceset_token;
	deleteType.value = type; // Set the type of deletion (all or single)
	isDeleteDialogOpen.value = true;
};

// Delete all face tokens when confirmed
const deleteAllFaces = async (faceset_token) => {
	await faceSetStore.deleteFaceset(faceset_token);
	isDeleteDialogOpen.value = false;
	deleteType.value = '';
};

// Delete a single face token when confirmed
const deleteSingleFaceToken = async (token) => {
	await faceSetStore.removeFaceFromFaceset(outerId, token);
	isDeleteDialogOpen.value = false;
	deleteType.value = '';
};

// Load the faceset on mount and populate the form data
onMounted(async () => {
	await faceSetStore.getFacesetByOuterId(outerId);
});

// Navigate back to the list of facesets
const goBack = () => {
	router.push({ name: 'faceset.view' });
};

// Update the faceset details
const updateFaceset = async () => {
	await faceSetStore.updateFaceset(outerId);
	router.push({ name: 'faceset.show', params: { outer_id: faceSetStore.faceset.outer_id } });
};

// Remove a single face token
const removeFaceToken = (token) => {
	openDeleteDialog(token, 'single'); // Open the dialog for a single token deletion
};
</script>

<template>
	<div class="flex bg-gray-100 justify-center">
		<div class="w-full lg:w-2/3">
			<div class="bg-white shadow-md rounded my-2 p-8">
				<div class="flex justify-between items-center mb-4">
					<h1 class="text-xl font-bold">Edit Faceset</h1>
					<button @click="goBack" class="bg-gray-500 text-white px-4 py-2 rounded">Back to Facesets</button>
				</div>

				<div v-if="faceSetStore.loading" class="text-center py-10">
					<p>Loading faceset details...</p>
				</div>

				<div v-else>
					<!-- Display Name -->
					<div class="mb-4">
						<label for="display_name" class="block font-medium mb-1">Display Name</label>
						<input
							type="text"
							v-model="faceSetStore.faceset.display_name"
							id="display_name"
							class="w-full p-2 border border-gray-300 rounded"
						/>
					</div>

					<!-- Outer ID -->
					<div class="mb-4">
						<label for="outer_id" class="block font-medium mb-1">Outer ID</label>
						<input
							type="text"
							v-model="faceSetStore.faceset.outer_id"
							id="outer_id"
							class="w-full p-2 border border-gray-300 rounded"
						/>
					</div>

					<!-- Tags -->
					<div class="mb-4">
						<label for="tags" class="block font-medium mb-1">Tags</label>
						<input
							type="text"
							v-model="faceSetStore.faceset.tags"
							id="tags"
							class="w-full p-2 border border-gray-300 rounded"
							placeholder="Separate tags with commas"
						/>
					</div>

					<!-- User Data -->
					<div class="mb-4">
						<label for="user_data" class="block font-medium mb-1">User Data</label>
						<input
							type="text"
							v-model="faceSetStore.faceset.user_data"
							id="user_data"
							class="w-full p-2 border border-gray-300 rounded"
						/>
					</div>

					<!-- Face Tokens -->
					<div class="mb-4">
						<label class="block font-medium mb-1">Face Tokens</label>
						<!-- If there are no face tokens, show 'No items found' -->
						<div
							v-if="!faceSetStore.faceset.face_tokens || !faceSetStore.faceset.face_tokens.length"
							class="text-center text-gray-500"
						>
							No items found.
						</div>

						<!-- If there are face tokens, display them in the table -->
						<table v-else class="min-w-max w-full table-auto">
							<thead>
								<tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
									<th class="py-3 px-6 text-left">Token</th>
									<th class="py-3 px-6 text-left">Person</th>
									<th class="py-3 px-6 text-left">Image</th>
									<th class="py-3 px-6 text-center">Actions</th>
								</tr>
							</thead>
							<tbody>
								<tr
									v-for="(face, index) in faceSetStore.faces"
									:key="index"
									class="border-b border-gray-200 hover:bg-gray-100"
								>
									<td class="py-3 px-6 text-left">{{ face.face_token }}</td>
									<td class="py-3 px-6 text-left">
										<div v-if="face.person">
											<p>{{ face.person.name }}</p>
										</div>
										<div v-else>
											<p>N/A</p>
										</div>
									</td>
									<td class="py-3 px-6 text-left">
										<div v-if="face.image">
											<img
												:src="face.image.url"
												alt="Image"
												class="h-12 w-12 object-cover rounded"
											/>
										</div>
										<div v-else>
											<p>N/A</p>
										</div>
									</td>
									<td class="py-3 px-6 text-center">
										<div class="flex item-center justify-center">
											<div
												@click="removeFaceToken(face.face_token)"
												class="w-4 mr-2 transform hover:text-red-500 hover:scale-110 cursor-pointer"
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

					<div class="flex justify-between items-center mt-4">
						<button @click="updateFaceset" class="bg-blue-500 text-white px-4 py-2 rounded">
							Save Changes
						</button>
						<button
							@click="openDeleteDialog(faceSetStore.faceset.faceset_token, 'all')"
							class="bg-red-500 text-white px-4 mx-4 py-2 rounded"
						>
							Delete All Faces
						</button>
					</div>
				</div>
			</div>
		</div>
		<!-- Delete Dialog Component -->
		<Delete
			v-if="isDeleteDialogOpen"
			:show="isDeleteDialogOpen"
			:id="itemToDelete"
			:title="'Confirm Deletion'"
			:message="
				deleteType === 'all'
					? 'Are you sure you want to delete all faces?'
					: 'Are you sure you want to delete this face?'
			"
			@close="isDeleteDialogOpen = false"
			@confirm-delete="
				() =>
					deleteType === 'all'
						? deleteAllFaces(itemToDelete)
						: deleteSingleFaceToken(itemToDelete)
			"
		/>
	</div>
</template>

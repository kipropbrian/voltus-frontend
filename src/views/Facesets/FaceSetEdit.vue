<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFaceSetStore } from '@/stores/faceSetStore';

const route = useRoute();
const router = useRouter();
const faceSetStore = useFaceSetStore();
const outerId = route.params.outer_id;

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
	try {
		await faceSetStore.updateFaceset(outerId, formData.value);
		router.push({ name: 'faceset.show', params: { outer_id: formData.value.outer_id } });
	} catch (error) {
		console.error('Failed to update faceset:', error);
	}
};

// Delete a face token from the faceset
const removeFaceToken = async (token) => {
	try {
		await faceSetStore.removeFaceFromFaceset(formData.value.outer_id, token);
		// Remove the token from local formData after successful deletion
		formData.value.face_tokens = formData.value.face_tokens.filter((t) => t !== token);
	} catch (error) {
		console.error('Failed to remove face token:', error);
	}
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
						<table class="min-w-max w-full table-auto">
							<thead>
								<tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
									<th class="py-3 px-6 text-left">Token</th>
									<th class="py-3 px-6 text-center">Actions</th>
								</tr>
							</thead>
							<tbody>
								<tr
									v-for="(token, index) in faceSetStore.faceset.face_tokens"
									:key="index"
									class="border-b border-gray-200 hover:bg-gray-100"
								>
									<td class="py-3 px-6 text-left">{{ token }}</td>
									<td class="py-3 px-6 text-center">
										<div class="flex item-center justify-center">
											<div
												@click="removeFaceToken(token)"
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
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

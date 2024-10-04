<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFaceSetStore } from '../../stores/faceSetStore';

const route = useRoute();
const router = useRouter();
const faceSetStore = useFaceSetStore();

const outerId = route.params.outer_id;

const goToEditFaceset = () => {
	router.push({ name: 'faceset.edit', params: { outer_id: outerId } });
};

// Navigate back to the list of facesets
const goBack = () => {
	router.push({ name: 'faceset.view' });
};

onMounted(async () => {
	faceSetStore.getFacesetByOuterId(outerId);
});
</script>

<template>
	<div class="flex bg-gray-100 justify-center">
		<div class="w-full lg:w-2/3">
			<div class="bg-white shadow-md rounded my-2 p-8">
				<div class="flex justify-between items-center mb-4">
					<h3 class="text-base font-semibold leading-7 text-gray-900">Faceset Information</h3>
					<button @click="goBack" class="bg-gray-500 text-white px-4 py-2 rounded">Back to Facesets</button>
				</div>

				<div v-if="faceSetStore.loading" class="text-center py-10">
					<p>Loading faceset details...</p>
				</div>

				<div v-else>
					<!-- Display Name -->
					<div class="px-4 sm:px-0">
						<p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Details of the Faceset.</p>
					</div>
					<div class="mt-6 border-t border-gray-100">
						<dl class="divide-y divide-gray-100">
							<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
								<dt class="text-sm font-medium leading-6 text-gray-900">Display Name</dt>
								<dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
									{{ faceSetStore.faceset.display_name || 'N/A' }}
								</dd>
							</div>
							<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
								<dt class="text-sm font-medium leading-6 text-gray-900">Faceset Token</dt>
								<dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
									{{ faceSetStore.faceset.faceset_token || 'N/A' }}
								</dd>
							</div>
							<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
								<dt class="text-sm font-medium leading-6 text-gray-900">Outer ID</dt>
								<dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
									{{ faceSetStore.faceset.outer_id || 'N/A' }}
								</dd>
							</div>

							<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
								<dt class="text-sm font-medium leading-6 text-gray-900">Tags</dt>
								<dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
									{{ faceSetStore.faceset.tags || 'None' }}
								</dd>
							</div>

							<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
								<dt class="text-sm font-medium leading-6 text-gray-900">User Data</dt>
								<dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
									{{ faceSetStore.faceset.user_data || 'N/A' }}
								</dd>
							</div>

							<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
								<dt class="text-sm font-medium leading-6 text-gray-900">Face Count</dt>
								<dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
									{{ faceSetStore.faceset.face_count }}
								</dd>
							</div>
						</dl>
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
											<!-- Add more person details as needed -->
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
								</tr>
							</tbody>
						</table>
					</div>

					<div class="flex justify-between items-center mt-4">
						<button @click="goToEditFaceset" class="bg-blue-500 text-white px-4 py-2 rounded">
							Edit Faceset
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

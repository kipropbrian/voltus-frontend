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
					<div class="my-8">
						<h3 class="text-base font-semibold leading-7 text-gray-900">Face Tokens</h3>
						<table class="min-w-max my-2 w-full table-auto">
							<thead>
								<tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
									<th class="py-3 px-6 text-left">Token</th>
								</tr>
							</thead>
							<tbody>
								<tr
									v-for="(token, index) in faceSetStore.faceset.face_tokens"
									:key="index"
									class="border-b border-gray-200 hover:bg-gray-100"
								>
									<td class="py-3 px-6 text-left">{{ token }}</td>
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

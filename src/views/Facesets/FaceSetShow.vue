<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFaceSetStore } from '@/stores/faceSetStore';

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
					<h1 class="text-xl font-bold">Faceset Details</h1>
					<button @click="goBack" class="bg-gray-500 text-white px-4 py-2 rounded">Back to Facesets</button>
				</div>

				<div v-if="faceSetStore.loading" class="text-center py-10">
					<p>Loading faceset details...</p>
				</div>

				<div v-else>
					<!-- Display Name -->
					<div class="mb-4">
						<strong>Display Name:</strong>
						<p>{{ faceSetStore.faceset.display_name || 'N/A' }}</p>
					</div>

					<!-- Faceset Token -->
					<div class="mb-4">
						<strong>Faceset Token:</strong>
						<p>{{ faceSetStore.faceset.faceset_token || 'N/A' }}</p>
					</div>

					<!-- Outer ID -->
					<div class="mb-4">
						<strong>Outer ID:</strong>
						<p>{{ faceSetStore.faceset.outer_id || 'N/A' }}</p>
					</div>

					<!-- Tags -->
					<div class="mb-4">
						<strong>Tags:</strong>
						<p>{{ faceSetStore.faceset.tags || 'None' }}</p>
					</div>

					<!-- User Data -->
					<div class="mb-4">
						<strong>User Data:</strong>
						<p>{{ faceSetStore.faceset.user_data || 'N/A' }}</p>
					</div>

					<!-- Face Count -->
					<div class="mb-4">
						<strong>Face Count:</strong>
						<p>{{ faceSetStore.faceset.face_count }}</p>
					</div>

					<!-- Face Tokens -->
					<div class="mb-4">
						<strong>Face Tokens:</strong>
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

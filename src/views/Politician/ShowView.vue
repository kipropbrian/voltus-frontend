<script setup>
import { onMounted, ref, computed } from 'vue';
import { usePeopleStore } from '../../stores/peopleStore';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();

const person = ref(null);

const peopleStore = usePeopleStore();

const formatDate = (dateString) => {
	if (!dateString) return '';
	const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
	return new Date(dateString).toLocaleDateString('en-US', options);
};

const firstImage = computed(() => {
	return person.value?.images?.length ? person.value.images[0] : null;
});

onMounted(async () => {
	const personId = route.params.id;
	person.value = await peopleStore.getPersonById(personId);
});

const router = useRouter();

const goBack = () => {
	router.back();
};
</script>

<template>
	<div class="flex bg-gray-100 justify-center m-2">
		<div class="w-full bg-white lg:w-2/3">
			<div class="flex items-center m-4">
				<!-- Back Button -->
				<button
					@click="goBack"
					class="mr-4 flex items-center text-gray-600 hover:text-gray-900 focus:outline-none"
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
						<path
							fill-rule="evenodd"
							d="M9.53 2.47a.75.75 0 0 1 0 1.06L4.81 8.25H15a6.75 6.75 0 0 1 0 13.5h-3a.75.75 0 0 1 0-1.5h3a5.25 5.25 0 1 0 0-10.5H4.81l4.72 4.72a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0Z"
							clip-rule="evenodd"
						/>
					</svg>
					<span class="ml-2">Back</span>
				</button>

				<!-- Title -->
				<h1 class="text-2xl font-bold">Person Details</h1>
			</div>

			<div v-if="person" class="shadow rounded-lg p-2">
				<div class="bg-white p-2 shadow rounded-lg w-4/5">
					<!-- Image Display and Delete Section -->
					<div class="mx-4 grid grid-cols-1 md:grid-cols-2 gap-6">
						<img
							v-if="firstImage"
							:src="firstImage.transformed_url"
							alt="person.name"
							class="h-48 w-48 rounded-full"
						/>
					</div>
					<dl class="divide-y divide-gray-100 mt-4">
						<div class="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-0">
							<dt class="text-sm font-medium leading-6 text-gray-900">Full name</dt>
							<dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
								{{ person.name }}
							</dd>
						</div>
						<div class="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-0">
							<dt class="text-sm font-medium leading-6 text-gray-900">Gender</dt>
							<dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
								{{ peopleStore.person.gender }}
							</dd>
						</div>
						<div class="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-0">
							<dt class="text-sm font-medium leading-6 text-gray-900">Details</dt>
							<dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
								{{ person.about }}
							</dd>
						</div>
					</dl>
				</div>
			</div>
			<!-- </div> -->
			<div v-else>
				<p>Loading person details...</p>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* Add your styles here */
</style>

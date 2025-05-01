<script setup>
import { onMounted } from 'vue';
import { useCrimeStore } from '@/stores/crimeStore';

const crimeStore = useCrimeStore();

onMounted(() => {
	crimeStore.fetchCrimes();
});

const getImagePath = (imageName) => {
	return `dci_images/${imageName}`;
};

const getImageName = (imageName) => {
	return imageName.split('.')[0];
};
</script>

<template>
	<main class="container mx-auto px-4 py-8 md:px-6">
		<div class="container mx-auto">
			<h1 class="text-2xl font-bold mb-4">Crime List</h1>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<div v-for="crime in crimeStore.crimes.data" :key="crime.id" class="bg-white shadow-md rounded-lg p-4">
					<router-link :to="{ name: 'crimes.show', params: { id: getImageName(crime.id) } }">
						<img
							:src="getImagePath(crime.id)"
							alt="Crime Image"
							class="aspect-square w-full rounded-md bg-gray-200 object-contain group-hover:opacity-75 lg:aspect-auto lg:h-80"
						/>
					</router-link>
					<h2 class="text-xl font-semibold mt-2">{{ crime.title }}</h2>
					<p class="text-gray-700">{{ crime.description }}</p>
				</div>
			</div>
		</div>
	</main>
</template>

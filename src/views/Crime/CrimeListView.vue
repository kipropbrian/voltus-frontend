<script setup>
//Hit the backend using axios to get the list of crimes
import { ref, onMounted } from 'vue';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_URL;
const IMAGE_PAGE_LIMIT = 10;

const IMAGE_BASE_PATH = 'dci_images';

const crimes = ref([]);

const getCrimes = async () => {
	const headers = {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	};
	const params = {
		page: 1,
		limit: IMAGE_PAGE_LIMIT,
	};

	try {
		const response = await axios.get(`${baseUrl}/api/image/getImages`, {
			headers,
			params,
		});
		crimes.value = response.data;
		console.log('Crimes:', response.data);
	} catch (error) {
		console.error('Error fetching crimes:', error);
	}
};

onMounted(() => {
	getCrimes();
});

const getImagePath = (imageName) => {
	return `${IMAGE_BASE_PATH}/${imageName}`;
};
</script>

<template>
	<main class="container mx-auto px-4 py-8 md:px-6">
		<div class="container mx-auto">
			<h1 class="text-2xl font-bold mb-4">Crime List</h1>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<div v-for="crime in crimes.data" :key="crime.id" class="bg-white shadow-md rounded-lg p-4">
					<img
						:src="getImagePath(crime.id)"
						alt="Crime Image"
						class="w-full h-48 object-cover rounded-t-lg"
					/>
					<h2 class="text-xl font-semibold mt-2">{{ crime.title }}</h2>
					<p class="text-gray-700">{{ crime.description }}</p>
				</div>
			</div>
		</div>
	</main>
</template>

import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useCrimeStore = defineStore('crimeStore', () => {
	const crimes = ref({
		data: [], // Stores the list of crimes
		pagination: {}, // Stores pagination details
	});
	const baseUrl = import.meta.env.VITE_API_URL;
	const IMAGE_PAGE_LIMIT = 12;

	// Load crimes from local storage on initialization
	const loadCrimesFromLocalStorage = () => {
		const storedCrimes = localStorage.getItem('crimes');
		if (storedCrimes) {
			crimes.value = JSON.parse(storedCrimes);
		}
	};

	// Save crimes to local storage
	const saveCrimesToLocalStorage = () => {
		localStorage.setItem('crimes', JSON.stringify(crimes.value));
	};

	const fetchCrimes = async () => {
		// Check if crimes are already in local storage
		const storedCrimes = localStorage.getItem('crimes');
		if (storedCrimes) {
			console.log('Loaded crimes from local storage');
			crimes.value = JSON.parse(storedCrimes);
			return; // Exit early if data is found in local storage
		}

		// If not in local storage, fetch from the API
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
			crimes.value.data = response.data.data; // Assign the list of crimes
			crimes.value.pagination = response.data.pagination; // Assign pagination details
			saveCrimesToLocalStorage(); // Save to local storage
			console.log('Fetched crimes from API:', response.data);
		} catch (error) {
			console.error('Error fetching crimes:', error);
		}
	};

	const fetchCrimeById = (id) => {
		// Check if the crime is already in the store
		const imageId = `${id}`;
		const existingCrime = crimes.value.data.find((crime) => {
			let crimeid = crime.id.split('.')[0];
			return crimeid === imageId;
		});
		return existingCrime;
	};

	// Load crimes from local storage when the store is initialized
	loadCrimesFromLocalStorage();

	return {
		crimes,
		fetchCrimes,
		fetchCrimeById,
	};
});

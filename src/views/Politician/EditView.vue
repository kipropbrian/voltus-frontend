<script setup>
import { ref, onMounted } from 'vue';
import { usePeopleStore } from '../../stores/peopleStore';
import { useRoute } from 'vue-router';
import { PhotoIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/solid';
import axios from 'axios';
const baseUrl = import.meta.env.VITE_API_URL;

const route = useRoute();
const peopleStore = usePeopleStore();
const person = ref(null);

onMounted(async () => {
	const personId = route.params.id;
	person.value = await peopleStore.getPersonById(personId);
});

const updatePerson = async () => {
	// Implement the logic to update the person's details
	// You may need to call an API or dispatch an action from your store
};

const uploadImage = async (event) => {
	const file = event.target.files[0];
	if (!file) return;

	// Implement your logic to upload the image
	// This might involve creating FormData and sending it to your API
};

const syncImageToPerson = async (image, person) => {
	try {
		const imageSyncUrl = `${baseUrl}/api/image/sync`;
		await axios.post(imageSyncUrl, {
			imageId: image.id,
			personUuid: person.uuid,
		});
		console.log('sync succesful');
	} catch (error) {
		console.log('Error syncing ', error);
	}
};
</script>

<template>
	<div class="flex bg-gray-100 justify-center">
		<div class="w-full lg:w-2/3">
			<div v-if="person" class="shadow rounded-lg p-4">
				<h1 class="text-2xl font-bold mb-4">Edit Person</h1>
				<form @submit.prevent="updatePerson" class="bg-white p-4 shadow rounded-lg w-4/5">
					<div class="divide-y divide-gray-100 mx-8">
						<div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 bg-gray-100">
							<label for="name" class="text-sm font-medium leading-6 text-gray-900 px-4">Full name</label>
							<input
								id="name"
								v-model="person.name"
								type="text"
								class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 border rounded px-2 py-1 w-full"
							/>
						</div>
						<div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
							<label for="gender" class="text-sm font-medium leading-6 text-gray-900 px-4">Gender</label>
							<input
								id="gender"
								v-model="person.gender"
								type="text"
								class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 border rounded px-2 py-1 w-full"
							/>
						</div>
						<div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 bg-gray-100">
							<label for="about" class="text-sm font-medium leading-6 text-gray-900 px-4">Details</label>
							<textarea
								id="about"
								v-model="person.about"
								class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 border rounded px-2 py-1 w-full"
								rows="3"
							></textarea>
						</div>
						<!-- Additional fields can be added here if necessary -->
						<div class="flex justify-start mt-4">
							<button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
								Save Changes
							</button>
						</div>
					</div>

					<!-- Image Display and Delete Section -->
					<div
						class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 shadow rounded-lg p-4"
					>
						<div v-for="image in person.images" :key="image.id" class="text-center flex-none">
							<div
								class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80"
							>
								<img
									:src="image.image_url_secure"
									alt="person.name"
									class="h-full w-full object-cover object-center lg:h-full lg:w-full"
								/>
							</div>
							<div class="mt-4 flex justify-start">
								<div>
									<p class="mt-1 text-gray-500">Face Token: {{ image.face_token }}</p>
									<div v-if="image.detected">
										<p class="mt-2 flex items-center text-lg text-gray-500">
											Synced
											<CheckCircleIcon
												class="flex-shrink-0 mr-1.5 h-5 w-5 text-green-400 mx-1"
												aria-hidden="true"
											/>
										</p>
									</div>
									<div v-else>
										<p class="mt-2 flex items-center text-lg text-gray-500">
											Not Synced
											<XCircleIcon
												class="flex-shrink-0 mr-1.5 h-5 w-5 text-red-400 mx-1"
												aria-hidden="true"
											/>
										</p>
									</div>
								</div>
							</div>
							<div class="flex flex-row gap-8 shrink-0 mt-2">
								<button
									:disabled="image.detected"
									@click.prevent="syncImageToPerson(image, person)"
									class="bg-cyan-500 shadow-lg shadow-cyan-500/50 text-white font-bold py-2 px-4 rounded"
								>
									Connect
								</button>
								<button
									class="bg-red-500 shadow-lg shadow-red-500/50 text-white font-bold py-2 px-4 rounded"
								>
									Delete
								</button>
							</div>
						</div>
					</div>
					<div class="col-span-full">
						<div
							class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
						>
							<div class="text-center">
								<PhotoIcon class="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
								<div class="mt-4 flex text-sm leading-6 text-gray-600">
									<label
										for="file-upload"
										class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
									>
										<span>Upload a file</span>
										<input id="file-upload" name="file-upload" type="file" class="sr-only" />
									</label>
									<p class="pl-1">or drag and drop</p>
								</div>
								<p class="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
							</div>
						</div>
					</div>
				</form>
			</div>
			<div v-else>
				<p>Loading...</p>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* Tailwind CSS styles */
</style>

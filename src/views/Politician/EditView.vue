<script setup>
import { ref, onMounted } from 'vue';
import { usePeopleStore } from '../../stores/peopleStore';
import { useRoute, useRouter } from 'vue-router';
import { PhotoIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/solid';
import axios from 'axios';
const baseUrl = import.meta.env.VITE_API_URL;

const route = useRoute();
const peopleStore = usePeopleStore();

onMounted(async () => {
	const personId = route.params.id;
	await peopleStore.getPersonById(personId);
});

const router = useRouter();

const goBack = () => {
	router.back();
};
</script>

<template>
	<div class="flex bg-gray-100 justify-center p-2">
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
				<h1 class="text-2xl font-bold">Edit Person</h1>
			</div>

			<div v-if="peopleStore.person" class="shadow rounded-lg p-4">
				<form @submit.prevent="peopleStore.updatePerson" class="bg-white p-4 shadow rounded-lg w-4/5">
					<div class="divide-y divide-gray-100">
						<div class="border-b border-gray-900/10 pb-4">
							<h2 class="text-base font-semibold leading-7 text-gray-900">Profile</h2>
							<p class="mt-1 text-sm leading-6 text-gray-600">
								This information will be displayed publicly so be careful what you share.
							</p>

							<div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
								<div class="sm:col-span-3">
									<label for="first-name" class="block text-sm font-medium leading-6 text-gray-900"
										>Full Names
									</label>
									<div class="mt-2">
										<input
											type="text"
											name="name"
											id="name"
											v-model="peopleStore.person.name"
											class="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
										/>
									</div>
								</div>
								<div class="sm:col-span-full">
									<label for="country" class="block text-sm font-medium leading-6 text-gray-900"
										>Gender</label
									>
									<div class="mt-2">
										<select
											id="gender"
											v-model="peopleStore.person.gender"
											name="gender"
											class="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
										>
											<option value="male">Male</option>
											<option value="female">Female</option>
										</select>
									</div>
								</div>
								<div class="col-span-full">
									<label for="about" class="block text-sm font-medium leading-6 text-gray-900"
										>About</label
									>
									<div class="mt-2">
										<textarea
											id="about"
											name="about"
											v-model="peopleStore.person.about"
											rows="3"
											class="block w-2/3 px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
										></textarea>
									</div>
								</div>
							</div>
							<div class="flex justify-start mt-4">
								<button
									type="submit"
									class="px-4 py-2 mt-2 bg-blue-500 text-white rounded hover:bg-blue-600"
								>
									Save Changes
								</button>
							</div>
						</div>
					</div>

					<!-- Image Display and Delete Section -->
					<div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
						<div
							v-for="image in peopleStore.person.images"
							:key="image.id"
							class="flex flex-col items-center"
						>
							<img
								:src="image.image_url_secure"
								alt="person.name"
								class="object-cover w-full h-48 rounded"
							/>
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

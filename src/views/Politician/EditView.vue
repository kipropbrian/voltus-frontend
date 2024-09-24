<script setup>
import { onMounted, ref, computed } from 'vue';
import { usePeopleStore } from '../../stores/peopleStore';
import { useRoute, useRouter } from 'vue-router';
import { PhotoIcon } from '@heroicons/vue/24/solid';
import { updateImage, dropHandler } from '../../helpers/imageHandler';

const route = useRoute();
const peopleStore = usePeopleStore();
const personId = route.params.id;

const uploadedInfo = ref({
	imgurl: '/blank-person-612x612.jpeg',
	uploadedImage: null,
});

const person = ref(null);

const dropHandle = (e) => {
	let images = dropHandler(e);
	if (images !== null) {
		uploadedInfo.value = images;
	}
};

const uploadHandler = (e) => {
	peopleStore.newFormData.file = e.target.files[0];
	uploadedInfo.value = updateImage(e);
};

onMounted(async () => {
	person.value = await peopleStore.getPersonById(personId);
});

const firstImage = computed(() => {
	return person.value?.images?.length ? person.value.images[0] : null;
});

const update = async () => {
	peopleStore.updatePerson(personId);
};

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
				<form @submit.prevent="update" class="bg-white p-4 shadow rounded-lg w-4/5">
					<div class="divide-y divide-gray-100">
						<div class="border-b border-gray-900/10 pb-4">
							<h2 class="text-base font-semibold leading-7 text-gray-900">Profile</h2>
							<p class="mt-1 text-sm leading-6 text-gray-600">
								This information will be displayed publicly so be careful what you share.
							</p>

							<div class="m-4 grid grid-cols-1 md:grid-cols-2 gap-6">
								<img
									v-if="firstImage"
									:src="firstImage.transformed_url"
									alt="person.name"
									class="h-48 w-48 rounded-full"
								/>
							</div>
							<div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
								<!-- Image Display and Delete Section -->
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

					<div class="flex justify-center items-start gap-6">
						<div class="flex items-center justify-center w-96 my-4 mb-4">
							<label
								for="dropzone-file"
								class="flex flex-col items-center justify-center w-full h-48 border-2 border-sky-200 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
								@drop="dropHandler"
								@dragover.prevent=""
							>
								<div class="flex flex-col items-center justify-center pt-5 pb-6">
									<svg
										aria-hidden="true"
										class="w-10 h-10 mb-3 text-sky-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
										></path>
									</svg>
									<p class="mb-2 text-sm text-gray-500">
										<span class="font-semibold">Click to upload</span> or drag and drop
									</p>
									<p class="text-xs text-gray-500">PNG, JPG (MAX. 2MB)</p>
								</div>
								<input
									id="dropzone-file"
									type="file"
									class="hidden"
									@change="uploadHandler"
									accept="image/png, image/jpeg"
								/>
							</label>
						</div>
						<figure class="w-96 mt-4 flex mx-auto position: relative">
							<img
								id="canva1"
								class="h-auto rounded-lg shadow-lg shadow-gray-800"
								:src="uploadedInfo.imgurl"
								alt="user provided image"
							/>
							<div v-for="(box, k) in peopleStore.faceStyles" :key="k" :style="box"></div>
						</figure>
					</div>
				</form>
			</div>
			<div v-else>
				<p>Loading...</p>
			</div>
		</div>
	</div>
</template>

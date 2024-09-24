<script setup>
import { usePeopleStore } from '../../stores/peopleStore';
import { PhotoIcon } from '@heroicons/vue/24/solid';
import { useRouter } from 'vue-router';

const peopleStore = usePeopleStore();
const router = useRouter();

const goBack = () => {
	router.back();
};
</script>

<template>
	<div class="flex bg-gray-100 justify-center">
		<div class="w-full lg:w-2/3">
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
				<h1 class="text-2xl font-bold">Create New Person</h1>
			</div>

			<form @submit.prevent="peopleStore.createPerson" class="bg-white p-6 rounded-lg shadow-lg">
				<div class="mb-4">
					<label class="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
					<input
						v-model="peopleStore.newFormData.name"
						type="text"
						class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						placeholder="Enter full name"
						required
					/>
				</div>

				<div class="mb-4">
					<label class="block text-gray-700 text-sm font-bold mb-2">Gender</label>
					<select
						v-model="peopleStore.newFormData.gender"
						class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						required
					>
						<option value="" disabled>Select gender</option>
						<option value="male">Male</option>
						<option value="female">Female</option>
					</select>
				</div>

				<div class="mb-4">
					<label class="block text-gray-700 text-sm font-bold mb-2">Details</label>
					<textarea
						v-model="peopleStore.newFormData.details"
						class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						placeholder="Enter details"
						required
					></textarea>
				</div>
				<div class="col-span-full">
					<div class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
						<div class="text-center">
							<PhotoIcon class="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
							<div class="mt-4 flex text-sm leading-6 text-gray-600">
								<label
									for="file-upload"
									class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
								>
									<span>Upload a file</span>
									<input
										id="file-upload"
										name="file-upload"
										type="file"
										class="sr-only"
										@change="peopleStore.uploadHandler"
									/>
								</label>
								<p class="pl-1">or drag and drop</p>
							</div>
							<p class="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
						</div>
					</div>
				</div>
				<div class="m-4">
					<button
						:disabled="peopleStore.isSubmitting || peopleStore.submitted"
						:class="{
							'bg-blue-500 hover:bg-blue-700': !(peopleStore.isSubmitting || peopleStore.submitted),
							'bg-gray-400 cursor-not-allowed': peopleStore.isSubmitting || peopleStore.submitted,
						}"
						class="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					>
						{{
							peopleStore.submitted
								? 'Created'
								: peopleStore.isSubmitting
									? 'Creating ...'
									: 'Create Person'
						}}
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

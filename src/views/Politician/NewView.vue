<script setup>
import { usePeopleStore } from '@/stores/peopleStore';
import { PhotoIcon } from '@heroicons/vue/24/solid';

const peopleStore = usePeopleStore();
</script>

<template>
	<div class="flex bg-gray-100 justify-center">
		<div class="w-full lg:w-2/3">
			<h1 class="text-2xl font-bold mb-4">Create New Person</h1>
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
						:disabled="peopleStore.isSubmitting"
						class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					>
						{{ peopleStore.isSubmitting ? 'Creating...' : 'Create Person' }}
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

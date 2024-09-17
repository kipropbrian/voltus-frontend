<script setup>
import { usePeopleStore } from '@/stores/peopleStore';
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
						type="text"
						class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						placeholder="Enter full name"
						required
					/>
				</div>

				<div class="mb-4">
					<label class="block text-gray-700 text-sm font-bold mb-2">Gender</label>
					<select
						class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						required
					>
						<option value="" disabled>Select gender</option>
						<option value="male">Male</option>
						<option value="female">Female</option>
						<option value="other">Other</option>
					</select>
				</div>

				<div class="mb-4">
					<label class="block text-gray-700 text-sm font-bold mb-2">Details</label>
					<textarea
						class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						placeholder="Enter details"
						required
					></textarea>
				</div>

				<!-- Image Upload Section -->
				<div class="mb-4">
					<label class="block text-gray-700 text-sm font-bold mb-2">Add Images (optional)</label>
					<input
						type="file"
						multiple
						class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
					/>
				</div>

				<div class="mb-4">
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

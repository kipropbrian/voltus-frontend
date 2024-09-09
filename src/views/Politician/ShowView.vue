<script setup>
import { ref, onMounted } from 'vue';
import { usePeopleStore } from '../../stores/peopleStore';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

const route = useRoute();

const peopleStore = usePeopleStore();

const { images } = storeToRefs(peopleStore);

const person = ref(null);

const formatDate = (dateString) => {
	if (!dateString) return '';
	const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
	return new Date(dateString).toLocaleDateString('en-US', options);
};

onMounted(async () => {
	const personId = route.params.id;
	person.value = await peopleStore.getPersonById(personId);
});
</script>

<template>
	<div class="container mx-auto p-4">
		<div v-if="person" class="shadow rounded-lg p-4">
			<h1 class="text-2xl font-bold mb-4">Person Details</h1>
			<div class="bg-white p-4 shadow rounded-lg w-4/5">
				<dl class="divide-y divide-gray-100 mx-8">
					<div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 bg-gray-100">
						<dt class="text-sm font-medium leading-6 text-gray-900 px-4">Full name</dt>
						<dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{{ person.name }}</dd>
					</div>
					<div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
						<dt class="text-sm font-medium leading-6 text-gray-900 px-4">Gender</dt>
						<dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"> {{ person.gender }}</dd>
					</div>
					<div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 bg-gray-100">
						<dt class="text-sm font-medium leading-6 text-gray-900 px-4">Details</dt>
						<dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{{ person.about }}</dd>
					</div>
					<div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
						<dt class="text-sm font-medium leading-6 text-gray-900 px-4">UUID</dt>
						<dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{{ person.uuid }}</dd>
					</div>
					<div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 bg-gray-100">
						<dt class="text-sm font-medium leading-6 text-gray-900 px-4">Created at </dt>
						<dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"> {{ formatDate(person.created_at) }}</dd>
					</div>
					<div v-if="person.updated_at" class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
						<dt class="text-sm font-medium leading-6 text-gray-900 px-4">Created at </dt>
						<dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"> {{ formatDate(person.updated_at) }}</dd>
					</div>
				</dl>
			</div>
			<div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 shadow rounded-lg p-4">
				<div v-for="image in person.images" :key="image.id" class="text-center flex-none">
					<div
						class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
						<img :src="image.image_url" alt="person.name"
							class="h-full w-full object-cover object-center lg:h-full lg:w-full">
					</div>
					<div class="mt-4 flex justify-between">
						<div>
							<p class="mt-1 text-sm text-gray-500">Face Token: {{image.face_token}}</p>
							<p class="mt-1 text-sm text-gray-500">Detected {{image.detected}}</p>
							<p class="mt-1 text-sm text-gray-500">Created at: {{ formatDate(image.created_at) }}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- </div> -->
		<div v-else>
			<p>Loading person details...</p>
		</div>
	</div>
</template>

<style scoped>
/* Add your styles here */
</style>
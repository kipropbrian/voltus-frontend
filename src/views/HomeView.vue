<script setup>
import { useFacePlusStore } from '../stores/facePlusStore';
const facePlusStore = useFacePlusStore();

const associateFace = async(face_token, personId) => {
	await facePlusStore.handleAddFace(face_token, personId);
}
</script>
<template>
	<div class="grid grid-col grid-cols-5 mt-4 gap-2 w-9/12 mx-auto">
		<div class="col-span-3 rounded-lg p-4 shadow-md bg-gray-100">
			<div class="flex items-center justify-center w-full my-2 mb-4">
				<label
					for="dropzone-file"
					class="flex flex-col items-center justify-center w-full h-36 border-2 border-sky-200 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
					@drop="facePlusStore.dropHandler"
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
						@change="facePlusStore.uploadHandler"
						accept="image/png, image/jpeg"
					/>
				</label>
			</div>
			<hr />
			<div class="flex justify-center">
				<button
					class="flex p-2 mt-2 pr-4 rounded-md bg-sky-400 text-slate-200 hover:bg-sky-300 shadow-lg"
					:class="{ 'cursor-not-allowed bg-gray-500 hover:bg-gray-500': facePlusStore.status.loading }"
					:disabled="facePlusStore.status.loading"
					@click.prevent="facePlusStore.detectFaces"
				>
					<div v-if="!facePlusStore.status.loading" role="status" class="flex justify-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6 mr-2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
							/>
						</svg>
						<span class="sr-only">Search</span>
						Search
					</div>
					<div v-else role="status" class="flex justify-center">
						<svg
							class="inline mr-2 w-6 h-6 text-gray-200 animate-spin fill-pink-600"
							viewBox="0 0 100 101"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
								fill="currentColor"
							/>
							<path
								d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
								fill="currentFill"
							/>
						</svg>
						<span class="sr-only">Loading...</span>
						Loading...
					</div>
				</button>
			</div>
			<figure class="max-w-lg mt-4 flex mx-auto position: relative">
				<img
					id="canva1"
					class="h-auto rounded-lg shadow-lg shadow-gray-800 hover:shadow-sky-200"
					:src="facePlusStore.uploadedInfo.imgurl"
					alt="user provided image"
				/>
				<div v-for="(box, k) in facePlusStore.faceStyles" :key="k" :style="box"></div>
			</figure>
		</div>

		<!-- Display detected face data -->
		<div class="col-span-2 rounded px-2 border-1 shadow-md bg-gray-100">
			<div class="bg-gray-200 mt-2 p-2 flex justify-center rounded-t-md">
				<h2 class="text-2xl text-stone-500 font-semibold">Faces Detected</h2>
			</div>
			<hr class="mt-2" />

			<!-- Loop through processed faces -->
			<div
				v-for="face in facePlusStore.processedFaces"
				:key="face.face_token"
				class="flex mt-2 p-2 bg-white shadow rounded-lg items-center"
			>
				<!-- Display detected person's image -->
				<img class="rounded-full m-2 h-10 w-10" :src="face.image_url" alt="user portrait" />
				<!-- Display detected person's info -->
				<div class="ml-2 m-2">
					<p class="font-medium">{{ face.name }}</p>
					<p class="font-light text-slate-400">{{ face.about }}</p>
					<p v-if="face.confidence" class="font-light text-slate-400">Confidence: {{ face.confidence }}%</p>
				</div>
				<div v-if="face.confidence" class="flex mx-8 space-x-8">
					<svg
						class="w-6 h-6 text-gray-800 dark:text-white"
						@click="associateFace(face.face_token, face.personId)"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						fill="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							fill-rule="evenodd"
							d="M15.03 9.684h3.965c.322 0 .64.08.925.232.286.153.532.374.717.645a2.109 2.109 0 0 1 .242 1.883l-2.36 7.201c-.288.814-.48 1.355-1.884 1.355-2.072 0-4.276-.677-6.157-1.256-.472-.145-.924-.284-1.348-.404h-.115V9.478a25.485 25.485 0 0 0 4.238-5.514 1.8 1.8 0 0 1 .901-.83 1.74 1.74 0 0 1 1.21-.048c.396.13.736.397.96.757.225.36.32.788.269 1.211l-1.562 4.63ZM4.177 10H7v8a2 2 0 1 1-4 0v-6.823C3 10.527 3.527 10 4.176 10Z"
							clip-rule="evenodd"
						/>
					</svg>
					<svg
						class="w-6 h-6 text-gray-800 dark:text-white"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						fill="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							fill-rule="evenodd"
							d="M8.97 14.316H5.004c-.322 0-.64-.08-.925-.232a2.022 2.022 0 0 1-.717-.645 2.108 2.108 0 0 1-.242-1.883l2.36-7.201C5.769 3.54 5.96 3 7.365 3c2.072 0 4.276.678 6.156 1.256.473.145.925.284 1.35.404h.114v9.862a25.485 25.485 0 0 0-4.238 5.514c-.197.376-.516.67-.901.83a1.74 1.74 0 0 1-1.21.048 1.79 1.79 0 0 1-.96-.757 1.867 1.867 0 0 1-.269-1.211l1.562-4.63ZM19.822 14H17V6a2 2 0 1 1 4 0v6.823c0 .65-.527 1.177-1.177 1.177Z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
			</div>
		</div>
	</div>
</template>

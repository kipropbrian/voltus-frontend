<script setup>
import { reactive } from 'vue';

const state = reactive({ imgurl: 'https://res.cloudinary.com/voltus/image/upload/v1668342671/voltus/xzmksyvrbmbtyldnc00l.png' })

</script>
<template>
	<div class="grid grid-col grid-cols-2 mt-10 gap-2 w-9/12 mx-auto">
		<div class="rounded-lg p-4 shadow-md bg-gray-100">
			<div class="flex items-center justify-center w-full my-2 mb-4">
				<label
					for="dropzone-file"
					class="flex flex-col items-center justify-center w-full h-48 border-2 border-sky-200 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
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
						<p class="text-xs text-gray-500">PNG, JPG or GIF (MAX. 2MB)</p>
					</div>
					<input id="dropzone-file" type="file" class="hidden" />
				</label>
			</div>
			<hr />
			<figure class="max-w-lg mt-4 flex mx-auto">
				<img
					id="canva1"
					class="h-auto rounded-lg shadow-lg shadow-gray-800 hover:shadow-sky-200"
					:src="state.imgurl"
					alt="placeholder image"
				/>
			</figure>

			<div class="flex justify-center">
				<button class="flex p-2 mt-8 pr-4 rounded-md bg-sky-400 text-slate-200 hover:bg-sky-300 shadow-lg">
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
					Scan Image
				</button>
			</div>
		</div>
		<div class="rounded px-2 border-1 shadow-md bg-gray-100">
			<div class="bg-gray-200 mt-2 p-2 flex justify-center rounded-t-md">
				<h2 class="text-2xl text-stone-500 font-semibold">Faces Detected</h2>
			</div>
			<hr class="mt-2" />
			<div class="flex mt-2 p-2 bg-white shadow rounded-lg items-center">
				<img
					class="rounded-full m-2 h-10 w-10"
					src="https://randomuser.me/api/portraits/thumb/men/75.jpg"
					alt="random user"
				/>
				<div class="ml-2 m-2">
					<p class="font-medium">Leslie Alexander</p>
					<p class="font-light text-slate-400">President of Kenya</p>
				</div>
			</div>
			<div class="flex mt-2 p-2 bg-white shadow rounded-lg items-center">
				<img
					class="rounded-full m-2 h-10 w-10"
					src="https://randomuser.me/api/portraits/thumb/women/75.jpg"
					alt="random user"
				/>
				<div class="ml-2 m-2">
					<p class="font-medium">Micheal Foster</p>
					<p class="font-light text-slate-400">Permanent secretary</p>
				</div>
			</div>
			<div class="flex mt-2 p-2 bg-white shadow rounded-lg items-center">
				<img
					class="rounded-full m-2 h-10 w-10"
					src="https://randomuser.me/api/portraits/thumb/women/3.jpg"
					alt="random user"
				/>
				<div class="ml-2 m-2">
					<p class="font-medium">Jenny Wilson</p>
					<p class="font-light text-slate-400">Vice President</p>
				</div>
			</div>
			<div class="flex mt-2 p-2 bg-white shadow rounded-lg items-center">
				<img
					class="rounded-full m-2 h-10 w-10"
					src="https://randomuser.me/api/portraits/thumb/men/9.jpg"
					alt="random user"
				/>
				<div class="ml-2 m-2">
					<p class="font-medium">Esther Howard</p>
					<p class="font-light text-slate-400">Economic Adviser</p>
				</div>
			</div>
		</div>
	</div>
</template>

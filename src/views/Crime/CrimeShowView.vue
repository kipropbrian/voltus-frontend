<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useCrimeStore } from '@/stores/crimeStore';
import { watch, ref, onMounted } from 'vue';

const DEFAULT_DETECTOR = 'mtcnn';

const imageDetails = ref({
	detector: DEFAULT_DETECTOR,
	faces: [],
});

const route = useRoute();
const router = useRouter();
const { fetchCrimeById } = useCrimeStore();

const IMAGE_BASE_PATH = '/dci_images';

// Find the crime details based on the ID
const crimeDetails = fetchCrimeById(route.params.id);

let imagePath = null;
let detectors = new Set();

if (crimeDetails) {
	imagePath = `${IMAGE_BASE_PATH}/${crimeDetails.id}`;
	// Check if the crime details are found
	for (const faceDetails of crimeDetails.documents) {
		detectors.add(faceDetails['detector']);
		if (faceDetails.detector === DEFAULT_DETECTOR) {
			imageDetails.value.faces.push(faceDetails);
		}
	}
} else {
	// Handle the case where the crime details are not found
	console.error('Crime details not found for ID:', route.params.id);
}

const updateImageDetails = () => {
	imageDetails.value.faces = [];
	for (const faceDetails of crimeDetails.documents) {
		if (faceDetails.detector === imageDetails.value.detector) {
			imageDetails.value.faces.push(faceDetails);
		}
	}
};

const drawFaces = () => {
	const canvas = document.getElementById('faceCanvas');
	const ctx = canvas.getContext('2d');
	const img = document.getElementById('crimeImage');

	// Ensure the image is loaded before drawing
	if (!img.complete) {
		img.onload = () => drawFaces();
		return;
	}

	// Clear the canvas
	canvas.width = img.width;
	canvas.height = img.height;
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw the image onto the canvas
	ctx.drawImage(img, 0, 0, img.width, img.height);

	// Draw rectangles for each face
	imageDetails.value.faces.forEach((face) => {
		const confidence = face['confidence'];
		const facial_area = face['facial_area'];
		ctx.strokeStyle = 'red';
		ctx.lineWidth = 2;
		ctx.strokeRect(facial_area.x, facial_area.y, facial_area.width, facial_area.height);

		// Draw the confidence value above the rectangle
		ctx.shadowColor = 'black'; // Shadow color
		ctx.shadowBlur = 4; // Blur radius
		ctx.shadowOffsetX = 2; // Horizontal offset
		ctx.shadowOffsetY = 2; // Vertical offset

		ctx.fillStyle = 'white'; // Text color
		ctx.font = '16px Arial';
		ctx.fillText(`${confidence}`, facial_area.x, facial_area.y - 5);

		// Reset shadow settings to avoid affecting other drawings
		ctx.shadowColor = 'transparent';
		ctx.shadowBlur = 0;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;

		// Optionally, draw circles for eyes
		ctx.fillStyle = 'grey';
		ctx.beginPath();
		ctx.arc(facial_area.left_eye[0], facial_area.left_eye[1], 5, 0, 2 * Math.PI);
		ctx.fill();

		ctx.beginPath();
		ctx.arc(facial_area.right_eye[0], facial_area.right_eye[1], 5, 0, 2 * Math.PI);
		ctx.fill();
	});
};

onMounted(() => {
	drawFaces();
});

watch(
	() => imageDetails.value.faces,
	() => {
		drawFaces();
	},
	{ deep: true },
);

const goBack = () => {
	router.back();
};
</script>

<template>
	<main class="container mx-auto px-4 py-8 md:px-6">
		<div class="container mx-auto">
			<button @click="goBack" class="mr-4 flex items-center text-gray-600 hover:text-gray-900 focus:outline-none">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
					<path
						fill-rule="evenodd"
						d="M9.53 2.47a.75.75 0 0 1 0 1.06L4.81 8.25H15a6.75 6.75 0 0 1 0 13.5h-3a.75.75 0 0 1 0-1.5h3a5.25 5.25 0 1 0 0-10.5H4.81l4.72 4.72a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0Z"
						clip-rule="evenodd"
					/>
				</svg>
				<span class="ml-2">Back</span>
			</button>
			<h1 class="text-2xl font-bold mb-4">Image Details</h1>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<!-- Image Section (2/3 of the grid) -->
				<div class="md:col-span-2 flex justify-center relative">
					<img
						:id="'crimeImage'"
						:src="imagePath"
						alt="Crime Image"
						class="rounded-md bg-gray-200 object-contain"
						style="max-width: 100%; display: none"
					/>
					<canvas
						id="faceCanvas"
						class="relative top-0 left-0"
						style="max-width: 100%; max-height: 800px"
					></canvas>
				</div>
				<!-- Content Section (1/3 of the grid) -->
				<div class="bg-white shadow-md rounded-lg p-4">
					<h2 class="text-xl font-semibold mb-2">Additional Details</h2>
					<p class="text-gray-700"></p>
					<div class="mb-4">
						<label for="detectorSelector" class="block text-gray-700 font-medium mb-2"
							>Select Detector:</label
						>
						<select
							id="detectorSelector"
							class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
							v-model="imageDetails.detector"
							@change="updateImageDetails"
						>
							<option v-for="detector in Array.from(detectors)" :key="detector" :value="detector">
								{{ detector }}
							</option>
						</select>
					</div>

					<strong>Detector:</strong> {{ imageDetails.detector }}<br />
				</div>
			</div>
		</div>
	</main>
</template>

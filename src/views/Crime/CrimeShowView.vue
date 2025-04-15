<script setup>
import { useRoute } from 'vue-router';
import { useCrimeStore } from '@/stores/crimeStore';
import { ref, onMounted } from 'vue';

const imageDetails = ref({
	detector: '',
	confidence: null,
	created_at: '',
	faces: [],
});

const route = useRoute();
const { fetchCrimeById } = useCrimeStore();

const DETECTOR = 'retinaface';

const IMAGE_BASE_PATH = '/dci_images';
const imagePath = `${IMAGE_BASE_PATH}/${route.params.id}.jpg`;

// Find the crime details based on the ID
const crimeDetails = fetchCrimeById(route.params.id);

if (!crimeDetails) {
	// Handle the case where the crime details are not found
	console.error('Crime details not found for ID:', route.params.id);
}

for (const data of crimeDetails.documents) {
	if (data.detector === DETECTOR) {
		imageDetails.value.detector = data['detector'];
		imageDetails.value.confidence = data['confidence'];
		imageDetails.value.created_at = data['created_at'];
		imageDetails.value.faces.push(data['facial_area']);
	}
}
console.log('Image details:', imageDetails.value.faces);

const drawFaces = () => {
	const canvas = document.getElementById('faceCanvas');
	const ctx = canvas.getContext('2d');
	const img = document.getElementById('crimeImage');

	// Wait for the image to load before drawing
	img.onload = () => {
		canvas.width = img.width;
		canvas.height = img.height;

		// Draw the image onto the canvas
		ctx.drawImage(img, 0, 0, img.width, img.height);

		// Draw rectangles for each face
		imageDetails.value.faces.forEach((face) => {
			ctx.strokeStyle = 'red';
			ctx.lineWidth = 2;
			ctx.strokeRect(face.x, face.y, face.width, face.height);

			// Optionally, draw circles for eyes
			ctx.fillStyle = 'blue';
			ctx.beginPath();
			ctx.arc(face.left_eye[0], face.left_eye[1], 5, 0, 2 * Math.PI);
			ctx.fill();

			ctx.beginPath();
			ctx.arc(face.right_eye[0], face.right_eye[1], 5, 0, 2 * Math.PI);
			ctx.fill();
		});
	};
};

onMounted(() => {
	drawFaces();
});
</script>

<template>
	<main class="container mx-auto px-4 py-8 md:px-6">
		<div class="container mx-auto">
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
					<canvas id="faceCanvas" class="absolute top-0 left-0" style="max-width: 100%"></canvas>
				</div>
				<!-- Content Section (1/3 of the grid) -->
				<div class="bg-white shadow-md rounded-lg p-4">
					<h2 class="text-xl font-semibold mb-2">Additional Details</h2>
					<p class="text-gray-700">
						<strong>Detector:</strong> {{ imageDetails.detector }}<br />
						<strong>Confidence:</strong> {{ imageDetails.confidence }}<br />
						<strong>Created At:</strong> {{ imageDetails.created_at }}
					</p>
				</div>
			</div>
		</div>
	</main>
</template>

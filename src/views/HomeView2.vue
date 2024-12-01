# HomeView.vue
<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Shield, Search, LineChart, AlertCircle } from 'lucide-vue-next';
import { Alert, AlertDescription } from '@/components/ui/alert';

const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const error = ref<string | null>(null);

const handleFileSelect = (event: Event) => {
	const input = event.target as HTMLInputElement;
	if (!input.files?.length) return;

	const file = input.files[0];

	if (!file.type.startsWith('image/')) {
		error.value = 'Please select an image file';
		return;
	}

	if (file.size > 5 * 1024 * 1024) {
		error.value = 'Image size should be less than 5MB';
		return;
	}

	error.value = null;
	selectedFile.value = file;
	previewUrl.value = URL.createObjectURL(file);
};

const handleUpload = async () => {
	if (!selectedFile.value) return;

	try {
		console.log('Uploading file:', selectedFile.value);
		selectedFile.value = null;
		previewUrl.value = null;
	} catch (err) {
		error.value = 'Failed to upload image. Please try again.';
	}
};
</script>

<template>
	<main class="container mx-auto px-4 py-8 md:px-6">
		<!-- Hero Section -->
		<section class="mb-16 text-center">
			<h1 class="mb-4 text-4xl font-bold tracking-tight md:text-6xl">Face Vector Analysis</h1>
			<p class="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
				Advanced facial recognition platform for security and law enforcement. Upload an image to analyze faces,
				gather intelligence, and identify potential security concerns.
			</p>
		</section>

		<!-- Upload Section -->
		<section class="mx-auto mb-16 max-w-2xl">
			<Card>
				<CardContent class="p-6">
					<div class="mb-6 text-center">
						<h2 class="mb-2 text-2xl font-semibold">Upload Image</h2>
						<p class="text-sm text-muted-foreground">
							Upload a clear photo for facial analysis and intelligence gathering
						</p>
					</div>

					<Alert variant="destructive" class="mb-4" v-if="error">
						<AlertCircle class="h-4 w-4" />
						<AlertDescription>{{ error }}</AlertDescription>
					</Alert>

					<div
						class="mb-4 flex flex-col items-center rounded-lg border-2 border-dashed p-8"
						:class="{ 'border-primary': previewUrl, 'border-muted': !previewUrl }"
					>
						<div v-if="!previewUrl" class="text-center">
							<Upload class="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
							<p class="mb-2 text-sm font-medium">Drag and drop your image here</p>
							<p class="mb-4 text-xs text-muted-foreground">or</p>
							<Button as="label" variant="secondary">
								Choose File
								<input type="file" class="hidden" accept="image/*" @change="handleFileSelect" />
							</Button>
						</div>
						<div v-else class="w-full">
							<img
								:src="previewUrl"
								alt="Preview"
								class="mx-auto mb-4 max-h-64 rounded-lg object-cover"
							/>
							<div class="flex justify-center gap-4">
								<Button
									variant="secondary"
									@click="
										selectedFile = null;
										previewUrl = null;
									"
								>
									Remove
								</Button>
								<Button @click="handleUpload"> Analyze Image </Button>
							</div>
						</div>
					</div>

					<p class="text-center text-xs text-muted-foreground">
						Maximum file size: 5MB. Supported formats: JPG, PNG
					</p>
				</CardContent>
			</Card>
		</section>

		<section class="mx-auto max-w-4xl py-8 border-t bg-background">
			<h2 class="mb-12 text-center text-3xl font-bold">Key Features</h2>
			<div class="grid gap-16">
				<!-- Face Detection -->
				<div class="flex flex-col items-center text-center md:items-start md:text-start gap-6 md:flex-row">
					<div class="flex-shrink-0">
						<div class="rounded-full bg-primary/10 p-4">
							<Shield class="h-6 w-6 text-primary" />
						</div>
					</div>
					<div class="w-full">
						<h3 class="mb-2 text-xl font-semibold">Face Detection</h3>
						<p class="mb-3 text-muted-foreground">
							State-of-the-art facial recognition for identifying and tracking persons of interest across
							multiple data sources.
						</p>
						<div class="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2 md:text-left">
							<div class="flex items-center gap-2 justify-center md:justify-start">
								<div class="h-1 w-1 rounded-full bg-primary"></div>
								High-accuracy matching
							</div>
							<div class="flex items-center gap-2 justify-center md:justify-start">
								<div class="h-1 w-1 rounded-full bg-primary"></div>
								Real-time monitoring
							</div>
							<div class="flex items-center gap-2 justify-center md:justify-start">
								<div class="h-1 w-1 rounded-full bg-primary"></div>
								Multi-angle detection
							</div>
							<div class="flex items-center gap-2 justify-center md:justify-start">
								<div class="h-1 w-1 rounded-full bg-primary"></div>
								Batch processing
							</div>
						</div>
					</div>
				</div>

				<!-- OSINT Collection -->
				<div class="flex flex-col items-center text-center md:items-start md:text-start gap-6 md:flex-row">
					<div class="flex-shrink-0">
						<div class="rounded-full bg-primary/10 p-4">
							<Search class="h-6 w-6 text-primary" />
						</div>
					</div>
					<div class="w-full">
						<h3 class="mb-2 text-xl font-semibold">OSINT Collection</h3>
						<p class="mb-3 text-muted-foreground">
							Comprehensive intelligence gathering from social media, public records, and digital
							footprints.
						</p>
						<div class="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2 md:text-left">
							<div class="flex items-center gap-2 justify-center md:justify-start">
								<div class="h-1 w-1 rounded-full bg-primary"></div>
								Social media analysis
							</div>
							<div class="flex items-center gap-2 justify-center md:justify-start">
								<div class="h-1 w-1 rounded-full bg-primary"></div>
								Public record scanning
							</div>
							<div class="flex items-center gap-2 justify-center md:justify-start">
								<div class="h-1 w-1 rounded-full bg-primary"></div>
								Digital footprint tracking
							</div>
							<div class="flex items-center gap-2 justify-center md:justify-start">
								<div class="h-1 w-1 rounded-full bg-primary"></div>
								Data correlation
							</div>
						</div>
					</div>
				</div>

				<!-- Crime Analysis -->
				<div class="flex flex-col items-center text-center md:items-start md:text-start gap-6 md:flex-row">
					<div class="flex-shrink-0">
						<div class="rounded-full bg-primary/10 p-4">
							<LineChart class="h-6 w-6 text-primary" />
						</div>
					</div>
					<div class="w-full">
						<h3 class="mb-2 text-xl font-semibold">Crime Analysis</h3>
						<p class="mb-3 text-muted-foreground">
							Advanced pattern recognition tools for investigating criminal activities and identifying
							connections.
						</p>
						<div class="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2 md:text-left">
							<div class="flex items-center gap-2 justify-center md:justify-start">
								<div class="h-1 w-1 rounded-full bg-primary"></div>
								Pattern recognition
							</div>
							<div class="flex items-center gap-2 justify-center md:justify-start">
								<div class="h-1 w-1 rounded-full bg-primary"></div>
								Network analysis
							</div>
							<div class="flex items-center gap-2 justify-center md:justify-start">
								<div class="h-1 w-1 rounded-full bg-primary"></div>
								Behavioral profiling
							</div>
							<div class="flex items-center gap-2 justify-center md:justify-start">
								<div class="h-1 w-1 rounded-full bg-primary"></div>
								Threat assessment
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</main>
</template>

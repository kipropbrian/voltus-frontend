<script setup>
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
</script>

<template>
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 md:p-6">
		<Popover>
			<PopoverTrigger asChild>
				<img
					src="https://placehold.co/600x400"
					alt="Gallery Image 1"
					width="300"
					height="300"
					class="object-cover w-full rounded-lg overflow-hidden"
					:style="{ aspectRatio: '300/300', objectFit: 'cover' }"
				/>
			</PopoverTrigger>
			<PopoverContent class="w-auto">
				<img
					src="https://placehold.co/600x400"
					alt="Gallery Image 1"
					width="500"
					height="500"
					class="object-cover rounded-lg overflow-hidden"
					:style="{ aspectRatio: '500/500', objectFit: 'cover' }"
				/>
			</PopoverContent>
		</Popover>
		<Popover>
			<PopoverTrigger asChild>
				<img
					src="https://placehold.co/600x400"
					alt="Gallery Image 2"
					width="300"
					height="300"
					class="object-cover w-full rounded-lg overflow-hidden"
					:style="{ aspectRatio: '300/300', objectFit: 'cover' }"
				/>
			</PopoverTrigger>
			<PopoverContent class="w-auto">
				<img
					src="https://placehold.co/600x400"
					alt="Gallery Image 2"
					width="500"
					height="500"
					class="object-cover rounded-lg overflow-hidden"
					:style="{ aspectRatio: '500/500', objectFit: 'cover' }"
				/>
			</PopoverContent>
		</Popover>
		<Popover>
			<PopoverTrigger asChild>
				<img
					src="https://placehold.co/600x400"
					alt="Gallery Image 3"
					width="300"
					height="300"
					class="object-cover w-full rounded-lg overflow-hidden"
					:style="{ aspectRatio: '300/300', objectFit: 'cover' }"
				/>
			</PopoverTrigger>
			<PopoverContent class="w-auto">
				<img
					src="https://placehold.co/600x400"
					alt="Gallery Image 3"
					width="500"
					height="500"
					class="object-cover rounded-lg overflow-hidden"
					:style="{ aspectRatio: '500/500', objectFit: 'cover' }"
				/>
			</PopoverContent>
		</Popover>
		<Popover>
			<PopoverTrigger asChild>
				<img
					src="https://placehold.co/600x400"
					alt="Gallery Image 4"
					width="300"
					height="300"
					class="object-cover w-full rounded-lg overflow-hidden"
					:style="{ aspectRatio: '300/300', objectFit: 'cover' }"
				/>
			</PopoverTrigger>
			<PopoverContent class="w-auto">
				<img
					src="https://placehold.co/600x400"
					alt="Gallery Image 4"
					width="500"
					height="500"
					class="object-cover rounded-lg overflow-hidden"
					:style="{ aspectRatio: '500/500', objectFit: 'cover' }"
				/>
			</PopoverContent>
		</Popover>
	</div>
</template>

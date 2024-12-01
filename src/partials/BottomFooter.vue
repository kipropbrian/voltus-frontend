<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Github, Twitter } from 'lucide-vue-next';
</script>

<template>
	<footer class="border-t bg-background">
		<div class="mx-auto max-w-7xl px-4 py-8 md:px-14">
			<div class="grid grid-cols-1 gap-8 md:grid-cols-4">
				<!-- Logo and Description -->
				<div class="flex flex-col gap-4">
					<div class="flex items-center gap-2">
						<img class="w-8 h-8" src="/facevector.webp" alt="face mesh" />
						<span class="text-lg font-semibold">FaceVector</span>
					</div>
					<p class="text-sm text-muted-foreground">
						Advanced facial recognition and analysis platform for security and research purposes.
					</p>
				</div>

				<!-- Quick Links -->
				<div class="space-y-3">
					<h3 class="text-sm font-semibold">Quick Links</h3>
					<ul class="space-y-2 text-sm">
						<li>
							<router-link to="/" class="text-muted-foreground hover:text-foreground">Home</router-link>
						</li>
						<li>
							<router-link to="/politicians" class="text-muted-foreground hover:text-foreground"
								>Politicians</router-link
							>
						</li>
						<li>
							<router-link to="/faceset" class="text-muted-foreground hover:text-foreground"
								>Face Sets</router-link
							>
						</li>
						<li>
							<a href="#" class="text-muted-foreground hover:text-foreground">Crime</a>
						</li>
					</ul>
				</div>

				<!-- Resources -->
				<div class="space-y-3">
					<h3 class="text-sm font-semibold">Resources</h3>
					<ul class="space-y-2 text-sm">
						<li>
							<a href="#" class="text-muted-foreground hover:text-foreground">Documentation</a>
						</li>
						<li>
							<a href="#" class="text-muted-foreground hover:text-foreground">API Reference</a>
						</li>
						<li>
							<a href="#" class="text-muted-foreground hover:text-foreground">Privacy Policy</a>
						</li>
						<li>
							<a href="#" class="text-muted-foreground hover:text-foreground">Terms of Service</a>
						</li>
					</ul>
				</div>

				<!-- Social -->
				<div class="space-y-3">
					<h3 class="text-sm font-semibold">Connect</h3>
					<div class="flex gap-4">
						<Button variant="ghost" size="icon">
							<Github class="h-5 w-5" />
							<span class="sr-only">GitHub</span>
						</Button>
						<Button variant="ghost" size="icon">
							<Twitter class="h-5 w-5" />
							<span class="sr-only">Twitter</span>
						</Button>
					</div>
				</div>
			</div>

			<!-- Bottom Bar -->
			<div class="mt-8 border-t pt-8">
				<div class="flex flex-col items-center justify-between gap-4 md:flex-row">
					<p class="text-sm text-muted-foreground">© 2024 FaceVector. All rights reserved.</p>
					<div class="flex items-center gap-4 text-sm text-muted-foreground">
						<a href="#" class="hover:text-foreground">Privacy</a>
						<a href="#" class="hover:text-foreground">Terms</a>
						<a href="#" class="hover:text-foreground">Contact</a>
					</div>
				</div>
			</div>
		</div>
	</footer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CircleUser, Menu, Search } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/authStore';
import { googleTokenLogin } from 'vue3-google-login';

// Replace with your Google OAuth client ID
const authStore = useAuthStore();
const user = computed(() => authStore.user);

const handleLogin = async () => {
	try {
		const googleResponse = await googleTokenLogin();
		await authStore.loginWithGoogle(googleResponse);
		// Handle successful login
	} catch (error) {
		console.error('Login failed:', error);
	}
};

const logout = () => {
	authStore.logout();
};
</script>

<template>
	<header class="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-14">
		<nav
			class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
		>
			<div class="flex shrink-0">
				<router-link to="/">
					<img class="w-8 h-8" src="/facevector.webp" alt="face mesh" />
				</router-link>
			</div>
			<router-link to="/" exact-active-class="border-b-2 border-sky-500">Home</router-link>
			<template v-if="authStore.isAuthenticated">
				<router-link to="/politicians" exact-active-class="border-b-2 border-sky-500">Politicians</router-link>
				<router-link to="/crimes" exact-active-class="border-b-2 border-sky-500">Crime</router-link>
			</template>
		</nav>
		<Sheet>
			<SheetTrigger as-child>
				<Button variant="outline" size="icon" class="shrink-0 md:hidden">
					<Menu class="h-5 w-5" />
					<span class="sr-only">Toggle navigation menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="left">
				<nav class="grid gap-6 text-lg font-medium">
					<div class="flex shrink-0">
						<router-link to="/">
							<img class="w-8 h-8" src="/facevector.webp" alt="face mesh" />
						</router-link>
					</div>
					<router-link to="/" exact-active-class="border-b-2 border-sky-500">Home</router-link>
					<a href="#" class="text-muted-foreground hover:text-foreground"> Politicians </a>
					<a href="#" class="text-muted-foreground hover:text-foreground"> Crimes </a>
				</nav>
			</SheetContent>
		</Sheet>
		<div class="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
			<form class="ml-auto flex-1 sm:flex-initial">
				<div class="relative">
					<Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input type="search" placeholder="Search ..." class="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]" />
				</div>
			</form>
			<!-- Dropdown for Logged-In Users -->
			<DropdownMenu v-if="user">
				<DropdownMenuTrigger as-child>
					<Button variant="secondary" size="icon" class="rounded-full">
						<CircleUser class="h-5 w-5" />
						<span class="sr-only">Toggle user menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>My Account</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem>Settings</DropdownMenuItem>
					<DropdownMenuItem>Support</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem @click="logout">Logout</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<!-- Dropdown for Logged-Out Users -->
			<DropdownMenu v-else>
				<DropdownMenuTrigger as-child>
					<Button variant="secondary" size="icon" class="rounded-full">
						<CircleUser class="h-5 w-5" />
						<span class="sr-only">Toggle user menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Guest</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<Button variant="outline" @click="handleLogin">Login Using Google</Button>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	</header>
</template>

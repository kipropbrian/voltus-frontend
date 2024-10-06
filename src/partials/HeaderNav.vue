<script setup></script>
<template>
	<header>
		<div class="flex p-2 h-24 shadow-lg items-center w-full text-black justify-between">
			<div class="flex justify-between items-center px-4 space-x-8 sm:-my-px sm:ml-10 sm:flex">
				<div class="flex shrink-0">
					<router-link to="/">
						<img class="w-20 h-20" src="/facevector.webp" alt="face mesh" />
					</router-link>
				</div>
				<nav class="flex h-16 px-4 py-2 items-center hover:bg-gray-100 hover:shadow-sm">
					<router-link to="/" exact-active-class="border-b-2 border-sky-500">Dashboard</router-link>
				</nav>
				<nav class="flex h-16 px-4 py-2 items-center hover:bg-gray-100 hover:shadow-sm">
					<router-link to="/politicians" exact-active-class="border-b-2 border-sky-500"
						>Politicians</router-link
					>
				</nav>
				<nav class="flex h-16 px-4 py-2 items-center hover:bg-gray-100 hover:shadow-sm">
					<router-link to="/faceset" exact-active-class="border-b-2 border-sky-500">Face sets</router-link>
				</nav>
			</div>
			<nav class="p-2 mr-16 rounded shadow bg-sky-300">
				<a class="flex text-base" href="#"> Sign Up</a>
			</nav>
		</div>
	</header>
</template>

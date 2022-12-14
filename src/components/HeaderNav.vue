<script setup></script>
<template>
	<header>
		<div class="flex p-2 h-24 shadow-lg items-center w-full text-black justify-between">
			<div class="flex justify-between items-center px-4 space-x-8 sm:-my-px sm:ml-10 sm:flex">
				<div class="flex shrink-0">
					<img class="w-20 h-20" src="/facevector.jpg" alt="face mesh" />
				</div>
				<nav class="flex h-16 hover:border-b-2  hover:border-sky-500 items-center">
					<router-link to="/">Dashboard</router-link>
				</nav>
				<nav class="flex h-16 hover:border-b-2 hover:border-sky-500 items-center">
					<router-link to="/politicians">Politicians</router-link>
				</nav>
			</div>
			<nav class="p-2 mr-16 rounded shadow bg-sky-300">
				<a class="flex text-base" href="#"> Sign Up</a>
			</nav>
		</div>
	</header>
</template>

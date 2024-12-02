# PeopleList.vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
	Pagination,
	PaginationEllipsis,
	PaginationFirst,
	PaginationLast,
	PaginationList,
	PaginationListItem,
	PaginationNext,
	PaginationPrev,
} from '@/components/ui/pagination';
import { Plus, Pencil, Trash2, Eye } from 'lucide-vue-next';

interface Person {
	id: number;
	name: string;
	gender: string;
}

// Dummy data
const people = ref<Person[]>([
	{ id: 1, name: 'John Doe', gender: 'Male' },
	{ id: 2, name: 'Jane Smith', gender: 'Female' },
	{ id: 3, name: 'Alex Johnson', gender: 'Male' },
	{ id: 4, name: 'Sarah Williams', gender: 'Female' },
	{ id: 5, name: 'Michael Brown', gender: 'Male' },
	{ id: 6, name: 'Emily Davis', gender: 'Female' },
	{ id: 7, name: 'James Wilson', gender: 'Male' },
	{ id: 8, name: 'Linda Martinez', gender: 'Female' },
	{ id: 9, name: 'Robert Taylor', gender: 'Male' },
	{ id: 10, name: 'Patricia Anderson', gender: 'Female' },
	{ id: 11, name: 'Thomas Moore', gender: 'Male' },
	{ id: 12, name: 'Jennifer Garcia', gender: 'Female' },
	{ id: 13, name: 'David Lee', gender: 'Male' },
	{ id: 14, name: 'Maria Rodriguez', gender: 'Female' },
	{ id: 15, name: 'Christopher White', gender: 'Male' },
]);

// Pagination
const currentPage = ref(1);
const itemsPerPage = 5;

const paginatedPeople = computed(() => {
	const start = (currentPage.value - 1) * itemsPerPage;
	const end = start + itemsPerPage;
	return people.value.slice(start, end);
});

// Actions
const handleView = (id: number) => {
	console.log('View person:', id);
};

const handleEdit = (id: number) => {
	console.log('Edit person:', id);
};

const handleDelete = (id: number) => {
	console.log('Delete person:', id);
};

const handleAddNew = () => {
	console.log('Add new person');
};
</script>

<template>
	<div class="mx-auto max-w-7xl px-4 py-8 md:px-14">
		<!-- Header Section -->
		<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
			<h1 class="text-2xl font-bold">People List</h1>
			<Button @click="handleAddNew" class="flex items-center gap-2">
				<Plus class="h-4 w-4" />
				Add New Person
			</Button>
		</div>

		<!-- Table Section -->
		<div class="overflow-hidden rounded-md">
			<div class="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead class="min-w-[200px]">Name</TableHead>
							<TableHead class="min-w-[120px]">Gender</TableHead>
							<TableHead class="min-w-[150px] text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow v-for="person in paginatedPeople" :key="person.id">
							<TableCell class="font-medium">{{ person.name }}</TableCell>
							<TableCell>{{ person.gender }}</TableCell>
							<TableCell class="text-right">
								<div class="flex justify-end gap-2">
									<Button
										variant="ghost"
										size="icon"
										@click="handleView(person.id)"
										class="hover:bg-muted"
									>
										<Eye class="h-4 w-4" />
										<span class="sr-only">View</span>
									</Button>
									<Button
										variant="ghost"
										size="icon"
										@click="handleEdit(person.id)"
										class="hover:bg-muted"
									>
										<Pencil class="h-4 w-4" />
										<span class="sr-only">Edit</span>
									</Button>
									<Button
										variant="ghost"
										size="icon"
										@click="handleDelete(person.id)"
										class="hover:bg-muted"
									>
										<Trash2 class="h-4 w-4" />
										<span class="sr-only">Delete</span>
									</Button>
								</div>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		</div>

		<!-- Pagination Section -->
		<div class="mt-4 flex justify-center">
			<Pagination
				v-slot="{ page }"
				:total="people.length"
				:per-page="itemsPerPage"
				:sibling-count="1"
				show-edges
				v-model:model-value="currentPage"
				class="overflow-x-auto py-2"
			>
				<PaginationList v-slot="{ items }" class="flex items-center gap-1">
					<PaginationFirst class="hidden sm:inline-flex" />
					<PaginationPrev />
					<template v-for="(item, index) in items">
						<PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
							<Button
								class="w-9 h-9 p-0"
								:variant="item.value === page ? 'default' : 'outline'"
								:aria-current="item.value === page"
							>
								{{ item.value }}
							</Button>
						</PaginationListItem>
						<PaginationEllipsis v-else :key="item.type" :index="index" class="hidden sm:inline-flex" />
					</template>
					<PaginationNext />
					<PaginationLast class="hidden sm:inline-flex" />
				</PaginationList>
			</Pagination>
		</div>
	</div>
</template>

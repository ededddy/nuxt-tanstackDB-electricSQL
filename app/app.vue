<script setup lang="ts">
import { useLiveQuery } from "@tanstack/vue-db";
import { todosCollection } from "~~/lib/collections";

onMounted(async () => {
    await todosCollection.preload();
});

const { data } = useLiveQuery(q =>
    q.from({ todos: todosCollection })
        .select(({ todos }) => ({
            id: todos.id,
            name: todos.name,
            description: todos.description,
        })),
);
</script>

<template>
    <div>
        <pre>
            {{ data }}
        </pre>
    </div>
</template>

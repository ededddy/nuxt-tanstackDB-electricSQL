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
            completed: todos.completed,
            created_at: todos.created_at,
            updated_at: todos.updated_at,
        })).orderBy(({ todos }) => todos.updated_at, "desc"),
);

const toggleComplete = async (todoId: number) => {
    const tx = todosCollection.update(todoId, (target) => {
        target.completed = !target.completed;
    });
    await tx.isPersisted.promise;
};

const deleteTodo = async (todoId: number) => {
    const tx = todosCollection.delete(todoId);
    await tx.isPersisted.promise;
};

const formatDate = (date: Date | string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};
</script>

<template>
    <div class="container">
        <header class="header">
            <div class="header-content">
                <div>
                    <h1 class="title">
                        Tasks
                    </h1>
                    <p class="subtitle">
                        Real-time synced with ElectricSQL
                    </p>
                </div>
                <NuxtLink
                    to="/add"
                    class="add-button"
                >
                    <span class="add-icon">+</span>
                    Add Task
                </NuxtLink>
            </div>
        </header>

        <div
            v-if="data && data.length > 0"
            class="todos-list"
        >
            <div
                v-for="todo in data"
                :key="todo.id"
                class="todo-card"
                :class="{ 'todo-completed': todo.completed }"
            >
                <div class="todo-main">
                    <div class="todo-content">
                        <h3 class="todo-name">
                            {{ todo.name }}
                        </h3>
                        <p
                            v-if="todo.description"
                            class="todo-description"
                        >
                            {{ todo.description }}
                        </p>
                    </div>
                    <div class="todo-actions">
                        <button
                            class="complete-toggle"
                            :class="{ 'is-completed': todo.completed }"
                            :aria-label="todo.completed ? 'Mark as incomplete' : 'Mark as complete'"
                            @click="toggleComplete(todo.id)"
                        >
                            <svg
                                v-if="todo.completed"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                class="check-icon"
                            >
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <svg
                                v-else
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                class="circle-icon"
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                />
                            </svg>
                        </button>
                        <button
                            class="delete-button"
                            aria-label="Delete todo"
                            @click="deleteTodo(todo.id)"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                class="delete-icon"
                            >
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="todo-meta">
                    <span
                        v-if="todo.createdAt"
                        class="meta-text"
                    >
                        {{ formatDate(todo.createdAt) }}
                    </span>
                </div>
            </div>
        </div>

        <div
            v-else
            class="empty-state"
        >
            <div class="empty-icon">
                ◯
            </div>
            <p class="empty-text">
                No tasks yet
            </p>
            <p class="empty-subtext">
                Tasks will appear here in real-time
            </p>
        </div>
    </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600&display=swap");

.container {
    min-height: 100vh;
    background: linear-gradient(135deg, #fef9f3 0%, #fdf6ed 100%);
    padding: 3rem 2rem;
    font-family: "Inter", -apple-system, sans-serif;
}

.header {
    max-width: 900px;
    margin: 0 auto 3rem;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
}

.header-content>div {
    flex: 1;
}

.add-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    background: #1a1a1a;
    color: #ffffff;
    text-decoration: none;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;
}

.add-button:hover {
    background: #333333;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(26, 26, 26, 0.15);
}

.add-icon {
    font-size: 1.2rem;
    line-height: 1;
}

.title {
    font-family: "Newsreader", Georgia, serif;
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 500;
    font-style: italic;
    color: #1a1a1a;
    margin: 0 0 0.5rem;
    letter-spacing: -0.02em;
    line-height: 1.1;
}

.subtitle {
    font-size: 0.9rem;
    font-weight: 500;
    color: #8b7355;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    margin: 0;
}

.todos-list {
    max-width: 900px;
    margin: 0 auto;
    display: grid;
    gap: 1rem;
}

.todo-card {
    background: #ffffff;
    border: 1px solid #e8ddd0;
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) backwards;
}

.todo-card:hover {
    border-color: #c9b896;
    box-shadow: 0 4px 20px rgba(26, 26, 26, 0.08);
    transform: translateY(-2px);
}

.todo-card:nth-child(1) {
    animation-delay: 0ms;
}

.todo-card:nth-child(2) {
    animation-delay: 50ms;
}

.todo-card:nth-child(3) {
    animation-delay: 100ms;
}

.todo-card:nth-child(4) {
    animation-delay: 150ms;
}

.todo-card:nth-child(n+5) {
    animation-delay: 200ms;
}

.todo-main {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
}

.todo-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.todo-content {
    flex: 1;
    margin-bottom: 0.75rem;
}

.todo-name {
    font-family: "Newsreader", Georgia, serif;
    font-size: 1.35rem;
    font-weight: 500;
    color: #1a1a1a;
    margin: 0 0 0.5rem;
    line-height: 1.3;
    transition: color 0.2s ease;
}

.todo-description {
    font-size: 0.95rem;
    color: #5a5a5a;
    line-height: 1.6;
    margin: 0;
    font-weight: 400;
    transition: color 0.2s ease;
}

.todo-completed .todo-name {
    color: #9a8a7a;
    text-decoration: line-through;
}

.todo-completed .todo-description {
    color: #b8a99a;
}

.complete-toggle {
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    padding: 0;
    background: #ffffff;
    border: 2px solid #e8ddd0;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    color: #c9b896;
}

.complete-toggle:hover {
    border-color: #8b7355;
    color: #8b7355;
    transform: scale(1.05);
}

.complete-toggle:active {
    transform: scale(0.95);
}

.complete-toggle.is-completed {
    background: #1a1a1a;
    border-color: #1a1a1a;
    color: #ffffff;
}

.complete-toggle.is-completed:hover {
    background: #333333;
    border-color: #333333;
}

.check-icon,
.circle-icon {
    width: 1rem;
    height: 1rem;
}

.delete-button {
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    padding: 0;
    background: #ffffff;
    border: 2px solid #e8ddd0;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    color: #c9b896;
    opacity: 0;
    transform: scale(0.9);
}

.todo-card:hover .delete-button {
    opacity: 1;
    transform: scale(1);
}

.delete-button:hover {
    border-color: #c44;
    color: #c44;
    background: #fff5f5;
}

.delete-button:active {
    transform: scale(0.9);
}

.delete-icon {
    width: 1rem;
    height: 1rem;
}

.todo-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid #f5efe7;
}

.meta-text {
    font-size: 0.8rem;
    font-weight: 500;
    color: #9a8a7a;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.empty-state {
    max-width: 900px;
    margin: 4rem auto;
    text-align: center;
    padding: 4rem 2rem;
    animation: fadeIn 0.6s ease-out;
}

.empty-icon {
    font-size: 4rem;
    color: #d4c4b0;
    margin-bottom: 1rem;
    opacity: 0.6;
}

.empty-text {
    font-family: "Newsreader", Georgia, serif;
    font-size: 1.5rem;
    font-weight: 500;
    font-style: italic;
    color: #1a1a1a;
    margin: 0 0 0.5rem;
}

.empty-subtext {
    font-size: 0.9rem;
    color: #8b7355;
    margin: 0;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(12px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}
</style>

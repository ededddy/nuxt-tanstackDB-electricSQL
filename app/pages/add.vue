<script setup lang="ts">
import { ref } from "vue";

const { $todoActions } = useNuxtApp();

const error = ref<string | null>();

const formData = ref({
    name: "",
    description: "",
});

const handleSubmit = async () => {
    console.log("Todo submitted:", formData.value);
    const todo = {
        id: (-Math.floor(Math.random() * 10000)) + 1,
        name: formData.value.name,
        description: formData.value.description,
        completed: false,
        created_at: new Date(),
        updated_at: new Date(),
    };
    try {
        if (typeof $todoActions.addTodo === `function`) {
            $todoActions.addTodo(todo);
        }
    }
    catch (err) {
        error.value = (err instanceof Error ? err.message : `Failed to toggle todo`);
    }

    navigateTo("/");
};

const handleCancel = () => {
    navigateTo("/");
};

const isFormValid = () => {
    return formData.value.name.trim().length > 0;
};
</script>

<template>
    <div class="container">
        <header class="header">
            <NuxtLink
                to="/"
                class="back-link"
            >
                <span class="back-arrow">←</span>
                Back to Tasks
            </NuxtLink>
        </header>

        <div class="form-header">
            <h1 class="title">
                New Task
            </h1>
            <p class="subtitle">
                Create a new task to track
            </p>
        </div>

        <form
            class="form"
            @submit.prevent="handleSubmit"
        >
            <div class="form-group">
                <label
                    for="name"
                    class="label"
                >Task Name</label>
                <input
                    id="name"
                    v-model="formData.name"
                    type="text"
                    class="input"
                    placeholder="What needs to be done?"
                    required
                >
            </div>

            <div class="form-group">
                <label
                    for="description"
                    class="label"
                >Description</label>
                <textarea
                    id="description"
                    v-model="formData.description"
                    class="textarea"
                    placeholder="Add more details about this task..."
                    rows="4"
                />
            </div>

            <div class="actions">
                <button
                    type="button"
                    class="button button-secondary"
                    @click="handleCancel"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    :disabled="!isFormValid()"
                    class="button button-primary"
                >
                    Create Task
                </button>
            </div>
        </form>
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
    max-width: 700px;
    margin: 0 auto 1rem;
}

.back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 0;
    color: #8b7355;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s ease;
}

.back-link:hover {
    color: #1a1a1a;
}

.back-arrow {
    font-size: 1.1rem;
    transition: transform 0.2s ease;
}

.back-link:hover .back-arrow {
    transform: translateX(-2px);
}

.form-header {
    max-width: 700px;
    margin: 0 auto 2rem;
    text-align: center;
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

.form-header .title {
    margin-bottom: 0.75rem;
}

.form-header .subtitle {
    font-size: 0.85rem;
}

.form {
    max-width: 700px;
    margin: 0 auto;
    background: #ffffff;
    border: 1px solid #e8ddd0;
    border-radius: 12px;
    padding: 2rem;
    animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-group {
    margin-bottom: 1.75rem;
}

.form-group:last-of-type {
    margin-bottom: 2.5rem;
}

.label {
    display: block;
    font-size: 0.85rem;
    font-weight: 600;
    color: #1a1a1a;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 0.6rem;
}

.input,
.textarea {
    width: 100%;
    padding: 0.85rem 1rem;
    font-family: "Inter", -apple-system, sans-serif;
    font-size: 1rem;
    color: #1a1a1a;
    background: #fdfbf7;
    border: 1px solid #e8ddd0;
    border-radius: 8px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    box-sizing: border-box;
}

.input::placeholder,
.textarea::placeholder {
    color: #b8a99a;
}

.input:hover,
.textarea:hover {
    border-color: #c9b896;
    background: #ffffff;
}

.input:focus,
.textarea:focus {
    outline: none;
    border-color: #8b7355;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(139, 115, 85, 0.1);
}

.textarea {
    resize: vertical;
    line-height: 1.6;
}

.actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}

.button {
    padding: 0.75rem 1.5rem;
    font-family: "Inter", -apple-system, sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border: none;
}

.button-primary {
    background: #1a1a1a;
    color: #ffffff;
}

.button-primary:hover:not(:disabled) {
    background: #333333;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(26, 26, 26, 0.15);
}

.button-primary:active:not(:disabled) {
    transform: translateY(0);
}

.button-primary:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.button-secondary {
    background: transparent;
    color: #8b7355;
    border: 1px solid #e8ddd0;
}

.button-secondary:hover {
    background: #fdfbf7;
    border-color: #c9b896;
    color: #1a1a1a;
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
</style>

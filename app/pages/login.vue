<script setup lang="ts">
import { authClient } from "~~/lib/auth-client";

const toast = useToast();
const loading = useState(() => false);
const errorMessage = useState(() => "");

const signInEmail = useState(() => "");
const signInPassword = useState(() => "");

const signUpEmail = useState(() => "");
const signUpPassword = useState(() => "");
const signUpName = useState(() => "");

const handleSignIn = async () => {
    loading.value = true;
    errorMessage.value = "";

    try {
        const { error } = await authClient.signIn.email({
            email: signInEmail.value,
            password: signInPassword.value,
        });

        if (error) {
            errorMessage.value = error.message || "Failed to sign in";
            toast.add({
                title: "Sign In Failed",
                description: errorMessage.value,
                color: "error",
            });
            return;
        }

        toast.add({
            title: "Welcome back!",
            description: "You've been signed in successfully",
            color: "info",
        });

        await navigateTo("/");
    }
    catch (e: unknown) {
        errorMessage.value = e instanceof Error ? e.message : "An unexpected error occurred";
        toast.add({
            title: "Sign In Failed",
            description: errorMessage.value,
            color: "error",
        });
    }
    finally {
        loading.value = false;
    }
};

const handleSignUp = async () => {
    loading.value = true;
    errorMessage.value = "";

    try {
        const { error } = await authClient.signUp.email({
            name: signUpName.value,
            email: signUpEmail.value,
            password: signUpPassword.value,
        });

        if (error) {
            errorMessage.value = error.message || "Failed to sign up";
            toast.add({
                title: "Sign Up Failed",
                description: errorMessage.value,
                color: "error",
            });
            return;
        }

        toast.add({
            title: "Account created!",
            description: "You've been signed in successfully",
            color: "info",
        });

        await navigateTo("/");
    }
    catch (e: unknown) {
        errorMessage.value = e instanceof Error ? e.message : "An unexpected error occurred";
        toast.add({
            title: "Sign Up Failed",
            description: errorMessage.value,
            color: "error",
        });
    }
    finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <UCard
            class="w-full max-w-md"
            :ui="{
                body: 'p-8',
                header: 'px-8 pt-8',
                footer: 'pb-8 px-8',
            }"
        >
            <template #header>
                <div class="text-center">
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">
                        Welcome
                    </h1>
                    <p class="text-gray-600">
                        Register or Sign In to continue
                    </p>
                </div>
            </template>

            <div class="space-y-6">
                <UTabs
                    :items="[
                        { key: 'signin', label: 'Sign In', slot: 'signInForm' },
                        { key: 'signup', label: 'Sign Up', slot: 'signUpForm' },
                    ]"
                >
                    <template #signInForm>
                        <!-- Sign In Form -->
                        <form
                            class="space-y-4 space-x-4"
                            @submit.prevent="handleSignIn"
                        >
                            <UFormGroup
                                label="Email"
                                required
                            >
                                <UInput
                                    v-model="signInEmail"
                                    type="email"
                                    placeholder="you@example.com"
                                    size="lg"
                                    :disabled="loading"
                                    autocomplete="email"
                                    required
                                />
                            </UFormGroup>
                            <UFormGroup
                                label="Password"
                                required
                            >
                                <UInput
                                    v-model="signInPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    size="lg"
                                    :disabled="loading"
                                    autocomplete="current-password"
                                    minlength="8"
                                    required
                                />
                            </UFormGroup>

                            <UAlert
                                v-if="errorMessage"
                                icon="i-heroicons-exclamation-triangle"
                                color="error"
                                variant="soft"
                                :title="errorMessage"
                            />

                            <UButton
                                type="submit"
                                color="primary"
                                size="lg"
                                block
                                :loading="loading"
                                :disabled="loading"
                            >
                                Sign In
                            </UButton>
                        </form>
                    </template>

                    <template #signUpForm>
                        <!-- Sign Up Form -->
                        <form
                            class="space-y-4 space-x-4"
                            @submit.prevent="handleSignUp"
                        >
                            <UFormGroup
                                label="Name"
                                required
                            >
                                <UInput
                                    v-model="signUpName"
                                    type="text"
                                    placeholder="your-name"
                                    size="lg"
                                    :disabled="loading"
                                    autocomplete="text"
                                    required
                                />
                            </UFormGroup>
                            <UFormGroup
                                label="Email"
                                required
                            >
                                <UInput
                                    v-model="signUpEmail"
                                    type="email"
                                    placeholder="you@example.com"
                                    size="lg"
                                    :disabled="loading"
                                    autocomplete="email"
                                    required
                                />
                            </UFormGroup>

                            <UFormGroup
                                label="Password"
                                required
                            >
                                <UInput
                                    v-model="signUpPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    size="lg"
                                    :disabled="loading"
                                    autocomplete="new-password"
                                    minlength="8"
                                    required
                                />
                            </UFormGroup>

                            <UAlert
                                v-if="errorMessage"
                                icon="i-heroicons-exclamation-triangle"
                                color="error"
                                variant="soft"
                                :title="errorMessage"
                            />

                            <UButton
                                type="submit"
                                color="primary"
                                size="lg"
                                block
                                :loading="loading"
                                :disabled="loading"
                            >
                                Create Account
                            </UButton>
                        </form>
                    </template>
                </UTabs>
            </div>
        </UCard>
    </div>
</template>

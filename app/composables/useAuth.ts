import { authClient } from "~/lib/auth-client";

export const useAuth = () => {
    const session = ref(null);
    const loading = ref(true);

    const fetchSession = async () => {
        loading.value = true;
        try {
            const response = await authClient.getSession();
            session.value = response.data;
        }
        catch (error) {
            console.error("Failed to fetch session:", error);
            session.value = null;
        }
        finally {
            loading.value = false;
        }
    };

    onMounted(() => {
        fetchSession();
    });

    return {
        session,
        loading,
        fetchSession,
    };
};

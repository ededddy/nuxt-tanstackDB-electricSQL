import type { SelectTodo } from "./db/validation";

export const api = {
    todos: {
        getAll: async (): Promise<SelectTodo[]> => {
            const response = await fetch(`/api/todos`);
            if (!response.ok)
                throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        },
        getById: async (id: number): Promise<SelectTodo> => {
            const response = await fetch(`/api/todos/${id}`);
            if (!response.ok)
                throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        },
        create: async (todo: Partial<SelectTodo>): Promise<{ todo: SelectTodo; txid: number }> => {
            const response = await fetch("/api/todos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(todo),
            });
            if (!response.ok)
                throw new Error(`HTTP Error! Status: ${response.status}`);
            return response.json();
        },
        update: async (
            id: unknown,
            changes: Partial<SelectTodo>,
        ): Promise<{ todo: SelectTodo; txid: number }> => {
            const response = await fetch(`/api/todos/${id}`, {
                method: `PUT`,
                headers: { "Content-Type": `application/json` },
                body: JSON.stringify(changes),
            });
            if (!response.ok)
                throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        },
        delete: async (
            id: unknown,
        ): Promise<{ success: boolean; txid: number }> => {
            const response = await fetch(`/api/todos/${id}`, {
                method: `DELETE`,
            });
            if (!response.ok)
                throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        },
    },
};

export default api;

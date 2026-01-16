import type { SelectTodo } from "./db/validation";

export const api = {
    todos: {
        getAll: async (idempotencyKey?: string): Promise<SelectTodo[]> => {
            let headers = {};
            if (idempotencyKey)
                headers = Object.assign(headers, { "Idempotency-Key": idempotencyKey });

            const response = await fetch(`/api/todos`, {
                method: "GET",
                headers,
            });
            if (!response.ok)
                throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        },
        getById: async (id: number, idempotencyKey?: string): Promise<SelectTodo> => {
            let headers = {};
            if (idempotencyKey)
                headers = Object.assign(headers, { "Idempotency-Key": idempotencyKey });

            const response = await fetch(`/api/todos/${id}`, {
                method: "GET",
                headers,
            });
            if (!response.ok)
                throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        },
        create: async (todo: Partial<SelectTodo>, idempotencyKey?: string): Promise<{ todo: SelectTodo; txid: number }> => {
            let headers = {
                "Content-Type": "application/json",
            };
            if (idempotencyKey)
                headers = Object.assign(headers, { "Idempotency-Key": idempotencyKey });

            const response = await fetch("/api/todos", {
                method: "POST",
                headers,
                body: JSON.stringify(todo),
            });
            if (!response.ok)
                throw new Error(`HTTP Error! Status: ${response.status}`);
            return response.json();
        },
        update: async (
            id: unknown,
            changes: Partial<SelectTodo>,
            idempotencyKey?: string,
        ): Promise<{ todo: SelectTodo; txid: number }> => {
            let headers = {
                "Content-Type": "application/json",
            };
            if (idempotencyKey)
                headers = Object.assign(headers, { "Idempotency-Key": idempotencyKey });

            const response = await fetch(`/api/todos/${id}`, {
                method: `PUT`,
                headers,
                body: JSON.stringify(changes),
            });
            if (!response.ok)
                throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        },
        delete: async (
            id: unknown,
            idempotencyKey?: string,
        ): Promise<{ success: boolean; txid: number }> => {
            let headers = {
                "Content-Type": "application/json",
            };
            if (idempotencyKey)
                headers = Object.assign(headers, { "Idempotency-Key": idempotencyKey });

            const response = await fetch(`/api/todos/${id}`, {
                method: `DELETE`,
                headers,
            });
            if (!response.ok)
                throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        },
    },
};

export default api;

import type { OfflineExecutor } from "@tanstack/offline-transactions";
import { IndexedDBAdapter, startOfflineExecutor } from "@tanstack/offline-transactions";
import { todosCollection } from "./collections";
import type { PendingMutation } from "@tanstack/vue-db";
import api from "./api";

// NOTE: this thing being called multiple times. wtf
let syncCallCount = 0;
const offlineCompatibleAPI = {
    async sync({
        transaction,
        idempotencyKey,
    }: {
        transaction: { mutations: Array<PendingMutation> };
        idempotencyKey: string;
    }) {
        const callNum = ++syncCallCount;
        console.log(`[SYNC #${callNum}] Called with`, {
            mutations: transaction.mutations.length,
            idempotencyKey,
            timestamp: Date.now(),
        });
        const mutations = transaction.mutations;
        console.log(`sync todos`, mutations[0].changes, mutations[0].original);
        const txid = [];
        for (const mutation of mutations) {
            try {
                switch (mutation.type) {
                    case `insert`: {
                        const todoData = mutation.modified;
                        const response = await api.todos.create(todoData, idempotencyKey);

                        if (!response)
                            throw new Error("Failed to sync insert");

                        txid.push(response.txid);
                        break;
                    }
                    case `delete`: {
                        const { original } = mutation;
                        const response = await api.todos.delete(original.id, idempotencyKey);

                        if (!response)
                            throw new Error("Failed to sync insert");

                        txid.push(response.txid);

                        break;
                    }
                    case `update`: {
                        const { original, changes: todoData } = mutation;
                        if (!(`id` in original)) {
                            throw new Error(`Original todo not found for update`);
                        }
                        const response = await api.todos.update(original.id, todoData, idempotencyKey);
                        txid.push(response.txid);

                        if (!response)
                            throw new Error("Failed to sync insert");

                        break;
                    }
                }
            }
            catch (error) {
                console.error(`Sync error for mutation:`, mutation, error);
                throw error;
            }
        }

        const start = performance.now();
        console.time(`refresh collection ${start}`);

        // NOTE: comment this thing out, we are not using query collection
        // we do not need manual refetch, our Electric SQL will handle that for us

        /* culprit
         * await todosCollection.utils.refetch();
         */

        console.timeEnd(`refresh collection ${start}`);
        return { txid };
    },
};

export async function createIndexedDBOfflineExecutor() {
    console.log("[OFFLINE] Creating executor instance");
    const executor = startOfflineExecutor({
        collections: {
            todos: todosCollection,
        },
        storage: new IndexedDBAdapter(`offline-todos-indexeddb`, `transactions`),
        mutationFns: {
            syncTodos: offlineCompatibleAPI.sync,
        },
        onLeadershipChange: (isLeader) => {
            if (!isLeader) {
                console.warn("Running in online-only mode (another tab is the leader)");
            }
        },
        onStorageFailure: (diagnostic) => {
            console.warn(
                `Storage initialization failed - running in online-only mode:`,
                {
                    code: diagnostic.code,
                    message: diagnostic.message,
                    error: diagnostic.error,
                },
            );
        },
    });

    // Log diagnostic information
    console.log(`[OFFLINE] executor created. mode:`, executor.mode);
    console.log(`Storage diagnostic:`, executor.storageDiagnostic);

    return executor;
}

export function createOfflineActions(offline: OfflineExecutor) {
    const addTodoAction = offline.createOfflineAction({
        mutationFnName: `syncTodos`,
        onMutate: ({ name, description }: { name: string; description: string | null }) => {
            const newTodo = {
                id: (-Math.floor(Math.random() * 10000)) + 1,
                name: name,
                description: description,
                completed: false,
                version: 0,
                created_at: new Date(),
                updated_at: new Date(),
            };
            todosCollection.insert(newTodo);
            return newTodo;
        },
    });

    const toggleTodoAction = offline.createOfflineAction({
        mutationFnName: `syncTodos`,
        onMutate: (id: number) => {
            const todo = todosCollection.get(id);
            if (!todo) return;
            todosCollection.update(id, (draft) => {
                draft.completed = !todo.completed;
            });
            return todo;
        },
    });

    const deleteTodoAction = offline.createOfflineAction({
        mutationFnName: `syncTodos`,
        onMutate: (id: number) => {
            const todo = todosCollection.get(id);
            if (todo) {
                todosCollection.delete(id);
            };
            return todo;
        },
    });

    return {
        addTodo: addTodoAction,
        toggleTodo: toggleTodoAction,
        deleteTodo: deleteTodoAction,
    };
}

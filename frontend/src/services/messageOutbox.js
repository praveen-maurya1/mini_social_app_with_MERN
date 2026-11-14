import API from "./api";
import { sendMessageViaSocket } from "./socket";
const DB_NAME = "cache_message_outbox";
const STORE_NAME = "pending_messages";
const DB_VERSION = 1;

let dbPromise = null;
let flushing = false;

const openDB = () => {
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;

            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, {
                    keyPath: "clientMessageId"
                });

                store.createIndex("userId", "userId", {
                    unique: false
                });

                store.createIndex("conversationId", "conversationId", {
                    unique: false
                });
            }
        };

        request.onsuccess = () => {
            const db = request.result;

            db.onversionchange = () => {
                db.close();
                dbPromise = null;
            };

            resolve(db);
        };

        request.onerror = () => {
            dbPromise = null;
            reject(request.error);
        };
    });

    return dbPromise;
};

const runTransaction = async (mode, callback) => {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, mode);
        const store = transaction.objectStore(STORE_NAME);

        let result;

        transaction.oncomplete = () => resolve(result);
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(transaction.error);

        try {
            result = callback(store);
        } catch (error) {
            transaction.abort();
            reject(error);
        }
    });
};

export const savePendingMessage = async (message) => {
    await runTransaction("readwrite", (store) => {
        store.put({
            ...message,
            queuedAt: message.queuedAt || Date.now(),
            attempts: message.attempts || 0,
            status: message.status || "queued"
        });
    });

    window.dispatchEvent(new Event("outbox:updated"));
};

export const getPendingMessages = async (userId, conversationId) => {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const index = store.index("userId");
        const request = index.getAll(userId);

        request.onsuccess = () => {
            let results = request.result;

            if (conversationId) {
                results = results.filter(
                    item => item.conversationId === conversationId
                );
            }

            results.sort((a, b) => a.queuedAt - b.queuedAt);

            resolve(results);
        };

        request.onerror = () => reject(request.error);
    });
};

export const deletePendingMessage = async (clientMessageId) => {
    await runTransaction("readwrite", (store) => {
        store.delete(clientMessageId);
    });

    window.dispatchEvent(new Event("outbox:updated"));
};

export const updatePendingMessage = async (clientMessageId, updates) => {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(clientMessageId);

        let found = false;

        request.onsuccess = () => {
            if (!request.result) return;

            found = true;

            store.put({
                ...request.result,
                ...updates
            });
        };

        transaction.oncomplete = () => {
            window.dispatchEvent(new Event("outbox:updated"));
            resolve(found);
        };

        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(transaction.error);
    });
};

// Send pending messages for the authenticated user


export const flushMessageOutbox = async (userId) => {
    if (!userId || flushing || !navigator.onLine) return;

    flushing = true;

    try {
        const pending = await getPendingMessages(userId);

        // Process messages in queue order
        for (const item of pending) {
            if (item.status !== "queued") continue;

            if (!navigator.onLine) break;

            const payload = {
                text: item.text,
                clientMessageId: item.clientMessageId
            };

            // Socket.IO and REST API run simultaneously
            const results = await Promise.allSettled([
                sendMessageViaSocket({
                    conversationId: item.conversationId,
                    ...payload
                }),

                API.post(
                    `/messages/${item.conversationId}`,
                    payload
                )
            ]);

            const successfulResult = results.find(
                result => result.status === "fulfilled"
            );

            if (successfulResult) {
                const responseData =
                    successfulResult.value.message ||
                    successfulResult.value.data?.data;

                window.dispatchEvent(
                    new CustomEvent("outbox:sent", {
                        detail: {
                            clientMessageId: item.clientMessageId,
                            message: responseData
                        }
                    })
                );

                await deletePendingMessage(item.clientMessageId);

                continue;
            }

            // Both transports failed
            const errors = results
                .filter(result => result.status === "rejected")
                .map(result => result.reason);

            const permanentFailure = errors.every(error => {
                const status = error.response?.status || error.status;

                return (
                    status >= 400 &&
                    status < 500 &&
                    status !== 408 &&
                    status !== 429
                );
            });

            const updates = {
                status: permanentFailure ? "failed" : "queued",
                lastError: errors
                    .map(error => error.message)
                    .join(" | "),
                attempts: (item.attempts || 0) + 1,
                lastAttemptAt: Date.now()
            };

            await updatePendingMessage(
                item.clientMessageId,
                updates
            );

            window.dispatchEvent(
                new CustomEvent("outbox:failed", {
                    detail: {
                        clientMessageId: item.clientMessageId,
                        ...updates
                    }
                })
            );

            // Preserve order; stop until this message is retried
            break;
        }

    } catch (error) {
        console.error("Outbox sync error:", error);

    } finally {
        flushing = false;
    }
};


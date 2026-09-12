const processedKeys = new Map();

export const idempotencyManager = {
  check(key) {
    if (!key) return null;
    return processedKeys.get(key) || null;
  },

  record(key, result) {
    if (!key) return;
    processedKeys.set(key, {
      result,
      timestamp: new Date().toISOString(),
    });
  },

  clear() {
    processedKeys.clear();
  },
};

export default idempotencyManager;

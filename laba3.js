function memoize(fn, options = {}) {
  const cache = new Map();
  const maxSize = options.maxSize || Infinity;

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      const entry = cache.get(key);
      cache.delete(key);
      cache.set(key, entry);
      return entry.result;
    }

    const result = fn(...args);
    cache.set(key, { result });

    if (cache.size > maxSize) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }

    return result;
  };
}
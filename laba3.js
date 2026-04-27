function memoize(fn, options = {}) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}const {
    maxSize = Infinity,
  } = options;
  function evict() {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }
    if (cache.size > maxSize) {
      evict();
    }
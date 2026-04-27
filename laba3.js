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
    strategy = 'lru',
      if (strategy === 'lru') {
        cache.delete(key);
        cache.set(key, entry);
      }
      // В return function (...args), при збереженні (cache.set):
    cache.set(key, {
      // ...
      accessCount: 1, 
    });
    entry.accessCount += 1;):
    if (strategy === 'lfu') {
      let minFreq = Infinity;
      let lfuKey = null;
      for (const [k, v] of cache.entries()) {
        if (v.accessCount < minFreq) {
          minFreq = v.accessCount;
          lfuKey = k;
        }
      }
      if (lfuKey !== null) cache.delete(lfuKey);
      return;
    }
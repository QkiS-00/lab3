
function memoize(fn, options = {}) {
  const { maxSize = Infinity, strategy = 'lru', ttl = 0, customEvict = null } = options;
  const cache = new Map();

  function evict() {
    if (strategy === 'custom' && typeof customEvict === 'function') {
      customEvict(cache);
      return;
    }

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

    if (strategy === 'time') {
      const now = Date.now();
      for (const [k, v] of cache.entries()) {
        if (ttl > 0 && now - v.timestamp > ttl) {
          cache.delete(k);
        }
      }
      if (cache.size > maxSize) {
        const oldestKey = cache.keys().next().value;
        cache.delete(oldestKey);
      }
      return;
    }

    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }

  return function(...args) {
    const key = JSON.stringify(args);
    const now = Date.now();

    if (cache.has(key)) {
      const entry = cache.get(key);

      if (strategy === 'time' && ttl > 0 && now - entry.timestamp > ttl) {
        cache.delete(key);
      } else {
        entry.lastAccessed = now;
        entry.accessCount += 1;

        if (strategy === 'lru') {
          cache.delete(key);
          cache.set(key, entry);
        }

        return entry.result;
      }
    }

    const result = fn(...args);
    cache.set(key, {
      result,
      timestamp: now,
      lastAccessed: now,
      accessCount: 1,
    });

    if (cache.size > maxSize) {
      evict();
    }

    return result;
  };
}if (cache.size > 0) {
  const oldestKey = cache.keys().next().value;
  cache.delete(oldestKey);
}
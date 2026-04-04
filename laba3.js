function memoize(fn, options = {}) {
  const cache = new Map();
  const {
    maxSize = Infinity,
    strategy = 'lru',
    ttl = 0,
    customEvict = null,
  } = options;

  return function (...args) {
    const key = JSON.stringify(args);
    const now = Date.now();

    if (strategy === 'time' && ttl > 0 && cache.has(key)) {
      const entry = cache.get(key);
      if (now - entry.timestamp > ttl) {
        cache.delete(key);
      }
    }

    if (cache.has(key)) {
      const entry = cache.get(key);
      entry.accessCount += 1;
      entry.lastAccessed = now;

      if (strategy === 'lru') {
        cache.delete(key);
        cache.set(key, entry);
      }
      return entry.result;
    }

    const result = fn(...args);
    
    cache.set(key, {
      result,
      timestamp: now,
      lastAccessed: now,
      accessCount: 1,
    });

    if (cache.size > maxSize) {
      if (strategy === 'custom' && typeof customEvict === 'function') {
        customEvict(cache);
      } else if (strategy === 'lfu') {
        let minFreq = Infinity;
        let lfuKey = null;
        
        for (const [k, v] of cache.entries()) {
          if (v.accessCount < minFreq) {
            minFreq = v.accessCount;
            lfuKey = k;
          }
        }
        
        if (lfuKey) cache.delete(lfuKey);
      } else if (strategy === 'time') {
        let oldestTime = Infinity;
        let oldestKey = null;
        
        for (const [k, v] of cache.entries()) {
          if (v.timestamp < oldestTime) {
            oldestTime = v.timestamp;
            oldestKey = k;
          }
        }
        
        if (oldestKey) cache.delete(oldestKey);
      } else {
        const oldestKey = cache.keys().next().value;
        cache.delete(oldestKey);
      }
    }

    return result;
  };
}
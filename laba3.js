function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);

    return result;
  };
}const {
  maxSize = Infinity
} = options;

if (cache.size > maxSize) {
  const oldestKey = cache.keys().next().value;
  cache.delete(oldestKey);
}const {
  strategy = 'lru'
} = options;

if (cache.has(key)) {
  const value = cache.get(key);

  if (strategy === 'lru') {
    cache.delete(key);
    cache.set(key, value);
  }

  return value;
}function evict() {
  if (strategy === 'lfu') {
    let minFreq = Infinity;
    let lfuKey = null;

    for (const [k, v] of cache.entries()) {
      if (v.accessCount < minFreq) {
        minFreq = v.accessCount;
        lfuKey = k;
      }
    }

    if (lfuKey !== null) {
      cache.delete(lfuKey);
    }

    return;
  }
}

cache.set(key, {
  result,
  accessCount: 1
});

entry.accessCount += 1;const {
  ttl = 0
} = options;

const now = Date.now();

if (
  strategy === 'time' &&
  ttl > 0 &&
  now - entry.timestamp > ttl
) {
  cache.delete(key);
}

cache.set(key, {
  result,
  timestamp: now,
  accessCount: 1
});const {
  customEvict = null
} = options;

if (
  strategy === 'custom' &&
  typeof customEvict === 'function'
) {
  customEvict(cache);
  return;
}
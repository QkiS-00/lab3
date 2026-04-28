// demo3.js
const slowAdd = (a, b) => a + b;

// LRU
const lruMemo = memoize(slowAdd, { maxSize: 3, strategy: 'lru' });
lruMemo(1, 2);
lruMemo(3, 4);
lruMemo(5, 6);
lruMemo(1, 2); // оновлює позицію в LRU
lruMemo(7, 8); // витісняє (3,4)
console.log('LRU:', lruMemo(3, 4)); // рахується заново

// LFU
const lfuMemo = memoize(slowAdd, { maxSize: 3, strategy: 'lfu' });
lfuMemo(1, 2);
lfuMemo(1, 2); // accessCount=2
lfuMemo(3, 4); // accessCount=1
lfuMemo(5, 6); // accessCount=1
lfuMemo(7, 8); // витісняє (3,4) або (5,6)
console.log('LFU done');

// TTL
const ttlMemo = memoize(slowAdd, { strategy: 'time', ttl: 100 });
ttlMemo(1, 2);
console.log('TTL hit:', ttlMemo(1, 2));
setTimeout(() => {
  console.log('TTL expired, recompute:', ttlMemo(1, 2));
}, 200);

// Custom
const customMemo = memoize(slowAdd, {
  maxSize: 2,
  strategy: 'custom',
  customEvict: (cache) => {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
    console.log('Custom evict triggered');
  },
});
customMemo(1, 2);
customMemo(3, 4);
customMemo(5, 6);
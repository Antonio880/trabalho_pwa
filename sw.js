const CACHE_NOME = 'catalogo-v1';
const RECURSOS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json'
];

self.addEventListener('install', function (evento) {
  evento.waitUntil(
    caches.open(CACHE_NOME).then(function (cache) {
      return cache.addAll(RECURSOS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (evento) {
  evento.waitUntil(
    caches.keys().then(function (chaves) {
      return Promise.all(
        chaves
          .filter(function (chave) {
            return chave !== CACHE_NOME;
          })
          .map(function (chave) {
            return caches.delete(chave);
          })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (evento) {
  evento.respondWith(
    caches.match(evento.request).then(function (respostaCache) {
      return respostaCache || fetch(evento.request);
    })
  );
});

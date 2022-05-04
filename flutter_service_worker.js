'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "99914b932bd37a50b983c5e7c90ae93b",
"assets/FontManifest.json": "7b2a36307916a9721811788013e65289",
"assets/fonts/MaterialIcons-Regular.otf": "7e7a6cccddf6d7b20012a548461d5d81",
"assets/NOTICES": "1e81fe3c7dfc2de3b774093b8efa3633",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"fcm/.git/COMMIT_EDITMSG": "d778d8b1f42d0dd1bb284e5ca9549187",
"fcm/.git/config": "7f296379689e077f69c4f8e73230cc4c",
"fcm/.git/description": "92dfb591fa381b9ed2a83711b9e9d392",
"fcm/.git/FETCH_HEAD": "b2f27d66397bcafd5dc56efed155e5b6",
"fcm/.git/HEAD": "cf7dd3ce51958c5f13fece957cc417fb",
"fcm/.git/hooks/applypatch-msg.sample": "ce562e08d8098926a3862fc6e7905199",
"fcm/.git/hooks/commit-msg.sample": "579a3c1e12a1e74a98169175fb913012",
"fcm/.git/hooks/fsmonitor-watchman.sample": "ea587b0fae70333bce92257152996e70",
"fcm/.git/hooks/post-update.sample": "2b7ea5cee3c49ff53d41e00785eb974c",
"fcm/.git/hooks/pre-applypatch.sample": "054f9ffb8bfe04a599751cc757226dda",
"fcm/.git/hooks/pre-commit.sample": "305eadbbcd6f6d2567e033ad12aabbc4",
"fcm/.git/hooks/pre-merge-commit.sample": "39cb268e2a85d436b9eb6f47614c3cbc",
"fcm/.git/hooks/pre-push.sample": "2c642152299a94e05ea26eae11993b13",
"fcm/.git/hooks/pre-rebase.sample": "56e45f2bcbc8226d2b4200f7c46371bf",
"fcm/.git/hooks/pre-receive.sample": "2ad18ec82c20af7b5926ed9cea6aeedd",
"fcm/.git/hooks/prepare-commit-msg.sample": "2b5c047bdb474555e1787db32b2d2fc5",
"fcm/.git/hooks/push-to-checkout.sample": "c7ab00c7784efeadad3ae9b228d4b4db",
"fcm/.git/hooks/update.sample": "647ae13c682f7827c22f5fc08a03674e",
"fcm/.git/index": "5f2fa88f3884b295f3fc53cfeb57bb4d",
"fcm/.git/info/exclude": "036208b4a1ab4a235d75c181e685e5a3",
"fcm/.git/logs/HEAD": "4fd1fc9ad3a96d51c0b2983ff6465fe9",
"fcm/.git/logs/refs/heads/main": "4fd1fc9ad3a96d51c0b2983ff6465fe9",
"fcm/.git/logs/refs/remotes/origin/main": "00ba066e7e4e9ae5b8702869851b2f37",
"fcm/.git/objects/54/112aec472aa986e591d16df8d9248a7d3561cb": "8129914ee981a71059ab028998481ff7",
"fcm/.git/objects/65/5b7e9c32eec3edcbf1afa03ed8acad7b9756dd": "4d625711841b59e80a5e97b5127ec0d3",
"fcm/.git/objects/94/0e3d4f531781ada01a1e3308c727f6aac672d9": "ff5c211b24f81953b9d4a4fef0a0cd4f",
"fcm/.git/objects/df/e0770424b2a19faf507a501ebfc23be8f54e7b": "76f8baefc49c326b504db7bf751c967d",
"fcm/.git/refs/heads/main": "6c1858e0044398a2f757df55a727c7df",
"fcm/.git/refs/remotes/origin/main": "6c1858e0044398a2f757df55a727c7df",
"fcm/README.md": "7bc82f61c4ea4a8c2c7bd523f69485ad",
"firebase-messaging-sw.js": "57619ef427cdbef54432e708e6bcb149",
"index.html": "36fb87192bb1ac5b3096564114b08941",
"/": "36fb87192bb1ac5b3096564114b08941",
"main.dart.js": "dd4c69962f7ec2b2c1e2cbc27401571d",
"version.json": "2f7667db7bd0bb90d7753ba732642f5e"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}

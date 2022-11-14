let collectin_name =  "TractMe"
const assets = ["./", "./main.js", "./style.css", "./Sparrow.png", "./editMode.html","./edit.js",
"./import-export/import-export.css", "./import-export/import-export.html", "./import-export/import-export.js",
"./analytics/analytics.html", "./analytics/app.js", "./analytics/style.css", 
"./analytics/subjects.json", "./analytics/suggest_operation.js", "./analytics/suggest.js"]

self.addEventListener("install", e => {
    e.waitUntil(
        caches.open(collectin_name).then(cache => {
            return cache.addAll(assets);
        })
    );
});
  
self.addEventListener("fetch", e => {
  
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request);
        })
    );
  
});

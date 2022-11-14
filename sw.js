self.addEventListener("install", e => {
    e.waitUntil(
        caches.open("TractIt").then(cache => {
            return cache.addAll(["./", "./main.js", "./style.css", "./Sparrow.png", "./editMode.html","./edit.js",
            "./contact-us/contact.html", "./contact-us/otherstyle.css", 
            "./import-export/import-export.css", "./import-export/import-export.html", "./import-export/import-export.js", 
            "./analytics/style.css", "./analytics/subjects.json", "./analytics/app.js", 
            "./analytics/analytics.html", "./analytics/suggest.js", "./analytics/suggest_operation.js"]);
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

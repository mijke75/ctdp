const version = "0.10.15";
const designProcessTool = "dpt-v" + version;
const assets = [
  "/",
  "/index.html",
  "/tool.html",
  "/assets/fontawesome-5.15.3-all.css",
  "/assets/jquery-3.6.0.min.js",
  "/assets/jquery-ui-1.13.0.min.js",
  "/assets/jquery.ui.touch-punch.min.js",
  "/css/fabicon.css",
  "/css/menu.css",
  "/css/mobile.css",
  "/css/modal.css",
  "/css/phase.css",
  "/css/root.css",
  "/css/start.css",
  "/css/style.css",
  "/css/tabs.css",
  "/css/toast.css",
  "/css/tool.css",
  "/data/dotframework.json",
  "data/methodology.json",
  "/images/dotframework/dotframework0.png",
  "/images/dotframework/dotframework1.png",
  "/images/dotframework/dotframework2.png",
  "/images/dotframework/dotframework3.png",
  "/images/dotframework/dotframework4.png",
  "/images/methodology/ctdp.png",
  "/images/methodology/dd.png",
  "/images/methodology/dt.png",
  "/images/methodology/edp.png",
  "/images/methodology/hcd.png",
  "/images/select.png",
  "/js/app.object.js",
  "/js/init.js",
  "/js/item.object.js",
  "/js/items.object.js",
  "/js/modal.object.js",
  "/js/options.js",
  "/js/phase.object.js",
  "/js/phases.object.js",
  "/js/stage.object.js",
  "/js/stages.object.js",
  "/js/start.js",
  "/js/toast.js",
  "/webfonts/fa-brands-400.eot",
  "/webfonts/fa-brands-400.svg",
  "/webfonts/fa-brands-400.ttf",
  "/webfonts/fa-brands-400.woff",
  "/webfonts/fa-brands-400.woff2",
  "/webfonts/fa-regular-400.eot",
  "/webfonts/fa-regular-400.svg",
  "/webfonts/fa-regular-400.ttf",
  "/webfonts/fa-regular-400.woff",
  "/webfonts/fa-regular-400.woff2",
  "/webfonts/fa-solid-900.eot",
  "/webfonts/fa-solid-900.svg",
  "/webfonts/fa-solid-900.ttf",
  "/webfonts/fa-solid-900.woff",
  "/webfonts/fa-solid-900.woff2"
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(designProcessTool).then(cache => {
      cache.addAll(assets)
    })
  )
});

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request)
    })
  )
});


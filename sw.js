//imports para mandar a llmar el archivo 
importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v3';   //aca se tiene el index y si se modifica se va a cmbiar a static v2 
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    //'/',          //se debe quitar en desarrollo
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

self.addEventListener('install', e =>{
    const cacheStatic = caches.open(STATIC_CACHE).then(cache=>
        cache.addAll(APP_SHELL));
    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache=>
        cache.addAll(APP_SHELL_INMUTABLE));

    e.waitUntil(Promise.all([cacheStatic,cacheInmutable]));
});
//borra los caches viejas //nos alista las caches
self.addEventListener('activate',e=>{
    const respuesta=caches.keys().then(keys=>{  
        keys.forEach(key=>{
            if(key!= STATIC_CACHE && key.includes('static')){      //si la cache es diferente a static ver 3 y esa cache inluye la pala bra static la elimina
                return caches.delete(key);
            }
        });
    });
    e.waitUntil(respuesta);
});

self.addEventListener('fetch',e=>{     //el fetch es un evento, dar una solucion si no hay recursos en internet 
    const respuesta = caches.match(e.request).then(resp=>{   //busca condicencias en el cache// estrategia cache only
        if(resp){
            return resp;
        }else{
            return fetch(e.request).then(newResp=>{
                return actualizaCacheDinamico(DYNAMIC_CACHE,e.request,newResp);
            });                                  
            //console.log(e.request.url); //imprime la url de la consola
        }
    });
    e.respondWith(respuesta);
});
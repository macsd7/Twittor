function actualizaCacheDinamico(dynamicCache, req,res){

    if(res.ok){
        return caches.open(dynamicCache).then(cache=>{
            cache.put(req,res.clone());   //sirve para no ser tan grande nuestro sw, guardar el cache q se hayan descargado en el fetch
            return res.clone();
        });
    }else{
        return res;
    }
}
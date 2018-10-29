function saveToStorage(key,value){

    var storage = window.localStorage;
    storage.setItem(key, value);
    
}

function getFromStorage(key){
    
    var storage = window.localStorage;
    var value = storage.getItem(key);

    return value;
}

function removeFromStorage(key){

    var storage = window.localStorage;
    storage.removeItem(key)

}
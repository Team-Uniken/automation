
var APITIMING = {}
var APITIMINGDIFFERENCE = {}

export class Util {
    
    constructor(){}

     static setTime(methodName){
        APITIMING[methodName] = Math.floor(Date.now() / 1000);
        alert(JSON.stringify(APITIMING));
    }

     static getTimeDifference(methodName){
        APITIMINGDIFFERENCE[methodName] = (Math.floor(Date.now() / 1000)) - APITIMING[methodName];
        alert(JSON.stringify(APITIMINGDIFFERENCE));
        //delete APITIMING [methodName];
    }

    static getAPITIMINGDIFFERENCE(){
        return APITIMINGDIFFERENCE;
    }

}
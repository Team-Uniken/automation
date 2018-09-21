
var APITIMING = {}
var APITIMINGDIFFERENCE = {}

export class Util {
    
    constructor(){}

     static setTime(methodName){
        APITIMING[methodName] = Math.floor(Date.now() / 1000);
    }

     static getTimeDifference(methodName){
        return APITIMINGDIFFERENCE[methodName] = (Math.floor(Date.now() / 1000)) - APITIMING[methodName];
        //delete APITIMING [methodName];
    }

    static getAPITIMINGDIFFERENCE(){
        return APITIMINGDIFFERENCE;
    }

    static deleteAPITime(methodName){
         delete APITIMING [methodName];
    }

}
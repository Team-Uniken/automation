
var APITIMING = {}
var APITIMINGDIFFERENCE = {}

export class Util {
    
    constructor(){}

     static setTime(methodName){
        var num = Date.now() / 1000;
        APITIMING[methodName] = num.toFixed(4);
    }

     static getTimeDifference(methodName){
        var num = (Date.now() / 1000) - APITIMING[methodName];
        return APITIMINGDIFFERENCE[methodName] = num.toFixed(4); 
        //delete APITIMING [methodName];
    }

    static getAPITIMINGDIFFERENCE(){
        return APITIMINGDIFFERENCE;
    }

    static deleteAPITime(methodName){
         delete APITIMING [methodName];
    }

}
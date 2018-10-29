
var sessionID = "";
var hostName = "https://10.0.0.179:9080/rest/";

function initRELID(){
	alert("initRELID");
	com.uniken.rdnaplugin.RdnaClient.initialize(onInitCompleted, onError, ["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", "10.0.0.179", "4443", "AES/256/CFB/PKCS7Padding", "Rel-ID-Secure-IV", com.uniken.rdnaplugin.RdnaClient.RDNALoggingLevel.RDNA_LOG_VERBOSE, "", ""]);
	document.addEventListener('onInitializeCompleted', this.asyncResponse.bind(this), false);
    
}

function asyncResponse(e){
	var objRDNAInit = JSON.parse(e.response);

	console.log(JSON.stringify(objRDNAInit));

	if (objRDNAInit.errCode == 0) {
	//   alert('onInitializeCompleted');
		// this.sessionID = objRDNAInit.
		getSessionID();
		// import { CHALLENGES_AFTR_INIT } from "./constant";
		// saveToStorage(CHALLENGES_AFTR_INIT	,JSON.stringify(objRDNAInit))
	  window.location.href = "welcome.html";
	} else {
		alert("Initialization Failed: " + objRDNAInit.errCode);
	}
}

function onInitCompleted(e){
    // alert("Sync init completed: Sucessfully"+JSON.parse(e));
}

function onError(e){
    // alert("Sync init completed: Failed"+JSON.parse(e));
}

function getSessionID(){
	com.uniken.rdnaplugin.RdnaClient.getSessionID(this.onSuccessSessionId,this.onFailureSessionId);
}

function onSuccessSessionId(data) {

	try{
		var sessionObj = JSON.parse(data);
	  }catch (e){
		console.log("parsing fails");
	  }

	  this.sessionID = sessionObj.response;
	  alert(this.sessionID);
	
}
  
function onFailureSessionId(data) {
	console.log("RdnaClient.js: onFailureSessionId"+data);
}

account = {
    login_id: 'Nikhil',
    password: '1234',
    acess_code: '1111'
  };


function enrollUser() {
	getSessionID();

	 var URL = hostName + "enrollUser.htm";
	 
	 var userMap = {
	   "firstName":this.account.login_id,
	   "lastName":"kanawade",
	   "userId":this.account.login_id,
	   "actCode":"1111",
	   "groupName":"group1",
	   "emailId":"nikhil.kanawade@uniken.com",
	   "mobNum":"9168086688",
	   "username":"sruser",
	   "password":"1e99b14aa45d6add97271f8e06adacda4e521ad98a4ed18e38cfb0715e7841d2",
	   "isRELIDZeroEnabled":"true",
	   "apiversion":"v1",
	   "sessionId":this.sessionID,
	   "Content-Type": "application/x-www-form-urlencoded",
	   "Content-Length":"0"
	 };
 
	 alert(getFromStorage(CHALLENGES_AFTR_INIT));
	//  com.uniken.rdnaplugin.RdnaClient.openHttpConnection(this.onSuccess, this.onFailure, [com.uniken.rdnaplugin.RdnaClient.RDNAHttpMethods.RDNA_HTTP_POST,URL,JSON.stringify(userMap),""]);  
	 
	 
}

function onSuccess(data) {
	console.log("EnrollUser: openHttpConnectionSuccess");
	alert("User enroll successfully");
	window.location.href = "verification_with_qr.html";
}

function onFailure(data) {
	  console.log("EnrollUser: openHttpConnectionFailure");
	  alert("User enroll Failed");
}

function enrollDevice() {
	getSessionID();
    var URL = hostName+"enrollUserDevice.htm";
    var userMap = {
      "userId":this.account.login_id,
      "actCode":"1111",
      "username":"sruser",
      "password":"1e99b14aa45d6add97271f8e06adacda4e521ad98a4ed18e38cfb0715e7841d2",
      "apiversion":"v1",
      "sessionId":this.sessionID,
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length":"0"
    };

	com.uniken.rdnaplugin.RdnaClient.openHttpConnection(this.onSuccessDevice, this.onFailureDevice, [com.uniken.rdnaplugin.RdnaClient.RDNAHttpMethods.RDNA_HTTP_POST,URL,JSON.stringify(userMap),""]);  
	
	document.addEventListener('onHttpResponse', this.openAsyncResponse.bind(this), false);
  }

    function onSuccessDevice(data) {
      alert("device regis success: "+data);
    }

  	function onFailureDevice(data) {
    alert("device regis fail: "+data);
	 }
	 
	 function openAsyncResponse(data){
		console.log("Http errcode: "+data.errCode);		
		var objOpenHttp = JSON.parse(data.response);

	console.log("OpenHttpRespon:"+JSON.stringify(objOpenHttp));

	if (data.errCode == 0) {
	//   alert('onInitializeCompleted');
		// this.sessionID = objRDNAInit.
		getSessionID();
	  window.location.href = "welcome.html";
	} else {
		alert("Device enroll failed: " + objOpenHttp.errCode);
	}

	  window.location.href = "question_answer.html";
	 }
##15-Mar-2016
- **ConnectSecure**
- **REL-IDmobile**
	1. React Native Prototype with R&D completion. 
	2. React Native Ref App screens
	3. React Native Ref App layout
	4. React Native Ref App functions
- **REL-IDdesktop**
- **REL-IDgateway**
- **REL-IDcore**
	1. iOS fingerprinting wrapper
	2. Android fingerprinting wrapper
- **REL-IDzero**
- **REL-IDpeer**
- **REL-IDsmart**
- **R&D**


##1-Apr-2016
- **ConnectSecure**
- **REL-IDmobile**
	1. Engineering Documentation for iOS
	2. Engineering Documentation for Android
- **REL-IDdesktop**
	1. Electron Prototype with R&D completion for REL-ID Desktop app development using Electron. 
	2. Election Desktop specifications
- **REL-IDgateway**
- **REL-IDcore**
- **REL-IDzero**
- **REL-IDpeer**
- **REL-IDsmart**
- **R&D**


##15-Apr-2016
- **ConnectSecure**
- **REL-IDmobile**
- **REL-IDgateway**
- **REL-IDcore**
- **REL-IDzero**
- **REL-IDpeer**
- **REL-IDsmart**
- **R&D**



##UNCOMMITTED

**1. Porting the backend integration APIs on new Blaze Server:** 
	- ConnectSecure (ZServer) version offers a bunch of webservice / REST Apis using which the backend applications integrate with REL-ID Gateway server. For example  = enrollUser , checkUserStatusm etc. I think it is important for us to schedule porting these APIs on new server. At least enrollUser and checkUserStatus to start with. (Team is packed with march items working on details that I have provided you in last email). However, if you can approve these to be implemented in Mid-Apr sprint, I can plan accordingly. 


**2. A new "Sign" API:** 
	- which will essentially do digital signing of any data that app client provides to the APi-SDK. At the backend, there will be a verify api , which shall accept data, sign and return back YES/NO. This simple API will add a great value, where it will make us "able" to perform digital signing using REL-ID based keys. 



##1-May-2016

##15-May-2016
- **ConnectSecure**
- **REL-IDmobile**
- **REL-IDdesktop**
- **REL-IDgateway**
- **REL-IDcore Stability**
- **REL-IDcore Expansion**
	1. Windows Desktop wrapper and device fingerprinting
	2. Windows Use/Install Documentation
- **REL-IDzero**
- **REL-IDpeer**
- **REL-IDsmart**
- **R&D**

##1-Jun-2016
- **ConnectSecure**
- **REL-IDmobile**
	1. React Native Ref App on iOS published
- **REL-IDdesktop**
- **REL-IDgateway**
- **REL-IDcore Stability**
- **REL-IDcore Expansion**
	1. OSX wrapper and device fingerprinting
	2. OSX Use/Install Documentation
- **REL-IDzero**
- **REL-IDpeer**
- **REL-IDsmart**
- **R&D**


##15-Jun-2016
- **ConnectSecure**
- **REL-IDmobile**
- **REL-IDdesktop**
	1. Reference App for Windows in Electron published
- **REL-IDgateway**
- **REL-IDcore Stability**
- **REL-IDcore Expansion**
- **REL-IDzero**
- **REL-IDpeer**
- **REL-IDsmart**
- **R&D**


##1-Jul-2016
- **ConnectSecure**
- **REL-IDmobile**
	1. React Native Ref App on Android published
- **REL-IDdesktop**
	1. Reference App for OSX in Electron published
- **REL-IDgateway**
- **REL-IDcore Stability**
- **REL-IDcore Expansion**
	1. Citrix Integration on Windows wrapper
- **REL-IDzero**
- **REL-IDpeer**
- **REL-IDsmart**
- **R&D**

##15-Jul-2016
- **ConnectSecure**
- **REL-IDmobile**
- **REL-IDdesktop**
- **REL-IDgateway**
- **REL-IDcore Stability**
- **REL-IDcore Expansion**
	1. Citrix Integration on OSX wrapper
- **REL-IDzero**
- **REL-IDpeer**
- **REL-IDsmart**
- **R&D**




##Business Features
- **ConnectSecure**
- **REL-IDmobile**
	1. [ ] __
- **REL-IDdesktop**
- **REL-IDgateway**
- **REL-IDcore**
	1. [x] __Static Application Identity__ - Only REL-ID enabled appplication will contain a REL-ID issued secret key (REL-ID Admin will handover this to your application developer).  This enables verification of a valid enterprise-approved REL-ID application at the client end.  Someone with the REL-ID API SDK cannot connect to your enterprise without the secret key embedded inside the binary.
	2. [x] __Application Version Control__ – Only specific versions of your applications will be able to connect to your backend enterprise application server.  This extends the functionality of the static app identity to include versioning of your applications.
	3. [ ] __Simple Application Fingerprinting__ - Fingerprinting of the runtime environment of your application is part of the identity that is verified by the backend.  This includes looking at  
	4. [ ] __Advanced Application Fingerprinting__ - Fingerprinting of the runtime environment of your application is part of the identity that is verified by the backend.  This includes looking at 
- **REL-IDzero**
- **REL-IDpeer**
- **REL-IDsmart**
- **R&D**
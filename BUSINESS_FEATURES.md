##Business Features
- **REL-IDmobile**
	12.[ ] __Easy Integration__ - 
- **REL-IDdesktop**
	12.[ ] __Easy Integration__ - 
- **REL-IDgateway**
	- __FLEXIBILITY__
	- __SIMPLICITY__
		1. [ ] __Soft-Appliance Offering__ - for easy deploymoent, the REL-ID gateway is delivered as a soft-appliance, either as a virtual image or a package, depending on your infrastructure (physical/virtual).
		1. [ ] __Web-based Config Console__ - for easy configuration, the REL-ID gateway comes with its own web-based management console.  This console can be stood up and fully configured in a matter of minutes.
	- __SECURITY__
		- [ ] Test__Application Driven Crypto-segmentation__ - You can use a single REL-ID Gateway Server to separate different applications accessing different application servers (For example, HR App has access to HRMS server and LMS app to your LMS server)
		- [ ] __User Management__
		- [ ] __Application Version Management__
		- [ ] __First Time Activation Policy Managment__
		- [ ] __Primary Channel Policy Management__
		- [ ] __Secondary Channel Policy Management__
		- [ ] __Active Directory Integration__
		- [ ] __Custom RDBMS User Directory Integration__
		- [ ] __Device Manager Policy Management__

- **REL-IDcore**
	1. [x] __Static Application Identity__ - Only REL-ID enabled appplication will contain a REL-ID issued secret key (REL-ID Admin will handover this to your application developer).  This enables verification of a valid enterprise-approved REL-ID application at the client end.  Someone with the REL-ID API SDK cannot connect to your enterprise without the secret key embedded inside the binary.
	2. [x] __Application Version Control__ – Only specific versions of your applications will be able to connect to your backend enterprise application server.  This extends the functionality of the static app identity to include versioning of your applications.
	3. [ ] __Simple Application Fingerprinting__ - Fingerprinting of the runtime environment of your application is part of the identity that is verified by the backend.  This includes looking at  
	4. [ ] __Advanced Application Fingerprinting__ - Fingerprinting of the runtime environment of your application is part of the identity that is verified by the backend.  This includes looking at 
	5. [ ] __Man in the Middle Resistant Channel__ - 
	6. [ ] __True Mutual Authentication Protocol__ - 
	7. [ ] __Secure External Communication__ - 
	8. [ ] __Cross-Platform Capability__ - 
	9. [ ] __Thick and Thin Client Support__ - 
	10.[ ] __User-Driven Device Management__ -
	11.[ ] __Encryption Scopes__ - You can encrypt data based on different scopes through simple API calls. These scopes include:
		- Session
		- User/Account
		- Device
		- Application
	12.[ ] __Data-at-rest Encryption__ - You do not have to worry about different encryption algorithms and the encryption key management. You Simply use REL-IDs Data Encryption API to Encrypt / Decrypt the data
	13.[ ] __Policy-Driven Scopes__ - You can set separate policies for various REL-ID connections and apps based on your enterprise needs.  These policies are based off the data available to the device fingerprinting process:
		- [ ] Allow Access from a Specific Device (One exact profile) - This feature is commonly used for enabling system admin access to key engineering team members or for locking down approval chains on high-value corporate transactions for C-suite executives.
		- [ ] Allow Access from a range of IP Addresses - In one use case, this would ensure access only for devices connected to the corporate Wifi
		- [ ] Allow Access from a specific Geolocation - In one use case, this ensured that access was only granted within the geolocated footprint of the corporate headquarters and even from one specific floor.
	14.[ ] __Plug-n-Play Ciphers__ - Because of our history in the military sector, REL-ID has had to maintain flexibility with regard to the ciphers employed by our customers.  We are committed to that flexibility moving forward, so you can continue to use your homegrown or industry standard ciphers inside the REL-IDcore.
	15.[ ] __Integrated CipherSuite__ - Not every company has the resources to develop there own secure ciphers, and most shouldn't attempt to! On the flip-side, open-source crypto libraries of industry standard ciphers carry their own risks.  REL-IDcore provides an integrated, locked-down, fully-tested ciphersuite of the most commonly used ciphers available today.  You get the trust of a published cipher with the strength of a verified, locked-down library.
- **REL-IDzero**
	1. [ ] __
- **REL-IDpeer**
- **REL-IDsmart**
- **R&D**
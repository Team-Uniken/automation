##Business Features
- **REL-IDmobile**
	- __FLEXIBILITY__ - 
	- __SIMPLICITY__ - 
	- __SECURITY__ - 
	- __SCALABILITY__ - 
		1. [ ] __Easy Integration__ - 
		1. [ ] __QuickSkin__ - 
- **REL-IDdesktop**
		12.[ ] __Easy Integration__ - 
		1. [ ] __QuickSkin__ - 
- **REL-IDgateway**
	- __FLEXIBILITY__
		1. [ ] __First Time Activation Policy Managment__ - 
		1. [ ] __Primary Channel Policy Management__ - 
		1. [ ] __Secondary Channel Policy Management__ - 
		1. [ ] __Device Manager Policy Management__ - 
	- __SIMPLICITY__
		1. [ ] __Soft-Appliance Offering__ - For easy deploymoent, the REL-IDgateway is delivered as a soft-appliance, either as a virtual image or a package, depending on your infrastructure (physical/virtual).
		1. [ ] __Web-based Config Console__ - For easy configuration, the REL-IDgateway comes with its own web-based management console.  This console can be stood up and fully configured in a matter of minutes.
		1. [ ] __Active Directory Integration__ - Windows only(?)
			- ConnectSecure has capability to make REL-ID password same as ActiveDirectory login.  Can hook up with AD and sync on-demand with the ADID.  If internal webapps are configured with IWA... then they can log ing.  (iOS,Windows,Android) (not OSX - 1month to get up)
			- There is currently some admin overhead to get sync'ing for AD.  We have built workarounds with cron to script updating.  It's not realtime identity sync
			- Password has to pass the password in plaintext (in the encrypted tunnel) - not the hash.
			- API-SDK gives you option to use REL-ID credential store or custom credential store.  To integrate any custom credential store, we provide the interface.  AD is treated as a custom store, and we have built the interface to integrate with it.
			- [ ] __REAL-TIME SYNC WITH AD__ - 
			__Access Policies by Group in AD__ - REL-ID should respect the policies inside AD.  (MARKET ANALYSIS NEEDS TO BE DONE).  The API-SDK doesn't currently return the "accessible apps/assets" associated with REL-ID. 
		1. [ ] __WHITELISTING OF APPS ON THE DEVICE THAT CAN ACCESS THE TUNNEL__
		1. [ ] __SAML/OAuth2 Integration__ - REL-IDgateway's default Identity Store can connect to external Oauth2/SAML integrators allowing for a single sign-on experience for REL-ID users.
			- [ ] Confirmed with REL-IDmobile/desktop
			- [ ] Confirmed with OAuth2 on iOS, Android, OSX, and Windows
			- [ ] Confirmed with SAML on iOS, Android, OSX, and Windows
			- [ ] OAuth2/SAML permissions can be stored for a whole session for a device.
			- [ ] OAuth2/SAML permissions can be stored across viewers on a device.
			- [ ] OAuth2/SAML permissions can be stored across applications on a device.
			- [ ] OAuth2/SAML permissions can be stored across REL-ID sessions on a device.
			- [ ] OAuth2/SAML permissions can be made permanent for a device, inside REL-ID.
		1. [ ] __SSO SAML/OAuth2 Compatability__ - Some organizations do not centrally manage the identities of their users or employees, either relying on external identity providers (Google, Facebook, etc.) for access, or use third-party tools like CRMs that also require an external identity provider.  REL-ID does not interfere with these common "social logins." After securely logging into the REL-ID 
			- [ ] Confirmed with ConnectSecure (v1)
			- [ ] Confirmed with REL-IDmobile/desktop
			- [ ] Confirmed with OAuth2 on iOS, Android, OSX, and Windows
			- [ ] Confirmed with SAML on iOS, Android, OSX, and Windows
			- [ ] OAuth2/SAML permissions can be stored for a whole session for a device.
			- [ ] OAuth2/SAML permissions can be stored across viewers on a device.
			- [ ] OAuth2/SAML permissions can be stored across applications on a device.
			- [ ] OAuth2/SAML permissions can be stored across REL-ID sessions on a device.
			- [ ] OAuth2/SAML permissions can be made permanent for a device, inside REL-ID.
		1. [ ] __Custom RDBMS User Directory Integration__ - 
	- __SECURITY__
		1. [ ] __Application Driven Crypto-segmentation__ - You can use a single REL-IDgateway Server to separate different applications accessing different application servers (For example, HR App has access to HRMS server and LMS app to your LMS server)
		1. [ ] __User Management__ - You can perform all major CRUD operations on a user.  Tejas 
		1. [ ] __Application Version Management__ - You can manage multiple releases and versions of your application from one gateway.  You can set different proxies, policies, and requirements per version.
	- __SCALABILITY__
		1. [ ] __Horizontal Scalability at VPN Scale__ - You can use a single REL-IDgateway to provide a secure, on-demand network that exceeds the security, speed, and scalability of typical VPN products.
		1. [ ] __Horizontal Scalability at Enterprise Scale__ - You can use a single REL-IDgateway or series of REL-IDgateway instances to simplify your entire enterprise network, reducing a complex mesh of VPNs and subnets and key-pair management tools into one easily managed on-demand mesh network.
		1. [ ] __Horizontal Scalability at Internet Scale__ - You can horizontally scale REL-IDgateway in your DMZ to handle the connectivity load of a global company.  With REL-IDgateway's fast boot times, your burst capability won't fail when you need it most.
		1. [ ] __Vertical Scalability for Optimized Performance__ - You can vertically scale the REL-IDgateway with more memory or CPU power per instance and achieve faster processing for each connection and handle more connections
		1. [ ] __Faster than SSL connectivity__ - REL-ID pages and assets load faster through REL-ID than through a standard SSL connecting
		1. [ ] __Faster than VPN connectivity__ - REL-ID pages and assets load faster through REL-ID than through a standard VPN product
- **REL-IDcore**
	- __FLEXIBILITY__
	- __SIMPLICITY__
	- __SECURITY__
	- __SCALABILITY__
		1. [x] __Static Application Identity__ - Only REL-ID enabled appplication will contain a REL-ID issued secret key (REL-ID Admin will handover this to your application developer).  This enables verification of a valid enterprise-approved REL-ID application at the client end.  Someone with the REL-ID API SDK cannot connect to your enterprise without the secret key embedded inside the binary.
		2. [x] __Application Version Control__ – Only specific versions of your applications will be able to connect to your backend enterprise application server.  This extends the functionality of the static app identity to include versioning of your applications.
		3. [ ] __Simple Application Fingerprinting__ - Fingerprinting of the runtime environment of your application is part of the identity that is verified by the backend.  This includes looking at  
		4. [ ] __Advanced Application Fingerprinting__ - Fingerprinting of the runtime environment of your application is part of the identity that is verified by the backend.  This includes looking at 
		5. [x] __Man in the Middle Resistant Channel__ - 
		6. [ ] __True Mutual Authentication Protocol__ - 
		7. [ ] __Secure External Communication__ - 
		8. [ ] __Cross-Platform Capability__ - 
		9. [ ] __Thick and Thin Client Support__ - After the initial identification and authentication process, 
		10. [ ] __User-Driven Device Management__ -
		11. [ ] __Encryption Scopes__ - You can encrypt data based on different scopes through simple API calls. These scopes include:
			- Session
			- User/Account
			- Device
			- Application
		12. [ ] __Data-at-rest Encryption__ - You do not have to worry about different encryption algorithms and the encryption key management. You Simply use REL-IDs Data Encryption API to Encrypt / Decrypt the data
		13. [ ] __Policy-Driven Scopes__ - You can set separate policies for various REL-ID connections and apps based on your enterprise needs.  These policies are based off the data available to the device fingerprinting process:
			- [ ] Allow Access from a Specific Device (One exact profile) - This feature is commonly used for enabling system admin access to key engineering team members or for locking down approval chains on high-value corporate transactions for C-suite executives.
			- [ ] Allow Access from a range of IP Addresses - In one use case, this would ensure access only for devices connected to the corporate Wifi
			- [ ] Allow Access from a specific Geolocation - In one use case, this ensured that access was only granted within the geolocated footprint of the corporate headquarters and even from one specific floor.
		14. [ ] __Plug-n-Play Ciphers__ - Because of our history in the military sector, REL-ID has had to maintain flexibility with regard to the ciphers employed by our customers.  We are committed to that flexibility moving forward, so you can continue to use your homegrown or industry standard ciphers inside the REL-IDcore.
		15. [ ] __Integrated CipherSuite__ - Not every company has the resources to develop there own secure ciphers, and most shouldn't attempt to! On the flip-side, open-source crypto libraries of industry standard ciphers carry their own risks.  REL-IDcore provides an integrated, locked-down, fully-tested ciphersuite of the most commonly used ciphers available today.  You get the trust of a published cipher with the strength of a verified, locked-down library.
		16. [ ] __Digitally Sign the contents of your App__ - SHRIRANG has notes
		17. [ ] __Digitally Sign a Transaction__ - SHRIRANG has notes	
- **REL-IDzero**
	1. [ ] __
- **REL-IDpeer**
- **REL-IDsmart**
- **R&D**
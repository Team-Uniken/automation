Sec
See spreadsheet version at:
[https://docs.google.com/a/uniken.com/spreadsheets/d/1HeYMXbrav3Ff6okiZ_KvDBbJkcx2OtMNckmT8fgAl_w/edit?usp=sharing](https://docs.google.com/a/uniken.com/spreadsheets/d/1HeYMXbrav3Ff6okiZ_KvDBbJkcx2OtMNckmT8fgAl_w/edit?usp=sharing)

Thic
##Business Features
- **REL-IDcore**
	- __FLEXIBILITY__
		1. [ ] Whole Device Tunneling Mobile - 
		1. [ ] Whole Device Tunneling Desktop - 
		1. [ ] Plugins - 
			- Outlook 
				-OSX
				-WIndows
			- Other email client???
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
		8. [ ] __Cross-Platform Capability__ - You can use REL-IDcore (sdk) on almost all major platforms
			- [ ] Wrapper for OSX
				- [ ] Snow Leopard
				- [ ] Lion
				- [ ] Mountain Lion
				- [ ] Mavericks
				- [ ] Yosemite
				- [ ] El Capitan
			- [ ] Wrapper for Windows
				- [ ] 7
				- [ ] 8
				- [ ] 10
			- [ ] Wrapper for iOS
				- [ ] 7
				- [ ] 8
				- [ ] 9
			- [ ] Wrapper for Android
				- [ ] Jelly Bean
				- [ ] KitKat
				- [ ] Lollipop
				- [ ] Marshmallow
			- [ ] Wrapper for Winphone
				- [ ] 7.8
				- [ ] 8
				- [ ] 8.1
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
			TODO: Need to compare against the patent by Glen Benson http://patents.justia.com/patent/7082538, so we can go to JPMorgan Transaction mgmt

		18. [ ] __Active Device ID__ - A REL-ID is issued a the T=0 moment and is stored on the device in a secure manner, not reissued via the primary channel.  This, in effect, combines the primary and secondary channel, trading the standard user credential for an embedded device credential.  This enables faster connectivity, but marginally increases device compromise risk.  This is required for passwordless authentication.
		19. [ ] __Passwordless Authentication__ - an expansion of the Active Device ID feature.  This enables device recognition and secure channel creation on top of the Active Device ID.  This can be achieved without Active Device ID, relying on the device fingerprint, but this is discouraged.
		1. [ ] __Rootkit Detection__ - SUPER IMPORTANT
			- [ ] Rootkit Detection API in SDK on client device
			- [ ] Rootkit Detection as Policy managed from Gateway
		1. [ ] __Malware Detection__ - SUPER IMPORTANT
		1. [ ] __Jailbreak Detection__ - 
			- [ ] Jailbreak Detection API in SDK on client device
			- [ ] Jailbreak Detection as Policy managed from Gateway
		1. [ ] __Risk Assessment Engine__ - 
		1. [ ] __Location Deep Authentication__ - 
			- [ ] Location by country managed as Policy from Gateway
			- [ ] Geofencing managed as Policy from Gateway
			- [ ] Location by distance from Lat/Lon from Gateway
		1. [ ] __Micro Kernel, ported to many OS's__ - See Robert for list
		1. [ ] __SUpport for session & non-session transport__ - Broadly, this is UDP for IOT
- **REL-IDgateway**
	- __FLEXIBILITY__
		1. [ ] __First Time Activation Policy Managment__ - 
		1. [ ] __Primary Channel Policy Management__ - 
		1. [ ] __Secondary Channel Policy Management__ - 
		1. [ ] __Device Manager Policy Management__ - 
		1. [ ] __Multi-app whitelisting from Gateway (i.e. RDP and XXX)__ - 
	- __SIMPLICITY__
		1. [ ] __Soft-Appliance Offering__ - For easy deploymoent, the REL-IDgateway is delivered as a soft-appliance, either as a virtual image or a package, depending on your infrastructure (physical/virtual).
			- [ ] Compatible with CentOS vX+
			- [ ] Compatible with Ubuntu vX+
			- [ ] Compatible with Redhat vX+
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
			- [ ] Confirmed with Internal Viewer on all versions
			- [ ] Confirmed with External Viewer on all versions
			- [ ] OAuth2/SAML permissions can be stored for a whole session for a device.
			- [ ] OAuth2/SAML permissions can be stored across viewers on a device.
			- [ ] OAuth2/SAML permissions can be stored across applications on a device.
			- [ ] OAuth2/SAML permissions can be stored across REL-ID sessions on a device.
			- [ ] OAuth2/SAML permissions can be made permanent for a device, inside REL-ID.
		1. [ ] __Custom RDBMS User Directory Integration__ - 
		1. [ ] __Secure Profile on Amazon__ - 
		1. [ ] __Secure Profile on Azure__ - 
		1. [ ] __Secure Profile on DigitalOcean__ - 
		1. [ ] __Secure Vagrant Standup__ - 
	- __SECURITY__
		1. [ ] __Application Driven Crypto-segmentation__ - You can use a single REL-IDgateway Server to separate different applications accessing different application servers (For example, HR App has access to HRMS server and LMS app to your LMS server)
		1. [ ] __User Management__ - You can perform all major CRUD operations on a user.  Tejas 
		1. [ ] __Application Version Management__ - You can manage multiple releases and versions of your application from one gateway.  You can set different proxies, policies, and requirements per version.
		1. [ ] __Hardened Gateway (C/C++)__ - by porting the gateway code into C, the reliance on third party libraries or vulnerable JREs is significantly reduced
	- __SCALABILITY__
		1. [ ] __Horizontal Scalability at VPN Scale__ - You can use a single REL-IDgateway to provide a secure, on-demand network that exceeds the security, speed, and scalability of typical VPN products.
		1. [ ] __Horizontal Scalability at Enterprise Scale__ - You can use a single REL-IDgateway or series of REL-IDgateway instances to simplify your entire enterprise network, reducing a complex mesh of VPNs and subnets and key-pair management tools into one easily managed on-demand mesh network.
		1. [ ] __Horizontal Scalability at Internet Scale__ - You can horizontally scale REL-IDgateway in your DMZ to handle the connectivity load of a global company.  With REL-IDgateway's fast boot times, your burst capability won't fail when you need it most.
		1. [ ] __Vertical Scalability for Optimized Performance__ - You can vertically scale the REL-IDgateway with more memory or CPU power per instance and achieve faster processing for each connection and handle more connections
		1. [ ] __Faster than SSL connectivity__ - REL-ID pages and assets load faster through REL-ID than through a standard SSL connecting
		1. [ ] __Faster than VPN connectivity__ - REL-ID pages and assets load faster through REL-ID than through a standard VPN product

- **REL-IDmobile**
		1. [ ] __Easy Integration__ - 
		1. [ ] __QuickSkin__ - You can use a single configuration json file to change color scheme and UI/UX options from a default set up of the reference application.  This is for simplicity, but also for internal sales.
		1. [ ] __QuickDev__ - The standard whitelabel solution is a common, easily learned frontend framework
			- [ ] __ReactNative Reference__ - the reference app is built on ReactNative.
			- [ ] __ReactNative Whitelabel__ - the new ConnectSecure product whitelabel offering is built in ReactNative
		1. [ ] __Opensource plugin capabilities__ - 
		1. [ ] __Secure Messaging__ -
		1. [ ] __iOS Fingerprint Login__ - 
		1. [ ] __SayPay or Other Auth Login__ - 
		1. [ ] __Integrate to Nuance (??? ASK BIMAL)__ - 
		1. [ ] __Integrate to EyeVerify (???)__ - 
		1. [ ] __Auto Update Mechanism__ - 
	- __FLEXIBILITY__ - 
	- __SIMPLICITY__ - 
	- __SECURITY__ - 
	- __SCALABILITY__ - 
- **REL-IDdesktop**
		1. [ ] __Easy Integration__ - 
		1. [ ] __QuickSkin__ - 
		1. [ ] __Default Browser Use__ - 
		1. [ ] __Secure / Off-the-Record Messaging__ -
		1. [ ] __Auto Update Mechanism__ - 
	- __FLEXIBILITY__ - 
	- __SIMPLICITY__ - 
	- __SECURITY__ - 
	- __SCALABILITY__ - 
- **REL-IDzero**
	1. [ ] __Browser Fingerprinting__ 
	1. [ ] __Browser Fingerprint Intelligence__ - We collect data provided in both real-time as well as offline, such as geographical and time attributes, plug ins, IP address, etc. We then run risking, such as velocity & consistency checks, web view & proxy detection, tampering checks, and blacklist comparisons to identify any potential fraud indicators.
	1. [ ] 
	1. [ ] __Cross-Channel Binding__ - Connect browsers to other REL-ID connected elements
	1. [R&D] __In-Band Authorization__
	1. [R&D] __Zero-Footprint JS package__ - this enables limited javascript based REL-ID authentication from inside a standard browser window.  Though not secure on its own, this feature is most appropriately coupled with in-band verification.
- **REL-IDpeer**
	1. [ ] __Access Gateway Module for Webserver__ - Decryption is managed as a plugin in the same environment as the backend app service.
	1. [R&D] __Mobile-to-Mobile__
	1. [R&D] __Gateway-to-Gateway__
	1. [R&D] __Mobile-to-Gateway-Single-Pass__
	1. [R&D] __UDP__
	1. [R&D] __Mobile-to-App-Server (Agent to Agent)__ 
- **REL-IDsmart**
	1. [ ] __Session and non-session transport__ - Think secure meters with cumulative data

- **R&D**

| Title                                                       | Stage  | Note                      | Complexity | Priority |
|-------------------------------------------------------------|--------|---------------------------|------------|----------|
| Destkop Whole Device Tunneling                              | R&D    | Prime Target              | High       | High     |
| Mobile Whole Device Tunneling                               | R&D    | We should avoid           | Very High  |          |
| Secure Corporate Email Mobile App                           | R&D    |                           |            |          |
| Secure Corporate Email Desktop                              |        | Same as Device Tunnelling |            |          |
| Secure Remote Desktop Access (with Whole)                   | R&D    |                           | High       |          |
| Secure Remote Desktop Access (without Whole)                |        |                           |            |          |
| Citrix Access                                               | R&D    |                           | Medium     | High     |
| Device Mgmt on Desktop                                      | Built? |                           |            |          |
| Device Mgmt on Mobile                                       | Built? |                           |            |          |
| Zero Footprint Browser Security                             | R&D    | SCB ask                   | High       | High     |
| In Band Authorization App (mobile)                          | R&D    |                           | Medium     |          |
| Peer to Peer Connectivity (Mobile to Mobile with a Gateway) | R&D    |                           | Very High  |          |
| Peer to Peer Connectivity (Gateway to Gateway)              | R&D    |                           | Very High  |          |
| Mobile to App Server (No Gateway)                           | R&D    |                           | Very High  |          |
| Digitally Signed Transactions                               | R&D    |                           | High       |          |
| SSO Capability for Desktop Viewer                           |        |                           |            |          |
| SSO Capability for Mobile Viewer                            |        |                           |            |          |
| SSO Capability for External Mobile Viewer                   |        |                           |            |          |
| SSO Capability for External Desktop Viewer                  |        |                           |            |          |
| Active Directory Integration for Idendity                   |        |                           |            | High     |
| Improved Device Fingerprinting                              | R&D    |                           | High       | High     |
| Active Device ID (Stored on Device)                         | R&D    |                           | High       | High     |
| Hardened Gateway (C/C++)                                    | R&D    |                           | Very High  |          |
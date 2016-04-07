# REL-ID Product Development Plan

Strategy for REL-ID Products
Mobile App Strategy

ConnectSecure, not as VPN replacement, so reference app that connects WebApps
Product Roadmap

IOT
Need to get off of Edison Board onto something much smaller in scale.
Consumer/industrial or all of the above


##I. Problems to solve / Jobs to be Done

Over the course of the last year, many problems have been identified through client meetings and POC requests that are now shaping our post-SDK development roadmap.  These features fall into three major categories: 1) Mobile solutions 2) Desk solutions, and 3) IoT (Internet of Things).

###A. Mobile Solutions
The steady rise of mobile browsing and app-based development has created a strong market for integrated authentication and security solutions.  These solutions are being offered in many flavors from MDM and app-wrapping technologies, to embedded authentication SDKs, to SSO integration libraries.  The unique and powerful capabilities of REL-ID can potentially undercut all three market segments, with a particular strength against similarly deployed SDK solutions.

####1. App-wrapping and MDM
Mobile Device Management has been a common approach in the enterprise market for several years.  As the complexity and cost of physical device management increases along with the reliance on devices by employees, the benefit of physical separation of concerns (two devices) decreases. Employees want one device.  They want their own device.  They will circumvent attempts to require two devices, exposing information to unprotected personal phones; or they will complain about personal device experience being ruined by strict MDM policies. The core MDM flaws are as follows:
- Implementations are OS dependent
- Devices typically have to be wiped at the end of a user's corporate relationship
- APIs must be available to query installed applications
- Data-protection is "opt-in" and dependent on a diverse universe of app developers
- Communication still relies on insecure channel protocols

The more flexible solution to arise in the last few years is MAM or Mobile Application Management.  This moves the traditional MDM controls to the application layer.  To accomplish this, "secure containers" are created, either as groupings or through "wrapping" existing applications.  These wrapped applications then have unique, bundled code libraries and are digitally signed for authenticity.  Despite the intial draw, this approach also has flaws.
- OS limits the available admin commands
- iOS does not allow true containerization/virtualization
- User experience can be dramatically impacted with 3rd party apps
- Allows for/uses custom crypto (beware!)
- MAM servers limited by OS for device queries
- Heavy reliance on IPC for pushing policies and commands
- Keying material is often stored on device
- Test apps can be wrapped and then used to reverse engineer the application.


REL-ID does directly not address the "app-wrapping"/MAM approach, but this approach is considerably more flawed than REL-ID's. No matter how complex the outer shell of the application may be, the reliance on an insecure channel to pass checksums or authentication elements is an inherent weakness that MDM and MAM do not address.  REL-ID could, however, be used inside of an MAM solution to address channel concerns. As the effort to break a single device limits the scalability of hacks to counter MAM/MDM, the market is not a top priority for Uniken.  Essentially, MAM and MDM act as malware nannies for BYOD policies.  Valuable offerings, yes, but they do not address the core flaws in the internet's communication channels.  REL-ID does just that.  REL-ID is best positioned as an embeddable SDK for MDM and MAM providers, not as a direct competitor.

####2. SSO Integration
Two major SSO companies have emerged as the reigning new standards: Okta and PingIdentity.  Both rely on Oauth and SAML integrations with outside identity providers and sites to create SSO environments.  These solutions have some key advantages over standard password management solutions:
- Responsive security levels that increase difficulty as unknowns are presented.
- Common user experience across platforms, browsers, and operating systems.
- Out-of-band and in-band authentication mechanisms.
- Wide accepted use.

But despite their initial success, these SSO providers also will soon struggle to compete based on the following issues:
- They resolve the usability issue of security, but do little to enhance security
- They rely on SSL and standard protocols that are not MITM proof
- They rely on third party integrations or, even worse, use of the companies own server-side verification.  PingIdentity does have an on-premise solution
- The SSO experience only works for responsive web-apps inside hardened browsers.  In other words, the mobile SSO experience is like using Safari for gmail access instead of the more user-friendly Gmail application.  For their gains in usability with password storage, they sacrfice a significant amount of mobile usability with a reliance on browsers.
- Native SSO operations would be based on the token based NAPPS standard, which is not, as of yet, clearly established.
- NAPPS is an open-standard and therefore provides no competive advantage for Okta or Ping

The recent customer interactions in Hong Kong have elucidated a strong demand for SSO experiences with REL-ID.  But, as of today, the technology and R&D has not been completed.  This is not to say it can't be.  The SSO experience for approved apps and sites is a low risk investment of resources and is currently on the roadmap.  The insecure website with transactional in-band verification is a more nuanced use case, requiring R&D on two fronts - browser JS package and digital signatures.  It is quite possible for REL-ID to undercut the SSO market share of Ping and Okta by providing the SSO integration and in-band verification as part of the standard REL-ID package.  Given the security constraints around banking and user-authentication, REL-ID is much better positioned to capitalize on 
the SSO market for large enterprises that do not wish to involve third-parties in their trust chain and are looking for more flexibility with regard to the authentication requirements.

The Multi-factor element alone is suggested to reach $10B by 2017.  Upwards of 90% of the MFA


##II. Partnership opportunities
TBD


##III. 4 Forces

The traditional 4 forces of consumer/product behavior highlights some big issues for Uniken:


__**New Behavior ====>**__

-----> Push of the Situation
- "I've been hacked"

-----> Magnetism of the Solution
- "That's a cool feature we don't have"


**<==== Businesss as Usual**

<---- Habit of the Present
- "We've always used SSL/VPN/OTP"
- "Integrating this would take a lot of change."

<---- Anxiety of the New Solution
- "Will you be around?"
- "Is this tech for real?"
- "Can I trust your scientists?"
- "Our developers don't know how to use this."

## IV. Business and Product Strategy
TBC
### A. Global
#### 1. Accountable
#### 2. Stakeholder
### B. India


## V. Product Development Process
### A. Standard Cycle
1. Concept
2. Concept Design
3. Prototyping
4. Piloting
5. Full Release



###Application to Uniken
The complex nature of REL-ID requires additional focus on two areas of the development process: QA and R&D.  The counterforce of "Anxiety of the New Situation" to our clients is additionally hightened in our sector and with our customers because of the inherent risk in the industry and depth of the product in the security stack.  

#####Managing the Customer Experience
To mitigate those concerns, QA must be top notch. When statements are made regarding the availability of an integration or compatability of the product on a platform, great care must be taken to double and triple check the client experience on these platforms, from "developers as consumers" through retail consumers.  Compatabilty must not mean "works with some additional effort," but rather that a singular installation or development experience works across all platforms.  If exceptions need to be made (though they should be minimized), they must be clearly and cleanly documented.  As a rule, we must aim to make documentation common across platforms and hold all iterations of the product against that same common experience.

#####Reducing Complexity
As REL-ID introduces a brand new technology into a relatively stagnant market, we can expect a signficant amount of eagerness on the part of customers with strong inlclinations to new behavior, perhaps driven by recent hacks or by excitement of REL-ID's benefits.  
To capitalize on this eagerness, great care must be taken to manage expectations of delivery and timelines.  The complexity of REL-ID and the multi-platform nature of the delivery mechanisms means that the tendency will be to customize each delivery for each customer to meet their specific need (see "jobs to be done").  This tendency can be seen in the prior growth of Uniken's professional services offering.  Though this may be an initial profit center, it ultimately creates exponentially more complexity in rollouts, updates, and delivery of truly QA'd releases. Every custom install that Uniken manages creates an expectation for a custom fix when new releases are made.  **This is not sustainable and must be avoided.**

#####Adding Research to a Product Dev Cycle
The other difficulty with a complex technical product is that piloting is too late in the development process to create new features or changes that require significant R&D.  __**Undeveloped features not currently on the roadmap cannot and should not be used to drive sales without SERIOUS CAUTION.**__  There is no such thing as a "quick turnaround" with most features requiring R&D.  For now, the long sale cycle of the financial services industry might be able to absorb these addtional research features, but as Uniken scales its global presence, this is not sustainable.  R&D and roadmap discipline are essential. See also Market and Customer Research.

In order to combat the drag on sales that poor expectation management can create, we must work towards tight integration of the R&D process into the broader Product Scrum/Agile.  This ultimately means that priorities and expectations of research are properly filtered and ranked.  This also means that the expert Uniken engineers developing new solutions in REL-ID can easily suggest features and enhancements - adding to the creative inputs for our feature wishlist.  REL-ID was created because the founders imagined the impossible.  We should are to continue to do so, but with the discipline necessary to create forward progress.

### Recommendations
1. Distinguish QA from all other development
	- [ ] Has the QA lead listed each human resource by team, role, and responsibility?  (i.e. has amorphous floating team members been eliminated or reduced) 
2. Appoint a QA lead across all platforms
	- [ ] Has a QA lead been appointed?
3. Elevate QA lead to Management level discussions on Roadmap, Sales, and Research
	- [ ] Has the QA Lead been invited to Roadmap, Sales, and Research standups?
	- [ ] Have roadmap, research, and sales standups been scheduled?
4. Remove all timeline statements in sales material regarding features that have not been developed
	- [ ] Have references to non-existent features been removed from sales documentation?
5. Refocus sales documentation and language on features that are explicitly in the pipe.
	- [ ] Has a list of features been made (i.e Roadmap)
	- [ ] Have all documents been checked for feature references
6. Weekly R&D reports/SCRUMs from whole team with PM
	- [ ] Is a weekly SCRUM scheduled with the R&D team, BD, and PM?
	- [ ] Have all R&D team members been invited and accepted
	- [ ] Have R&D team members identified weekly goals and been held accountable to those goals for 8 consecutive weeks?
7. Distinguish to-be researched features in a separate slide, to aid in feature availability and clarity both externally and with the sales team.
	- [ ] Have to-be features been identified clearly in a separate slide in the standard intro deck as "future state" or equivalent.


## 3. Portfolio Management
Risk vs Reward
	Product Risk diversity
	Peak Revenue (Bubble Size)

Competitive Position (weak/Strong)
	- Dev or withdraw   |   Invest/Grow
Market Attractiveness( High / Low)
	- Harvest / Divest | Maintain /Protect

Market Growth vs Relatie Market Share
	STAR - Much Cash in, Large Cash out
	COW - Much Cash in, Small Cash out
	Questionable - Small cash in, large cash out
	DOG - Small Cash in, small Cash out

Proposed Project Portfolio 
	Probability of Success vs Time to market
	NOW (short term)
	Mediume (Deve)
	Long (R&D)
	Size based on projected revenue

1. Value Maximization
Allocate resources to maximize the value of the portfolio via a number of key objectives such as profitability, ROI, and acceptable risk. A variety of methods are used to achieve this maximization goal, ranging from financial methods to scoring models.

2. Balance
Achieve a desired balance of projects via a number of parameters: risk versus return; short-term versus long-term; and across various markets, business arenas and technologies. Typical methods used to reveal balance include bubble diagrams, histograms and pie charts.

3. Business Strategy Alignment
Ensure that the portfolio of projects reflects the company’s product innovation strategy and that the breakdown of spending aligns with the company’s strategic priorities. The three main approaches are: top-down (strategic buckets); bottom-up (effective gatekeeping and decision criteria) and top-down and bottom-up (strategic check).

4. Pipeline Balance 
Obtain the right number of projects to achieve the best balance between the pipeline resource demands and the resources available. The goal is to avoid pipeline gridlock (too many projects with too few resources) at any given time. A typical approach is to use a rank ordered priority list or a resource supply and demand assessment.

5. Sufficiency
Ensure the revenue (or profit) goals set out in the product innovation strategy are achievable given the projects currently underway. Typically this is conducted via a financial analysis of the pipeline’s potential future value.

###End State for the Portfolio
 - Moving to IOT
 - Commercializing RDP
 - Commericalizing Whole Device as VPN Play
 - Commercializing Mobile App SDK play

###Change Management Plan 
TODO


## 4. Leading, Managing, and Working with Teams and People
TODO

## 5. Project and Product Tools and Metrics
1. **Monthly Active Users** - Active connections, not licenses
1. **Monthly Total Licenses** - Total licenses issued, not those that are used.
1. **Average Revenue Per User (ARPU)** - Average Revenue per user enrolled.
1. **Customer Acquisition Cost (CAC)** - Cost to acquire each user, this covers all costs, not just sales.  __Need to figure out how to do this with attrition and with recurring revenue.__
1. Feature Velocity - Average time of last 5 features from concept to roll out
1. Feature Quality - __Need to establish a strong method of testing this__
1. Team Happniness - __Need a robust data collection method that is continuous, not simply annual or quarterly__
1. Defects per release at each stage - Number of defects found in alpha products, beta products, and release candidates.
1. Defect cost - Average time to resolve in workerhours for each defect in each stage. __This should be pulled from engineering trackers.__
1. Down Time - Sum of all downtime for all products for the year.
1. Response Time - Response time in minutes vs competition vs SLAs. __Who is this pulled from?__


#### Groupings
Metrics should eventually be broken out by product and then by four categories - qualitative, guantitative, comparative (A/B), competitive.



## 6. Market and Customer Research

### Need to integrate the Biometric or third party Piece as Demo and estbalish timeline for new product integration

### Need to look at FIDO for a standard for MFA (???)


### Feedback Loop as Product
We must look to feedback options built in to each product that we release.  As whitelabel agents, these must be configurable for end clients.  But we should also encourage a standardized feedback channel to collect information from all types of users.  This can be part of our new contract around REL-IDmobile and REL-IDdesktop.

### Feedback Loop as Documentation
As our documentation and code is published via github, we can direct our partner developers to github to report problems and suggest features. This is a standard practice in github communities and should be very familiar to our target audience, reducing initial contact anxiety.

### Feedback Loop as Sales Cycle
The sales team can and should be a vital source for feedback from existing and new customers.  Both positive and negative feedback from potential, former, and current customers must have a clear mechanism for tracking and submission to the PM and BD teams.  Tracking must include
- Company / Client
- Product impacted
- Request description
- Contract state (proposed, pitched, etc)
- Upside (expected $)
- Downside (expected $)

### Feedback Loop as Developer
The engineering team must have a mechanism to suggest features through to PM and BD.  As developers, they are exposed to new code libraries, open-source tools, and are in the best position to suggest backend features and optimizations.  This should be encouraged, but handled in a clear and defined manner.
- Product impacted
- Request description
- Upside (Value add)
- Downside (Cost and risks)

### RELCASTS
As a method to show functionality and ease of use for developers and reduce the anxiety around implementation (SEE 4 FORCES), Uniken should work to create a series of webcasts on youtube that demonstrate every step of the developer process, from standing up a server, to connecting to an RDP, to connecting to a secure site, all the way through to embedding the REL-ID SDK into code.


### Differntiation in Marketing
#### Clear USPs for each market we currently penetrate
### Early Adopter Targeting
#### Early adopter pricing
#### Developer Partner strategy and pricing




#Uniken Glossary


##FEATURES

###Discovery
The feature is being defined through generative user research, user modeling, task analysis, and requirements definition.

###R&D
A feature is in R&D when the requested capability is understood, but the technical feasibility is not.  A feature request may sit in R&D indefinitely depending on priority and complexity.  As features leave R&D and the "unknown unknowns" are eliminated, they are tentatively scheduled as part of a major or minor release.

###Prototype ("Show and Tell")
A feature or set of features has been built, found feasible, and roughly tested without any significant regard to user experience.  Prototypes are work-in-progress demonstrations of capability to partners, engineers, designers, and managers. A product moves from R&D to prototype when a functioning feature demo can be shown.  Multiple feature prototypes may be rolled into one PreAlpha release.

###Design
A feature moves from Prototype to Design when a functioning feature demo can be shown and documentation of the proposed UI/UX, as relevant, is complete.  At this point, engineers start to prioritize the considerations or requests for UI/UX into the demo.  The design phase may involve many short iterations.  Significant design ("look and feel") changes may still occur.  Not all features or releases will require Design phases.

##RELEASES 

###PreAlpha
A feature moves from Design to PreAlpha when the features and designs have been frozen into a set for combined "release."  All proposed distinct features prototyping have been separately coded, but no integrated release testing has begun.  Final design tweaks and integrations of concurrently released features continue in PreAlpha.

###Alpha testing (Quality & Hardening)
Alpha testing is simulated or actual operational testing by a test team at the developers' site.  Alpha testing begins when features are completed and moved to QA.  A product is said to be in alpha so long as this QA/internal testing process is continuing.  As much as is feasible, Alpha testing should involve internal teams using the product within the company. Alpha releases may resolve involve bugs fixes, hotfixes, minor design tweaks, as well as the new features that have finished development and move into QA after the majority of other features. 

###Beta testing 
Beta testing is a form of external user acceptance testing. Versions of the software, known as beta versions, are released to a limited audience outside of the programming team known as beta testers. The software is released to groups of people so that further testing can ensure the product has few faults or bugs.  A product goes from alpha to beta when internal QA is complete and it is _ready_ to be shared with the first beta tester, but not necessarily shared yet.  Beta releases may resolve involve bugs fixes, hotfixes, and minor design tweaks.  Beta releases should _not_ involve major feature additions.  Customers should be aware that _beta releases_ may not be stable enough for production use and that caution should be taken.

###Release Candidate
A release candidate (RC) is a beta version with potential to be a final product, which is ready to release unless significant bugs emerge. In this stage of product stabilization, all product features have been designed, coded and tested through one or more beta cycles with no known showstopper-class bug. A release is called code complete when the development team agrees that no entirely new source code will be added to this release. There could still be source code changes to fix defects, changes to documentation and data files, and peripheral code for test cases or utilities. Beta testers, if privately selected, will often be credited for using the release candidate as though it were a finished product. Beta testing is conducted in a client's or customer's location and to test the software from a user's perspective. A beta release will can be considered a full _release candidate_ when showstopper bugs have been resolved and bug requests from beta users have dropped or leveled off.

###Gold Master
The term "release to manufacturing", also known as "going gold", is a term used when a software product is ready to be delivered or provided to the customer. This build may be digitally signed, allowing the end user to verify the integrity and authenticity of the software purchase. A copy of the RTM build known as the "gold master" or GM is sent for mass duplication. RTM precedes general availability (GA), when the product is released to the public.  A product goes from a _beta release candidate_ to a _gold master_ when all major and minor bugs have been resolved or pushed to later major versions.

##Versioning

Versioning should follow a consistent alphanumerical pattern across all products and stages.  The pattern is as follows:

[major].[minor].[stage].[build]

###Major Release
A _**Major**_ release is a release that provides such significant changes to framework or functionality that backwards compatability may be impacted.

###Minor Release
A _**Major**_ release is incremented when only minor features or significant fixes have been added. This number reverts back to zero whenever a major release occurs.

###Stage
The _**Stag**_ number is an abbreviation of representation of the current stage of that release in the product lifecycle. The stage reverts back to alpha whenever a minor release occurs.  Some minor releases may never make it to beta or become release candidates before becoming absorbed into entirely new minor release.

###Revision or Build Release
A _**Build**_ revision numbers increment when minor bugs are fixed.  Typically these are "hotfixes" that can be pushed quickly on published code in order to resolve customer requests or feedback. These numbers start back from zero whenever a major, minor, or stage change occurs.  Hotfixes to beta versions do not revert the stage back to alpha. 


###Examples

A fresh release of new product to beta testers would be: _**1.0.b.0**_
A fresh release candidate of the third update to the second generation product would be: _**2.3.rc.0**_
A product that is has had 9 minor releases, and QA has pushed 15 sets of bug fixes would be: _**1.9.a.15**_



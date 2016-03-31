#RHE 6.5 Linux
#Ubuntu and CentOS as well
#4gb/100GB HD/quadcore

#SSH from terminal
#username is 
ssh ec2-user@122.248.254.84
#must be root
sudo su
cd /usr/local
ls -l
#copy from internet to server on uniken.pg9.sra.20160328_3.tgz
./configure-once.sh
#set new password for user uniken
uniken123$
#set password for postgres
uniken123$
#configure iptables
y
#enter pacakage name
uniken.pg9.sra.20160328_3.tgz
#enter name of POC server
JAMES_TEST
#enter public IP address of the machine you just installed on
111.111.11.11
#start and stop scripts are in the uniken folder
#check
netstat -nltp
#should have a :443 process "big-bro.exe"
#go to 
122.248.254.84:8080/TMC/login.do?method=showLoginPage
tmcsu
Uniken123$
#got License Managment on Menu
#click Export Server Device ID
#SAME DEVICE NAME will be the same license!!
#RESTART SERVER WITH LICENSE

#change connection profile on local disk
#set the REL-ID
#set the Name to JAMES_TES
#set the REL-ID half to you profile name
#delete the profile.txt for Sec (THIS IS NOT DONE IN PRODUCTION IT IS BURNED IN TO THE APP)

#Applcation -> Site Management -> Add Site
#Create site
#Name
RDP
#IP Address of the RDP (the port given to the clientside)
54.255.168.220 (or 1.1.1.1 to hide the IP)
#Port that needs to be accessed on the site
3289 (or 80 as default)
#hostname or ip address again
54.255.168.220 (or 1.1.1.1 to hide the IP)
#Channel is almost always Secondary
#Server ID is to distinguish which server at that IP
#advanced Options -> Mostly applicable to Port Forwarding
#Service Name 
RDP
#Service Local Port (Port on the user's Device)
13389
#Disable WhiteList (only by processname and only one at a time)
FALSE
#Without compromising Security in Tunnel, set LWRT to reduce handshake occurences:
#(SHOULD BE REMOVED AS AN OPTION OR SET AS A DEV OPTION)
YES
#LEAVE SERVICE PRINCIPLE NAME ALONE - it's not used anymore

#Cick Tunnel Targets -> 
#This is allow the tunnel to target an IP address on the backend.
54.255.168.220
#Port that needs to be accessed on the site
3289


#Click on Application Management Tab
#This set which application on which servers you can set connection to
#Name
RDP
#Display order (for REL-ID button)
10
#Button Type (what type of app WEB-browser, APP-app on device, Local-inside RELID)
App
#PreFetch (do you want it to load on REL-ID logs in or on call)
#Doesn't make sense for RDP
No 
#Browser Mode
Popup
#Info of App on local device that is launched - can use path settings
mstsc.exe||system||v:127.0.0.1:13389
#Image upload that is shown on app
#Viewer Type
launchAppViewer

#Click Site Details Tab
#Click
RDP

#Click Application Mgmt -> Application Group
#This is a logical grouping of applications (System vs Sales vs HR, etc)

#User Group Mgmt
#For AD, use FQDN mgmt, otherwise just a normal group
#Grouptype
NonAD
#add names and stuff as 
test

#Application groups TAB
test 
Publish settings

#User Tab
#Have to move user to test group or create new user







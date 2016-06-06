var nconf = require('nconf');
var fs = require('fs')
var iniFile = eAppName + '.ini';
var defaultProfiles = "resources/ERELID.relid"
var profiles = new Array();
var Relids = new Array();
var selectedProfile = "";
var proxyObj = new Object();

proxyObj.pxyHost = "";
proxyObj.pxyPort = 0;
proxyObj.pxyPass = "";
proxyObj.pxyUser = "";

function getValueFromIniFile(key)
{
  nconf.file('custom', iniFile);
  return nconf.get(key);  
}

function setKeyValueToIniFile(key, value)
{
  var ret = true;
  nconf.file(iniFile);
  nconf.set(key, value);
  nconf.save(function (err)
  {
    if (err)
    {
      ret = false;
      return;
    }
  });
  return ret;
}

function readTextFile(file)
{
  var allText = null;
  if(fs.existsSync(file))
  {
    allText = fs.readFileSync(file);
  }
	return allText;
}

function loadDefaultSettings()
{
  fs.stat(iniFile, function(err, stats)
  { 
    if(err)
    {    
      switch(err.code)
      {
        case 'ENOENT':
        {
          importDefaultConnProfiles();
          break;
        }
      }
    }
    else
    {
      var iniFileData = readTextFile(iniFile);
      loadConfigFile(iniFileData);
    } 
  });
}

// Toggle Function
$('.toggle').click(function(){
  // Switches the Icon
  $(this).children('i').toggleClass('fa-pencil');
  // Switches the forms  
  $('.form').animate({
    height: "toggle",
    'padding-top': 'toggle',
    'padding-bottom': 'toggle',
    opacity: "toggle"
  }, "slow");
  myFunctionReset();
});

myFunctionReset();
function myFunctionReset(){
  $("#liProxy").addClass("active");
  $("#liConnection").removeClass("active");

  $("#frmProxy").show();
  $("#frmConnection").hide();
}

function myFunctionProxy()
{
  $("#liConnection").removeClass("active");
	$("#liProxy").addClass("active");
  $("#frmProxy").show();
	$("#frmConnection").hide(); 
}
  
function myFunctionConnection()
{
  $("#liProxy").removeClass("active");
	$("#liConnection").addClass("active");
  $("#frmProxy").hide();
	$("#frmConnection").show();
}

function initiateforgotPassword()
{
  var err = 0;
  displayLoginPGbar("Plaese wait");
  if(typeof(ssnUserName) !== 'undefined' && ssnUserName !== null && ssnUserName.length > 0)
  {
    err = forgotPswd(ssnUserName);
    if(0 != err)
    {
      alert("Unable to perform activity due, error code - " + err);
    }
  }
  else
  {
    alert("Application in invalid state, please relogin and try again...!");
  }
  hideLoginProgressBar();
}

function displayProgress()
{
  document.getElementById("myDIV").style.opacity = "0.3";
  document.getElementById("fountainG").style.display = "block";
}

function displayLoginPGbar(msg)
{
  document.getElementById("myDIV").style.opacity = "0.3";
  document.getElementById("Login").style.display = "block";
  document.getElementById("loginPGB").style.marginLeft = "40px";
  if(typeof(msg) != 'undefined' && msg != null && msg.length > 0)
  {
    document.getElementById("loginPGB").style.marginLeft = "50px";
    document.getElementById("loginPGB").innerHTML = msg;
  }
  else
  {
    document.getElementById("loginPGB").innerHTML = "Verifying user name";
    if(appState == "actcode")
    {
      document.getElementById("loginPGB").style.marginLeft = "20px";
      document.getElementById("loginPGB").innerHTML = "Verifying activation code";
    }
    else if(appState == "pass")
    {
      document.getElementById("loginPGB").style.marginLeft = "50px";
      document.getElementById("loginPGB").innerHTML = "Verifying password";
    }
    else if(appState == "secqa")
    {
    }
    else if(appState == "secondarySecqa")
    {
    }
    else if(appState == "devbind")
    {
    }
  }
}

function hideLoginProgressBar()
{
  document.getElementById("myDIV").style.opacity = "100";
  document.getElementById("Login").style.display = "none";
  document.getElementById("loginPGB").style.marginLeft = "70px";
  document.getElementById("loginPGB").innerHTML = "";
}

function onInitialized()
{
  document.getElementById("fountainG").style.display = "none";
  document.getElementById("initFrm").style.display = "none";
  document.getElementById("myDIV").style.opacity = "100";
  document.getElementById("landingPage").style.display = "block";
}

function onInitFailed(error)
{
  if(error != 0)
  {
    alert("Initialize failed with error : " + error); 
  }
  $("#btnInit").addClass('btn');
  document.getElementById("fountainG").style.display = "none";
  document.getElementById("myDIV").style.opacity = "100";
  document.getElementById("initFrm").style.display = "block";
}

function saveProxySettings()
{
  var host = document.getElementById("pxyHost").value;
  var port = parseInt(document.getElementById("pxyPort").value.trim());
  if(isNaN(port))
  {
    port = 0;
  }  
  var name = document.getElementById("pxyUsrNm").value;
  var pswd = document.getElementById("pxyPswd").value;

  proxyObj.pxyHost = host.trim();
  proxyObj.pxyPort = port;
  proxyObj.pxyPass = pswd.trim();
  proxyObj.pxyUser = name.trim();
  setKeyValueToIniFile("ProxySettings", proxyObj);
}

function findIfNameExist(arr, obj)
{
  for(var i=0; i<arr.length; i++)
  {
    if (arr[i].Name == obj)
    return true;
  }
}

function importAndDisplayConnProfiles(data)
{
  var index = 0;
  var jObj = JSON.parse(data);

  //Populate relid array
  for(var i = 0; i< jObj.RelIds.length; i++)
  {
    if(!(findIfNameExist(Relids, jObj.RelIds[i].Name)))
    {
      var rObj = new Object();
      rObj.Name = jObj.RelIds[i].Name;
      rObj.RelId = jObj.RelIds[i].RelId;
      Relids.push(rObj); 
    }
    else
    {
      console.log("duplicate relid found, not imported - " + jObj.RelIds[i].Name);
    }
  }

  //Populate profile array
  for(var j = 0; j< jObj.Profiles.length; j++)
  {
    if(!(findIfNameExist(profiles, jObj.Profiles[j].Name)))
    {
      var pObj = new Object();
      pObj.Name = jObj.Profiles[j].Name;
      pObj.Host = jObj.Profiles[j].Host;
      pObj.Port = jObj.Profiles[j].Port;
      pObj.RelId = jObj.Profiles[j].RelId;
      profiles.push(pObj);
    }
    else
    {
      console.log("duplicate profile found, not imported - " + jObj.Profiles[j].Name);
    }
  }

  $("#connList").empty();

  var jsonSelectedProfile = jObj.current_profile;
  if(typeof(jsonSelectedProfile) != 'undefined' && jsonSelectedProfile != null)
  {
    selectedProfile = jsonSelectedProfile;
  }

  var childNodes = document.getElementById("connList").children.length;
  if(childNodes > 0)
  {
    childNodes = childNodes + 1;
  }

  saveProfileSettings();
  for (var cnt = 0; cnt < profiles.length; cnt++)
  {
    if(profiles[cnt].Name == selectedProfile)
    {
      $("#connList").append("<li id=\"" + (childNodes + cnt) + "\" class='active' style='color:#539f07'>" + profiles[cnt].Name +"</li>");
    }
    else
    {
      $("#connList").append("<li id=\"" + (childNodes + cnt) + "\" style='color:black'>" + profiles[cnt].Name +"</li>");
    }
  }

  document.getElementById("connProWrapper").style.display = "block";
  $(function()
    {
      $("#connList li").click(function(e) {
        $("#connList li").removeClass('active');
        $("#connList li").css('color','black');
        $(this).addClass('active');
        $(this).css('color','#539f07');
        selectedProfile = this.innerHTML;
        saveProfileSettings();
      });
    }
  );
}
 
function importProfiles(event)
{
  var input = event.target;
  var reader = new FileReader();
  reader.onload = function(){
      importAndDisplayConnProfiles(reader.result)
    };
  reader.readAsText(input.files[0]);
}

function importDefaultConnProfiles()
{
  var fileTxt = readTextFile(defaultProfiles);
  if(null !== fileTxt)
  {
    importAndDisplayConnProfiles(fileTxt)
  }
  else
  {
    alert("Please import connection profile");
  }
}

function setVersion()
{
  var res;
  res = obj.getSdkVersion();
  document.getElementById("verDiv").innerHTML = res.response;
}

function getProfile(pName)
{
  if(pName !== "" && pName !== null && typeof(pName) !== 'undefined')
  {
    for (var i = 0; i < profiles.length ; i++)
    {
      if(profiles[i].Name === pName)
      {
        return profiles[i];
      }
    }
  }
  return null;
}

function getRelID(rName)
{
  if(typeof(rName) !== 'undefine' && rName !== "" && rName !== null)
  {
    for(var j = 0; j < Relids.length; j++)
    {
      if(Relids[j].Name === rName)
      {
        return Relids[j].RelId;
      }
    }
  }
  return "";
}

function saveProfileSettings()
{
  var connObj = new Object();
  if(typeof(selectedProfile) !== 'undefined' && selectedProfile !== null && selectedProfile !== "")
  {
    connObj.current_profile = selectedProfile;
  }
  connObj.Profiles  = profiles;
  connObj.RelIds = Relids;
  setKeyValueToIniFile("Connection", connObj);
}

function loadConfigFile(data)
{
  if(typeof(data) != 'undefined' && data != null && data != "")
  {
    var jObj = JSON.parse(data);
    if(typeof jObj.Connection == "undefined")
    {
      importDefaultConnProfiles();
    }
    else
    {
      var connData = JSON.stringify(jObj.Connection);
      importAndDisplayConnProfiles(connData);
    }
    
    if(typeof jObj.ProxySettings == "undefined")
    {
      document.getElementById("pxyHost").value = "";
      document.getElementById("pxyPort").value = 0;
      document.getElementById("pxyUsrNm").value = "";
      document.getElementById("pxyPswd").value = "";
      proxyObj.pxyHost = "";
      proxyObj.pxyPort = 0;
      proxyObj.pxyPass = "";
      proxyObj.pxyUser = "";
    }
    else
    {
      if(typeof(jObj.ProxySettings.pxyHost) !== "undefined" && jObj.ProxySettings.pxyHost !== "")
      {
       document.getElementById("pxyHost").value = jObj.ProxySettings.pxyHost;
       proxyObj.pxyHost = jObj.ProxySettings.pxyHost;
      }
      if(typeof(jObj.ProxySettings.pxyPort) !== "undefined" && jObj.ProxySettings.pxyPort !== "")
      {
       document.getElementById("pxyPort").value = jObj.ProxySettings.pxyPort;
       proxyObj.pxyPort = jObj.ProxySettings.pxyPort;
      }
      if(typeof(jObj.ProxySettings.pxyUsrNm) !== "undefined" && jObj.ProxySettings.pxyUsrNm !== "")
      {
       document.getElementById("pxyUsrNm").value = jObj.ProxySettings.pxyUsrNm;
       proxyObj.pxyUser = ProxySettings.pxyUsrNm;
      }
      if(typeof(jObj.ProxySettings.pxyPswd) !== "undefined" && jObj.ProxySettings.pxyPswd !== "")
      {
       document.getElementById("pxyPswd").value = jObj.ProxySettings.pxyPswd;
       proxyObj.pxyPass = jObj.ProxySettings.pxyPswd
      }
    }
  }
  else
  {
    console.log("Invalid config file data");
    importDefaultConnProfiles();
  }
}

function displayNextFrame()
{
  if(appState == "actcode")
  {
    displayActivationFrame();
  }
  else if(appState == "pass")
  {
    displayPswdFrame();
  }
  else if(appState == "secqa")
  {
    displaySecQAFrame();
  }
  else if(appState == "secondarySecqa")
  {
    displaySecQAFrame();
  }
  else if(appState == "devbind")
  {
    displayDeviceBindingFrame();
  }
  else if(appState == "devname")
  {
    displayDeviceAliasFrame();
  }
  else if(appState == "sserloggedin")
  {
    displayHomePage();
  }
  else if(appState == "otp")
  {
    displayOTPFrame();
  }
}

function displayUpdateFrames()
{  
  if(updateOP == "pass")
  {
    displayPswdFrame();
  }
  else if(updateOP == "secqa")
  {
    displaySecQAFrame();
  }
}

function ResetState()
{
  resetChallenges();
}

function clearQuestions()
{
  var childArray = document.getElementById("questionList").children;
  if ( childArray.length > 0 )
  {
    document.getElementById("questionList").removeChild( childArray[ 0 ] );
    clearQuestions();
  }
}

function hideCurrentFrame()
{
  if(appState == "Startup")
  {
    document.getElementById("loginFrm").style.display = "none";
  }
  else if(appState == "checkuser")
  {
    hideLoginfrm();
  }
  else if(appState == "pass")
  {
    hideLoginfrm();
  }
  else if(appState == "actcode")
  {
    document.getElementById("activationFrm").style.display = "none";
    document.getElementById("activationCode").value = "";
  }
  else if(appState == "secqa" || appState == "secondarySecqa")
  {
    hideSecQAForm();
  }
  else if(appState == "devbind")
  {
    document.getElementById("devBindFrm").style.display = "none";
  }
  else if(appState == "devname")
  {
    document.getElementById("devNameFrm").style.display = "none";
  }
  else if(appState == "otp")
  {
    document.getElementById("otpCode").value = "";
    document.getElementById("otpKey").value = "";
    document.getElementById("otpFrm").style.display = "none";
  }
  else if(appState == "sserloggedin")
  {
    document.getElementById("myDIV").style.display = "block";
    document.getElementById("switchUserLink").style.display = "none";
    document.getElementById("homePage").style.display = "none";
  }
}

function displaySecQAFrame()
{
  document.getElementById("myDIV").style.opacity = "100";
  document.getElementById("myDIV").style.display = "block";
  document.getElementById("Login").style.display = "none";
  document.getElementById("loginPGB").style.marginLeft = "70px";
  document.getElementById("loginPGB").innerHTML = "";
  document.getElementById("secQAFrm").style.display = "block";
  document.getElementById("secQAFrm").reset();
  clearQuestions();
   
  if(updateOP == "secqa" && (chlngName == "secqa" || chlngName == "secondarySecqa"))
  {
    document.getElementById("secQAHeader").innerHTML = "Change Secret Questions";  
    document.getElementById("secQAFrmSubmitBtn").style.display = "none";
    document.getElementById("updateQuesBtns").style.display = "block";

    if(updateChlngJsonObj[updateChlngIdx].challengeOperation == 1)
    {
     document.getElementById("secqaAttemptsLeft").style.display = "none";
      
     for(var i =0; i < updateChlngJsonObj[updateChlngIdx].chlng_prompt[0].length; i++)
     {
       var opt = $("<option></option>").attr("value", (updateChlngJsonObj[updateChlngIdx].chlng_prompt[0])[i]).html((updateChlngJsonObj[updateChlngIdx].chlng_prompt[0])[i]);
       $("#questionList").append(opt);
     }
     $("#questionList").prop("selectedIndex", -1);
     document.getElementById("txtQuestions").disabled = false;
     document.getElementById("txtQuestions").focus();
    }
    else
    {
     if(updateChlngJsonObj[updateChlngIdx].chlng_prompt[0].length > 0)
     {
       document.getElementById("txtQuestions").disabled = true;
       document.getElementById("txtQuestions").value = updateChlngJsonObj[updateChlngIdx].chlng_prompt[0];
     }
     document.getElementById("secretAns").focus();
    }

    //set labels
    for(var i = 0; i < updateChlngJsonObj[updateChlngIdx].chlng_info.length; i++)
    {
     if(updateChlngJsonObj[updateChlngIdx].chlng_info[i].key == "Prompt label")
     {
       document.getElementById("secQA").innerHTML = updateChlngJsonObj[updateChlngIdx].chlng_info[i].value;
     }
     else if(updateChlngJsonObj[updateChlngIdx].chlng_info[i].key == "Response label")
     {
       document.getElementById("secAns").innerHTML = updateChlngJsonObj[updateChlngIdx].chlng_info[i].value;
       document.getElementById("activationCode").placeholder = updateChlngJsonObj[updateChlngIdx].chlng_info[i].value;
     }
     else if(updateChlngJsonObj[updateChlngIdx].chlng_info[i].key == "Description")
     {
       document.getElementById("description").innerHTML = updateChlngJsonObj[updateChlngIdx].chlng_info[i].value;
     }
    }
  }
  else if(updateOP == "")
  {
    document.getElementById("secQAHeader").innerHTML = "Secret Questions";
    document.getElementById("updateQuesBtns").style.display = "none";
    if(intermediateChlngJsonObj[currentChlngIdx].challengeOperation == 1)
    {
     document.getElementById("secqaAttemptsLeft").style.display = "none";
     for(var i =0; i < intermediateChlngJsonObj[currentChlngIdx].chlng_prompt[0].length; i++)
     {
       var opt = $("<option></option>").attr("value", (intermediateChlngJsonObj[currentChlngIdx].chlng_prompt[0])[i]).html((intermediateChlngJsonObj[currentChlngIdx].chlng_prompt[0])[i]);
       $("#questionList").append(opt);
     }
     $("#questionList").prop("selectedIndex", -1);
     document.getElementById("txtQuestions").disabled = false;
     document.getElementById("txtQuestions").focus();
    }
    else
    {
     if(intermediateChlngJsonObj[currentChlngIdx].chlng_prompt[0].length > 0)
     {
       document.getElementById("txtQuestions").disabled = true;
       document.getElementById("txtQuestions").value = intermediateChlngJsonObj[currentChlngIdx].chlng_prompt[0];
     }
     document.getElementById("secretAns").focus();
    }

    //set labels
    for(var i = 0; i < intermediateChlngJsonObj[currentChlngIdx].chlng_info.length; i++)
    {
     if(intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].key == "Prompt label")
     {
       document.getElementById("secQA").innerHTML = intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].value;
     }
     else if(intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].key == "Response label")
     {
       document.getElementById("secAns").innerHTML = intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].value;
       document.getElementById("activationCode").placeholder = intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].value;
     }
     else if(intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].key == "Description")
     {
       document.getElementById("description").innerHTML = intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].value;
     }
    }
  }
}

function displayPswdFrame()
{
  if(updateOP == "pass")
  {
    document.getElementById("myDIV").style.opacity = "100";
    document.getElementById("myDIV").style.display = "block";
    document.getElementById("Login").style.display = "none";
    document.getElementById("loginPGB").style.marginLeft = "70px";
    document.getElementById("loginPGB").innerHTML = "";      
    document.getElementById("homePage").style.display = "none";
    document.getElementById("loginFrm").style.display = "block"
    
    document.getElementById("pswdField").style.display = "block";
    document.getElementById("confirmpswdField").style.display = "block";
    document.getElementById("confirmpswdField").value = "";
    
    document.getElementById("confirmpswdField").placeholder = "Confirm Password";
    document.getElementById("pswdField").placeholder = "Enter Password"
    
    document.getElementById("sForgotPswd").style.display = "none";
    document.getElementById("pswdAttemptsLeft").innerHTML = "";
    document.getElementById('loginHeader').innerHTML = "Change Pin"
    document.getElementById("loginFrmBtns").style.display = "none";
    document.getElementById("updatePwdBtns").style.display = "block";
    
    for(var i = 0; i < updateChlngJsonObj[updateChlngIdx].chlng_info.length; i++)
    {
      if(updateChlngJsonObj[updateChlngIdx].chlng_info[i].key == "Response label")
      {
        document.getElementById("pswdField").placeholder = updateChlngJsonObj[updateChlngIdx].chlng_info[i].value;
      }
      else if(updateChlngJsonObj[updateChlngIdx].chlng_info[i].key == "Confirm response label")
      {
        document.getElementById("confirmpswdField").placeholder = updateChlngJsonObj[updateChlngIdx].chlng_info[i].value;
      }
      else if(updateChlngJsonObj[updateChlngIdx].chlng_info[i].key == "Description" || 
              updateChlngJsonObj[updateChlngIdx].chlng_info[i].key == "description" )
      {
        document.getElementById("userfrmDescription").innerHTML = updateChlngJsonObj[updateChlngIdx].chlng_info[i].value;
      }
    }
    document.getElementById("pswdField").focus();
  }
  else if(updateOP == "")
  {
    //hide current basic buttons frame
    document.getElementById("landingPage").style.display = "none";
    
    //hide init frame
    document.getElementById("fountainG").style.display = "none";
    document.getElementById("initFrm").style.display = "none";
    
    //display user frame
    document.getElementById("myDIV").style.opacity = "100";
    document.getElementById("myDIV").style.display = "block";
    document.getElementById("btnSettings").style.display = "none";
    document.getElementById("loginFrm").style.display = "block";
    document.getElementById("userIDField").style.display = "none";
    document.getElementById("loginFrmSubmitBtn").value = "Submit";
    document.getElementById("pswdField").style.display = "block";
    document.getElementById("confirmpswdField").style.display = "block";
    document.getElementById("switchUserLink").style.display = "block";
    document.getElementById("userfrmDescription").style.display = "block";
    document.getElementById("updatePwdBtns").style.display = "none";
    document.getElementById("confirmpswdField").placeholder = "Confirm Password";
    document.getElementById("pswdField").placeholder = "Enter Password"
    document.getElementById("homePage").style.display = "none";
    document.getElementById("loginFrmBtns").style.display = "block";
    
    for(var i = 0; i < intermediateChlngJsonObj[currentChlngIdx].chlng_info.length; i++)
    {
      if(intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].key == "Response label")
      {
        document.getElementById("pswdField").placeholder = intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].value;
      }
      else if(intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].key == "Confirm response label")
      {
        document.getElementById("confirmpswdField").placeholder = intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].value;
      }
      else if(intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].key == "Description" || 
              intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].key == "description")
      {
        document.getElementById("userfrmDescription").innerHTML = intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].value;
      }
    }
    
    attempts_Left = intermediateChlngJsonObj[currentChlngIdx].attempts_left;
    if(typeof(attempts_Left) !== 'undefined' && attempts_Left !== null && attempts_Left > 0)
    {
      document.getElementById("pswdAttemptsLeft").innerHTML = "Attempts Left: " + attempts_Left;
    }
    else
    {
      document.getElementById("pswdAttemptsLeft").style.display = "none";
    }
    
    if(intermediateChlngJsonObj[currentChlngIdx].challengeOperation == 1)
    {
      document.getElementById("pswdAttemptsLeft").style.display = "none";
      document.getElementById("sForgotPswd").style.display = "none";
    }
    else
    {
      document.getElementById("confirmpswdField").style.display = "none";
      document.getElementById("sForgotPswd").style.display = "block";
    }
    document.getElementById("pswdField").focus();
   }
}

function displayUserIDPswdFrame(label)
{
  var labelTxt = "Enter User ID";
  if(typeof(label) !== 'undefined' && label !== null && label.length > 0)
  {
    labelTxt = label;
  }
  
  //hide current basic buttons frame
  document.getElementById("landingPage").style.display = "none";
  
  //hide init frame
  document.getElementById("fountainG").style.display = "none";
  document.getElementById("initFrm").style.display = "none";
  
  //display user frame
  document.getElementById("myDIV").style.opacity = "100";
  document.getElementById("myDIV").style.display = "block";
  document.getElementById("btnSettings").style.display = "none";
  document.getElementById("loginFrm").style.display = "block";
  document.getElementById("userIDField").style.display = "block";
  document.getElementById("userIDField").placeholder = labelTxt;
  document.getElementById("loginFrmSubmitBtn").value = "Submit";
  document.getElementById("pswdField").style.display = "none";
  document.getElementById("confirmpswdField").style.display = "none";
  document.getElementById("sForgotPswd").style.display = "none";
  document.getElementById("switchUserLink").style.display = "none";
  document.getElementById("userIDField").focus();
  document.getElementById("loginHeader").innerHTML = "Login to your account";
  document.getElementById("pswdAttemptsLeft").innerHTML = "";
  document.getElementById("loginFrmSubmitBtn").style.display = "block";
  document.getElementById("updatePwdBtns").style.display = "none";
  document.getElementById("userfrmDescription").style.display = "none";
}

function displayActivationFrame()
{
  var attempts_Left = 0;
  document.getElementById("myDIV").style.opacity = "100";
  document.getElementById("myDIV").style.display = "block";
  document.getElementById("Login").style.display = "none";
  document.getElementById("loginPGB").style.marginLeft = "70px";
  document.getElementById("loginPGB").innerHTML = "";
  document.getElementById("activationFrm").style.display = "block";
  document.getElementById("switchUserLink").style.display = "block";
  
  //set labels
  for(var i = 0; i < intermediateChlngJsonObj[currentChlngIdx].chlng_info.length; i++)
  {
    if(intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].key == "Prompt label")
    {
      document.getElementById("promptLabel").innerHTML = intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].value;
    }
    else if(intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].key == "Response label")
    {
      document.getElementById("respLabel").innerHTML = intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].value;
      document.getElementById("activationCode").placeholder = intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].value;
    }
    else if(intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].key == "Description")
    {
      document.getElementById("description").innerHTML = intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].value;
    }
  }
  attempts_Left = intermediateChlngJsonObj[currentChlngIdx].attempts_left;
  if(typeof(attempts_Left) !== 'undefined' && attempts_Left !== null && attempts_Left > 0)
  {
    document.getElementById("attemptsLeft").innerHTML = "Attempts Left: " + attempts_Left;
  }
  else
  {
    document.getElementById("attemptsLeft").style.display = "none";
  }
  
  if(intermediateChlngJsonObj[currentChlngIdx].chlng_prompt.length > 0)
  {
    document.getElementById("verificationKey").value = intermediateChlngJsonObj[currentChlngIdx].chlng_prompt[0];
  }
  else
  {
    alert("Error! invalid specs received! kindly relogin again.");
  }
  
  document.getElementById("activationCode").focus();
}

function displayDeviceBindingFrame()
{
  var attempts_Left = 0;
  document.getElementById("myDIV").style.opacity = "100";
  document.getElementById("myDIV").style.display = "block";
  document.getElementById("Login").style.display = "none";
  document.getElementById("loginPGB").style.marginLeft = "70px";
  document.getElementById("loginPGB").innerHTML = "";
  document.getElementById("devBindFrm").style.display = "block";
  
  //set labels
  for(var i = 0;  i < intermediateChlngJsonObj[currentChlngIdx].chlng_info.length; i++)
  {
    if(intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].key == "Response label")
    {
      document.getElementById("respLabel").innerHTML = intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].value;
    }
    else if(intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].key == "description")
    {
      //document.getElementById("devBindLbl").innerHTML = intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].value;
    }
  }
  attempts_Left = intermediateChlngJsonObj[currentChlngIdx].attempts_left;
  if(typeof(attempts_Left) !== 'undefined' && attempts_Left !== null && attempts_Left > 0)
  {
    document.getElementById("attemptsLeft").innerHTML = "Attempts Left: " + attempts_Left;
  }
  else
  {
    document.getElementById("attemptsLeft").style.display = "none";
  }
}

function displayDeviceAliasFrame()
{
  var attempts_Left = 0;
  document.getElementById("myDIV").style.opacity = "100";
  document.getElementById("myDIV").style.display = "block";
  document.getElementById("Login").style.display = "none";
  document.getElementById("loginPGB").style.marginLeft = "70px";
  document.getElementById("loginPGB").innerHTML = "";
  document.getElementById("devNameFrm").style.display = "block";
  
  //set labels
  for(var i = 0;  i < intermediateChlngJsonObj[currentChlngIdx].chlng_info.length; i++)
  {
    if(intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].key == "Update Device Name")
    {
      document.getElementById("updateDevNameLbl").innerHTML = intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].value;
    }
  }
  for(var i = 0;  i < intermediateChlngJsonObj[currentChlngIdx].chlng_resp.length; i++)
  {
    if(intermediateChlngJsonObj[currentChlngIdx].chlng_resp[i].challenge == "devname")
    {
      document.getElementById("deviceNameTxtBox").value = intermediateChlngJsonObj[currentChlngIdx].chlng_resp[i].response;
    }
  }
  attempts_Left = intermediateChlngJsonObj[currentChlngIdx].attempts_left;
  if(typeof(attempts_Left) !== 'undefined' && attempts_Left !== null && attempts_Left > 0)
  {
    document.getElementById("attemptsLeft").innerHTML = "Attempts Left: " + attempts_Left;
  }
  else
  {
    document.getElementById("attemptsLeft").style.display = "none";
  }

  document.getElementById("deviceNameTxtBox").focus();
}

function showInitialiChlngFrame()
{
  if(typeof(initChlng) !== 'undefined' && initChlng !== null && typeof(appState) !== 'undefined' && appState !== null)
  {
    var RespdataObj = JSON.parse(initChlng.ResponseData);
    appState = RespdataObj.chlng[0].chlng_name;
    if(appState == "checkuser")
    {
      displayUserIDPswdFrame(RespdataObj.chlng[0].chlng_info[0].key);
    }
    else
    {
      alert("Invalid initial challenge");
    }
  }
  else
  {
    alert("invalid application state please restart the application.");
  }
}

function displayOTPFrame()
{
  var attempts_Left = 0;
  document.getElementById("myDIV").style.opacity = "100";
  document.getElementById("myDIV").style.display = "block";
  document.getElementById("Login").style.display = "none";
  document.getElementById("loginPGB").style.marginLeft = "70px";
  document.getElementById("loginPGB").innerHTML = "";
  document.getElementById("otpFrm").style.display = "block";

  //set labels
  for(var i = 0; i < intermediateChlngJsonObj[currentChlngIdx].chlng_info.length; i++)
  {
    if(intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].key == "Prompt label")
    {
      document.getElementById("otpPromptlabel").innerHTML = intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].value;
    }
    else if(intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].key == "Response label")
    {
      document.getElementById("otpRespLabel").innerHTML = intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].value;
      document.getElementById("otpCode").placeholder = intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].value;
    }
    else if(intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].key == "description")
    {
      document.getElementById("otpDescription").innerHTML = intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].value;
    }
  }
  
  attempts_Left = intermediateChlngJsonObj[currentChlngIdx].attempts_left;
  if(typeof(attempts_Left) !== 'undefined' && attempts_Left !== null && attempts_Left > 0)
  {
    document.getElementById("otpAttemptsLeft").innerHTML = "Attempts Left: " + attempts_Left;
  }
  else
  {
    document.getElementById("attemptsLeft").style.display = "none";
  }
  
  if(intermediateChlngJsonObj[currentChlngIdx].chlng_prompt.length > 0)
  {
    document.getElementById("otpKey").value = intermediateChlngJsonObj[currentChlngIdx].chlng_prompt[0];
  }
  else
  {
    alert("Error! invalid specs received! kindly relogin again.");
  }
  document.getElementById("otpCode").focus();
}

function displayHomePage()
{
    document.getElementById("myDIV").style.display = "block";
    document.getElementById("switchUserLink").style.display = "none";
    document.getElementById("homePage").style.display = "block";
}
/*----------------------------------------------------------------------------------------------------------------------------------------*/
function addOptions(values)
{
  var opt = document.createElement('option');
  opt.value = values;
  opt.innerHTML = values;
  return opt;
}

function displaySelfDeviceMgmtFrame()
{
  var index = 0;
  document.getElementById("myDIV").style.opacity = "100";
  document.getElementById("myDIV").style.display = "block";
  document.getElementById("Login").style.display = "none";
  document.getElementById("loginPGB").style.marginLeft = "70px";
  document.getElementById("loginPGB").innerHTML = "";
  document.getElementById("selfDevMgmtFrm").style.display = "block";  
  
  var selectPerDevice = document.getElementById('selectPermanentList');
  var selectTempDevice = document.getElementById('selectTempList');
  
  $('#selectPermanentList').empty();
  $('#selectTempList').empty();
  
  var defaultValPerm = addOptions("Select Device");
  var defaultValTemp = addOptions("Select Device");
  selectPerDevice.appendChild(defaultValPerm);
  selectTempDevice.appendChild(defaultValTemp);
      
  for(var i = 0; i < devDetailsJsonObj.Permanent.length; i++)
  {
    if(devDetailsJsonObj.Permanent[i].devName != "")
    {
      var opt = addOptions(devDetailsJsonObj.Permanent[i].devName);
      selectPerDevice.appendChild(opt);
    }
  }
  
  for(var i = 0; i < devDetailsJsonObj.Temporary.length; i++)
  {
    if(devDetailsJsonObj.Temporary[i].devName != "")
    {
      var opt = addOptions(devDetailsJsonObj.Permanent[i].devName);
      selectTempDevice.appendChild(opt);
    }
  }
}

function showPermDevDetailsModal()
{
  var selectedElement = document.getElementById("selectPermanentList");
  var strUser = selectedElement.options[selectedElement.selectedIndex].value;
  perSelectedDev = strUser;

  document.getElementById("deviceTypeLbl").innerHTML = "Device Type";
  document.getElementById("deviceTypeValLbl").innerHTML = "Permanent";
  for(var i = 0;  i < devDetailsJsonObj.Permanent.length; i++)
  {
    if(strUser == devDetailsJsonObj.Permanent[i].devName)
    {
      if(devDetailsJsonObj.Permanent[i].devName != "")
      {
        document.getElementById("devDetailsTxtBox").value = devDetailsJsonObj.Permanent[i].devName;
      }
      if(devDetailsJsonObj.Permanent[i].status != "")
      {
        document.getElementById("statusKeyLbl").innerHTML = "Status";
        document.getElementById("statusValLbl").innerHTML = devDetailsJsonObj.Permanent[i].status;
      }
      if(devDetailsJsonObj.Permanent[i].createdTs != "")
      {
        document.getElementById("createdTsKeyLbl").innerHTML = "Created on";
        document.getElementById("createdTsValLbl").innerHTML = devDetailsJsonObj.Permanent[i].createdTs;
      }
      if(devDetailsJsonObj.Permanent[i].lastAccessedTs != "")
      {
        document.getElementById("lastAccessedTsKeyLbl").innerHTML = "Last Accessed On";
        document.getElementById("lastAccessedTsValLbl").innerHTML = devDetailsJsonObj.Permanent[i].lastAccessedTs;
      }
      if(devDetailsJsonObj.Permanent[i].lastLoginStatus != "")
      {
        document.getElementById("lastLoginStatusKeyLbl").innerHTML = "Last Login Status";
        document.getElementById("lastLoginStatusValLbl").innerHTML = devDetailsJsonObj.Permanent[i].lastLoginStatus;
      }
    }
  }

  var span = document.getElementsByClassName("close")[0];
  span.onclick = function()
  {
    modal.style.display = "none";
  }
  
  var modal = document.getElementById('devDetailsModal');
  modal.setAttribute("style", "display: block");
}

function showTempDevDetailsModal()
{
  var selectedElement = document.getElementById("selectTempList");
  var strUser = selectedElement.options[selectedElement.selectedIndex].value;
  tempSelectedDev = strUser;
  
  document.getElementById("deviceTypeLbl").innerHTML = "Device Type";
  document.getElementById("deviceTypeValLbl").innerHTML = "Temporary";
  for(var i = 0;  i < devDetailsJsonObj.Temporary.length; i++)
  {
    if(strUser == devDetailsJsonObj.Temporary[i].devName)
    {
      if(devDetailsJsonObj.Temporary[i].devName != "")
      {
        document.getElementById("devDetailsTxtBox").value = devDetailsJsonObj.Temporary[i].devName;
      }
      if(devDetailsJsonObj.Temporary[i].status != "")
      {
        document.getElementById("statusKeyLbl").innerHTML = "Status";
        document.getElementById("statusValLbl").innerHTML = devDetailsJsonObj.Temporary[i].status;
      }
      if(devDetailsJsonObj.Temporary[i].createdTs != "")
      {
        document.getElementById("createdTsKeyLbl").innerHTML = "Created on";
        document.getElementById("createdTsValLbl").innerHTML = devDetailsJsonObj.Temporary[i].createdTs;
      }
      if(devDetailsJsonObj.Temporary[i].lastAccessedTs != "")
      {
        document.getElementById("lastAccessedTsKeyLbl").innerHTML = "Last Accessed On";
        document.getElementById("lastAccessedTsValLbl").innerHTML = devDetailsJsonObj.Temporary[i].lastAccessedTs;
      }
      if(devDetailsJsonObj.Temporary[i].lastLoginStatus != "")
      {
        document.getElementById("lastLoginStatusKeyLbl").innerHTML = "Last Login Status";
        document.getElementById("lastLoginStatusValLbl").innerHTML = devDetailsJsonObj.Temporary[i].lastLoginStatus;
      }
    }
  }
  
  var span = document.getElementsByClassName("close")[0];
  span.onclick = function()
  {
    modal.style.display = "none";
  }
  
  var modal = document.getElementById('devDetailsModal');
  modal.setAttribute("style", "display: block");
}

function delDeviceDetails(list)
{
  var selectPerDevice = document.getElementById('selectPermanentList');
  var selectTempDevice = document.getElementById('selectTempList');
  var selectedListElement = document.getElementById(list);
  var strSelectedDevName = selectedListElement.options[selectedListElement.selectedIndex].value;
  
  if(typeof(strSelectedDevName) != 'undefined' && strSelectedDevName != "Select Device")
  {
    if(list === 'selectPermanentList')
    {
      for(var i = 0;  i < devDetailsJsonObj.Permanent.length; i++)
      {
        if(strSelectedDevName == devDetailsJsonObj.Permanent[i].devName)
        {
          devDetailsJsonObj.Permanent[i].status = "Delete";
        }
      }
    }
    else if(list === 'selectTempList')
    {
      for(var i = 0;  i < devDetailsJsonObj.Temporary.length; i++)
      {
        if(strSelectedDevName == devDetailsJsonObj.Temporary[i].devName)
        {
          devDetailsJsonObj.Temporary[i].status = "Delete";
        }
      }
    }
    selectedListElement.selectedIndex = 0;
  }
  else  
  {
    alert("Please Select Device to Delete");  
  } 
}

function saveDevDetails()
{
  var updatedDevName = document.getElementById("devDetailsTxtBox").value;
  var deviceList = document.getElementById("deviceTypeValLbl").innerHTML;
  if(typeof(updatedDevName) == 'undefined' || updatedDevName == null || updatedDevName == "")
  {
    alert("Device name can not be empty");
  }
  else if(typeof(deviceList) == 'undefined' || deviceList == null || deviceList.length < 1)
  {
    alert("Invalid device type.");
  }
  
  if(deviceList == "Permanent")
  {
    var selectPerDevice = document.getElementById('selectPermanentList');
    for(var i = 0;  i < devDetailsJsonObj.Permanent.length; i++)
    {
      if(perSelectedDev == devDetailsJsonObj.Permanent[i].devName)
      {
        devDetailsJsonObj.Permanent[i].devName = updatedDevName;
        devDetailsJsonObj.Permanent[i].status = "Update"
      }
    }
    
    for(var i = 0;  i < selectPerDevice.options.length; i++)
    {
      selectPerDevice.options[i] = null;		
    }
    
    selectPerDevice.options[0].value = "Select Device";
    selectPerDevice.options[0].text = "Select Device";
  }
  else if(deviceList == "Temporary")
  {
    var selectTempDevice = document.getElementById('selectTempList');

    
    for(var i = 0;  i < devDetailsJsonObj.Temporary.length; i++)
    {
      if(tempSelectedDev == devDetailsJsonObj.Temporary[i].devName)
      {
        devDetailsJsonObj.Temporary[i].devName = updatedDevName;
        devDetailsJsonObj.Temporary[i].status = "Update";
      }
    }
    for(var i = 0;  i < selectTempDevice.options.length; i++)
    {
      selectTempDevice.options[i] = null;		
    }
    
    selectTempDevice.options[0].value = "Select Device";
    selectTempDevice.options[0].text = "Select Device"; 
  }
  displaySelfDeviceMgmtFrame();
  
  alert("Device details updated successfully");
}

function submitDevDetails()
{
  var retCode = 0;
  displayLoginPGbar("Updating details please wait.");
  devDetails.device_details = devDetailsJsonObj;
  var updatedDevDetails = JSON.stringify(devDetails);
  
  retCode = updateDeviceDetails(ssnUserName, updatedDevDetails);
  if(0 != retCode)
  {
    alert("Operation failed with error code - " + retCode);
    hideLoginProgressBar();
  }
}
/*----------------------------------------------------------------------------------------------------------------------------------------*/
function btnSubmitClicked()
{
  if(appState == "checkuser")
  {
    var userID = document.getElementById("userIDField").value;
    if(typeof(userID) == 'undefined' || userID == null || userID.length < 1)
    {
      alert("Please enter valid user name");
      return;
    }
    displayLoginPGbar();
    formatInitialChallengeresponse(userID.trim());
  }
  else
  {
    if(appState == "pass")
    {
        if(intermediateChlngJsonObj[currentChlngIdx].challengeOperation == 1)
        {
          document.getElementById("pswdAttemptsLeft").style.display = "none";
        }
        else
        {
          document.getElementById("confirmpswdField").style.display = "none";
        }
      var pswd = document.getElementById("pswdField").value.trim();
      var confirmPswd = document.getElementById("confirmpswdField").value.trim();
      if(typeof(pswd) == 'undefined' || pswd == null || pswd.length < 1)
      {
        alert("Please provide password for you account.");
        return;
      }
      else if(intermediateChlngJsonObj[currentChlngIdx].challengeOperation == 1 && (typeof(confirmPswd) == 'undefined' || confirmPswd == null || confirmPswd.length < 1))
      {
        alert("Please confirm password.");
        return;
      }
      else if(intermediateChlngJsonObj[currentChlngIdx].challengeOperation == 1 && (pswd !== confirmPswd))
      {
        alert("Password and confirm password do not match, please try again.");
        return;
      }
      displayLoginPGbar();
      formatPasswordResp(pswd);
    }
    else if(appState == "actcode")
    {
      var actCode = document.getElementById("activationCode").value.trim();
      if(typeof(actCode) == 'undefined' || actCode == null || actCode.length < 1)
      {
        alert("Invalid input provided!");
        return;
      }
      displayLoginPGbar();
      formatActcodeChlngResp(actCode);
    }
    else if(appState == "secqa" || appState == "secondarySecqa")
    {
      var secrectQues = document.getElementById("txtQuestions").value.trim();
      var secretAns = document.getElementById("secretAns").value.trim();
      if(typeof(secrectQues) == 'undefined' || secrectQues == null || secrectQues.length < 1 || typeof(secretAns) == 'undefined' || secretAns == null || secretAns.length < 1)
      {
        alert("Invalid input provided!");
        return;
      }
      displayLoginPGbar();
      formatSecQAChlngResp(secrectQues, secretAns);
    }
    else if(appState == "devbind")
    {
      var devBindValue = document.getElementById("devBinding");
      var isPermanentDevice = "false";
      if(typeof(devBindValue) != 'undefined' && devBindValue != null && devBindValue.checked == true)
      {
        isPermanentDevice = "true";
      }
      displayLoginPGbar();
      formatDevBindingResp(isPermanentDevice);
    }
    else if(appState == "devname")
    {
      var devName = document.getElementById("deviceNameTxtBox").value.trim();
      if(typeof(devName) == 'undefined' || devName == null || devName.length < 1)
      {
        alert("Invalid input provided!");
        return;
      }
      displayLoginPGbar();
      formatDevAliasResp(devName);
    }
    else if(appState == "otp")
    {
      var otp = document.getElementById("otpCode").value.trim();
      if(typeof(otp) == 'undefined' || otp == null || otp.length < 1)
      {
        alert("Invalid input provided!");
        return;
      }
      displayLoginPGbar();
      formatOTPChlngResp(otp);
    }
    else if(appState == "sserloggedin")
    {
      if(updateOP == "pass")
      {
        var pswd = document.getElementById("pswdField").value.trim();
        var confirmPswd = document.getElementById("confirmpswdField").value.trim();
        if(typeof(pswd) == 'undefined' || pswd == null || pswd.length < 1)
        {
          alert("Please provide old password for you account.");
          return;
        }   
        else if(typeof(confirmPswd) == 'undefined' || confirmPswd == null || confirmPswd.length < 1)
        {
          alert("Please confirm new password for you account.");
          return;
        }
        else if(pswd !== confirmPswd)
        {
          alert("New password and confirm password do not match, please try again.");
          return;
        }
        displayLoginPGbar("Updating password, Please wait");
        formatUpdatePasswordResp(pswd);
      }
      else if(updateOP == "secqa")
      {
       var secrectQues = document.getElementById("txtQuestions").value.trim();
       var secretAns = document.getElementById("secretAns").value.trim();
       if(typeof(secrectQues) == 'undefined' || secrectQues == null || secrectQues.length < 1 || typeof(secretAns) == 'undefined' || secretAns == null || secretAns.length < 1)
       {
         alert("Invalid input provided!");
         return;
       }
       displayLoginPGbar("Updating Secret Questions, Please wait");
       formatUpdateSecQAChlngResp(secrectQues, secretAns);
      }
    }
  }
}

function btnCancelClicked(formId)
{
  document.getElementById(formId).style.display = "none";
  document.getElementById(formId).reset();
  updateOP = "";
  displayHomePage();
}

function loginFrmbtnCancelClicked()
{
  document.getElementById('switchUserLink').style.display = "none";
  hideLoginfrm();
  if(validation_type == 2)
  {
    var ret = confirm("Are you sure you want to go back?");
    if (ret == true)
    {
      displayHomePage();
    }
    else
    {
      displayPswdFrame();
    }
    validation_type = 1;
  }
  else
  {
     onInitialized();
  }
}

function doLogOff()
{
  displayLoginPGbar();
  logOff(ssnUserName);
}

function onLogOffFailed(err)
{
  hideLoginProgressBar();
  alert("LogOff activity failed with error : " + err);
}

function loggedOff()
{
  hideLoginProgressBar();
  document.getElementById("homePage").style.display = "none";
  document.getElementById("landingPage").style.display = "block";
}

function selectionChanged()
{
  var elem = document.getElementById("questionList");
  document.getElementById("txtQuestions").value = elem.options[elem.selectedIndex].value
}

function switchUser()
{
  var err = 0;
  displayLoginPGbar("Please wait");
  err = resetChallenges();
  if(0 == err)
  {
    hideCurrentFrame();
    showInitialiChlngFrame(); 
  }
  else
  {
    alert("Unable to perform activity. Error code - " + err);
  }
  hideLoginProgressBar();
}

function handleDeviceMgmt()
{
  var retCode = 0;
  displayLoginPGbar("fetching device information, please wait.");
  if(typeof(ssnUserName) == 'undefined' || ssnUserName == null || ssnUserName.length < 1)
  {
    alert("Application state is invalid please login again!");
    hideLoginProgressBar();
    return;
  }
  
  retCode = getRegistredDeviceDetails(ssnUserName);
  if(0 != retCode)
  {
    alert("Unable to fetch device details, error code - " + retCode);
    hideLoginProgressBar();
  }
}

function handlePostLoginChlng()
{
  displayLoginPGbar("Please wait");
  if(typeof(ssnUserName) != 'undefined' && ssnUserName != null && ssnUserName.length > 0)
  {
    var retCode = 0;
    retCode = getPostLoginChallenges(ssnUserName, "verifyChallenge");
    if(0 != retCode)
    {
      hideLoginProgressBar();
      alert("Unable to fetch authentication data..cannot perform activity.");
    }
  }
  else
  {
    alert("Application state is invalid please login again!");
    hideLoginProgressBar();
    return;
  }
}

function handleChangeRequest(api)
{
  var retCode = 0;
  displayLoginPGbar("Completing you request, please wait.");
  if(typeof(ssnUserName) == 'undefined' || ssnUserName == null || ssnUserName.length < 1)
  {
    alert("Application state is invalid please login again!");
    hideLoginProgressBar();
    return;
  }
  
  if(typeof(api) == 'undefined' || api == null || api.length < 1)
  {
    alert("Please try again!");
    hideLoginProgressBar();
    return;
  }
  
  if(api == "Change Pin")
  {
    updateOP = "pass";
  }
  else if(api == "Change SecQA")
  {
    updateOP = "secqa";
  }
  
  retCode = getAllChallenges(ssnUserName);
  if(0 != retCode)
  {
    alert("Unable to change pin, error code - " + retCode);
    hideLoginProgressBar();
  }
}

/*401 popup handling*/
function showAuthPopup(hostString)
{
  var spanClose = document.getElementsByClassName("close")[0];
  document.getElementById('iwaCreds').style.display = "block";
  document.getElementById('authModal').style.display = "block";
  
  document.getElementById('hostName').innerHTML = hostString + " says :";
  document.getElementById('hostName').actualHostName = hostString;
  spanClose.onclick =
  function()
  {
    submitAuthDetails(1);
    document.getElementById('iwaCreds').style.display = "none";
    document.getElementById('authModal').style.display = "none";  
  }
}

function submitAuthDetails(authStatus)
{
  var userName = "";
  var pass = "";
  var hostName = "";
  var err = null;

  hostName = document.getElementById('hostName').actualHostName;  
  if(authStatus == 0)
  {
    userName = document.getElementById('userName').value;
    pass = document.getElementById('password').value;
    if(userName == "")
    {
      alert("Please provide Username");
      return;
    }
    else if(pass == "")
    {
      alert("Please provide Password");
      return;
    }
  }
  else
  {
    authStatus = 1;
  }

  err = setIWACreds(hostName, userName, pass, authStatus);
  if(err.errorCode != 0)
  {
    if(err.response == "")
    {
      err.response = "Internal error";
    }
    alert("Operation failed. error code - " + err.errorCode + "\nError message - " + err.response);
  }
  else
  {
    document.getElementById('iwaCreds').style.display = "none";
    document.getElementById('authModal').style.display = "none";    
  }
}

function hideLoginfrm()
{
  hideLoginProgressBar();
  document.getElementById("loginFrm").reset();
  document.getElementById("loginFrm").style.display = "none";
}

function hideSecQAForm()
{
  document.getElementById("secQAFrm").style.display = "none";
  document.getElementById("secQAFrm").reset();
  clearQuestions();
}
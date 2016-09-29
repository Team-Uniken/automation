/*
To-Do list:
1] Proxy Settings input from user/UI.  Done
2] Connection Profiles UI and import. Done
3] Setting selected profile. Done
4] Display of imported profiles. Done
5] Sub menu bar.   Done
6] Self service device management.
7] Credential management.
8] Browser Elements.
9] Change OTP to some other standard nomenclature.
*/
//Import or Reference the RDNA node module in our application.
var sdk_addon  = require('./resources/RDNA.node');
var remote = require('electron').remote;
var nconf = require('nconf');
var fs = require('fs');
const {shell} = require('electron');
var childProcess = require('child_process');
var BrowserWindow = remote.BrowserWindow;
var sdkObj = new sdk_addon.RDNA();
var browserList = new Array();
//Shared space
var eAppName    = remote.getGlobal('sharedObj').appName;
var eAppVersion = remote.getGlobal('sharedObj').appVersion;

//Variables
var iniFile = eAppName + '.ini';
var defaultProfiles = "resources/connections.profiles";
var profiles = new Array();
var Relids = new Array();
var selectedProfile = "";

//Challenge
var initChlng       = null;
var appState        = "startup";
var currentChlngIdx = 0;
var totalChlngCount = 0;
var chlngOpMode     = 0;         //0 - verify, 1 - set

//Login flow chlng.
var intermediateChlngObj = null;
var intermediateChlngJsonObj = null;

var deviceListChlngObj = null;
var devDetailsJsonObj = null;

//misc
var validation_type = 1;

//dnaDetails
var dna = new Object();
dna.pxyDetails = null;
dna.services = null;

//Parent Proxy JS Object
var proxyObj = new Object();
proxyObj.pxyHost = "";
proxyObj.pxyPort = 0;
proxyObj.pxyPass = "";
proxyObj.pxyUser = "";
var ssnUserName = "";

document.onreadystatechange = function() {
  $("[name='premanentDevice']").bootstrapSwitch();
    if (document.readyState === "interactive") {
        onStartup();
    }
};

/** Show submenu for main menu ***/
// hide complete submenu
function hideSubmenu(){
  $("#subMenu .sub-nav").hide();
  $("#subMenu").hide();
}

//show releative submenu for main menu tab
function showSubmenu(subMenuID) {
  if(subMenuID !== undefined)
  {
    $("#subMenu").show();
    $("#"+subMenuID).show();
  }
}

$( function() {
  // hide submenu on page load
  hideSubmenu();
  // on click main menu tab open related submenu specified by rel attribute
  $(".navbar-nav li").click(function() {
      hideSubmenu();
      var subMenuID = $(this).attr('rel');
      if(typeof(subMenuID) != 'undefined' && subMenuID.trim() != "")
      {
        subMenuID = subMenuID.trim();
        if(subMenuID == "Home")
        {
          hideAllForms();
          displayNextFrame();
        }
        else if(subMenuID == "RDP")
        {
          openRDP();
        }
        else if(subMenuID == "Portal")
        {
          openPortal();
        }
        else if(subMenuID == "CRM")
        {
          openCRM();
        }
        else if(subMenuID == "Email")
        {
          openEmail();
        }
        else if(subMenuID == "Chat")
        {
          alert("Feature coming soon");
        }
        else if(subMenuID == "settingsSubmenu")
        {
          $(".navbar-nav li").removeClass('active');
          $(this).addClass('active');
          showSubmenu(subMenuID);
        }
        else if(subMenuID == "LogOff")
        {
          logOff();
        }
      }
    });
  $(".sub-nav li").click(function() {
      hideSubmenu();
      var relAttr = $(this).attr('rel');
      if(typeof(relAttr) != 'undefined' && relAttr.trim() != "")
      {
        relAttr = relAttr.trim();
        showSettingsFrame(relAttr);
      }
    });
  $('#HeaderLogo').on('click', '*', function() {
    initialize();
  });
  $("#frmUserVerification").submit(btnSubmitClicked);
  $("#frmActivationCode").submit(btnSubmitClicked);
  $("#frmSecQa").submit(btnSubmitClicked);
  $("#frmPassword").submit(btnSubmitClicked);
  $("#frmOTP").submit(btnSubmitClicked);
  $("#frmDeviceBinding").submit(btnSubmitClicked);
  $("#frmDeviceAlias").submit(btnSubmitClicked);
  $("#frmCredentialsDetails").submit(updateCredentials);
  $("#frmGeneralSettings").submit(generalSettingsSubmit);
  $("#frmProxySettings").submit(saveProxySettings);
  $("#frmDeviceList").on('click', 'input', function() {
    var op = $(this).attr('rel');
    if(typeof(op) != 'undefined' && op.trim() != "")
    {
      op = op.trim();
      if(op == "update")
      {
        updateDevice();
      }
      else if(op == "delete")
      {
        deleteDevice();
      }
    }
  });
  $('#ConnectionProfileFile').change(importProfiles);
  $('#frmConnectionProfileList').on('click', 'button', function() {
    var op = $(this).attr('rel');
    if(typeof(op) != 'undefined' && op.trim() != "")
    {
      op = op.trim();
      if(op == "select")
      {
        applyConnectionProfile();
      }
      else if(op == "delete")
      {
        deleteConnectionProfile();
      }
    }
  });
  $('#switchuserlink').click(function() {
    switchUser();
  });
  $('#forgotPswdLink').click(function() {
    forgotpassword();
  });
  $('#lnkHelpSupport').on("click", function(){
    popup("Feature Coming Soon");
  })
});

/************************ Logging and Messaging********************************/
function popup(msg) {
  alert (msg);
}

function log_msg(msg) {
  console.log(msg);
}
/************************ Logging and Messaging Ends***************************/

/*********************************File Functions*******************************/
function findIfNameExist(arr, obj) {
  for(var i=0; i<arr.length; i++)
  {
    if (arr[i].Name == obj)
    return true;
  }
}

function readTextFile(file) {
  var allText = null;
  if(fs.existsSync(file))
  {
    allText = fs.readFileSync(file);
  }
  return allText;
}

function getValueFromIniFile(key) {
  nconf.file('custom', iniFile);
  return nconf.get(key);
}

function setKeyValueToIniFile(key, value) {
  var ret = true;
  var fData = readTextFile(iniFile);
  var isNormalWrite = true;
  if(typeof(fData) != 'undefined' && fData != null)
  {
    if(fData == "")
    {
      isNormalWrite = false;
      try
      {
        fs.writeFile
        (iniFile, '{}',  function(err) {
          if (err)
          {
            ret = false;
            log_msg(err);
            return;
          }
          else
          {
            setKeyValueToIniFile(key, value);
          }
        });
      }
      catch (e)
      {
         log_msg("Error in wrtiting to config file please delete the file and try again.");
      }
    }
  }

  if(isNormalWrite)
  {
    try
    {
      nconf.file(iniFile);
      nconf.set(key, value);
      nconf.save(function (err) {
        if (err)
        {
          ret = false;
          return;
        }
      });
    }
    catch (e)
    {
      log_msg("Error in saving config file.");
    }
  }
  return ret;
}
/*******************************File Functions end*****************************/

/*********************Connection profile & default config utility function**********************/
function saveProfileSettings() {
  var connObj = new Object();
  if(typeof(selectedProfile) !== 'undefined' && selectedProfile !== null && selectedProfile !== "")
  {
    connObj.current_profile = selectedProfile;
  }
  connObj.Profiles  = profiles;
  connObj.RelIds = Relids;
  setKeyValueToIniFile("Connection", connObj);
}

function getProfile(pName) {
  if(typeof(pName) !== 'undefined' && pName !== null && pName !== "")
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

function getRelID(rName) {
  if(typeof(rName) !== 'undefined' && rName !== null && rName !== "")
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

function importConnProfiles(data) {
  var index = 0;
  var jObj = null;

  if(typeof(data) != 'undefined' && data != null && data != "")
  {
    try
    {
      jObj = JSON.parse(data);
    }
    catch(e)
    {
      popup("Invalid connection profiles");
    }

    if(typeof(jObj) !== 'undefined' && jObj !== null)
    {
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
          log_msg("duplicate relid found, not imported - " + jObj.RelIds[i].Name);
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
          log_msg("duplicate profile found, not imported - " + jObj.Profiles[j].Name);
        }
      }

      $("#profileList").empty();
      var jsonSelectedProfile = jObj.current_profile;
      if(typeof(jsonSelectedProfile) != 'undefined' && jsonSelectedProfile != null)
      {
        selectedProfile = jsonSelectedProfile;
      }

      var childNodes = document.getElementById("profileList").children.length;
      if(childNodes > 0)
      {
        childNodes = childNodes + 1;
      }
      saveProfileSettings();

      for (var cnt = 0; cnt < profiles.length; cnt++)
      {
        var elemCnt = (childNodes + cnt);
        var radioID = "radio" + elemCnt;
        if(profiles[cnt].Name == selectedProfile)
        {
          $("#profileList").append("<div id=\"" + elemCnt + "\" class='radio3'><input type='radio' id=\"" + radioID + "\" name='profileRadio' value=\"" + profiles[cnt].Name + "\" checked ><label for=\"" + radioID + "\">" + profiles[cnt].Name + "</label></div>");
        }
        else
        {
          $("#profileList").append("<div id=\"" + elemCnt + "\" class='radio3'><input type='radio' id=\"" + radioID + "\" name='profileRadio' value=\"" + profiles[cnt].Name + "\"><label for=\"" + radioID + "\">" + profiles[cnt].Name + "</label></div>");
        }
      }
    }
  }
}

function applyConnectionProfile() {
  var listNodes = document.getElementById("profileList").children;
  for(var itr = 0; itr < listNodes.length; itr++)
  {
    var currNodeRadio = listNodes[itr].getElementsByTagName("input")[0];
    if(currNodeRadio.checked)
    {
      selectedProfile = currNodeRadio.value;
      break;
    }
  }
  saveProfileSettings();
  popup("Connection profile activated!");
}

function deleteConnectionProfile() {
  var ret = confirm("Are you sure you want to delete the profile?\nDoing so will lose the data related to that profile.");
  if (ret == true)
  {
    var listNodes = document.getElementById("profileList").children;
    for(var itr = 0; itr < listNodes.length; itr++)
    {
      var currNodeRadio = listNodes[itr].getElementsByTagName("input")[0];
      if(currNodeRadio.checked)
      {
        if(selectedProfile == currNodeRadio.value)
        {
          selectedProfile = "";
        }

        var index=0;
        var rName = "";
        for(index=0; index < profiles.length; index++)
        {
          if(profiles[index].Name == currNodeRadio.value)
          {
            rName = profiles[index].RelId;
            profiles.splice(index, 1);
            break;
          }
        }

        for(index=0; index < Relids.length; index++)
        {
          if(Relids[index].Name == rName)
          {
            Relids.splice(index, 1);
            break;
          }
        }

        listNodes[itr].parentNode.removeChild(listNodes[itr]);
        break;
      }
    }
    saveProfileSettings();
  }
}

function importDefaultConnProfiles() {
  var fileTxt = readTextFile(defaultProfiles);
  if(null != fileTxt)
  {
    importConnProfiles(fileTxt);
  }
  else
  {
    popup("Please import connection profile");
  }
}

function loadConfigFile(data) {
  if(typeof(data) != 'undefined' && data != null && data != "")
  {
    var jObj = null;
    try
    {
      jObj = JSON.parse(data);
    }
    catch (e)
    {
      log_msg("Invalid file format received.");
    }

    if(jObj != null)
    {
      if(typeof jObj.Connection == "undefined")
      {
        importDefaultConnProfiles();
      }
      else
      {
        var connData = JSON.stringify(jObj.Connection);
        importConnProfiles(connData);
      }
      if(typeof jObj.ProxySettings == "undefined")
      {
        //document.getElementById("pxyHost").value = "";
        //document.getElementById("pxyPort").value = 0;
        //document.getElementById("pxyUsrNm").value = "";
        //document.getElementById("pxyPswd").value = "";
        proxyObj.pxyHost = "";
        proxyObj.pxyPort = 0;
        proxyObj.pxyPass = "";
        proxyObj.pxyUser = "";
      }
      else
      {
        if(typeof(jObj.ProxySettings.pxyHost) !== "undefined" && jObj.ProxySettings.pxyHost !== "")
        {
          document.getElementById("txtProxyAddress").value = jObj.ProxySettings.pxyHost;
          proxyObj.pxyHost = jObj.ProxySettings.pxyHost;
        }
        if(typeof(jObj.ProxySettings.pxyPort) !== "undefined" && jObj.ProxySettings.pxyPort !== "")
        {
          document.getElementById("txtPort").value = jObj.ProxySettings.pxyPort;
          proxyObj.pxyPort = jObj.ProxySettings.pxyPort;
        }
        if(typeof(jObj.ProxySettings.pxyUsrNm) !== "undefined" && jObj.ProxySettings.pxyUsrNm !== "")
        {
          document.getElementById("txtProxyUser").value = jObj.ProxySettings.pxyUsrNm;
          proxyObj.pxyUser = ProxySettings.pxyUsrNm;
        }
        if(typeof(jObj.ProxySettings.pxyPswd) !== "undefined" && jObj.ProxySettings.pxyPswd !== "")
        {
          document.getElementById("txtProxyPassword").value = jObj.ProxySettings.pxyPswd;
          proxyObj.pxyPass = jObj.ProxySettings.pxyPswd;
        }
      }
    }
  }
  else
  {
    console.log("Invalid config file data");
    importDefaultConnProfiles();
  }
}

function asyncFileStatus(err, stats) {
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
}

function importProfiles(event) {
  var input = event.target;
  var reader = new FileReader();
  reader.onload = function(){
      importConnProfiles(reader.result);
    };
  reader.readAsText(input.files[0]);
}

function loadDefaultSettings() {
  fs.stat(iniFile, asyncFileStatus);
}

function saveProxySettings() {
	var strHost     = document.getElementById("txtProxyAddress").value.trim();
  var strPort     = document.getElementById("txtPort").value.trim();
  var strUserName = document.getElementById("txtProxyUser").value.trim();
  var strPswd     = document.getElementById("txtProxyPassword").value.trim();
  var nPort       = 0;
  if(isNaN(strPort) || (strHost == "" && strPort != ""))
  {
    popup("Please enter valid values for proxy setings");
    log_msg("Proxy host port  invalid");
    return;
  }

  if(strHost != "" && strPort != "")
  {
    nPort = parseInt(strPort);
    if(0 > nPort || 65535 < nPort)
    {
      popup("Please enter valid port value between 1 to 65535");
      log_msg("Invalid port num specified");
      return;
    }
    proxyObj.pxyHost = strHost;
    proxyObj.pxyPort = nPort;
    proxyObj.pxyPass = strPswd;
    proxyObj.pxyUser = strUserName;
  }
  else
  {
		proxyObj.pxyHost = "";
		proxyObj.pxyPort = 0;
		proxyObj.pxyPass = "";
		proxyObj.pxyUser = "";
  }
  setKeyValueToIniFile("ProxySettings", proxyObj);
  popup("Proxy setings saved successfully!");
}
/******************Connection profile utility function ends********************/

/*****************************UI control functions*****************************/
function openURLInNativeBrowser(URL, name, specs) {
  var myWindow = window.open(URL, name, specs);
}

function openURLInSameBrowser(URL) {
  var myWindow = window.open(URL);
}

function showUserVerificationFrame() {
  clearErrorMessage();
  document.getElementById("HeaderLogo").style.display="none";
  document.getElementById("AttemptDiv").style.display="none";
  document.getElementById("SwitchUserDiv").style.display="none";

  document.getElementById("HeaderForm").style.display="block";
  document.getElementById("lblUserVerification").style.display="block";
  document.getElementById("frmUserVerification").style.display="block";
  //document.getElementById("RememberMe").style.display="block";
  document.getElementById("txtUserName").value = "";
  document.getElementById('txtUserName').placeholder = "Enter UserName";

  //Set the UI element details
  if(typeof(intermediateChlngJsonObj) !== 'undefined' && intermediateChlngJsonObj !== null
     && typeof(intermediateChlngJsonObj[currentChlngIdx]) !== 'undefined'
     && intermediateChlngJsonObj[currentChlngIdx] !== null
     && typeof(intermediateChlngJsonObj[currentChlngIdx].chlng_info) !== 'undefined'
     && intermediateChlngJsonObj[currentChlngIdx].chlng_info !== null )
  {
    for(var itr = 0; itr < intermediateChlngJsonObj[currentChlngIdx].chlng_info.length; itr++)
    {
      if(intermediateChlngJsonObj[currentChlngIdx].chlng_info[itr].key.toLowerCase() == "responseplaceholder")
      {
        document.getElementById('txtUserName').placeholder =  intermediateChlngJsonObj[currentChlngIdx].chlng_info[itr].value;
        document.getElementById('txtUserName').setAttribute("pval", intermediateChlngJsonObj[currentChlngIdx].chlng_info[itr].value);
        break;
      }
    }
  }
}

function showPasswordFrame() {
  clearErrorMessage();
  var attempts_Left = 0;
  document.getElementById("HeaderLogo").style.display="none";
  document.getElementById("AttemptDiv").style.display="block";
  document.getElementById("SwitchUserDiv").style.display="block";
  document.getElementById("frmPassword").style.display="block";
  document.getElementById("HeaderForm").style.display="block";
  document.getElementById("lblPasswordVerification").style.display="block";
  document.getElementById("RememberMe").style.display="none";
  document.getElementById("txtPassword").value = "";
  document.getElementById("txtConfirmPassword").value = "";
  document.getElementById('txtPassword').placeholder = "Password";
  document.getElementById('txtConfirmPassword').placeholder = "Confirm Password";

  if(typeof(intermediateChlngJsonObj) !== 'undefined' && intermediateChlngJsonObj !== null
     && typeof(intermediateChlngJsonObj[currentChlngIdx]) !== 'undefined'
     && intermediateChlngJsonObj[currentChlngIdx] !== null
     && typeof(intermediateChlngJsonObj[currentChlngIdx].chlng_info) !== 'undefined'
     && intermediateChlngJsonObj[currentChlngIdx].chlng_info !== null)
  {
    for(var itr = 0; itr < intermediateChlngJsonObj[currentChlngIdx].chlng_info.length; itr++)
    {
      if(intermediateChlngJsonObj[currentChlngIdx].chlng_info[itr].key.toLowerCase() == "responseplaceholder")
      {
        document.getElementById('txtPassword').placeholder =  intermediateChlngJsonObj[currentChlngIdx].chlng_info[itr].value;
        document.getElementById('txtPassword').setAttribute("pval", intermediateChlngJsonObj[currentChlngIdx].chlng_info[itr].value);
      }
      else if(intermediateChlngJsonObj[currentChlngIdx].chlng_info[itr].key.toLowerCase() == "confirmresponseplaceholder")
      {
        document.getElementById('txtConfirmPassword').placeholder =  intermediateChlngJsonObj[currentChlngIdx].chlng_info[itr].value;
        document.getElementById('txtConfirmPassword').setAttribute("pval", intermediateChlngJsonObj[currentChlngIdx].chlng_info[itr].value);
      }
    }
  }

  if(intermediateChlngJsonObj[currentChlngIdx].challengeOperation == 1)
  {
    document.getElementById("AttemptDiv").style.display = "none";
    document.getElementById("txtConfirmPassword").style.display = "block";
    document.getElementById("forgotPswdLink").style.display = "none";
    document.getElementById("btnPassSubmit").value = "Submit";
    document.getElementById("lblPasswordVerification").style.display="none";
    document.getElementById("lblSetPassword").style.display="block";
  }
  else
  {
    attempts_Left = intermediateChlngJsonObj[currentChlngIdx].attempts_left;
    if(typeof(attempts_Left) !== 'undefined' && attempts_Left !== null && attempts_Left > 0)
    {
      document.getElementById('attempts').innerHTML = "Attempts Left : " + attempts_Left;
    }
    else
    {
      document.getElementById("AttemptDiv").style.display="none";
    }
    document.getElementById("txtConfirmPassword").style.display = "none";
    document.getElementById("forgotPswdLink").style.display = "block";
    document.getElementById("btnPassSubmit").value = "Login";
  }
}

function showSecQaFrame() {
  clearErrorMessage();
  document.getElementById("HeaderLogo").style.display="none";
  document.getElementById("SwitchUserDiv").style.display="block";
  document.getElementById("HeaderForm").style.display="block";
  document.getElementById("frmSecQa").style.display="block";
  document.getElementById("RememberMe").style.display="none";
  document.getElementById("txtQuestion").value = "";
  document.getElementById("txtAnswer").value = "";
  document.getElementById("txtQuestion").placeholder = "Type or select question";
  document.getElementById("txtAnswer").placeholder = "Answer";
  clearQuestions();
  //clear exisiting questions list if any
  if(intermediateChlngJsonObj[currentChlngIdx].challengeOperation == 1)  //Set question
  {
    document.getElementById("AttemptDiv").style.display="none";
		document.getElementById("lblSetSecQA").style.display="block";
    var select = document.getElementById("questionList");
    for(var i =0; i < intermediateChlngJsonObj[currentChlngIdx].chlng_prompt[0].length; i++)
    {
      var strPrompt = (intermediateChlngJsonObj[currentChlngIdx].chlng_prompt[0])[i];
      var opt = document.createElement('option');
      opt.value = strPrompt;
      opt.innerHTML = strPrompt;
      select.appendChild(opt);
    }
    select.selectedIndex = -1;
    document.getElementById("txtQuestion").disabled = false;
  }
  else
  {
    document.getElementById("AttemptDiv").style.display = "block";
		document.getElementById("lblVerifySecQA").style.display="block";
    //attempts
    attempts_Left = intermediateChlngJsonObj[currentChlngIdx].attempts_left;
    if(typeof(attempts_Left) !== 'undefined' && attempts_Left !== null && attempts_Left > 0)
    {
     document.getElementById("attempts").innerHTML = "Attempts Left : " + attempts_Left;
    }
    else
    {
     document.getElementById("AttemptDiv").style.display = "none";
    }

    if(intermediateChlngJsonObj[currentChlngIdx].chlng_prompt[0].length > 0)
    {
     document.getElementById("txtQuestion").disabled = true;
     document.getElementById("txtQuestion").value = intermediateChlngJsonObj[currentChlngIdx].chlng_prompt[0];
    }
  }

  //set labels
  for(var i = 0; i < intermediateChlngJsonObj[currentChlngIdx].chlng_info.length; i++)
  {
   if(intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].key.toLowerCase() == "promptlabel")
   {
     document.getElementById("txtQuestion").placeholder = intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].value;
     document.getElementById('txtQuestion').setAttribute("pval", intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].value);
   }
   else if(intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].key.toLowerCase() == "responselabel")
   {
     document.getElementById("txtAnswer").placeholder = intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].value;
     document.getElementById('txtAnswer').setAttribute("pval", intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].value);
   }
  }
}

function showOTPFrame() {
  clearErrorMessage();
  document.getElementById("HeaderLogo").style.display="none";
  document.getElementById("AttemptDiv").style.display="block";
  document.getElementById("SwitchUserDiv").style.display="block";
  document.getElementById("HeaderForm").style.display="block";
  document.getElementById("lblOTP").style.display="block";
  document.getElementById("frmOTP").style.display="block";
  document.getElementById("RememberMe").style.display="none";
  document.getElementById("txtOTPKey").value = "";
  document.getElementById("txtOTPValue").value = "";
  document.getElementById('txtOTPKey').placeholder = "OTP Key";
  document.getElementById('txtOTPValue').placeholder = "Enter OTP";
  //set labels
  for(var i = 0; i < intermediateChlngJsonObj[currentChlngIdx].chlng_info.length; i++)
  {
    if(intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].key == "promptlabel")
    {
      document.getElementById('txtOTPKey').placeholder =  intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].value;
      document.getElementById('txtOTPKey').setAttribute("pval", intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].value);
    }
    else if(intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].key == "responselabel")
    {
      document.getElementById('txtOTPValue').placeholder =  intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].value;
      document.getElementById('txtOTPValue').setAttribute("pval", intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].value);
    }
  }

  //attempts
  attempts_Left = intermediateChlngJsonObj[currentChlngIdx].attempts_left;
  if(typeof(attempts_Left) !== 'undefined' && attempts_Left !== null && attempts_Left > 0)
  {
    document.getElementById("AttemptDiv").style.display = "block";
    document.getElementById("attempts").innerHTML = "Attempts Left : " + attempts_Left;
  }
  else
  {
    document.getElementById("AttemptDiv").style.display = "none";
  }

  if(intermediateChlngJsonObj[currentChlngIdx].chlng_prompt.length > 0)
  {
    document.getElementById("txtOTPKey").value = intermediateChlngJsonObj[currentChlngIdx].chlng_prompt[0];
  }
  else
  {
    popup("Error! invalid specs received! kindly relogin again.");
  }
  document.getElementById("txtOTPValue").focus();
}

function showDeviceBindingFrame() {
  clearErrorMessage();
  document.getElementById("HeaderLogo").style.display="none";
  document.getElementById("AttemptDiv").style.display="none";
  document.getElementById("SwitchUserDiv").style.display="block";
  document.getElementById("HeaderForm").style.display="block";
  document.getElementById("lblDeviceReg").style.display="block";
  document.getElementById("frmDeviceBinding").style.display="block";
  document.getElementById("RememberMe").style.display="none";

  //set labels
  for(var i = 0;  i < intermediateChlngJsonObj[currentChlngIdx].chlng_info.length; i++)
  {
    if(intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].key.toLowerCase() == "responselabel")
    {
      //document.getElementById("lblDevname").innerHTML = intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].value;
      break;
    }
  }
}

function showDeviceAliasFrame() {
  clearErrorMessage();
  document.getElementById("HeaderLogo").style.display="none";
  document.getElementById("AttemptDiv").style.display="none";
  document.getElementById("SwitchUserDiv").style.display="block";
  document.getElementById("HeaderForm").style.display="block";
	document.getElementById("lblDeviceReg").style.display="block";
  document.getElementById("frmDeviceAlias").style.display="block";
  document.getElementById("RememberMe").style.display="none";
  document.getElementById("txtDevName").value = "";
  document.getElementById('txtDevName').placeholder = "Enter Device Name";
  for(var i = 0;  i < intermediateChlngJsonObj[currentChlngIdx].chlng_info.length; i++)
  {
    if(intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].key.toLowerCase() == "responselabel")
    {
      document.getElementById('txtDevName').placeholder =  intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].value;
      document.getElementById('txtDevName').setAttribute("pval", intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].value);
      break;
    }
  }
  for(var i = 0;  i < intermediateChlngJsonObj[currentChlngIdx].chlng_resp.length; i++)
  {
    if(intermediateChlngJsonObj[currentChlngIdx].chlng_resp[i].challenge == "devname")
    {
      document.getElementById("txtDevName").value = intermediateChlngJsonObj[currentChlngIdx].chlng_resp[i].response;
      break;
    }
  }
}

function showLoggedInPage() {
	document.getElementById("frmUserVerification").style.display="none";
  document.getElementById("frmPassword").style.display="none";
  document.getElementById("frmActivationCode").style.display="none";
  document.getElementById("frmSecQa").style.display="none";
  document.getElementById("frmOTP").style.display="none";
  document.getElementById("frmDeviceBinding").style.display="none";
  document.getElementById("frmDeviceAlias").style.display="none";

  document.getElementById("RememberMe").style.display="none";
  document.getElementById("AttemptDiv").style.display="none";
  document.getElementById("SwitchUserDiv").style.display="none";

  document.getElementById("HeaderForm").style.display="block";
  document.getElementById("lblUserLoggedIN").style.display="block";
}

function showActivationFrame() {
  clearErrorMessage();
  document.getElementById("HeaderLogo").style.display="none";
  document.getElementById("AttemptDiv").style.display="block";
  document.getElementById("SwitchUserDiv").style.display="block";
  document.getElementById("HeaderForm").style.display="block";
	document.getElementById("HeaderForm").style.display="block";
  document.getElementById("lblActivation").style.display="block";
  document.getElementById("RememberMe").style.display="none";
  document.getElementById("txtVerificationKey").value = "";
  document.getElementById("txtActivationCode").value = "";
  document.getElementById("txtVerificationKey").placeholder = "Verification Key";
  document.getElementById("txtActivationCode").placeholder = "Activation Code";
  document.getElementById("frmActivationCode").style.display="block";
  //Set placeholders and activation code.
  for(var i = 0; i < intermediateChlngJsonObj[currentChlngIdx].chlng_info.length; i++)
  {
    if(intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].key.toLowerCase() == "promptlabel")
    {
      //Verification key
      document.getElementById('txtVerificationKey').placeholder =  intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].value;
      document.getElementById('txtVerificationKey').setAttribute("pval", intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].value);
    }
    else if(intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].key.toLowerCase() == "responselabel")
    {
      //Activation code
      document.getElementById('txtActivationCode').placeholder =  intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].value;
      document.getElementById('txtActivationCode').setAttribute("pval", intermediateChlngJsonObj[currentChlngIdx].chlng_info[i].value);
    }
  }

  if(intermediateChlngJsonObj[currentChlngIdx].chlng_prompt.length > 0)
  {
    //Activation code
    document.getElementById("txtVerificationKey").value = intermediateChlngJsonObj[currentChlngIdx].chlng_prompt[0];
  }
  else
  {
    popup("Error! invalid specs received! kindly relogin again.");
  }

  //attempts
  attempts_Left = intermediateChlngJsonObj[currentChlngIdx].attempts_left;
  if(typeof(attempts_Left) !== 'undefined' && attempts_Left !== null && attempts_Left > 0)
  {
    document.getElementById("AttemptDiv").style.display = "block";
    document.getElementById("attempts").innerHTML = "Attempts Left : " + attempts_Left;
  }
  else
  {
    document.getElementById("AttemptDiv").style.display = "none";
  }
}

function showInitializeFrame() {
  clearErrorMessage();
  document.getElementById("RememberMe").style.display="none";
  document.getElementById("HeaderForm").style.display="none";
  document.getElementById("HeaderLogo").style.display="block";
}

function showIWAAuthPopup() {
  popup("This feature is coming soon!");
}

function hideAllForms() {
  //Headers
  document.getElementById("HeaderLogo").style.display="none";
  document.getElementById("HeaderForm").style.display="none";
  document.getElementById("lblGreetings").style.display="none";
  document.getElementById("lblLoadingMsg").style.display="none";
  document.getElementById("lblUserLoggedIN").style.display="none";
  document.getElementById("lblGeneralSettingsHeading").style.display="none";
  document.getElementById("lblProxySettingsHeading").style.display="none";
  document.getElementById("lblConnectionProfileHeading").style.display="none";

  //Login flows
  document.getElementById("frmUserVerification").style.display="none";
  document.getElementById("frmActivationCode").style.display="none";
  document.getElementById("frmSecQa").style.display="none";
  document.getElementById("frmPassword").style.display="none";
  document.getElementById("frmOTP").style.display="none";
  document.getElementById("frmDeviceBinding").style.display="none";
  document.getElementById("frmDeviceAlias").style.display="none";
  document.getElementById("RememberMe").style.display="none";
  document.getElementById("AttemptDiv").style.display="none";
  document.getElementById("SwitchUserDiv").style.display="none";
  document.getElementById("errorMessage").style.display="none";

  //Settings frames
  document.getElementById("frmGeneralSettings").style.display="none";
  document.getElementById("frmProxySettings").style.display="none";
  document.getElementById("frmConnectionProfileList").style.display="none";
  document.getElementById("frmDeviceList").style.display="none";
  document.getElementById("frmCredentialsDetails").style.display="none";
}

function showSettingsFrame(frmID) {
  if(typeof(frmID) == 'undefined' || frmID == null || frmID == "")
  {
    popup("Invalid selection.");
    return;
  }
  hideAllForms();
  hideSubmenu();
  document.getElementById("HeaderForm").style.display="block";
  if(frmID == "devices") {
    //Show loading message.
    var retCode = 0;
    if(typeof(ssnUserName) == 'undefined' || ssnUserName == null || ssnUserName.length < 1)
    {
      popup("Application state is invalid please login again!");
      displayNextFrame();
      return;
    }
    document.getElementById("lblLoadingMsg").style.display="block";
    document.getElementById("UpdateControlsDevice").style.display="none";
    retCode = sdkObj.getRegistredDeviceDetails(ssnUserName);
    if(0 != retCode.errorCode)
    {
      popup("Unable to fetch device details, error code - " + retCode);
      return;
    }
    //catch the callback and process the response.
    //populate the data from callback-> by calling the functions.
  }
  else if(frmID == "credentials") {
    //Show loading message.
    var retCode = 0;
    if(typeof(ssnUserName) == 'undefined' || ssnUserName == null || ssnUserName.length < 1)
    {
      popup("Application state is invalid please login again!");
      displayNextFrame();
      return;
    }
    document.getElementById("lblLoadingMsg").style.display="block";
    document.getElementById("UpdateControlsCreds").style.display="none";
    retCode = sdkObj.getAllChallenges(ssnUserName);
    if(0 != retCode.errorCode)
    {
      popup("Unable to change pin, error code - " + retCode);
      return;
    }
    //catch the callback and process the response.
    //populate the data from callback-> by calling the functions.
  }
  else if(frmID == "general_settings") {
    document.getElementById("lblGeneralSettingsHeading").style.display="block";
    document.getElementById("frmGeneralSettings").style.display="block";
  }
  else if(frmID == "proxy_settings") {
    document.getElementById("lblProxySettingsHeading").style.display="block";
    document.getElementById("frmProxySettings").style.display="block";
  }
  else if(frmID == "connection_settings") {
    document.getElementById("lblConnectionProfileHeading").style.display="block";
    document.getElementById("frmConnectionProfileList").style.display="block";
  }
}

// Function to show error message
function showErrorMessage(errorMessageText){
  clearErrorMessage();
  document.getElementById("errorMessage").style.display="block";
  document.getElementById("errorMessage").style.color="red";
  document.getElementById("errorMessage").innerHTML = errorMessageText;
}

//Function to clear/remove error message if any
function clearErrorMessage(){
  document.getElementById("errorMessage").innerHTML = "";
  document.getElementById("errorMessage").style.display="none";
}

function windowClose() {
  window.open('','_parent','');
  window.close();
}

function displayNextFrame() {
  if(appState == "checkuser")
  {
    showUserVerificationFrame();
  }
  else if(appState == "pass")
  {
    showPasswordFrame();
  }
  else if(appState == "actcode")
  {
    showActivationFrame();
  }
  else if(appState == "secqa")
  {
    showSecQaFrame();
  }
  else if(appState == "otp")
  {
    showOTPFrame();
  }
  else if(appState == "devbind")
  {
    showDeviceBindingFrame();
  }
  else if(appState == "devname")
  {
    showDeviceAliasFrame();
  }
  else if(appState == "sserloggedin")
  {
    showLoggedInPage();
  }
  else if(appState == "startup")
  {
    showInitializeFrame();
  }
  else
  {
    popup("Invalid state received, please try again!");
  }
}

function hideCurrentFrame() {
  if(appState == "checkuser")
  {
    document.getElementById("frmUserVerification").style.display="none";
    document.getElementById("lblUserVerification").style.display="none";
  }
  else if(appState == "pass")
  {
    document.getElementById("frmPassword").style.display="none";
    document.getElementById("lblPasswordVerification").style.display="none";
    document.getElementById("lblSetPassword").style.display="none";
  }
  else if(appState == "actcode")
  {
    document.getElementById("frmActivationCode").style.display="none";
    document.getElementById("lblActivation").style.display="none";
  }
  else if(appState == "secqa")
  {
    document.getElementById("frmSecQa").style.display="none";
    document.getElementById("lblSetSecQA").style.display="none";
    document.getElementById("lblVerifySecQA").style.display="none";
  }
  else if(appState == "otp")
  {
    document.getElementById("frmOTP").style.display="none";
    document.getElementById("lblOTP").style.display="none";
  }
  else if(appState == "devbind")
  {
    document.getElementById("frmDeviceBinding").style.display="none";
    document.getElementById("lblDeviceReg").style.display="none";
  }
  else if(appState == "devname")
  {
    document.getElementById("frmDeviceAlias").style.display="none";
    document.getElementById("lblDeviceReg").style.display="none";
  }
  else if(appState == "startup")
  {
    document.getElementById("HeaderLogo").style.display="none";
    document.getElementById("lblGreetings").style.display="none";
  }
  else if(appState == "sserloggedin")
  {
    document.getElementById("lblUserLoggedIN").style.display="none";
  }
}

function btnSubmitClicked() {
  if(appState == 'checkuser')
  {
    var username  = document.getElementById("txtUserName").value.trim();
    // Validate user name
    if(typeof(username) == 'undefined' || username == null || username.length < 1)
    {
      popup("Invalid input provided!");
      return;
    }
    formatCheckUserResponse(username);
  }
  else if(appState == "actcode")
  {
    var actCode = document.getElementById("txtActivationCode").value.trim();
    if(typeof(actCode) == 'undefined' || actCode == null || actCode.length < 1)
    {
      popup("Invalid input provided!");
      return;
    }
    formatActCodeChlngResp(actCode);
  }
  else if(appState == "secqa")
  {
    var secretQues = document.getElementById("txtQuestion").value.trim();
    var secretAns = document.getElementById("txtAnswer").value.trim();
    if(typeof(secretQues) == 'undefined' || secretQues == null || secretQues.length < 1
       || typeof(secretAns) == 'undefined' || secretAns == null || secretAns.length < 1)
    {
      popup("Invalid input provided!");
      return;
    }
    formatSecQAChlngResp(secretQues, secretAns);
  }
  else if(appState == "pass")
  {
    var pswd = document.getElementById("txtPassword").value.trim();
    var confirmPswd = document.getElementById("txtConfirmPassword").value.trim();
    if(typeof(pswd) == 'undefined' || pswd == null || pswd.length < 1)
    {
      popup("Please provide password for you account.");
      return;
    }
    else if(intermediateChlngJsonObj[currentChlngIdx].challengeOperation == 1
            && (typeof(confirmPswd) == 'undefined' || confirmPswd == null || confirmPswd.length < 1))
    {
      popup("Please confirm password.");
      return;
    }
    else if(intermediateChlngJsonObj[currentChlngIdx].challengeOperation == 1 && (pswd !== confirmPswd))
    {
      popup("Password and confirm password do not match, please try again.");
      return;
    }
    formatPasswordResp(pswd);
  }
  else if(appState == "devbind")
  {
    var devBindValue = document.getElementById("chkbxDevType");
    var isPermanentDevice = false;
    if(typeof(devBindValue) != 'undefined' && devBindValue != null && devBindValue.checked == true)
    {
      isPermanentDevice = true;
    }
    formatDevBindingResp(isPermanentDevice);
  }
  else if(appState == "devname")
  {
    var devName = document.getElementById("txtDevName").value.trim();
    if(typeof(devName) == 'undefined' || devName == null || devName.length < 1)
    {
      popup("Invalid input provided!");
      return;
    }
    formatDevAliasResp(devName);
  }
  else if(appState == "otp")
  {
    var otp = document.getElementById("txtOTPValue").value.trim();
    if(typeof(otp) == 'undefined' || otp == null || otp.length < 1)
    {
      popup("Invalid input provided!");
      return;
    }
    formatOTPChlngResp(otp);
  }
}

function clearQuestions() {
  var childArray = document.getElementById("questionList").children;
  if ( childArray.length > 0 )
  {
    document.getElementById("questionList").removeChild( childArray[ 0 ] );
    clearQuestions();
  }
}

function showCredentailsFrame() {
 hideAllForms();
 //clear input fields.
 document.getElementById("frmCredentialsDetails").style.display= "block";
 document.getElementById("txtManageUsername").value = "";
 document.getElementById("txtOldPassword").value = "";
 document.getElementById("txtOldpasswordAgain").value = "";
 document.getElementById("txtNewPassword").value = "";

  var ques = document.getElementById("manageQuestionList");
  for(var i = 0; i < ques.children.length ; i++)
  {
    ques.remove(i);
  }
}

function onDeviceClickHandler() {
  alert(this.id);
}

function populateDeviceDetails() {
  var permanentDevCnt = 0;
  var temporaryDevCnt = 0;
  var i = 0;
  var perDeviceList = document.getElementById("divPermanentDevices");
  var tempDeviceList = document.getElementById("divTemporaryDevices");
  for(i = 0; i < devDetailsJsonObj.Permanent.length; i++)
  {
    if(devDetailsJsonObj.Permanent[i].devName != "")
    {
      permanentDevCnt++;
      var id = "permanent" + permanentDevCnt;
      var devElement = document.createElement("a");
      devElement.setAttribute("href","#");
      devElement.setAttribute("class","list-group-item");
      devElement.setAttribute("id",id);

      var header = document.createElement("h4");
      header.setAttribute("class","list-group-item-heading");
      header.innerHTML = devDetailsJsonObj.Permanent[i].devName;
      devElement.appendChild(header);

      var statusTag = document.createElement("p");
      statusTag.setAttribute("class","list-group-item-text");
      statusTag.innerHTML = "Status : " + devDetailsJsonObj.Permanent[i].status;
      devElement.appendChild(statusTag);

      var createTsTag = document.createElement("p");
      createTsTag.setAttribute("class","list-group-item-text");
      createTsTag.innerHTML = "Created on : " + devDetailsJsonObj.Permanent[i].createdTs;
      devElement.appendChild(createTsTag);

      var lastLoggedInTag = document.createElement("p");
      lastLoggedInTag.setAttribute("class","list-group-item-text");
      lastLoggedInTag.innerHTML = "Last accessed on : " + devDetailsJsonObj.Permanent[i].lastAccessedTs;
      devElement.appendChild(lastLoggedInTag);

      /*var lastLoginStatusTag = document.createElement("p");
      lastLoginStatusTag.setAttribute("class","list-group-item-text");
      lastLoginStatusTag.innerHTML = "Last Login : " + devDetailsJsonObj.Permanent[i].lastLoginStatus;
      devElement.appendChild(lastLoginStatusTag);*/
      devElement.onclick = onDeviceClickHandler;
      perDeviceList.appendChild(devElement);
    }
  }

  for(i = 0; i < devDetailsJsonObj.Temporary.length; i++)
  {
    if(devDetailsJsonObj.Temporary[i].devName != "")
    {
      temporaryDevCnt++;
      var id = "temporary" + temporaryDevCnt;
      var devElement = document.createElement("a");
      devElement.setAttribute("href","#");
      devElement.setAttribute("class","list-group-item");
      devElement.setAttribute("id",id);

      var header = document.createElement("h4");
      header.setAttribute("class","list-group-item-heading");
      header.innerHTML = devDetailsJsonObj.Temporary[i].devName;
      devElement.appendChild(header);

      var statusTag = document.createElement("p");
      statusTag.setAttribute("class","list-group-item-text");
      statusTag.innerHTML = devDetailsJsonObj.Temporary[i].status;
      devElement.appendChild(statusTag);

      var createTsTag = document.createElement("p");
      createTsTag.setAttribute("class","list-group-item-text");
      createTsTag.innerHTML = devDetailsJsonObj.Temporary[i].createdTs;
      devElement.appendChild(createTsTag);

      var lastLoggedInTag = document.createElement("p");
      lastLoggedInTag.setAttribute("class","list-group-item-text");
      lastLoggedInTag.innerHTML = devDetailsJsonObj.Temporary[i].lastAccessedTs;
      devElement.appendChild(lastLoggedInTag);

      var lastLoginStatusTag = document.createElement("p");
      lastLoginStatusTag.setAttribute("class","list-group-item-text");
      lastLoginStatusTag.innerHTML = devDetailsJsonObj.Temporary[i].lastLoginStatus;
      devElement.appendChild(lastLoginStatusTag);

      devElement.onclick = onDeviceClickHandler;
      tempDeviceList.appendChild(devElement);
    }
  }
}

function showDeviceDetailsFrame() {
  hideAllForms();
  document.getElementById("HeaderForm").style.display="block";
  document.getElementById("frmDeviceList").style.display = "block";
  document.getElementById("UpdateControlsDevice").style.display="block";
  document.getElementById("deviceListDiv").style.width = "370px";
  document.getElementById("deviceListDiv").style.height = "400px";
  populateDeviceDetails();
}

function openRDP() {
  openExternalApp("mstsc", 'execute', ["-v", "127.0.0.1:40400"]);
}

function openEmail() {
  openExternalApp("outlook", 'execute');
}

function openCRM() {
  openWebBrowser("https://www.google.co.in", "CRM");
}

function openPortal() {
  openWebBrowser("http://www.textfile.com", "Portal");
}

function openWebBrowser(aUrl, aTitle) {
  var brwwindow = null;
  if(typeof(aUrl) != 'undefined' && aUrl != "")
  {
    if(typeof(aTitle) != 'undefined' && aTitle != "")
    {
      brwwindow = new BrowserWindow({width: 1024, height: 768, title: aTitle});
    }
    else
    {
      brwwindow = new BrowserWindow({width: 1024, height: 768 });
    }
    var target = './browser/browser.html?src='+ aUrl;
    if(dna != null && dna.pxyDetails != null)
    {
      target = target + '&proxy=127.0.0.1:' + dna.pxyDetails.port;
    }
    brwwindow.loadURL('file://' + __dirname + target);
    //brwwindow.webContents.openDevTools();
    brwwindow.setMenu(null);
    brwwindow.setIcon(__dirname + "/img/AppIcon.ico");
    brwwindow.on('closed', function() {
      for(var i = 0; i < browserList.length; i++)
      {
        if(browserList[i] == brwwindow)
        {
          browserList.splice(i, 1);
          break;
        }
      }
    });
    browserList.push(brwwindow);
  }
  else
  {
    popup("Destination URL Invalid.");
  }
}

function deleteDevice() {
  popup("Feature Coming Soon");
}

function updateDevice() {
  popup("Feature Coming Soon");
}

function updateCredentials() {
  popup("Feature Coming Soon");
}

function generalSettingsSubmit() {
  popup("Feature Coming Soon");
}

/*************************UI control functions end*****************************/

/****************************** SDK Functions**********************************/
var RDNACallbacks = new Object();
RDNACallbacks.onInitializeCompleted          = init_callback;
RDNACallbacks.onPauseRuntime                 = pause_callback;
RDNACallbacks.onResumeRuntime                = resume_callback;
RDNACallbacks.onTerminate                    = terminate_callback;
RDNACallbacks.onLogOff                       = logoff_callback;
RDNACallbacks.onCheckChallengeResponseStatus = chk_chlng_callback;
RDNACallbacks.onGetAllChallengeStatus        = get_all_chlng_callback;
RDNACallbacks.onUpdateChallengeStatus        = update_chlng_callback;
RDNACallbacks.onGetPostLoginChallenges       = get_post_login_challenges_callback;
RDNACallbacks.onConfigRecieved               = getconfig_callback;
RDNACallbacks.onForgotPasswordStatus         = forgot_pswd_callback;
RDNACallbacks.getApplicationName             = getAppname;
RDNACallbacks.getApplicationVersion          = getAppversion;
RDNACallbacks.getIWACredentials              = get_creds_callback;
RDNACallbacks.onGetRegistredDeviceDetails    = get_registered_device_callback;
RDNACallbacks.onUpdateDeviceDetails          = on_update_device_details_callback;
////////////////////////// CallBacks - End ///////////////////////////////////

//Initialize the underlying sdk.
function initialize() {
  var res = null;
  var error = 0;
  clearErrorMessage();
  if(typeof(selectedProfile) === 'undefined' || selectedProfile === "" || selectedProfile === null)
  {
    popup("Please select appropriate connection profile.");
  }
  else
  {
    var profileObj = getProfile(selectedProfile);
    var agentID = getRelID(profileObj.RelId);

    var gwHost = profileObj.Host;
    var gwPort = profileObj.Port;
    res = sdkObj.initialize(agentID, RDNACallbacks, gwHost, gwPort, "", "", proxyObj, "ReferenceDesktopApp_Ctx");
    error = res.errorCode;
    if(0 != error)
    {
      popup(error);
    }
  }
}

function setIWACreds(url, user, pswd, nstatus) {
  var res = new Object();
  if(typeof(nstatus)== 'undefined' || url == 'undefined'
     || (nstatus == 0 && (user == 'undefined' || pswd == 'undefined'
        || user == null || pswd == null || user.length < 1 || pswd.length < 1)))
  {
    popup("Invalid arguments");
  }
  else
  {
    if(nstatus != 0 || nstatus != 1)
    {
      log_msg("Invalid iwa status received - " + nstatus);
      nstatus = 1;
    }
    res = sdkObj.setIWACredentials(url, user, pswd, nstatus);
    if(res.errorCode != 0)
    {
      popup("Error occured while performing the task.\n Error Code : " + res.errorCode);
    }
  }
}

function getAllChallenges(userName) {
  var res;
  if(userName !== 'undefined' && userName !== null && userName.trim().length > 0)
  {
    res = sdkObj.getAllChallenges(userName.trim());
    if(res.errorCode != 0)
    {
      popup("Unable to get the user data! please try again.");
    }
  }
  else
  {
    popup("Invalid User ID provided");
  }
}

function logOff() {
  var res;
  if(typeof(ssnUserName) !== 'undefined' && ssnUserName !== null && ssnUserName.length > 0)
  {
    var ret = confirm("Are you sure you want to logOff");
    if (ret == true)
    {
      res = sdkObj.logOff(ssnUserName);
      if(0 != res.errorCode)
      {
        popup("Logoff failure!\nError Code - " + res.errorCode);
      }
      else
      {
        document.getElementById("lblLoggingOff").style.display="none";
      }
    }
  }
  else
  {
    popup("Logoff failure! You are not logged-in!");
  }
}

/*StartUp Function*/
function onStartup() {
  loadDefaultSettings();
}

function switchUser() {
  var err = 0;
  if(typeof(initChlng) == 'undefined' || initChlng == null || initChlng.length < 1)
  {
    popup("Application state invalid please restart the application.");
    return;
  }
  var res;
  res = sdkObj.resetChallenge();
  err = res.errorCode;
  if(0 == err)
  {
    hideCurrentFrame();
    parseInitialChlng(initChlng);
  }
  else
  {
    popup("Unable to perform activity. Error code - " + err);
  }
}

function forgotpassword() {
  var err = 0;
  if(typeof(ssnUserName) !== 'undefined' && ssnUserName !== null && ssnUserName.length > 0)
  {
    var res = sdkObj.forgotPassword(ssnUserName);
    err = res.errorCode;
    if(0 != err)
    {
      popup("Unable to perform activity due, error code - " + err);
    }
  }
  else
  {
    popup("Application in invalid state, please relogin and try again...!");
  }
}

/******************************Response Formation******************************/
function parseNextChallengeInSeries() {
  var res = null;
  var error = 0;
  intermediateChlngObj.chlng = intermediateChlngJsonObj;
  if((currentChlngIdx + 1) >= totalChlngCount)
  {
    var respStr = "";
    respStr = JSON.stringify(intermediateChlngObj);
    res = sdkObj.checkChallengeResponse(ssnUserName, respStr);
    error = res.errorCode;
    if(0 != error)
    {
      popup("Invalid input!\nError code : "+ error);
    }
  }
  else
  {
    hideCurrentFrame();
    currentChlngIdx = (currentChlngIdx + 1);
    appState = intermediateChlngJsonObj[currentChlngIdx].chlng_name;
    displayNextFrame();
  }
}

function formatCheckUserResponse(inUserName) {
  if(typeof(inUserName) == 'undefined' || inUserName == null || inUserName.trim().length < 1)
  {
    popup("Please enter valid user name");
    return;
  }
  ssnUserName = inUserName;
  intermediateChlngJsonObj[currentChlngIdx].chlng_resp[0].response = inUserName;
  parseNextChallengeInSeries();
}

function formatOTPChlngResp(otpCode) {
	var res = null;
  var error = 0;
  if(typeof(ssnUserName) == 'undefined' || ssnUserName == null
     || ssnUserName.length < 1 || intermediateChlngJsonObj == null)
  {
    popup("Application state is invalid please login again!");
    return;
  }
  else if(typeof(otpcode) == 'undefined' || otpcode == null
          || otpcode.trim().length < 1)
  {
    popup("Please enter valid input.");
    return;
  }

  intermediateChlngJsonObj[currentChlngIdx].chlng_resp[0].response = otpcode.trim();
  parseNextChallengeInSeries();
}

function formatDevAliasResp(deviceName) {
  var res = null;
  var error = 0, iter = 0;
  if(typeof(ssnUserName) == 'undefined' || ssnUserName == null
     || ssnUserName.length < 1 || intermediateChlngJsonObj == null)
  {
    popup("Application state is invalid please login again!");
    return;
  }
  else if(typeof(deviceName) == 'undefined' || deviceName == null || deviceName.trim().length < 1)
  {
    popup("Please enter valid input.");
    return;
  }

  intermediateChlngJsonObj[currentChlngIdx].chlng_resp[0].response = deviceName.trim();
  intermediateChlngJsonObj[currentChlngIdx].user_id = ssnUserName;

  parseNextChallengeInSeries();
}

function formatDevBindingResp(deviceStatus) {
	var res = null;
  var error = 0, iter = 0;
  if(typeof(ssnUserName) == 'undefined' || ssnUserName == null
     || ssnUserName.length < 1 || intermediateChlngJsonObj == null)
  {
    popup("Application state is invalid please login again!");
    return;
  }
  else if(typeof(deviceStatus) == 'undefined' || deviceStatus == null)
  {
    popup("Please enter valid input.");
    return;
  }

  intermediateChlngJsonObj[currentChlngIdx].chlng_resp[0].response = deviceStatus;
  parseNextChallengeInSeries();
}

function formatPasswordResp(password) {
  var res = null;
  var error = 0, iter = 0;
  if(typeof(ssnUserName) == 'undefined' || ssnUserName == null
     || ssnUserName.length < 1 || intermediateChlngJsonObj == null)
  {
    popup("Application state is invalid please login again!");
    return;
  }
  else if(typeof(password) == 'undefined' || password == null || password.trim().length < 1)
  {
    popup("Please enter valid input.");
    return;
  }

  intermediateChlngJsonObj[currentChlngIdx].chlng_resp[0].response = password.trim();
  intermediateChlngJsonObj[currentChlngIdx].user_id = ssnUserName;
  parseNextChallengeInSeries();
}

function formatSecQAChlngResp(ques, ans) {
  var res = null;
  var error = 0, iter = 0;
  if(typeof(ssnUserName) == 'undefined' || ssnUserName == null
     || ssnUserName.length < 1 || intermediateChlngJsonObj == null)
  {
    popup("Application state is invalid please login again!");
    return;
  }
  else if(typeof(ques) == 'undefined' || ques == null
          || ques.trim().length < 1 || typeof(ans) == 'undefined'
          || ans == null || ans.trim().length < 1)
  {
    popup("Please enter valid input.");
    return;
  }

  intermediateChlngJsonObj[currentChlngIdx].chlng_resp[0].challenge = ques.trim();
  intermediateChlngJsonObj[currentChlngIdx].chlng_resp[0].response = ans.trim();
  parseNextChallengeInSeries();
}

function formatActCodeChlngResp(activationCode) {
  var res = null;
  var error = 0;
  if(typeof(ssnUserName) == 'undefined' || ssnUserName == null
     || ssnUserName.length < 1 || intermediateChlngJsonObj == null)
  {
    popup("Application state is invalid please login again!");
    return;
  }
  else if(typeof(activationCode) == 'undefined' || activationCode == null || activationCode.trim().length < 1)
  {
    popup("Please enter valid input.");
    return;
  }

  intermediateChlngJsonObj[currentChlngIdx].chlng_resp[0].response = activationCode;
  parseNextChallengeInSeries();
}

/****************************Response Formation Ends***************************/

/*****************************Open External App********************************/
function openExternalApp(exeName, exePath, exeArgs) {
  var retCode = 0;
  do
  {
    if(typeof(exeName) == 'undefined' || exeName == null || exeName.trim().length < 0)
    {
      retCode = 1;
      break;
    }
    else if(typeof(exePath) == 'undefined' || exePath == null || exePath.trim().length < 0)
    {
      retCode = 2;
      break;
    }

    var trimmedExeName = exeName.trim();
    var trimmedPath = exePath.trim();
    if(process.platform == 'darwin')
    {
      if(trimmedExeName.includes(".app"))
      {
        var tokens = trimmedExeName.split(".app");
        trimmedPath = trimmedPath + trimmedExeName + "/Contents/MacOS/";
        trimmedExeName = tokens[0];
      }
    }

    if(process.platform == 'win32' && trimmedPath === 'execute')
    {
      var argsArr = new Array();
      argsArr[0] = "/C";
      argsArr[1] = "start";
      argsArr[2] = trimmedExeName;
      //Applications openable through RUN  this is applicable for windows only.
      if(typeof(exeArgs) != 'undefined' && exeArgs != null && exeArgs.length > 0)
      {
        for(i = 3, j = 0; j < exeArgs.length; i++, j++)
        {
          argsArr[i] = exeArgs[j];
        }
        childProcess.spawn("cmd.exe", argsArr);
      }
      else
      {
        childProcess.spawn("cmd.exe", argsArr);
      }
    }
    else if(trimmedPath === 'system' || (process.platform == 'darwin' && trimmedPath === 'execute'))
    {
      //Applications default system  handlung.
      shell.openExternal(trimmedPath + trimmedExeName);
    }
    else
    {
      if(trimmedPath === '.')
      {
        //Applications in current dir
        shell.openItem(trimmedExeName);
      }
      else
      {
        //Application path specified
        var fullPath = trimmedPath+trimmedExeName;
        shell.openItem(fullPath);
      }
    }
  }while(0);
}

/**************************Window Close Handling*******************************/
this.onbeforeunload = function onWindowClosing(e) {
  var ret = confirm("Are you sure you want to exit the application?");
  if (ret == true)
  {
    for(var i = 0; i < browserList.length; i++)
    {
      browserList[i].close();
    }
    sdkObj.terminate();
  }
  else
  {
    return false;
  }
}
/************************Window Close Handling End*****************************/

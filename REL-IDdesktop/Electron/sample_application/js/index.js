var addon = require('./resources/RDNA.node');
var profiles = new Array();
var Relids = new Array();
var selectedProfile = "";
var proxyObj = new Object();
proxyObj.pxyHost = "";
proxyObj.pxyPort = "";
proxyObj.pxyPass = "";
proxyObj.pxyUser = "";

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

function myFunctionForgotPassword()
{
  alert("Feature coming soon...!");
}

function displayProgress()
{
  document.getElementById("myDIV").style.opacity = "0.3";
  document.getElementById("fountainG").style.display = "block";
}

function login()
{
  alert("hello");
  document.getElementById("myDIV").style.opacity = "0.3";
  document.getElementById("Login").style.display = "block";
}

function onInitialized()
{
  document.getElementById("fountainG").style.display = "none";
  document.getElementById("initFrm").style.display = "none";
  document.getElementById("myDIV").style.opacity = "100";
  document.getElementById("myDIV").style.display = "none";
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
  var port = document.getElementById("pxyPort").value;
  var name = document.getElementById("pxyUsrNm").value;
  var pswd = document.getElementById("pxyPswd").value;
  proxyObj.pxyHost = host;
  proxyObj.pxyPort = port;
  proxyObj.pxyPass = pswd;
  proxyObj.pxyUser = name;
}
 
function importConnProfiles(path)
{
  
}
 
function importProfiles(event)
{
  var input = event.target;
  var text = "";
  var reader = new FileReader();
  reader.onload = function(){
      text = reader.result;
      var jObj = JSON.parse(text);
      for(var i = 0; i< jObj.RelIds.length; i++)
      {
        var rObj = new Object();
        rObj.Name = jObj.RelIds[i].Name;
        rObj.RelId = jObj.RelIds[i].RelId;
        Relids.push(rObj);
      }
      
      for(var j = 0; j< jObj.Profiles.length; j++)
      {
        var pObj = new Object();
        pObj.Name = jObj.Profiles[j].Name;
        pObj.Host = jObj.Profiles[j].Host;
        pObj.Port = jObj.Profiles[j].Port;
        pObj.RelId = jObj.Profiles[j].RelId;
        profiles.push(pObj);
      }
      
      for (var cnt = 0; cnt < profiles.length; cnt++)
      {
        $("#connList").append("<li id=\"" + cnt + "\">" + profiles[cnt].Name +"</li>");
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
            
          });
        }
      );
    };
  reader.readAsText(input.files[0]);
}

function importDefaultConnProfiles()
{
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

    
    
    
    
    
    
    
    
    
    
    
    
    
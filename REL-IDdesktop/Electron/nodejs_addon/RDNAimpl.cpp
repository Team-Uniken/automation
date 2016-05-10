/*
This is basic wrapper impl first cut based on NODEJS and NaN
To-Do list:
1] Basic argument validation.
2] Argument type checking.
3] Advance API.
4] Privacy stream.
5] Crypto API's.
6] Service start and stop API's.
7] Memory cleanup.
*/

#include "RDNAimpl.h"
#include "RDNAUtil.h"
#include "devicefp.h"

using namespace RDNAUtil;

Nan::Persistent<v8::Function> RDNA::constructor;

//Utility methods
void generateDeviceSignature(RDNAContext* wctx, std::string &deviceSignature)
{
  struct json_object *jsonDataObj = NULL, *jstring = NULL;

  std::string appName = "ElectronApp"; //wctx->app_callbacks->getAppName();
  std::string appVersion = "22.1.92"; //wctx->app_callbacks->getAppVersion();

  char *deviceFP = NULL;
  deviceFP = getDeviceSignature();

  int appNameLen = 0, appVersionLen = 0;
  unsigned char* encodedAppName = base64_encode(&appNameLen, (unsigned char*)appName.c_str(), appName.length());
  unsigned char* encodedAppVersion = base64_encode(&appVersionLen, (unsigned char*)appVersion.c_str(), appVersion.length());

  jsonDataObj = json_tokener_parse(deviceFP);
  if (jsonDataObj)
  {
    jstring = json_object_new_string_len((char*)encodedAppName, appNameLen);
    json_object_object_add(jsonDataObj, APPNAME, jstring);

    jstring = json_object_new_string_len((char*)encodedAppVersion, appVersionLen);
    json_object_object_add(jsonDataObj, APPVERSION, jstring);

    deviceSignature = std::string(json_object_to_json_string(jsonDataObj));
  }
  else
  {
    deviceSignature = "";
  }
}

proxy_settings_t* unpack_proxy_settings(Isolate* isolate, const Handle<Object> proxy_obj)
{
  proxy_settings_t* pxy = NULL;

  Handle<Value> pxyhost_Value = proxy_obj->Get(String::NewFromUtf8(isolate, "pxyHost"));
  Handle<Value> pxyport_Value = proxy_obj->Get(String::NewFromUtf8(isolate, "pxyPort"));
  Handle<Value> pxypass_Value = proxy_obj->Get(String::NewFromUtf8(isolate, "pxyPass"));
  Handle<Value> pxyuser_Value = proxy_obj->Get(String::NewFromUtf8(isolate, "pxyUser"));
  std::string host(*v8::String::Utf8Value(pxyhost_Value));
  std::string username(*v8::String::Utf8Value(pxyuser_Value));
  std::string pswd(*v8::String::Utf8Value(pxypass_Value));
  int port = pxyport_Value->NumberValue();
  if (!trim(host).empty() && MAX_PORT_VALUE > port && MIN_PORT_VALUE < port)
  {
    pxy = (proxy_settings_t*)malloc(sizeof(proxy_settings_t));
    pxy->nProxyPort = port;
    pxy->sProxyHNIP = m_strdup(host.c_str());
    pxy->sUsername = m_strdup(username.c_str());
    pxy->sPassword = m_strdup(pswd.c_str());
  }

  return pxy;
}

int unpack_service_object(Isolate* isolate, const Handle<Object> svc_obj, core_service_t** pSvc)
{
  int nRet = RDNA_ERR_NONE;
  Handle<Value> svcName_Value = svc_obj->Get(String::NewFromUtf8(isolate, "serviceName"));
  Handle<Value> svcTargetHNIP_Value = svc_obj->Get(String::NewFromUtf8(isolate, "targetHNIP"));
  Handle<Value> svcTargetPort_Value = svc_obj->Get(String::NewFromUtf8(isolate, "targetPort"));

  Handle<Object> svcPortInfo_obj = Handle<Object>::Cast(svc_obj->Get(String::NewFromUtf8(isolate, "portInfo")));
  Handle<Value> svcPortInfoPort_Value = svcPortInfo_obj->Get(String::NewFromUtf8(isolate, "port"));

  std::string name(*v8::String::Utf8Value(svcName_Value));
  std::string targetHNIP(*v8::String::Utf8Value(svcTargetHNIP_Value));
  int targetPort = svcTargetPort_Value->NumberValue();
  int infoPort = svcPortInfoPort_Value->NumberValue();
  name = trim(name);
  targetHNIP = trim(targetHNIP);
  if (!name.empty())
  {
    (*pSvc) = (core_service_t*)malloc(sizeof(core_service_t));
    if (NULL != (*pSvc))
    {
      (*pSvc)->portInfo.port = infoPort;
      (*pSvc)->serviceName = (char*)name.c_str();
      (*pSvc)->targetHNIP = (char*)targetHNIP.c_str();
      (*pSvc)->targetPort = targetPort;
    }
    else
    {
      nRet = RDNA_NO_MEMORY;
    }
  }
  else
  {
    nRet = RDNA_ERR_INVALID_SERVICE_NAME;
  }

  return nRet;
}

//Callback execution helpers.
static void NoOpWorkAsync(uv_work_t *req) {
  AsyncWork *work = static_cast<AsyncWork *>(req->data);
}

static void WorkAsyncComplete(uv_work_t *req, int status)
{
  Isolate * isolate = Isolate::GetCurrent();
  v8::HandleScope handleScope(isolate);
  AsyncWork *work = static_cast<AsyncWork *>(req->data);

  // execute the callback
  // https://stackoverflow.com/questions/13826803/calling-javascript-function-from-a-c-callback-in-v8/28554065#28554065
  //Switch case on methid
  switch (work->methID)
  {
    case RDNAMethodID::RDNA_METH_INITIALIZE:
    {
      Handle<Value> argv[] = { String::NewFromUtf8(isolate, work->serializedCoreStatus), Number::New(isolate, work->errCode) };
      Local<Function>::New(isolate, work->asyncCallbacks->onInitializeCompleted)->Call(isolate->GetCurrentContext()->Global(), 2, argv);
      break;
    }
    case RDNAMethodID::RDNA_METH_PAUSE:
    {
      Handle<Value> argv[] = { String::NewFromUtf8(isolate, work->serializedCoreStatus), Number::New(isolate, work->errCode) };
      Local<Function>::New(isolate, work->asyncCallbacks->onPauseRuntime)->Call(isolate->GetCurrentContext()->Global(), 2, argv);
      break;
    }
    case RDNAMethodID::RDNA_METH_RESUME:
    {
      Handle<Value> argv[] = { String::NewFromUtf8(isolate, work->serializedCoreStatus), Number::New(isolate, work->errCode) };
      Local<Function>::New(isolate, work->asyncCallbacks->onResumeRuntime)->Call(isolate->GetCurrentContext()->Global(), 2, argv);
      break;
    }
    case RDNAMethodID::RDNA_METH_LOGOFF:
    {
      Handle<Value> argv[] = { String::NewFromUtf8(isolate, work->serializedCoreStatus), Number::New(isolate, work->errCode) };
      Local<Function>::New(isolate, work->asyncCallbacks->onLogOff)->Call(isolate->GetCurrentContext()->Global(), 2, argv);
      break;
    }
    case RDNAMethodID::RDNA_METH_TERMINATE:
    {
      Handle<Value> argv[] = { String::NewFromUtf8(isolate, work->serializedCoreStatus), Number::New(isolate, work->errCode) };
      Local<Function>::New(isolate, work->asyncCallbacks->onTerminate)->Call(isolate->GetCurrentContext()->Global(), 2, argv);
      break;
    }
    case RDNAMethodID::RDNA_METH_GET_CONFIG:
    {
      Handle<Value> argv[] = { String::NewFromUtf8(isolate, work->serializedCoreStatus), Number::New(isolate, work->errCode) };
      Local<Function>::New(isolate, work->asyncCallbacks->onConfigRecieved)->Call(isolate->GetCurrentContext()->Global(), 2, argv);
      break;
    }
    case RDNAMethodID::RDNA_METH_GET_ALL_CHALLENGES:
    {
      Handle<Value> argv[] = { String::NewFromUtf8(isolate, work->serializedCoreStatus), Number::New(isolate, work->errCode) };
      Local<Function>::New(isolate, work->asyncCallbacks->onGetAllChallengeStatus)->Call(isolate->GetCurrentContext()->Global(), 2, argv);
      break;
    }
    case RDNAMethodID::RDNA_METH_UPDATE_CHALLENGE:
    {
      Handle<Value> argv[] = { String::NewFromUtf8(isolate, work->serializedCoreStatus), Number::New(isolate, work->errCode) };
      Local<Function>::New(isolate, work->asyncCallbacks->onUpdateChallengeStatus)->Call(isolate->GetCurrentContext()->Global(), 2, argv);
      break;
    }
    case RDNAMethodID::RDNA_METH_FORGOT_PASSWORD:
    {
      Handle<Value> argv[] = { String::NewFromUtf8(isolate, work->serializedCoreStatus), Number::New(isolate, work->errCode) };
      Local<Function>::New(isolate, work->asyncCallbacks->onForgotPasswordStatus)->Call(isolate->GetCurrentContext()->Global(), 2, argv);
      break;
    }
    case RDNAMethodID::RDNA_METH_CHECK_CHALLENGE:
    {
      Handle<Value> argv[] = { String::NewFromUtf8(isolate, work->serializedCoreStatus), Number::New(isolate, work->errCode) };
      Local<Function>::New(isolate, work->asyncCallbacks->onCheckChallengeResponseStatus)->Call(isolate->GetCurrentContext()->Global(), 2, argv);
      break;
    }
    case RDNAMethodID::RDNA_METH_GET_CREDS_CB:
    {
      Handle<Value> argv[] = { String::NewFromUtf8(isolate, work->serializedCoreStatus), Number::New(isolate, work->errCode) };
      Local<Function>::New(isolate, work->asyncCallbacks->getCredentials)->Call(isolate->GetCurrentContext()->Global(), 2, argv);
      break;
    }
    case RDNAMethodID::RDNA_METH_NONE:
    default:
    {
      DBG("%d Method not implemented\n", work->methID);
    }
  }

  delete work;
}

//Wrapper callbacks for core.
int onDeviceFPRequested_cb(char** deviceFp, void* appCtx)
{
  /**deviceFp = m_strdup("{ \
  \"AppIdentifier\": \"appId\", \
  \"AudioAdapter\": \"5,0,8,213\", \
  \"Bios\": \"9,0,54,161\", \
  \"BroadbandDevID\": \"7,0,16,135\", \
  \"BtMacAddr\": \"8,0,34,236\", \
  \"CpuId\": \"1,0,22,126\", \
  \"DiskSrNo\": \"3,0,188,103\", \
  \"IPAddress\": \"10.0.11.192\", \
  \"Manufacturer\": \"NOKIA\", \
  \"Memory\": \"2,0,7,129\", \
  \"NwMacAddr\": \"4,0,216,198\", \
  \"OsVersion\": \"8.1\", \
  \"Platform\": \"WinPhone\", \
  \"ProductName\": \"RM-998_im_india_910\", \
  \"TimeZone\": \"India Standard Time\", \
  \"Latitude\": \"10\", \
  \"Longitude\": \"15\", \
  \"Altitude\": \"21\" \
  }");*/
  int iRet = 0;
  std::string devFP = "";
  RDNAContext* wctx = (RDNAContext*)appCtx;
  generateDeviceSignature(wctx, devFP);

  if (!devFP.empty())
  {
    if (!*deviceFp)
    {
      *deviceFp = (char*)malloc(devFP.length() + 1);
    }
    else
    {
      *deviceFp = (char*)realloc(*deviceFp, (devFP.length() + 1));
    }
    *deviceFp = m_strdup(devFP.c_str());
  }
  else
  {
    *deviceFp = NULL;
    iRet = 1;
  }
  return iRet;
}

int onDnaStatusUpdate_cb(core_status_t* pStatus)
{
  RDNAContext* appCtx = (RDNAContext*)pStatus->pvtAppCtx;
  DBG("node addon callback error code - %d\n", pStatus->errCode);
  uv_work_t* request = new uv_work_t;
  AsyncWork* work = new AsyncWork();
  work->errCode = pStatus->errCode;
  work->methID = (RDNAMethodID)pStatus->eMethId;
  work->asyncCallbacks = appCtx->callbacks;
  switch (work->methID)
  {
    case RDNAMethodID::RDNA_METH_INITIALIZE:
    {
      if (CORE_ERR_NONE == pStatus->errCode && pStatus->pArgs)
      {
        setGlobalProxy("127.0.0.1", pStatus->pArgs->pxyDetails.port);
      }
      serializeCoreStatusStructure(pStatus, &work->serializedCoreStatus);
      break;
    }

    case RDNAMethodID::RDNA_METH_PAUSE:
    {
      serializePauseTerminateStatusStructure(pStatus, &work->serializedCoreStatus);
      break;
    }

    case RDNAMethodID::RDNA_METH_RESUME:
    {
      serializeCoreStatusStructure(pStatus, &work->serializedCoreStatus);
      break;
    }

    case RDNAMethodID::RDNA_METH_TERMINATE:
    {
      serializePauseTerminateStatusStructure(pStatus, &work->serializedCoreStatus);
      break;
    }

    case RDNAMethodID::RDNA_METH_LOGOFF:
    {
      serializeCoreStatusStructure(pStatus, &work->serializedCoreStatus);
      break;
    }

    case RDNAMethodID::RDNA_METH_GET_CONFIG:
    {
      serializeConfigStatusStructure(pStatus, &work->serializedCoreStatus);
      break;
    }

    case RDNAMethodID::RDNA_METH_GET_ALL_CHALLENGES:
    {
      serializeGetAllChlngsStatusStructure(pStatus, &work->serializedCoreStatus);
      break;
    }

    case RDNAMethodID::RDNA_METH_CHECK_CHALLENGE:
    {
      serializeCheckChlngsStatusStructure(pStatus, &work->serializedCoreStatus);
      break;
    }

    case RDNAMethodID::RDNA_METH_UPDATE_CHALLENGE:
    {
      serializeUpdateChlngsStatusStructure(pStatus, &work->serializedCoreStatus);
      break;
    }

    case RDNAMethodID::RDNA_METH_FORGOT_PASSWORD:
    {
      serializeForgotPswdStatusStructure(pStatus, &work->serializedCoreStatus);
      break;
    }
  }

  request->data = work;
  uv_queue_work(appCtx->loop, request, NoOpWorkAsync, WorkAsyncComplete);
  return 0;
}

int getDNSServerList_cb(void* pvAppCtx, char*** aDnsServerList)
{
  FIXED_INFO *pFixedInfo;
  ULONG ulOutBufLen;
  DWORD dwRetVal;
  IP_ADDR_STRING *pIPAddr;
  int iRet = 0;
  int nCount = 0;
  ulOutBufLen = sizeof(FIXED_INFO);
  char** pcDNSList = NULL;
  do
  {
    pFixedInfo = (FIXED_INFO *)m_calloc(1, sizeof(FIXED_INFO));
    if (NULL == pFixedInfo)
    {
      iRet = 1;
      break;
    }
    if (GetNetworkParams(pFixedInfo, &ulOutBufLen) == ERROR_BUFFER_OVERFLOW)
    {
      free(pFixedInfo);
      pFixedInfo = NULL;
      pFixedInfo = (FIXED_INFO *)calloc(1, ulOutBufLen);
      if (NULL == pFixedInfo)
      {
        iRet = 1;
        break;
      }
      if (dwRetVal = GetNetworkParams(pFixedInfo, &ulOutBufLen) == NO_ERROR)
      {
        pIPAddr = &pFixedInfo->DnsServerList;
        while (pIPAddr)
        {
          int nDnsServerIpLen = strlen(pIPAddr->IpAddress.String);
          nCount++;
          pcDNSList = (char**)realloc(pcDNSList, (nCount + 1) * sizeof(char*));
          pcDNSList[nCount - 1] = (char*)calloc(1, nDnsServerIpLen + 1);
          memcpy(pcDNSList[nCount - 1], pIPAddr->IpAddress.String, nDnsServerIpLen);
          pIPAddr = pIPAddr->Next;
          pcDNSList[nCount] = NULL;
        }
        *aDnsServerList = pcDNSList;
      }
    }
  } while (0);
  return iRet;
}

void getCredentials_cb(void* pvAppCtx, char* psUrl, char** psUserName,
                       char** psPassword, e_core_iwa_auth_status* status)
{
  if (NULL != pvAppCtx)
  {
    RDNAContext* appCtx = (RDNAContext*)pvAppCtx;
    uv_work_t* request = new uv_work_t;
    AsyncWork* work = new AsyncWork();
    work->errCode = 0;
    work->methID = RDNA_METH_GET_CREDS_CB;
    work->asyncCallbacks = appCtx->callbacks;
    serializeIWARequest(psUrl, &work->serializedCoreStatus);

    request->data = work;
    uv_queue_work(appCtx->loop, request, NoOpWorkAsync, WorkAsyncComplete);
    *status = (e_core_iwa_auth_status)RDNA_IWA_AUTH_DEFERRED;
  }
}

RDNA::RDNA() : coreCtx_(NULL) {
}

RDNA::~RDNA() {
}

void RDNA::Init(v8::Local<v8::Object> exports) {

  Nan::HandleScope scope;
  //Constructor template
  v8::Local<v8::FunctionTemplate> funcTemplate = Nan::New<v8::FunctionTemplate>(New);
  funcTemplate->SetClassName(Nan::New("RDNA").ToLocalChecked());
  funcTemplate->InstanceTemplate()->SetInternalFieldCount(1);

  //Set api prototypes
  Nan::SetPrototypeMethod(funcTemplate, "initialize"                   , initialize);
  Nan::SetPrototypeMethod(funcTemplate, "pause"                        , pauseRuntime);
  Nan::SetPrototypeMethod(funcTemplate, "resume"                       , resumeRuntime);
  Nan::SetPrototypeMethod(funcTemplate, "terminate"                    , terminate);

  Nan::SetPrototypeMethod(funcTemplate, "getSdkVersion"                , getSdkVersion);
  Nan::SetPrototypeMethod(funcTemplate, "getAgentID"                   , getAgentID);
  Nan::SetPrototypeMethod(funcTemplate, "getDeviceID"                  , getDeviceID);
  Nan::SetPrototypeMethod(funcTemplate, "getDefaultCipherSpec"         , getDefaultCipherSpec);
  Nan::SetPrototypeMethod(funcTemplate, "getDefaultCipherSalt"         , getDefaultCipherSalt);
  Nan::SetPrototypeMethod(funcTemplate, "getSessionID"                 , getSessionID);

  Nan::SetPrototypeMethod(funcTemplate, "getServiceByName"             , getServiceByServiceName);
  Nan::SetPrototypeMethod(funcTemplate, "getServiceByTargetCoordinates", getServiceByTargetCoordinate);
  Nan::SetPrototypeMethod(funcTemplate, "getAllServices"               , getAllServices);

  Nan::SetPrototypeMethod(funcTemplate, "serviceAccessStart"           , serviceAccessStart);
  Nan::SetPrototypeMethod(funcTemplate, "serviceAccessStop"            , serviceAccessStop);
  Nan::SetPrototypeMethod(funcTemplate, "serviceAccessStartAll"        , serviceAccessStartAll);
  Nan::SetPrototypeMethod(funcTemplate, "serviceAccessStopAll"         , serviceAccessStopAll);

  Nan::SetPrototypeMethod(funcTemplate, "setDNSServers"                , setDNSServers);

  Nan::SetPrototypeMethod(funcTemplate, "encryptDataPacket"            , encryptDataPacket);
  Nan::SetPrototypeMethod(funcTemplate, "decryptDataPacket"            , decryptDataPacket);
  Nan::SetPrototypeMethod(funcTemplate, "encryptHttpRequest"           , encryptHttpRequest);
  Nan::SetPrototypeMethod(funcTemplate, "decryptHttpResponse"          , decryptHttpResponse);
  Nan::SetPrototypeMethod(funcTemplate, "createPrivacyStream"          , createPrivacyStream);

  constructor.Reset(funcTemplate->GetFunction());
  exports->Set(Nan::New("RDNA").ToLocalChecked(), funcTemplate->GetFunction());
}

void RDNA::New(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  if (info.IsConstructCall()) {
    // Invoked as constructor: `new RDNA(...)`
    RDNA* obj = new RDNA();
    obj->Wrap(info.This());
    info.GetReturnValue().Set(info.This());
  }
  else {
    // Invoked as plain function `RDNA(...)`, turn into construct call.
    const int argc = 1;
    v8::Local<v8::Value> argv[argc] = { info[0] };
    v8::Local<v8::Function> cons = Nan::New<v8::Function>(constructor);
    info.GetReturnValue().Set(cons->NewInstance(argc, argv));
  }
}

void RDNA::getSdkVersion(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
  RDNA* obj = Nan::ObjectWrap::Unwrap<RDNA>(info.Holder());
  Isolate* isolate = info.GetIsolate();
  int error = 0;
  std::string version = std::string(coreGetSdkVersion());

  v8::Local<v8::Object> result = v8::Object::New(isolate);
  result->Set(v8::String::NewFromUtf8(isolate, "errorCode"), v8::Number::New(isolate, error));
  result->Set(v8::String::NewFromUtf8(isolate, "response"), Nan::New(version).ToLocalChecked());
  info.GetReturnValue().Set(result);
}

void RDNA::getSessionID(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
  //To do check for arguments
  /*if (info.Length() < 2) {
    Nan::ThrowTypeError("Wrong number of arguments");
    return;
  }

  if (!info[0]->IsNumber() || !info[1]->IsNumber()) {
    Nan::ThrowTypeError("Wrong arguments");
    return;
  }*/

  RDNA* obj = Nan::ObjectWrap::Unwrap<RDNA>(info.Holder());
  Isolate* isolate = info.GetIsolate();
  char* ssnID = NULL;
  int error = 0;
  std::string strSessionID = "";
  error = coreGetSessionID(obj->coreCtx_, &ssnID);
  if (0 == error)
  {
    if (ssnID != NULL && *ssnID)
    {
      strSessionID = std::string(ssnID);
    }
    else
    {
      error = RDNA_ERR_FAILED_TO_GET_SESSION_ID;
    }
  }
  
  v8::Local<v8::Object> result = v8::Object::New(isolate);
  result->Set(v8::String::NewFromUtf8(isolate, "errorCode"), v8::Number::New(isolate, error));
  result->Set(v8::String::NewFromUtf8(isolate, "response"), Nan::New(strSessionID).ToLocalChecked());
  info.GetReturnValue().Set(result);
}

void RDNA::getAgentID(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
  RDNA* obj = Nan::ObjectWrap::Unwrap<RDNA>(info.Holder());
  Isolate* isolate = info.GetIsolate();
  char* coreAgentID = NULL;
  int error = 0;
  std::string agentID = "";
  error = coreGetAgentID(obj->coreCtx_, &coreAgentID);
  if (0 == error)
  {
    if (coreAgentID && *coreAgentID)
    {
      agentID = std::string(coreAgentID);
    }
    else
    {
      error = RDNA_ERR_FAILED_TO_GET_AGENT_ID;
    }
  }

  v8::Local<v8::Object> result = v8::Object::New(isolate);
  result->Set(v8::String::NewFromUtf8(isolate, "errorCode"), v8::Number::New(isolate, error));
  result->Set(v8::String::NewFromUtf8(isolate, "response"), Nan::New(agentID).ToLocalChecked());
  info.GetReturnValue().Set(result);
}

void RDNA::getDeviceID(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
  RDNA* obj = Nan::ObjectWrap::Unwrap<RDNA>(info.Holder());
  Isolate* isolate = info.GetIsolate();
  char* coreDevID = NULL;
  int error = 0;
  std::string deviceID = "";

  error = coreGetDeviceID(obj->coreCtx_, &coreDevID);
  if (0 == error)
  {
    if (coreDevID && *coreDevID)
    {
      deviceID = std::string(coreDevID);
    }
    else
    {
      error = RDNA_ERR_FAILED_TO_GET_DEVICE_ID;
    }
  }

  v8::Local<v8::Object> result = v8::Object::New(isolate);
  result->Set(v8::String::NewFromUtf8(isolate, "errorCode"), v8::Number::New(isolate, error));
  result->Set(v8::String::NewFromUtf8(isolate, "response"), Nan::New(deviceID).ToLocalChecked());
  info.GetReturnValue().Set(result);
}

void RDNA::initialize(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
  RDNA* obj = Nan::ObjectWrap::Unwrap<RDNA>(info.Holder());
  Isolate* isolate = info.GetIsolate();
  int error        = 0;
  int gwPort       = 0;
  char* gwHost     = NULL;
  char* agentStr   = NULL;
  char* cipherSpec = NULL;
  char* cipherSalt = NULL;
  char* appContext = NULL;
  std::string errorMsg = "", hnip = "", agentInfo = "", cipherSaltStr = "";
  std::string strCbAppNameVal = "", cipherSpecStr = "", strAppCtx = "";
  proxy_settings_t* pxySettings = NULL;
  RDNAContext* appCtx = NULL;
  core_callbacks_t* wrapper_cbs = NULL;
  if (info.Length() < 20)
  {
    error = RDNA_ERR_WRONG_NUMBER_OF_ARGUMENTS;
    errorMsg = "Wrong number of arguments";
    goto RETURN;
  }

  //agentstr
  agentInfo = std::string(*v8::String::Utf8Value(info[0]));
  agentStr = m_strdup(agentInfo.c_str());

  //gwhnip
  hnip = std::string(*v8::String::Utf8Value(info[1]));
  gwHost = m_strdup(hnip.c_str());

  //gwport
  gwPort = info[2]->NumberValue();

  //cipherspec
  cipherSpecStr = std::string(*v8::String::Utf8Value(info[3]));
  cipherSpec = m_strdup(cipherSpecStr.c_str());

  //ciphersalt
  cipherSaltStr = std::string(*v8::String::Utf8Value(info[4]));
  cipherSalt = m_strdup(cipherSaltStr.c_str());

  //proxysettings
  pxySettings = unpack_proxy_settings(isolate, Handle<Object>::Cast(info[5]));

  //appcontext
  strAppCtx = std::string(*v8::String::Utf8Value(info[6]));
  appContext = m_strdup(strAppCtx.c_str());

  //callbacks
  v8::Local<v8::Function> onInit_cb            = Local<Function>::Cast(info[7]);
  v8::Local<v8::Function> onTerminate_cb       = Local<Function>::Cast(info[8]);
  v8::Local<v8::Function> onPause_cb           = Local<Function>::Cast(info[9]);
  v8::Local<v8::Function> onResume_cb          = Local<Function>::Cast(info[10]);
  v8::Local<v8::Function> onConfigReceived_cb  = Local<Function>::Cast(info[11]);
  v8::Local<v8::Function> onChkChlngRespStatus = Local<Function>::Cast(info[12]);
  v8::Local<v8::Function> onGetAllChlngs       = Local<Function>::Cast(info[13]);
  v8::Local<v8::Function> onUpdateChlngs       = Local<Function>::Cast(info[14]);
  v8::Local<v8::Function> onFogotPswd_cb       = Local<Function>::Cast(info[15]);
  v8::Local<v8::Function> onLogOff_cb          = Local<Function>::Cast(info[16]);
  v8::Local<v8::Function> getCreds_cb          = Local<Function>::Cast(info[17]);
  v8::Local<v8::Function> getAppName_cb        = Local<Function>::Cast(info[18]);
  v8::Local<v8::Function> getAppVersion_cb     = Local<Function>::Cast(info[19]);

  appCtx = new RDNAContext();
  appCtx->callbacks = new  ApplicationCallbacks();
  appCtx->callbacks->onInitializeCompleted.Reset(isolate, onInit_cb);
  appCtx->callbacks->onTerminate.Reset(isolate, onTerminate_cb);
  appCtx->callbacks->onPauseRuntime.Reset(isolate, onPause_cb);
  appCtx->callbacks->onResumeRuntime.Reset(isolate, onResume_cb);
  appCtx->callbacks->onConfigRecieved.Reset(isolate, onConfigReceived_cb);
  appCtx->callbacks->onCheckChallengeResponseStatus.Reset(isolate, onChkChlngRespStatus);
  appCtx->callbacks->onGetAllChallengeStatus.Reset(isolate, onGetAllChlngs);
  appCtx->callbacks->onUpdateChallengeStatus.Reset(isolate, onUpdateChlngs);
  appCtx->callbacks->onForgotPasswordStatus.Reset(isolate, onFogotPswd_cb);
  appCtx->callbacks->onLogOff.Reset(isolate, onLogOff_cb);
  appCtx->callbacks->getCredentials.Reset(isolate, getCreds_cb);
  appCtx->callbacks->getApplicationName.Reset(isolate, getAppName_cb);
  appCtx->callbacks->getApplicationVersion.Reset(isolate, getAppVersion_cb);

  appCtx->isolate = isolate;
  appCtx->loop    = uv_default_loop();
  appCtx->rdnaObj = obj;

  //Callback to get APP name and version
  printf("firing sync callback from sync init...!\n");
  Local<Value> argv[] = { Null(), Nan::New("hello").ToLocalChecked() };
  v8::Local<v8::Function> x = Local<Function>::New(isolate, getAppName_cb);
  v8::Local<v8::Value> val = x->Call(isolate->GetCurrentContext()->Global(), 1, argv);
  strCbAppNameVal = std::string(*v8::String::Utf8Value(val));
  printf("value from callback is %s\n", strCbAppNameVal.c_str());
  printf("firing sync callback from sync init...!\n");
  //Callback to get get Dns servers

  wrapper_cbs                          = (core_callbacks_t*)malloc(sizeof(core_callbacks_t));
  wrapper_cbs->pfnGetDeviceFingerprint = onDeviceFPRequested_cb;
  wrapper_cbs->pfnStatusUpdate         = onDnaStatusUpdate_cb;
  wrapper_cbs->pfnGetCredentials       = getCredentials_cb;
  wrapper_cbs->pfnGetDnsServerList     = getDNSServerList_cb;

  error = coreInitialize(&obj->coreCtx_, agentStr, wrapper_cbs, gwHost, gwPort,
                         cipherSpec, cipherSalt, pxySettings, (void*)appCtx);

RETURN:
  v8::Local<v8::Object> result = v8::Object::New(isolate);
  result->Set(v8::String::NewFromUtf8(isolate, "errorCode"), v8::Number::New(isolate, error));
  result->Set(v8::String::NewFromUtf8(isolate, "response"), Nan::New(errorMsg).ToLocalChecked());
  info.GetReturnValue().Set(result);
}

void RDNA::setDNSServers(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
  RDNA* obj = Nan::ObjectWrap::Unwrap<RDNA>(info.Holder());
  Isolate* isolate = info.GetIsolate();
  std::string errorMsg = "", strDnsServerList = "";
  char* dnsList = NULL;
  int errID = RDNA_ERR_WRONG_NUMBER_OF_ARGUMENTS;
  char **dnsServerList = NULL;
  if (info.Length() < 1)
  {
    goto RETURN;
  }

  strDnsServerList = std::string(*v8::String::Utf8Value(info[0]));
  dnsList = m_strdup(strDnsServerList.c_str());

  dnsServerList = str_split(dnsList, ';');

  errID = coreSetDnsServer(obj->coreCtx_, dnsServerList);
  
RETURN:
  v8::Local<v8::Object> result = v8::Object::New(isolate);
  result->Set(v8::String::NewFromUtf8(isolate, "errorCode"), v8::Number::New(isolate, errID));
  result->Set(v8::String::NewFromUtf8(isolate, "response"), Nan::New(errorMsg).ToLocalChecked());
  info.GetReturnValue().Set(result);
}

void RDNA::terminate(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
  RDNA* obj = Nan::ObjectWrap::Unwrap<RDNA>(info.Holder());
  Isolate* isolate = info.GetIsolate();
  int errID = coreTerminate(obj->coreCtx_);
  std::string errorMsg = "";
  if (0 == errID)
  {
    obj->coreCtx_ = NULL;
  }

  v8::Local<v8::Object> result = v8::Object::New(isolate);
  result->Set(v8::String::NewFromUtf8(isolate, "errorCode"), v8::Number::New(isolate, errID));
  result->Set(v8::String::NewFromUtf8(isolate, "response"), Nan::New(errorMsg).ToLocalChecked());
  info.GetReturnValue().Set(result);
}

void RDNA::pauseRuntime(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
  RDNA* obj = Nan::ObjectWrap::Unwrap<RDNA>(info.Holder());
  Isolate* isolate = info.GetIsolate();
  int errID = RDNA_ERR_NONE;
  std::string strResponse = "";
  char* pvState = NULL;
  int sizeContext = 0;

  errID = corePauseRuntime(obj->coreCtx_, &pvState, &sizeContext);
  if (errID == RDNA_ERR_NONE)
  {
    obj->coreCtx_ = NULL;
    if (pvState == NULL || sizeContext <= 0)
    {
      errID = RDNA_ERR_INVALID_SAVED_CONTEXT;
    }
    else
    {
      strResponse.clear();
      strResponse.assign(pvState, sizeContext);
    }
  }

  v8::Local<v8::Object> result = v8::Object::New(isolate);
  result->Set(v8::String::NewFromUtf8(isolate, "errorCode"), v8::Number::New(isolate, errID));
  result->Set(v8::String::NewFromUtf8(isolate, "response"), Nan::New(strResponse).ToLocalChecked());
  info.GetReturnValue().Set(result);
}

void RDNA::resumeRuntime(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
  RDNA* obj = Nan::ObjectWrap::Unwrap<RDNA>(info.Holder());
  Isolate* isolate = info.GetIsolate();
  int errID = RDNA_ERR_NONE;
  std::string errorMsg = "";
  proxy_settings_t* pxySettings = NULL;
  RDNAContext* appCtx = NULL;
  int ctxLen = 0;
  core_callbacks_t* wrapper_cbs = NULL;
  char *appContext = NULL, *strCoreState = NULL;
  std::string strCbAppNameVal = "", strAppCtx = "", savedState = "";

  if (info.Length() != 16)
  {
    errID = RDNA_ERR_WRONG_NUMBER_OF_ARGUMENTS;
    goto RETURN;
  }

  //saved core state
  //appcontext
  savedState = std::string(*v8::String::Utf8Value(info[0]));
  strCoreState = m_strdup(savedState.c_str());
  ctxLen = savedState.length();

  //proxysettings
  pxySettings = unpack_proxy_settings(isolate, Handle<Object>::Cast(info[1]));

  //appcontext
  strAppCtx = std::string(*v8::String::Utf8Value(info[2]));
  appContext = m_strdup(strAppCtx.c_str());

  //callbacks
  v8::Local<v8::Function> onInit_cb = Local<Function>::Cast(info[3]);
  v8::Local<v8::Function> onTerminate_cb = Local<Function>::Cast(info[4]);
  v8::Local<v8::Function> onPause_cb = Local<Function>::Cast(info[5]);
  v8::Local<v8::Function> onResume_cb = Local<Function>::Cast(info[6]);
  v8::Local<v8::Function> onConfigReceived_cb = Local<Function>::Cast(info[7]);
  v8::Local<v8::Function> onChkChlngRespStatus = Local<Function>::Cast(info[8]);
  v8::Local<v8::Function> onGetAllChlngs = Local<Function>::Cast(info[9]);
  v8::Local<v8::Function> onUpdateChlngs = Local<Function>::Cast(info[10]);
  v8::Local<v8::Function> onFogotPswd_cb = Local<Function>::Cast(info[11]);
  v8::Local<v8::Function> onLogOff_cb = Local<Function>::Cast(info[12]);
  v8::Local<v8::Function> getCreds_cb = Local<Function>::Cast(info[13]);
  v8::Local<v8::Function> getAppName_cb = Local<Function>::Cast(info[14]);
  v8::Local<v8::Function> getAppVersion_cb = Local<Function>::Cast(info[15]);

  appCtx = new RDNAContext();
  appCtx->callbacks = new  ApplicationCallbacks();
  appCtx->callbacks->onInitializeCompleted.Reset(isolate, onInit_cb);
  appCtx->callbacks->onTerminate.Reset(isolate, onTerminate_cb);
  appCtx->callbacks->onPauseRuntime.Reset(isolate, onPause_cb);
  appCtx->callbacks->onResumeRuntime.Reset(isolate, onResume_cb);
  appCtx->callbacks->onConfigRecieved.Reset(isolate, onConfigReceived_cb);
  appCtx->callbacks->onCheckChallengeResponseStatus.Reset(isolate, onChkChlngRespStatus);
  appCtx->callbacks->onGetAllChallengeStatus.Reset(isolate, onGetAllChlngs);
  appCtx->callbacks->onUpdateChallengeStatus.Reset(isolate, onUpdateChlngs);
  appCtx->callbacks->onForgotPasswordStatus.Reset(isolate, onFogotPswd_cb);
  appCtx->callbacks->onLogOff.Reset(isolate, onLogOff_cb);
  appCtx->callbacks->getCredentials.Reset(isolate, getCreds_cb);
  appCtx->callbacks->getApplicationName.Reset(isolate, getAppName_cb);
  appCtx->callbacks->getApplicationVersion.Reset(isolate, getAppVersion_cb);

  appCtx->isolate = isolate;
  appCtx->loop = uv_default_loop();
  appCtx->rdnaObj = obj;

  wrapper_cbs = (core_callbacks_t*)malloc(sizeof(core_callbacks_t));
  wrapper_cbs->pfnGetDeviceFingerprint = onDeviceFPRequested_cb;
  wrapper_cbs->pfnStatusUpdate = onDnaStatusUpdate_cb;
  wrapper_cbs->pfnGetCredentials = getCredentials_cb;
  wrapper_cbs->pfnGetDnsServerList = getDNSServerList_cb;

  errID = coreResumeRuntime(&obj->coreCtx_, strCoreState, ctxLen, wrapper_cbs, pxySettings, (void*)appCtx);

  RETURN:
  v8::Local<v8::Object> result = v8::Object::New(isolate);
  result->Set(v8::String::NewFromUtf8(isolate, "errorCode"), v8::Number::New(isolate, errID));
  result->Set(v8::String::NewFromUtf8(isolate, "response"), Nan::New(errorMsg).ToLocalChecked());
  info.GetReturnValue().Set(result);
}

void RDNA::getServiceByServiceName(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
  RDNA* obj = Nan::ObjectWrap::Unwrap<RDNA>(info.Holder());
  Isolate* isolate = info.GetIsolate();
  core_service_t *svcName = NULL;
  char* strSvc = NULL;
  int errID = RDNA_ERR_SERVICE_NOT_SUPPORTED;
  std::string strResponse = "", serviceName = "";

  if (info.Length() != 1)
  {
    errID = RDNA_ERR_WRONG_NUMBER_OF_ARGUMENTS;
    goto RETURN;
  }

  serviceName = trim(std::string(*v8::String::Utf8Value(info[0])));
  if (!serviceName.empty())
  {
    errID = coreGetServiceByServiceName(obj->coreCtx_, (char*)serviceName.c_str(), &svcName);
    serializeService(svcName, &strSvc);
    if (strSvc)
    {
      strResponse = std::string(strSvc);
    }
  }

  RETURN:
  v8::Local<v8::Object> result = v8::Object::New(isolate);
  result->Set(v8::String::NewFromUtf8(isolate, "errorCode"), v8::Number::New(isolate, errID));
  result->Set(v8::String::NewFromUtf8(isolate, "response"), Nan::New(strResponse).ToLocalChecked());
  info.GetReturnValue().Set(result);
}

void RDNA::getServiceByTargetCoordinate(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
  RDNA* obj = Nan::ObjectWrap::Unwrap<RDNA>(info.Holder());
  Isolate* isolate = info.GetIsolate();
  int errID = RDNA_ERR_SERVICE_NOT_SUPPORTED;
  std::string strResponse = "", svcHost = "";
  int svcPort = 0;
  core_service_t** svcName = NULL;
  char* svcJSON = NULL;

  if (info.Length() != 2)
  {
    errID = RDNA_ERR_WRONG_NUMBER_OF_ARGUMENTS;
    goto RETURN;
  }

  svcHost = std::string(*v8::String::Utf8Value(info[0]));
  svcPort = info[1]->NumberValue();


  errID = coreGetServiceByTargetCoordinate(obj->coreCtx_, (char*)svcHost.c_str(), svcPort, &svcName);
  if (CORE_ERR_NONE == errID)
  {
    if (svcName)
    {
      serializeServiceList((void**)svcName, &svcJSON);
      if (svcJSON)
      {
        strResponse = std::string(svcJSON);
      }
    }
  }

  RETURN:
  v8::Local<v8::Object> result = v8::Object::New(isolate);
  result->Set(v8::String::NewFromUtf8(isolate, "errorCode"), v8::Number::New(isolate, errID));
  result->Set(v8::String::NewFromUtf8(isolate, "response"), Nan::New(strResponse).ToLocalChecked());
  info.GetReturnValue().Set(result);
}

void RDNA::getAllServices(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
  RDNA* obj = Nan::ObjectWrap::Unwrap<RDNA>(info.Holder());
  Isolate* isolate = info.GetIsolate();
  int errID = RDNA_ERR_NONE;
  std::string strResponse = "";
  core_service_t** svcName = NULL;
  char* serviceJSON = NULL;

  errID = coreGetAllServices(obj->coreCtx_, &svcName);
  if (CORE_ERR_NONE == errID && svcName)
  {
    serializeServiceList((void**)svcName, &serviceJSON);
    if (serviceJSON)
    {
      strResponse = std::string(serviceJSON);
    }
  }

  v8::Local<v8::Object> result = v8::Object::New(isolate);
  result->Set(v8::String::NewFromUtf8(isolate, "errorCode"), v8::Number::New(isolate, errID));
  result->Set(v8::String::NewFromUtf8(isolate, "response"), Nan::New(strResponse).ToLocalChecked());
  info.GetReturnValue().Set(result);
}

void RDNA::getDefaultCipherSpec(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
  RDNA* obj = Nan::ObjectWrap::Unwrap<RDNA>(info.Holder());
  Isolate* isolate = info.GetIsolate();
  int errID = RDNA_ERR_NONE;
  std::string strResponse = "";
  char *ciphSpecRdna = NULL;

  errID = coreGetDefaultCipherSpec(obj->coreCtx_, &ciphSpecRdna);
  if (0 == errID)
  {
    if (ciphSpecRdna)
    {
      strResponse = std::string(ciphSpecRdna);
      free(ciphSpecRdna);
    }
  }

  v8::Local<v8::Object> result = v8::Object::New(isolate);
  result->Set(v8::String::NewFromUtf8(isolate, "errorCode"), v8::Number::New(isolate, errID));
  result->Set(v8::String::NewFromUtf8(isolate, "response"), Nan::New(strResponse).ToLocalChecked());
  info.GetReturnValue().Set(result);
}

void RDNA::getDefaultCipherSalt(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
  RDNA* obj = Nan::ObjectWrap::Unwrap<RDNA>(info.Holder());
  Isolate* isolate = info.GetIsolate();
  int errID = RDNA_ERR_NONE;
  std::string strResponse = "";
  char *cipherSaltRdna = NULL;

  errID = coreGetDefaultCipherSalt(obj->coreCtx_, &cipherSaltRdna);
  if (0 == errID)
  {
    printf("no error\n");
    if (cipherSaltRdna)
    {
      printf("rcvd salt\n");
      strResponse = std::string(cipherSaltRdna);
      free(cipherSaltRdna);
    }
  }

  v8::Local<v8::Object> result = v8::Object::New(isolate);
  result->Set(v8::String::NewFromUtf8(isolate, "errorCode"), v8::Number::New(isolate, errID));
  result->Set(v8::String::NewFromUtf8(isolate, "response"), Nan::New(strResponse).ToLocalChecked());
  info.GetReturnValue().Set(result);
}

void RDNA::serviceAccessStart(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
  RDNA* obj = Nan::ObjectWrap::Unwrap<RDNA>(info.Holder());
  Isolate* isolate = info.GetIsolate();
  core_service_t* svc = NULL;
  int errID = RDNA_ERR_NONE;
  std::string strResponse = "";

  if (info.Length() != 1)
  {
    errID = RDNA_ERR_WRONG_NUMBER_OF_ARGUMENTS;
    goto RETURN;
  }

  errID = unpack_service_object(isolate, Handle<Object>::Cast(info[0]), &svc);

  if (RDNA_ERR_NONE == errID)
  {
    errID = coreServiceAccessStart(obj->coreCtx_, svc);
  }

  RETURN:
  m_free(svc);
  v8::Local<v8::Object> result = v8::Object::New(isolate);
  result->Set(v8::String::NewFromUtf8(isolate, "errorCode"), v8::Number::New(isolate, errID));
  result->Set(v8::String::NewFromUtf8(isolate, "response"), Nan::New(strResponse).ToLocalChecked());
  info.GetReturnValue().Set(result);
}

void RDNA::serviceAccessStop(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
  RDNA* obj = Nan::ObjectWrap::Unwrap<RDNA>(info.Holder());
  Isolate* isolate = info.GetIsolate();
  int errID = RDNA_ERR_NONE;
  std::string strResponse = "";
  core_service_t* svc = NULL;

  if (info.Length() != 1)
  {
    errID = RDNA_ERR_WRONG_NUMBER_OF_ARGUMENTS;
    goto RETURN;
  }

  errID = unpack_service_object(isolate, Handle<Object>::Cast(info[0]), &svc);

  if (RDNA_ERR_NONE == errID)
  {
    errID = coreServiceAccessStop(obj->coreCtx_, svc);
  }

  RETURN:
  v8::Local<v8::Object> result = v8::Object::New(isolate);
  result->Set(v8::String::NewFromUtf8(isolate, "errorCode"), v8::Number::New(isolate, errID));
  result->Set(v8::String::NewFromUtf8(isolate, "response"), Nan::New(strResponse).ToLocalChecked());
  info.GetReturnValue().Set(result);
}

void RDNA::serviceAccessStartAll(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
  RDNA* obj = Nan::ObjectWrap::Unwrap<RDNA>(info.Holder());
  Isolate* isolate = info.GetIsolate();
  int errID = RDNA_ERR_NONE;
  std::string strResponse = "";

  errID = coreServiceAccessStartAll(obj->coreCtx_);

  v8::Local<v8::Object> result = v8::Object::New(isolate);
  result->Set(v8::String::NewFromUtf8(isolate, "errorCode"), v8::Number::New(isolate, errID));
  result->Set(v8::String::NewFromUtf8(isolate, "response"), Nan::New(strResponse).ToLocalChecked());
  info.GetReturnValue().Set(result);
}

void RDNA::serviceAccessStopAll(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
  RDNA* obj = Nan::ObjectWrap::Unwrap<RDNA>(info.Holder());
  Isolate* isolate = info.GetIsolate();
  int errID = RDNA_ERR_NONE;
  std::string strResponse = "";

  errID = coreServiceAccessStopAll(obj->coreCtx_);

  v8::Local<v8::Object> result = v8::Object::New(isolate);
  result->Set(v8::String::NewFromUtf8(isolate, "errorCode"), v8::Number::New(isolate, errID));
  result->Set(v8::String::NewFromUtf8(isolate, "response"), Nan::New(strResponse).ToLocalChecked());
  info.GetReturnValue().Set(result);
}

void RDNA::encryptDataPacket(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
  RDNA* obj = Nan::ObjectWrap::Unwrap<RDNA>(info.Holder());
  Isolate* isolate = info.GetIsolate();
  int errID = RDNA_ERR_NONE;
  std::string strResponse = "", strScope = "", strSpec = "", strSalt = "", strTxt = "";
  void* opCipherText = NULL;
  int opCipherTextLen = 0;

  if (info.Length() != 4)
  {
    errID = RDNA_ERR_WRONG_NUMBER_OF_ARGUMENTS;
    goto RETURN;
  }

  strScope = trim(std::string(*v8::String::Utf8Value(info[0])));
  strSpec = trim(std::string(*v8::String::Utf8Value(info[1])));
  strSalt = trim(std::string(*v8::String::Utf8Value(info[2])));
  strTxt = trim(std::string(*v8::String::Utf8Value(info[3])));

  e_core_privacy_scope_t privacyScope = (e_core_privacy_scope_t)getCorePrivacyScope(strScope);
  errID = coreEncryptDataPacket(obj->coreCtx_, privacyScope, (char*)strSpec.c_str(),
    (char*)strSalt.c_str(), (void*)strTxt.c_str(), strTxt.length(), &opCipherText, &opCipherTextLen);

  if (RDNA_ERR_NONE == errID)
  {
    int len = 0;
    unsigned char* encodedData = base64_encode(&len, (unsigned char*)opCipherText, opCipherTextLen);
    strResponse = std::string((char*)encodedData);
  }

  RETURN:
  v8::Local<v8::Object> result = v8::Object::New(isolate);
  result->Set(v8::String::NewFromUtf8(isolate, "errorCode"), v8::Number::New(isolate, errID));
  result->Set(v8::String::NewFromUtf8(isolate, "response"), Nan::New(strResponse).ToLocalChecked());
  info.GetReturnValue().Set(result);
}

void RDNA::decryptDataPacket(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
  RDNA* obj = Nan::ObjectWrap::Unwrap<RDNA>(info.Holder());
  Isolate* isolate = info.GetIsolate();
  int errID = RDNA_ERR_NONE;
  std::string strResponse = "", strScope = "", strSpec = "", strSalt = "", strTxt = "";
  int cipherTextLen = 0;
  unsigned char* cipherText = NULL;
  void* opPlainText = NULL;
  int opPlainTextLen = 0;

  if (info.Length() != 4)
  {
    errID = RDNA_ERR_WRONG_NUMBER_OF_ARGUMENTS;
    goto RETURN;
  }

  strScope = trim(std::string(*v8::String::Utf8Value(info[0])));
  strSpec = trim(std::string(*v8::String::Utf8Value(info[1])));
  strSalt = trim(std::string(*v8::String::Utf8Value(info[2])));
  strTxt = trim(std::string(*v8::String::Utf8Value(info[3])));

  e_core_privacy_scope_t privacyScope = (e_core_privacy_scope_t)getCorePrivacyScope(strScope);
  
  cipherText = base64_decode(&cipherTextLen, (unsigned char*)strTxt.c_str(), strTxt.length());

  errID = coreDecryptDataPacket(obj->coreCtx_, privacyScope, (char*)strSpec.c_str(),
          (char*)strSalt.c_str(), (void*)cipherText, cipherTextLen, &opPlainText, &opPlainTextLen);
  printf("%s\n", opPlainText);
  if (RDNA_ERR_NONE == errID)
  {
    char* pcText = (char*)m_malloc(opPlainTextLen + 1);
    memset(pcText, 0, opPlainTextLen + 1);
    memcpy(pcText, opPlainText, opPlainTextLen);
    free(opPlainText);
    opPlainText = NULL;
    opPlainTextLen = 0;
    strResponse = std::string(pcText);
  }

  RETURN:
  v8::Local<v8::Object> result = v8::Object::New(isolate);
  result->Set(v8::String::NewFromUtf8(isolate, "errorCode"), v8::Number::New(isolate, errID));
  result->Set(v8::String::NewFromUtf8(isolate, "response"), Nan::New(strResponse).ToLocalChecked());
  info.GetReturnValue().Set(result);
}

void RDNA::encryptHttpRequest(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
  RDNA* obj = Nan::ObjectWrap::Unwrap<RDNA>(info.Holder());
  Isolate* isolate = info.GetIsolate();
  int errID = RDNA_ERR_NONE;
  std::string strResponse = "", strScope = "", strSpec = "", strSalt = "", strTxt = "";
  char* transformedRequest = NULL;
  int transformedRequestLen = 0;
  if (info.Length() != 4)
  {
    errID = RDNA_ERR_WRONG_NUMBER_OF_ARGUMENTS;
    goto RETURN;
  }

  strScope = trim(std::string(*v8::String::Utf8Value(info[0])));
  strSpec = trim(std::string(*v8::String::Utf8Value(info[1])));
  strSalt = trim(std::string(*v8::String::Utf8Value(info[2])));
  strTxt = trim(std::string(*v8::String::Utf8Value(info[3])));

  e_core_privacy_scope_t privacyScope = (e_core_privacy_scope_t)getCorePrivacyScope(strScope);
  errID = coreEncryptHttpRequest(obj->coreCtx_, privacyScope, (char*)strSpec.c_str(), (char*)strSalt.c_str(),
          (char*)strTxt.c_str(), strTxt.length(), &transformedRequest, &transformedRequestLen);

  if (RDNA_ERR_NONE == errID)
  {
    strResponse = std::string(transformedRequest, transformedRequestLen);
  }

  RETURN:
  v8::Local<v8::Object> result = v8::Object::New(isolate);
  result->Set(v8::String::NewFromUtf8(isolate, "errorCode"), v8::Number::New(isolate, errID));
  result->Set(v8::String::NewFromUtf8(isolate, "response"), Nan::New(strResponse).ToLocalChecked());
  info.GetReturnValue().Set(result);
}

void RDNA::decryptHttpResponse(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
  RDNA* obj = Nan::ObjectWrap::Unwrap<RDNA>(info.Holder());
  Isolate* isolate = info.GetIsolate();
  int errID = RDNA_ERR_NONE;
  std::string strResponse = "", strScope = "", strSpec = "", strSalt = "", strTxt = "";
  char* response = NULL;
  int responseLen = 0;
  if (info.Length() != 4)
  {
    errID = RDNA_ERR_WRONG_NUMBER_OF_ARGUMENTS;
    goto RETURN;
  }

  strScope = trim(std::string(*v8::String::Utf8Value(info[0])));
  strSpec = trim(std::string(*v8::String::Utf8Value(info[1])));
  strSalt = trim(std::string(*v8::String::Utf8Value(info[2])));
  strTxt = trim(std::string(*v8::String::Utf8Value(info[3])));

  e_core_privacy_scope_t privacyScope = (e_core_privacy_scope_t)getCorePrivacyScope(strScope);
  errID = coreDecryptHttpResponse(obj->coreCtx_, privacyScope, (char*)strSpec.c_str(), (char*)strSalt.c_str(),
          (char*)strTxt.c_str(), strTxt.length(), &response, &responseLen);

  if (RDNA_ERR_NONE == errID)
  {
    strResponse = std::string(response, responseLen);
  }

  RETURN:
  v8::Local<v8::Object> result = v8::Object::New(isolate);
  result->Set(v8::String::NewFromUtf8(isolate, "errorCode"), v8::Number::New(isolate, errID));
  result->Set(v8::String::NewFromUtf8(isolate, "response"), Nan::New(strResponse).ToLocalChecked());
  info.GetReturnValue().Set(result);
}

void RDNA::getConfig(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
  //Callback remains
  RDNA* obj = Nan::ObjectWrap::Unwrap<RDNA>(info.Holder());
  Isolate* isolate = info.GetIsolate();
  int errID = RDNA_ERR_NONE;
  std::string strResponse = "", strConfigKey = "";

  if (info.Length() != 1)
  {
    errID = RDNA_ERR_WRONG_NUMBER_OF_ARGUMENTS;
    goto RETURN;
  }

  strConfigKey = trim(std::string(*v8::String::Utf8Value(info[0])));
  if (strConfigKey.empty())
  {
    errID = RDNA_ERR_INVALID_ARGS;
  }
  else
  {
    errID = coreGetConfig(obj->coreCtx_, (char*)strConfigKey.c_str(), strConfigKey.length());
  }

RETURN:
  v8::Local<v8::Object> result = v8::Object::New(isolate);
  result->Set(v8::String::NewFromUtf8(isolate, "errorCode"), v8::Number::New(isolate, errID));
  result->Set(v8::String::NewFromUtf8(isolate, "response"), Nan::New(strResponse).ToLocalChecked());
  info.GetReturnValue().Set(result);
}

void RDNA::getAllChallenges(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
  RDNA* obj = Nan::ObjectWrap::Unwrap<RDNA>(info.Holder());
  Isolate* isolate = info.GetIsolate();
  int errID = RDNA_ERR_NONE;
  std::string strResponse = "", strUserID = "";

  if (info.Length() != 1)
  {
    errID = RDNA_ERR_WRONG_NUMBER_OF_ARGUMENTS;
    goto RETURN;
  }

  strUserID = trim(std::string(*v8::String::Utf8Value(info[0])));

  if (strUserID.empty())
  {
    errID = RDNA_ERR_USERID_EMPTY;
  }
  else
  {
    errID = coreGetAllChallenges(obj->coreCtx_, (char*)strUserID.c_str(), strUserID.length());
  }

RETURN:
  v8::Local<v8::Object> result = v8::Object::New(isolate);
  result->Set(v8::String::NewFromUtf8(isolate, "errorCode"), v8::Number::New(isolate, errID));
  result->Set(v8::String::NewFromUtf8(isolate, "response"), Nan::New(strResponse).ToLocalChecked());
  info.GetReturnValue().Set(result);
}

void RDNA::checkChallengeResponse(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
  RDNA* obj = Nan::ObjectWrap::Unwrap<RDNA>(info.Holder());
  Isolate* isolate = info.GetIsolate();
  int errID = RDNA_ERR_NONE;
  std::string strResponse = "", strUserID = "", strChlngResp = "";

  if (info.Length() != 2)
  {
    errID = RDNA_ERR_WRONG_NUMBER_OF_ARGUMENTS;
    goto RETURN;
  }

  strUserID = trim(std::string(*v8::String::Utf8Value(info[0])));
  strChlngResp = trim(std::string(*v8::String::Utf8Value(info[1])));

  if (strUserID.empty())
  {
    errID = RDNA_ERR_USERID_EMPTY;
  }
  else if (strChlngResp.empty())
  {
    errID = RDNA_ERR_CHALLENGE_EMPTY;
  }
  else
  {
    errID = coreCheckChallenge(obj->coreCtx_, (char*)strUserID.c_str(), strUserID.length(), (char*)strChlngResp.c_str());
  }

RETURN:
  v8::Local<v8::Object> result = v8::Object::New(isolate);
  result->Set(v8::String::NewFromUtf8(isolate, "errorCode"), v8::Number::New(isolate, errID));
  result->Set(v8::String::NewFromUtf8(isolate, "response"), Nan::New(strResponse).ToLocalChecked());
  info.GetReturnValue().Set(result);
}

void RDNA::updateChallenges(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
  RDNA* obj = Nan::ObjectWrap::Unwrap<RDNA>(info.Holder());
  Isolate* isolate = info.GetIsolate();
  int errID = RDNA_ERR_NONE;
  std::string strResponse = "", strUserID = "", strChlngArray = "";

  if (info.Length() != 2)
  {
    errID = RDNA_ERR_WRONG_NUMBER_OF_ARGUMENTS;
    goto RETURN;
  }

  strUserID = trim(std::string(*v8::String::Utf8Value(info[0])));
  strChlngArray = trim(std::string(*v8::String::Utf8Value(info[1])));

  if (strUserID.empty())
  {
    errID = RDNA_ERR_USERID_EMPTY;
  }
  else if (strChlngArray.empty())
  {
    errID = RDNA_ERR_CHALLENGE_EMPTY;
  }
  else
  {
    errID = coreUpdateChallenge(obj->coreCtx_, (char*)strUserID.c_str(), strUserID.length(), (char*)strChlngArray.c_str());
  }

RETURN:
  v8::Local<v8::Object> result = v8::Object::New(isolate);
  result->Set(v8::String::NewFromUtf8(isolate, "errorCode"), v8::Number::New(isolate, errID));
  result->Set(v8::String::NewFromUtf8(isolate, "response"), Nan::New(strResponse).ToLocalChecked());
  info.GetReturnValue().Set(result);
}

void RDNA::logOff(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
  RDNA* obj = Nan::ObjectWrap::Unwrap<RDNA>(info.Holder());
  Isolate* isolate = info.GetIsolate();
  int errID = RDNA_ERR_NONE;
  std::string strResponse = "", strUserID = "";

  if (info.Length() != 1)
  {
    errID = RDNA_ERR_WRONG_NUMBER_OF_ARGUMENTS;
    goto RETURN;
  }

  strUserID = trim(std::string(*v8::String::Utf8Value(info[0])));
  if (strUserID.empty())
  {
    errID = RDNA_ERR_USERID_EMPTY;
  }
  else
  {
    errID = coreLogOff(obj->coreCtx_, (char*)strUserID.c_str(), strUserID.length());
  }

RETURN:
  v8::Local<v8::Object> result = v8::Object::New(isolate);
  result->Set(v8::String::NewFromUtf8(isolate, "errorCode"), v8::Number::New(isolate, errID));
  result->Set(v8::String::NewFromUtf8(isolate, "response"), Nan::New(strResponse).ToLocalChecked());
  info.GetReturnValue().Set(result);
}

void RDNA::resetChallenge(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
  RDNA* obj = Nan::ObjectWrap::Unwrap<RDNA>(info.Holder());
  Isolate* isolate = info.GetIsolate();
  int errID = RDNA_ERR_NONE;
  std::string strResponse = "";

  errID = coreResetChallenge(obj->coreCtx_);

RETURN:
  v8::Local<v8::Object> result = v8::Object::New(isolate);
  result->Set(v8::String::NewFromUtf8(isolate, "errorCode"), v8::Number::New(isolate, errID));
  result->Set(v8::String::NewFromUtf8(isolate, "response"), Nan::New(strResponse).ToLocalChecked());
  info.GetReturnValue().Set(result);
}

void RDNA::forgotPassword(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
  RDNA* obj = Nan::ObjectWrap::Unwrap<RDNA>(info.Holder());
  Isolate* isolate = info.GetIsolate();
  int errID = RDNA_ERR_NONE;
  std::string strResponse = "", strUserID = "";

  if (info.Length() != 1)
  {
    errID = RDNA_ERR_WRONG_NUMBER_OF_ARGUMENTS;
    goto RETURN;
  }

  strUserID = trim(std::string(*v8::String::Utf8Value(info[0])));
  if (strUserID.empty())
  {
    errID = RDNA_ERR_USERID_EMPTY;
  }
  else
  {
    errID = coreForgotPassword(obj->coreCtx_, (char*)strUserID.c_str(), strUserID.length());
  }

RETURN:
  v8::Local<v8::Object> result = v8::Object::New(isolate);
  result->Set(v8::String::NewFromUtf8(isolate, "errorCode"), v8::Number::New(isolate, errID));
  result->Set(v8::String::NewFromUtf8(isolate, "response"), Nan::New(strResponse).ToLocalChecked());
  info.GetReturnValue().Set(result);
}

void RDNA::getPostLoginChallenges(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
  RDNA* obj = Nan::ObjectWrap::Unwrap<RDNA>(info.Holder());
  Isolate* isolate = info.GetIsolate();
  int errID = RDNA_ERR_NONE;
  std::string strResponse = "", strUserID = "", strUseCaseKey = "";

  if (info.Length() != 2)
  {
    errID = RDNA_ERR_WRONG_NUMBER_OF_ARGUMENTS;
    goto RETURN;
  }

  strUserID = trim(std::string(*v8::String::Utf8Value(info[0])));
  strUseCaseKey = trim(std::string(*v8::String::Utf8Value(info[1])));

  if (strUserID.empty())
  {
    errID = RDNA_ERR_USERID_EMPTY;
  }
  else if (strUseCaseKey.empty())
  {
    errID = RDNA_ERR_USECASE_EMPTY;
  }
  else
  {
    errID = coreGetPostLoginChallenges(obj->coreCtx_, (char*)strUserID.c_str(), (char*)strUseCaseKey.c_str());
  }

RETURN:
  v8::Local<v8::Object> result = v8::Object::New(isolate);
  result->Set(v8::String::NewFromUtf8(isolate, "errorCode"), v8::Number::New(isolate, errID));
  result->Set(v8::String::NewFromUtf8(isolate, "response"), Nan::New(strResponse).ToLocalChecked());
  info.GetReturnValue().Set(result);
}

void RDNA::getRegistredDeviceDetails(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
  RDNA* obj = Nan::ObjectWrap::Unwrap<RDNA>(info.Holder());
  Isolate* isolate = info.GetIsolate();
  int errID = RDNA_ERR_NONE;
  std::string strResponse = "", strUserID = "";

  if (info.Length() != 1)
  {
    errID = RDNA_ERR_WRONG_NUMBER_OF_ARGUMENTS;
    goto RETURN;
  }

  strUserID = trim(std::string(*v8::String::Utf8Value(info[0])));

  if (strUserID.empty())
  {
    errID = RDNA_ERR_USERID_EMPTY;
  }
  else
  {
    errID = coreGetRegistredDeviceDetails(obj->coreCtx_, (char*)strUserID.c_str());
  }

RETURN:
  v8::Local<v8::Object> result = v8::Object::New(isolate);
  result->Set(v8::String::NewFromUtf8(isolate, "errorCode"), v8::Number::New(isolate, errID));
  result->Set(v8::String::NewFromUtf8(isolate, "response"), Nan::New(strResponse).ToLocalChecked());
  info.GetReturnValue().Set(result);
}

void RDNA::updateDeviceDetails(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
  RDNA* obj = Nan::ObjectWrap::Unwrap<RDNA>(info.Holder());
  Isolate* isolate = info.GetIsolate();
  int errID = RDNA_ERR_NONE;
  std::string strResponse = "", strUserID = "", strDevDetails = "";

  if (info.Length() != 2)
  {
    errID = RDNA_ERR_WRONG_NUMBER_OF_ARGUMENTS;
    goto RETURN;
  }

  strUserID = trim(std::string(*v8::String::Utf8Value(info[0])));
  strDevDetails = trim(std::string(*v8::String::Utf8Value(info[1])));

  if (strUserID.empty())
  {
    errID = RDNA_ERR_USERID_EMPTY;
  }
  else if (strDevDetails.empty())
  {
    errID = RDNA_ERR_DEVICE_DETAILS_EMPTY;
  }
  else
  {
    errID = coreUpdateDeviceDetails(obj->coreCtx_, (char*)strUserID.c_str(), (char*)strDevDetails.c_str());
  }

RETURN:
  v8::Local<v8::Object> result = v8::Object::New(isolate);
  result->Set(v8::String::NewFromUtf8(isolate, "errorCode"), v8::Number::New(isolate, errID));
  result->Set(v8::String::NewFromUtf8(isolate, "response"), Nan::New(strResponse).ToLocalChecked());
  info.GetReturnValue().Set(result);
}

void RDNA::setIWACredentials(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
  RDNA* obj = Nan::ObjectWrap::Unwrap<RDNA>(info.Holder());
  Isolate* isolate = info.GetIsolate();
  int errID = RDNA_ERR_NONE;
  std::string strResponse = "", strUserID = "", strUrl = "", strPswd = "";
  int authStatus = RDNA_IWA_AUTH_CANCELLED;

  if (info.Length() != 4)
  {
    errID = RDNA_ERR_WRONG_NUMBER_OF_ARGUMENTS;
    goto RETURN;
  }

  strUrl = trim(std::string(*v8::String::Utf8Value(info[0])));
  strUserID = trim(std::string(*v8::String::Utf8Value(info[1])));
  strPswd = trim(std::string(*v8::String::Utf8Value(info[2])));
  authStatus = info[3]->NumberValue();

  if (strUserID.empty())
  {
    errID = RDNA_ERR_USERID_EMPTY;
  }
  else if (strUrl.empty())
  {
    errID = RDNA_ERR_401_URL_EMPTY;
  }
  else if (strPswd.empty())
  {
    errID = RDNA_ERR_PASSWORD_EMPTY;
  }
  else
  {
    //errID = coreSetIWACredentials(obj->coreCtx_, (char*)strUrl.c_str(), (char*)strUserID.c_str(), (char*)strPswd.c_str());
  }

RETURN:
  v8::Local<v8::Object> result = v8::Object::New(isolate);
  result->Set(v8::String::NewFromUtf8(isolate, "errorCode"), v8::Number::New(isolate, errID));
  result->Set(v8::String::NewFromUtf8(isolate, "response"), Nan::New(strResponse).ToLocalChecked());
  info.GetReturnValue().Set(result);
}

//To be done.
void RDNA::createPrivacyStream(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
  RDNA* obj = Nan::ObjectWrap::Unwrap<RDNA>(info.Holder());
  Isolate* isolate = info.GetIsolate();
  int errID = RDNA_ERR_NONE;
  std::string strResponse = "";
  std::string strmActivity = "", strmScope = "", strmCipherSpec = "", strmCipherSalt = "", strmAppContext = "";
  int strmBlockReadySize = 0;
  char* appCtx = NULL;

  if (info.Length() != 7)
  {
    errID = RDNA_ERR_WRONG_NUMBER_OF_ARGUMENTS;
    goto RETURN;
  }

  strmActivity = trim(std::string(*v8::String::Utf8Value(info[0])));
  strmScope = trim(std::string(*v8::String::Utf8Value(info[1])));
  strmCipherSpec = trim(std::string(*v8::String::Utf8Value(info[2])));
  strmCipherSalt = trim(std::string(*v8::String::Utf8Value(info[3])));
  strmBlockReadySize = info[4]->NumberValue();
  v8::Local<v8::Function> onInit_cb = Local<Function>::Cast(info[5]);
  strmAppContext = trim(std::string(*v8::String::Utf8Value(info[6])));
  appCtx = m_strdup(strmAppContext.c_str());

  e_core_privacy_scope_t privScope = (e_core_privacy_scope_t)getCorePrivacyScope(strmScope);
  e_core_stream_type_t streamType;
  if (strmActivity == "RDNA_STREAM_TYPE_ENCRYPT")
  {
    streamType = CORE_STREAM_TYPE_ENCRYPT;
  }
  else
  {
    streamType = CORE_STREAM_TYPE_DECRYPT;
  }

  /*if ()
  {

  }*/

  RDNAPrivacyStream* objPrivStream = new RDNAPrivacyStream();
  //objPrivStream->Wrap(info.This());

  RDNAPrivacyStreamContext* privCtx = (RDNAPrivacyStreamContext*)malloc(sizeof(RDNAPrivacyStreamContext));
  privCtx->appCtx = appCtx;
  privCtx->privyStream = (objPrivStream);


  RETURN:
  v8::Local<v8::Object> result = v8::Object::New(isolate);
  result->Set(v8::String::NewFromUtf8(isolate, "errorCode"), v8::Number::New(isolate, errID));
  result->Set(v8::String::NewFromUtf8(isolate, "response"), Nan::New(strResponse).ToLocalChecked());
  info.GetReturnValue().Set(result);
}

void RDNAPrivacyStream::Init(v8::Local<v8::Object> exports) {

  //Nan::HandleScope scope;
  ////Constructor template
  //v8::Local<v8::FunctionTemplate> funcTemplate = Nan::New<v8::FunctionTemplate>(New);
  //funcTemplate->SetClassName(Nan::New("RDNAPrivacyStream").ToLocalChecked());
  //funcTemplate->InstanceTemplate()->SetInternalFieldCount(1);

  ////Set api prototypes
  //Nan::SetPrototypeMethod(funcTemplate, "getPrivacyScope", getPrivacyScope);
  //Nan::SetPrototypeMethod(funcTemplate, "getStreamType", getStreamType);
  //Nan::SetPrototypeMethod(funcTemplate, "writeDataIntoStream", writeDataIntoStream);
  //Nan::SetPrototypeMethod(funcTemplate, "endStream", endStream);
  //Nan::SetPrototypeMethod(funcTemplate, "destroy", destroy);
  //Nan::SetPrototypeMethod(funcTemplate, "endStream", endStream);


  //constructor.Reset(funcTemplate->GetFunction());
  //exports->Set(Nan::New("RDNA").ToLocalChecked(), funcTemplate->GetFunction());
}

void RDNAPrivacyStream::New(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  //if (info.IsConstructCall()) {
  //  // Invoked as constructor: `new RDNAPrivacyStream(...)`
  //  RDNAPrivacyStream* obj = new RDNAPrivacyStream();
  //  obj->Wrap(info.This());
  //  info.GetReturnValue().Set(info.This());
  //}
  //else {
  //  // Invoked as plain function `RDNAPrivacyStream(...)`, turn into construct call.
  //  const int argc = 1;
  //  v8::Local<v8::Value> argv[argc] = { info[0] };
  //  v8::Local<v8::Function> cons = Nan::New<v8::Function>(constructor);
  //  info.GetReturnValue().Set(cons->NewInstance(argc, argv));
  //}
}

void RDNAPrivacyStream::getPrivacyScope(const Nan::FunctionCallbackInfo<v8::Value>& info) {

}

void RDNAPrivacyStream::getStreamType(const Nan::FunctionCallbackInfo<v8::Value>& info) {

}

void RDNAPrivacyStream::writeDataIntoStream(const Nan::FunctionCallbackInfo<v8::Value>& info) {

}

void RDNAPrivacyStream::endStream(const Nan::FunctionCallbackInfo<v8::Value>& info) {

}

void RDNAPrivacyStream::destroy(const Nan::FunctionCallbackInfo<v8::Value>& info) {

}

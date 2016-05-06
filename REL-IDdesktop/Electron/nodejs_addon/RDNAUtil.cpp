#define WIN32_LEAN_AND_MEAN
#include <Windows.h>
#include "RDNAUtil.h"
#include "RDNAintern.h"
#include <Ras.h>
#include <RasError.h>
#include <tchar.h>
extern "C"
{
#include "json.h"
#include "core-struct.h"
#include "common.h"
}
#include <WinInet.h>
DWORD dwConnections;

std::string RDNAUtil::trim(std::string const& str)
{
  if (str.empty())
    return str;

  std::size_t first = str.find_first_not_of(' ');
  std::size_t last = str.find_last_not_of(' ');
  if ((last - first) <= 0)
  {
    return "";
  }
  else
  {
    return str.substr(first, last - first + 1);
  }
}

int RDNAUtil::getChallengeStatus(int status_code)
{
  int StatusCode = RDNA_CHLNG_STATUS_SUCCESS;
  switch (status_code)
  {
  case 0:
  case 100:
    StatusCode = RDNA_CHLNG_STATUS_SUCCESS;
    break;
  case 101:
    StatusCode = RDNA_CHLNG_STATUS_NO_SUCH_USER;
    break;
  case 102:
    StatusCode = RDNA_CHLNG_STATUS_INVALID_ACT_CODE;
    break;
  case 103:
  case 109:
    StatusCode = RDNA_CHLNG_STATUS_UPDATE_CHALLENGES_FAILED;
    break;
  case 104:
  case 105:
  case 106:
    StatusCode = RDNA_CHLNG_STATUS_CHALLENGE_RESPONSE_VALIDATION_FAILED;
    break;
  case 107:
    StatusCode = RDNA_CHLNG_STATUS_USER_SUSPENDED;
    break;
  case 108:
    StatusCode = RDNA_CHLNG_STATUS_USER_BLOCKED;
    break;
  case 110:
    StatusCode = RDNA_CHLNG_STATUS_DEVICE_VALIDATION_FAILED;
    break;
  case 111:
    StatusCode = RDNA_CHLNG_STATUS_INVALID_CHALLENGE_LIST;
    break;
  case 112:
    StatusCode = RDNA_CHLNG_STATUS_USER_ALREADY_ACTIVATED;
    break;
  case 113:
    StatusCode = RDNA_CHLNG_STATUS_INTERNAL_SERVER_ERROR;
    break;
  default:
    StatusCode = RDNA_CHLNG_STATUS_UNKNOWN_ERROR;
  }

  return StatusCode;
}

void RDNAUtil::serializeService(void* ptrCoreService, char** Services)
{
  core_service_t* coreService = (core_service_t*)ptrCoreService;
  if (coreService != NULL)
  {
    json_object * jobj = json_object_new_object();


    json_object *jstringServiceName = json_object_new_string(coreService->serviceName);
    json_object *jstringTargetHNIP = json_object_new_string(coreService->targetHNIP);
    json_object *jstringApp_uuid = json_object_new_string(coreService->app_uuid);
    json_object *jstringAccessServerName = json_object_new_string(coreService->accessServerName);
    json_object *jstringSpn = json_object_new_string(coreService->spn);
    json_object *jstringRealm = json_object_new_string(coreService->realm);
    json_object *jstringTicketFetcherURL = json_object_new_string(coreService->ticketFetcherURL);
    json_object *jintTargetPort = json_object_new_int(coreService->targetPort);

    /*Form the outer json object*/
    json_object_object_add(jobj, "serviceName", jstringServiceName);
    json_object_object_add(jobj, "targetHNIP", jstringTargetHNIP);
    json_object_object_add(jobj, "app_uuid", jstringApp_uuid);
    json_object_object_add(jobj, "accessServerName", jstringAccessServerName);
    json_object_object_add(jobj, "spn", jstringSpn);
    json_object_object_add(jobj, "realm", jstringRealm);
    json_object_object_add(jobj, "ticketFetcherURL", jstringTicketFetcherURL);
    json_object_object_add(jobj, "targetPort", jintTargetPort);


    /*Form the inner json object*/
    json_object * jPortInfoobj = json_object_new_object();

    json_object *jisAutoStartedPort = json_object_new_int(coreService->portInfo.isAutoStarted);
    json_object *jisLocalhostOnlyPort = json_object_new_int(coreService->portInfo.isLocalhostOnly);
    json_object *jisStarted = json_object_new_int(coreService->portInfo.isStarted);
    json_object *jisPrivacyEnabled = json_object_new_int(coreService->portInfo.isPrivacyEnabled);
    json_object *jPortType = json_object_new_int(coreService->portInfo.portType);
    json_object *jPort = json_object_new_int(coreService->portInfo.port);


    json_object_object_add(jPortInfoobj, "isAutoStartedPort", jisAutoStartedPort);
    json_object_object_add(jPortInfoobj, "isLocalhostOnly", jisLocalhostOnlyPort);
    json_object_object_add(jPortInfoobj, "isStarted", jisStarted);
    json_object_object_add(jPortInfoobj, "isPrivacyEnabled", jisPrivacyEnabled);
    json_object_object_add(jPortInfoobj, "portType", jPortType);
    json_object_object_add(jPortInfoobj, "port", jPort);

    json_object_object_add(jobj, "portInfo", jPortInfoobj);
    *Services = strdup(json_object_to_json_string(jobj));
  }
}

void RDNAUtil::serializeServices(void** pptrCoreServices, char** Services)
{
  core_service_t** coreServices = (core_service_t**)pptrCoreServices;
  int i = 0;

  if (coreServices != NULL)
  {
    json_object * jMasterObj = json_object_new_array();

    while (coreServices[i])
    {

      json_object * jobj = json_object_new_object();

      json_object *jstringServiceName = json_object_new_string(coreServices[i]->serviceName);
      json_object *jstringTargetHNIP = json_object_new_string(coreServices[i]->targetHNIP);
      json_object *jstringApp_uuid = json_object_new_string(coreServices[i]->app_uuid);
      json_object *jstringAccessServerName = json_object_new_string(coreServices[i]->accessServerName);
      json_object *jstringSpn = json_object_new_string(coreServices[i]->spn);
      json_object *jstringRealm = json_object_new_string(coreServices[i]->realm);
      json_object *jstringTicketFetcherURL = json_object_new_string(coreServices[i]->ticketFetcherURL);
      json_object *jintTargetPort = json_object_new_int(coreServices[i]->targetPort);

      /*Form the outer json object*/
      json_object_object_add(jobj, "serviceName", jstringServiceName);
      json_object_object_add(jobj, "targetHNIP", jstringTargetHNIP);
      json_object_object_add(jobj, "app_uuid", jstringApp_uuid);
      json_object_object_add(jobj, "accessServerName", jstringAccessServerName);
      json_object_object_add(jobj, "spn", jstringSpn);
      json_object_object_add(jobj, "realm", jstringRealm);
      json_object_object_add(jobj, "ticketFetcherURL", jstringTicketFetcherURL);
      json_object_object_add(jobj, "targetPort", jintTargetPort);


      /*Form the inner json object*/
      json_object * jPortInfoobj = json_object_new_object();

      json_object *jisAutoStartedPort = json_object_new_int(coreServices[i]->portInfo.isAutoStarted);
      json_object *jisLocalhostOnlyPort = json_object_new_int(coreServices[i]->portInfo.isLocalhostOnly);
      json_object *jisStarted = json_object_new_int(coreServices[i]->portInfo.isStarted);
      json_object *jisPrivacyEnabled = json_object_new_int(coreServices[i]->portInfo.isPrivacyEnabled);
      json_object *jPortType = json_object_new_int(coreServices[i]->portInfo.portType);
      json_object *jPort = json_object_new_int(coreServices[i]->portInfo.port);


      json_object_object_add(jPortInfoobj, "isAutoStartedPort", jisAutoStartedPort);
      json_object_object_add(jPortInfoobj, "isLocalhostOnly", jisLocalhostOnlyPort);
      json_object_object_add(jPortInfoobj, "isStarted", jisStarted);
      json_object_object_add(jPortInfoobj, "isPrivacyEnabled", jisPrivacyEnabled);
      json_object_object_add(jPortInfoobj, "portType", jPortType);
      json_object_object_add(jPortInfoobj, "port", jPort);

      json_object_object_add(jobj, "portInfo", jPortInfoobj);

      json_object_array_add(jMasterObj, jobj);

      i++;
    }

    *Services = strdup(json_object_to_json_string(jMasterObj));

    printf("The json object created: %s \n", *Services);

  }
}

void RDNAUtil::serializeServiceList(void** pptrCoreServices, char** Services)
{
  core_service_t** coreServices = (core_service_t**)pptrCoreServices;
  if (coreServices != NULL)
  {
    json_object * jobj = json_object_new_object();
    char *serviceJson = NULL;
    serializeServices((void**)coreServices, &serviceJson);
    json_object *jservicesJsonString = json_object_new_string(serviceJson);
    json_object_object_add(jobj, "Services", jservicesJsonString);
    *Services = strdup(json_object_to_json_string(jobj));
  }
}

void RDNAUtil::serializeCoreStatusStructure(void* ptrPstatus, char **coreStatusJson)
{
  core_status_t* pStatus = (core_status_t*)ptrPstatus;
  json_object * jobj = json_object_new_object();
  json_object * jpArgs = json_object_new_object();


  json_object *jerrCode = json_object_new_int(pStatus->errCode);
  json_object_object_add(jobj, "errCode", jerrCode);


  json_object *jeMethId = json_object_new_int(pStatus->eMethId);
  json_object_object_add(jobj, "eMethId", jeMethId);

  if (pStatus->pArgs)
  {
    json_object * jCoreServiceObj = json_object_new_object();

    core_service_t** coreService = pStatus->pArgs->core_service_details.pServices;
    char *serviceJson = NULL;
    serializeServices((void**)coreService, &serviceJson);
    char *serjson = m_strdup(serviceJson);

    if (serjson != NULL) {
      json_object *jservicesJsonString = json_object_new_string(serjson);
      json_object_object_add(jCoreServiceObj, "Services", jservicesJsonString);
    }
    if (pStatus->pArgs->core_service_details.nServices) {
      json_object *jnServices = json_object_new_int(pStatus->pArgs->core_service_details.nServices);
      json_object_object_add(jCoreServiceObj, "Services_Count", jnServices);
    }

    json_object * jResponseObj = json_object_new_object();

    if (pStatus->pArgs->response.pcResponseData) {
      json_object *jResponseData = json_object_new_string(pStatus->pArgs->response.pcResponseData);
      json_object_object_add(jResponseObj, "ResponseData", jResponseData);
    }
    if (pStatus->pArgs->response.nResponseDataLen) {
      json_object *jResponseDataLen = json_object_new_int(pStatus->pArgs->response.nResponseDataLen);
      json_object_object_add(jResponseObj, "ResponseDataLen", jResponseDataLen);
    }
    if (pStatus->pArgs->response.pcStatusMsg != NULL) {
      json_object *jStatusMsg = json_object_new_string(pStatus->pArgs->response.pcStatusMsg);
      json_object_object_add(jResponseObj, "StatusMsg", jStatusMsg);
    }

    json_object *jStatusCode = json_object_new_int(pStatus->pArgs->response.nStatusCode);
    json_object_object_add(jResponseObj, "StatusCode", jStatusCode);


    json_object *jCredOpMode = json_object_new_int(pStatus->pArgs->response.nCredOpMode);
    json_object_object_add(jResponseObj, "CredOpMode", jCredOpMode);


    json_object * jPxydetailsObj = json_object_new_object();


    json_object *jisStarted = json_object_new_int(pStatus->pArgs->pxyDetails.isStarted);
    json_object_object_add(jPxydetailsObj, "isStarted", jisStarted);


    json_object *jisLocalhostOnly = json_object_new_int(pStatus->pArgs->pxyDetails.isLocalhostOnly);
    json_object_object_add(jPxydetailsObj, "isLocalhostOnly", jisLocalhostOnly);


    json_object *jisAutoStarted = json_object_new_int(pStatus->pArgs->pxyDetails.isAutoStarted);
    json_object_object_add(jPxydetailsObj, "isAutoStarted", jisAutoStarted);


    json_object *jisPrivacyEnabled = json_object_new_int(pStatus->pArgs->pxyDetails.isPrivacyEnabled);
    json_object_object_add(jPxydetailsObj, "isPrivacyEnabled", jisPrivacyEnabled);


    json_object *jportType = json_object_new_int(pStatus->pArgs->pxyDetails.portType);
    json_object_object_add(jPxydetailsObj, "portType", jportType);


    json_object *jport = json_object_new_int(pStatus->pArgs->pxyDetails.port);
    json_object_object_add(jPxydetailsObj, "port", jport);


    json_object_object_add(jpArgs, "service_details", jCoreServiceObj);
    json_object_object_add(jpArgs, "response", jResponseObj);
    json_object_object_add(jpArgs, "pxyDetails", jPxydetailsObj);

    printf("The json object created: %s \n", json_object_to_json_string(jCoreServiceObj));
    printf("The json object created: %s \n", json_object_to_json_string(jResponseObj));
    printf("The json object created: %s \n", json_object_to_json_string(jPxydetailsObj));

    json_object_object_add(jobj, "pArgs", jpArgs);

  }

  printf("The json object created: %s \n", json_object_to_json_string(jobj));

  *coreStatusJson = m_strdup(json_object_to_json_string(jobj));

}

void RDNAUtil::serializePauseTerminateStatusStructure(void* ptrPstatus, char **coreStatusJson)
{
  core_status_t* pStatus = (core_status_t*)ptrPstatus;
  json_object * jobj = json_object_new_object();

  json_object *jerrCode = json_object_new_int(pStatus->errCode);
  json_object_object_add(jobj, "errCode", jerrCode);


  json_object *jeMethId = json_object_new_int(pStatus->eMethId);
  json_object_object_add(jobj, "eMethId", jeMethId);

  *coreStatusJson = m_strdup(json_object_to_json_string(jobj));
}

void RDNAUtil::serializeConfigStatusStructure(void* ptrPstatus, char **coreStatusJson)
{
  core_status_t* pStatus = (core_status_t*)ptrPstatus;
  json_object * jobj = json_object_new_object();

  json_object *jerrCode = json_object_new_int(pStatus->errCode);
  json_object_object_add(jobj, "errCode", jerrCode);


  json_object *jeMethId = json_object_new_int(pStatus->eMethId);
  json_object_object_add(jobj, "eMethId", jeMethId);

  if (pStatus->pArgs && pStatus->pArgs->response.pcResponseData)
  {
    json_object *jservicesJsonString = json_object_new_string(pStatus->pArgs->response.pcResponseData);
    json_object_object_add(jobj, "Config", jservicesJsonString);
  }

  *coreStatusJson = m_strdup(json_object_to_json_string(jobj));
}

void RDNAUtil::serializeGetAllChlngsStatusStructure(void* ptrPstatus, char **coreStatusJson)
{
  core_status_t* pStatus = (core_status_t*)ptrPstatus;
  json_object * jobj = json_object_new_object();

  json_object *jerrCode = json_object_new_int(pStatus->errCode);
  json_object_object_add(jobj, "errCode", jerrCode);


  json_object *jeMethId = json_object_new_int(pStatus->eMethId);
  json_object_object_add(jobj, "eMethId", jeMethId);

  if (pStatus->pArgs)
  {
    json_object *jChlngsJsonString = json_object_new_string(pStatus->pArgs->response.pcResponseData);
    json_object_object_add(jobj, "Chlngs", jChlngsJsonString);

    json_object *jCredOpMode = json_object_new_int(pStatus->pArgs->response.nCredOpMode);
    json_object_object_add(jobj, "challengeOperation", jCredOpMode);

    if (pStatus->pArgs->response.pcStatusMsg)
    {
      json_object *jStatusMsgJsonString = json_object_new_string(pStatus->pArgs->response.pcStatusMsg);
      json_object_object_add(jobj, "StatusMsg", jStatusMsgJsonString);
    }

    json_object *jStatusCode = json_object_new_int(getChallengeStatus(pStatus->pArgs->response.nStatusCode));
    json_object_object_add(jobj, "StatusCode", jStatusCode);
  }

  *coreStatusJson = m_strdup(json_object_to_json_string(jobj));
}

void RDNAUtil::serializeCheckChlngsStatusStructure(void* ptrPstatus, char **coreStatusJson)
{
  core_status_t* pStatus = (core_status_t*)ptrPstatus;
  json_object * jobj = json_object_new_object();

  json_object *jerrCode = json_object_new_int(pStatus->errCode);
  json_object_object_add(jobj, "errCode", jerrCode);


  json_object *jeMethId = json_object_new_int(pStatus->eMethId);
  json_object_object_add(jobj, "eMethId", jeMethId);

  if (CORE_ERR_NONE == pStatus->errCode && pStatus->pArgs)
  {
    if (pStatus->pArgs->core_service_details.nServices > 0)
    {
      char *serviceJson = NULL;
      serializeServices((void**)pStatus->pArgs->core_service_details.pServices, &serviceJson);
      if (serviceJson != NULL)
      {
        json_object *jservicesJsonString = json_object_new_string(serviceJson);
        json_object_object_add(jobj, "Services", jservicesJsonString);
      }

      json_object *jCredOpMode = json_object_new_int(pStatus->pArgs->response.nCredOpMode);
      json_object_object_add(jobj, "challengeOperation", jCredOpMode);

      json_object *jChlngsJsonString = json_object_new_string(pStatus->pArgs->response.pcResponseData);
      json_object_object_add(jobj, "Chlngs", jChlngsJsonString);

      if (pStatus->pArgs->response.pcStatusMsg)
      {
        json_object *jStatusMsgJsonString = json_object_new_string(pStatus->pArgs->response.pcStatusMsg);
        json_object_object_add(jobj, "StatusMsg", jStatusMsgJsonString);
      }

      json_object *jStatusCode = json_object_new_int(getChallengeStatus(pStatus->pArgs->response.nStatusCode));
      json_object_object_add(jobj, "StatusCode", jStatusCode);

      json_object * jPxydetailsObj = json_object_new_object();

      json_object *jisStarted = json_object_new_int(pStatus->pArgs->pxyDetails.isStarted);
      json_object_object_add(jPxydetailsObj, "isStarted", jisStarted);

      json_object *jisLocalhostOnly = json_object_new_int(pStatus->pArgs->pxyDetails.isLocalhostOnly);
      json_object_object_add(jPxydetailsObj, "isLocalhostOnly", jisLocalhostOnly);

      json_object *jisAutoStarted = json_object_new_int(pStatus->pArgs->pxyDetails.isAutoStarted);
      json_object_object_add(jPxydetailsObj, "isAutoStarted", jisAutoStarted);

      json_object *jisPrivacyEnabled = json_object_new_int(pStatus->pArgs->pxyDetails.isPrivacyEnabled);
      json_object_object_add(jPxydetailsObj, "isPrivacyEnabled", jisPrivacyEnabled);

      json_object *jportType = json_object_new_int(pStatus->pArgs->pxyDetails.portType);
      json_object_object_add(jPxydetailsObj, "portType", jportType);

      json_object *jport = json_object_new_int(pStatus->pArgs->pxyDetails.port);
      json_object_object_add(jPxydetailsObj, "port", jport);

      json_object_object_add(jobj, "pxyDetails", jPxydetailsObj);
    }
  }

  *coreStatusJson = m_strdup(json_object_to_json_string(jobj));
}

void RDNAUtil::serializeUpdateChlngsStatusStructure(void* ptrPstatus, char **coreStatusJson)
{
  core_status_t* pStatus = (core_status_t*)ptrPstatus;
  json_object * jobj = json_object_new_object();

  json_object *jerrCode = json_object_new_int(pStatus->errCode);
  json_object_object_add(jobj, "errCode", jerrCode);


  json_object *jeMethId = json_object_new_int(pStatus->eMethId);
  json_object_object_add(jobj, "eMethId", jeMethId);

  if (CORE_ERR_NONE == pStatus->errCode && pStatus->pArgs)
  {
    json_object *jCredOpMode = json_object_new_int(pStatus->pArgs->response.nCredOpMode);
    json_object_object_add(jobj, "challengeOperation", jCredOpMode);

    if (pStatus->pArgs->response.pcStatusMsg)
    {
      json_object *jStatusMsgJsonString = json_object_new_string(pStatus->pArgs->response.pcStatusMsg);
      json_object_object_add(jobj, "StatusMsg", jStatusMsgJsonString);
    }

    json_object *jStatusCode = json_object_new_int(getChallengeStatus(pStatus->pArgs->response.nStatusCode));
    json_object_object_add(jobj, "StatusCode", jStatusCode);

    json_object *jChlngsJsonString = json_object_new_string(pStatus->pArgs->response.pcResponseData);
    json_object_object_add(jobj, "Chlngs", jChlngsJsonString);
  }

  *coreStatusJson = m_strdup(json_object_to_json_string(jobj));
}

void RDNAUtil::serializeForgotPswdStatusStructure(void* ptrPstatus, char **coreStatusJson)
{
  core_status_t* pStatus = (core_status_t*)ptrPstatus;
  json_object * jobj = json_object_new_object();

  json_object *jerrCode = json_object_new_int(pStatus->errCode);
  json_object_object_add(jobj, "errCode", jerrCode);


  json_object *jeMethId = json_object_new_int(pStatus->eMethId);
  json_object_object_add(jobj, "eMethId", jeMethId);

  if (CORE_ERR_NONE == pStatus->errCode && pStatus->pArgs)
  {
    json_object *jCredOpMode = json_object_new_int(pStatus->pArgs->response.nCredOpMode);
    json_object_object_add(jobj, "challengeOperation", jCredOpMode);

    if (pStatus->pArgs->response.pcStatusMsg)
    {
      json_object *jStatusMsgJsonString = json_object_new_string(pStatus->pArgs->response.pcStatusMsg);
      json_object_object_add(jobj, "StatusMsg", jStatusMsgJsonString);
    }

    json_object *jStatusCode = json_object_new_int(getChallengeStatus(pStatus->pArgs->response.nStatusCode));
    json_object_object_add(jobj, "StatusCode", jStatusCode);

    json_object *jChlngsJsonString = json_object_new_string(pStatus->pArgs->response.pcResponseData);
    json_object_object_add(jobj, "Chlngs", jChlngsJsonString);
  }

  *coreStatusJson = m_strdup(json_object_to_json_string(jobj));
}

void RDNAUtil::serializeIWARequest(char* url, char **coreStatusJson)
{
  json_object * jobj = json_object_new_object();
  
  json_object *jeMethId = json_object_new_int(RDNAMethodID::RDNA_METH_GET_CREDS_CB);
  json_object_object_add(jobj, "eMethId", jeMethId);

  if (NULL != url)
  {
    json_object *jChlngsJsonString = json_object_new_string(url);
    json_object_object_add(jobj, "url", jChlngsJsonString);
  }

  *coreStatusJson = m_strdup(json_object_to_json_string(jobj));
}

int RDNAUtil::getCorePrivacyScope(std::string privacyScope)
{
  e_core_privacy_scope_t corePrivScope = CORE_PRIVACY_SCOPE_SESSION;

  if (0 == privacyScope.compare("RDNA_PRIVACY_SCOPE_SESSION"))
  {
    corePrivScope = CORE_PRIVACY_SCOPE_SESSION;
  }
  else if (0 == privacyScope.compare("RDNA_PRIVACY_SCOPE_DEVICE"))
  {
    corePrivScope = CORE_PRIVACY_SCOPE_DEVICE;
  }
  else if (0 == privacyScope.compare("RDNA_PRIVACY_SCOPE_USER"))
  {
    corePrivScope = CORE_PRIVACY_SCOPE_USER;
  }
  else if (0 == privacyScope.compare("RDNA_PRIVACY_SCOPE_AGENT"))
  {
    corePrivScope = CORE_PRIVACY_SCOPE_AGENT;
  }

  return corePrivScope;
}

DWORD getConnectionName(LPRASCONN* lpRasConn)
{
  DWORD dwCb = 0;
  DWORD dwRet = ERROR_SUCCESS;

  // Call RasEnumConnections with lpRasConn = NULL. dwCb is returned with the
  // required buffer size and
  // a return code of ERROR_BUFFER_TOO_SMALL
  dwRet = RasEnumConnections(*lpRasConn, &dwCb, &dwConnections);

  if (dwRet == ERROR_BUFFER_TOO_SMALL)
  {
    // Allocate the memory needed for the array of RAS structure(s).
    *lpRasConn = (LPRASCONN)HeapAlloc(GetProcessHeap(), HEAP_ZERO_MEMORY, dwCb);
    if (*lpRasConn == NULL)
    {
      DBG("getConnectionName():HeapAlloc failed!\n");
      return 0;
    }
    // The first RASCONN structure in the array must contain the
    // RASCONN structure size
    lpRasConn[0]->dwSize = sizeof(RASCONN);

    // Call RasEnumConnections to enumerate active connections
    dwRet = RasEnumConnections(*lpRasConn, &dwCb, &dwConnections);
  }
  return dwRet;
}

bool setProxySettings(CHAR* aConnName, std::string aProxyAddress, std::string aProxyByPass)
{
  bool bRet = false;
#ifdef _WIN32
  const int iSize = (aProxyByPass.size() * sizeof(TCHAR)) + 1;
  TCHAR     _szProxyAddress[400];
  TCHAR*    _szProxyAddressByPass = new TCHAR[iSize];
  std::wstring wPxyAddress = std::wstring(aProxyAddress.begin(), aProxyAddress.end());
  std::wstring wPxyBypass = std::wstring(aProxyByPass.begin(), aProxyByPass.end());
  _stprintf_s(_szProxyAddress, _T("%ls"), wPxyAddress.c_str());
  _stprintf_s(_szProxyAddressByPass, iSize, _T("%ls"), wPxyBypass.c_str());
  DBG("Pravin : %s\n", aProxyAddress.c_str());
  INTERNET_PER_CONN_OPTION      _sOptions[3];

  INTERNET_PER_CONN_OPTION_LIST _sList = {
    sizeof(INTERNET_PER_CONN_OPTION_LIST),
    aConnName, sizeof(_sOptions) / sizeof(INTERNET_PER_CONN_OPTION), 0, _sOptions
  };

  // Set proxy name.
  _sOptions[0].dwOption = INTERNET_PER_CONN_PROXY_SERVER;
  _sOptions[0].Value.pszValue = _szProxyAddress;

  // Set flags.
  _sOptions[1].dwOption = INTERNET_PER_CONN_FLAGS;
  _sOptions[1].Value.dwValue = PROXY_TYPE_DIRECT | PROXY_TYPE_PROXY;

  // Set proxy override.
  _sOptions[2].dwOption = INTERNET_PER_CONN_PROXY_BYPASS;
  _sOptions[2].Value.pszValue = _szProxyAddressByPass;

  if (InternetSetOption(NULL, INTERNET_OPTION_PER_CONNECTION_OPTION, &_sList, sizeof(_sList)))
  {
    DBG("Proxy settings updated in Internet Options.");
    bRet = true;
  }
  else
  {
    DBG("Failed to set proxy details in Internet Options: %d", GetLastError());
    bRet = false;
  }

  InternetSetOption(NULL, INTERNET_OPTION_SETTINGS_CHANGED, NULL, 0);
  delete[] _szProxyAddressByPass;
  _szProxyAddressByPass = NULL;
#endif
  return bRet;
}

void RDNAUtil::setGlobalProxy(std::string host, int port)
{
  //getCurrentConnectionName
  DBG("pxyhost : %s pxyPort : %d\n", host.c_str(), port);
  LPRASCONN lpRasConnName = NULL;
  DWORD dwRet = getConnectionName(&lpRasConnName);
  std::string proxyAddress = "", proxyBypass = "", iPort = "0";
  iPort = std::to_string(port);
  proxyAddress.assign(host).append(":").append(iPort);
  DBG("pxy : %s\n", proxyAddress.c_str());
  if (ERROR_SUCCESS == dwRet)
  {
    for (DWORD i = 0; i < dwConnections; i++)
    {
      DBG("RAS Connection Name:%s", lpRasConnName[i].szEntryName);

      //Store it in Reg
      setProxySettings(lpRasConnName[i].szEntryName, proxyAddress, proxyBypass);
    }
  }

  // There was either a problem with RAS or there are no connections to enumerate
  if (dwConnections < 1)
  {
    DBG("There are no active RAS connections.");

    //Store it in Reg
    setProxySettings(NULL, proxyAddress, proxyBypass);
  }

  //Deallocate memory for the connection buffer
  HeapFree(GetProcessHeap(), 0, lpRasConnName);
  lpRasConnName = NULL;
}
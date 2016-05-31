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
  case 115:
    StatusCode = RDNA_CHLNG_STATUS_FAILED_UPDATE_DEVICE_DETAILS;
    break;
  case 117:
    StatusCode = RDNA_CHLNG_STATUS_NO_SUCH_USE_CASE_EXISTS;
    break;
  default:
    StatusCode = RDNA_CHLNG_STATUS_UNKNOWN_ERROR;
  }

  return StatusCode;
}

int parseSingleChallenge(struct json_object* objChallengeJson, RDNAChallengeOpMode operationMode, struct json_object** outChlngArray, int& chlngCount)
{
  int subChallengeCount = 0;
  int chlngsPerBatch    = 0;
  int BatchCounter      = 0;
  int promptBatchIndex  = 0;
  int respArrayLen      = 0;
  int promptLen         = 0;
  int nRet              = RDNA_ERR_NONE;

  struct json_object *jsonString = NULL, *jsonInt = NULL;
  struct json_object *jsonChlngResp = NULL;
  struct json_object *jsonChlngPrmpt = NULL, *jsonChlngRespArry = NULL, *jChlngPromptArray = NULL;
  struct json_object *jsonChlngInfo = NULL, *jsonChlngInfoArry = NULL, *jsonRespPoliciesArry = NULL;
  struct json_object *jsonChlngRespPolicy = NULL, *jsonChlngRespValidation = NULL, *jChlngInfo = NULL;
  struct json_object *jIdx = NULL, *jSubIdx = NULL, *jChlngName = NULL, *jChlngOpMode = NULL;
  struct json_object *jChlngType = NULL, *jAttemptsLeft = NULL;
  struct json_object *jSubChlngCount = NULL;

  chlngCount = 0;
  do
  {
    if (objChallengeJson)
    {
      if (json_object_object_get_ex(objChallengeJson, STR_SUB_CHLNG_COUNT, &jsonInt))
        subChallengeCount = json_object_get_int(jsonInt);
      if (json_object_object_get_ex(objChallengeJson, STR_CHLNGS_PER_BATCH, &jsonInt))
        chlngsPerBatch = json_object_get_int(jsonInt);
      if (json_object_object_get_ex(objChallengeJson, STR_CHLNG_RESP, &jsonChlngResp))
      {
        respArrayLen = json_object_array_length(jsonChlngResp);
      }
      if (json_object_object_get_ex(objChallengeJson, STR_CHLNG_PROMPT, &jsonChlngPrmpt))
      {
        promptLen = json_object_array_length(jsonChlngPrmpt);
      }
      if (subChallengeCount != (chlngsPerBatch * promptLen) || subChallengeCount != respArrayLen)
      {
        printf("\ninvalid chlng count\n");
        nRet = RDNA_ERR_INVALID_CHALLENGE_CONFIG;
        break;
      }

      chlngCount = subChallengeCount;
      json_object_object_get_ex(objChallengeJson, STR_CHLNG_IDX, &jIdx);
      json_object_object_get_ex(objChallengeJson, STR_CHLNG_NAME, &jChlngName);
      json_object_object_get_ex(objChallengeJson, STR_CHLNG_TYPE, &jChlngType);
      json_object_object_get_ex(objChallengeJson, STR_ATTEMPTS_LEFT, &jAttemptsLeft);

      jSubChlngCount = json_object_new_int(subChallengeCount);
      jChlngOpMode = json_object_new_int(operationMode);

      for (int iter = 0; iter < subChallengeCount; iter++)
      {
        struct json_object *subChlngDataObj = json_object_new_object();

        //Chlng index
        json_object_object_add(subChlngDataObj, STR_CHLNG_IDX, jIdx);

        //sub chlng index
        jSubIdx = json_object_new_int(iter);
        json_object_object_add(subChlngDataObj, STR_SUB_CHLNG_IDX, jSubIdx);

        //Chlng name
        json_object_object_add(subChlngDataObj, STR_CHLNG_NAME, jChlngName);

        //Chlng Type
        json_object_object_add(subChlngDataObj, STR_CHLNG_TYPE, jChlngType);

        //chlng op mode
        json_object_object_add(subChlngDataObj, STR_CHLNG_OP_MODE, jChlngOpMode);

        //chlng prompt
        if (jsonChlngPrmpt)
        {
          jChlngPromptArray = json_object_new_array();
          json_object_array_add(jChlngPromptArray, json_object_array_get_idx(jsonChlngPrmpt, iter));
          json_object_object_add(subChlngDataObj, STR_CHLNG_PROMPT, jChlngPromptArray);
        }

        //chlng info
        if (json_object_object_get_ex(objChallengeJson, STR_CHLNG_INFO, &jChlngInfo))
        {
          json_object_object_add(subChlngDataObj, STR_CHLNG_INFO, jChlngInfo);
        }

        //chlng resp
        if (jsonChlngResp)
        {
          jsonChlngRespArry = json_object_new_array();
          json_object_array_add(jsonChlngRespArry, json_object_array_get_idx(jsonChlngResp, iter));
          json_object_object_add(subChlngDataObj, STR_CHLNG_RESP, jsonChlngRespArry);
        }


        //chlng resp policies
        if (json_object_object_get_ex(objChallengeJson, STR_CHLNG_RESP_POLICY, &jsonChlngRespPolicy))
        {
          json_object_object_add(subChlngDataObj, STR_CHLNG_RESP_POLICY, jsonChlngRespPolicy);
        }

        //chlng resp validation
        if (json_object_object_get_ex(objChallengeJson, STR_CHLNG_RESP_VALIDATION, &jsonChlngRespValidation))
        {
          json_object_object_add(subChlngDataObj, STR_CHLNG_RESP_VALIDATION, jsonChlngRespValidation);
        }

        //attempts left
        json_object_object_add(subChlngDataObj, STR_ATTEMPTS_LEFT, jAttemptsLeft);

        //Add the json object back to output array
        json_object_array_add(*outChlngArray, subChlngDataObj);
      }
    }
  } while (0);

  return nRet;
}

int unmarshalChallenges(char* pcJsonData, RDNAChallengeOpMode operationMode, char** finalChlngJson, int& chlngCount)
{
  struct json_object *jsonDataObj = NULL, *jUser = NULL, *jOutChlngArr = NULL;
  struct json_object *jChlngArr = NULL, *jvalue = NULL;
  int nRet = RDNA_ERR_NONE;
  std::string strFinalJsonObj = "";
  int final_count = 0;
  chlngCount = 0;
  m_free(*finalChlngJson);
  
  if (NULL != pcJsonData)
  {
    jsonDataObj = json_tokener_parse(pcJsonData);
    if (jsonDataObj)
    {
      if (json_object_object_get_ex(jsonDataObj, STR_CHLNG, &jChlngArr))
      {
        jOutChlngArr = json_object_new_array();
        int arrlen = json_object_array_length(jChlngArr);
        for (int index = 0; index < arrlen; index++)
        {
          std::string subChlngJson = "";
          int cnt = 0;
          jvalue = json_object_array_get_idx(jChlngArr, index);
          nRet = parseSingleChallenge(jvalue, operationMode, &jOutChlngArr, cnt);
          if (nRet != RDNA_ERR_NONE)
          {
            break;
          }
          final_count += cnt;
        }
        strFinalJsonObj.assign(std::string(json_object_to_json_string(jOutChlngArr)));    //This holds the final challenge json string.
      }
    }
  }

  if (nRet == RDNA_ERR_NONE)
  {
    *finalChlngJson = m_strdup(strFinalJsonObj.c_str());
    chlngCount = final_count;
  }

  return nRet;
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
    json_object_object_add(jobj, STR_SERVICE_NAME, jstringServiceName);
    json_object_object_add(jobj, STR_TARGET_HNIP, jstringTargetHNIP);
    json_object_object_add(jobj, STR_APP_UUID, jstringApp_uuid);
    json_object_object_add(jobj, STR_ACCESS_SERVER_NAME, jstringAccessServerName);
    json_object_object_add(jobj, STR_SPN, jstringSpn);
    json_object_object_add(jobj, STR_REALM, jstringRealm);
    json_object_object_add(jobj, STR_TCKT_FETCHER_URL, jstringTicketFetcherURL);
    json_object_object_add(jobj, STR_TARGET_PORT, jintTargetPort);


    /*Form the inner json object*/
    json_object * jPortInfoobj = json_object_new_object();

    json_object *jisAutoStartedPort = json_object_new_int(coreService->portInfo.isAutoStarted);
    json_object *jisLocalhostOnlyPort = json_object_new_int(coreService->portInfo.isLocalhostOnly);
    json_object *jisStarted = json_object_new_int(coreService->portInfo.isStarted);
    json_object *jisPrivacyEnabled = json_object_new_int(coreService->portInfo.isPrivacyEnabled);
    json_object *jPortType = json_object_new_int(coreService->portInfo.portType);
    json_object *jPort = json_object_new_int(coreService->portInfo.port);


    json_object_object_add(jPortInfoobj, STR_IS_AUTO_STARTED, jisAutoStartedPort);
    json_object_object_add(jPortInfoobj, STR_IS_LOCAL_HOST_ONLY, jisLocalhostOnlyPort);
    json_object_object_add(jPortInfoobj, STR_IS_STARTED, jisStarted);
    json_object_object_add(jPortInfoobj, STR_IS_PRIVACY_ENABLED, jisPrivacyEnabled);
    json_object_object_add(jPortInfoobj, STR_PORT_TYPE, jPortType);
    json_object_object_add(jPortInfoobj, STR_PORT, jPort);

    json_object_object_add(jobj, STR_PORT_INFO, jPortInfoobj);
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
      json_object_object_add(jobj, STR_SERVICE_NAME, jstringServiceName);
      json_object_object_add(jobj, STR_TARGET_HNIP, jstringTargetHNIP);
      json_object_object_add(jobj, STR_TARGET_PORT, jintTargetPort);
      json_object_object_add(jobj, STR_APP_UUID, jstringApp_uuid);
      json_object_object_add(jobj, STR_ACCESS_SERVER_NAME, jstringAccessServerName);
      json_object_object_add(jobj, STR_SPN, jstringSpn);
      json_object_object_add(jobj, STR_REALM, jstringRealm);
      json_object_object_add(jobj, STR_TCKT_FETCHER_URL, jstringTicketFetcherURL);

      /*Form the inner json object*/
      json_object * jPortInfoobj = json_object_new_object();

      json_object *jisAutoStartedPort = json_object_new_int(coreServices[i]->portInfo.isAutoStarted);
      json_object *jisLocalhostOnlyPort = json_object_new_int(coreServices[i]->portInfo.isLocalhostOnly);
      json_object *jisStarted = json_object_new_int(coreServices[i]->portInfo.isStarted);
      json_object *jisPrivacyEnabled = json_object_new_int(coreServices[i]->portInfo.isPrivacyEnabled);
      json_object *jPortType = json_object_new_int(coreServices[i]->portInfo.portType);
      json_object *jPort = json_object_new_int(coreServices[i]->portInfo.port);


      json_object_object_add(jPortInfoobj, STR_IS_AUTO_STARTED, jisAutoStartedPort);
      json_object_object_add(jPortInfoobj, STR_IS_LOCAL_HOST_ONLY, jisLocalhostOnlyPort);
      json_object_object_add(jPortInfoobj, STR_IS_STARTED, jisStarted);
      json_object_object_add(jPortInfoobj, STR_IS_PRIVACY_ENABLED, jisPrivacyEnabled);
      json_object_object_add(jPortInfoobj, STR_PORT_TYPE, jPortType);
      json_object_object_add(jPortInfoobj, STR_PORT, jPort);

      json_object_object_add(jobj, STR_PORT_INFO, jPortInfoobj);

      json_object_array_add(jMasterObj, jobj);

      i++;
    }

    *Services = strdup(json_object_to_json_string(jMasterObj));
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
    json_object_object_add(jobj, STR_SERVICES, jservicesJsonString);
    *Services = strdup(json_object_to_json_string(jobj));
  }
}

void RDNAUtil::serializeCoreStatusStructure(void* ptrPstatus, char **coreStatusJson)
{
  core_status_t* pStatus = (core_status_t*)ptrPstatus;
  json_object * jobj = json_object_new_object();
  json_object * jpArgs = json_object_new_object();


  json_object *jerrCode = json_object_new_int(pStatus->errCode);
  json_object_object_add(jobj, STR_ERR_CODE, jerrCode);


  json_object *jeMethId = json_object_new_int(pStatus->eMethId);
  json_object_object_add(jobj, STR_METHOD_ID, jeMethId);

  if (pStatus->pArgs)
  {
    json_object * jCoreServiceObj = json_object_new_object();

    core_service_t** coreService = pStatus->pArgs->core_service_details.pServices;
    char *serviceJson = NULL;
    serializeServices((void**)coreService, &serviceJson);
    char *serjson = m_strdup(serviceJson);

    if (serjson != NULL) {
      json_object *jservicesJsonString = json_object_new_string(serjson);
      json_object_object_add(jCoreServiceObj, STR_SERVICES, jservicesJsonString);
    }
    if (pStatus->pArgs->core_service_details.nServices) {
      json_object *jnServices = json_object_new_int(pStatus->pArgs->core_service_details.nServices);
      json_object_object_add(jCoreServiceObj, STR_SERVICES_COUNT, jnServices);
    }

    json_object * jResponseObj = json_object_new_object();

    if (pStatus->pArgs->response.pcResponseData) {
      json_object *jResponseData = json_object_new_string(pStatus->pArgs->response.pcResponseData);
      json_object_object_add(jResponseObj, STR_RESPONSE_DATA, jResponseData);
    }
    if (pStatus->pArgs->response.nResponseDataLen) {
      json_object *jResponseDataLen = json_object_new_int(pStatus->pArgs->response.nResponseDataLen);
      json_object_object_add(jResponseObj, STR_RESPONSE_DATA_LEN, jResponseDataLen);
    }
    if (pStatus->pArgs->response.pcStatusMsg != NULL) {
      json_object *jStatusMsg = json_object_new_string(pStatus->pArgs->response.pcStatusMsg);
      json_object_object_add(jResponseObj, STR_STATUS_MSG, jStatusMsg);
    }

    json_object *jStatusCode = json_object_new_int(pStatus->pArgs->response.nStatusCode);
    json_object_object_add(jResponseObj, STR_STATUS_CODE, jStatusCode);


    json_object *jCredOpMode = json_object_new_int(pStatus->pArgs->response.nCredOpMode);
    json_object_object_add(jResponseObj, STR_CHLNG_OP_MODE, jCredOpMode);


    json_object * jPxydetailsObj = json_object_new_object();


    json_object *jisStarted = json_object_new_int(pStatus->pArgs->pxyDetails.isStarted);
    json_object_object_add(jPxydetailsObj, STR_IS_STARTED, jisStarted);


    json_object *jisLocalhostOnly = json_object_new_int(pStatus->pArgs->pxyDetails.isLocalhostOnly);
    json_object_object_add(jPxydetailsObj, STR_IS_LOCAL_HOST_ONLY, jisLocalhostOnly);


    json_object *jisAutoStarted = json_object_new_int(pStatus->pArgs->pxyDetails.isAutoStarted);
    json_object_object_add(jPxydetailsObj, STR_IS_AUTO_STARTED, jisAutoStarted);


    json_object *jisPrivacyEnabled = json_object_new_int(pStatus->pArgs->pxyDetails.isPrivacyEnabled);
    json_object_object_add(jPxydetailsObj, STR_IS_PRIVACY_ENABLED, jisPrivacyEnabled);


    json_object *jportType = json_object_new_int(pStatus->pArgs->pxyDetails.portType);
    json_object_object_add(jPxydetailsObj, STR_PORT_TYPE, jportType);


    json_object *jport = json_object_new_int(pStatus->pArgs->pxyDetails.port);
    json_object_object_add(jPxydetailsObj, STR_PORT, jport);


    json_object_object_add(jpArgs, STR_SERVICE_DETAILS, jCoreServiceObj);
    json_object_object_add(jpArgs, STR_CHLNG_RESPONSE, jResponseObj);
    json_object_object_add(jpArgs, STR_PROXY_DETAILS, jPxydetailsObj);

    json_object_object_add(jobj, STR_P_ARGS, jpArgs);
  }
  *coreStatusJson = m_strdup(json_object_to_json_string(jobj));
}

void RDNAUtil::serializePauseTerminateStatusStructure(void* ptrPstatus, char **coreStatusJson)
{
  core_status_t* pStatus = (core_status_t*)ptrPstatus;
  json_object * jobj = json_object_new_object();

  json_object *jerrCode = json_object_new_int(pStatus->errCode);
  json_object_object_add(jobj, STR_ERR_CODE, jerrCode);


  json_object *jeMethId = json_object_new_int(pStatus->eMethId);
  json_object_object_add(jobj, STR_METHOD_ID, jeMethId);

  *coreStatusJson = m_strdup(json_object_to_json_string(jobj));
}

void RDNAUtil::serializeConfigStatusStructure(void* ptrPstatus, char **coreStatusJson)
{
  core_status_t* pStatus = (core_status_t*)ptrPstatus;
  json_object * jobj = json_object_new_object();

  json_object *jerrCode = json_object_new_int(pStatus->errCode);
  json_object_object_add(jobj, STR_ERR_CODE, jerrCode);


  json_object *jeMethId = json_object_new_int(pStatus->eMethId);
  json_object_object_add(jobj, STR_METHOD_ID, jeMethId);

  if (pStatus->pArgs && pStatus->pArgs->response.pcResponseData)
  {
    json_object *jservicesJsonString = json_object_new_string(pStatus->pArgs->response.pcResponseData);
    json_object_object_add(jobj, STR_CONFIG, jservicesJsonString);
  }

  *coreStatusJson = m_strdup(json_object_to_json_string(jobj));
}

void RDNAUtil::serializeGetAllChlngsStatusStructure(void* ptrPstatus, char **coreStatusJson)
{
  char* finalChlngs = NULL;
  int err = RDNA_ERR_NONE;
  int total_chlngs = 0;

  core_status_t* pStatus = (core_status_t*)ptrPstatus;
  json_object * jobj = json_object_new_object();

  json_object *jerrCode = json_object_new_int(pStatus->errCode);
  json_object_object_add(jobj, STR_ERR_CODE, jerrCode);


  json_object *jeMethId = json_object_new_int(pStatus->eMethId);
  json_object_object_add(jobj, STR_METHOD_ID, jeMethId);

  if (CORE_ERR_NONE == pStatus->errCode && pStatus->pArgs)
  {
    err = unmarshalChallenges(pStatus->pArgs->response.pcResponseData, (RDNAChallengeOpMode)pStatus->pArgs->response.nCredOpMode, &finalChlngs, total_chlngs);
    if (err == RDNA_ERR_NONE && finalChlngs)
    {
      json_object *jChlngsJsonString = json_object_new_string(finalChlngs);
      json_object_object_add(jobj, STR_CHLNG, jChlngsJsonString);

      json_object *jTotal_Chlngs = json_object_new_int(total_chlngs);
      json_object_object_add(jobj, STR_TOTAL_CHLNGS, jTotal_Chlngs);
    }
    else
    {
      json_object *jerrCode = NULL;
      if (err != RDNA_ERR_NONE)
      {
        jerrCode = json_object_new_int(err);
      }
      else
      {
        jerrCode = json_object_new_int(RDNA_ERR_INVALID_CHALLENGE_CONFIG);
      }
      json_object_object_add(jobj, STR_ERR_CODE, jerrCode);
    }
  }

  if (pStatus->pArgs->response.pcStatusMsg)
  {
    json_object *jStatusMsgJsonString = json_object_new_string(pStatus->pArgs->response.pcStatusMsg);
    json_object_object_add(jobj, STR_STATUS_MSG, jStatusMsgJsonString);
  }

  json_object *jStatusCode = json_object_new_int(getChallengeStatus(pStatus->pArgs->response.nStatusCode));
  json_object_object_add(jobj, STR_STATUS_CODE, jStatusCode);

  *coreStatusJson = m_strdup(json_object_to_json_string(jobj));
}

void RDNAUtil::serializeCheckChlngsStatusStructure(void* ptrPstatus, char **coreStatusJson)
{
  int total_chlngs = 0;
  char* finalChlngs = NULL;
  int err = RDNA_ERR_NONE;

  core_status_t* pStatus = (core_status_t*)ptrPstatus;
  json_object * jobj = json_object_new_object();

  json_object *jerrCode = json_object_new_int(pStatus->errCode);
  json_object_object_add(jobj, STR_ERR_CODE, jerrCode);


  json_object *jeMethId = json_object_new_int(pStatus->eMethId);
  json_object_object_add(jobj, STR_METHOD_ID, jeMethId);

  if (CORE_ERR_NONE == pStatus->errCode && pStatus->pArgs)
  {
    if (pStatus->pArgs->core_service_details.nServices > 0)
    {
      char *serviceJson = NULL;
      serializeServices((void**)pStatus->pArgs->core_service_details.pServices, &serviceJson);
      if (serviceJson != NULL)
      {
        json_object *jservicesJsonString = json_object_new_string(serviceJson);
        json_object_object_add(jobj, STR_SERVICES, jservicesJsonString);
      }

      json_object * jPxydetailsObj = json_object_new_object();

      json_object *jisStarted = json_object_new_int(pStatus->pArgs->pxyDetails.isStarted);
      json_object_object_add(jPxydetailsObj, STR_IS_STARTED, jisStarted);

      json_object *jisLocalhostOnly = json_object_new_int(pStatus->pArgs->pxyDetails.isLocalhostOnly);
      json_object_object_add(jPxydetailsObj, STR_IS_LOCAL_HOST_ONLY, jisLocalhostOnly);

      json_object *jisAutoStarted = json_object_new_int(pStatus->pArgs->pxyDetails.isAutoStarted);
      json_object_object_add(jPxydetailsObj, STR_IS_AUTO_STARTED, jisAutoStarted);

      json_object *jisPrivacyEnabled = json_object_new_int(pStatus->pArgs->pxyDetails.isPrivacyEnabled);
      json_object_object_add(jPxydetailsObj, STR_IS_PRIVACY_ENABLED, jisPrivacyEnabled);

      json_object *jportType = json_object_new_int(pStatus->pArgs->pxyDetails.portType);
      json_object_object_add(jPxydetailsObj, STR_PORT_TYPE, jportType);

      json_object *jport = json_object_new_int(pStatus->pArgs->pxyDetails.port);
      json_object_object_add(jPxydetailsObj, STR_PORT, jport);

      json_object_object_add(jobj, STR_PROXY_DETAILS, jPxydetailsObj);
    }

    //de-mux challenges, i.e. separate subchallenges into individual challenge.
    err = unmarshalChallenges(pStatus->pArgs->response.pcResponseData, (RDNAChallengeOpMode)pStatus->pArgs->response.nCredOpMode, &finalChlngs, total_chlngs);
    if (err == RDNA_ERR_NONE && finalChlngs)
    {
      json_object *jChlngsJsonString = json_object_new_string(finalChlngs);
      json_object_object_add(jobj, STR_CHLNG, jChlngsJsonString);

      json_object *jTotal_Chlngs = json_object_new_int(total_chlngs);
      json_object_object_add(jobj, STR_TOTAL_CHLNGS, jTotal_Chlngs);
    }
    else
    {
      json_object *jerrCode = NULL;
      if (err != RDNA_ERR_NONE)
      {
        jerrCode = json_object_new_int(err);
      }
      else
      {
        jerrCode = json_object_new_int(RDNA_ERR_INVALID_CHALLENGE_CONFIG);
      }
      json_object_object_add(jobj, STR_ERR_CODE, jerrCode);
    }

    if (pStatus->pArgs->response.pcStatusMsg)
    {
      json_object *jStatusMsgJsonString = json_object_new_string(pStatus->pArgs->response.pcStatusMsg);
      json_object_object_add(jobj, STR_STATUS_MSG, jStatusMsgJsonString);
    }

    json_object *jStatusCode = json_object_new_int(getChallengeStatus(pStatus->pArgs->response.nStatusCode));
    json_object_object_add(jobj, STR_STATUS_CODE, jStatusCode);
  }

  *coreStatusJson = m_strdup(json_object_to_json_string(jobj));
}

void RDNAUtil::serializeUpdateChlngsStatusStructure(void* ptrPstatus, char **coreStatusJson)
{
  char* finalChlngs = NULL;
  int err = RDNA_ERR_NONE;
  int total_chlngs = 0;

  core_status_t* pStatus = (core_status_t*)ptrPstatus;
  json_object * jobj = json_object_new_object();

  json_object *jerrCode = json_object_new_int(pStatus->errCode);
  json_object_object_add(jobj, STR_ERR_CODE, jerrCode);


  json_object *jeMethId = json_object_new_int(pStatus->eMethId);
  json_object_object_add(jobj, STR_METHOD_ID, jeMethId);

  if (CORE_ERR_NONE == pStatus->errCode && pStatus->pArgs)
  {
    json_object *jCredOpMode = json_object_new_int(pStatus->pArgs->response.nCredOpMode);
    json_object_object_add(jobj, STR_CHLNG_OP_MODE, jCredOpMode);

    if (pStatus->pArgs->response.pcStatusMsg)
    {
      json_object *jStatusMsgJsonString = json_object_new_string(pStatus->pArgs->response.pcStatusMsg);
      json_object_object_add(jobj, STR_STATUS_MSG, jStatusMsgJsonString);
    }

    json_object *jStatusCode = json_object_new_int(getChallengeStatus(pStatus->pArgs->response.nStatusCode));
    json_object_object_add(jobj, STR_STATUS_CODE, jStatusCode);
    
    err = unmarshalChallenges(pStatus->pArgs->response.pcResponseData, (RDNAChallengeOpMode)pStatus->pArgs->response.nCredOpMode, &finalChlngs, total_chlngs);
    if (err == RDNA_ERR_NONE && finalChlngs)
    {
      json_object *jChlngsJsonString = json_object_new_string(finalChlngs);
      json_object_object_add(jobj, STR_CHLNG, jChlngsJsonString);
      json_object *jTotal_Chlngs = json_object_new_int(total_chlngs);
      json_object_object_add(jobj, STR_TOTAL_CHLNGS, jTotal_Chlngs);
    }
    else
    {
      json_object *jerrCode = NULL;
      if (err != RDNA_ERR_NONE)
      {
        jerrCode = json_object_new_int(err);
      }
      else
      {
        jerrCode = json_object_new_int(RDNA_ERR_INVALID_CHALLENGE_CONFIG);
      }
      json_object_object_add(jobj, STR_ERR_CODE, jerrCode);
    }
  }

  *coreStatusJson = m_strdup(json_object_to_json_string(jobj));
}

void RDNAUtil::serializeForgotPswdStatusStructure(void* ptrPstatus, char **coreStatusJson)
{
  int err = RDNA_ERR_NONE;
  char* finalChlngs = NULL;
  int total_chlngs = 0;

  core_status_t* pStatus = (core_status_t*)ptrPstatus;
  json_object * jobj = json_object_new_object();

  json_object *jerrCode = json_object_new_int(pStatus->errCode);
  json_object_object_add(jobj, STR_ERR_CODE, jerrCode);


  json_object *jeMethId = json_object_new_int(pStatus->eMethId);
  json_object_object_add(jobj, STR_METHOD_ID, jeMethId);

  if (CORE_ERR_NONE == pStatus->errCode && pStatus->pArgs)
  {
    json_object *jCredOpMode = json_object_new_int(pStatus->pArgs->response.nCredOpMode);
    json_object_object_add(jobj, STR_CHLNG_OP_MODE, jCredOpMode);

    if (pStatus->pArgs->response.pcStatusMsg)
    {
      json_object *jStatusMsgJsonString = json_object_new_string(pStatus->pArgs->response.pcStatusMsg);
      json_object_object_add(jobj, STR_STATUS_MSG, jStatusMsgJsonString);
    }

    json_object *jStatusCode = json_object_new_int(getChallengeStatus(pStatus->pArgs->response.nStatusCode));
    json_object_object_add(jobj, STR_STATUS_CODE, jStatusCode);
    err = unmarshalChallenges(pStatus->pArgs->response.pcResponseData, (RDNAChallengeOpMode)pStatus->pArgs->response.nCredOpMode, &finalChlngs, total_chlngs);
    if (err == RDNA_ERR_NONE && finalChlngs)
    {
      json_object *jChlngsJsonString = json_object_new_string(finalChlngs);
      json_object_object_add(jobj, STR_CHLNG, jChlngsJsonString);

      json_object *jTotal_Chlngs = json_object_new_int(total_chlngs);
      json_object_object_add(jobj, STR_TOTAL_CHLNGS, jTotal_Chlngs);
    }
    else
    {
      json_object *jerrCode = NULL;
      if (err != RDNA_ERR_NONE)
      {
        jerrCode = json_object_new_int(err);
      }
      else
      {
        jerrCode = json_object_new_int(RDNA_ERR_INVALID_CHALLENGE_CONFIG);
      }
      json_object_object_add(jobj, STR_ERR_CODE, jerrCode);
    }
  }

  *coreStatusJson = m_strdup(json_object_to_json_string(jobj));
}

void RDNAUtil::serializeIWARequest(char* url, char **coreStatusJson)
{
  json_object * jobj = json_object_new_object();
  json_object *jChlngsJsonString = NULL;
  json_object *jeMethId = json_object_new_int(RDNAMethodID::RDNA_METH_GET_CREDS_CB);
  json_object_object_add(jobj, STR_METHOD_ID, jeMethId);

  if (NULL != url)
  {
    jChlngsJsonString = json_object_new_string(url);
  }
  else
  {
    jChlngsJsonString = json_object_new_string("");
  }
  json_object_object_add(jobj, STR_URL, jChlngsJsonString);
  *coreStatusJson = m_strdup(json_object_to_json_string(jobj));
}

int RDNAUtil::getCorePrivacyScope(std::string privacyScope)
{
  e_core_privacy_scope_t corePrivScope = CORE_PRIVACY_SCOPE_SESSION;

  if (0 == privacyScope.compare(STR_RDNA_PRIV_SCOPE_SSN))
  {
    corePrivScope = CORE_PRIVACY_SCOPE_SESSION;
  }
  else if (0 == privacyScope.compare(STR_RDNA_PRIV_SCOPE_DEVICE))
  {
    corePrivScope = CORE_PRIVACY_SCOPE_DEVICE;
  }
  else if (0 == privacyScope.compare(STR_RDNA_PRIV_SCOPE_USER))
  {
    corePrivScope = CORE_PRIVACY_SCOPE_USER;
  }
  else if (0 == privacyScope.compare(STR_RDNA_PRIV_SCOPE_AGENT))
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
  DBG("Proxy address : %s\n", aProxyAddress.c_str());
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

int RDNAUtil::marshalChlngResp(std::string inChlngJson, char** serializedChallenges)
{
  int errID = RDNA_ERR_NONE;
  struct json_object *inChlngJsonDataObj = NULL;
  struct json_object *inChlngChlngArr = NULL;
  struct json_object *chalngJson = NULL;

  struct json_object *jsonChlngArrObj = NULL;
  struct json_object *finalChlngArr = NULL;
  int inChlngArraLen = 0, iter = 0, nFinalChlngArrLen = 0;
  int found = 0;
  int index = 0;
  if (!inChlngJson.empty())
  {
    inChlngJsonDataObj = json_tokener_parse(inChlngJson.c_str());
    if (inChlngJsonDataObj != NULL)
    {
      if (json_object_object_get_ex(inChlngJsonDataObj, STR_CHLNG, &inChlngChlngArr))
      {
        inChlngArraLen = json_object_array_length(inChlngChlngArr);
        if (inChlngArraLen > 1)
        {
          finalChlngArr = json_object_new_array();
          for (iter = 0; iter < inChlngArraLen; iter++)
          {
            found = 0;
            struct json_object* jsonInt = NULL;
            struct json_object* jvalue = NULL;
            struct json_object *sub_chlng_idx = NULL;

            //get the element @ i'th position from input challenge
            jvalue = json_object_array_get_idx(inChlngChlngArr, iter);
            //get the necessary params/
            json_object_object_get_ex(jvalue, STR_SUB_CHLNG_IDX, &sub_chlng_idx);
            //get the array length of final output challenge
            nFinalChlngArrLen = json_object_array_length(finalChlngArr);
            if (0 < nFinalChlngArrLen)
            {
              for (index = 0; index < nFinalChlngArrLen; index++)    //For loop on out chlng array
              {
                struct json_object* arrElemindex = NULL;
                struct json_object* arrElem = json_object_array_get_idx(finalChlngArr, index);

                if (json_object_object_get_ex(jvalue, STR_CHLNG_IDX, &jsonInt)
                  && json_object_object_get_ex(arrElem, STR_CHLNG_IDX, &arrElemindex))
                {
                  if (json_object_get_int(jsonInt) == json_object_get_int(arrElemindex))
                  {
                    //get the input chlng json response arrays element and sub chlng index
                    struct json_object *in_chlng_resp_arr = NULL;
                    struct json_object *out_chlng_resp_arr = NULL;
                    struct json_object *chlng_resp_obj = NULL;
                    struct json_object *out_resp_arr = NULL;
                    json_object_object_get_ex(jvalue, STR_CHLNG_RESP, &in_chlng_resp_arr);
                    chlng_resp_obj = json_object_array_get_idx(in_chlng_resp_arr, 0);
                    json_object_object_get_ex(arrElem, STR_CHLNG_RESP, &out_chlng_resp_arr);
                    json_object_array_put_idx(out_chlng_resp_arr, json_object_get_int(sub_chlng_idx), chlng_resp_obj);
                    found = 1;
                    break;
                  }
                }
              }
            }

            if (!found)
            {
              json_object *respArr = NULL;
              json_object *chlng = NULL;
              json_object *type = NULL, *idx = NULL, *attempts = NULL, *name = NULL, *resp_validation = NULL, *resp = NULL;
              json_object *respElemt = NULL;
              chlng = json_object_new_object();
              respArr = json_object_new_array();
              json_object_object_get_ex(jvalue, STR_CHLNG_TYPE, &type);
              json_object_object_get_ex(jvalue, STR_CHLNG_IDX, &idx);
              json_object_object_get_ex(jvalue, STR_ATTEMPTS_LEFT, &attempts);
              json_object_object_get_ex(jvalue, STR_CHLNG_NAME, &name);
              json_object_object_get_ex(jvalue, STR_CHLNG_RESP_VALIDATION, &resp_validation);
              json_object_object_get_ex(jvalue, STR_CHLNG_RESP, &resp);
              respElemt = json_object_array_get_idx(resp, 0);
              json_object_array_put_idx(respArr, json_object_get_int(sub_chlng_idx), respElemt);
              json_object_object_add(chlng, STR_CHLNG_TYPE, type);
              json_object_object_add(chlng, STR_CHLNG_IDX, idx);
              json_object_object_add(chlng, STR_ATTEMPTS_LEFT, attempts);
              json_object_object_add(chlng, STR_CHLNG_NAME, name);
              json_object_object_add(chlng, STR_CHLNG_RESP_VALIDATION, resp_validation);
              json_object_object_add(chlng, STR_CHLNG_RESP, respArr);
              json_object_array_add(finalChlngArr, chlng);
            }
          }
          chalngJson = json_object_new_object();
          json_object_object_add(chalngJson, STR_CHLNG, finalChlngArr);
          *serializedChallenges = m_strdup(json_object_to_json_string(chalngJson));
        }
        else if (inChlngArraLen == 1)
        {
          *serializedChallenges = m_strdup(inChlngJson.c_str());
        }
      }
    }
    else
    {
      errID = RDNA_ERR_INVALID_CHALLENGE_JSON;
    }
  }
  return errID;
}

void RDNAUtil::serializePostLoginChallengesStatusStructure(void* ptrPstatus, char **coreStatusJson)
{
  char* finalChlngs = NULL;
  int err = RDNA_ERR_NONE;
  int total_chlngs = 0;
  core_status_t* pStatus = (core_status_t*)ptrPstatus;
  json_object * jobj = json_object_new_object();

  json_object *jerrCode = json_object_new_int(pStatus->errCode);
  json_object_object_add(jobj, STR_ERR_CODE, jerrCode);


  json_object *jeMethId = json_object_new_int(pStatus->eMethId);
  json_object_object_add(jobj, STR_METHOD_ID, jeMethId);

  if (pStatus->pArgs->response.pcStatusMsg)
  {
    json_object *jStatusMsgJsonString = json_object_new_string(pStatus->pArgs->response.pcStatusMsg);
    json_object_object_add(jobj, STR_STATUS_MSG, jStatusMsgJsonString);
  }

  json_object *jStatusCode = json_object_new_int(getChallengeStatus(pStatus->pArgs->response.nStatusCode));
  json_object_object_add(jobj, STR_STATUS_CODE, jStatusCode);

  if (CORE_ERR_NONE == pStatus->errCode && pStatus->pArgs && pStatus->pArgs->response.pcResponseData)
  {
    err = unmarshalChallenges(pStatus->pArgs->response.pcResponseData, (RDNAChallengeOpMode)pStatus->pArgs->response.nCredOpMode, &finalChlngs, total_chlngs);
    if (err == RDNA_ERR_NONE && finalChlngs)
    {
      json_object *jChlngsJsonString = json_object_new_string(finalChlngs);
      json_object_object_add(jobj, STR_CHLNG, jChlngsJsonString);
      json_object *jTotal_Chlngs = json_object_new_int(total_chlngs);
      json_object_object_add(jobj, STR_TOTAL_CHLNGS, jTotal_Chlngs);
    }
    else
    {
      json_object *jerrCode = NULL;
      if (err != RDNA_ERR_NONE)
      {
        jerrCode = json_object_new_int(err);
      }
      else
      {
        jerrCode = json_object_new_int(RDNA_ERR_INVALID_CHALLENGE_CONFIG);
      }
      json_object_object_add(jobj, STR_ERR_CODE, jerrCode);
    }
  }
  *coreStatusJson = m_strdup(json_object_to_json_string(jobj));
}

void RDNAUtil::serializeGetDeviceDetailsStatusStructure(void* ptrPstatus, char **coreStatusJson)
{
  core_status_t* pStatus = (core_status_t*)ptrPstatus;
  json_object * jobj = json_object_new_object();

  json_object *jerrCode = json_object_new_int(pStatus->errCode);
  json_object_object_add(jobj, STR_ERR_CODE, jerrCode);


  json_object *jeMethId = json_object_new_int(pStatus->eMethId);
  json_object_object_add(jobj, STR_METHOD_ID, jeMethId);

  if (CORE_ERR_NONE == pStatus->errCode && pStatus->pArgs)
  {
    json_object *jChlngsJsonString = json_object_new_string(pStatus->pArgs->response.pcResponseData);
    json_object_object_add(jobj, STR_DEVICE_DETAILS, jChlngsJsonString);

    if (pStatus->pArgs->response.pcStatusMsg)
    {
      json_object *jStatusMsgJsonString = json_object_new_string(pStatus->pArgs->response.pcStatusMsg);
      json_object_object_add(jobj, STR_STATUS_MSG, jStatusMsgJsonString);
    }

    json_object *jStatusCode = json_object_new_int(getChallengeStatus(pStatus->pArgs->response.nStatusCode));
    json_object_object_add(jobj, STR_STATUS_CODE, jStatusCode);
  }

  *coreStatusJson = m_strdup(json_object_to_json_string(jobj));
}

void RDNAUtil::serializeUpdateDeviceDetailsStatusStructure(void* ptrPstatus, char **coreStatusJson)
{
  core_status_t* pStatus = (core_status_t*)ptrPstatus;
  json_object * jobj = json_object_new_object();

  json_object *jerrCode = json_object_new_int(pStatus->errCode);
  json_object_object_add(jobj, STR_ERR_CODE, jerrCode);


  json_object *jeMethId = json_object_new_int(pStatus->eMethId);
  json_object_object_add(jobj, STR_METHOD_ID, jeMethId);

  if (CORE_ERR_NONE == pStatus->errCode && pStatus->pArgs && pStatus->pArgs->response.pcResponseData)
  {
    json_object *jChlngsJsonString = json_object_new_string(pStatus->pArgs->response.pcResponseData);
    json_object_object_add(jobj, STR_DEVICE_DETAILS, jChlngsJsonString);
  }

  if (pStatus->pArgs->response.pcStatusMsg)
  {
    json_object *jStatusMsgJsonString = json_object_new_string(pStatus->pArgs->response.pcStatusMsg);
    json_object_object_add(jobj, STR_STATUS_MSG, jStatusMsgJsonString);
  }

  json_object *jStatusCode = json_object_new_int(getChallengeStatus(pStatus->pArgs->response.nStatusCode));
  json_object_object_add(jobj, STR_STATUS_CODE, jStatusCode);

  *coreStatusJson = m_strdup(json_object_to_json_string(jobj));
}
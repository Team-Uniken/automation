#ifndef __RDNA_UTIL_HEADER_INCLUDED__
#define __RDNA_UTIL_HEADER_INCLUDED__

#include <string>

namespace RDNAUtil
{
  std::string trim(std::string const& str);
  int getChallengeStatus(int status_code);
  void serializeService(void* ptrCoreService, char** Services);
  void serializeServices(void** pptrCoreServices, char** Services);
  void serializeServiceList(void** pptrCoreServices, char** Services);
  void serializeCoreStatusStructure(void* ptrPstatus, char **coreStatusJson);
  void serializePauseTerminateStatusStructure(void* ptrPstatus, char **coreStatusJson);
  void serializeConfigStatusStructure(void* ptrPstatus, char **coreStatusJson);
  void serializeGetAllChlngsStatusStructure(void* ptrPstatus, char **coreStatusJson);
  void serializeCheckChlngsStatusStructure(void* ptrPstatus, char **coreStatusJson);
  void serializeUpdateChlngsStatusStructure(void* ptrPstatus, char **coreStatusJson);
  void serializeForgotPswdStatusStructure(void* ptrPstatus, char **coreStatusJson);
  void serializeIWARequest(char* url, char **coreStatusJson);
  int getCorePrivacyScope(std::string privacyScope);
  void setGlobalProxy(std::string host, int port);
  int marshalChlngResp(std::string chlngJson, char** serializedChallenges);
  void serializePostLoginChallengesStatusStructure(void* ptrPstatus, char **coreStatusJson);
  void serializeGetDeviceDetailsStatusStructure(void* ptrPstatus, char **coreStatusJson);
  void serializeUpdateDeviceDetailsStatusStructure(void* ptrPstatus, char **coreStatusJson);
}

#endif
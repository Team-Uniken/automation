#ifndef __RDNA_CPP_JS__WRAPPER_HEADER_INCLUDED__
#define __RDNA_CPP_JS__WRAPPER_HEADER_INCLUDED__

#include <nan.h>
#include "RDNAintern.h"
#include <v8.h>
#include <iphlpapi.h>
#include "uv.h"

extern "C"
{
#include "core-api.h"
#include "json.h"
#include "encode.h"
#include "common.h"
}

#define METHOD_EXPORT(name) static void name(const Nan::FunctionCallbackInfo<v8::Value>& info);
#if defined(_WIN32) || defined(WIN32)
# define m_strdup _strdup
#else
# define m_strdup strdup
#endif

using namespace std;
using namespace Nan;
using namespace v8;

class RDNA;
class RDNAPrivacyStream;

typedef struct Callbacks_t
{
  v8::Persistent<Function> onInitializeCompleted;
  v8::Persistent<Function> onTerminate;
  v8::Persistent<Function> onPauseRuntime;
  v8::Persistent<Function> onResumeRuntime;
  v8::Persistent<Function> onConfigRecieved;
  v8::Persistent<Function> onCheckChallengeResponseStatus;
  v8::Persistent<Function> onGetAllChallengeStatus;
  v8::Persistent<Function> onUpdateChallengeStatus;
  v8::Persistent<Function> onForgotPasswordStatus;
  v8::Persistent<Function> onLogOff;
  v8::Persistent<Function> getCredentials;
  v8::Persistent<Function> getApplicationName;
  v8::Persistent<Function> getApplicationVersion;
}ApplicationCallbacks;

typedef struct CallbacksPrivStream_t
{
  v8::Persistent<Function> onBlockReady;
}RDNAPrivacyStreamCallBacks;

typedef struct RDNAContext_t{
  void*          appCtx;             /* Context passsed by the application     */
  RDNA*          rdnaObj;            /* Wrapper object reference               */
  ApplicationCallbacks* callbacks;
  Isolate* isolate;
  uv_loop_t* loop;
}RDNAContext;

typedef struct {
  RDNAPrivacyStream* privyStream;    /* RDNA Privacy stream object reference */
  void*              appCtx;         /* Context passsed by the application   */
}RDNAPrivacyStreamContext;

typedef struct asyncJSWork {
  uv_work_t  request;
  //v8::Persistent<Function> callback;
  ApplicationCallbacks* asyncCallbacks;
  char* serializedCoreStatus;
  int errCode;
  RDNAMethodID methID;
}AsyncWork;

class RDNAPrivacyStream : public Nan::ObjectWrap
{
public:
  /**
  * @brief corePrivyStream_ - reference of core privacy stream context
  */
  void* corePrivyStream_;

  RDNAPrivacyStreamCallBacks* callBack_;

  METHOD_EXPORT(getPrivacyScope);
  METHOD_EXPORT(getStreamType);
  METHOD_EXPORT(writeDataIntoStream);
  METHOD_EXPORT(endStream);
  METHOD_EXPORT(destroy);
  METHOD_EXPORT(New);

public:
  static void Init(v8::Local<v8::Object> exports);

private:
  //static Nan::Persistent<v8::Function> constructor;

};

class RDNA : public Nan::ObjectWrap
{
public:
  static void Init(v8::Local<v8::Object> exports);

private:
  explicit RDNA();
  ~RDNA();
  void* coreCtx_;
  static Nan::Persistent<v8::Function> constructor;

  METHOD_EXPORT(New);
  METHOD_EXPORT(getSdkVersion);
  METHOD_EXPORT(initialize);
  METHOD_EXPORT(terminate);
  METHOD_EXPORT(pauseRuntime);
  METHOD_EXPORT(resumeRuntime);
  METHOD_EXPORT(getDefaultCipherSpec);
  METHOD_EXPORT(getDefaultCipherSalt);
  METHOD_EXPORT(getSessionID);
  METHOD_EXPORT(getAgentID);
  METHOD_EXPORT(getDeviceID);
  METHOD_EXPORT(setDNSServers);
  METHOD_EXPORT(getServiceByServiceName);
  METHOD_EXPORT(getServiceByTargetCoordinate);
  METHOD_EXPORT(getAllServices);
  METHOD_EXPORT(serviceAccessStart);
  METHOD_EXPORT(serviceAccessStop);
  METHOD_EXPORT(serviceAccessStartAll);
  METHOD_EXPORT(serviceAccessStopAll);
  METHOD_EXPORT(encryptDataPacket);
  METHOD_EXPORT(decryptDataPacket);
  METHOD_EXPORT(encryptHttpRequest);
  METHOD_EXPORT(decryptHttpResponse);
  METHOD_EXPORT(createPrivacyStream);

  METHOD_EXPORT(getConfig);
  METHOD_EXPORT(getAllChallenges);
  METHOD_EXPORT(checkChallengeResponse);
  METHOD_EXPORT(updateChallenges);
  METHOD_EXPORT(logOff);
  METHOD_EXPORT(resetChallenge);
  METHOD_EXPORT(forgotPassword);

  METHOD_EXPORT(getPostLoginChallenges);
  METHOD_EXPORT(getRegistredDeviceDetails);
  METHOD_EXPORT(updateDeviceDetails);
  METHOD_EXPORT(setIWACredentials);
};
#endif
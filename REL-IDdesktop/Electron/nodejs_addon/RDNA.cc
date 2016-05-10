#include <nan.h>
#include "RDNAimpl.h"

void InitAll(v8::Local<v8::Object> exports)
{
  RDNA::Init(exports);
}


NODE_MODULE(RDNA, InitAll)
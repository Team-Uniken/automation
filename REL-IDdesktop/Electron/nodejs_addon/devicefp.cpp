#define UNICODE
#include "devicefp.h"
#include <iostream>
#if defined (WIN32) || defined (_WIN32)
#include <comdef.h>
#include <windows.h>
#include <intrin.h>
#include <iphlpapi.h>
#pragma comment(lib, "IPHLPAPI.lib")
#include <Wbemidl.h>
#pragma comment(lib, "wbemuuid.lib")
#include <setupapi.h>
#include <string.h>
#endif

extern "C"
{
#include "json.h"
#include "encode.h"
}

using namespace std;

#if defined(_WIN32) || defined(WIN32)
# define m_strdup       _strdup
#else
# define m_strdup       strdup
#endif

//Max number of drives assuming primary/secondary, master/slave topology
#define  MAX_IDE_DRIVES  4
#define  IDENTIFY_BUFFER_SIZE  512

//IOCTL commands
#define  DFP_GET_VERSION          0x00074080
#define  DFP_SEND_DRIVE_COMMAND   0x0007c084
#define  DFP_RECEIVE_DRIVE_DATA   0x0007c088

#define  FILE_DEVICE_SCSI              0x0000001b
#define  IOCTL_SCSI_MINIPORT_IDENTIFY  ((FILE_DEVICE_SCSI << 16) + 0x0501)
#define  IOCTL_SCSI_MINIPORT 0x0004D008  //  see NTDDSCSI.H for definition

#define  SENDIDLENGTH  sizeof (SENDCMDOUTPARAMS) + IDENTIFY_BUFFER_SIZE
BYTE IdOutCmd [sizeof (SENDCMDOUTPARAMS) + IDENTIFY_BUFFER_SIZE - 1];


//  Valid values for the bCommandReg member of IDEREGS.
#define  IDE_ATAPI_IDENTIFY  0xA1  //  Returns ID sector for ATAPI.
#define  IDE_ATA_IDENTIFY    0xEC  //  Returns ID sector for ATA.

typedef BOOL (WINAPI *LPFN_ISWOW64PROCESS) (HANDLE, PBOOL);
LPFN_ISWOW64PROCESS fnIsWow64Process = NULL;

int getSystemManufacturer(char** manufacturer)
{
  int error = 0;
  HRESULT hres;
  do
  {
    // Step 1: Initialize COM.
    hres = CoInitializeEx(0, COINIT_MULTITHREADED);
    if (FAILED(hres))
    {
      //"Failed to initialize COM library. Error code = 0x" 
      error = -1;//TODO
      break;
    }
    // Step 2: Set general COM security levels.
    hres = CoInitializeSecurity(NULL
      , -1                           // COM authentication
      , NULL                         // Authentication services
      , NULL                         // Reserved
      , RPC_C_AUTHN_LEVEL_DEFAULT    // Default authentication 
      , RPC_C_IMP_LEVEL_IMPERSONATE  // Default Impersonation  
      , NULL                         // Authentication info
      , EOAC_NONE                    // Additional capabilities 
      , NULL                         // Reserved
      );
    if (FAILED(hres))
    {
      //"Failed to initialize security"
      CoUninitialize();
      error = -1;//TODO
      break;
    }
    // Step 3: Obtain the initial locator to WMI
    IWbemLocator *pLoc = NULL;

    hres = CoCreateInstance(CLSID_WbemLocator
      , 0
      , CLSCTX_INPROC_SERVER
      , IID_IWbemLocator
      , (LPVOID *)&pLoc);

    if (FAILED(hres))
    {
      //"Failed to create IWbemLocator object.
      CoUninitialize();
      error = -1;//TODO
      break;
    }
    // Step 4: Connect to WMI through the IWbemLocator::ConnectServer method
    IWbemServices *pSvc = NULL;

    // Connect to the root\cimv2 namespace with
    // the current user and obtain pointer pSvc
    // to make IWbemServices calls.
    hres = pLoc->ConnectServer(_bstr_t(L"ROOT\\CIMV2")  // Object path of WMI namespace
      , NULL                    // User name. NULL = current user
      , NULL                    // User password. NULL = current
      , 0                       // Locale. NULL indicates current
      , NULL                    // Security flags.
      , 0                       // Authority (for example, Kerberos)
      , 0                       // Context object 
      , &pSvc                   // pointer to IWbemServices proxy
      );

    if (FAILED(hres))
    {
      //"Could not connect. Error code = 0x" 
      pLoc->Release();
      CoUninitialize();
      error = -1;//TODO
      break;
    }

    //cout << "Connected to ROOT\\CIMV2 WMI namespace" << endl;

    // Step 5: Set security levels on the proxy 
    hres = CoSetProxyBlanket(pSvc                          // Indicates the proxy to set
      , RPC_C_AUTHN_WINNT            // RPC_C_AUTHN_xxx
      , RPC_C_AUTHZ_NONE             // RPC_C_AUTHZ_xxx
      , NULL                         // Server principal name 
      , RPC_C_AUTHN_LEVEL_CALL       // RPC_C_AUTHN_LEVEL_xxx 
      , RPC_C_IMP_LEVEL_IMPERSONATE  // RPC_C_IMP_LEVEL_xxx
      , NULL                         // client identity
      , EOAC_NONE                    // proxy capabilities 
      );

    if (FAILED(hres))
    {
      //"Could not set proxy blanket"
      pSvc->Release();
      pLoc->Release();
      CoUninitialize();
      error = -1;//TODO
      break;
    }
    // Step 6: Use the IWbemServices pointer to make requests of WMI
    // For example, get the name of the operating system
    IEnumWbemClassObject* pEnumerator = NULL;
    hres = pSvc->ExecQuery(bstr_t("WQL")
      , bstr_t("SELECT * FROM Win32_ComputerSystem")
      , WBEM_FLAG_FORWARD_ONLY | WBEM_FLAG_RETURN_IMMEDIATELY
      , NULL
      , &pEnumerator
      );

    if (FAILED(hres))
    {
      //"Query for operating system name failed."
      pSvc->Release();
      pLoc->Release();
      CoUninitialize();
      error = -1;//TODO
      break;
    }

    // Step 7:Get the data from the query in step 6
    IWbemClassObject *pclsObj = NULL;
    ULONG uReturn = 0;

    while (pEnumerator)
    {
      HRESULT hr = pEnumerator->Next(WBEM_INFINITE, 1, &pclsObj, &uReturn);

      if (0 == uReturn)
      {
        break;
      }

      VARIANT vtProp;
      // Get the value of the Name property
      hr = pclsObj->Get(L"Manufacturer", 0, &vtProp, 0, 0);
      //wcout << " OS Name : " << vtProp.bstrVal << endl;

      wstring wsManufacturer(vtProp.bstrVal);
      string strManufacturer(wsManufacturer.begin(), wsManufacturer.end());
      if (strManufacturer.size() >= 0)
        *manufacturer = m_strdup(strManufacturer.c_str());
      else
      {
        //TODO
      }
      VariantClear(&vtProp);

      pclsObj->Release();
    }

    // Cleanup
    pSvc->Release();
    pLoc->Release();
    pEnumerator->Release();
    CoUninitialize();
  } while (0);

  return error;
}

int DoIDENTIFY (HANDLE hPhysicalDriveIOCTL, PSENDCMDINPARAMS pSCIP,
                 PSENDCMDOUTPARAMS pSCOP, BYTE bIDCmd, BYTE bDriveNum,
                 PDWORD lpcbBytesReturned)
{
   // Set up data structures for IDENTIFY command.
   pSCIP -> cBufferSize = IDENTIFY_BUFFER_SIZE;
   pSCIP -> irDriveRegs.bFeaturesReg = 0;
   pSCIP -> irDriveRegs.bSectorCountReg = 1;
   pSCIP -> irDriveRegs.bSectorNumberReg = 1;
   pSCIP -> irDriveRegs.bCylLowReg = 0;
   pSCIP -> irDriveRegs.bCylHighReg = 0;

   // Compute the drive number.
   pSCIP -> irDriveRegs.bDriveHeadReg = 0xA0 | ((bDriveNum & 1) << 4);

   // The command can either be IDE identify or ATAPI identify.
   pSCIP -> irDriveRegs.bCommandReg = bIDCmd;
   pSCIP -> bDriveNumber = bDriveNum;
   pSCIP -> cBufferSize = IDENTIFY_BUFFER_SIZE;

   return ( DeviceIoControl (hPhysicalDriveIOCTL, DFP_RECEIVE_DRIVE_DATA,
               (LPVOID) pSCIP,
               sizeof(SENDCMDINPARAMS) - 1,
               (LPVOID) pSCOP,
               sizeof(SENDCMDOUTPARAMS) + IDENTIFY_BUFFER_SIZE - 1,
               lpcbBytesReturned, NULL) );
}

void getCpuIdInfo(char** ppcVendorID, char** ppcProcessorInfo, char** ppcProcessorSerialNumber)
{
  unsigned int regs[4];
  
  char buffer [100];
  // Capture vendor string
  char* pcVendor = NULL;
  unsigned int vendor[4];

  int eaxVal = 0;
  memset(vendor, 0, sizeof(vendor));
  //EAX=0: Get vendor ID - This returns the CPU's manufacturer ID string – 
  // a twelve-character ASCII string stored in EBX, EDX, ECX (in that order).
  // The highest basic calling parameter (largest value that EAX can be set to before calling CPUID) is returned in EAX.
  eaxVal = 0;
  regs[0] = 0, regs[1] = 0, regs[2] = 0, regs[3] = 0;
  __cpuid((int *)regs, (int)eaxVal);
  memset (buffer, 0, sizeof(buffer));
  sprintf_s(buffer, sizeof(buffer), "%u-%u:%u:%u;", regs[0], regs[1], regs[3], regs[2]);

  vendor[0] = regs[1];
  vendor[1] = regs[3];
  vendor[2] = regs[2];
  pcVendor = (char*) vendor;
  *ppcVendorID = _strdup(pcVendor);

  //EAX=1: Processor Info and Feature Bits
  //This returns the CPU's stepping, model, and family information in EAX (also called the signature of a CPU),
  // feature flags in EDX and ECX, and additional feature info in EBX.
  //Note: Not using the addn features of EBX as it is supported from Pentium 4
  eaxVal = 1;
  regs[0] = 0, regs[1] = 0, regs[2] = 0, regs[3] = 0;
  __cpuid((int *)regs, (int)eaxVal);
  memset (buffer, 0, sizeof(buffer));
  sprintf_s(buffer, sizeof(buffer), "%u-%u:%u;", regs[0], regs[3], regs[2]);
  *ppcProcessorInfo = _strdup(buffer);

  /* //this info is not predictable on VMs and hence not using
  //EAX=2: Cache and TLB Descriptor information
  //This returns a list of descriptors indicating cache and TLB capabilities in EAX, EBX, ECX and EDX registers.
  eaxVal = 2;
  regs[0] = 0, regs[1] = 0, regs[2] = 0, regs[3] = 0;
#ifdef _WIN32
  __cpuid((int *)regs, (int)eaxVal);
#else
  asm volatile
      ("cpuid" : "=a" (regs[0]), "=b" (regs[1]), "=c" (regs[2]), "=d" (regs[3])
       : "a" (eaxVal), "c" (0));
#endif
  memset (buffer, 0, sizeof(buffer));
  sprintf_s(buffer, sizeof(buffer), "%u:%u:%u:%u;", regs[0], regs[1], regs[2], regs[3]);
  cpuIdTmp.append(buffer);
  */

  //EAX=3: Processor Serial Number
  //Processor Serial Number can be calculated only upto pentium 3 processor
  eaxVal = 3;
  regs[0] = 0, regs[1] = 0, regs[2] = 0, regs[3] = 0;

  __cpuid((int *)regs, (int)eaxVal);

  memset (buffer, 0, sizeof(buffer));
  sprintf_s(buffer, sizeof(buffer), "%u:%u:%u:%u;", regs[0], regs[1], regs[2], regs[3]);
  *ppcProcessorSerialNumber = _strdup(buffer);

  //EAX=4 and EAX=Bh: Intel thread/core and cache topology
  eaxVal = 4; // ECX is set to zero for CPUID function 4
  regs[0] = 0, regs[1] = 0, regs[2] = 0, regs[3] = 0;
  __cpuid((int *)regs, (int)eaxVal);

  memset (buffer, 0, sizeof(buffer));
  sprintf_s(buffer, sizeof(buffer), "%u:%u:%u:%u", regs[0], regs[1], regs[2], regs[3]);
  //*ppcProcessorSerialNumber = _strdup(buffer); //TODO change

}

int getHDSerialNum(char** HDSerialNumber)
{
  int ret = 0; 
    ret = ReadPhysicalDriveInNT(HDSerialNumber);
    if(ret == 0) {
      ret = ReadIdeDriveAsScsiDriveInNT(HDSerialNumber);
    } else {
      goto CleanUp;
    }

//HDSerialNumber.erase(std::remove(HDSerialNumber.begin(), HDSerialNumber.end(), ' '), HDSerialNumber.end());
//HDSerialNumber.erase(std::remove(HDSerialNumber.begin(), HDSerialNumber.end(), (char)3), HDSerialNumber.end());

  ret = 1;
CleanUp:
return ret;
}

int ReadPhysicalDriveInNT (char** HDSerialNumber)
{
   int done = FALSE;
   int drive = 0;
   for (drive = 0; drive < MAX_IDE_DRIVES; drive++)
   {
      HANDLE hPhysicalDriveIOCTL = 0;

         //  Try to get a handle to PhysicalDrive IOCTL, report failure
         //  and exit if can't.
      WCHAR driveName [256];
      WCHAR strW [] = L"\\\\.\\PhysicalDrive%d";
      wsprintf(driveName, strW, drive);
      
         //  Windows NT, Windows 2000, must have admin rights
      hPhysicalDriveIOCTL = CreateFile (driveName,
                               GENERIC_READ | GENERIC_WRITE,
                               FILE_SHARE_READ | FILE_SHARE_WRITE, NULL,
                               OPEN_EXISTING, 0, NULL);
      // if (hPhysicalDriveIOCTL == INVALID_HANDLE_VALUE)
      //    printf ("Unable to open physical drive %d, error code: 0x%lX\n",
      //            drive, GetLastError ());

      if (hPhysicalDriveIOCTL != INVALID_HANDLE_VALUE)
      {
         GETVERSIONOUTPARAMS VersionParams;
         DWORD               cbBytesReturned = 0;

            // Get the version, etc of PhysicalDrive IOCTL
         memset ((void*) &VersionParams, 0, sizeof(VersionParams));

         if ( ! DeviceIoControl (hPhysicalDriveIOCTL, DFP_GET_VERSION,
                   NULL,
                   0,
                   &VersionParams,
                   sizeof(VersionParams),
                   &cbBytesReturned, NULL) )
         {
            // printf ("DFP_GET_VERSION failed for drive %d\n", i);
            // continue;
         }

            // If there is a IDE device at number "i" issue commands
            // to the device
         if (VersionParams.bIDEDeviceMap > 0)
         {
            BYTE             bIDCmd = 0;   // IDE or ATAPI IDENTIFY cmd
            SENDCMDINPARAMS  scip;
            //SENDCMDOUTPARAMS OutCmd;

            // Now, get the ID sector for all IDE devices in the system.
               // If the device is ATAPI use the IDE_ATAPI_IDENTIFY command,
               // otherwise use the IDE_ATA_IDENTIFY command
            bIDCmd = (VersionParams.bIDEDeviceMap >> drive & 0x10) ? \
                      IDE_ATAPI_IDENTIFY : IDE_ATA_IDENTIFY;

            memset (&scip, 0, sizeof(scip));
            memset (IdOutCmd, 0, sizeof(IdOutCmd));

            if ( DoIDENTIFY (hPhysicalDriveIOCTL,
                       &scip,
                       (PSENDCMDOUTPARAMS)&IdOutCmd,
                       (BYTE) bIDCmd,
                       (BYTE) drive,
                       &cbBytesReturned))
            {
               DWORD diskdata [256];
               int ijk = 0;
               USHORT *pIdSector = (USHORT *)
                             ((PSENDCMDOUTPARAMS) IdOutCmd) -> bBuffer;

               for (ijk = 0; ijk < 256; ijk++)
                  diskdata [ijk] = pIdSector [ijk];

               PrintIdeInfo (drive, diskdata, HDSerialNumber);

               done = TRUE;
            }
      }

         CloseHandle (hPhysicalDriveIOCTL);
      }
   }
   return done;
}

char* ConvertToString (DWORD diskdata [], int firstIndex,
                                   int lastIndex)
{
   static char string [1024];
   int index = 0;
   int position = 0;

      //  each integer has two characters stored in it backwards
   for (index = firstIndex; index <= lastIndex; index++)
   {
         //  get high byte for 1st character
      string [position] = (char) (diskdata [index] / 256);
      position++;

         //  get low byte for 2nd character
      string [position] = (char) (diskdata [index] % 256);
      position++;
   }

      //  end the string 
   string [position] = '\0';

      //  cut off the trailing blanks
   for (index = position - 1; index > 0 && ' ' == string [index]; index--)
      string [index] = '\0';

   return string;
}

void PrintIdeInfo (int drive, DWORD diskdata [256],
                               char** HDSerialNumber)
{
  char HardDriveSerialNumber [1024] = {'\0'};
  //  copy the hard driver serial number to the buffer
  strcpy_s (HardDriveSerialNumber, sizeof(HardDriveSerialNumber), ConvertToString (diskdata, 10, 19));
  *HDSerialNumber = _strdup(HardDriveSerialNumber);
}

int ReadIdeDriveAsScsiDriveInNT (char** HDSerialNumber)
{
   int done = FALSE;
   int controller = 0;

   for (controller = 0; controller < 2; controller++)
   {
      HANDLE hScsiDriveIOCTL = 0;
      WCHAR   driveName [256];

         //  Try to get a handle to PhysicalDrive IOCTL, report failure
         //  and exit if can't.
      WCHAR strW [] = L"//./Scsi%d:";
      wsprintf(driveName, strW, controller);
      //sprintf (driveName, "\\\\.\\Scsi%d:", controller);

         //  Windows NT, Windows 2000, any rights should do
      hScsiDriveIOCTL = CreateFile (driveName,
                               GENERIC_READ | GENERIC_WRITE,
                               FILE_SHARE_READ | FILE_SHARE_WRITE, NULL,
                               OPEN_EXISTING, 0, NULL);
      // if (hScsiDriveIOCTL == INVALID_HANDLE_VALUE)
      //    printf ("Unable to open SCSI controller %d, error code: 0x%lX\n",
      //            controller, GetLastError ());

      if (hScsiDriveIOCTL != INVALID_HANDLE_VALUE)
      {
         int drive = 0;

         for (drive = 0; drive < 2; drive++)
         {
            char buffer [sizeof (SRB_IO_CONTROL) + SENDIDLENGTH];
            SRB_IO_CONTROL *p = (SRB_IO_CONTROL *) buffer;
            SENDCMDINPARAMS *pin =
                   (SENDCMDINPARAMS *) (buffer + sizeof (SRB_IO_CONTROL));
            DWORD dummy;
   
            memset (buffer, 0, sizeof (buffer));
            p->HeaderLength = sizeof (SRB_IO_CONTROL);
            p->Timeout = 10000;
            p->Length = SENDIDLENGTH;
            p->ControlCode = IOCTL_SCSI_MINIPORT_IDENTIFY;
            strncpy_s ((char *) p->Signature, 8, "SCSIDISK", 8);
  
            pin->irDriveRegs.bCommandReg = IDE_ATA_IDENTIFY;
            pin->bDriveNumber = drive;

            if (DeviceIoControl (hScsiDriveIOCTL, IOCTL_SCSI_MINIPORT,
                                 buffer,
                                 sizeof (SRB_IO_CONTROL) +
                                         sizeof (SENDCMDINPARAMS) - 1,
                                 buffer,
                                 sizeof (SRB_IO_CONTROL) + SENDIDLENGTH,
                                 &dummy, NULL))
            {
               SENDCMDOUTPARAMS *pOut =
                    (SENDCMDOUTPARAMS *) (buffer + sizeof (SRB_IO_CONTROL));
               IDSECTOR *pId = (IDSECTOR *) (pOut->bBuffer);
               if (pId->sModelNumber [0])
               {
                  DWORD diskdata [256];
                  int ijk = 0;
                  USHORT *pIdSector = (USHORT *) pId;
          
                  for (ijk = 0; ijk < 256; ijk++)
                     diskdata [ijk] = pIdSector [ijk];

                  PrintIdeInfo(controller*2 + drive, diskdata, HDSerialNumber);

                  done = TRUE;
               }
            }
         }
         CloseHandle (hScsiDriveIOCTL);
      }
   }
   return done;
}

void getLocalComputerName(char** ppcNetBios, char** ppcDNSHostname, char** ppcDNSDomain)
{
  WCHAR buffer[256] = L"";
  char  buffer1[256] = {'\0'};
  DWORD dwSize = sizeof(buffer);
  size_t i = 0;

  if (!GetComputerNameEx(ComputerNameNetBIOS, buffer, &dwSize))
  {
    return;
  }
  else if (0 < dwSize)
  {
    for(i = 0; i < dwSize; i++)
    {
      buffer1[i] = (char)buffer[i];
    }
    *ppcNetBios= _strdup(buffer1);

    dwSize = _countof(buffer1);
    ZeroMemory(buffer1, dwSize);
    dwSize = _countof(buffer);
    ZeroMemory(buffer, dwSize);
  }

  if (!GetComputerNameEx(ComputerNameDnsHostname, buffer, &dwSize))
  {
    return;
  }
  else if (0 < dwSize)
  {
    for(i = 0; i < dwSize; i++)
    {
      buffer1[i] = (char)buffer[i];
    }

    *ppcDNSHostname= _strdup(buffer1);

    dwSize = _countof(buffer1);
    ZeroMemory(buffer1, dwSize);
    dwSize = _countof(buffer);
    ZeroMemory(buffer, dwSize);
  }
  
  if (!GetComputerNameEx(ComputerNameDnsDomain, buffer, &dwSize))
  {
    return;
  }
  else if (0 < dwSize)
  {
    for(i = 0; i < dwSize; i++)
    {
      buffer1[i] = (char)buffer[i];
    }
    *ppcDNSDomain = _strdup(buffer1);

    dwSize = _countof(buffer1);
    ZeroMemory(buffer1, dwSize);
    dwSize = _countof(buffer);
    ZeroMemory(buffer, dwSize);  
  }
}

void getCpuBrand(char** ppcCPUBrand)
{
  int CPUInfo[4] = {-1};
  unsigned int nExIds = 0;
  char CPUBrandString[0x40] = { '\0' };
  unsigned int i = 0;

  __cpuid(CPUInfo, 0x80000000);
  nExIds = CPUInfo[0];

  // Get the information associated with each extended ID.
  
  for( i = 0x80000000; i <= nExIds; ++i)
  {
    __cpuid(CPUInfo, i);

    // Interpret CPU brand string and cache information.
    if  (i == 0x80000002)
    {
      memcpy( CPUBrandString,
      CPUInfo,
      sizeof(CPUInfo));
      //printf("CPUInfo1 = %s\n", (char*)CPUBrandString);
    }
    else if( i == 0x80000003 )
    {
      memcpy( CPUBrandString + 16,
      CPUInfo,
      sizeof(CPUInfo));
      //printf("CPUInfo2 = %s\n", (char*)CPUBrandString);
    }
    else
      if( i == 0x80000004 )
    {
      memcpy(CPUBrandString + 32, CPUInfo, sizeof(CPUInfo));
      //printf("CPUInfo3 = %s\n", (char*)CPUBrandString);
    }
  }
  *ppcCPUBrand = _strdup(CPUBrandString);
}

int IsWow64()
{
  int bRet = 0;
#ifndef Q_OS_WINPHONE
  #if defined (WIN32) || defined (_WIN32)
    BOOL bIsWow64 = FALSE;

    if(fnIsWow64Process==NULL)
      fnIsWow64Process = (LPFN_ISWOW64PROCESS)GetProcAddress(
                           GetModuleHandle(TEXT("kernel32")),"IsWow64Process");

    if (NULL != fnIsWow64Process)
    {
      if (!fnIsWow64Process(GetCurrentProcess(),&bIsWow64))
      {
        //TSLOG_ERROR("Failed to detect 32 or 64 bit windows..");
      }
    }
    bRet = bIsWow64;
  #elif defined(__APPLE__) && defined(__MACH__)
    //TODO
    bRet = true;
  #elif __GNUC__
    #if __x86_64__ || __ppc64__
      bRet = true;
    #else
      bRet = false;
    #endif
  #endif
#endif
  return bRet;
}

void getOsVersionAndArchitecture(char** ppcOsVersion, char** ppcOsBuildNumber, char** ppcOsServicePack, char** ppcOsBits)
{
  int osbits32_ = 0;
  char osVersion [50] = {'\0'};
  char osBuildNumber[50] = {'\0'};
  char osServicePack[200] = {'\0'};
  char osServicePackVersion[128] = {'\0'};
  char osBits[20] = {'\0'};
  size_t i = 0;

  do
  {
    OSVERSIONINFOEX pOsvi;

    pOsvi.dwOSVersionInfoSize = sizeof (OSVERSIONINFOEX);

    if (!GetVersionEx ((OSVERSIONINFO*) &pOsvi))
    {
      break;
    }

    sprintf_s(osVersion, sizeof(osVersion), "%d.%d", pOsvi.dwMajorVersion, pOsvi.dwMinorVersion);
    *ppcOsVersion = _strdup(osVersion);
    sprintf_s(osBuildNumber, sizeof(osBuildNumber), "%d", pOsvi.dwBuildNumber);
    *ppcOsBuildNumber = _strdup(osBuildNumber);

    for(i = 0; i < wcslen(pOsvi.szCSDVersion); i++)
    {
      osServicePackVersion[i] = (char)pOsvi.szCSDVersion[i];
    }
    sprintf_s(osServicePack, sizeof(osServicePack), "%s %d.%d", osServicePackVersion, pOsvi.wServicePackMajor, pOsvi.wServicePackMinor);
    *ppcOsServicePack = _strdup(osServicePack);

  } while (0);

  osbits32_ = !IsWow64();
  sprintf_s(osBits, sizeof(osBits), "%s", osbits32_ ? "32" : "64");
  *ppcOsBits = _strdup(osBits);

  return;
}

char* getDeviceSignature()
{
  char *pcVendorId = NULL, *pcProcessorInfo = NULL, *pcProcessorSerialNumber = NULL;
  char* pcHwdSerialNumber = NULL;
  char* pcNetBios = NULL;
  char* pcDNSHostname = NULL;
  char* pcDNSDomain = NULL;
  char* pcCPUBrand = NULL;
  char* pcOsVersion = NULL; char* pcOsBuildNumber = NULL; char* pcOsServicePack = NULL; char* pcOsBits = NULL;
  char* pcEncodedData = NULL;
  int pcEncodedDataLen = 0;
  char* pcManufacturer = NULL;
  json_object *jsonObjDeviceSign = NULL;
  json_object *jstring = NULL;

  jsonObjDeviceSign = json_object_new_object();

  jstring = json_object_new_string("Windows");
  json_object_object_add(jsonObjDeviceSign, PLATFORM, jstring);

  getSystemManufacturer(&pcManufacturer);
  if (pcManufacturer)
  {
    pcEncodedData = (char*)base64_encode(&pcEncodedDataLen, (unsigned char*)pcManufacturer, strlen(pcManufacturer));
    jstring = json_object_new_string_len(pcEncodedData, pcEncodedDataLen);
    free(pcEncodedData); pcEncodedData = NULL; pcEncodedDataLen = 0;
    json_object_object_add(jsonObjDeviceSign, MANUFACTURER, jstring);
  }

  getOsVersionAndArchitecture(&pcOsVersion, &pcOsBuildNumber, &pcOsServicePack, &pcOsBits);
  if(pcOsVersion)
  {
    pcEncodedData = (char*) base64_encode(&pcEncodedDataLen, (unsigned char*)pcOsVersion, strlen(pcOsVersion));
    jstring = json_object_new_string_len(pcEncodedData, pcEncodedDataLen);
    free(pcEncodedData); pcEncodedData = NULL; pcEncodedDataLen = 0;

    json_object_object_add(jsonObjDeviceSign, OSVERSION, jstring);
    free(pcOsVersion);
    pcOsVersion = NULL;
  }
  if(pcOsBuildNumber)
  {
    pcEncodedData = (char*) base64_encode(&pcEncodedDataLen, (unsigned char*)pcOsBuildNumber, strlen(pcOsBuildNumber));
    jstring = json_object_new_string_len(pcEncodedData, pcEncodedDataLen);
    free(pcEncodedData); pcEncodedData = NULL; pcEncodedDataLen = 0;

    json_object_object_add(jsonObjDeviceSign, OSBUILDNUMBER, jstring);
    free(pcOsBuildNumber);
    pcOsBuildNumber = NULL;
  }
  if(pcOsServicePack)
  {
    pcEncodedData = (char*) base64_encode(&pcEncodedDataLen, (unsigned char*)pcOsServicePack, strlen(pcOsServicePack));
    jstring = json_object_new_string_len(pcEncodedData, pcEncodedDataLen);
    free(pcEncodedData); pcEncodedData = NULL; pcEncodedDataLen = 0;

    json_object_object_add(jsonObjDeviceSign, OSSERVICEPACK, jstring);
    free(pcOsServicePack);
    pcOsServicePack = NULL;
  }
  if(pcOsBits)
  {
    pcEncodedData = (char*) base64_encode(&pcEncodedDataLen, (unsigned char*)pcOsBits, strlen(pcOsBits));
    jstring = json_object_new_string_len(pcEncodedData, pcEncodedDataLen);
    free(pcEncodedData); pcEncodedData = NULL; pcEncodedDataLen = 0;

    json_object_object_add(jsonObjDeviceSign, ARCHITECTURE, jstring);
    free(pcOsBits);
    pcOsBits = NULL;
  }

  getCpuIdInfo(&pcVendorId, &pcProcessorInfo, &pcProcessorSerialNumber);

  if(pcVendorId)
  {
    pcEncodedData = (char*) base64_encode(&pcEncodedDataLen, (unsigned char*)pcVendorId, strlen(pcVendorId));
    jstring = json_object_new_string_len(pcEncodedData, pcEncodedDataLen);
    free(pcEncodedData); pcEncodedData = NULL; pcEncodedDataLen = 0;

    json_object_object_add(jsonObjDeviceSign, VENDORID, jstring);
    free(pcVendorId);
    pcVendorId = NULL;
  }
  if(pcProcessorInfo)
  {
    pcEncodedData = (char*) base64_encode(&pcEncodedDataLen, (unsigned char*)pcProcessorInfo, strlen(pcProcessorInfo));
    jstring = json_object_new_string_len(pcEncodedData, pcEncodedDataLen);
    free(pcEncodedData); pcEncodedData = NULL; pcEncodedDataLen = 0;

    json_object_object_add(jsonObjDeviceSign, PROCESSORINFO, jstring);
    free(pcProcessorInfo);
    pcProcessorInfo = NULL;
  }
  if(pcProcessorSerialNumber)
  {
    pcEncodedData = (char*) base64_encode(&pcEncodedDataLen, (unsigned char*)pcProcessorSerialNumber, strlen(pcProcessorSerialNumber));
    jstring = json_object_new_string_len(pcEncodedData, pcEncodedDataLen);
    free(pcEncodedData); pcEncodedData = NULL; pcEncodedDataLen = 0;

    json_object_object_add(jsonObjDeviceSign, PROCESSORSERIALNUMBER, jstring);
    free(pcProcessorSerialNumber);
    pcProcessorSerialNumber = NULL;
  }

  getCpuBrand(&pcCPUBrand);
  if(pcCPUBrand)
  {
    pcEncodedData = (char*) base64_encode(&pcEncodedDataLen, (unsigned char*)pcCPUBrand, strlen(pcCPUBrand));
    jstring = json_object_new_string_len(pcEncodedData, pcEncodedDataLen);
    free(pcEncodedData); pcEncodedData = NULL; pcEncodedDataLen = 0;

    json_object_object_add(jsonObjDeviceSign, CPUBRAND, jstring);
    free(pcCPUBrand);
    pcCPUBrand = NULL;
  }


  //TIMEZONE

  getLocalComputerName(&pcNetBios,&pcDNSHostname,&pcDNSDomain);
  if(pcNetBios)
  {
    pcEncodedData = (char*) base64_encode(&pcEncodedDataLen, (unsigned char*)pcNetBios, strlen(pcNetBios));
    jstring = json_object_new_string_len(pcEncodedData, pcEncodedDataLen);
    free(pcEncodedData); pcEncodedData = NULL; pcEncodedDataLen = 0;

    json_object_object_add(jsonObjDeviceSign, NETBIOS, jstring);
    free(pcNetBios);
    pcNetBios = NULL;
  }
  if(pcDNSHostname)
  {
    pcEncodedData = (char*) base64_encode(&pcEncodedDataLen, (unsigned char*)pcDNSHostname, strlen(pcDNSHostname));
    jstring = json_object_new_string_len(pcEncodedData, pcEncodedDataLen);
    free(pcEncodedData); pcEncodedData = NULL; pcEncodedDataLen = 0;

    json_object_object_add(jsonObjDeviceSign, DNSHOSTNAME, jstring);
    free(pcDNSHostname);
    pcDNSHostname = NULL;
  }
  if(pcDNSDomain)
  {
    pcEncodedData = (char*) base64_encode(&pcEncodedDataLen, (unsigned char*)pcDNSDomain, strlen(pcDNSDomain));
    jstring = json_object_new_string_len(pcEncodedData, pcEncodedDataLen);
    free(pcEncodedData); pcEncodedData = NULL; pcEncodedDataLen = 0;

    json_object_object_add(jsonObjDeviceSign, DNSDOMAIN, jstring);
    free(pcDNSDomain);
    pcDNSDomain = NULL;
  }

  getHDSerialNum(&pcHwdSerialNumber);
  if(pcHwdSerialNumber)
  {
    pcEncodedData = (char*) base64_encode(&pcEncodedDataLen, (unsigned char*)pcHwdSerialNumber, strlen(pcHwdSerialNumber));
    jstring = json_object_new_string_len(pcEncodedData, pcEncodedDataLen);
    free(pcEncodedData); pcEncodedData = NULL; pcEncodedDataLen = 0;

    json_object_object_add(jsonObjDeviceSign, HWDSERIALNUMBER, jstring);
    free(pcHwdSerialNumber);
    pcHwdSerialNumber = NULL;
  }

  return (char*)json_object_to_json_string(jsonObjDeviceSign);
}
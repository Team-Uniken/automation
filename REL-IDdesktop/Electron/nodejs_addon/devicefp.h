#ifndef __DEVICE_FP_H__
#define __DEVICE_FP_H__


#if defined (WIN32) || defined (_WIN32)
#include <windows.h>
#endif


#define VENDORID               "VendorIdentifier"
#define PROCESSORINFO          "ProcessorInfo"
#define PROCESSORSERIALNUMBER  "ProcessorSerialNumber"
#define NETBIOS                "NetBios"
#define DNSHOSTNAME            "DNSHostname"
#define DNSDOMAIN              "DNSDomain"
#define ARCHITECTURE           "Architecture"
#define OSSERVICEPACK          "OsServicePack"
#define OSBUILDNUMBER          "OsBuildNumber"
#define OSVERSION              "OsVersion"
#define CPUBRAND               "CPUBrand"
#define HWDSERIALNUMBER        "HardwareSerialNumber"
#define PLATFORM               "Platform"
#define MANUFACTURER           "Manufacturer"
#define TIMEZONE               "TimeZone"

#define APPIDENTIFIER          "AppIdentifier"
#define APPVERSION             "AppVersion"
#define APPNAME                "AppName"

typedef struct _SRB_IO_CONTROL
  {
  ULONG HeaderLength;
  UCHAR Signature[8];
  ULONG Timeout;
  ULONG ControlCode;
  ULONG ReturnCode;
  ULONG Length;
  } SRB_IO_CONTROL;

typedef struct _GETVERSIONOUTPARAMS
  {
  BYTE bVersion;      // Binary driver version.
  BYTE bRevision;     // Binary driver revision.
  BYTE bReserved;     // Not used.
  BYTE bIDEDeviceMap; // Bit map of IDE devices.
  DWORD fCapabilities; // Bit mask of driver capabilities.
  DWORD dwReserved[4]; // For future use.
  } GETVERSIONOUTPARAMS;

   // The following struct defines the interesting part of the IDENTIFY
typedef struct _IDSECTOR
{
   USHORT  wGenConfig;
   USHORT  wNumCyls;
   USHORT  wReserved;
   USHORT  wNumHeads;
   USHORT  wBytesPerTrack;
   USHORT  wBytesPerSector;
   USHORT  wSectorsPerTrack;
   USHORT  wVendorUnique[3];
   CHAR    sSerialNumber[20];
   USHORT  wBufferType;
   USHORT  wBufferSize;
   USHORT  wECCSize;
   CHAR    sFirmwareRev[8];
   CHAR    sModelNumber[40];
   USHORT  wMoreVendorUnique;
   USHORT  wDoubleWordIO;
   USHORT  wCapabilities;
   USHORT  wReserved1;
   USHORT  wPIOTiming;
   USHORT  wDMATiming;
   USHORT  wBS;
   USHORT  wNumCurrentCyls;
   USHORT  wNumCurrentHeads;
   USHORT  wNumCurrentSectorsPerTrack;
   ULONG   ulCurrentSectorCapacity;
   USHORT  wMultSectorStuff;
   ULONG   ulTotalAddressableSectors;
   USHORT  wSingleWordDMA;
   USHORT  wMultiWordDMA;
   BYTE    bReserved[128];
} IDSECTOR;


void getCpuIdInfo(char** ppcVendorID, char** ppcProcessorInfo, char** ppcProcessorSerialNumber);
#if __UNUSED_CODE__
void getdMacAddresses(char** macAddr);
#endif //__UNUSED_CODE__
int getHDSerialNum(char** ppHDSerialNum);
int ReadPhysicalDriveInNT (char** ppcPhysicalDrive);
int ReadIdeDriveAsScsiDriveInNT (char** ppPhysicalDrive);
#if __UNUSED_CODE__
void getHWProfileGuid(char** ppchwProfileGuid) ;
#endif //__UNUSED_CODE__
int DoIDENTIFY (HANDLE hPhysicalDriveIOCTL, PSENDCMDINPARAMS pSCIP,
                PSENDCMDOUTPARAMS pSCOP, BYTE bIDCmd, BYTE bDriveNum,
                PDWORD lpcbBytesReturned);
char *ConvertToString (DWORD diskdata [256], int firstIndex, int lastIndex);
void PrintIdeInfo (int drive, DWORD diskdata [256],
                   char** HDSerialNumber);
void getCpuBrand(char** ppcCPUBrand);
//  void GetLocalComputerName();
void getLocalComputerName(char** ppcNetBios, char** ppcDNSHostname, char** ppcDNSDomain);

void getOsVersionAndArchitecture(char** ppcOsVersion, char** ppcOsBuildNumber, char** ppcOsServicePack, char** ppcOsBits);

char* getDeviceSignature();

#endif /*__DEVICE_FP_H__*/


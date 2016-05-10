{
  "targets": [
    {
      "target_name": "RDNA",
      "sources": [ "RDNA.cc", "RDNAimpl.cpp", "RDNAimpl.h", "devicefp.h", "devicefp.cpp", "RDNAintern.h", "RDNAUtil.h", "RDNAUtil.cpp" ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")",
        "$(SolutionDir)..\\..\\api-sdk.out\\Win32\\$(Configuration)\\api-sdk\\include",
        "$(SolutionDir)..\\..\\api-sdk.out\\Win32\\$(Configuration)\\edubudi\\include",
        "$(SolutionDir)..\\..\\3rd-party.out\\Win32\\$(Configuration)\\json-c-master-0.11\\include"
      ],
      'link_settings': {
          'libraries': [
              "$(SolutionDir)..\\..\\api-sdk.out\\Win32\\$(Configuration)\\api-sdk\\libs\\MT\\api-sdk.lib",
              "$(SolutionDir)..\\..\\api-sdk.out\\Win32\\$(Configuration)\\edubudi\\libs\\MT\\edubudi.lib",
              "ws2_32.lib",
              "wininet.lib",
              "Rasapi32.lib",
          ]
      }
    }
  ]
}

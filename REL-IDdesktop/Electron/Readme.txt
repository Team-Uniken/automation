Development environment setup:
Follow the below link on how to setup the environment - 
"http://wiki.uniken.com/index.php/steps_to_setup_development_environment_for_electron."

Pre-requisites:
1] 3rd-party and api-sdk need to be built with vc13 win32 configuration so as to build for 32bit application.
2] 3rd-party.out and api-sdk.out folder be placed besides the nodejs_addon folder. (These will be shared offline)


Steps to build nodejs addon:
1] Prepare binding.gyp file with all the necessary source files and linkage parameters.
2] Run the following command in the base directory of the source where your binding.gyp file is present:
Running command for first time -
       node-gyp configure build --debug(optional) --arch=ia32 --target=<your_electron_version> --dist-url=https://atom.io/download/atom-shell
When running at later stages -
       node-gyp <build|rebuild> --debug(optional) --arch=ia32 --target=<your_electron_version> --dist-url=https://atom.io/download/atom-shell
       
3] After running the command a visual studio solution will get generated under "build" folder besides your bindin.gyp file and it will also contain the "RDNA.node" in respective build configuration folder "Release/Debug".

Running electron application:
1] Package.json is the important file in case of electron, it conatins the metadata about your application and also states the starting script to execute. sample package.json is provided in sample_application.
2] Once you have finalized on your contents and resources you can directly link to the nodejs addon which you have created earlier.
3] Now, to run the sample app you need to place the node js addon library in resource folder.
4] Open command prompt in the directory which contains the sample application folder and run the below command:
electron.exe sample_application
OR
If you have not set the path in environment variable:
<path_to_electron_exe> <folder name of your application>
OR
your can run electron.exe and ddrag drop the folder into the space provided inside electron application to run your application.

How is node js addon used by electron application:
In your java script you can directly link to your addon as below:
var addonObj = require('<path_to_your_addon>');
addonObj.function1();
addonObj.function2("abc", 123);

5] After you have started your app you will see a screen with a welcome text, apllication version, and a centre frame with some UI.
6] In order to initialize you will first have to import connection profiles, for that goto -> Settings->Connection Profiles tab->choose a file-> after choosing profiles will be imported from it and displayed as a list below->select the desired profile from the list->close the setting sction by pressing close button.
7] Now that the profile is set we can proceed to initialize the application by pressing initialize button.
8] After initialization is successfull, you will be shown a screen with multiple buttons to demonstrate the basic api-sdk functionalities.
9] Each api will have a result_string and an error_code as reponse.
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.getElementById("btnVfyWithtQR").addEventListener("click", this.btnVfyWithtQR.bind(this), false);    
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        // this.receivedEvent('deviceready');
        QRScanner.prepare(this.onDone);
    },

    btnVfyWithtQR: function() {
        window.location.href = "question_answer.html";
    },

    onDone: function(err, status){
        if (err) {
         // here we can handle errors and clean up any loose ends.
         console.error(err);
         alert("Caught error: "+err);
        }
        if (status.authorized) {
          // W00t, you have camera access and the scanner is initialized.
          // alert("started scanning code");
          QRScanner.scan(displayContents);

          function displayContents(err, text){
            if(err){
                alert("Scan cancelled");
                // an error occurred, or the scan was canceled (error code `6`)
            } else {
                // The scan completed, display the contents of the QR code:
                alert(text);
                QRScanner.hide(function(status){
                  console.log(status);
                });
                QRScanner.destroy(function(status){
                  console.log(status);
                });
                document.body.style.backgroundColor = "red";
            }
            }
        
          QRScanner.show(); //should feel very fast.
          // window.document.getElementById('div').classList.add('transparent-body');
          // document.getElementById('divBlock').style.backgroundColor = "red";

        } else if (status.denied) {
         // The video preview will remain black, and scanning is disabled. We can
         // try to ask the user to change their mind, but we'll have to send them
         // to their device settings with `QRScanner.openSettings()`.
        } else {
          // we didn't get permission, but we didn't get permanently denied. (On
          // Android, a denial isn't permanent unless the user checks the "Don't
          // ask again" box.) We can ask again at the next relevant opportunity.
        }
      },

      // displayContents: function(err, text){
      //   if(err){
      //     alert("Caught error while displaying content: "+err);
      //     // an error occurred, or the scan was canceled (error code `6`)
      //   } else {
      //     // The scan completed, display the contents of the QR code:
      //     alert(text);
      //   }
      // }

      // displayContents: function(err, text){
        //   if(err){
        //     alert("Caught error while displaying content: "+err);
        //     // an error occurred, or the scan was canceled (error code `6`)
        //   } else {
        //     // The scan completed, display the contents of the QR code:
        //     alert(text);
        //   }
        // }



};



app.initialize();
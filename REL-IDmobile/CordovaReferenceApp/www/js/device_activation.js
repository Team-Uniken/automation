var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.getElementById("deviceActive").addEventListener("click", this.deviceActive.bind(this), false);    
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        // this.receivedEvent('deviceready');
    },

    deviceActive: function() {
        window.location.href = "forgot_password.html";
    },


};

app.initialize();
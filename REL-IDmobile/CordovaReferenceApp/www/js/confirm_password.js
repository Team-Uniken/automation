var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.getElementById("btnCnfmPass").addEventListener("click", this.btnCnfmPass.bind(this), false);    
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        // this.receivedEvent('deviceready');
    },

    btnCnfmPass: function() {
        window.location.href = "dashboard.html";
    },


};

app.initialize();
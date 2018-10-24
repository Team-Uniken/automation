var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.getElementById("btnQueAns").addEventListener("click", this.btnQueAns.bind(this), false);    
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        // this.receivedEvent('deviceready');
    },

    btnQueAns: function() {
        window.location.href = "dashboard.html";
    },

};

app.initialize();
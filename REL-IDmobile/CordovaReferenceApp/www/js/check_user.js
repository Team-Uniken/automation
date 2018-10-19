var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.getElementById("checkUser").addEventListener("click", this.checkUser.bind(this), false);    
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        // this.receivedEvent('deviceready');
    },

    checkUser: function() {
        window.location.href = "enter_password.html";
    },


};

app.initialize();
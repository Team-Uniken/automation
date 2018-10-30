var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.getElementById("btnEntPwd").addEventListener("click", this.btnEntPwd.bind(this), false);    
        document.getElementById("btnForgotPass").addEventListener("click", this.btnForgotPass.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        // this.receivedEvent('deviceready');
    },

    btnEntPwd: function() {
        window.location.href = "../dashboard/dashboard.html";
    },


    btnForgotPass: function() {
        window.location.href = "../enterprise_registration/new_device_activation.html";
    },
};

app.initialize();
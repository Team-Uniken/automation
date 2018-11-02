var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.getElementById("btnSignup").addEventListener("click", this.btnSignup.bind(this), false);
        document.getElementById("btnLogIn").addEventListener("click", this.btnLogIn.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        // this.receivedEvent('deviceready');
    },

    btnSignup: function() {
        window.location.href = "../self_register/registration.html";
    },

    btnLogIn: function() {
        // window.location.href = "../check_user/check_user.html";
    }

};

app.initialize();
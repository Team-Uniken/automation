var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        // this.receivedEvent('deviceready');
        // alert("open web");
        // cordova.InAppBrowser.open('http://www.myapp.com', '_self', 'location=yes');
        // window.location = 'http://www.google.com/'
        // window.open('https://google.com', '_self ', 'location=yes');

        // var targetUrl = "http://www.google.com/";
        // var bkpLink = document.getElementById("webDiv");
        // bkpLink.setAttribute("href", targetUrl);
        // // cordova.InAppBrowser.open('http://www.myapp.com', '_self', 'location=yes');
        // bkpLink.text = targetUrl;
        // window.location.replace(targetUrl);
    },

};

app.initialize();

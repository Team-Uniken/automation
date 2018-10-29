var quetsionDiv="";
var listElement="";
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.getElementById("btnQueAns").addEventListener("click", this.btnQueAns.bind(this), false);
        quetsionDiv = document.getElementById("questionList");
        // quetsionDiv.addEventListener("click", this.listUpdate.bind(this), false);    
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        // this.receivedEvent('deviceready');
        this.addQuestionList();
        
    },

    btnQueAns: function() {
        window.location.href = "dashboard.html";
    },

    listUpdate: function(){
        alert("clicked"+listElement.innerHTML);
    },

    addQuestionList: function(){

        var questionSeries = ["what is your petname?", "what is your mother name?", "who is your first teacher?",
        "where you born",
        "your favourite sport",
        "most loved place",
        "best friend name",
        "first mobile used"];

        for (var i = 0; i < questionSeries.length; i++) { 
            listElement = document.createElement("A");                       // Create a <p> element
            var t = document.createTextNode(questionSeries[i]);      // Create a text node
            t.id = ""+i;
            listElement.appendChild(t);
            listElement.id = ""+i; 

            listElement.addEventListener("click", this.listUpdate.bind(this), false);

            quetsionDiv.appendChild(listElement);
        }
        
        
    }

};

app.initialize();
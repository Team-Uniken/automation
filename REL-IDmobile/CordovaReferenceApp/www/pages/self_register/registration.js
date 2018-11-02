var app = {
    txtFN: "" ,
    txtLN: "",
    txtEmail: "",
    txtMNo: "",
    humanSlider: "",
    checkboxTC: "",


    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.getElementById("btnRgstr").addEventListener("click", this.btnRgstr.bind(this), false);    
        document.getElementById("inputTxtFN").addEventListener("onchange", this.onFirstNameChange.bind(this), false);
       
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        // this.receivedEvent('deviceready');

        this.txtFN = document.getElementById("inputTxtFN");
        this.txtLN = document.getElementById("inputTxtLN");
        this.txtEmail = document.getElementById("inputTxtEmail");
        this.txtMNo = document.getElementById("inputTxtMNo");

        this.humanSlider = document.getElementById("humanSlider");
        this.checkboxTC = document.getElementById("checkbxTC");   
        
        //set dummy values in input text
        // this.txtFN.value = "Test";
        // this.txtLN.value = "User";
        // this.txtEmail.value = "nikhil.kanawade@uniken.com";
        // this.txtMNo.value = "9090909090";

    },

    btnRgstr: function() {
        if(this.validateEmpty(this.getValue(this.txtFN),this.getValue(this.txtLN),this.getValue(this.txtEmail),this.getValue(this.txtMNo)))
        if(this.checkFirstName(this.getValue(this.txtFN)) && this.checkLastName(this.getValue(this.txtLN)) && this.checkEmailID(this.getValue(this.txtEmail)) && this.checkMobNo(this.getValue(this.txtMNo)) && this.validateSliderValue(this.getValue(this.humanSlider)) && this.validateCheckBoxTC(this.checkboxTC.checked)){
            enrollUser(this.getValue(this.txtFN),this.getValue(this.txtLN),this.getValue(this.txtEmail),this.getValue(this.txtMNo));
        }
    },

    // check all fields are filled with valid data to call registerUser.
  validateEmpty: function(firstName,lastName,emailID,mobileNo) {

    if (!(firstName.length > 0 && lastName.trim().length > 0 && emailID.trim().length > 0
      && mobileNo.trim().length > 0)) {
      showToast("All fields are mandatory.");
      return false;
    } else {
        return true;
    }
  },

    validateName: function(name){
        // var rex = /^(?=(?:[^A-Za-z]*[A-Za-z]){2})(?![^\d~`?!^*¨ˆ;@=$%{}\[\]|\\\/<>#“.,]*[\d~`?!^*¨ˆ:/";_+&-/)@=$%{}\[\]|\\\/<>#“.,])\S+(?: \S+){0,2}$/;
        if(name!=null && name.trim().length >= 1){
         var rex = /^[a-zA-Z]+$/; 
         return rex.test(name);
        }
       
        return false;
    },
    //use to change checkbox UI from checked to uncheck or uncheck to check.
    selectCheckbox: function() {
        if (!this.state.check) {
        this.setState({ check: true });
        } else {
        this.setState({ check: false });
        }
    },

    checkFirstName: function(firstName){
        if(!this.validateName(firstName)){
            showToast("Entered first name is invalid. Kindly provide valid first name.");
            return false;
        }else {
            return true;
        }
    },

    checkLastName: function(lastName){
        if(!this.validateName(lastName)){
            showToast("Entered last name is invalid. Kindly provide valid last name.");
            return false;
        }else {
            return true;
        }
    },

    checkEmailID: function(email){
        if(!this.validateEmail(email)){
            showToast("Entered email id is invalid. Kindly provide valid email id.");
            return false;
        }else {
            return true;
        }
    },

    checkMobNo: function(num){
        if (num.length < 10 ) {
            showToast("Mobile number is invalid. Kindly provide valid mobile number.");
            return false;
        }else if(!this.validatePhoneNumber(num)){
            showToast("Mobile number is invalid. Kindly provide valid mobile number.");
            return false;
        }else {
            return true;
        }
    },

    //check entered email is valid or not
    validateEmail: function(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },

    //check entered phoneNumber is valid or not
    validatePhoneNumber: function(phone) {
        var regex = /^\+?([0-9]{0,14})$/;
        return regex.test(phone);
    },

    validateSliderValue: function(sliderVal) {
        if(sliderVal==100){
            return true
        }else{
            showToast("Please move the slider to the right.");
            return false;
        }
    },

    validateCheckBoxTC: function(chckbxVal) {
        if(chckbxVal==true){
            return true
        }else{
            showToast("Please accept Terms and Conditions.");
            return false;
        }
    },

    getValue: function(textBox) {
        return textBox.value;
    }

};

app.initialize();
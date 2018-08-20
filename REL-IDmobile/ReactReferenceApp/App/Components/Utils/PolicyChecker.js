var policy;

export default class PolicyChecker {

    constructor(credPolicy) {
        this.policy = {
            maxL: null,
            minL: null,
            minDg: null,
            minUc: null,
            minLc: null,
            minSc: null,
            Repetition: null,
            SeqCheck: null,
            charsNotAllowed: null,
            userIdCheck: null,
            msg: null,
        };

        this.isPolicyParseSuccessfull = this.parsePolicy(credPolicy);
        policy = this.policy;
    }

    parsePolicy(credPolicy) {
        if (credPolicy && typeof credPolicy === 'string') {
            //maxL=8||minL=4||minDg=0||minUc=1||minLc=1||minSc=2||Repetition=2||SeqCheck=ASC||charsNotAllowed=$ #%||userIdCheck=true||msg=<MessagetoBeShown>
            var policyArr = credPolicy.split("||");
            for (var i = 0; i < policyArr.length; i++) {
                var keyValArr = policyArr[i].split("=");

                if (keyValArr.length > 1) {
                    var key = keyValArr[0].trim();
                    var val = "";

                    if (keyValArr.length > 2) {
                        for (var j = 1; j < keyValArr.length; j++)
                            val = val + keyValArr[j];
                    } else {
                        val = keyValArr[1];
                    }

                    this.policy[key] = val;
                }
            }

            return true;
        }else 
            this.parsePolicy(`maxL=16||minL=8||minDg=1||minUc=1||minLc=1||minSc=1||Repetition=2||SeqCheck=ASC||charsNotAllowed=#||userIdCheck=true||msg=<ul><li>Password length must be between 8 and 16</li><li>It must contain atleast a number, an upper case character, a lower case character, and a special character</li><li>It can have only two repetition for a particular character</li><li>It should not be in ascending order eg: abcd or 1234 </li><li>It should not contain your username or special character #</li></ul>`);
    }

    validateCreds(username, password) {
        var retVal=true;
        var result={};
        
        if(!this.maxL(password)){
            retVal = false;
            result['maxL']=false;
        }

        if(!this.minL(password)){
            retVal = false;
            result['minL']=false;
        }
        
        if(!this.minDg(password)){
            retVal = false;
            result['minDg']=false;
        }

        if(!this.minUc(password)){
            retVal = false;
            result['minUc']=false;
        }

        if(!this.minLc(password)){
            retVal = false;
            result['minLc']=false;
        }

        if(!this.minSc(password)){
            retVal = false;
            result['minSc']=false;
        }

        if(!this.repetition(password)){
            retVal = false;
            result['repetition']=false;
        }

        if(!this.seqCheck(password)){
            retVal = false;
            result['seqCheck']=false;
        }

        if(!this.charsNotAllowed(password)){
            retVal = false;
            result['charsNotAllowed']=false;
        }

        if(!this.userIdCheck(username,password)){
            retVal = false;
            result['userIdCheck']=false;
        }

        //Uncomment for local testing - this will alert detailed result
       // alert("Result :" + JSON.stringify(result));
        return {policyMsg:policy.msg,validationErrorMsg:"",success:retVal,detailedResult:result}
    }

    maxL(credential) {
        if (policy.maxL == null || isNaN(policy.maxL) || parseInt(policy.maxL) <= 0)
            return true;

        return policy.maxL && credential.length <= parseInt(policy.maxL);
    }

    minL(credential) {
        if (policy.minL == null || isNaN(policy.minL) || parseInt(policy.minL) <= 0)
            return true;

        return policy.minL && credential.length >= parseInt(policy.minL);
    }

    minDg(credential) {
        if (policy.minDg == null || isNaN(policy.minDg) || parseInt(policy.minDg) <= 0)
            return true;

        var digitCount = 0;
        var minDg = parseInt(policy.minDg);
        for (var i = 0; i < credential.length; i++) {
            if (!isNaN(credential[i]))
                digitCount++;
        }

        return digitCount >= minDg;
    }

    minUc(credential) {
        if (policy.minUc == null || isNaN(policy.minUc) || parseInt(policy.minUc) <= 0)
            return true;

        var minUc = parseInt(policy.minUc);
        return this.countUpperCaseChars(credential) >= minUc;
    }

    minLc(credential) {
        if (policy.minLc == null || isNaN(policy.minLc) || parseInt(policy.minLc) <= 0)
            return true;

        var minLc = parseInt(policy.minLc);
        return this.countLowerCaseChars(credential) >= minLc;
    }

    minSc(credential) {
        if (policy.minSc == null || isNaN(policy.minSc) || parseInt(policy.minSc) <= 0)
            return true;

        var minSc = parseInt(policy.minSc);
        return this.countSpecialChars(credential) >= minSc;
    }

    countUpperCaseChars(str) {
        var count = 0, len = str.length;
        for (var i = 0; i < len; i++) {
            if (/[A-Z]/.test(str.charAt(i))) count++;
        }
        return count;
    }

    countLowerCaseChars(str) {
        var count = 0, len = str.length;
        for (var i = 0; i < len; i++) {
            if (/[a-z]/.test(str.charAt(i))) count++;
        }
        return count;
    }

    countSpecialChars(str) {
        var count = 0, len = str.length;
        for (var i = 0; i < len; i++) {
            if (/(?=.*(_|[^\w]))/.test(str.charAt(i))) count++;
        }
        return count;
    }

    charsNotAllowed(credential) {
        if (policy.charsNotAllowed == null)
            return true;
            
        //Example of pattern. You need to escape '[]
        //var pattern = '[@#$%^&*()_+-=\\[\\]{};\':"\|,.<>/?]';
        var notAllowedChars = policy.charsNotAllowed.replace("]", "\\]").replace("[", "\\[");
        var pattern = '[' + notAllowedChars + ']';
        var allFoundCharacters = credential.match(new RegExp(pattern, 'g'));
        return allFoundCharacters == null;
    }

    // eg : If repetition is 2 then it will return false on 'aaa' string , it means it allows 2 repeats in addition to orignal char.
    repetition(credential) {
        if (policy.Repetition == null || isNaN(policy.Repetition) || parseInt(policy.Repetition) <= 0)
            return true;

        var allowedRepetitionCount = parseInt(policy.Repetition);

        for (var i = 0; i < credential.length - allowedRepetitionCount; i++) {
            var c = credential[i];
            var isRepeatedChar = false;
            var repeatCount = 0;
            for (var j = i; j <= i + allowedRepetitionCount; j++) {
                if (credential[j] === c) {
                    repeatCount++;
                }
            }
            if (repeatCount > allowedRepetitionCount) {
                return false;
            }
        }
        return true;
    }

    userIdCheck(username, password) {
        if (policy.userIdCheck != null && policy.userIdCheck === 'true')
            return password.indexOf(username);
        else
            return true;
    }

    nextChar(c) {
        return String.fromCharCode(c.charCodeAt(0) + 1);
    }

    prevChar(c) {
        return String.fromCharCode(c.charCodeAt(0) - 1);
    }

    seqAscCheck(credential){
        if (credential.length > 1) {
            for (var i = 1; i < credential.length; i++) {
                if (/(?=.*(_|[^\w]))/.test(credential.charAt(i)) == false) {
                    if (this.nextChar(credential.charAt(i - 1)) !== credential.charAt(i)) {
                        return true;
                    }
                } else {
                    return true;
                }
            }

            return false;
        } else {
            return true;
        }
    }

    seqDscCheck(credential){
        if (credential.length > 1) {
            for (var i = 1; i < credential.length; i++) {
                if (/(?=.*(_|[^\w]))/.test(credential.charAt(i)) == false) {
                    if (this.prevChar(credential.charAt(i - 1)) !== credential.charAt(i)) {
                        return true;
                    }
                } else {
                    return true;
                }
            }

            return false;
        } else {
            return true;
        }
    }

    seqCheck(credential) {
        if (policy.SeqCheck != null && (policy.SeqCheck === "ASC"
            || policy.SeqCheck === "DSC"
            || policy.SeqCheck === "BOTH")) {

            var seqCheck = policy.SeqCheck;
            var retVal = true;

            if (seqCheck === "ASC" || seqCheck === "BOTH") {
                retVal = this.seqAscCheck(credential);
            }

            if (seqCheck === "DSC" || (seqCheck === "BOTH" && retVal)) {
                retVal = this.seqDscCheck(credential);
            }

            return retVal;
        }else{
            return true;
        }
    }
}
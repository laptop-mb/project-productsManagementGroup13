

function whitespace(str) {
    return str.trim().indexOf(" ") >= 0
}
function stringContainsNumber(_string) {
    return /\d/.test(_string);
}
function stringContainsAlphabet(_string) {
    return /^[0-9]*$/.test(_string.trim());
}

function isEmail(emailAdress) {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    // w use for char * use for breakpoint $ for end
    return regex.test(emailAdress)       
}

function isValids3(s3Url){
    let regex=/(s3-|s3\.)?(.*)\.amazonaws\.com/
    return regex.test(s3Url)
}

function isValidId(Id){
    let regex = /^[0-9a-fA-F]{24}$/
    return regex.test(Id)
}


function isPhoneNumber(number){
    let regex = /^\d{10}$/;
    return regex.test(number)
}


function isPincode(pin){
    let regex = /^\d{6}$/;
    console.log(pin, regex.test(pin))
    return regex.test(pin)
}

const isValidate= function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length > 0) return true;
    return false;
  };

  const isValidateNum= function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "number") return true;
    return false;
  };




const isValidName = function(name){
    try{
        if(!isValidate(name)){
            return "Name should be given and type string"
        }
        if(stringContainsNumber(name)){
            return "name should only contain letters"
        }

    }
    catch(error){
        return error.message

    }
}

const isValidMobile = function (mobile) {
    try {
        if (!isValidate(mobile)) {
            return "mobile number should be given and type string! "
        }
        if (whitespace(mobile)) {
            return "Make sure mobile  number should not have space ! " 
        }

        let phone = isPhoneNumber(mobile)
        let phone2 = /^[6-9][0-9]+$/.test(mobile)

        if (phone == false) {
            return "Please provide valid phone Number !" 
        }
        if (phone2 == false) {
            return "Please provide valid phone Number !" 
        }
        }
        catch (error) {
            return error.message
        }
}

    
const isValidEmail = function (email) {
    try {
        if (!isValidate(email)) {
            return "email should be given and type string! "
        }
        if (whitespace(email)) {
            return "Make sure email should not have any  space ! " 
        }
        let EmailId = isEmail(email)
        if (EmailId == false) {
            return "Please provide valid email address !" 
        }
    }
    catch (error) {
        return error.message
    }
}
const isPassword = function (password) {
    try {
        if (!isValidate(password)) {
            return "Passwords should be given and type string! "
        }
        if (whitespace(password)) {
            return "Make sure email should not have any  space ! " 
        }
        if(password.length>15 || password.length<8)
            return "Password length should be between 8 and 15 characters"
       
    }
    catch (error) {
        return error.message
    }
}





module.exports = {stringContainsAlphabet,isValidId,isValidName,isValidMobile,isValidEmail,isValids3,isPincode,isValidateNum,isPassword,isValidate}

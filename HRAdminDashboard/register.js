var conn_token = "90938715|-31949290688379017|90940932";
var db = "HREMP";
var rel = "Rel";
var user_rel = "User"
var baseUrl = "http://api.login2explore.com:5577";
var iml_url = "/api/iml";
var irl_url = "/api/irl";


function resetForm(){
    $("#name").val("");
    $("#email").val("");
    $("#phone").val("");
    $("#pwd").val("");
    $("#pwd2").val("");

    $("#name").focus();
    
}

function validatedData1() {

            var name_val = $("#name").val();
            var email_val = $("#email").val();
            var phone_val = $("#phone").val();
            var pwd_val = $("#pwd").val();
            var pwd2_val = $("#pwd2").val();

            if (name_val === "") {
                alert("Required Name");
                $("#name").focus();
                return "";
            }

            if (email_val === "") {
                alert("Required Email ID");
                $("#email").focus();
                return "";
            }

            if (phone_val.length != 10 ) {
                alert("Invalid Phone number");
                $("#phone").focus();
                return "";
            }

            if (pwd_val === "") {
                alert("Required Password");
                $("#pwd").focus();
                return "";
            }

            if (pwd2_val === "") {
                alert("Enter the Password again");
                $("#pwd2").focus();
                return "";
            }

            if (pwd_val !== pwd2_val) {
                alert("Enter Same Password");
                $("#pwd2").val("");
                $("#pwd").focus();
                return "";
            }


            var jsonObj = {
                    name:name_val,
                    email:email_val,
                    phone:phone_val,
                    pwd:pwd_val,
                };

            return JSON.stringify(jsonObj);
}

function checkUsername(){
        var e = $("#name").val();
        jsonObj = {
            name:e,
        }
        var request = createGET_BY_KEYRequest(conn_token, db, user_rel, JSON.stringify(jsonObj));
        jQuery.ajaxSetup({async: false});
        var resultObj = executeCommandAtGivenBaseUrl(request, baseUrl, irl_url);
        jQuery.ajaxSetup({async: true});

        if(resultObj.status == 200)
        {
            return true;
        }
        return false;
}

function checkEmail(){
        var e = $("#email").val();
        jsonObj = {
            email:e,
        }
        var request = createGET_BY_KEYRequest(conn_token, db, user_rel, JSON.stringify(jsonObj));
        jQuery.ajaxSetup({async: false});
        var resultObj = executeCommandAtGivenBaseUrl(request, baseUrl, irl_url);
        jQuery.ajaxSetup({async: true});

        if(resultObj.status == 200)
        {
            return true;
        }
        return false;
}

function checkPhone(){
        var e = $("#phone").val();
        jsonObj = {
            phone:e,
        }
        var request = createGET_BY_KEYRequest(conn_token, db, user_rel, JSON.stringify(jsonObj));
        jQuery.ajaxSetup({async: false});
        var resultObj = executeCommandAtGivenBaseUrl(request, baseUrl, irl_url);
        jQuery.ajaxSetup({async: true});

        if(resultObj.status == 200)
        {
            return true;
        }
        return false;
}



function registerUser(){
    var jsonStrObj = validatedData1();
    if (jsonStrObj === ""){
        return "";
    }

    if(checkUsername())
    {
        alert("Username Already Exist");
        resetForm();
        return "";
    }

    if(checkEmail())
    {
        alert("Email Already Exist!!!");
        resetForm();
        return "";
    }

    if(checkPhone())
    {
        alert("phone number Already Exist");
        resetForm();
        return "";
    }
    var putReqStr = createPUTRequest(conn_token, jsonStrObj, db, user_rel); 

    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(putReqStr, baseUrl, iml_url);
    jQuery.ajaxSetup({async: true});

    if(resultObj.status == 200)
    {
        window.location.href = 'login.html';
    }




}

function formDisable(ctrl) {
  $("#pro_name").prop("disabled",ctrl);
  $("#pro_phone").prop("disabled",ctrl);
}

function validatedData() {

          var pro_email = $("#pro_email").val();
          var pro_name = $("#pro_name").val();
          var pro_phone = $("#pro_phone").val();

          if (pro_email === "") {
              alert("Required Email ID");
              $("#pro_email").focus();
              return "";
          }

          if (pro_name === "") {
              alert("Required Name Value");
              $("#pro_name").focus();
              return "";
          }

          if (pro_phone === "") {
              alert("Required phone Value");
              $("#pro_phone").focus();
              return "";
          }

          var jsonObj = {
              email: pro_email,
              name: pro_name,
              phone: pro_phone,

              };

          return JSON.stringify(jsonObj);
}

function editProfile(){

  formDisable(false);

  $("#save").prop("disabled",false);
  $("#edit").prop("disabled",true);
}

function saveProfile(){

  var jsonStrObj = validatedData();

  if(jsonStrObj == "")
  {

      return "";
  }

  var updateRequest = createUPDATERecordRequest(conn_token, jsonStrObj, db, user_rel, localStorage.getItem("profile_rec_no"));
  jQuery.ajaxSetup({async: false});
  var resultObj = executeCommandAtGivenBaseUrl(updateRequest, baseUrl, iml_url);
  jQuery.ajaxSetup({async: true});

  formDisable(true);
  $("#save").prop("disabled",true);
  $("#edit").prop("disabled",false);    

  alert("PROFILE CHANGED SUCCESFULLY!!!");

}


function fillProfile(resObj){



  var data = JSON.parse(resObj.data).record;
  var profile_rec = JSON.parse(resObj.data).rec_no;
  localStorage.setItem("profile_rec_no",profile_rec);
  $("#pro_email").val(data.email);
  $("#pro_name").val(data.name);
  $("#pro_phone").val(data.phone);

  $("#pro_email").prop("disabled",true);
  formDisable(true);   


  console.log("Done!!!");


}

function getProfile(){


var email = localStorage.getItem("userID");
jsonObj = {
  email:email,
}

var request = createGET_BY_KEYRequest(conn_token, db, user_rel, JSON.stringify(jsonObj));

  jQuery.ajaxSetup({async: false});
  var resultObj = executeCommandAtGivenBaseUrl(request,baseUrl,irl_url);
  jQuery.ajaxSetup({async: true});
  fillProfile(resultObj);


}

getProfile();


function createSessionEmail(email){

	jQuery.ajaxSetup({async: false});
	var sessionTokenStatus = createJpdbSessionToken(conn_token, 23, db, user_rel, email);
	jQuery.ajaxSetup({async: true});

    if(sessionTokenStatus == 200){
    	alert("sessionToken create!!!")
    	window.location.href = 'index.html';
    }

    else{
    	alert("Unable To Login Please Try Again!!!");
    	$("#email").val("");
		$("#pwd").val(""); 

		$("#email").focus();
    	return "";
    }
}

function checkUser(){

	var email = $("#email").val();
	var pwd = $("#pwd").val(); 

	jsonObj = {
		email:email,
		pwd: pwd
	}

	var request = createGET_BY_KEYRequest(conn_token, db, user_rel, JSON.stringify(jsonObj));
	alert(request);
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(request,baseUrl,irl_url);
    jQuery.ajaxSetup({async: true});
    console.log(resultObj);

    if(resultObj.status == 200)
    {
    	createSessionEmail(email);
    }
    else{
    	alert("Unable To Login Please Try Again!!!");
    	$("#email").val("");
		$("#pwd").val(""); 

		$("#email").focus();
    	return "";
    }

}

function forgotPassword()
{

	var email = $("#email").val();

	if(email == "")
	{
		alert("Required Email ID");
		$("#email").focus();
		return ""
	}


	var request = createGET_BY_KEYRequest(conn_token, db, user_rel, JSON.stringify({email:email}));
	
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(request,baseUrl,irl_url);
    jQuery.ajaxSetup({async: true});
   
  	var password = JSON.parse(resultObj.data).record.pwd;
	jsonObj = {
		emailTo:email,
        emailSubject: "Forgot Password !!!!",
        emailContent: "Your Forgot Password is" + " "+ password,
	}

	jsonStr = JSON.stringify(jsonObj);

	alert(jsonStr);
	var createEmailReq = createEmailToSendReq(conn_token, jsonStr);
	alert(createEmailReq);
	jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(createEmailReq, baseUrl, emailUrl);
    jQuery.ajaxSetup({async: true});  

    console.log("DONE!!!");
    return ""
}


function checksession(){

	jQuery.ajaxSetup({async: false});
	var sessionStatus = isJpdbSessionTokenExists(conn_token, db, user_rel);
	jQuery.ajaxSetup({async: true});


	if(sessionStatus == 200)
	{
	
		if(myStatus == "out")
		{
			window.location.href = "index.html";
		}

		else
		{
			
			return ;
		}
	}

	else if(sessionStatus == 400)
	{
		if(myStatus == "in")
		{
			window.location.href = "login.html";
		}

		else
		{
			return;
		}
	}



}

function deleteSession()
{	
	var removesessionStatus = removeSessionTokenFromJPDB(conn_token, db, user_rel);
	
	if( removesessionStatus == 200)
	{
		alert("SuccesFully removed Session Token");
		window.location.href = 'login.html'
	}


}


function formDisable(ctrl) {
  $("#pro_name").prop("disabled",ctrl);
  $("#pro_phone").prop("disabled",ctrl);
}

function validatedData() {

          var oldpwd = $("#oldpwd").val();
          var pwd1 = $("#pwd1").val();
          var pwd2 = $("#pwd2").val();

          if (oldpwd === "") {
              alert("Required Orginal Password");
              $("#oldpwd").focus();
              return "";
          }

          if (pwd1 === "") {
              alert("Required New Password");
              $("#pwd1").focus();
              return "";
          }

          if (pwd2 === "") {
              alert("Re-type Same New Password");
              $("#pwd2").focus();
              return "";
          }

          if (pwd1 != pwd2){
              alert("Entered New Passwords Should Be Same!!!");
              $("#pwd1").val("");
              $("#pwd2").val("");

              $("#pwd1").focus();
              return "";
          }

          var jsonObj = {
              pwd:pwd1,
              };

          return JSON.stringify(jsonObj);
}



function changePassword(){

  var jsonStrObj = validatedData();

  if(jsonStrObj == "")
  {
      return
  }
  var oldpwd = $("#oldpwd").val();
  var email = localStorage.getItem("userID");
  jsonObj = {
      email:email,
      pwd:oldpwd,
  }

  var request = createGET_BY_KEYRequest(conn_token, db, user_rel, JSON.stringify(jsonObj));
  alert(request);
  jQuery.ajaxSetup({async: false});
  var resultObj = executeCommandAtGivenBaseUrl(request,baseUrl,irl_url);
  jQuery.ajaxSetup({async: true});

  if(resultObj.status == 400)
  {
      alert("Orginal Password is wrong!!!");

      $("#oldpwd").val("");
      $("#pwd1").val("");
      $("#pwd2").val("");
      $("#oldpwd").focus();

      return ""
  }
  if(resultObj.status == 200)
  {
      var pass_rec = JSON.parse(resultObj.data).rec_no;
      var updateRequest = createUPDATERecordRequest(conn_token, jsonStrObj, db, user_rel, pass_rec);
      alert(updateRequest)
      jQuery.ajaxSetup({async: false});
      var resultObj = executeCommandAtGivenBaseUrl(updateRequest, baseUrl, iml_url);
      jQuery.ajaxSetup({async: true}); 

      $("#oldpwd").val("");
      $("#pwd1").val("");
      $("#pwd2").val("");

      alert("PASSWORD CHANGED SUCCESFULLY!!!");
  } 

  else
  {
      alert("5 Something went wrong!!!");
      return "";
  }

}
// TOKEN AND JPDB API URL
var db = "JPDB";
var rel = "emp-rel";
var user_rel = "user_rel"
var baseUrl = "http://api.login2explore.com:5577";
var iml_url = "/api/iml";
var irl_url = "/api/irl";

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


function createGET_ALL_DB(token) {
    var req = "{\n"
            + "\"token\" : \""
            + token
            + ""
            + "\",\n" + "\"cmd\" : \"GET_ALL_DB\"\n"
            + "}";

    return req;
}

function executeCommandAtGivenBaseUrl(reqString, dbBaseUrl, apiEndPointUrl) {
    var url = dbBaseUrl + apiEndPointUrl;
    var jsonObj;
    $.post(url, reqString, function (result) {
        jsonObj = JSON.parse(result);
    }).fail(function (result) {
        var dataJsonObj = result.responseText;
        jsonObj = JSON.parse(dataJsonObj);
    });
    return jsonObj;
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function validateToken(){
    var conn_token = $("#token").val();

    if(conn_token == "")
    {
        alert("Enter Token Number!!!");
        $("#token").focus();
        return "";
    }
    
    var request = createGET_ALL_DB(conn_token);

    jQuery.ajaxSetup({async: false});
    var result = executeCommandAtGivenBaseUrl(request,baseUrl,irl_url)
    jQuery.ajaxSetup({async: true});

    if (result.status == 200){

        var database = result.data;
        localStorage.setItem("DATABASE",database);
        localStorage.setItem("Token",conn_token)   
        window.location.href = 'home.html';
        return "";
    }

    if(result.status == 401){

        alert("Invalid Token Number!!!");
        $("#token").val("");
        $("#token").focus();
        return "";
    }

    alert("Something went wrong!!!")
    return "";

}

function resetForm(){
    $("#token").val("");
    $("#token").focus();
    return "";
}

localStorage.clear();
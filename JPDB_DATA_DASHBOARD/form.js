var base_url = "http://api.login2explore.com:5577";
var iml_url = "/api/iml";
var irl_url = "/api/irl";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TOKEN NUBER DISPLAY~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
conn_token = localStorage.getItem("Token");
$("#token_no").text(conn_token);
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ GETTING DB AND REL NAME ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var db = localStorage.getItem("DB");
var rel = localStorage.getItem("REL");


$("#db_name").html(db);
$("#rel_name").html(rel);
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ CREATE DYNAMIC FORM ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//FUNCTION TO CREATE GET ALL RECORDS REQUEST FOR A RELATION
function createGet_All_Columns(token,db,rel) {
    var req = "{\n"
            + "\"token\" : \""
            + token
            + ""
            + "\",\n" 
            + "\"dbName\": \""+db+"\",\n"
            + "\"cmd\" : \"GET_ALL_COL\",\n"
            +"\"rel\": \""+rel+"\",\n"
            + "}";

    
    return req;
}






var request = createGet_All_Columns(conn_token,db,rel);
jQuery.ajaxSetup({async: false});
var resultObj_all = executeCommandAtGivenBaseUrl(request,base_url,irl_url);
jQuery.ajaxSetup({async: true});

var col = [];

for(var i = 0; i < resultObj_all.data.length ; i++)
{
    col[i] = resultObj_all.data[i].colName;
}

//console.log(col);  COLUMN NAME 

var html_field = '';
for(var i = 0; i < col.length; i++)
{   
   
    html_field += "<div class='form-group'>"
    html_field += "<label class='control-label col-sm-1' for="+col[i]+">"+col[i]+":</label>"
    html_field += "<div class='col-sm-10'>"

    html_field += "<input type='text' class='form-control' id="+col[i]+">"


    html_field += "</div>"
    html_field += "</div>"
   
}

html_btn_field = ""
//CONTROL Button Group
html_btn_field += "<div class='navbar navbar-default text-center' style='border:none;'>"
html_btn_field += " <button class='btn btn-lg btn-primary' style='margin:3px;' id='new' onclick='newForm()'>NEW</button>" 
html_btn_field += " <button class='btn btn-lg btn-primary' style='margin:3px;' id='save'   onclick='saveForm()'>SAVE</button>"            
html_btn_field += " <button class='btn btn-lg btn-primary' style='margin:3px;' id='edit'   onclick='editForm()'>EDIT</button>"
html_btn_field += " <button class='btn btn-lg btn-primary' style='margin:3px;' id='change' onclick='changeForm()'>CHANGE</button>"
html_btn_field += " <button class='btn btn-lg btn-primary' style='margin:3px;' id='reset'  onclick='resetForm()'>RESET</button>"
html_btn_field += "</div>"               

//NAVIGATION Button Group
html_btn_field +="<div class='navbar navbar-default text-center' style='border:none;'>"  
html_btn_field +="  <button class='btn btn-lg btn-primary' id='first' onclick='getFirst()'>FIRST</button>"                
html_btn_field +="  <button class='btn btn-lg btn-primary' id='prev'  onclick='getPrev()'>PREV</button>"
html_btn_field +="  <button class='btn btn-lg btn-primary' id='next'  onclick='getNext()'>NEXT</button>"
html_btn_field +="  <button class='btn btn-lg btn-primary' id='last'  onclick='getLast()'>LAST</button>"
html_btn_field +="</div>"

document.getElementById("empform").innerHTML = html_field;
document.getElementById("buttonGrp").innerHTML = html_btn_field;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ LOCAL STORAGE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//FORM INITIALIZE
function intEmpForm(){
    localStorage.removeItem("first_rec_no");
    localStorage.removeItem("rec_no");
    localStorage.removeItem("last_rec_no");
    console.log('Done!!! Emp Form Initialize')
}


//Set Method

//Store First Record in Local Storage
function setFirstRecNo2LS(resObj){
    var data = JSON.parse(resObj.data).rec_no;
    localStorage.setItem("first_rec_no", data);
}

//Store Current Record in Local Storage
function setCurRecNo2LS(resObj){
    var data = JSON.parse(resObj.data).rec_no;
    localStorage.setItem("rec_no", data);
}

//Store Last Record in Local Storage
function setLastRecNo2LS(resObj){
    var data = JSON.parse(resObj.data).rec_no;
    localStorage.setItem("last_rec_no", data);
}


//Get Method

//Return First Record from Local Storage
function getFirstRecNoFromLS(){
    return localStorage.getItem('first_rec_no');
}

//Return Current Record from Local Storage
function getCurRecNoFromLS(resObj){
    return localStorage.getItem('rec_no');
}

//Return Last Record from Local Storage
function getLastRecNoFromLS(resObj){
    return localStorage.getItem('last_rec_no');
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ CHECK RECORD METHODS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// CHECK FOR NO RECORD FOUND
function isNoRecordinLS(){

    if(localStorage.length){
        return false
    }
    else{
        return true
    }

}

// CHECK FOR ONE RECORD ONLY
function isOneRecordInLS(){
    if(isNoRecordinLS())
    {
        return false
    }

    if(getFirstRecNoFromLS() == getLastRecNoFromLS() )
    {
        return true
    }

    return false
}

//CHECK FOR NO RECORD
function checkForNoOrOneRecord(){
    
    if(isNoRecordinLS())
    {
        disableNav(true);
        disableForm(true);
        disableCtrl(true);
        $("#new").prop("disabled",false);
        return 
    }

    if(isOneRecordInLS())
    {
        disableNav(true);
        disableForm(true);
        disableCtrl(true);

        $("#new").prop("disabled",false);
        $("#edit").prop("disabled",false);

        return
    }
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Disable Buttons and Inputs ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//Disable CTRL
function disableCtrl(val){
    $("#new").prop('disabled', val);
    $("#save").prop('disabled', val);
    $("#edit").prop('disabled', val);
    $("#change").prop('disabled', val);
    $("#reset").prop('disabled', val);
}

//Disable NAV
function disableNav(val){
    $("#first").prop('disabled', val);
    $("#prev").prop('disabled', val);
    $("#next").prop('disabled', val);
    $("#last").prop('disabled', val);
}

//Disable Form
function disableForm(val){

    for(var i = 0 ; i<col.length; i++)
    {
    $("#"+col[i]+ "").prop('disabled', val);   
    }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~




// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~   DISPLAY METHODS    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//DISPLAY DATA ON FORM
function showData(resObj){
    
    if( resObj.status == 400)
    {
        return "";
    }

    var data = (JSON.parse(resObj.data)).record;
    setCurRecNo2LS(resObj);

  
    for(var i = 0 ; i<col.length; i++)
    {

    $("#"+col[i]+ "").val(data[col[i]]);   
    }

    $("#"+col[0]+ "").focus();

    disableNav(false);
    disableForm(true);

    $("#save").prop("disabled",true);
    $("#change").prop("disabled",true);
    $("#reset").prop("disabled",true);


    $("#new").prop("disabled",false);
    $("#edit").prop("disabled",false);


    if (getCurRecNoFromLS() == getLastRecNoFromLS())
    {
        $("#next").prop("disabled",true);
        $("#last").prop("disabled",true);
    }

    if (getCurRecNoFromLS() == getFirstRecNoFromLS())
    {
        $("#prev").prop("disabled",true);
        $("#first").prop("disabled",true);
    }
   
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~     NAVIGATION METHODS      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//GET FIRST RECORD
function  getFirst(){
    var request = createFIRST_RECORDRequest(conn_token,db, rel);
    
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(request, baseUrl, irl_url);
    showData(resultObj);
    setFirstRecNo2LS(resultObj);
    jQuery.ajaxSetup({async: true});


    $("#first").prop("disabled",true);
    $("#prev").prop("disabled",true);
    $("#save").prop("disabled",true);
    $("#next").prop("disabled",false);



}

function getPrev(){
    var rec_no = getCurRecNoFromLS();


    var request = createPREV_RECORDRequest(conn_token,db,rel,rec_no);
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(request, baseUrl, irl_url);
    showData(resultObj);
    jQuery.ajaxSetup({async: true});

    var new_rec_no = getCurRecNoFromLS();

    if( new_rec_no == getFirstRecNoFromLS()){
        $("#first").prop("disabled",true);
        $("prev").prop("disabled",true);
    }


}

function getNext(){
    var rec_no = getCurRecNoFromLS();


    var request = createNEXT_RECORDRequest(conn_token,db,rel,rec_no);
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(request, baseUrl, irl_url);
    showData(resultObj);
    jQuery.ajaxSetup({async: true});

    var new_rec_no = getCurRecNoFromLS();

    if( new_rec_no == getLastRecNoFromLS()){
        $("#last").prop("disabled",true);
        $("next").prop("disabled",true);
    }


}


//GET LAST RECORD
function getLast(){

    var request = createLAST_RECORDRequest(conn_token,db, rel);
    
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(request, baseUrl, irl_url);
    setLastRecNo2LS(resultObj);
    showData(resultObj);
    jQuery.ajaxSetup({async: true});


    $("#first").prop("disabled",false);
    $("#prev").prop("disabled",false);
    $("#save").prop("disabled",true);
    $("#next").prop("disabled",true);
    $("#last").prop("disabled",true);
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~     CONTROL METHODS      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function clearForm(){
    $("#empid").val("");
    $("#name").val("");
    $("#salary").val("");
    $("#hra").val("");
    $("#da").val("");
    $("#deduct").val("");
}


//FORM VALIDATION
function validatedData() {

            
            
            jsonObj = {}
            for(var i = 0 ; i<col.length; i++)
            {

                var data = $("#"+col[i]+ "").val();
                if(data == "")
                {
                 alert(data+ " Data Field Required!!!");   
                }

                jsonObj[col[i]] = data;
            }

            

            return JSON.stringify(jsonObj);
}


function newForm(){
 
    clearForm();
    disableForm(false);
    disableNav(true);
    disableCtrl(true);

    $("#save").prop("disabled",false);
    $("#reset").prop("disabled",false);

    $("#"+col[0]+"").focus();

}


function saveForm(){
    var jsonStrObj = validatedData();
    if (jsonStrObj === ""){
        return "";
    }

    var putReqStr = createPUTRequest(conn_token, jsonStrObj, db, rel);
    
    

    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(putReqStr, baseUrl, iml_url);
    jQuery.ajaxSetup({async: true});
    if(isNoRecordinLS()){
        setFirstRecNo2LS(resultObj);
    }
    setLastRecNo2LS(resultObj);
    setCurRecNo2LS(resultObj);

    resetForm();
}


function editForm(){
    disableForm(false);
    $("#"+col[0]+"").focus();
    disableNav(true);
    disableCtrl(true);
    $("#change").prop("disabled",false);
    $("#reset").prop("disabled",false);
    

}

function changeForm() {

    var jsonStrObj = validatedData();
    var updateRequest = createUPDATERecordRequest(conn_token, jsonStrObj, db, rel, getCurRecNoFromLS());
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(updateRequest, baseUrl, iml_url);
    jQuery.ajaxSetup({async: true});    

    resetForm();
}



function resetForm(){

    disableCtrl(true);
    disableNav(false);
    var getRequest = createGET_BY_RECORDRequest(conn_token,db, rel, getCurRecNoFromLS());
    
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(getRequest, baseUrl, irl_url);
    showData(resultObj);
    jQuery.ajaxSetup({async: true}); 

    if(isOneRecordInLS() || isNoRecordinLS())
    {
        disableNav(true);
    }

    $("#new").prop("disabled",false);
    if(isNoRecordinLS())
    {
        clearForm();
        $("#edit").prop("disabled", true);
    }
    else
    {
        $("#edit").prop("disabled", false);       
    }

    disableForm(true);
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~








//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ INITIALIZE NEW FORM ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
intEmpForm();
getFirst();
getLast();
checkForNoOrOneRecord();
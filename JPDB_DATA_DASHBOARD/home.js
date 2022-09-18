var base_url = "http://api.login2explore.com:5577";
var iml_url = "/api/iml";
var irl_url = "/api/irl";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TOKEN NUBER DISPLAY~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
token_number = localStorage.getItem("Token");
$("#token_no").text(token_number);
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  SAVE AND CANCEL METHOD ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function GetFormData(col) {

            jsonObj = {};

            for(var i = 0 ; i < col.length; i++)
            {   

                jsonObj[col[i]] = $("#"+col[i]).val();
               
            }
            
            return JSON.stringify(jsonObj);
}

function saveData(col)
{
    var col = localStorage.getItem("columns");
    col = col.split(',');
    var DB = $("#db_name").text();
    var Rel =$("#rel_name").text();

    var jsonStrObj = GetFormData(col);

   
    var updateReq = createUPDATERecordRequest(token_number, jsonStrObj, DB, Rel, localStorage.getItem("rec_no")); 
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(updateReq, baseUrl, iml_url);
    jQuery.ajaxSetup({async: true});    

    cancelForm();
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~EDIT AND DELETE METHOD~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function getRecordNo(col,row,DB,Rel)
{
    jsonObj = {};

    
    for(var i = 0 ; i < col.length; i++)
    {
        if(row[i] == null)
        {
            row[i] == ""
        }

        jsonObj[col[i]] = row[i];
       
    }

    var getReqStr = createGET_BY_KEYRequest(token_number,DB, Rel, JSON.stringify(jsonObj));
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(getReqStr,base_url, irl_url);
    jQuery.ajaxSetup({async: true});
 
    var record_no = JSON.parse(resultObj.data).rec_no;

    return record_no;
}

function EditData(data)
{   

    document.getElementById("body_id").style.opacity = 0.1;
    document.getElementById("sidemenuID").style.opacity = 0.1;
    document.getElementById("navID").style.display = "none";
    document.getElementById("popupForm").style.display = "block";


    //$("li").last().addClass("disabled");

    var data = data.split('/');
    var col = data[0].split(',');
    var idx = data[1];
   
    var DB = $("#db_name").text();
    var Rel =$("#rel_name").text();

    var row = getRows(token_number,DB,Rel)
    col = Object.keys(row[0].record);
    var d = row;

    var data_row = [];
    for(var i = 0; i < d.length; i++)
    {
        var row_data = [];
        for(var j = 0; j < col.length; j++)
        {
            var e = d[i].record[col[j]];

            if(e == undefined)
            {
                e = null;
            }
            row_data.push(e);
        }
            data_row.push(row_data);
    }

    row = data_row[idx];
    
    var html = '';
    for(var i = 0; i < col.length; i++)
    {   
       
        html += "<div class='form-group'>"
        html += "<label class='control-label col-sm-1' for="+col[i]+">"+col[i]+":</label>"
        html += "<div class='col-sm-10'>"

        if( typeof row[i] === 'string')
        {
            row[i] = row[i].replaceAll(" ","_");
            html += "<input type='text' class='form-control' value=  " + row[i] + "   id="+col[i]+">"
        }

        html += "</div>"
        html += "</div>"
       
    }
  
    //Button Group 
    var record_no = getRecordNo(col,row,DB,Rel);

    localStorage.setItem("columns",col);
    localStorage.setItem("rec_no",record_no);

    html += "<div class='form-group text-center'>"
    html += "<button class='btn btn-sm btn-primary' style='margin:10px;' id='save' onclick='saveData()'>SAVE</button>"
    html += "<button class='btn btn-sm btn-danger ' style='margin:10px;' id='cancel' onclick='cancelForm()'>Cancel</button></div>"
      
    document.getElementById("popupForm").innerHTML = html;
     
      
}


function cancelForm()
{
    var DB = $("#db_name").text();
    var Rel =$("#rel_name").text();

    document.getElementById("body_id").style.opacity = 1;
    document.getElementById("sidemenuID").style.opacity = 1;
    document.getElementById("navID").style.display = "block";

    document.getElementById("popupForm").style.display = "none";

    insertDatatable(DB,Rel);
}

function DeleteData(data)
{

    var data = data.split('/');
    var col = data[0].split(',');
    var idx = data[1];
   
    var DB = $("#db_name").text();
    var Rel =$("#rel_name").text();

    var row = getRows(token_number,DB,Rel)
    col = Object.keys(row[0].record);
    var d = row;

    var data_row = [];
    for(var i = 0; i < d.length; i++)
    {
        var row_data = [];
        for(var j = 0; j < col.length; j++)
        {
            var e = d[i].record[col[j]];

            if(e == undefined)
            {
                e = null;
            }
            row_data.push(e);
        }
            data_row.push(row_data);
    }

    row = data_row[idx];
   
    
    var record_no = getRecordNo(col,row,DB,Rel);
  

    var remReqStr = createREMOVERecordRequest(token_number,DB, Rel, record_no);
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(remReqStr,base_url, iml_url);
    jQuery.ajaxSetup({async: true});

    insertDatatable(DB,Rel);

}



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~DATABASE NAME~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


//CREATING DYNAMIC HTML TAG FOR LIST ITEM(DB AND REL) 
var html_start = '<li class="nav-item menu-open" >'
var html_end = '</li>'

var html_array = [];
var html;
var db = localStorage.getItem("DATABASE");

dbArray = db.split(",");

for(var i = 0; i< dbArray.length; i++)
{

    
    html = '<a href="#" class="nav-link active">'
    html += '<i class="nav-icon fas fa-tachometer-alt"></i>'
    html += '<p>'+ dbArray[i] + '<i class="right fas fa-angle-left"></i></p></a>'
   

    //MAKE REQUEST TO GET ALL RELATION FOR A DB
    var request = createGET_ALL_RELATIONRequest(token_number, dbArray[i]);
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(request,base_url,irl_url);
    jQuery.ajaxSetup({async: true});


    //LOOPING TO ALL RELATION AND APPEND THEM TO THE LIST ITEM
    for(var j=0; j<resultObj.data.length; j++)
    {   
        html += '<ul class="nav nav-treeview " id="List'+(i+1)+''+(j+1)+'">'
        html += '<li class="nav-item">'
        html += '<a href="#" class="nav-link">'

        html += '<i class="far fa-circle nav-icon"></i>'
        html += '<p>'+resultObj.data[j].relName+'</p></a></li></ul>' 
    }

    html_array[i] = html_start+html+html_end;
    
}


//DISPLAY LIST ITEM IN SIDE NAV MENU

html = []
for(var i = 0; i < html_array.length; i++)
{
    html += html_array[i];
}
var database_tag = document.getElementById("databaseId");
database_tag.innerHTML = html;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ INSERT DATA INTO DATATABLE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


//FUNCION TO GET ROWS
function getRows(token_number,db,rel)
{
        var request_all = createGET_ALL(token_number,db,rel);
        jQuery.ajaxSetup({async: false});
        var resultObj_all = executeCommandAtGivenBaseUrl(request_all,base_url,irl_url);
        jQuery.ajaxSetup({async: true});

        
        
        var rec = JSON.parse(resultObj_all.data).json_records;

        var idx =  [];
        
        for( var i = 0; i < rec.length; i++)
        {
            if( rec[i].record == null)
            {
                idx.push(i);
                rec.splice(i,1);
                i--;
            }
          
        }

        return rec
}

//FUNCTION TO CREATE GET ALL RECORDS REQUEST FOR A RELATION
function createGET_ALL(token,db,rel) {
    var req = "{\n"
            + "\"token\" : \""
            + token
            + ""
            + "\",\n" 
            + "\"dbName\": \""+db+"\",\n"
            + "\"cmd\" : \"GET_ALL\",\n"
            +"\"rel\": \""+rel+"\",\n"
            + "}";

    
    return req;
}


//FUNCTION TO CREATE GET ALL COLUMN REQUEST FOR A RELATION 
function createGET_ALL_COLUMN(token,db,rel) {
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




//METHOD TO CREATE NEW DATATABLE WITH NEW ROWs AND COLUMNs
function insertDatatable(db,rel) {
    
        
        var columns = [];
        var data_row = [];
        
        localStorage.setItem("DB",db);
        localStorage.setItem("REL",rel);    

        var rec = getRows(token_number,db,rel);
        col = Object.keys(rec[0].record);
        var d = rec;

        for(var i = 0; i < d.length; i++)
        {
            var row_data = [];
            for(var j = 0; j < col.length; j++)
            {
                var e = d[i].record[col[j]];

                if(e == undefined)
                {
                    e = null;
                }
                row_data.push(e);
            }
                data_row.push(row_data);
        }
        

        for(var k = 0 ;k<col.length; k++)
        {
            columns.push({title:col[k]});
        }
     

       if ($.fn.DataTable.isDataTable("#example1")) {
    
          
          
          $('#example1').DataTable().clear().destroy();

          $("#header_idx").html("");
        }
        

        columns.push(  {
             title:"Edit",
             "render": function (data, type, row, meta)
                        { 

                            return "<a href='#' class='btn btn-info' onclick=EditData('" + col + "/" + meta.row  +"'); >Edit</a>";
            
                        }
                    
        });
       
        columns.push({
             title:"Delete",
             data: null, 
             render: function (data, type, row,meta)
                        {

                            return "<a href='#' class='btn btn-danger' onclick=DeleteData('" + col + "/" + meta.row  +"'); >Delete</a>";
                        }
        });
        



        var table = $("#example1").DataTable({
            // "fnDrawCallback": function () {
            //            $('#example1 thead').html('');
            //        },
            
            "destroy":true,
            "data": data_row,
            "columnDefs": [{
                "defaultContent": "-",
                "targets": "_all"
              }],
            "columns": columns,
            
            
            
            "responsive": true, "lengthChange": false, "autoWidth": false,
            "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"]
        }).buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');

       

}



//MAPPING DB AND REL USING OBJECT {KEY(rel) : VALUE(db)}
mapDB = {};

for(var k = 0; k< dbArray.length; k++)
{   
    //
    var request = createGET_ALL_RELATIONRequest(token_number, dbArray[k]);
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(request,base_url,irl_url);
    jQuery.ajaxSetup({async: true});

  
    for(var l=0; l<resultObj.data.length; l++)
    {
        mapDB[resultObj.data[l].relName] = dbArray[k];
        $("#List"+(k+1)+''+(l+1)).on("click", "li", function() {
            
            
            var rel_name = $(this).text();

            $("#db_name").html(mapDB[rel_name]);
            $("#rel_name").html(rel_name);
            insertDatatable(mapDB[rel_name], rel_name);
        });
    }
}
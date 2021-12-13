var request = require('request');
require('dotenv').config();
var http = require('http');

var Stream = require('stream');
const fs = require('fs')
var bodyParser = require('body-parser');

var multer = require('multer');
var upload = multer();


var dcapBaseUrl = process.env.dcapBaseUrl
var dcapBasePort = process.env.dcapBasePort

var DOMParser = require('xmldom').DOMParser;


module.exports = {


     setDatacapWtm: function(baseURL, port){
       dcapBaseUrl=baseURL
       dcapBasePort = port
     },
     convertToText: function(xml){
       return new Promise((resolve, reject) => {
          var xmlDoc = new DOMParser().parseFromString(xml,"text/xml");

            var fields = xmlDoc.getElementsByTagName("F");
            var fieldValues = [];

            for(var y=0;y<fields.length;y++){

                var field = fields.item(y);
                var fieldName = field.getAttribute("id");

                var characterVals = field.getElementsByTagName("C")
                var fieldValue = "";
                //console.log(characterVals.childNodes);
                for(var x=0;x<characterVals.length;x++){

                    var characterVal = characterVals.item(x);
                    fieldValue = fieldValue + String.fromCharCode(characterVal.firstChild)

                }
                console.log("*****************************");
                console.log("FieldValue : ", fieldValue);
                if(fieldValue!=""){
                    var fieldObj = { fieldName : fieldName,  fieldValue: fieldValue};
                    fieldValues.push(fieldObj);
                }
            }
            resolve(fieldValues);
          })
    },



    fetchDataFilePipe: function(transId,ext,res){
      console.log(ext)
        var urlAction = "http://" +dcapBaseUrl + ":" + dcapBasePort + "/wtm/servicewtm.svc/Transaction/GetFile/" + transId + "/tm000001/" + ext;

        console.log(urlAction);
        return request.get({url: urlAction}).pipe(res);
    },

    fetchDataFile: function(transId,ext,docid){
      return new Promise((resolve, reject) => {
        console.log(ext)
        var urlAction = "http://" +dcapBaseUrl + ":" + dcapBasePort + "/wtm/servicewtm.svc/Transaction/GetFile/" + transId + "/"+ docid +"/" + ext;

        console.log(urlAction);
         request.get({url: urlAction}, function(err,httpResponse,body){
           if(err){
               reject(err)
           }

            //console.log(httpResponse);
            //res.send();
            //res.send("Success");
            resolve(body)

        });
      })
    },

    executeRules: function(transId,application,workflow,rules) {
      return new Promise((resolve, reject) => {


        //Configure the batch file
          var message = JSON.stringify({
            "TransactionId": transId,
            "Application": application,
            "Workflow": workflow,
            "PageFile":"Scan.xml",
            "Rulesets": rules
           });


       //Configure the endpoint
       var urlRest = "http://" +dcapBaseUrl + ':' + dcapBasePort + '/wtm/servicewtm.svc/Transaction/Execute'
       //console.log(urlRest);
        //console.log(message);
       //console.log(message);
       var formData = {data: message}
       console.log(formData);
//res.write("Executing rules");

       //Do the post
       var headers = {"Accept":"application/json","Content-Type":"text/json; charset=utf-8"};
       request.post({url:urlRest, body:message, headers: headers}, function (err, httpResponse, body) {
           if (err) {
               reject(err)
           }else{
               resolve("done")
           }
           });
         });
       },


    uploadDocumentForProcessing:  function(transId,files){
      return new Promise((resolve, reject) => {
        var formData = {data: files.data};
        //console.log(files);
        var origFile = files.name;
        var ext = origFile.substr(origFile.lastIndexOf('.') + 1);

        //Configure the endpoint
        var urlRest = "http://" +dcapBaseUrl + ':' + dcapBasePort + '/wtm/servicewtm.svc/Transaction/SetFile/'+ transId +'/tm000001/' + ext
        //console.log(urlRest);

        //res.write("Sending documents");


        //Do the post
        request.post({url:urlRest, formData: formData}, function (err, httpResponse, body) {
          if (err) {
            reject(err)
          }else{
            resolve("done")
          }
        });
      })
    },

    beginDataCapTransaction: function(){

        return new Promise((resolve, reject) => {
          console.log(dcapBasePort)
          var transID = "";

          var options = {
              host: dcapBaseUrl,
              path: '/wTM/ServicewTM.svc/Transaction/Start',
              headers: {'Accept' : "application/json"},
              method: 'GET',
              port : dcapBasePort

          }
        //  console.log(options)
          var reqPost = http.request(options, function (response) {
              response.setEncoding('utf8');
              response.on('data', function (data) {

                  data =data.replace("\"","")
                  data =data.replace("\"","")

                  resolve(data)

              });
              response.on('error', function (err) {
                  console.log(err);
                  reject(err)
              });

          }).end();



        })
    },
    UploadPageFile:  function(transId){
      console.log("upload page file")
        //Configure the batch file
      //  var fieldsConfig =  "<F id=\"Address\"><V n=\"y_predefinedProfile\">TextExtraction_Speed</V><V n=\"TYPE\">Address</V><V n=\"STATUS\">0</V></F>";
      return new Promise((resolve, reject) => {
        var xml="<?xml-stylesheet type=\"text/xsl\" href=\"..\..\dco.xsl\"?><P id=\"TM000001\"> \
        <V n=\"hr_RecogEngine\">OCR/SR</V><V n=\"hr_CheckCountry\">UK</V></P>"

        //Configure the endpoint
        var urlRest = "http://" +dcapBaseUrl + ':' + dcapBasePort + '/wtm/servicewtm.svc/Transaction/SetFile/'+ transId +'/tm000001/xml'
        //console.log(urlRest);
        var formData = {data: xml}
        //res.write("Sending Page Configuration");
        //Do the post
        console.log("Doing Page stuff")
        request.post({url:urlRest, formData: formData}, function (err, httpResponse, body) {
        if (err) {
          //console.log(err);
            reject(err)
        }else{
        //  console.log(body);
          resolve(body);
        }
        });
      });
    },
    uploadBatchFile: function(transId,file,docType) {
      return new Promise((resolve, reject) => {
        console.log("doing Batcg stuff")

        var origFile = file.name;
        console.log(origFile);
        var ext = origFile.substr(origFile.lastIndexOf('.') + 1);
        console.log("Docuemnt type: ", docType);
        //Configure the batch file
        var xml = "<B id=\"Transaction\"><V n=\"TYPE\">Transaction</V><P id=\"TM000001\"><V n=\"TYPE\">"+ docType + "</V>";
        xml +="<V n=\"IMAGEFILE\">tm000001."+ext+"</V><V n=\"DATAFILE\">tm000001.xml</V><V n=\"STATUS\">0</V></P></B>";

        //Configure the endpoint
        var urlRest = "http://" +dcapBaseUrl + ':' + dcapBasePort + '/wtm/servicewtm.svc/Transaction/SetFile/'+ transId +'/scan/xml'
        console.log(urlRest);
        var formData = {data: xml}
//res.write("Sending Batch Configuration");
        //Do the post
        request.post({url:urlRest, formData: formData}, function (err, httpResponse, body) {
            if (err) {
              console.log(err);
                resolve(err)
            }
              resolve(body)
            });
        });
      }
}

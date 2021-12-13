var express = require('express');
var path = require('path');
var swaggerJSDoc = require('swagger-jsdoc');
var swaggerUI = require('swagger-ui-express');
var api = require('./api.js')
const multer = require('multer');
var bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');


var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  }));

app.listen(8080, ()=>console.log("listening on 8080"));

const swaggerOptions = {
    swaggerDefinition:{
        swagger: "2.0",
        info:{
            title: 'DataCap API',
            version: '1.0.0'
        }
    },
    url: "/api-docs/swagger.json",
    apis:['app.js']
    
}

var swaggerDocs = swaggerJSDoc(swaggerOptions);
app.get("/api-docs/swagger.json", (req, res) => res.json(swaggerDocs));

//app.use('/api-docs', swaggerUI.serveFiles(null, swaggerDocs), swaggerUI.setup(null, swaggerDocs));

app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocs))

/** 
 * @swagger 
 * /datacap: 
 *   post: 
 *     description: Create a datacap Operation 
 *     parameters: 
 *     - name: uploadFile 
 *       description: Add a document
 *       in: formData 
 *       required: true 
 *       type: file 
 *     - name: rules 
 *       description: Rules to execute
 *       in: formData 
 *       required: true 
 *       type: string 
 *     - name: pageType 
 *       description: Page type IN datacap
 *       in: formData 
 *       required: true 
 *       type: string 
 *     - name: application 
 *       description: DataCap Application to use
 *       in: formData 
 *       required: true 
 *       type: string 
 *     - name: ext 
 *       description: DataCap file extension to fetch
 *       in: formData 
 *       required: true 
 *       type: string 
 *     - name: workflow 
 *       description: DataCap workflow
 *       in: formData 
 *       required: true 
 *       type: string 
 *     - name: docid 
 *       description: DataCap page id to fetch, in case of conversion
 *       in: formData 
 *       required: true 
 *       type: string 
 *     responses:  
 *       201: 
 *         description: Created  
 *       400:
 *          description: Error
 *   
 */  
 app.post('/datacap',(req,res)=>{  

    //api.uploadFile()

   

    let fileToProcess = req.files.uploadFile
    let rules = req.body.rules
    let workflow = req.body.workflow
    let application = req.body.application
    let ext = req.body.ext
    let pageType = req.body.pageType
    let docId = req.body.docId

    api.uploadFile(fileToProcess,rules,workflow, application,ext,pageType,docId).then(data=> {
        res.send(data);
        res.status(201).send(); 
    })
    .catch(err => {
        res.send(err);
        res.status(400).send();
    })
   
 });  


/** 
 * @swagger 
 * /datacapUploadAndPrepare: 
 *   post: 
 *     description: Prepare a DataCap Operation
 *     parameters: 
 *     - name: uploadFile 
 *       description: Add a document
 *       in: formData 
 *       required: true 
 *       type: file 
 *     - name: rules 
 *       description: Rules to execute
 *       in: formData 
 *       required: true 
 *       type: string 
 *     - name: pageType 
 *       description: Page type IN datacap
 *       in: formData 
 *       required: true 
 *       type: string 
 *     - name: application 
 *       description: DataCap Application to use
 *       in: formData 
 *       required: true 
 *       type: string 
 *     - name: ext 
 *       description: DataCap file extension to fetch
 *       in: formData 
 *       required: true 
 *       type: string 
 *     - name: workflow 
 *       description: DataCap workflow
 *       in: formData 
 *       required: true 
 *       type: string 
 *     - name: docid 
 *       description: DataCap page id to fetch, in case of conversion
 *       in: formData 
 *       required: true 
 *       type: string 
 *     responses:  
 *       201: 
 *         description: Created  
 *       400:
 *          description: Error
 *   
 */  
 app.post('/datacapUploadAndPrepare',(req,res)=>{  

    //api.uploadFile()

   

    let fileToProcess = req.files.uploadFile
    let rules = req.body.rules
    let workflow = req.body.workflow
    let application = req.body.application
    let ext = req.body.ext
    let pageType = req.body.pageType
    let docId = req.body.docId

    api.uploadFileAndPrepare(fileToProcess,rules,workflow, application,ext,pageType,docId).then(data=> {
        res.send(data);
        res.status(201).send(); 
    })
    .catch(err => {
        res.send(err);
        res.status(400).send();
    })    
   
 }); 


 /** 
 * @swagger 
 * /datacapExecuteRules: 
 *   post: 
 *     description: Prepare a DataCap Operation
 *     parameters: 
 *     - name: TransactionId 
 *       description: DataCap Transaction ID
 *       in: formData 
 *       required: true 
 *       type: string 
 *     - name: rules 
 *       description: Rules to execute
 *       in: formData 
 *       required: true 
 *       type: string 
 *     - name: application 
 *       description: DataCap Application to use
 *       in: formData 
 *       required: true 
 *       type: string 
 *     - name: ext 
 *       description: DataCap file extension to fetch
 *       in: formData 
 *       required: true 
 *       type: string 
 *     - name: workflow 
 *       description: DataCap workflow
 *       in: formData 
 *       required: true 
 *       type: string 
 *     - name: docid 
 *       description: DataCap page id to fetch, in case of conversion
 *       in: formData 
 *       required: true 
 *       type: string 
 *     responses:  
 *       201: 
 *         description: Created  
 *       400:
 *          description: Error
 */  
  app.post('/datacapExecuteRules',(req,res)=>{  

    //api.uploadFile()

   

    let transId = req.body.TransactionId
    let rules = req.body.rules
    let workflow = req.body.workflow
    let application = req.body.application
    let ext = req.body.ext
    let pageType = req.body.pageType
    let docId = req.body.docid

    api.datacapExecuteRules(transId,rules,workflow, application,ext,docId).then(data=> {
        res.send(data);
        res.status(201).send(); 
    })
    .catch(err => {
        res.send(err);
        res.status(400).send();
    })
   
 }); 


module.exports = app;

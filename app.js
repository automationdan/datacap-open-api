var express = require('express');
var path = require('path');
var swaggerJSDoc = require('swagger-jsdoc');
var swaggerUI = require('swagger-ui-express');
var api = require('./api.js')
const multer = require('multer');
var bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const FormData = require('form-data');
const { v4: uuidv4 } = require('uuid');
var app = express();

app.use(bodyParser.json({limit: '50mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  }));

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
 *       type: string 
 *     - name: rules 
 *       description: Rules to execute
 *       in: formData 
 *       required: true 
 *       type: string 
 *     - name: server 
 *       description: DataCap server
 *       in: formData 
 *       required: true 
 *       type: string 
 *     - name: port 
 *       description: DataCap port
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

   

    let fileToProcess = req.file.uploadFile
    let rules = req.body.rules
    let server = req.body.server
    let port = req.body.port
    let workflow = req.body.workflow
    let application = req.body.application
    let ext = req.body.ext
    let pageType = req.body.pageType
    let docId = req.body.docId



    api.uploadFile(fileToProcess,rules,workflow, application,ext,pageType,docId,server,port).then(data=> {
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
 * /datacapUploadAndPrepareBase64: 
 *   post: 
 *     description: Prepare a DataCap Operation with Base64
 *     parameters: 
 *     - name: uploadFile 
 *       description: Add a document in base64
 *       in: formData 
 *       required: true 
 *       type: string   
 *     - name: server
 *       description: DataCap server
 *       in: formData 
 *       required: true 
 *       type: string 
 *     - name: port 
 *       description: DataCap port
 *       in: formData 
 *       required: true 
 *       type: string 
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
 *       200: 
 *         description: Created
 *         schema:
 *          type: object
 *          properties:
 *              transactionId: 
 *                  type: string
 *       400:
 *          description: Error
 *   
 */  
 app.post('/datacapUploadAndPrepareBase64',(req,res)=>{  

    //api.uploadFile()

   

    let fileToProcess = req.body.uploadFile
    let rules = req.body.rules
    let workflow = req.body.workflow
    let application = req.body.application
    let ext = req.body.ext
    let pageType = req.body.pageType
    let docId = req.body.docId
    let fileData = {};
    let server = req.body.server
    let port = req.body.port
   
    var bufferValue = Buffer.from(fileToProcess,"base64");
    let form = {
        fileData: {
            value: bufferValue,
            filename: "TM000001.pdf",
        },
        fileName: "TM000001.pdf",
        myId: "tm000001.pdf"
      }
    
    api.uploadFileAndPrepareBase64(bufferValue,rules,workflow, application,ext,pageType,docId,server,port).then(data=> {
        res.send({transactionId: data});
        res.status(200).send(); 
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
 *     - name: server
 *       description: DataCap server
 *       in: formData 
 *       required: true 
 *       type: string 
 *     - name: port 
 *       description: DataCap port
 *       in: formData 
 *       required: true 
 *       type: string 
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
 *       200: 
 *         description: Created
 *         schema:
 *          type: object
 *          properties:
 *              transactionId: 
 *                  type: string
 *       400:
 *          description: Error
 *   
 */  
 app.post('/datacapUploadAndPrepare',(req,res)=>{  
    let fileToProcess = req.files.uploadFile
    let rules = req.body.rules
    let workflow = req.body.workflow
    let application = req.body.application
    let ext = req.body.ext
    let pageType = req.body.pageType
    let docId = req.body.docId
    let server = req.body.server
    let port = req.body.port

    api.uploadFileAndPrepare(fileToProcess,rules,workflow, application,ext,pageType,docId,server,port).then(data=> {
        res.send({transactionId: data});
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
 *     - name: server
 *       description: DataCap server
 *       in: formData 
 *       required: true 
 *       type: string 
 *     - name: port 
 *       description: DataCap port
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
 *       200: 
 *         description: Created
 *         schema:
 *          type: object
 *          properties:
 *              transactionId: 
 *                  type: string
 *              values:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          FieldName:
 *                              type: string
 *                          FieldValue:
 *                              type: string
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
    let server = req.body.server
    let port = req.body.port

    api.datacapExecuteRules(transId,rules,workflow, application,ext,docId,server,port).then(data=> {
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
 * /doTSStuff: 
 *   post: 
 *     description: Prepare a TS Operation
 *     parameters: 
 *     - name: uploads 
 *       description: DataCap Transaction ID
 *       in: formData 
 *       required: true 
 *       type: file 
 *     responses:  
 *       200: 
 *         description: Created
 *         content:
 *          text/plain:
 *              schema:
 *                  type: string
 *          
 *       400:
 *          description: Error
 */  
 app.post('/doTSStuff',(req,res)=>{  

    let fileToProcess = req.files.uploads
    uploadPath = __dirname + '/tmp/' + uuidv4() + ".pdf";
 
    fileToProcess.mv(uploadPath)
    console.log("it did it");
    api.doTSStuff(uploadPath).then(data=> {
        console.log("I am here")
        //res.send(data);
        res.status(201).send(data); 
        console.log("We sent it")
    })
    .catch(err => {
        res.send(err);
        res.status(400).send();
    })
  
 }); 


module.exports = app;

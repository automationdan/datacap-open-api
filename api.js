var datacap = require('./api/datacap');

module.exports  = {
    
    convertToFile: function(base64){
      return "";
    },
    uploadFile: function(fileToProcess,rules,workflow, application,ext,pageType,docId){
        console.log(rules);
        console.log(workflow);
        console.log(application);
        console.log(pageType);
        console.log(docId);
        console.log(ext);
        return new Promise((resolve, reject) => {
            datacap.beginDataCapTransaction()
                .then(data => {
                    transId = data;
                    console.log("About to start batch")
                    datacap.uploadBatchFile(transId,fileToProcess,pageType)
                    .then(data => {
                      datacap.UploadPageFile(transId)
                      .then(data =>{
                        datacap.uploadDocumentForProcessing(transId,fileToProcess)
                        .then(data =>{
                            datacap.executeRules(transId,application,workflow,rules).then(data=>{
                                datacap.fetchDataFile(transId,ext,docId).then(data=>{
                                  datacap.convertToText(data).then(data =>{
                                    //let obj = JSON.parse(data);
                                    rtnValue = {"transactionalId": transId, values: data}
                                    resolve(rtnValue)
                                  })
                                  .catch(err => {reject("Convert Text" + err)})
              
                                })
                                .catch(err => {reject("Fetch file" + err)})
                            })
                            .catch(err => {reject("execute Rules" + err)})
                        })
                        .catch(err => {reject("up file" + err)})
              
                      })
                      .catch(err => {reject("error in page" + err)})
                    })
                    .catch(err => {reject("error in batch")})
                  })
                  .catch(() => {
                    console.error('Begin transaction');
                  })
            })
        },

        uploadFileAndPrepare: function(fileToProcess,rules,workflow, application,ext,pageType,docId){
            console.log(rules);
            console.log(workflow);
            console.log(application);
            console.log(pageType);
            console.log(docId);
            console.log(ext);
            console.log("file " + fileToProcess);
            return new Promise((resolve, reject) => {
                datacap.beginDataCapTransaction()
                    .then(data => {
                        transId = data;
                        console.log("About to start batch")
                        console.log(transId);
                        datacap.uploadBatchFile(transId,fileToProcess,pageType)
                        .then(data => {
                          datacap.UploadPageFile(transId)
                          .then(data =>{
                            datacap.uploadDocumentForProcessing(transId,fileToProcess)
                            .then(data =>{
                                resolve(transId);
                            })
                            .catch(err => {reject("up file" + err)})
                  
                          })
                          .catch(err => {reject("error in page" + err)})
                        })
                        .catch(err => {reject("error in batch")})
                      })
                      .catch(() => {
                        console.error('Begin transaction');
                      })
                })
            },
            uploadFileAndPrepareBase64: function(fileToProcess,rules,workflow, application,ext,pageType,docId){
              console.log(rules);
              console.log(workflow);
              console.log(application);
              console.log(pageType);
              console.log(docId);
              console.log(ext);
              console.log("file " + fileToProcess);
              return new Promise((resolve, reject) => {
                datacap.beginDataCapTransaction()
                  .then(data => {
                    transId = data;
                    console.log("About to start batch")
                    console.log(transId);
                   
                    datacap.uploadBatchFileBase64(transId,fileToProcess,pageType,"pdf")
                    .then(data => {
                      datacap.UploadPageFile(transId)
                      .then(data =>{
                        console.log("starting doc upload")
                        datacap.uploadDocumentForProcessingBase64(transId,fileToProcess,"pdf")
                        .then(data =>{
                            console.log("did something");
                            resolve(transId);
                        })
                        .catch(err => {reject("up file" + err)})
              
                      })
                      .catch(err => {reject("error in page" + err)})
                    })
                    .catch(err => {reject("error in batch")})
                  })
                  .catch(() => {
                    console.error('Begin transaction Batch');
                  })
                })
                  
              },

            datacapExecuteRules: function(transId,rules,workflow, application,ext,docId){
                console.log(rules);
                console.log(workflow);
                console.log(application);
                console.log(docId);
                console.log(ext);
                return new Promise((resolve, reject) => {
                    datacap.executeRules(transId,application,workflow,rules).then(data=>{
                        datacap.fetchDataFile(transId,ext,docId).then(data=>{
                          datacap.convertToText(data).then(data =>{
                            //let obj = JSON.parse(data);
                            rtnValue = {"transactionalId": transId, values: data}
                            resolve(rtnValue)
                          })
                          .catch(err => {reject("Convert Text" + err)})
      
                        })
                        .catch(err => {reject("fetch file" + err)})
                    })
                    .catch(err => {reject("Execute Rules" + err)})
                })
                
            }
        
    }

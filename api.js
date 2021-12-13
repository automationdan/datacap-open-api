var datacap = require('./api/datacap');

module.exports  = {
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

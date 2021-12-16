var request = require('request');
require('dotenv').config();
var http = require('http');
var axios = require('axios');
var Stream = require('stream');
const fs = require('fs')
var bodyParser = require('body-parser');
const Tesseract= require('tesseract.js');
var multer = require('multer');
var upload = multer();
var pdf = require("pdf-page-counter");
var { fromPath } = require("pdf2pic");

var path = require('path');
const { Poppler } = require("node-poppler");
const poppler = new Poppler("/usr/local/bin/");
const PSM = require('tesseract.js/src/constants/PSM.js')
const { createWorker } = require('tesseract.js')

const worker = createWorker();

module.exports = {
    doTSStuff: function(file){
        //index.js file
        return new Promise((resolve, reject) => {
            console.log(file)
            const options = {
                firstPageToConvert: 1,
                lastPageToConvert: 1,
                pngFile: true,
              
            };
            
            var filenameTodelete = file.split("/");
            let fname = filenameTodelete[filenameTodelete.length-1];
            let filename = fname.split(".");
            fname =filename[0];
            console.log(filenameTodelete.length)
            console.log(fname);
            const outputFile = `tmp/` + fname;
            poppler.pdfToCairo(file, outputFile, options).then((data) => {
                fs.unlink(file, function(err) {
                    worker.load().then(function(data)
                    {
                        worker.loadLanguage('eng').then(function(data){
                            worker.initialize('eng').then(function(data){
                                worker.setParameters({
                                    tessedit_pageseg_mode: PSM.PSM_AUTO_OSD,
                                }).then(function(data){
                                    worker.recognize("tmp/"+ fname +"-1.png")
                                        .then(function(data){
                                            console.log("Hello World " + data)
                                            resolve(data);
                                            //progressUpdate({ status: 'done', data: data })
                                            fs.unlink("tmp/"+ fname +"-1.png",function(err) {
                                            
                                            
                                        })
                                    })    
                                })
                            })
                        })
                    });
                  
                })
            })
            .catch(err => {
                console.log(err);
            })    
        })
    }
}
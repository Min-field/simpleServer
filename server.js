#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const http = require('http');
const mime = require('mime');

// cache files
// console.log(mime.lookup);
const cache = {}; 

function serveStatic(absPath, res){
    if(cache[absPath])
        sendFile(res, cache[absPath], absPath);
    else {
        fs.exists(absPath, (exist) => {
            if(exist){
                fs.readFile(absPath, (err, data) => {
                    if(err)
                        send404(res);
                    else {
                        sendFile(res, data, absPath); 
                        cache[absPath] = data; 
                    }
                })
            } else {
                send404(res);
            }
        });
    }
}

function send404(res){
    res.writeHead(404, {
        'Content-type': 'text/plain'
    });
    res.write('Error: 404 not found');
    res.end();
}

function sendFile(res, data, absPath){
    res.writeHead(200, {
        'Content-type': mime.getType(path.basename(absPath))
    })
    res.end(data);
}

http.createServer((req, res) => {
    let url = req.url, 
        filePath; 
    if(url === '/'){
        filePath = '/public/index.html';
    } else {
        filePath = './' + req.url;  
    }
    serveStatic(path.resolve(__dirname, filePath), res);
}).listen(3000, () => {
    console.log('server listen in localhost:3000');
});
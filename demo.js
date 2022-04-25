'use strict' 
const https = require('https'); 
const fs = require('fs'); 
const ws = require('ws'); 

const options = { 
    key: fs.readFileSync('./src/httpskey/www.yuangauss287.top.key'), 
    cert: fs.readFileSync('./src/httpskey/www.yuangauss287.top.pem') 
}; 

const index = fs.readFileSync('./index.html'); 

let server = https.createServer(options, (req, res) => { 
    res.writeHead(200); 
    res.end(index); 
}); 
server.addListener('upgrade', (req, res, head) => console.log('UPGRADE:', req.url)); 
server.on('error', (err) => console.error(err)); 
server.listen(8000,() => console.log('Https running on port 8000')); 

const wss = new ws.Server({server, path: '/echo'}); 
wss.on('connection', function connection(ws) { 
    ws.send('Hello'); 
    ws.on('message', (data) => ws.send('Receive: ' + data)); 
}); 
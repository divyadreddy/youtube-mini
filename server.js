const http = require('http');
const app = require('./app');

const port = 3000;

const server = http.createServer(app); //app is the request listener

server.listen(port);

//imports express
var express = require('express');
var bodyParser = require('body-parser');
var apiRouter = require('./apiRouter').router;

const port = 3000;
// Instanciate server
var server = express();

// Body Parser Conf
// Body Parser configuration
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// Configure routes
server.get('/', function (req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send('<h1>Bonjour sur mon super server</h1>');
});

server.use('/api/', apiRouter);

// Launch server
server.listen(port, function() {
    console.log('Server en écoute port: ' + port );
});

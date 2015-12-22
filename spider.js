var net = require('net');

var baseport = 3000;
var ports = [];

(function getPort(port){
    var server = net.createServer();
    server.listen(port, function(){
        server.once('close', function(){
            ports.push(port);
            if (ports.length >= 2){
                require('./server/app.js')(ports);
            } else {
                getPort(port + 1);
            }
        })
        server.close();
    });
})(baseport)
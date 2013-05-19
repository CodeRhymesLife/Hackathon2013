var sys = require("sys");
var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: 4502 });

var clients = [];
wss.on('connection', function (ws) {
    sys.debug("connected to client");
    clients.push(ws);

    ws.on('message', function (message) {
        sys.debug("recieved data");
        console.log('received message: %s', message);

        // handle incoming data
        // send data to ALL clients whenever ANY client send up data
        for (var i = 0 ; i < clients.length ; i++) {
            clients[i].send(message);
        }
    });

    ws.on("close", function () {
        debugger;
        // emitted when server or client closes connection
        sys.debug("close");
    });

    ws.send('something');
});

var connect = require('connect');
connect.createServer(
    connect.static(__dirname)
).listen(8080);
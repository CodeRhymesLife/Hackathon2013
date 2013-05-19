var sys = require("sys");
var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: 4502 });

var clients = {};
var clientIDCounter = 0;
function sendToClients(msg) {
    for (key in clients) {
        try{
            clients[key].send(msg);
        } catch (e) {
            sys.debug("Failed to send message to client " + key + ". Removing from colleciton");
            delete clients[key];
        }
    }
}

wss.on('connection', function (ws) {
    debugger;
    ws.id = clientIDCounter++;
    sys.debug("connected to client " + ws.id);

    // remember the client by associating the socket.id with the socket
    clients[ws.id] = ws;

    ws.on('message', function (message) {
        sys.debug("recieved data");
        console.log('received message: %s', message);

        // handle incoming data
        // send data to ALL clients whenever ANY client send up data
        sendToClients(message);
    });

    ws.on("close", function () {
        debugger;

        sys.debug("Removing client " + ws.id);
        delete clients[ws.id];

        // emitted when server or client closes connection
        sys.debug("close");
    });
});

sys.debug("Running image listener at 4502");




var connect = require('connect');
connect.createServer(
    connect.static(__dirname)
).listen(4580);

sys.debug("Running test listener at 4580");





var express = require("express");

var app = express();

// Config
app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/stop', function (req, res) {
    sendToClients("stop");

    return res.send();
});

app.post('/image', function (req, res) {
    debugger;
    var product;
    
    // handle incoming data
    // send data to ALL clients whenever ANY client send up data
    var imageData = req.body;
    sendToClients(imageData.img);

    return res.send();
});

// Launch server

app.listen(4242);
sys.debug("Running image receiver at 4242");
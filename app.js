const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const url = require("url");
const bodyParser = require('body-parser');
// Uses a Body parser that is old pakages
app.use(bodyParser());

var clientResponseRef;
app.get('/*', (req, res) => {
    var pathname = url.parse(req.url).pathname;

    var obj = {
        pathname: pathname,
        method: "get",
        params: req.query
    }

    io.emit("page-request", obj);
    clientResponseRef = res;
})

app.post('/*', (req, res) => {
    var pathname = url.parse(req.url).pathname;

    var obj = {
        pathname: pathname,
        method: "post",
        params: req.body
    }

    io.emit("page-request", obj);
    clientResponseRef = res;
})

io.on('connection', (socket) => {
    console.log('a node connected');
    socket.on("page-response", (response) => {
        clientResponseRef.send(response);
    })
})

var server_port = 5000;
http.listen(server_port, () => {
    console.log('listening on *:' + server_port);
})
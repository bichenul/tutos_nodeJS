var http = require('http');
var fs = require('fs');

// Chargement du fichier index.html affich� au client
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket, pseudo) {
    // Quand un client se connecte, on lui envoie un message
    socket.emit('message', 'Vous �tes bien connect� !');
    // On signale aux autres clients qu'il y a un nouveau venu
    socket.broadcast.emit('message', 'Un autre client vient de se connecter ! ');

    // D�s qu'on nous donne un pseudo, on le stocke en variable de session
    socket.on('petit_nouveau', function(pseudo) {
        socket.pseudo = pseudo;
    });

    // D�s qu'on re�oit un "message" (clic sur le bouton), on le note dans la console
    socket.on('message', function (message) {
        // On r�cup�re le pseudo de celui qui a cliqu� dans les variables de session
        console.log(socket.pseudo + ' me parle ! Il me dit : ' + message);
    }); 
});


server.listen(8080);
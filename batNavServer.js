var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

function Jogador(id, nome, client, navio1, navio2, navio3) {
    this.id = id;
    this.nome = nome;
    this.client = client;
    this.navio1 = navio1;
    this.navio2 = navio2;
    this.navio3 = navio3;
    this.oponente = null;
}

var clientes = {};
var fila = null;

//definindo a rota raiz
app.get('/', function (req, res) {
    res.send('Servidor está no ar.');
});

//SocketIO vem aqui
io.on("connection", function (client) {
    client.on("join", function (player_name, navio1, navio2, navio3) {

        console.log("Joined: " + player_name);

        let id = client.id;

        clientes[id] = new Jogador(id, player_name, client, navio1, navio2, navio3);
        let jogadorAtual = clientes[id]

        if (fila == null)
            fila = jogadorAtual;
        else {
            fila.oponente = jogadorAtual;
            jogadorAtual.oponente = fila;
            fila = null;

            jogadorAtual.client.emit("update", "Você não está sozinho. Aguarde a jogadao do oponente!", player_name);// servidor respondendo
            jogadorAtual.oponente.client.emit("update", "Você já pode iniciar a partida")
        }
    })

    client.on("send", function (palpite) {
        let jogadorAtual = clientes[client.id];
        let oponente = jogadorAtual.oponente;

        if (palpite === oponente.navio1) {
            oponente.navio1 = null;
            jogadorAtual.client.emit("acertou", "Você acertou!");
            oponente.client.emit("oponente_acertou", "Oponente Acertou!");
        } else if (palpite === oponente.navio2) {
            oponente.navio2 = null;
            jogadorAtual.client.emit("acertou", "Você acertou!");
            oponente.client.emit("oponente_acertou", "Oponente Acertou!");
        } else if (palpite === oponente.navio3) {
            oponente.navio3 = null;
            jogadorAtual.client.emit("acertou", "Você acertou!");
            oponente.client.emit("oponente_acertou", "Oponente Acertou!");
        } else {
            jogadorAtual.client.emit("errou", "Você chutou na água!");
            oponente.client.emit("oponente_errou", "Oponente Chutou na água");
        }

        if (oponente.navio1 === null && oponente.navio2 == null && oponente.navio3 === null) {
            jogadorAtual.client.emit("fim", "You Win!")
            oponente.client.emit("fim", "You Loose!");
        }
    });

    client.on("disconnect", function () {
        console.log("Disconnect");
        io.emit("update", clientes[client.id] + " has left the server.");
        delete clientes[client.id];
    });
});

http.listen(3000, function () {
    console.log('listening on port 3000');
});



function start() {

}

// https://tableless.com.br/criando-uma-aplicacao-de-chat-simples-com-nodejs-e-socket-io/
// https://github.com/dericeira/Simple-Chat-Socket.io/blob/master/app.js
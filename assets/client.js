let socket;
let ready;
let player = {};
let navio1, navio2, navio3;

// setNavios();

function inicia() {
    socket = io.connect("http://localhost:3000");
    ready = false;

    socket.on("update", function (msg) {
        if (ready) {
            $('#navios').append('<li>' + msg + '</li>');
        }
    });

    socket.on("acertou", function(msg){
        $('#acertou').html(msg);
    });

    socket.on("oponente_acertou", function(msg){
        $('#acertou').html(msg);
    });

    socket.on("errou", function(msg){
        $('#acertou').html(msg);
    });

    socket.on("oponente_errou", function(msg){
        $('#acertou').html(msg);
    });
    
    
}

function cadastraPlayer(txtName) {

    let player_name = document.getElementById(txtName).value;
    document.getElementById("nick").style.display = 'none';
    document.getElementById("navios").style.display = 'block';

    ready = true;
    defineNavios(player_name);
    socket.emit("join", player.nome, player.nav1,player.nav2,player.nav3);//, navio1, navio2. navio3);

}


function enviaPalpite(elemento) {
    let palpite = document.getElementById(elemento).value;
    socket.emit("send", palpite);
}




function getNumber0_9() {
    return Math.floor((Math.random() * 10));
}

function setNavios() {
    const n = getNumber0_9();
    if (n <= 4) {
        navio1 = n + 5;
        navio2 = n + 2;
        navio3 = n;
    } else {
        navio1 = n - 5;
        navio2 = n - 2;
        navio3 = n;
    }
    navio1 += getNumber0_9().toString();
    navio2 += getNumber0_9().toString();
    navio3 += getNumber0_9().toString();
    
    // console.log("nav1: " + navio1);
    // console.log("nav2: " + navio2);
    // console.log("nav3: " + navio3);
}

function defineNavios(player_name) {

    setNavios();

    player.nome = player_name;
    player.nav1 = navio1;
    player.nav2 = navio2;
    player.nav3 = navio3;

    let i, j;

    for (i = 0; i < 10; i++) {
        for (j = 0; j < 10; j++) {
            let p = i.toString().concat(j.toString());
            if (p == player.nav1) {
                $("#navios").append("<button style=\"color:blue;\">" + player.nav1 + "</button>");
            }
            else if (p == player.nav2) {
                $("#navios").append("<button style=\"color:blue;\">" + player.nav2 + "</button>");
            }
            else if (p == player.nav3) {
                $("#navios").append("<button style=\"color:blue;\">" + player.nav3 + "</button>");
            }
            else {
                $("#navios").append("<button >" + p + "</button>");
            }
        }
        $("#navios").append("<br/>");
    }
}

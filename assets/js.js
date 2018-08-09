$(document).ready(function () {
	var socket = io.connect("http://localhost:3000");
	var ready = false;
	
	let player = {};

	$("#submit").submit(function (e) {
		e.preventDefault();
		$("#nick").fadeOut();
		$("#chat").fadeIn();

		let name = $("#nickname").val();
		let nav1 = $("#navio1x").val().concat($("#navio1y").val());
		let nav2 = $("#navio2x").val().concat($("#navio2y").val());
		let nav3 = $("#navio3x").val().concat($("#navio3y").val());
		
		player.nome = name;
		player.nav1 = nav1;
		player.nav2 = nav2;
		player.nav3 = nav3;

		var time = new Date();
		$("#name").html(player.nome);
		$("#time").html('First login: ' + time.getHours() + ':' + time.getMinutes());

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
		};

		ready = true;
		socket.emit("join", player);
	});

	$("#textarea").keypress(function (e) {
		//Aqui é onde serão lançados os palpites
		if (e.which == 13) {
			var text = $("#textarea").val();

			let p = $('#cbInyme').options[$('#cbInyme').selectedIndex].text;

			$("#textarea").val('');
			var time = new Date();
			$(".chat").append('<li class="self"><div class="msg"><span>' + $("#nickname").val() + ':</span><p>' + text + '</p><time>' + time.getHours() + ':' + time.getMinutes() + '</time></div></li>');
			socket.emit("send", p, text);
		}
	});


	socket.on("update", function (msg, players) {
		if (ready) {
			$('.chat').append('<li class="info">' +msg + '</li>');
			$("#cbInyme").empty();
			for(player in players){
				$('#cbInyme').append('<option>'+players[player].nome+'</option>');
			}
		}
	});

	socket.on("list", function (players) {
		if(ready){
			$("#cbInyme").empty();
			for(player in players){
				$('#cbInyme').append('<option>'+players[player].nome+'</option>');
			}
		}
	});

	socket.on("chat", function (client, msg) {
		if (ready) {
			var time = new Date();
			$(".chat").append('<li class="other"><div class="msg"><span>' + client + ':</span><p>' + msg + '</p><time>' + time.getHours() + ':' + time.getMinutes() + '</time></div></li>');
		}
	});
});


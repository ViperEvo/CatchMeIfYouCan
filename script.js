// Initialize and add the map
var lokacja;
var map;
var marker;
var marker2;
let wysokosc;
let dlugosc;
let kod = "KOD";
function initMap() {
    // The location of Krakow
    lokacja = {lat: 50, lng: 20};
    // The map, centered at Krakow
    map = new google.maps.Map(
        document.getElementById('map'), {zoom: 4, center: lokacja});
    // The marker, positioned at Krakow
    marker = new google.maps.Marker({position: lokacja, map: map});
    marker2 = new google.maps.Marker({position: lokacja, map: map});

        wysokosc = 0;
        dlugosc = 0;
        document.body.addEventListener('keypress', (e)=>{
          
        switch (e.charCode){
              //w
            case 119:
            {
                wysokosc += 0.1;
                break;
            }
              //a
            case 97:
            {
                dlugosc -= 0.1;
                break;
            }
              //s
            case 115:
            {
                wysokosc -= 0.1;
                break;
            }
              //d
            case 100:
            { 
                dlugosc += 0.1;
                break;
            }
        }
          
        marker.setPosition({ lat: 50 + wysokosc, lng: 20 + dlugosc })
        
        let data = { "1" : wysokosc, "2" : dlugosc, "3" : kod};
        let message = JSON.stringify(data);
        websocket.send(message);
        
        });
    }

        // Websocket chat

        connected = document.getElementById("connected");
        log = document.getElementById("log");
        chat = document.getElementById("chat");
        form = chat.form;
        state = document.getElementById("status");
					
        if (window.WebSocket === undefined) {
           state.innerHTML = "sockets not supported";
           state.className = "fail";
        }
        else {
           if (typeof String.prototype.startsWith != "function") {
              String.prototype.startsWith = function (str) {
                 return this.indexOf(str) == 0;
              };
           }
           window.addEventListener("load", onLoad, false);
        }
					
        function onLoad() {
           var wsUri = "ws://design.net.pl:8010";
           websocket = new WebSocket(wsUri);
           websocket.onopen = function(evt) { onOpen(evt) };
           websocket.onclose = function(evt) { onClose(evt) };
           websocket.onmessage = function(evt) { onMessage(evt) };
           websocket.onerror = function(evt) { onError(evt) };
        }
					
        function onOpen(evt) {
           state.className = "success";
           state.innerHTML = "Connected to server";
        }
					
        function onClose(evt) {
           state.className = "fail";
           state.innerHTML = "Not connected";
           connected.innerHTML = "0";
        }
					
        function onMessage(evt) {
           
           var message = evt.data;
           var pozycja = JSON.parse(message);
           
            if (pozycja['5'] === "CHAT" )
            {
              message = log.innerHTML = '<li class = "message">' + 
              pozycja['4'] + "</li>" + log.innerHTML;
            }
            else if (pozycja['3'] === "KOD" )
            {
            marker2.setPosition({ lat: 50 + pozycja['1'], lng: 20 + pozycja['2'] });
            }
        }
					
        function onError(evt) {
           state.className = "fail";
           state.innerHTML = "Communication error";
        }
					
        function addMessage() {
           let mdata = { "4" : chat.value, "5" : "CHAT"};
           let message = JSON.stringify(mdata);
           chat.value = "";
           websocket.send(message);
        }
        
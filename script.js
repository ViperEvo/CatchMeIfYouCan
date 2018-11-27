// Initialize and add the map
var lokacja;
var map;
var marker;
var marker2;
let wysokosc;
let dlugosc;
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
        
        websocket.send(wysokosc);
        websocket.send(dlugosc);
        
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
           let wysokosc2;
           let dlugosc2;
                        
           switch (evt)
           {
                case wysokosc:
                {
                    wysokosc2 = evt.data;
                    marker2.setPosition({ lat: 50 + wysokosc2, lng: 20 + dlugosc });
                    break;
                }
                case dlugosc:
                {
                    dlugosc2 = evt.data;
                    marker2.setPosition({ lat: 50 + wysokosc, lng: 20 + dlugosc2 });
                    break;
                }
                default:
                {
                    message = log.innerHTML = '<li class = "message">' + 
                    message + "</li>" + log.innerHTML;
                }
           }
        //    if (message.startsWith("Test")) {
            
        //     marker2.setPosition({ lat: 50 + wysokosc, lng: 20 + dlugosc })
        //     }
        //    else {
        //       message = log.innerHTML = '<li class = "message">' + 
        //          message + "</li>" + log.innerHTML;
        //     }
        }
					
        function onError(evt) {
           state.className = "fail";
           state.innerHTML = "Communication error";
        }
					
        function addMessage() {
           var message = chat.value;
           chat.value = "";
           websocket.send(message);
        }
        
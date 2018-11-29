// Initialize and add the map
    function initMap() {
    // The location of Krakow
    let lokacja = {lat: 50, lng: 20};
    // The map, centered at Krakow
    let map = new google.maps.Map(
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
        // Tutaj wysyłamy swoją pozycje oraz nick jako obiekt JSON,
        // "KOD" służy do tego żeby można było "rozpoznać" czy wiadomość która do nas dociera to pozycja na mapie czy wiadomość chatu.
        let data = { "1" : wysokosc, "2" : dlugosc, "3" : "KOD", "7" : nick.value};
        let message = JSON.stringify(data);
        websocket.send(message);
        });
    }

        // Websocket chat
        
        connected = document.getElementById("connected");
        log = document.getElementById("log");
        chat = document.getElementById("chat");
        nick = document.getElementById("nick");
        form = chat.form;
        state = document.getElementById("status");
					
        if (window.WebSocket === undefined) 
        {
           state.innerHTML = "sockets not supported";
           state.className = "fail";
        }
        else 
        {
           if (typeof String.prototype.startsWith != "function") 
            {
                String.prototype.startsWith = function (str) {
                return this.indexOf(str) == 0}
            }
            window.addEventListener("load", onLoad, false);
        }
		// Tutaj mamy adres naszego serwera websocketowego			
        function onLoad() {
           let wsUri = "ws://design.net.pl:8010";
            websocket = new WebSocket(wsUri);
            websocket.onopen = function(evt) { onOpen(evt) };
            websocket.onclose = function(evt) { onClose(evt) };
            websocket.onmessage = function(evt) { onMessage(evt) };
            websocket.onerror = function(evt) { onError(evt) };
        }
					
        function onOpen(evt) 
        {
            state.className = "success";
            state.innerHTML = "Serwer WebSocket jest Online";
        }
					
        function onClose(evt) 
        {
            state.className = "fail";
            state.innerHTML = "Serwer WebSocket jest Offline";
            connected.innerHTML = "0";
        }
		// Funkcja która zajmuje się odbieraniem wiadomości			
        function onMessage(evt) 
        {
            nick.value;
            let message = evt.data;
            let pozycja = JSON.parse(message);
            // Tutaj sprawdzamy czy to co przyszło jest otagowane jako "CHAT" czy "KOD", jeżeli "CHAT" to dodajemy wiadomość do okna wiadomości
            if (pozycja['6'] === "CHAT" )
            {
              message = log.innerHTML = '<li class = "message">' + 
              pozycja['4'] + " : " + pozycja['5'] + "</li>" + log.innerHTML;
            }
            // Jeżeli "KOD" to sprawdzamy czy nick w wiadomości jest różny od naszego
            // Chodzi tu o to żeby ustawiać pozycję markera2 tylko kiedy ktoś "obcy" wysyła nam jego pozycję
            else if (pozycja['3'] === "KOD" && pozycja['7'] !== nick.value )
            {
                marker2.setPosition({ lat: 50 + pozycja['1'], lng: 20 + pozycja['2'] });
            }
        }
					
        function onError(evt) 
        {
            state.className = "fail";
            state.innerHTML = "Błąd komunikacji";
        }
		// Tutaj dodajemy wiadomość, jak widać mamy identyfikator "CHAT" jak i wysyłamy swój nick żeby wiadomo było kto pisze.			
        function addMessage() 
        {
            let mdata = { "4" : nick.value,"5" : chat.value, "6" : "CHAT"};
            let message = JSON.stringify(mdata);
            chat.value = "";
            nick.value;
            websocket.send(message);
        }
        
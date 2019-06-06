package main

import (
	"flag"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/hasangenc0/social-game/server/config"
)

// Message object
type Message struct {
	Email    string `json:"email"`
	Username string `json:"username"`
	Message  string `json:"message"`
}

// UserLocation Object
type UserLocation struct {
	x string `json:"x"`
	y string `json:"y"`
}

// Emitter Object
type Emitter struct {
	name string `json:"name"`
}

var clients = make(map[*websocket.Conn]bool)        // connected clients
var broadcast = make(chan Emitter)                  // broadcast channel
var userLocationBroadcast = make(chan UserLocation) // broadcast channel
var addr = flag.String("wsaddress", "localhost:8080", "http service address")
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func serveWebSocket(w http.ResponseWriter, r *http.Request) {
	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}
	defer c.Close()

	// Register our new client
	clients[c] = true

	for {
		log.Print(r)
		var emt Emitter
		// Read in a new message as JSON and map it to a Message object
		err := c.ReadJSON(&emt)
		if err != nil {
			log.Printf("error: %v", err)
			delete(clients, c)
			break
		}
		log.Print(emt)
		// Send the newly received message to the broadcast channel
		broadcast <- emt
		//userLocationBroadcast <- emt
	}

}

func handleMessages() {
	for {
		// Grab the next message from the broadcast channel
		emt := <-broadcast
		// Send it out to every client that is currently connected
		for client := range clients {
			err := client.WriteJSON(emt)
			if err != nil {
				log.Printf("error: %v", err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}

func getUserLocations() {
	for {
		// Grab the next message from the broadcast channel
		usrl := <-userLocationBroadcast
		// Send it out to every client that is currently connected
		for client := range clients {
			err := client.WriteJSON(usrl)
			if err != nil {
				log.Printf("error: %v", err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}

func main() {

	flag.Parse()
	log.SetFlags(0)

	// static file server

	fs := http.FileServer(http.Dir(config.CLIENT_DIR))
	http.Handle("/", fs)

	// socket
	http.HandleFunc("/ws", serveWebSocket)
	go handleMessages()
	go getUserLocations()

	// run server
	log.Println("🔥 Server listening.")
	err := http.ListenAndServe(":"+config.API_PORT, nil)

	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}

}

package main

import (
  "flag"
  "log"
  "net/http"
  "github.com/gorilla/websocket"
)

// Define our message object
type Message struct {
  Email    string `json:"email"`
  Username string `json:"username"`
  Message  string `json:"message"`
}

var clients = make(map[*websocket.Conn]bool) // connected clients
var broadcast = make(chan Message)           // broadcast channel
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
    var msg Message
    // Read in a new message as JSON and map it to a Message object
    err := c.ReadJSON(&msg)
    if err != nil {
            log.Printf("error: %v", err)
            delete(clients, c)
            break
    }
    // Send the newly received message to the broadcast channel
    broadcast <- msg
 }

}

func handleMessages() {
  for {
      // Grab the next message from the broadcast channel
      msg := <-broadcast
      // Send it out to every client that is currently connected
      for client := range clients {
        err := client.WriteJSON(msg)
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
  fs := http.FileServer(http.Dir("../client/build"))
  http.Handle("/", fs)

  // socket
  http.HandleFunc("/ws", serveWebSocket)
  go handleMessages()

  // run server
  log.Println("🔥 Server listening.")
  err := http.ListenAndServe(":8080", nil)

  if err != nil {
    log.Fatal("ListenAndServe: ", err)
   }

}


package testsocket

import (
	"flag"
	"log"
	"net/url"
	"testing"

	"github.com/gorilla/websocket"
)

var addr = flag.String("addr", "localhost:8080", "http service address")

func TestSocketConnection(t *testing.T) {
	flag.Parse()
	log.SetFlags(0)

	u := url.URL{Scheme: "ws", Host: *addr, Path: "/ws"}
	log.Printf("connecting to %s", u.String())

	c, _, err := websocket.DefaultDialer.Dial(u.String(), nil)

	if err != nil {
		t.Error("Can't connect to websocket ", err)
	}

	defer c.Close()

}

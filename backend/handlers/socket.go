package handlers

import (
	"fmt"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
	"main.go/backend/helpers"
)

type Client struct {
	connection  *websocket.Conn
	send        chan []byte
	connOwnerId string
	mu          sync.Mutex
}
type SMessage struct {
	Type             string
	Status           string
	From             string
	FromId           string
	Message          string
	To               string
	Date             string
	ConnectedClients []string
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all connections
	},
}
var clientConnections = make(map[*Client]bool)
var broadcast = make(chan SMessage)

func handleMessages() {
	for {

		sms := <-broadcast
		fmt.Println("Sõnumi saaja:", sms.To)

		switch sms.Type {
		case "message":
			for client := range clientConnections {
				fmt.Println("Kliendi ID:", client.connOwnerId)
				if sms.To == client.connOwnerId {
					client.mu.Lock()
					fmt.Printf("Saadan sõnumi kasutajale: %s\n", client.connOwnerId)
					err := client.connection.WriteJSON(sms)
					if err != nil {
						fmt.Println(err)
						client.connection.Close()
						delete(clientConnections, client)
					} else {
						fmt.Printf("Sonum saadetud: %v\n", sms)
					}
					client.mu.Unlock()
				} else {
					fmt.Printf("Kliendi ID: %s ei vasta sõnumi saajale\n", client.connOwnerId)
				}
			}

		}
	}
}
func WsHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}
	defer conn.Close()
	go handleMessages()
	_, username, err := GetCookies(w, r)
	fmt.Println("sock username", username)
	helpers.CheckError(err)
	client := &Client{
		connection:  conn,
		connOwnerId: username,
		send:        make(chan []byte, 256),
	}
	clientConnections[client] = true
	fmt.Println("The clients are: ", clientConnections[client])
	defer func() {
		client.connection.Close()
		//this do offline
		users := []string{}
		for key := range clientConnections {
			users = append(users, key.connOwnerId)
		}
		allUsers := SMessage{
			Type:             "status",
			Status:           "online",
			ConnectedClients: users,
		}
		for client := range clientConnections {
			client.mu.Lock()
			client.connection.WriteJSON(allUsers)
			client.mu.Unlock()
		}
	}()
	for {
		var sms SMessage
		err := conn.ReadJSON(&sms)
		if err != nil {
			client.mu.Lock()
			delete(clientConnections, client)
			client.mu.Unlock()
			return
		}
		// client.mu.Lock()
		// client.mu.Unlock()
		broadcast <- sms
	}
}

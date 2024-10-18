package handlers

import (
	"fmt"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
	"main.go/backend/database/set"
	"main.go/backend/helpers"
	"main.go/backend/structs"
)

type Client struct {
	connection  *websocket.Conn
	send        chan []byte
	connOwnerId string
	mu          sync.Mutex
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all connections
	},
}
var clientConnections = make(map[*Client]bool)
var broadcast = make(chan structs.SMessage)

func handleMessages() {
	for {

		sms := <-broadcast
		fmt.Println("mis on siis see:", sms.From)
		fmt.Println("Sõnumi saaja:", sms.To)
		fmt.Println("Sõnumi tekst: ", sms.Message)
		fmt.Println("Sõnumi kes: ", sms.ConnectedClients)
		switch sms.Type {
		case "message":

			set.InsertMessage(sms.From, sms.To, sms.Message, sms.Date)
			for client := range clientConnections {
				// fmt.Println("Kliendi ID:", client.connOwnerId)
				//sms.To ja client.connOwnerId väärtused peavad olema samad
				fmt.Printf("sms.To: %s, client.connOwnerId: %s\n", sms.To, client.connOwnerId)
				if sms.To == client.connOwnerId {

					client.mu.Lock()
					// fmt.Printf("Saadan sõnumi kasutajale: %s\n", client.connOwnerId)

					err := client.connection.WriteJSON(sms)
					if err != nil {
						fmt.Println(err)
						client.connection.Close()
						delete(clientConnections, client)
					} else {
						// fmt.Printf("Sonum saadetud: %v\n", sms)
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

	for client := range clientConnections {
		fmt.Println("The clients are: ", client)
	}

	defer func() {
		client.connection.Close()
		//this do offline
		users := []string{}
		for key := range clientConnections {
			users = append(users, key.connOwnerId)
		}
		allUsers := structs.SMessage{
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
		var sms structs.SMessage
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

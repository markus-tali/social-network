package handlers

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
	"sync"

	"github.com/gorilla/websocket"
	"main.go/backend/database/deletion"
	"main.go/backend/database/set"
	"main.go/backend/database/update"
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

		switch sms.Type {
		case "message":

			set.InsertMessage(sms.From, sms.To, sms.Message, sms.Date)
			for client := range clientConnections {
				fmt.Printf("sms.To: %s, client.connOwnerId: %s\n", sms.To, client.connOwnerId)
				if sms.To == client.connOwnerId {

					client.mu.Lock()

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

		case "followRequest":
			fmt.Println("gotinfollowrequest")
			for client := range clientConnections {
				if sms.To == client.connOwnerId { // Only notify the intended user
					client.mu.Lock()
					err := client.connection.WriteJSON(sms)
					if err != nil {
						fmt.Println("WebSocket error sending follow request:", err)
						client.connection.Close()
						delete(clientConnections, client)
					}
					client.mu.Unlock()
				}
			}
		case "acceptFollowRequest":
			fmt.Printf("Accepting follow request from %s to %s\n", sms.From, sms.To)
			err := update.UpdateFollowRequestStatus(sms.From, sms.To, "accepted")
			if err != nil {
				fmt.Println("Error updating follow request:", err)
				return
			}
			err = deletion.RemoveNotification(sms.From, sms.To)
			if err != nil {
				fmt.Println("Error updating follow request:", err)
				return
			}
			for client := range clientConnections {
				if sms.To == client.connOwnerId { // Only notify the intended user
					client.mu.Lock()
					defer client.mu.Unlock()
					err := client.connection.WriteJSON(structs.SMessage{
						Type: "acceptFollowRequest",
						From: sms.From,
						To:   sms.To,
					})
					if err != nil {
						fmt.Println("WebSocket error:", err)
						client.connection.Close()
						delete(clientConnections, client)
					}
				}
			}
		case "rejectFollowRequest":
			fmt.Printf("Rejecting follow request from %s to %s\n", sms.From, sms.To)
			err := update.UpdateFollowRequestStatus(sms.From, sms.To, "reject")
			if err != nil {
				fmt.Println("Error updating follow request:", err)
				return
			}
			err = deletion.RemoveNotification(sms.From, sms.To)
			if err != nil {
				fmt.Println("Error updating follow request:", err)
				return
			}
		case "groupInvitation":
			fmt.Println("Inviting into group!")
			fmt.Println("in group invitation", sms)
			groupID, err := strconv.Atoi(sms.GroupId)
			if err != nil {
				log.Printf("Error converting GroupId to integer: %v", err)
				return // or handle the error appropriately
			}
			set.AddGroupMember(groupID, sms.To, "pending")
			for client := range clientConnections {
				if sms.To == client.connOwnerId { // Only notify the intended user
					client.mu.Lock()
					err := client.connection.WriteJSON(sms)
					if err != nil {
						fmt.Println("WebSocket error sending follow request:", err)
						client.connection.Close()
						delete(clientConnections, client)
					}
					client.mu.Unlock()
				}
			}
		case "acceptInviteMessage":
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
	// fmt.Println("sock username", username)
	helpers.CheckError(err)

	client := &Client{
		connection:  conn,
		connOwnerId: username,
		send:        make(chan []byte, 256),
	}

	clientConnections[client] = true

	// for client := range clientConnections {
	// 	fmt.Println("The clients are: ", client)
	// }

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

package handlers

import (
	"fmt"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
	"main.go/backend/database/deletion"
	"main.go/backend/database/get"
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

			set.InsertMessage(sms.Type, sms.From, sms.To, sms.Message, sms.Date, 0)
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
			err = deletion.RemoveNotification("followRequest", sms.From, sms.To)
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
			err := update.UpdateFollowRequestStatus(sms.From, sms.To, "rejected")
			if err != nil {
				fmt.Println("Error updating follow request:", err)
				return
			}
			err = deletion.RemoveNotification("followRequest", sms.From, sms.To)
			if err != nil {
				fmt.Println("Error updating follow request:", err)
				return
			}
		case "groupInvitation":
			fmt.Println("Inviting into group!")
			fmt.Println("in group invitation", sms)

			// groupID, err := strconv.Atoi(sms.GroupId)
			// fmt.Println("froupid in socket:", groupID)
			// if err != nil {
			// 	log.Printf("Error converting GroupId to integer: %v", err)
			// 	return // or handle the error appropriately
			// }

			set.AddGroupMember(sms.GroupId, sms.To, "pending")

			fmt.Println("here are the groupinvitation things: ", sms.From, sms.To, sms.GroupId)

			// Insert the notification in the database
			err := set.InsertNotification("groupInvitation", sms.From, sms.To, sms.GroupId)
			if err != nil {
				fmt.Println("Database error storing group invitation:", err)
				return
			}

			for client := range clientConnections {
				if sms.To == client.connOwnerId { // Only notify the intended user
					client.mu.Lock()

					fmt.Println("Made it to writing json in groupInvitation socket.go")
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
			fmt.Println("in acceptInviteMessage, sms is: ", sms)
			fmt.Printf("GroupId: %s, From: %s, To: %s\n", sms.GroupId, sms.From, sms.To)
			// groupID, err := strconv.Atoi(sms.GroupId)
			// fmt.Println("froupid in socket:", groupID)
			// if err != nil {
			// 	log.Printf("Error converting GroupId to integer: %v", err)
			// 	return // or handle the error appropriately
			// }
			err := update.UpdateGroupInviteStatus(sms.GroupId, sms.To, "accepted")
			err = deletion.RemoveNotification("groupInvitation", sms.From, sms.To)

			helpers.CheckError(err)

		case "rejectInviteMessage":
			fmt.Println("you git rejected loser in socket, sms is:", sms)
			// groupID, err := strconv.Atoi(sms.GroupId)
			// fmt.Println("froupid in socket:", groupID)
			// if err != nil {
			// 	log.Printf("Error converting GroupId to integer: %v", err)
			// 	return // or handle the error appropriately
			// }
			err := update.UpdateGroupInviteStatus(sms.GroupId, sms.To, "rejected")
			err = deletion.RemoveNotification("groupInvitation", sms.From, sms.To)

			helpers.CheckError(err)

		case "joinGroupRequest":
			fmt.Println("you got in joinGroupRequest ", sms)

			set.AddGroupMember(sms.GroupId, sms.From, "pending")

			err := set.InsertNotification("joinGroupRequest", sms.From, sms.To, sms.GroupId)
			if err != nil {
				fmt.Println("Database error storing group invitation:", err)
				return
			}
			for client := range clientConnections {
				if sms.To == client.connOwnerId { // Only notify the intended user
					client.mu.Lock()

					fmt.Println("Made it to writing json in joinGroupRequest socket.go")
					err := client.connection.WriteJSON(sms)
					if err != nil {
						fmt.Println("WebSocket error sending group join request:", err)
						client.connection.Close()
						delete(clientConnections, client)
					}
					client.mu.Unlock()
				}
			}

		case "acceptGroupJoin":
			fmt.Println("in acceptGroupJoin, sms is: ", sms)
			fmt.Printf("GroupId: %s, From: %s, To: %s\n", sms.GroupId, sms.From, sms.To)
			err := update.UpdateGroupInviteStatus(sms.GroupId, sms.To, "accepted")
			err = deletion.RemoveNotification("joinGroupRequest", sms.To, sms.From)

			helpers.CheckError(err)

		case "rejectGroupJoin":
			fmt.Println("you git rejected loser in socket, sms is:", sms)
			err := update.UpdateGroupInviteStatus(sms.GroupId, sms.To, "rejected")
			err = deletion.RemoveNotification("joinGroupRequest", sms.To, sms.From)

			helpers.CheckError(err)

		case "eventCreation":
			fmt.Println("in eventCreation")

			groupMembers, err := get.GetGroupMembers(sms.GroupId)
			helpers.CheckError(err)

			fmt.Println("Here are the groupMembers for eventCreation: ", groupMembers)

			for client := range clientConnections {
				for _, eventReciever := range groupMembers {
					if eventReciever.Username == sms.From {
						continue
					}
					if client.connOwnerId == eventReciever.Username {
						client.mu.Lock()
						err := set.InsertNotification("eventNotification", sms.From, eventReciever.Username, sms.GroupId)
						helpers.CheckError(err)
						err = client.connection.WriteJSON(structs.SMessage{
							Type:       "eventNotification",
							From:       sms.From,
							To:         eventReciever.Username,
							GroupId:    sms.GroupId,
							EventId:    sms.EventId,
							GroupTitle: sms.GroupTitle,
						})
						if err != nil {
							fmt.Println("WebSocket error sending event notification:", err)
							client.connection.Close()
							delete(clientConnections, client)
						}
						client.mu.Unlock()
					}
				}
			}
		case "OKEvent":
			fmt.Println("in OKEvent")
			err := deletion.RemoveNotification("eventNotification", sms.From, sms.To)
			helpers.CheckError(err)

		case "groupMessage":
			fmt.Println("in groupMessage")

			fmt.Println("HERE IS THE MESSAGE IN GROUPMESSAGE: ", sms)
			groupMembers, err := get.GetGroupMembers(sms.GroupId)
			helpers.CheckError(err)

			fmt.Println("Here are the groupMembers for groupMessage: ", groupMembers)

			set.InsertMessage(sms.Type, sms.From, "", sms.Message, sms.Date, sms.GroupId)
			for client := range clientConnections {
				for _, member := range groupMembers {
					fmt.Println("Here is a member: ", member)
					if client.connOwnerId == member.Username && client.connOwnerId != sms.From { // Avoid sending it to the sender
						client.mu.Lock()
						fmt.Printf("client.connOwnerId: %s, member.Username: %s\n", client.connOwnerId, member.Username)
						err := client.connection.WriteJSON(sms)
						if err != nil {
							fmt.Println("Error sending group message:", err)
							client.connection.Close()
							delete(clientConnections, client)
						}
						client.mu.Unlock()
					}
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
			fmt.Println("Error reading from WebSocket:", err)
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

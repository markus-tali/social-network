package structs

type SMessage struct {
	Type             string   `json:"Type"`
	Status           string   `json:"Status"`
	From             string   `json:"From"`
	FromId           string   `json:"Fromid"`
	Message          string   `json:"Message"`
	To               string   `json:"To"`
	Date             string   `json:"Date"`
	ConnectedClients []string `json:"Connectedclients"`
	NotificationId   string   `json:"Notificationid"`
	GroupId          int      `json:"Group_id"`
	GroupTitle       string   `json:"Grouptitle"`
	EventId          int      `json:"Event_id"`
}

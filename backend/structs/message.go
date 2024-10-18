package structs

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

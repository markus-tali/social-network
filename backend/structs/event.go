package structs

type Event struct {
	Id          int    `json:"id"`
	Username    string `json:"username"`
	Group_id    int    `json:"group_id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Time        string `json:"time"`
}

type EventResponse struct {
	Event_id int    `json:"event_id"`
	Username string `json:"username"`
	Pending  string `json:"pending"`
}

package structs

type Group struct {
	Id          string   `json:"id"`
	Creator     string   `json:"creator"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Members     []string `json:"members"`
}

type GroupCreationRequest struct {
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Invites     []string `json:"invites"` // List of invited friends' usernames
}
type GroupMembers struct {
	Id       string  `json:"id"`
	Group_Id []Group `json:"group_id"`
	Username string  `json:"username"`
}

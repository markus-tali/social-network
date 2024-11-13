package structs

type Post struct {
	ID        string    `json:"id"`
	Username  string    `json:"username"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	Avatar    string    `json:"avatar"`
	CreatedAt string    `json:"createdAt"`
	Comment   []Comment `json:"comments"`
	Group_id  int       `json:"groupId"`
}

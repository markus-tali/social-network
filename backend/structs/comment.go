package structs

type Comment struct {
	Id        string `json:"id"`
	PostId    string `json:"postId"`
	Username  string `json:"username"`
	Content   string `json:"content"`
	Comment   string `json:"comment"`
	Avatar    string `json:"avatar"`
	CreatedAt string `json:"createdAt"`
}

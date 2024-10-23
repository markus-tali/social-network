package structs

type User struct {
	Id          string
	DateofBirth string   `json:"dateofBirth"`
	Username    string   `json:"username"`
	Password    string   `json:"password"`
	FirstName   string   `json:"firstName"`
	LastName    string   `json:"lastName"`
	Email       string   `json:"email"`
	AboutMe     string   `json:"aboutMe"`
	Nickname    string   `json:"nickname"`
	Avatar      string   `json:"avatar"`
	IsPrivate   bool     `json:"isPrivate"`
	FollowedBy  []string `json:"followedBy"`
	IsFollowing []string `json:"isFollowing"`
}

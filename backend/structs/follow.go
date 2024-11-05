package structs

type Follow struct {
	ID               int    `json:"id"`
	FollowerUsername string `json:"follower_username"`
	FollowedUsername string `json:"followed_username"`
	Status           string `json:"status"`
	NotificationId   string `json:"notificationid"`
}

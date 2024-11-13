package deletion

import (
	"fmt"

	"main.go/backend/database/create"
)

func RemoveNotification(notificationType, userFollowing, userFollowedBy string) error {
	fmt.Println("So i made it to remove notification")
	fmt.Println("removing notification: ", notificationType, userFollowing, userFollowedBy)
	db, err := create.ConnectDB()
	if err != nil {
		return err
	}
	defer db.Close()

	_, err = db.Exec(`DELETE FROM notifications WHERE follower_username = ? AND followed_username = ? AND notification_type = ?`, userFollowing, userFollowedBy, notificationType)
	return err
}

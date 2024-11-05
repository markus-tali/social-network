package deletion

import (
	"fmt"

	"main.go/backend/database/create"
)

func RemoveNotification(userFollowing, userFollowedBy string) error {
	fmt.Println("So i made it to remove")
	db, err := create.ConnectDB()
	if err != nil {
		return err
	}
	defer db.Close()

	_, err = db.Exec(`DELETE FROM notifications WHERE follower_username = ? AND followed_username = ?`, userFollowing, userFollowedBy)
	return err
}

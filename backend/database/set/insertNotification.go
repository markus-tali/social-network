package set

import (
	"fmt"

	"main.go/backend/database/create"
)

func InsertNotification(userFollowing, userFollowedBy string) error {
	db, err := create.ConnectDB()
	if err != nil {
		fmt.Println("ORmaybeisthis?")
		return err
	}
	defer db.Close()

	_, err = db.Exec(`INSERT INTO notifications (follower_username, followed_username) VALUES (?, ?)`, userFollowing, userFollowedBy)
	return err
}

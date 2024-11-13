package set

import (
	"database/sql"
	"fmt"

	"main.go/backend/database/create"
)

func InsertFollowing(userFollowing, userFollowedBy string, status string) error {
	db, err := create.ConnectDB()
	if err != nil {
		return err
	}
	defer db.Close()

	var isPrivate bool
	err = db.QueryRow(`SELECT isPrivate FROM users WHERE username = ?`, userFollowedBy).Scan(&isPrivate)
	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Println("usernotfound")
			return fmt.Errorf("user %s not found", userFollowedBy)
		}
		return err
	}

	if isPrivate && status == "" {
		status = "pending" // Kui kasutaja on privaatne, seadistame staatuse "pending"
	} else if status == "" {
		status = "accepted" // Kui ei ole privaatsust, seadistame staatuse "accepted"
	}

	_, err = db.Exec(`INSERT INTO follows (follower_username, followed_username, status) VALUES (?, ?, ?)`,
		userFollowing, userFollowedBy, status)
	if err != nil {
		return err
	}

	if isPrivate && status == "pending" {
		return InsertNotification("followRequest", userFollowing, userFollowedBy, 0)
	}
	return nil
}

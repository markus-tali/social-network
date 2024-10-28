package set

import (
	"database/sql"
	"fmt"

	"main.go/backend/database/create"
	"main.go/backend/helpers"
)

func InsertFollowing(userFollowing, userFollowedBy string) error {
	db, err := create.ConnectDB()
	helpers.CheckError(err)
	defer db.Close()

	var isPrivate bool
	fmt.Println("I am selecting user")

	err = db.QueryRow(`SELECT isPrivate FROM users WHERE username = ?`, userFollowedBy).Scan(&isPrivate)
	if err != nil {
		if err == sql.ErrNoRows {
			return fmt.Errorf("user %s not found", userFollowedBy)
		}
		return err
	}
	status := "accepted"
	if isPrivate {
		status = "pending"
	}
	fmt.Println("I made it to INsert in insertfollowing:")
	_, err = db.Exec(`INSERT INTO follows (follower_username, followed_username, status) VALUES (?, ?, ?)`, userFollowing, userFollowedBy, status)
	return err

}

package deletion

import (
	"fmt"

	"main.go/backend/database/create"
)

func RemoveFollowing(follower, followed string) error {
	fmt.Println("So i made it to remove following")
	db, err := create.ConnectDB()
	if err != nil {
		return err
	}
	defer db.Close()

	_, err = db.Exec(`DELETE FROM follows WHERE follower_username = ? AND followed_username = ?`, follower, followed)
	return err
}

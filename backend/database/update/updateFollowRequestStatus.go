package update

import (
	"main.go/backend/database/create"
	"main.go/backend/helpers"
)

func UpdateFollowRequestStatus(fromUsername, toUsername, status string) error {
	db, err := create.ConnectDB()
	helpers.CheckError(err)
	defer db.Close()

	query := `UPDATE follows SET status = $1 WHERE follower_username = $2 AND followed_username = $3`
	_, err = db.Exec(query, status, fromUsername, toUsername)
	helpers.CheckError(err)

	return err
}

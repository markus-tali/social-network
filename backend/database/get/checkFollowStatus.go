package get

import (
	"database/sql"

	"main.go/backend/database/create"
	"main.go/backend/helpers"
)

func CheckFollowStatus(fromUsername, toUsername string) (bool, error) {
	db, err := create.ConnectDB()
	helpers.CheckError(err)
	defer db.Close()

	var status string

	query := `SELECT status FROM follows WHERE follower_username = ? AND followed_username = ?`
	err = db.QueryRow(query, fromUsername, toUsername).Scan(&status)

	if err != nil {
		if err == sql.ErrNoRows {
			return false, nil // No follow relationship found
		}
		return false, err // Other error
	}

	// Return true if the status is "accepted"
	return status == "accepted", nil
}

package get

import (
	"database/sql"

	"main.go/backend/database/create"
	"main.go/backend/helpers"
)

func CheckGroupMemberStatus(groupId int, username string) (bool, error) {
	db, err := create.ConnectDB()
	helpers.CheckError(err)
	defer db.Close()

	var status string

	query := `SELECT status FROM group_members WHERE group_id = ? AND username = ?`
	err = db.QueryRow(query, groupId, username).Scan(&status)

	if err != nil {
		if err == sql.ErrNoRows {
			return false, nil // No follow relationship found
		}
		return false, err // Other error
	}

	// Return true if the status is "accepted"
	return status == "accepted", nil
}

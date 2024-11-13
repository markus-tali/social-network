package set

import (
	"errors"
	"fmt"

	"github.com/mattn/go-sqlite3"
	"main.go/backend/database/create"
	"main.go/backend/helpers"
)

func AddGroupMember(groupID int, username, status string) error {
	fmt.Println("made it to addgroupmember")

	db, err := create.ConnectDB()
	helpers.CheckError(err)
	defer db.Close()

	_, err = db.Exec("INSERT INTO group_members (group_id, username, status) VALUES (?, ?, ?)", groupID, username, status)
	if err != nil {
		// Check for unique constraint violation
		if sqliteErr, ok := err.(sqlite3.Error); ok && sqliteErr.Code == sqlite3.ErrConstraint {
			return errors.New("user is already a member of the group")
		}
		// Return any other errors
		return err
	}
	return err
}

package set

import (
	"fmt"

	"main.go/backend/database/create"
	"main.go/backend/helpers"
)

func AddGroupMember(groupID int, username, status string) error {
	fmt.Println("made it to addgroupmember")

	db, err := create.ConnectDB()
	helpers.CheckError(err)
	defer db.Close()

	_, err = db.Exec("INSERT INTO group_members (group_id, username, status) VALUES (?, ?, ?)", groupID, username, status)
	helpers.CheckError(err)
	return err
}

package update

import (
	"fmt"

	"main.go/backend/database/create"
	"main.go/backend/helpers"
)

func UpdateGroupInviteStatus(groupId int, toUsername, status string) error {

	db, err := create.ConnectDB()
	helpers.CheckError(err)
	defer db.Close()
	fmt.Println("i am in updategroupinvitestatus")
	query := `UPDATE group_members SET status = $1 WHERE username = $2 AND group_id = $3`
	_, err = db.Exec(query, status, toUsername, groupId)
	helpers.CheckError(err)

	return err
}

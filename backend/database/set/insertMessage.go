package set

import (
	"main.go/backend/database/create"
	"main.go/backend/helpers"
)

func InsertMessage(Type, From, To, Message, Date string, GroupId int) {
	db, err := create.ConnectDB()
	helpers.CheckError(err)
	defer db.Close()
	command := "INSERT INTO messages(fromUser, message, toUser, date, type, group_id) VALUES (?,?,?,?,?,?)"
	_, err = db.Exec(command, From, Message, To, Date, Type, GroupId)
	helpers.CheckError(err)
}

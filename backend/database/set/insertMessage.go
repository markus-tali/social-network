package set

import (
	"main.go/backend/database/create"
	"main.go/backend/helpers"
)

func InsertMessage(From, To, Message, Date string) {
	db, err := create.ConnectDB()
	helpers.CheckError(err)
	defer db.Close()
	command := "INSERT INTO messages(fromUser, message, toUser, date) VALUES (?,?,?,?)"
	_, err = db.Exec(command, From, Message, To, Date)
	helpers.CheckError(err)
}
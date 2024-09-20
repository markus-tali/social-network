package set

import (
	"main.go/backend/database/create"
	"main.go/backend/helpers"
)

func InsertPost(username, title, text string) {
	db, err := create.ConnectDB()
	helpers.CheckError(err)
	defer db.Close()
	command := "INSERT INTO posts(username, title, content) VALUES (?, ?, ?)"
	_, err = db.Exec(command, username, title, text)
	helpers.CheckError(err)
}

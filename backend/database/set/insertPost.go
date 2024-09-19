package set

import (
	"main.go/backend/database/create"
	"main.go/backend/helpers"
)

func InsertPost(username, title, text, category string) {
	db, err := create.ConnectDB()
	helpers.CheckError(err)
	defer db.Close()
	command := "INSERT INTO posts(username, title, content, avatar, createdAt) VALUES (?, ?, ?, ?, ?)"
	_, err = db.Exec(command, username, title, text, category)
	helpers.CheckError(err)
}

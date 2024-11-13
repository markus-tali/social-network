package set

import (
	"main.go/backend/database/create"
	"main.go/backend/helpers"
)

func InsertPost(username, title, text, privacy, avatar string, groupId int) {
	db, err := create.ConnectDB()
	helpers.CheckError(err)
	defer db.Close()
	command := "INSERT INTO posts(username, title, content, privacy,  avatar, group_id) VALUES (?, ?, ?, ?, ?, ?)"
	_, err = db.Exec(command, username, title, text, privacy, avatar, groupId)
	helpers.CheckError(err)
}

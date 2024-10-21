package set

import (
	"fmt"

	"main.go/backend/database/create"
	"main.go/backend/helpers"
)

func InsertPost(username, title, text, privacy, avatar string) {
	db, err := create.ConnectDB()
	helpers.CheckError(err)
	defer db.Close()
	command := "INSERT INTO posts(username, title, content, privacy,  avatar) VALUES (?, ?, ?, ?, ?)"
	_, err = db.Exec(command, username, title, text, privacy, avatar)
	fmt.Println("Username from insertpost", username)
	helpers.CheckError(err)
}

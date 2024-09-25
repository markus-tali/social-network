package set

import (
	"fmt"

	"main.go/backend/database/create"
	"main.go/backend/helpers"
)

func InsertPost(username, title, text, avatar string) {
	db, err := create.ConnectDB()
	helpers.CheckError(err)
	defer db.Close()
	command := "INSERT INTO posts(username, title, content, avatar) VALUES (?, ?, ?, ?)"
	_, err = db.Exec(command, username, title, text, avatar)
	fmt.Println("Username from insertpost", username)
	helpers.CheckError(err)
}

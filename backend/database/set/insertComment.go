package set

import (
	"main.go/backend/database/create"
	"main.go/backend/helpers"
)

func InsertComment(postID, username, content, avatar string) {
	db, err := create.ConnectDB()
	helpers.CheckError(err)
	defer db.Close()

	command := "INSERT INTO comments(postId, username, content, avatar) VALUES (?, ?, ?, ?)"
	_, err = db.Exec(command, postID, username, content, avatar)
	helpers.CheckError(err)
}

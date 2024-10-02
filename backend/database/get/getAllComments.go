package get

import (
	"main.go/backend/database/create"
	"main.go/backend/helpers"
	"main.go/backend/structs"
)

func GetAllComments() ([]structs.Comment, error) {
	db, err := create.ConnectDB()
	if err != nil {
		return nil, err
	}
	defer db.Close()

	var comment structs.Comment
	var comments []structs.Comment

	rows, err := db.Query("SELECT id, postId, username, content,  avatar, createdAt FROM comments ORDER BY createdAt DESC")
	helpers.CheckError(err)
	defer rows.Close()

	for rows.Next() {
		err := rows.Scan(&comment.ID, &comment.PostId, &comment.Username, &comment.Content, &comment.Avatar, &comment.CreatedAt)
		if err != nil {
			return nil, err
		}
		comments = append(comments, comment)
		helpers.CheckError(err)

	}
	return comments, nil
}

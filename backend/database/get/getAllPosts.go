package get

import (
	"main.go/backend/database/create"
	"main.go/backend/helpers"
	"main.go/backend/structs"
)

func GetAllPosts() ([]structs.Post, error) {
	db, err := create.ConnectDB()
	helpers.CheckError(err)
	defer db.Close()
	var post structs.Post
	var posts []structs.Post
	rows, err := db.Query("SELECT id, username, title, content, avatar, createdAt FROM posts WHERE group_id IS NULL OR group_id = 0 ORDER BY createdAt DESC")
	helpers.CheckError(err)
	defer rows.Close()

	for rows.Next() {
		err := rows.Scan(&post.ID, &post.Username, &post.Title, &post.Content, &post.Avatar, &post.CreatedAt)
		posts = append(posts, post)
		helpers.CheckError(err)
	}
	helpers.CheckError(err)
	return posts, nil
}

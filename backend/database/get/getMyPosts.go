package get

import (
	"main.go/backend/database/create"
	"main.go/backend/structs"
)

func GetMyPosts(username string) ([]structs.Post, error) {
	db, err := create.ConnectDB()
	if err != nil {
		return nil, err
	}
	defer db.Close()

	rows, err := db.Query(`SELECT username, title, content, avatar, createdAt FROM posts WHERE username = ?`, username)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []structs.Post
	for rows.Next() {
		var post structs.Post
		if err := rows.Scan(&post.Username, &post.Title, &post.Content, &post.Avatar, &post.CreatedAt); err != nil {
			return nil, err
		}
		posts = append(posts, post)
	}
	return posts, nil
}

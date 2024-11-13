package get

import (
	"main.go/backend/database/create"
	"main.go/backend/helpers"
	"main.go/backend/structs"
)

func GetAllGroupPosts(group_id int) ([]structs.Post, error) {
	db, err := create.ConnectDB()
	helpers.CheckError(err)
	defer db.Close()

	rows, err := db.Query(`SELECT id, username, title, content, avatar, createdAt, group_id FROM posts WHERE group_id = ?`, group_id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []structs.Post
	for rows.Next() {
		var post structs.Post
		if err := rows.Scan(&post.ID, &post.Username, &post.Title, &post.Content, &post.Avatar, &post.CreatedAt, &post.Group_id); err != nil {
			return nil, err
		}
		posts = append(posts, post)
	}
	return posts, nil

}

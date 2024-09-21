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
	rows, err := db.Query("SELECT id, username, title, content, avatar, createdAt FROM posts")
	helpers.CheckError(err)
	defer rows.Close()

	for rows.Next() {
		err := rows.Scan(&post.ID, &post.Username, &post.Title, &post.Content, &post.Avatar, &post.CreatedAt)
		posts = append(posts, post)
		helpers.CheckError(err)
		// fmt.Printf("postID: %d, postUSERNAME: %s, postTITLE: %s, postCONTENT: %s, postTHREAD %s, postLike %d, postDislike %d\n", post.ID, post.Username, post.Title, post.Content, post.Thread, post.Like_count, post.Dislike_count)
	}
	helpers.CheckError(err)
	return posts, nil
}

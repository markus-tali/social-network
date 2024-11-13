package get

import (
	"main.go/backend/database/create"
	"main.go/backend/structs"
)

func GetFollowers(username string) ([]structs.Follow, error) {

	db, err := create.ConnectDB()
	if err != nil {
		return nil, err
	}
	defer db.Close()

	rows, err := db.Query(`SELECT follower_username FROM follows WHERE followed_username = ? AND status = 'accepted'`, username)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var followers []structs.Follow

	for rows.Next() {
		var follow structs.Follow
		if err := rows.Scan(&follow.FollowerUsername); err != nil {
			return nil, err
		}
		followers = append(followers, follow)
	}
	return followers, nil

}

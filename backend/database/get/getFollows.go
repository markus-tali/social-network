package get

import (
	"main.go/backend/database/create"
	"main.go/backend/structs"
)

func GetFollows(username string) ([]structs.Follow, error) {
	db, err := create.ConnectDB()
	if err != nil {
		return nil, err
	}
	defer db.Close()

	rows, err := db.Query(`SELECT followed_username FROM follows WHERE follower_username = ? AND status = 'accepted'`, username)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var follows []structs.Follow
	for rows.Next() {
		var follow structs.Follow
		if err := rows.Scan(&follow.FollowedUsername); err != nil {
			return nil, err
		}
		follows = append(follows, follow)
	}
	return follows, nil
}

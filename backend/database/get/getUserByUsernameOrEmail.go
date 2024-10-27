package get

import (
	"encoding/json"

	"main.go/backend/database/create"
	"main.go/backend/helpers"
	"main.go/backend/structs"
)

func GetUserByUsernameOrEmail(usernameOrEmail string) (*structs.User, error) {
	db, err := create.ConnectDB()
	helpers.CheckError(err)
	defer db.Close()
	var u structs.User
	var followedBy, isFollowing string // Temporary strings to hold the JSON text

	err = db.QueryRow("SELECT id, username, password, email, firstName, lastName, dateOfBirth, avatar, nickname, aboutMe, isPrivate, followedBy, isFollowing FROM users WHERE username = $1 OR email = $1", usernameOrEmail).Scan(&u.Id, &u.Username, &u.Password, &u.Email, &u.FirstName, &u.LastName, &u.DateofBirth, &u.Avatar, &u.Nickname, &u.AboutMe, &u.IsPrivate, &followedBy, &isFollowing)

	// Kontrolli kas followedBy on tühi string
	if followedBy == "" {
		u.FollowedBy = []string{} // Set empty array if empty string
	} else {
		// Handle the JSON string conversion to []string
		if err := json.Unmarshal([]byte(followedBy), &u.FollowedBy); err != nil {
			return nil, err
		}
	}

	// Kontrolli kas isFollowing on tühi string
	if isFollowing == "" {
		u.IsFollowing = []string{} // Set empty array if empty string
	} else {
		// Handle the JSON string conversion to []string
		if err := json.Unmarshal([]byte(isFollowing), &u.IsFollowing); err != nil {
			return nil, err
		}
	}
	return &u, err
}

package get

import (
	"main.go/backend/database/create"
	"main.go/backend/helpers"
)

func GetUserPrivacy(username string) (bool, error) {
	db, err := create.ConnectDB()
	helpers.CheckError(err)
	defer db.Close()

	var isPrivate bool
	err = db.QueryRow("SELECT isprivate FROM users WHERE username = ?", username).Scan(&isPrivate)
	return isPrivate, err
}

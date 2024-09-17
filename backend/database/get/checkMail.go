package get

import (
	"database/sql"

	"main.go/backend/database/create"
	"main.go/backend/helpers"
)

func CheckExistingUsernameOrEmail(usernameOrEmail string) bool {
	//returns false if username/email does not exist, true if exists
	db, err := create.ConnectDB()
	helpers.CheckError(err)
	defer db.Close()
	var u string
	err = db.QueryRow("SELECT username FROM users WHERE username = $1 OR email = $1", usernameOrEmail).Scan(&u)
	if err == sql.ErrNoRows {
		return false
	} else if err != nil {
		helpers.CheckError(err)
		return false
	}
	return true
}

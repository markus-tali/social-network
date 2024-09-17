package get

import (
	"main.go/backend/database/create"
	"main.go/backend/helpers"
	"main.go/backend/structs"
)

func GetUserByUsernameOrEmail(usernameOrEmail string) (*structs.User, error) {
	db, err := create.ConnectDB()
	helpers.CheckError(err)
	defer db.Close()
	var u structs.User
	err = db.QueryRow("SELECT id, username, password, email FROM users WHERE username = $1 OR email = $1", usernameOrEmail).Scan(&u.Id, &u.Username, &u.Password, &u.Email)
	return &u, err
}

package get

import (
	"context"

	"main.go/backend/database/create"
	"main.go/backend/helpers"
	"main.go/backend/structs"
)

func GetAllUsers() ([]structs.User, error) {
	db, err := create.ConnectDB()
	helpers.CheckError(err)

	var users []structs.User
	rows, err := db.QueryContext(context.Background(), `SELECT id, username FROM users ORDER BY username ASC;`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {

		var user structs.User

		if err := rows.Scan(&user.Id, &user.Username); err != nil {
			return nil, err
		}
		users = append(users, user)
	}
	return users, err
}

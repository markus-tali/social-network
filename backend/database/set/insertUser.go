package set

import (
	"main.go/backend/database/create"
	"main.go/backend/helpers"
)

func InsertUser(username, firstname, lastname, email, password string) {
	db, err := create.ConnectDB()
	helpers.CheckError(err)
	defer db.Close()
	command := "INSERT INTO users(username, firstname, lastname, email, password) VALUES(?, ?, ?, ?, ?)"
	_, err = db.Exec(command, username, firstname, lastname, email, password)
	helpers.CheckError(err)
}

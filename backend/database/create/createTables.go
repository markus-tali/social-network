package create

import (
	"fmt"

	"main.go/backend/helpers"
)

func CreateUserTable() {
	db, err := ConnectDB()
	helpers.CheckError(err)
	defer db.Close()
	fmt.Println("database created")
	command := `CREATE TABLE IF NOT EXISTS users ( id INTEGER PRIMARY KEY AUTOINCREMENT,
	username TEXT,
	password TEXT,
	age TEXT,
	gender TEXT,
	firstname TEXT,
	lastname TEXT,
	email TEXT
	)`
	_, err = db.Exec(command)
	helpers.CheckError(err)
}

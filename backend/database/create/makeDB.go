package create

import (
	"database/sql"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
	"main.go/backend/helpers"
)

func Create() {
	CreateUserTable()
	fmt.Println("User table created!")

}

// connects to the db
func ConnectDB() (*sql.DB, error) {
	db, err := sql.Open("sqlite3", "./backend/database/database.db")
	helpers.CheckError(err)
	return db, nil
}

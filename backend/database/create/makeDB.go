package create

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
	"main.go/backend/helpers"
)

// connects to the db
func ConnectDB() (*sql.DB, error) {
	db, err := sql.Open("sqlite3", "./backend/database/database.db")
	helpers.CheckError(err)
	return db, nil
}

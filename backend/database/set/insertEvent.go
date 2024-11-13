package set

import (
	"fmt"

	"main.go/backend/database/create"
	"main.go/backend/helpers"
)

func InsertEvent(username, title, description, time string, group_id int) (int, error) {
	db, err := create.ConnectDB()
	helpers.CheckError(err)
	defer db.Close()

	fmt.Println("I made eit to")
	command := "INSERT INTO events(username, group_id, title, description, time) VALUES (?, ?, ?, ?, ?)"
	result, err := db.Exec(command, username, group_id, title, description, time)
	if err != nil {
		helpers.CheckError(err)
		return 0, err
	}

	// Get the ID of the inserted event
	eventID, err := result.LastInsertId()
	if err != nil {
		helpers.CheckError(err)
		return 0, err
	}

	return int(eventID), nil
}

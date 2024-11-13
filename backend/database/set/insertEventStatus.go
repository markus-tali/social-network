package set

import (
	"fmt"

	"main.go/backend/database/create"
	"main.go/backend/helpers"
)

func InsertEventStatus(eventId int, username, status string) error {
	db, err := create.ConnectDB()
	helpers.CheckError(err)
	defer db.Close()

	fmt.Println("Updating event status for", username, "on event", eventId, "to", status)

	var count int
	checkQuery := `SELECT COUNT(*) FROM eventsStatus WHERE eventId = $1 AND username = $2`
	err = db.QueryRow(checkQuery, eventId, username).Scan(&count)
	if err != nil {
		helpers.CheckError(err)
		return err
	}

	if count > 0 {
		query := `UPDATE eventsStatus SET pending = $1 WHERE eventId = $2 AND username = $3`
		_, err = db.Exec(query, status, eventId, username)
	} else {
		query := `INSERT INTO eventsStatus (eventId, username, pending) VALUES ($1, $2, $3)`
		_, err = db.Exec(query, eventId, username, status)
	}

	helpers.CheckError(err)

	return err
}

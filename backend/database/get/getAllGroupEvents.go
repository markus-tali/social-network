package get

import (
	"main.go/backend/database/create"
	"main.go/backend/helpers"
	"main.go/backend/structs"
)

func GetAllGroupEvents(group_id int) ([]structs.Event, error) {
	db, err := create.ConnectDB()
	helpers.CheckError(err)
	defer db.Close()

	rows, err := db.Query(`SELECT id, username, title, description, time, group_id FROM events WHERE group_id = ? ORDER BY time`, group_id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []structs.Event

	for rows.Next() {
		var event structs.Event
		if err := rows.Scan(&event.Id, &event.Username, &event.Title, &event.Description, &event.Time, &event.Group_id); err != nil {
			return nil, err
		}
		events = append(events, event)
	}
	return events, nil
}

package get

import (
	"main.go/backend/database/create"
	"main.go/backend/helpers"
	"main.go/backend/structs"
)

func GetAllGroupMessages(GroupId int) ([]structs.SMessage, error) {
	db, err := create.ConnectDB()
	helpers.CheckError(err)
	defer db.Close()
	var msg structs.SMessage

	query := `SELECT fromUser, message, group_id, date, type FROM messages WHERE type = "groupMessage" AND group_id = ? ORDER BY date ASC, id ASC`

	rows, err := db.Query(query, GroupId)
	helpers.CheckError(err)
	defer rows.Close()

	var messages []structs.SMessage

	for rows.Next() {
		err := rows.Scan(&msg.From, &msg.Message, &msg.GroupId, &msg.Date, &msg.Type)
		if err != nil {
			return nil, err
		}
		messages = append(messages, msg)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return messages, nil
}

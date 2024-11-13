package get

import (
	"main.go/backend/database/create"
	"main.go/backend/helpers"
	"main.go/backend/structs"
)

func GetAllMessages(username, ToUser string) ([]structs.SMessage, error) {
	db, err := create.ConnectDB()
	helpers.CheckError(err)
	defer db.Close()
	var msg structs.SMessage
	query := `
	 SELECT fromUser, date, message, toUser 
        FROM messages 
        WHERE (fromUser = ? AND toUser = ?) OR (fromUser = ? AND toUser = ?) 
        ORDER BY date ASC, id ASC
	`
	rows, err := db.Query(query, username, ToUser, ToUser, username)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var messages []structs.SMessage
	for rows.Next() {
		err := rows.Scan(&msg.From, &msg.Date, &msg.Message, &msg.To)
		if err != nil {
			return nil, err
		}
		msg.Type = "message"
		messages = append(messages, msg)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return messages, nil
}

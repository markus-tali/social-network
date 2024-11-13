package get

import (
	"main.go/backend/database/create"
	"main.go/backend/helpers"
	"main.go/backend/structs"
)

func GetAllNotification(username string) ([]structs.SMessage, error) {
	db, err := create.ConnectDB()
	helpers.CheckError(err)
	defer db.Close()

	var msg structs.SMessage

	query := ` 
	SELECT id, follower_username, followed_username, message, group_id, notification_type
	FROM notifications
	WHERE (followed_username = ?)
	ORDER BY id ASC 
	`

	rows, err := db.Query(query, username)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var notifications []structs.SMessage
	for rows.Next() {
		err := rows.Scan(&msg.NotificationId, &msg.From, &msg.To, &msg.Message, &msg.GroupId, &msg.Type)
		if err != nil {
			return nil, err
		}
		notifications = append(notifications, msg)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return notifications, nil
}

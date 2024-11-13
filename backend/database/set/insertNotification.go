package set

import (
	"main.go/backend/database/create"
)

func InsertNotification(notificationType, fromUser, toUser string, groupId int) error {
	db, err := create.ConnectDB()
	if err != nil {
		return err
	}
	defer db.Close()

	// Insert notification with optional groupId
	_, err = db.Exec(`INSERT INTO notifications (follower_username, followed_username, notification_type, group_id) VALUES (?, ?, ?, ?)`,
		fromUser, toUser, notificationType, groupId)
	return err
}

package get

import (
	"main.go/backend/database/create"
	"main.go/backend/helpers"
)

func GetNotification(username string) {
	db, err := create.ConnectDB()
	helpers.CheckError(err)
	defer db.Close()

}

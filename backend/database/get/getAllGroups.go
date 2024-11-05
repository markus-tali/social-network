package get

import (
	"fmt"

	"main.go/backend/database/create"
	"main.go/backend/helpers"
	"main.go/backend/structs"
)

func GetAllGroups() ([]structs.Group, error) {
	db, err := create.ConnectDB()
	helpers.CheckError(err)
	defer db.Close()

	rows, err := db.Query("SELECT id, title, description, creator FROM groups")
	if err != nil {
		fmt.Println("Hey it is getuserGroup:", err)
	}
	defer rows.Close()

	var groups []structs.Group
	for rows.Next() {
		var group structs.Group
		if err := rows.Scan(&group.Id, &group.Title, &group.Description, &group.Creator); err != nil {
			helpers.CheckError(err)
		}
		groups = append(groups, group)
	}

	return groups, err
}

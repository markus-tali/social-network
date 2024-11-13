package get

import (
	"main.go/backend/database/create"
	"main.go/backend/structs"
)

func GetGroupMembers(GroupId int) ([]structs.GroupMembers, error) {
	db, err := create.ConnectDB()
	if err != nil {
		return nil, err
	}
	defer db.Close()

	rows, err := db.Query(`SELECT username FROM group_members WHERE group_id = ? AND status = 'accepted'`, GroupId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var group_members []structs.GroupMembers

	for rows.Next() {
		var group_member structs.GroupMembers
		if err := rows.Scan(&group_member.Username); err != nil {
			return nil, err
		}
		group_members = append(group_members, group_member)
	}
	return group_members, nil
}

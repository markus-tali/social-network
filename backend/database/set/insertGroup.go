package set

import "main.go/backend/database/create"

func CreateGroup(creator, title, description string) (int, error) {

	db, _ := create.ConnectDB()

	defer db.Close()

	res, err := db.Exec("INSERT INTO groups (creator, title, description) VALUES (?, ?, ?)", creator, title, description)
	if err != nil {
		return 0, err
	}
	groupID, err := res.LastInsertId()
	return int(groupID), err
}

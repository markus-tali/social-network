package update

import (
	"fmt"

	"main.go/backend/database/create"
	"main.go/backend/helpers"
)

func UpdateUserPrivacy(username string, isPrivate bool) {
	db, err := create.ConnectDB()
	helpers.CheckError(err)
	defer db.Close()

	// 1. Kontrolli praegust privaatsuse seadet
	var currentPrivacy int
	query := `SELECT isPrivate FROM users WHERE username = ?`
	err = db.QueryRow(query, username).Scan(&currentPrivacy)
	if err != nil {
		helpers.CheckError(err)
		return
	}

	fmt.Println("current privacy is: ", currentPrivacy)

	newPrivacy := 0
	if currentPrivacy == 0 {
		newPrivacy = 1
	}

	// Suhtel Update query
	query = `UPDATE users SET isPrivate = ? WHERE username = ?`

	// Värskenduse täitmine
	res, err := db.Exec(query, newPrivacy, username)
	helpers.CheckError(err)

	rowsAffected, err := res.RowsAffected()
	helpers.CheckError(err)
	if rowsAffected == 0 {
		fmt.Printf("No user with username '%s' found.\n", username)
	} else {
		// fmt.Printf("Privacy setting updated for user %s to %d\n", username, newPrivacy)
	}

}

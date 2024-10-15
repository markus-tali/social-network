package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"main.go/backend/database/get"
	"main.go/backend/helpers"
	"main.go/backend/structs"
)

func GetUsersHandler(w http.ResponseWriter, r *http.Request) {
	CorsEnabler(w, r)
	if r.Method == "OPTIONS" {
		return
	}

	type ResponseData struct {
		Username string         `json:"username"`
		Users    []structs.User `json:"users"`
	}

	_, username, err := GetCookies(w, r)

	helpers.CheckError(err)

	users, err := get.GetAllUsers()

	responseData := ResponseData{
		Username: username,
		Users:    users,
	}

	fmt.Println("My username is: ", username)
	helpers.CheckError(err)

	jsonUsers, err := json.Marshal(responseData)
	if err != nil {
		http.Error(w, "Error marshaling posts to JSON", http.StatusInternalServerError)
		return
	}

	w.Write(jsonUsers)
}
